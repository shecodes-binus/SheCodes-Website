# /core/enums.py (or at the top of storage_service.py)

from enum import Enum

# Define the allowed upload categories as an Enum for type safety
class UploadCategory(str, Enum):
    ALUMNIS = "alumnis"
    EVENTS = "events"
    MENTORS = "mentors"
    CHAMPIONS = "champions" 
    USERS = "users"         
    ARTICLES = "articles"
    LOGOS = "logos"
    DOCUMENTATION = "documentation"
    GENERAL = "general" # A fallback category
    CERTIFICATES = "certificates" # For participant certificates
    PROJECTS = "projects" # For portfolio projects