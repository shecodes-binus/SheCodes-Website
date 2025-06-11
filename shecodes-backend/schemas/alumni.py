from pydantic import BaseModel

class AlumniBase(BaseModel):
    name: str
    batch: int
    image_src: str
    story: str
    email: str | None = None
    instagram: str | None = None
    linkedin: str | None = None
    phone: str | None = None
    university: str | None = None

class AlumniCreate(AlumniBase):
    pass

class AlumniUpdate(AlumniBase):
    pass

class AlumniResponse(AlumniBase):
    id: int

    class Config:
        orm_mode = True
