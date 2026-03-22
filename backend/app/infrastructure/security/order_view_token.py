import hashlib
import hmac
import secrets


def generate_view_token_pair() -> tuple[str, str]:
    """Return (url_safe_token, sha256_hex_hash_for_storage)."""
    raw = secrets.token_urlsafe(32)
    digest = hashlib.sha256(raw.encode("utf-8")).hexdigest()
    return raw, digest


def verify_view_token(stored_hash: str | None, provided: str | None) -> bool:
    if not stored_hash or not provided:
        return False
    computed = hashlib.sha256(provided.encode("utf-8")).hexdigest()
    return hmac.compare_digest(computed, stored_hash)
