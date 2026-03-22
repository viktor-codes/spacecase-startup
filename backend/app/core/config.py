from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = Field(default="Spacecase Backend", alias="APP_NAME")
    debug: bool = Field(default=False, alias="DEBUG")

    nasa_api_key: str = Field(
        default="DEMO_KEY",
        alias="NASA_API_KEY",
        description="NASA API key (DEMO_KEY is rate-limited, use real key in production).",
    )
    nasa_api_url: str = Field(
        default="https://api.nasa.gov/planetary/apod",
        alias="NASA_APOD_URL",
        description="Base URL for NASA APOD endpoint.",
    )

    # Stripe (Checkout + Webhook)
    stripe_secret_key: str = Field(default="", alias="STRIPE_SECRET_KEY")
    stripe_webhook_secret: str = Field(
        default="", alias="STRIPE_WEBHOOK_SECRET"
    )

    stripe_price_id_standard: str = Field(
        default="", alias="STRIPE_PRICE_ID_STANDARD"
    )
    stripe_price_id_express: str = Field(
        default="", alias="STRIPE_PRICE_ID_EXPRESS"
    )

    # Used to build success_url/cancel_url for Stripe Checkout
    frontend_base_url: str = Field(
        default="http://localhost:3000", alias="FRONTEND_BASE_URL"
    )

    # Comma-separated origins for CORS (e.g. https://app.example.com). If empty,
    # dev regex from main.py is used (localhost / LAN).
    cors_allow_origins: str = Field(default="", alias="CORS_ALLOW_ORIGINS")

    # Persistence (MVP)
    database_url: str = Field(
        default="sqlite+aiosqlite:///./spacecase.db",
        alias="DATABASE_URL",
    )

    sentry_dsn: str = Field(
        default="",
        alias="SENTRY_DSN",
        description="Optional Sentry DSN for error monitoring.",
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()

