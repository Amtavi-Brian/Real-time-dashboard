"""Application configuration loaded from environment variables."""
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Columbus HR Time & Wage Analytics API"
    environment: str = "development"

    # Falls back to a local SQLite file so the API runs without a PostgreSQL
    # server. Set DATABASE_URL (e.g. postgresql+psycopg://user:pass@host/db)
    # to point at a real PostgreSQL instance in staging/production.
    database_url: str = "sqlite:///./columbus_hr.db"

    secret_key: str = "columbus-dev-secret-change-me"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 8

    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    ws_broadcast_interval_seconds: int = 12

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
