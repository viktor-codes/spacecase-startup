import uuid
from datetime import date
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel, EmailStr, Field

from app.application.orders.services import (
    ContactInput,
    CreateStripeCheckoutSessionService,
    GetOrderService,
    HandleStripeCheckoutCompletedService,
    ShippingAddressInput,
)
from app.core.config import get_settings
from app.domain.orders.ports import OrderRepository
from app.infrastructure.db.order_repository import SqlAlchemyOrderRepository
from app.infrastructure.db.session import get_async_session
from app.infrastructure.stripe.stripe_provider import StripeProvider


router = APIRouter()


class ContactIn(BaseModel):
    email: EmailStr
    fullName: str = Field(min_length=2, max_length=256)
    phone: str = Field(min_length=5, max_length=64)


class ShippingAddressIn(BaseModel):
    line1: str = Field(min_length=2, max_length=256)
    line2: str | None = Field(default=None, max_length=256)
    city: str = Field(min_length=2, max_length=128)
    eirCode: str = Field(min_length=3, max_length=32)


class CreateStripeCheckoutSessionRequest(BaseModel):
    apodDate: date
    deviceModel: str = Field(min_length=2, max_length=128)
    shippingOption: Literal["standard", "express"]
    contact: ContactIn
    shippingAddress: ShippingAddressIn


class CreateStripeCheckoutSessionResponse(BaseModel):
    checkoutUrl: str
    orderId: str


class OrderResponse(BaseModel):
    orderId: str
    status: str
    apodDate: str
    apodTitle: str
    apodUrl: str
    apodHdurl: str | None
    deviceModel: str
    shippingOption: str
    amountEur: float
    currency: str


def get_order_repository(
    session=Depends(get_async_session),
) -> OrderRepository:
    return SqlAlchemyOrderRepository(session)


@router.post(
    "/orders/stripe-checkout-session",
    response_model=CreateStripeCheckoutSessionResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_stripe_checkout_session(
    payload: CreateStripeCheckoutSessionRequest,
    order_repository: OrderRepository = Depends(get_order_repository),
) -> CreateStripeCheckoutSessionResponse:
    settings = get_settings()
    stripe_provider = StripeProvider()

    contact = ContactInput(
        email=str(payload.contact.email),
        full_name=payload.contact.fullName,
        phone=payload.contact.phone,
    )
    address = ShippingAddressInput(
        line1=payload.shippingAddress.line1,
        line2=payload.shippingAddress.line2,
        city=payload.shippingAddress.city,
        eir_code=payload.shippingAddress.eirCode,
        country="IE",
    )

    order_id = str(uuid.uuid4())
    success_url = (
        f"{settings.frontend_base_url}/order/success?orderId={order_id}"
    )
    cancel_url = (
        f"{settings.frontend_base_url}/configure/upload?date={payload.apodDate.isoformat()}"
    )

    service = CreateStripeCheckoutSessionService(
        order_repository=order_repository,
        stripe_provider=stripe_provider,
        settings=settings,
    )

    try:
        checkout_url, returned_order_id = await service.execute(
            apod_date=payload.apodDate,
            device_model=payload.deviceModel,
            shipping_option=payload.shippingOption,
            contact=contact,
            address=address,
            success_url=success_url,
            cancel_url=cancel_url,
            order_id=order_id,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return CreateStripeCheckoutSessionResponse(
        checkoutUrl=checkout_url, orderId=returned_order_id
    )


@router.post("/stripe/webhook", status_code=status.HTTP_200_OK)
async def stripe_webhook(
    request: Request,
    order_repository: OrderRepository = Depends(get_order_repository),
) -> dict[str, str]:
    stripe_provider = StripeProvider()
    payload = await request.body()
    signature = request.headers.get("stripe-signature") or ""
    if not signature:
        raise HTTPException(status_code=400, detail="Missing stripe-signature header")

    event = await stripe_provider.verify_webhook_event(
        payload=payload, signature=signature
    )

    event_type = event.get("type")
    if event_type == "checkout.session.completed":
        obj = event.get("data", {}).get("object", {})
        stripe_session_id = obj.get("id", "")
        metadata = obj.get("metadata", {}) or {}
        order_id = metadata.get("order_id", "")

        if order_id and stripe_session_id:
            service = HandleStripeCheckoutCompletedService(
                order_repository=order_repository,
                stripe_provider=stripe_provider,
            )
            await service.execute(
                order_id=order_id, stripe_session_id=stripe_session_id
            )

    # Idempotency: return 200 even if order not found.
    return {"status": "ok"}


@router.get("/orders/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: str,
    order_repository: OrderRepository = Depends(get_order_repository),
) -> OrderResponse:
    service = GetOrderService(order_repository=order_repository)
    order = await service.execute(order_id=order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    amount_eur = order.amount_cents / 100.0
    return OrderResponse(
        orderId=order.id,
        status=order.status,
        apodDate=order.snapshot.apod_date.isoformat(),
        apodTitle=order.snapshot.apod_title,
        apodUrl=order.snapshot.apod_url,
        apodHdurl=order.snapshot.apod_hdurl,
        deviceModel=order.device_model,
        shippingOption=order.shipping_option,
        amountEur=amount_eur,
        currency=order.currency,
    )

