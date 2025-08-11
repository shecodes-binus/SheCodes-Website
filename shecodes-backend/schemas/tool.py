from pydantic import BaseModel, ConfigDict

class ToolBase(BaseModel):
    name: str
    logo_src: str

class ToolCreate(ToolBase):
    pass

class ToolUpdate(ToolBase):
    pass

class ToolResponse(ToolBase):
    id: int
    model_config = ConfigDict(from_attributes=True)