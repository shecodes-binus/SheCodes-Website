from pydantic import BaseModel

class PartnerBase(BaseModel):
    name: str
    logoSrc: str

class PartnerCreate(PartnerBase):
    pass

class PartnerUpdate(PartnerBase):
    pass

class PartnerResponse(PartnerBase):
    id: int

    class Config:
        orm_mode = True
