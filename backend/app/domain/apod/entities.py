from dataclasses import dataclass
from datetime import date


@dataclass(slots=True)
class ApodImage:
    date: date
    title: str
    explanation: str
    media_type: str
    url: str
    hdurl: str | None = None
    copyright: str | None = None

