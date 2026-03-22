import uuid
from dataclasses import dataclass
from datetime import date, datetime
from urllib.parse import quote

from app.core.config import get_settings
from app.application.apod.services import ApodService
from app.domain.orders.entities import ApodSnapshot, Order
from app.domain.orders.ports import OrderRepository
from app.infrastructure.nasa.client import get_nasa_apod_client
from app.infrastructure.security.order_view_token import (
    generate_view_token_pair,
    verify_view_token,
)
from app.infrastructure.stripe.stripe_provider import StripeProvider


class InvalidShippingOptionError(ValueError):
    pass


@dataclass(frozen=True, slots=True)
class ContactInput:
    email: str
    full_name: str
    phone: str


@dataclass(frozen=True, slots=True)
class ShippingAddressInput:
    line1: str
    line2: str | None
    city: str
    eir_code: str
    country: str  # "IE"


class CreateStripeCheckoutSessionService:
    def __init__(
        self,
        *,
        order_repository: OrderRepository,
        stripe_provider: StripeProvider,
        settings= None,
    ) -> None:
        self._order_repository = order_repository
        self._stripe_provider = stripe_provider
        self._apod_service = ApodService(apod_provider=get_nasa_apod_client())
        self._settings = settings or get_settings()

    async def execute(
        self,
        *,
        apod_date: date,
        device_model: str,
        shipping_option: str,
        contact: ContactInput,
        address: ShippingAddressInput,
        cancel_url: str,
        order_id: str | None = None,
    ) -> tuple[str, str]:
        # 1) Validate shipping option
        if shipping_option == "standard":
            price_id = self._settings.stripe_price_id_standard
        elif shipping_option == "express":
            price_id = self._settings.stripe_price_id_express
        else:
            raise InvalidShippingOptionError(shipping_option)

        if not price_id:
            raise RuntimeError(
                f"Stripe Price ID is not configured for shipping_option='{shipping_option}'."
            )

        # 2) Re-fetch APOD snapshot on backend (truth source)
        apod = await self._apod_service.get_apod_for_date(apod_date)
        if apod.media_type != "image" or not apod.url:
            raise ValueError(
                "NASA APOD for this date is not an image. Please choose another date."
            )

        # 3) Create Order in DB
        now = datetime.utcnow()
        created_order_id = order_id or str(uuid.uuid4())
        snapshot = ApodSnapshot(
            apod_date=apod.date,
            apod_title=apod.title,
            apod_media_type=apod.media_type,
            apod_url=apod.url,
            apod_hdurl=apod.hdurl,
        )

        unit_amount_cents, currency = (
            await self._stripe_provider.get_price_amount_cents_and_currency(
                price_id=price_id
            )
        )

        view_token, view_token_hash = generate_view_token_pair()
        base = self._settings.frontend_base_url.rstrip("/")
        success_url = (
            f"{base}/order/success?orderId={created_order_id}"
            f"&token={quote(view_token, safe='')}"
        )

        order = Order(
            id=created_order_id,
            created_at=now,
            updated_at=now,
            status="pending_payment",
            snapshot=snapshot,
            device_model=device_model,
            shipping_option=shipping_option,
            currency=currency,
            amount_cents=unit_amount_cents,
            contact_email=contact.email,
            contact_full_name=contact.full_name,
            contact_phone=contact.phone,
            shipping_line1=address.line1,
            shipping_line2=address.line2,
            shipping_city=address.city,
            shipping_postal_code=address.eir_code,
            shipping_country=address.country,
            stripe_checkout_session_id=None,
            view_token_hash=view_token_hash,
        )

        order = await self._order_repository.create_pending_payment(order)

        # 4) Create Stripe Checkout Session
        checkout_metadata = {"order_id": order.id}
        session = await self._stripe_provider.create_checkout_session(
            price_id=price_id,
            customer_email=contact.email,
            success_url=success_url,
            cancel_url=cancel_url,
            metadata=checkout_metadata,
        )

        # 5) Persist stripe session id (still pending_payment)
        await self._order_repository.set_stripe_checkout_session_id(
            order.id, session.id
        )

        return session.url, order.id


class HandleStripeCheckoutCompletedService:
    def __init__(
        self,
        *,
        order_repository: OrderRepository,
        stripe_provider: StripeProvider,
    ) -> None:
        self._order_repository = order_repository
        self._stripe_provider = stripe_provider

    async def execute(self, *, order_id: str, stripe_session_id: str) -> None:
        await self._order_repository.mark_paid(
            order_id, stripe_checkout_session_id=stripe_session_id
        )


class GetOrderService:
    def __init__(self, *, order_repository: OrderRepository) -> None:
        self._order_repository = order_repository

    async def execute(
        self, *, order_id: str, view_token: str | None
    ) -> Order | None:
        order = await self._order_repository.get_by_id(order_id)
        if not order:
            return None
        if not verify_view_token(order.view_token_hash, view_token):
            return None
        return order

