from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import api_router
from app.core.config import get_settings
from app.infrastructure.db.init_db import init_db


settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
)

# For early development we allow localhost frontends.
# Later we can tighten this list based on deployed origins.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        # "http://localhost:3000",
        # "http://127.0.0.1:3000",
        # "http://172.20.10.2:3000",
    ],
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|172\.20\.10\.\d+)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.on_event("startup")
async def _init_startup() -> None:
    # MVP: create tables automatically on startup.
    # Later we can migrate to Alembic once schemas stabilize.
    await init_db()


@app.get("/health", tags=["meta"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}


