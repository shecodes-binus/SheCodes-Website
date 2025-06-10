class ParticipantBase(BaseModel):
    event_id: int
    member_id: int
    registration_date: Optional[datetime] = None
    status: Optional[str] = "registered"

class ParticipantCreate(ParticipantBase):
    pass

class ParticipantUpdate(BaseModel):
    status: str

class ParticipantResponse(ParticipantBase):
    id: int
    class Config:
        orm_mode = True