import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-pro")
    SAFETY_FACTOR_THRESHOLD: float = float(os.getenv("SAFETY_FACTOR_THRESHOLD", "1.5"))
    SANDBOX_TIMEOUT_SECONDS: int = int(os.getenv("SANDBOX_TIMEOUT_SECONDS", "15"))
    FRONTEND_ORIGIN: str = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))

    @property
    def cors_origins(self) -> List[str]:
        raw = self.FRONTEND_ORIGIN.strip()
        if not raw:
            return ["*"]
        origins = [o.strip().rstrip("/") for o in raw.split(",") if o.strip()]
        # If localhost is present, also allow 127.0.0.1
        if "http://localhost:5173" in origins and "http://127.0.0.1:5173" not in origins:
            origins.append("http://127.0.0.1:5173")
        return origins

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
