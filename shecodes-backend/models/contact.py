# models/contact_card_info.py
from sqlalchemy import Column, Integer, String, Enum
from database import Base

class ContactCardInfo(Base):
    __tablename__ = "contact_cards"

    id = Column(Integer, primary_key=True, index=True)
    platform_name = Column(String, nullable=False)
    logo_src = Column(String, nullable=False)
    description = Column(String, nullable=False)
    link_url = Column(String, nullable=False)
    color_variant = Column(Enum('pink', 'blue', name="contact_colorvariant"), nullable=False)