from fastapi import APIRouter

from app.api.v1.apod import router as apod_router
from app.api.v1.orders import router as orders_router


v1_router = APIRouter()
v1_router.include_router(apod_router, prefix="/apod", tags=["apod"])
v1_router.include_router(orders_router, tags=["orders"])

__all__ = ["v1_router"]

