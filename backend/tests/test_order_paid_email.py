from datetime import date, datetime, timezone

from app.domain.orders.entities import ApodSnapshot, Order
from app.infrastructure.email.order_paid_notification import (
    render_order_paid_email_html,
)


def test_render_order_paid_email_includes_order_link() -> None:
    snap = ApodSnapshot(
        apod_date=date(2000, 1, 1),
        apod_title="Test & sky",
        apod_media_type="image",
        apod_url="https://example.com/a.jpg",
        apod_hdurl=None,
    )
    order = Order(
        id="aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
        created_at=datetime(2000, 1, 1, tzinfo=timezone.utc),
        updated_at=datetime(2000, 1, 1, tzinfo=timezone.utc),
        status="paid",
        snapshot=snap,
        device_model="iPhone 15",
        shipping_option="standard",
        currency="EUR",
        amount_cents=2999,
        contact_email="buyer@example.com",
        contact_full_name="Ada Lovelace",
        contact_phone="+3531000000",
        shipping_line1="1 Street",
        shipping_line2=None,
        shipping_city="Dublin",
        shipping_postal_code="D02 XY45",
        shipping_country="IE",
        stripe_checkout_session_id="cs_test_1",
        view_token_hash="ab" * 32,
        view_token_secret="raw-token-secret",
    )
    html = render_order_paid_email_html(
        order=order, frontend_base_url="https://shop.example"
    )
    assert "View your order" in html
    assert "orderId=aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee" in html
    assert "token=raw-token-secret" in html
    assert "Test &amp; sky" in html
