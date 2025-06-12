# /shecodes-backend/routers/auth.py

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from jose import JWTError, jwt

import crud
from schemas import user as user_schema
from schemas import common as common_schema # <-- IMPORT THE NEW COMMON SCHEMAS
from database import get_db
from core.config import settings
from core.security import (
    create_access_token, create_password_reset_token,
    create_verification_token
)
from core.email_service import send_email, generate_verification_email_content, generate_password_reset_email_content

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/register", response_model=common_schema.Msg, status_code=status.HTTP_201_CREATED)
def register_user(
    user_in: user_schema.UserCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Handles new user registration."""
    user = crud.get_user_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists.",
        )
    
    new_user = crud.create_user(db=db, user=user_in)
    
    if settings.EMAILS_ENABLED:
        token_expires = timedelta(hours=settings.EMAIL_VERIFICATION_TOKEN_EXPIRE_HOURS)
        verification_token = create_verification_token(email=new_user.email, expires_delta=token_expires)
        verification_link = f"{settings.FRONTEND_URL}/auth/verify-email?token={verification_token}"
        
        email_html = generate_verification_email_content(verification_link)
        background_tasks.add_task(
            send_email,
            email_to=new_user.email,
            subject=settings.EMAIL_VERIFICATION_SUBJECT,
            html_content=email_html
        )
    
    return common_schema.Msg(msg="Registration successful. Please check your email to verify your account.")

@router.post("/token", response_model=common_schema.Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Provides a JWT token for valid credentials."""
    result = crud.authenticate_user(db, email=form_data.username, password=form_data.password)
    if result["status"] == "inactive":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account not verified. Please check your email.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    elif result["status"] == "not_found":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email not found. Please register.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    elif result["status"] == "wrong_password":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    user = result["user"]
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return common_schema.Token(access_token=access_token, token_type="bearer")

@router.get("/verify-email", response_model=common_schema.Msg)
def verify_email(token: str, db: Session = Depends(get_db)):
    """Verifies a user's email address using a token from the email link."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if payload.get("scope") != "email_verification":
            raise HTTPException(status_code=401, detail="Invalid token scope")
            
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid or expired verification token")

    user = crud.get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.is_verified:
        return common_schema.Msg(msg="Account already verified. You can log in.")
        
    crud.activate_user(db, user=user)
    return common_schema.Msg(msg="Email verified successfully. You can now log in.")

@router.post("/password-reset/request", response_model=common_schema.Msg, status_code=status.HTTP_202_ACCEPTED)
def request_password_reset(
    request_body: user_schema.PasswordResetRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    user = crud.get_user_by_email(db, email=request_body.email)
    if user and settings.EMAILS_ENABLED:
        token_expires = timedelta(hours=settings.PASSWORD_RESET_TOKEN_EXPIRE_HOURS)
        reset_token = create_password_reset_token(email=user.email, expires_delta=token_expires)
        reset_link = f"{settings.FRONTEND_URL}/auth/reset-password?token={reset_token}"
        email_html = generate_password_reset_email_content(reset_link)
        background_tasks.add_task(
            send_email,
            email_to=user.email,
            subject=settings.PASSWORD_RESET_SUBJECT,
            html_content=email_html
        )
    return common_schema.Msg(msg="If an account with that email exists, a password reset link has been sent.")

@router.post("/password-reset/confirm", response_model=common_schema.Msg)
def confirm_password_reset(
    body: user_schema.PasswordResetConfirm,
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(body.token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if payload.get("scope") != "password_reset":
            raise HTTPException(status_code=401, detail="Invalid token scope")
        email: str = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")

    user = crud.get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    crud.update_user_password(db, user=user, new_password=body.new_password)
    return common_schema.Msg(msg="Password has been successfully reset.")