# backend/core/email_service.py
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any
from core.config import settings

def send_email(
    email_to: str,
    subject: str,
    html_content: str,
) -> bool:
    if not settings.EMAILS_ENABLED:
        print(f"Email sending is disabled. To: {email_to}\nSubject: {subject}\nBody:\n{html_content}")
        return True # Simulate success

    assert settings.EMAILS_FROM_EMAIL, "EMAILS_FROM_EMAIL must be configured"
    assert settings.SMTP_HOST, "SMTP_HOST must be configured"

    msg = MIMEMultipart("alternative")
    msg["From"] = f"{settings.EMAILS_FROM_NAME} <{settings.EMAILS_FROM_EMAIL}>"
    msg["To"] = email_to
    msg["Subject"] = subject
    msg.attach(MIMEText(html_content, "html"))

    try:
        server_args = {}
        if settings.SMTP_PORT:
            server_args['port'] = settings.SMTP_PORT
        if settings.SMTP_HOST:
            server_args['host'] = settings.SMTP_HOST
        
        # server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) # Original
        server = smtplib.SMTP(**server_args)

        if settings.SMTP_TLS:
            server.starttls()
        if settings.SMTP_USER and settings.SMTP_PASSWORD:
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        
        server.sendmail(settings.EMAILS_FROM_EMAIL, [email_to], msg.as_string())
        server.quit()
        print(f"Email sent successfully to {email_to}")
        return True
    except Exception as e:
        print(f"Error sending email to {email_to}: {e}")
        import traceback
        traceback.print_exc()
        return False

def generate_verification_email_content(verification_link: str) -> str:
    """
    Generates a simple and professional HTML email for account verification.
    """
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #FDF0FD;">
        <div style="max-width: 600px; margin: auto; background-color: #FFFFFF; padding: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            
            <h1 style="color: #1C2730; font-size: 24px; text-align: center; margin-bottom: 24px;">
                Confirm Your Email Address
            </h1>
            
            <p style="font-size: 16px; color: #1C2730; line-height: 1.6; margin: 16px 0;">
                Welcome to {settings.PROJECT_NAME}! We're excited to have you. Please click the button below to verify your email address and complete your registration.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{verification_link}" style="background-color: #4D73FF; color: #FFFFFF; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold; display: inline-block;">
                    Verify Email Address
                </a>
            </div>
            
            <p style="font-size: 16px; color: #1C2730; line-height: 1.6;">
                If you did not create an account, you can safely ignore this email.
            </p>

            <p style="font-size: 14px; color: #848484; line-height: 1.6;">
                This link will expire in {settings.EMAIL_VERIFICATION_TOKEN_EXPIRE_HOURS} hours.
            </p>
            
            <hr style="border: 0; border-top: 1px solid #D8D8D8; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #848484; text-align: center;">
                © {settings.PROJECT_NAME}
            </p>

        </div>
    </body>
    </html>
    """

def generate_password_reset_email_content(reset_link: str) -> str:
    """
    Generates a simple and professional HTML email for password reset.
    """
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #FDF0FD;">
        <div style="max-width: 600px; margin: auto; background-color: #FFFFFF; padding: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            
            <h1 style="color: #1C2730; font-size: 24px; text-align: center; margin-bottom: 24px;">
                Password Reset Request
            </h1>
            
            <p style="font-size: 16px; color: #1C2730; line-height: 1.6; margin: 16px 0;">
                We received a request to reset the password for your account. If this was you, click the button below to choose a new password.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{reset_link}" style="background-color: #FF334B; color: #FFFFFF; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold; display: inline-block;">
                    Reset Your Password
                </a>
            </div>
            
            <p style="font-size: 16px; color: #1C2730; line-height: 1.6;">
                If you did not request a password reset, please ignore this email. Your password will remain unchanged.
            </p>
            
            <p style="font-size: 14px; color: #848484; line-height: 1.6;">
                This link will expire in {settings.PASSWORD_RESET_TOKEN_EXPIRE_HOURS} hour(s).
            </p>
            
            <hr style="border: 0; border-top: 1px solid #D8D8D8; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #848484; text-align: center;">
                © {settings.PROJECT_NAME}
            </p>

        </div>
    </body>
    </html>
    """