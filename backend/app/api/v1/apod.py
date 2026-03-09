from datetime import date, datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel

from app.application.apod.services import ApodService
from app.domain.apod.errors import ApodExternalError, ApodNotFound
from app.infrastructure.nasa.client import get_nasa_apod_client


router = APIRouter()


class ApodResponse(BaseModel):
    date: date
    title: str
    explanation: str
    media_type: str
    url: str
    hdurl: str | None = None
    copyright: str | None = None


def get_apod_service() -> ApodService:
    client = get_nasa_apod_client()
    return ApodService(apod_provider=client)


@router.get("", response_model=ApodResponse)
async def get_apod(
    apod_date: date | None = Query(
        default=None,
        alias="date",
        description="Date in YYYY-MM-DD format. Defaults to today if omitted.",
    ),
    service: ApodService = Depends(get_apod_service),
) -> ApodResponse:
    target_date = apod_date or datetime.utcnow().date()

    try:
        apod = await service.get_apod_for_date(target_date)
    except ApodNotFound as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except ApodExternalError as exc:
        raise HTTPException(status_code=502, detail=str(exc))

    return ApodResponse(
        date=apod.date,
        title=apod.title,
        explanation=apod.explanation,
        media_type=apod.media_type,
        url=apod.url,
        hdurl=apod.hdurl,
        copyright=apod.copyright,
    )

