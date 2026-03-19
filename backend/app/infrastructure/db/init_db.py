from sqlalchemy.ext.asyncio import AsyncEngine

from app.infrastructure.db.base import Base
from app.infrastructure.db.session import engine


async def init_db() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

