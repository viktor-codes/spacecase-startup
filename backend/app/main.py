import sentry_sdk
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.starlette import StarletteIntegration

from app.api import api_router
from app.core.config import get_settings
from app.infrastructure.db.init_db import init_db


settings = get_settings()

_cors_origins = [
    o.strip()
    for o in settings.cors_allow_origins.split(",")
    if o.strip()
]

if settings.sentry_dsn:
    sentry_sdk.init(
        dsn=settings.sentry_dsn,
        send_default_pii=False,
        traces_sample_rate=0.1,
        integrations=[
            StarletteIntegration(),
            FastApiIntegration(),
        ],
    )

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
)

if _cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=_cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    # Local development: LAN + localhost (set CORS_ALLOW_ORIGINS in production).
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[],
        allow_origin_regex=r"https?://(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|172\.20\.10\.\d+)(:\d+)?",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.get("/", tags=["meta"])
def root() -> dict[str, str]:
    """API lives under /v1; use /health for uptime checks."""
    return {"service": settings.app_name, "health": "/health"}


@app.get("/health", tags=["meta"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(api_router)


@app.on_event("startup")
async def _init_startup() -> None:
    # MVP: create tables automatically on startup.
    # Later we can migrate to Alembic once schemas stabilize.
    await init_db()

