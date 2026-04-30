import uvicorn


def main() -> None:
    """
    Local development entrypoint for the backend.

    Example:
      uv run python main.py
    """
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )


if __name__ == "__main__":
    main()
