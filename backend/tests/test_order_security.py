from fastapi.testclient import TestClient

from app.infrastructure.security.order_view_token import (
    generate_view_token_pair,
    verify_view_token,
)
from app.main import app


def test_view_token_roundtrip() -> None:
    raw, digest = generate_view_token_pair()
    assert verify_view_token(digest, raw)
    assert not verify_view_token(digest, "wrong")
    assert not verify_view_token(None, raw)
    assert not verify_view_token(digest, None)


def test_get_order_without_token_returns_404() -> None:
    with TestClient(app) as client:
        response = client.get("/v1/orders/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404


def test_get_order_with_wrong_token_returns_404() -> None:
    with TestClient(app) as client:
        response = client.get(
            "/v1/orders/00000000-0000-0000-0000-000000000000",
            params={"token": "invalid-token"},
        )
    assert response.status_code == 404
