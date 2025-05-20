from pydantic import BaseModel

class AlumniBase(BaseModel):
    name: str
    batch: int
    imageSrc: str
    story: str

class AlumniCreate(AlumniBase):
    pass

class AlumniUpdate(AlumniBase):
    pass

class AlumniResponse(AlumniBase):
    id: int

    class Config:
        orm_mode = True
