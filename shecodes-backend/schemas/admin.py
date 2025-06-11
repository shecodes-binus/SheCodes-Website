from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional

class AdminBase(BaseModel):
    name: str
    imageSrc: str
    email: EmailStr
    phone: Optional[str] = None
    role: str = "Admin"

class AdminCreate(AdminBase):
    pass

class AdminUpdate(AdminBase):
    pass

class AdminResponse(AdminBase):
    id: int
    model_config = ConfigDict(from_attributes=True)