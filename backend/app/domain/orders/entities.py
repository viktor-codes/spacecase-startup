from dataclasses import dataclass
from datetime import date, datetime


@dataclass(frozen=True, slots=True)
class ApodSnapshot:
    apod_date: date
    apod_title: str
    apod_media_type: str
    apod_url: str
    apod_hdurl: str | None


@dataclass(slots=True)
class Order:
    id: str
    created_at: datetime
    updated_at: datetime
    status: str

    snapshot: ApodSnapshot

    device_model: str
    shipping_option: str
    currency: str
    amount_cents: int

    contact_email: str
    contact_full_name: str
    contact_phone: str

    shipping_line1: str
    shipping_line2: str | None
    shipping_city: str
    shipping_postal_code: str  # Eircode
    shipping_country: str  # IE

    stripe_checkout_session_id: str | None

    # SHA-256 hex of secret shown only in Stripe success redirect URL
    view_token_hash: str | None = None

