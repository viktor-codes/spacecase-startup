from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine

from app.core.config import get_settings
from app.infrastructure.db.base import Base
from app.infrastructure.db.session import engine


async def _ensure_order_view_token_column(conn_engine: AsyncEngine) -> None:
    """Add view_token_hash when upgrading an existing DB (SQLite / PostgreSQL)."""
    settings = get_settings()
    url = settings.database_url
    async with conn_engine.begin() as conn:
        if "sqlite" in url:
            result = await conn.execute(text("PRAGMA table_info(orders)"))
            columns = {row[1] for row in result.fetchall()}
            if "view_token_hash" not in columns:
                await conn.execute(
                    text(
                        "ALTER TABLE orders ADD COLUMN view_token_hash VARCHAR(64)"
                    )
                )
            return

        check = await conn.execute(
            text(
                """
                SELECT 1 FROM information_schema.columns
                WHERE table_schema = 'public'
                  AND table_name = 'orders'
                  AND column_name = 'view_token_hash'
                """
            )
        )
        if check.fetchone() is None:
            await conn.execute(
                text(
                    "ALTER TABLE orders ADD COLUMN view_token_hash VARCHAR(64)"
                )
            )


async def init_db() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await _ensure_order_view_token_column(engine)

