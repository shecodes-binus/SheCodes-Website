from pydantic import BaseModel

class DocumentationBase(BaseModel):
    image_src: str

class DocumentationCreate(DocumentationBase):
    pass

class DocumentationUpdate(DocumentationBase):
    pass

class DocumentationResponse(DocumentationBase):
    id: int

    class Config:
        orm_mode = True