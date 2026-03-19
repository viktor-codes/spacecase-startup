from abc import ABC, abstractmethod
from collections.abc import Awaitable, Callable
from datetime import datetime, date

from app.domain.orders.entities import ApodSnapshot, Order


class OrderRepository(ABC):
    @abstractmethod
    async def create_pending_payment(
        self, order: Order
    ) -> Order:  # pragma: no cover
        """Persist new order in pending_payment status."""

    @abstractmethod
    async def get_by_id(self, order_id: str) -> Order | None:  # pragma: no cover
        """Fetch order by id."""

    @abstractmethod
    async def set_stripe_checkout_session_id(
        self, order_id: str, stripe_checkout_session_id: str
    ) -> None:  # pragma: no cover
        """Persist Stripe Checkout Session id without changing payment status."""

    @abstractmethod
    async def mark_paid(
        self, order_id: str, stripe_checkout_session_id: str
    ) -> None:  # pragma: no cover
        """Mark order as paid."""

