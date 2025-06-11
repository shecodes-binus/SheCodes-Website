# /shecodes-backend/crud.py

from sqlalchemy.orm import Session
from typing import Optional, List

# Import all models and schemas with aliases to prevent name conflicts
from models import (
    user as user_model,
    alumni as alumni_model,
    blog as blog_model,
    comment as comment_model,
    contact as contact_model,
    documentation as doc_model,
    event as event_model,
    faq as faq_model,
    mentor as mentor_model,
    participant as participant_model,
    partner as partner_model
)
from schemas import (
    user as user_schema,
    alumni as alumni_schema,
    blog as blog_schema,
    comment as comment_schema,
    contact as contact_schema,
    documentation as doc_schema,
    event as event_schema,
    faq as faq_schema,
    mentor as mentor_schema,
    participant as participant_schema,
    partner as partner_schema
)

from core.security import get_password_hash, verify_password

# ===============================================
#               User CRUD
# ===============================================

def get_user(db: Session, user_id: str) -> Optional[user_model.User]:
    return db.query(user_model.User).filter(user_model.User.id == user_id).first()

def get_user_by_email(db: Session, email: str) -> Optional[user_model.User]:
    return db.query(user_model.User).filter(user_model.User.email == email).first()

def get_all_users(db: Session, skip: int = 0, limit: int = 100) -> List[user_model.User]:
    return db.query(user_model.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: user_schema.UserCreate) -> user_model.User:
    hashed_password = get_password_hash(user.password)
    db_user = user_model.User(
        email=user.email,
        name=user.name,
        role=user.role,
        password=hashed_password,
        is_verified=False
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, db_user: user_model.User, user_in: user_schema.UserUpdate) -> user_model.User:
    update_data = user_in.model_dump(exclude_unset=True)
    if "password" in update_data and update_data["password"]:
        hashed_password = get_password_hash(update_data["password"])
        update_data["password"] = hashed_password
    
    for key, value in update_data.items():
        setattr(db_user, key, value)
        
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: str) -> Optional[user_model.User]:
    db_user = get_user(db, user_id)
    if db_user:
        db.delete(db_user)
        db.commit()
    return db_user

def authenticate_user(db: Session, email: str, password: str) -> Optional[user_model.User]:
    user = get_user_by_email(db, email=email)
    if not user or not verify_password(password, user.password):
        return None
    return user

def activate_user(db: Session, user: user_model.User) -> user_model.User:
    user.is_verified = True
    db.commit()
    db.refresh(user)
    return user

def update_user_password(db: Session, user: user_model.User, new_password: str) -> user_model.User:
    user.password = get_password_hash(new_password)
    db.commit()
    db.refresh(user)
    return user

# ===============================================
#               Alumni CRUD
# ===============================================

def get_alumni(db: Session, alumni_id: int) -> Optional[alumni_model.Alumni]:
    return db.query(alumni_model.Alumni).filter(alumni_model.Alumni.id == alumni_id).first()

def get_all_alumni(db: Session, skip: int = 0, limit: int = 100) -> List[alumni_model.Alumni]:
    return db.query(alumni_model.Alumni).offset(skip).limit(limit).all()

def create_alumni(db: Session, alumni: alumni_schema.AlumniCreate) -> alumni_model.Alumni:
    db_alumni = alumni_model.Alumni(**alumni.model_dump())
    db.add(db_alumni)
    db.commit()
    db.refresh(db_alumni)
    return db_alumni
    
def update_alumni(db: Session, db_alumni: alumni_model.Alumni, alumni_in: alumni_schema.AlumniUpdate) -> alumni_model.Alumni:
    update_data = alumni_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_alumni, key, value)
    db.add(db_alumni)
    db.commit()
    db.refresh(db_alumni)
    return db_alumni

def delete_alumni(db: Session, alumni_id: int) -> Optional[alumni_model.Alumni]:
    db_alumni = get_alumni(db, alumni_id)
    if db_alumni:
        db.delete(db_alumni)
        db.commit()
    return db_alumni

# ===============================================
#               Blog CRUD
# ===============================================

def get_blog(db: Session, blog_id: str) -> Optional[blog_model.BlogArticle]:
    return db.query(blog_model.BlogArticle).filter(blog_model.BlogArticle.id == blog_id).first()

def get_all_blogs(db: Session, skip: int = 0, limit: int = 100) -> List[blog_model.BlogArticle]:
    return db.query(blog_model.BlogArticle).offset(skip).limit(limit).all()

def create_blog(db: Session, blog: blog_schema.BlogArticleCreate) -> blog_model.BlogArticle:
    db_blog = blog_model.BlogArticle(**blog.model_dump())
    db.add(db_blog)
    db.commit()
    db.refresh(db_blog)
    return db_blog

def update_blog(db: Session, db_blog: blog_model.BlogArticle, blog_in: blog_schema.BlogArticleUpdate) -> blog_model.BlogArticle:
    update_data = blog_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_blog, key, value)
    db.add(db_blog)
    db.commit()
    db.refresh(db_blog)
    return db_blog

def delete_blog(db: Session, blog_id: str) -> Optional[blog_model.BlogArticle]:
    db_blog = get_blog(db, blog_id)
    if db_blog:
        db.delete(db_blog)
        db.commit()
    return db_blog

# ===============================================
#               Comment CRUD
# ===============================================

def get_comment(db: Session, comment_id: int) -> Optional[comment_model.Comment]:
    return db.query(comment_model.Comment).filter(comment_model.Comment.id == comment_id).first()

def get_comments_by_discussion(db: Session, discussion_id: str) -> List[comment_model.Comment]:
    return db.query(comment_model.Comment).filter(comment_model.Comment.discussion_id == discussion_id).order_by(comment_model.Comment.date).all()

def create_comment(db: Session, comment: comment_schema.CommentCreate) -> comment_model.Comment:
    db_comment = comment_model.Comment(**comment.model_dump())
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

def increment_comment_like(db: Session, db_comment: comment_model.Comment) -> comment_model.Comment:
    db_comment.likes += 1
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

def delete_comment(db: Session, comment_id: int) -> Optional[comment_model.Comment]:
    db_comment = get_comment(db, comment_id)
    if db_comment:
        db.delete(db_comment)
        db.commit()
    return db_comment

# ===============================================
#       Generic CRUD Functions (for simple models)
# ===============================================

def get_generic_item(db: Session, model, item_id):
    return db.query(model).filter(model.id == item_id).first()

def get_all_generic_items(db: Session, model, skip: int = 0, limit: int = 100):
    return db.query(model).offset(skip).limit(limit).all()

def create_generic_item(db: Session, model, schema):
    db_item = model(**schema.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_generic_item(db: Session, db_item, schema_in):
    update_data = schema_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_item, key, value)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def delete_generic_item(db: Session, model, item_id):
    db_item = get_generic_item(db, model, item_id)
    if db_item:
        db.delete(db_item)
        db.commit()
    return db_item
    
# ===============================================
#               Event CRUD (Complex)
# ===============================================

def get_event(db: Session, event_id: int) -> Optional[event_model.Event]:
    return db.query(event_model.Event).filter(event_model.Event.id == event_id).first()

def get_all_events(db: Session, skip: int = 0, limit: int = 100) -> List[event_model.Event]:
    return db.query(event_model.Event).offset(skip).limit(limit).all()

def create_event(db: Session, event_data: event_schema.EventCreate) -> event_model.Event:
    # Separate relational data from the main event data
    event_base_data = event_data.model_dump(exclude={'mentors', 'skills', 'benefits', 'sessions'})
    
    # Create the main event object
    new_event = event_model.Event(**event_base_data)
    
    # Fetch and associate existing mentors
    if event_data.mentors:
        mentors = db.query(mentor_model.Mentor).filter(mentor_model.Mentor.id.in_(event_data.mentors)).all()
        new_event.mentors = mentors
    
    # Create and associate new related objects
    for skill_data in event_data.skills:
        new_event.skills.append(event_model.Skill(**skill_data.model_dump()))
        
    for benefit_data in event_data.benefits:
        new_event.benefits.append(event_model.Benefit(**benefit_data.model_dump()))
        
    for session_data in event_data.sessions:
        new_event.sessions.append(event_model.Session(**session_data.model_dump()))
        
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event

def update_event(db: Session, db_event: event_model.Event, event_in: event_schema.EventUpdate) -> event_model.Event:
    # NOTE: This is a simple update. A full update for relationships (mentors, skills, etc.)
    # would require more complex logic to add/remove/update nested items.
    update_data = event_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_event, key, value)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def delete_event(db: Session, event_id: int) -> Optional[event_model.Event]:
    db_event = get_event(db, event_id)
    if db_event:
        db.delete(db_event)
        db.commit()
    return db_event

# ===============================================
#               Participant CRUD
# ===============================================

def get_participant(db: Session, participant_id: int) -> Optional[participant_model.Participant]:
    return db.query(participant_model.Participant).filter(participant_model.Participant.id == participant_id).first()

def get_participants_by_event(db: Session, event_id: int) -> List[participant_model.Participant]:
    """Fetches all participants for a specific event."""
    return db.query(participant_model.Participant).filter(participant_model.Participant.event_id == event_id).all()

def create_participant(db: Session, participant: participant_schema.ParticipantCreate) -> participant_model.Participant:
    """
    Creates a new participant record after validating that the event and user exist.
    Raises ValueError if event or user is not found.
    """
    # 1. Validation Check: Does the event exist?
    event = get_event(db, event_id=participant.event_id)
    if not event:
        raise ValueError(f"Validation failed: Event with ID {participant.event_id} not found.")

    # 2. Validation Check: Does the user (member) exist?
    user = get_user(db, user_id=participant.member_id)
    if not user:
        raise ValueError(f"Validation failed: User with ID {participant.member_id} not found.")

    # 3. Check for duplicates: Is this user already registered for this event?
    existing_participant = db.query(participant_model.Participant).filter(
        participant_model.Participant.event_id == participant.event_id,
        participant_model.Participant.member_id == participant.member_id
    ).first()
    if existing_participant:
        raise ValueError(f"User {user.name} is already registered for event '{event.title}'.")


    # If all checks pass, proceed with creation
    db_participant = participant_model.Participant(
        event_id=participant.event_id,
        member_id=participant.member_id,
        registration_date=participant.registration_date,
        status=participant.status
    )
    db.add(db_participant)
    db.commit()
    db.refresh(db_participant)
    return db_participant

def update_participant_status(db: Session, db_participant: participant_model.Participant, status: str) -> participant_model.Participant:
    """Updates the status of a single participant."""
    db_participant.status = status
    db.add(db_participant)
    db.commit()
    db.refresh(db_participant)
    return db_participant

def delete_participants_by_ids(db: Session, ids: List[int]) -> int:
    """Deletes multiple participants by their IDs and returns the count of deleted rows."""
    num_deleted = db.query(participant_model.Participant).filter(participant_model.Participant.id.in_(ids)).delete(synchronize_session=False)
    db.commit()
    return num_deleted