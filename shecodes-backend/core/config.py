import os
from dotenv import load_dotenv
from typing import Optional

load_dotenv() 

DB_USER = os.environ.get('DB_USER')
DB_PASSWORD = os.environ.get('DB_PASSWORD')
DB_HOST = os.environ.get('DB_HOST')
DB_NAME = os.environ.get('DB_NAME')
DB_PORT= os.environ.get('DB_PORT')

class Settings:
    PROJECT_NAME: str = "SheCodes API"
    PROJECT_VERSION: str = "1.0.0"
    
    # App Mode
    APP_MODE: str = os.getenv("APP_MODE", "production").lower()
    DEV_USER_EMAIL: Optional[str] = os.getenv("DEV_USER_EMAIL", "dev@example.com")
    DEV_AUTH_TOKEN: Optional[str] = os.getenv("DEV_AUTH_TOKEN")

    # JWT Settings
    SECRET_KEY: str = os.environ.get("SECRET_KEY")    
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30  # 30 minutes
    
    # For password reset tokens, you can define a separate expiry
    PASSWORD_RESET_TOKEN_EXPIRE_HOURS: int = 1 # 1 hour
    
    # For email verification tokens
    EMAIL_VERIFICATION_TOKEN_EXPIRE_HOURS: int = 24 # 24 hours

    # Database
    DATABASE_URL = f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'
    
    FRONTEND_URL: str = os.getenv("FRONTEND_URL")
    
    # Email Settings
    EMAILS_ENABLED: bool = str(os.getenv("EMAILS_ENABLED", "False")).lower() == "true"
    SMTP_HOST: str | None = os.getenv("SMTP_HOST")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT"))
    SMTP_USER: str | None = os.getenv("SMTP_USER")
    SMTP_PASSWORD: str | None = os.getenv("SMTP_PASSWORD")
    SMTP_TLS: bool = str(os.getenv("SMTP_TLS", "True")).lower() == "true"
    EMAILS_FROM_EMAIL: str | None = os.getenv("EMAILS_FROM_EMAIL")
    EMAILS_FROM_NAME: str = os.getenv("EMAILS_FROM_NAME", PROJECT_NAME)
    
    EMAIL_VERIFICATION_SUBJECT: str = f"{PROJECT_NAME} - Verify Your Email"
    PASSWORD_RESET_SUBJECT: str = f"{PROJECT_NAME} - Password Reset Request"

settings = Settings()

if settings.APP_MODE in ["development", "dev"] and not settings.DEV_AUTH_TOKEN:
    print("WARNING: APP_MODE is development, but DEV_AUTH_TOKEN is not set in .env. Dev auto-login will not work.")
if settings.APP_MODE in ["development", "dev"] and not settings.DEV_USER_EMAIL:
    print("WARNING: APP_MODE is development, but DEV_USER_EMAIL is not set in .env. Dev auto-login might fail.")

if settings.EMAILS_ENABLED:
    assert settings.SMTP_HOST, "SMTP_HOST must be set if emails are enabled."
    assert settings.EMAILS_FROM_EMAIL, "EMAILS_FROM_EMAIL must be set if emails are enabled."