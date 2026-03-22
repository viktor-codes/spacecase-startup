from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import get_settings

settings = get_settings()

# PgBouncer (Supabase pooler, transaction mode) does not support asyncpg prepared
# statements; without this, startup fails with DuplicatePreparedStatementError.
_engine_kwargs: dict = {"echo": settings.debug}
if "+asyncpg" in settings.database_url:
    _engine_kwargs["connect_args"] = {"statement_cache_size": 0}

engine = create_async_engine(settings.database_url, **_engine_kwargs)
async_session_factory = async_sessionmaker(engine, expire_on_commit=False)


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_factory() as session:
        yield session

