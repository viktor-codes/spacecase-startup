from datetime import date

import httpx

from app.core.config import get_settings
from app.domain.apod.entities import ApodImage
from app.domain.apod.errors import ApodExternalError, ApodNotFound
from app.domain.apod.ports import ApodProvider


class NasaApodClient(ApodProvider):
    async def get_apod(self, target_date: date) -> ApodImage:
        settings = get_settings()
        params = {
            "api_key": settings.nasa_api_key,
            "date": target_date.isoformat(),
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    settings.nasa_api_url,
                    params=params,
                    timeout=10.0,
                )
        except httpx.HTTPError as exc:  # pragma: no cover - network failure path
            raise ApodExternalError("Error calling NASA APOD API") from exc

        if response.status_code == 404:
            raise ApodNotFound(f"APOD not found for date {target_date.isoformat()}")

        if response.status_code != 200:
            raise ApodExternalError(
                f"Unexpected status from NASA APOD API: {response.status_code}"
            )

        data = response.json()

        print("NASA APOD URL:", data.get("hdurl") or data.get("url", ""))

        return ApodImage(
            date=target_date,
            title=data.get("title", ""),
            explanation=data.get("explanation", ""),
            media_type=data.get("media_type", ""),
            url=data.get("url", ""),
            hdurl=data.get("hdurl"),
            copyright=data.get("copyright"),
        )


def get_nasa_apod_client() -> NasaApodClient:
    return NasaApodClient()

