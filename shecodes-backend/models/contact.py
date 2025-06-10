from sqlalchemy import Column, Integer, String, Enum
from ..database import Base

class ContactCardInfo(Base):
    __tablename__ = "contact_cards"

    id = Column(Integer, primary_key=True, index=True)
    platformName = Column(String, nullable=False)
    logoSrc = Column(String, nullable=False)
    description = Column(String, nullable=False)
    linkUrl = Column(String, nullable=False)
    colorVariant = Column(Enum('pink', 'blue', name="contact_colorvariant"), nullable=False)
