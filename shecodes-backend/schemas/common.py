from pydantic import BaseModel

class Msg(BaseModel):
    """A generic message response schema."""
    msg: str

class Token(BaseModel):
    """Schema for the JWT access token response."""
    access_token: str
    token_type: str = "bearer"