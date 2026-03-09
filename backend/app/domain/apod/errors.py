class ApodError(Exception):
    """Base error for APOD-related issues."""


class ApodNotFound(ApodError):
    """APOD entry was not found for the given date."""


class ApodExternalError(ApodError):
    """Unexpected error while calling external APOD provider."""

