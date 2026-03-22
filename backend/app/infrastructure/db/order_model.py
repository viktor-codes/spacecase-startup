from datetime import date, datetime

from sqlalchemy import Date, DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.infrastructure.db.base import Base


class OrderModel(Base):
    __tablename__ = "orders"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    status: Mapped[str] = mapped_column(String(64), nullable=False)

    # NASA APOD snapshot (frozen at order creation)
    apod_date: Mapped[date] = mapped_column(Date, nullable=False)
    apod_title: Mapped[str] = mapped_column(Text, nullable=False)
    apod_media_type: Mapped[str] = mapped_column(String(32), nullable=False)
    apod_url: Mapped[str] = mapped_column(Text, nullable=False)
    apod_hdurl: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Product config
    device_model: Mapped[str] = mapped_column(String(128), nullable=False)
    shipping_option: Mapped[str] = mapped_column(String(32), nullable=False)
    currency: Mapped[str] = mapped_column(String(8), nullable=False)
    amount_cents: Mapped[int] = mapped_column(Integer, nullable=False)

    # Contact + shipping (collected before payment for MVP simplicity)
    contact_email: Mapped[str] = mapped_column(String(256), nullable=False)
    contact_full_name: Mapped[str] = mapped_column(String(256), nullable=False)
    contact_phone: Mapped[str] = mapped_column(String(64), nullable=False)

    shipping_line1: Mapped[str] = mapped_column(String(256), nullable=False)
    shipping_line2: Mapped[str | None] = mapped_column(
        String(256), nullable=True
    )
    shipping_city: Mapped[str] = mapped_column(String(128), nullable=False)
    shipping_postal_code: Mapped[str] = mapped_column(
        String(32), nullable=False
    )  # Eircode
    shipping_country: Mapped[str] = mapped_column(String(2), nullable=False)

    # Stripe fields
    stripe_checkout_session_id: Mapped[str | None] = mapped_column(
        String(128), nullable=True
    )

    view_token_hash: Mapped[str | None] = mapped_column(String(64), nullable=True)

