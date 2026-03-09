from abc import ABC, abstractmethod
from datetime import date

from app.domain.apod.entities import ApodImage


class ApodProvider(ABC):
    @abstractmethod
    async def get_apod(self, target_date: date) -> ApodImage:  # pragma: no cover - interface
        """Fetch APOD image for a specific date."""

