from datetime import date

from fastapi.testclient import TestClient

from app.api.v1.apod import get_apod_service
from app.application.apod.services import ApodService
from app.domain.apod.entities import ApodImage
from app.domain.apod.ports import ApodProvider
from app.main import app


class _FakeApodProvider(ApodProvider):
    async def get_apod(self, target_date: date) -> ApodImage:
        return ApodImage(
            date=target_date,
            title="Test image",
            explanation="Fixture",
            media_type="image",
            url="https://apod.nasa.gov/apod/image/fake/test.jpg",
        )


def _override_apod_service() -> ApodService:
    return ApodService(apod_provider=_FakeApodProvider())


def test_apod_returns_mocked_image() -> None:
    app.dependency_overrides[get_apod_service] = _override_apod_service
    with TestClient(app) as client:
        response = client.get("/v1/apod?date=2020-06-16")
    assert response.status_code == 200
    body = response.json()
    assert body["media_type"] == "image"
    assert body["title"] == "Test image"
    assert "apod.nasa.gov" in body["url"]
