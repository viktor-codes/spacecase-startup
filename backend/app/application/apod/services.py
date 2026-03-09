from datetime import date

from app.domain.apod.entities import ApodImage
from app.domain.apod.ports import ApodProvider


class ApodService:
    def __init__(self, apod_provider: ApodProvider) -> None:
        self._apod_provider = apod_provider

    async def get_apod_for_date(self, target_date: date) -> ApodImage:
        return await self._apod_provider.get_apod(target_date)

