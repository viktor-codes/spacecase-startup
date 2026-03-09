from fastapi import APIRouter

from app.api.v1.apod import router as apod_router


v1_router = APIRouter()
v1_router.include_router(apod_router, prefix="/apod", tags=["apod"])

__all__ = ["v1_router"]

