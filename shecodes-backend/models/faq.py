# models/faq_item.py
from sqlalchemy import Column, String, Enum, Integer
from database import Base

class FAQItem(Base):
    __tablename__ = "faq_items"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(String, nullable=False)
    answer = Column(String, nullable=False)
    color_variant = Column(Enum('pink', 'blue', 'purple', name="faq_colorvariant"), nullable=False)