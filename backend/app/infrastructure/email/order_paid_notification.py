import html
import logging
from urllib.parse import urlencode

from app.core.config import Settings
from app.domain.orders.entities import Order
from app.infrastructure.email.resend_mailer import send_resend_html_email

_log = logging.getLogger("uvicorn.error")

# Resend test sender (no custom domain). Replace in code when you verify a domain.
_RESEND_FROM = "onboarding@resend.dev"


def _format_money_eur(amount_cents: int) -> str:
    return f"{amount_cents / 100.0:.2f}"


def render_order_paid_email_html(*, order: Order, frontend_base_url: str) -> str:
    base = frontend_base_url.rstrip("/")
    order_link = ""
    if order.view_token_secret:
        order_link = (
            f"{base}/order/success?"
            f"{urlencode({'orderId': order.id, 'token': order.view_token_secret})}"
        )

    title = html.escape(order.snapshot.apod_title)
    device = html.escape(order.device_model)
    ship = html.escape(order.shipping_option)
    name = html.escape(order.contact_full_name)
    email_addr = html.escape(order.contact_email)
    line1 = html.escape(order.shipping_line1)
    city = html.escape(order.shipping_city)
    eir = html.escape(order.shipping_postal_code)
    oid = html.escape(order.id)
    total = _format_money_eur(order.amount_cents)

    link_block = ""
    if order_link:
        safe_href = html.escape(order_link, quote=True)
        link_block = f"""
    <p style="margin:16px 0;">
      <a href="{safe_href}" style="color:#2563eb;">View your order</a>
    </p>
    """
    else:
        link_block = (
            "<p style=\"margin:16px 0;color:#64748b;\">"
            "Open your order from the link on the payment confirmation page."
            "</p>"
        )

    return f"""<!DOCTYPE html>
<html>
<body style="font-family:system-ui,sans-serif;line-height:1.5;color:#0f172a;">
  <h1 style="font-size:20px;">Thank you, {name}</h1>
  <p>Your CosmicCase order is confirmed.</p>
  <table style="border-collapse:collapse;margin:16px 0;">
    <tr><td style="padding:4px 16px 4px 0;color:#64748b;">Order</td><td>{oid}</td></tr>
    <tr><td style="padding:4px 16px 4px 0;color:#64748b;">Total</td><td>€{total}</td></tr>
    <tr><td style="padding:4px 16px 4px 0;color:#64748b;">Sky</td><td>{title}</td></tr>
    <tr><td style="padding:4px 16px 4px 0;color:#64748b;">Device</td><td>{device}</td></tr>
    <tr><td style="padding:4px 16px 4px 0;color:#64748b;">Shipping</td><td>{ship}</td></tr>
  </table>
  <p style="margin:16px 0 8px;color:#64748b;font-size:14px;">Ship to</p>
  <p style="margin:0;">{line1}<br/>{city}, {eir}</p>
  {link_block}
  <p style="margin-top:24px;font-size:13px;color:#94a3b8;">Questions? Reply to this email.</p>
  <p style="font-size:12px;color:#94a3b8;">{email_addr}</p>
</body>
</html>
"""


async def send_order_paid_email_if_configured(
    *,
    order: Order,
    settings: Settings,
) -> None:
    if not settings.resend_api_key.strip():
        _log.warning(
            "Order email skipped (set RESEND_API_KEY in .env): order_id=%s",
            order.id,
        )
        return

    html_body = render_order_paid_email_html(
        order=order, frontend_base_url=settings.frontend_base_url
    )
    subject = f"Your CosmicCase order {order.id[:8]}... is confirmed"
    try:
        await send_resend_html_email(
            api_key=settings.resend_api_key.strip(),
            from_addr=_RESEND_FROM,
            to=order.contact_email.strip(),
            subject=subject,
            html=html_body,
        )
        _log.info(
            "Order confirmation email sent via Resend: order_id=%s to=%s",
            order.id,
            order.contact_email.strip(),
        )
    except Exception:
        _log.exception("Failed to send order confirmation email for order %s", order.id)
