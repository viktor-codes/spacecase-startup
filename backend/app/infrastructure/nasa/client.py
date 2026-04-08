import asyncio
import logging
from datetime import date

import httpx

from app.core.config import get_settings
from app.domain.apod.entities import ApodImage
from app.domain.apod.errors import ApodExternalError, ApodNotFound
from app.domain.apod.ports import ApodProvider

logger = logging.getLogger(__name__)

# NASA may return 429 (rate limit) or 503; short backoff + Retry-After helps bursts.
_APOD_MAX_ATTEMPTS = 5
_APOD_RETRY_STATUSES = frozenset({429, 503})
_MAX_BACKOFF_SEC = 30.0
_MIN_RETRY_DELAY_SEC = 0.5


def _retry_after_seconds(response: httpx.Response) -> float | None:
    raw = response.headers.get("Retry-After")
    if raw is None:
        return None
    try:
        return float(raw)
    except ValueError:
        return None


def _apod_image_from_json(data: dict[str, object], target_date: date) -> ApodImage:
    return ApodImage(
        date=target_date,
        title=data.get("title", ""),
        explanation=data.get("explanation", ""),
        media_type=data.get("media_type", ""),
        url=data.get("url", ""),
        hdurl=data.get("hdurl"),
        copyright=data.get("copyright"),
    )


class NasaApodClient(ApodProvider):
    async def get_apod(self, target_date: date) -> ApodImage:
        settings = get_settings()
        params = {
            "api_key": settings.nasa_api_key,
            "date": target_date.isoformat(),
        }

        async with httpx.AsyncClient() as client:
            for attempt in range(_APOD_MAX_ATTEMPTS):
                try:
                    response = await client.get(
                        settings.nasa_api_url,
                        params=params,
                        timeout=10.0,
                    )
                except httpx.HTTPError as exc:  # pragma: no cover - network failure path
                    raise ApodExternalError("Error calling NASA APOD API") from exc

                if response.status_code == 404:
                    raise ApodNotFound(
                        f"APOD not found for date {target_date.isoformat()}"
                    )

                if response.status_code == 200:
                    data = response.json()
                    logger.debug(
                        "NASA APOD resolved url=%s copyright=%s",
                        data.get("hdurl") or data.get("url", ""),
                        "yes" if data.get("copyright") else "no",
                    )
                    return _apod_image_from_json(data, target_date)

                if (
                    response.status_code in _APOD_RETRY_STATUSES
                    and attempt < _APOD_MAX_ATTEMPTS - 1
                ):
                    header_delay = _retry_after_seconds(response)
                    backoff = min(2.0**attempt, _MAX_BACKOFF_SEC)
                    if header_delay is not None:
                        delay = min(header_delay, _MAX_BACKOFF_SEC)
                    else:
                        delay = backoff
                    delay = max(delay, _MIN_RETRY_DELAY_SEC)
                    logger.warning(
                        "NASA APOD returned %s (attempt %s/%s), retrying in %.1fs",
                        response.status_code,
                        attempt + 1,
                        _APOD_MAX_ATTEMPTS,
                        delay,
                    )
                    await asyncio.sleep(delay)
                    continue

                if response.status_code == 429:
                    raise ApodExternalError(
                        "NASA APOD API rate limit exceeded. "
                        "Use a dedicated API key (not DEMO_KEY) or try again later."
                    )
                raise ApodExternalError(
                    f"Unexpected status from NASA APOD API: {response.status_code}"
                )


def get_nasa_apod_client() -> NasaApodClient:
    return NasaApodClient()
