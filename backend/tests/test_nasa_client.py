import httpx

from app.infrastructure.nasa.client import _retry_after_seconds


def test_retry_after_seconds_parses_integer() -> None:
    response = httpx.Response(429, headers={"Retry-After": "12"})
    assert _retry_after_seconds(response) == 12.0


def test_retry_after_seconds_missing_returns_none() -> None:
    response = httpx.Response(429)
    assert _retry_after_seconds(response) is None


def test_retry_after_seconds_invalid_returns_none() -> None:
    response = httpx.Response(429, headers={"Retry-After": "not-a-number"})
    assert _retry_after_seconds(response) is None
