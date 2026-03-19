from datetime import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.orders.entities import ApodSnapshot, Order
from app.domain.orders.ports import OrderRepository
from app.infrastructure.db.order_model import OrderModel


class SqlAlchemyOrderRepository(OrderRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def create_pending_payment(
        self, order: Order
    ) -> Order:
        model = OrderModel(
            id=order.id,
            status=order.status,
            apod_date=order.snapshot.apod_date,
            apod_title=order.snapshot.apod_title,
            apod_media_type=order.snapshot.apod_media_type,
            apod_url=order.snapshot.apod_url,
            apod_hdurl=order.snapshot.apod_hdurl,
            device_model=order.device_model,
            shipping_option=order.shipping_option,
            currency=order.currency,
            amount_cents=order.amount_cents,
            contact_email=order.contact_email,
            contact_full_name=order.contact_full_name,
            contact_phone=order.contact_phone,
            shipping_line1=order.shipping_line1,
            shipping_line2=order.shipping_line2,
            shipping_city=order.shipping_city,
            shipping_postal_code=order.shipping_postal_code,
            shipping_country=order.shipping_country,
            stripe_checkout_session_id=order.stripe_checkout_session_id,
            created_at=order.created_at,
            updated_at=order.updated_at,
        )
        self._session.add(model)
        await self._session.commit()
        return order

    async def get_by_id(
        self, order_id: str
    ) -> Order | None:
        stmt = select(OrderModel).where(OrderModel.id == order_id)
        result = await self._session.execute(stmt)
        model = result.scalar_one_or_none()
        if not model:
            return None

        snapshot = ApodSnapshot(
            apod_date=model.apod_date,
            apod_title=model.apod_title,
            apod_media_type=model.apod_media_type,
            apod_url=model.apod_url,
            apod_hdurl=model.apod_hdurl,
        )
        return Order(
            id=model.id,
            created_at=model.created_at,
            updated_at=model.updated_at,
            status=model.status,
            snapshot=snapshot,
            device_model=model.device_model,
            shipping_option=model.shipping_option,
            currency=model.currency,
            amount_cents=model.amount_cents,
            contact_email=model.contact_email,
            contact_full_name=model.contact_full_name,
            contact_phone=model.contact_phone,
            shipping_line1=model.shipping_line1,
            shipping_line2=model.shipping_line2,
            shipping_city=model.shipping_city,
            shipping_postal_code=model.shipping_postal_code,
            shipping_country=model.shipping_country,
            stripe_checkout_session_id=model.stripe_checkout_session_id,
        )

    async def set_stripe_checkout_session_id(
        self, order_id: str, stripe_checkout_session_id: str
    ) -> None:
        stmt = select(OrderModel).where(OrderModel.id == order_id)
        result = await self._session.execute(stmt)
        model = result.scalar_one_or_none()
        if not model:
            return

        model.stripe_checkout_session_id = stripe_checkout_session_id
        model.updated_at = datetime.utcnow()
        await self._session.commit()

    async def mark_paid(
        self, order_id: str, stripe_checkout_session_id: str
    ) -> None:
        stmt = select(OrderModel).where(OrderModel.id == order_id)
        result = await self._session.execute(stmt)
        model = result.scalar_one_or_none()
        if not model:
            return

        model.status = "paid"
        model.stripe_checkout_session_id = stripe_checkout_session_id
        model.updated_at = datetime.utcnow()
        await self._session.commit()

