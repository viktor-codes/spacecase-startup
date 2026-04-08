import logging

import httpx

_log = logging.getLogger("uvicorn.error")


async def send_resend_html_email(
    *,
    api_key: str,
    from_addr: str,
    to: str,
    subject: str,
    html: str,
) -> None:
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "from": from_addr,
                "to": [to],
                "subject": subject,
                "html": html,
            },
            timeout=30.0,
        )
    try:
        response.raise_for_status()
    except httpx.HTTPStatusError as exc:
        _log.error(
            "Resend API error: %s %s",
            exc.response.status_code,
            exc.response.text,
        )
        raise
