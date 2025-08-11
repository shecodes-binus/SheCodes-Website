from sqlalchemy import Column, Integer, String
from database import Base

class Tool(Base):
    __tablename__ = "tools"

    id = Column(Integer, primary_key=True, index=True)
    # The name of the tool, e.g., "Figma", "VS Code".
    # Should be unique to avoid duplicates. Indexed for fast lookups.
    name = Column(String, unique=True, index=True, nullable=False)
    logo_src = Column(String, nullable=False)