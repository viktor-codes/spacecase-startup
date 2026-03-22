import logging
import sentry_sdk
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.starlette import StarletteIntegration
from urllib.parse import urlparse

from app.api import api_router
from app.core.config import get_settings
from app.infrastructure.db.init_db import init_db


def _www_peer_origins(origin: str) -> list[str]:
    """Also allow apex <-> www so CORS matches how users open the site."""
    p = urlparse(origin)
    h = p.hostname
    if not h or h in ("localhost", "127.0.0.1") or h.endswith(".vercel.app"):
        return []
    if h.startswith("www."):
        rest = h.removeprefix("www.")
        if rest:
            return [f"{p.scheme}://{rest}"]
        return []
    return [f"{p.scheme}://www.{h}"]


settings = get_settings()
_log = logging.getLogger("uvicorn.error")

_cors_origins: list[str] = []
for _o in settings.cors_allow_origins.split(","):
    _o = _o.strip()
    if _o and _o not in _cors_origins:
        _cors_origins.append(_o)
_fb = urlparse(settings.frontend_base_url.strip())
if _fb.scheme and _fb.netloc:
    _origin = f"{_fb.scheme}://{_fb.netloc}"
    if _fb.hostname not in ("localhost", "127.0.0.1"):
        for _candidate in (_origin, *_www_peer_origins(_origin)):
            if _candidate not in _cors_origins:
                _cors_origins.append(_candidate)

_cors_regex = settings.cors_allow_origin_regex.strip() or None

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

if _cors_origins or _cors_regex:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=_cors_origins,
        allow_origin_regex=_cors_regex,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    _log.info(
        "CORS allow_origins=%s allow_origin_regex=%s",
        _cors_origins,
        _cors_regex,
    )
else:
    # Local development: LAN + localhost (set FRONTEND_BASE_URL / CORS_* in production).
    _dev_regex = (
        r"https?://(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|172\.20\.10\.\d+)(:\d+)?"
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[],
        allow_origin_regex=_dev_regex,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    _log.info("CORS using dev LAN regex (set FRONTEND_BASE_URL to your real site URL)")


@app.get("/", tags=["meta"])
def root() -> dict[str, str]:
    """API lives under /v1; use /health for uptime checks."""
    return {"service": settings.app_name, "health": "/health"}


@app.head("/", tags=["meta"])
def root_head() -> Response:
    return Response()


@app.get("/health", tags=["meta"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.head("/health", tags=["meta"])
def health_head() -> Response:
    return Response()


app.include_router(api_router)


@app.on_event("startup")
async def _init_startup() -> None:
    # MVP: create tables automatically on startup.
    # Later we can migrate to Alembic once schemas stabilize.
    await init_db()

