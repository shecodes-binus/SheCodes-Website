from sqlalchemy import Column, String, Enum
from database import Base

class FAQItem(Base):
    __tablename__ = "faq_items"

    id = Column(String, primary_key=True, index=True)
    question = Column(String, nullable=False)
    answer = Column(String, nullable=False)
    colorVariant = Column(Enum('pink', 'blue', 'purple', name="faq_colorvariant"), nullable=False)
