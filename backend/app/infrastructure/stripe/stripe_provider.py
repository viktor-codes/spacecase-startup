import asyncio
from dataclasses import dataclass
from typing import Any

import stripe

from app.core.config import get_settings


@dataclass(frozen=True, slots=True)
class StripeCheckoutSessionResult:
    id: str
    url: str


class StripeProvider:
    def __init__(self) -> None:
        settings = get_settings()
        if not settings.stripe_secret_key:
            raise RuntimeError(
                "STRIPE_SECRET_KEY is not configured (env: STRIPE_SECRET_KEY)."
            )

        stripe.api_key = settings.stripe_secret_key
        self._webhook_secret = settings.stripe_webhook_secret

    async def create_checkout_session(
        self,
        *,
        price_id: str,
        customer_email: str,
        success_url: str,
        cancel_url: str,
        metadata: dict[str, str],
    ) -> StripeCheckoutSessionResult:
        # stripe-python is sync; run in thread to avoid blocking event loop.
        def _create() -> stripe.checkout.Session:
            session = stripe.checkout.Session.create(
                mode="payment",
                line_items=[{"price": price_id, "quantity": 1}],
                customer_email=customer_email,
                success_url=success_url,
                cancel_url=cancel_url,
                metadata=metadata,
            )
            return session

        session = await asyncio.to_thread(_create)

        # For Checkout Sessions URL is available in client_redirect (Stripe hosted UI).
        if not session.url:
            raise RuntimeError("Stripe Checkout session has no URL.")

        return StripeCheckoutSessionResult(id=session.id, url=session.url)

    async def get_price_amount_cents_and_currency(
        self, price_id: str
    ) -> tuple[int, str]:
        def _retrieve() -> stripe.Price:
            return stripe.Price.retrieve(price_id)

        price = await asyncio.to_thread(_retrieve)
        if price.unit_amount is None:
            raise RuntimeError(f"Stripe Price {price_id} has no unit_amount.")
        currency = str(price.currency).upper()
        return int(price.unit_amount), currency

    async def verify_webhook_event(
        self, *, payload: bytes, signature: str
    ) -> dict[str, Any]:
        if not self._webhook_secret:
            raise RuntimeError(
                "STRIPE_WEBHOOK_SECRET is not configured (env: STRIPE_WEBHOOK_SECRET)."
            )

        def _construct() -> stripe.Event:
            return stripe.Webhook.construct_event(
                payload, signature, self._webhook_secret
            )

        event = await asyncio.to_thread(_construct)
        # Keep as plain dict to decouple from stripe types in application layer.
        return event.to_dict()

