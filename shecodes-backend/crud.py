# /shecodes-backend/crud.py

from sqlalchemy.orm import Session
from typing import Optional, List, Type
from sqlalchemy import or_
from pydantic import BaseModel

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
    portfolio as portfolio_model,
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
    portfolio as portfolio_schema,
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
    """Creates a new user in the database with a hashed password."""
    hashed_password = get_password_hash(user.password)
    
    # Create the user model with only the required fields
    # The other fields in the DB will use their default values (e.g., NULL, 'member')
    db_user = user_model.User(
        email=user.email,
        name=user.name,
        password=hashed_password,
        is_verified=False
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, db_user: user_model.User, user_in: user_schema.UserUpdate) -> user_model.User:
    return update_generic_item(db, db_item=db_user, schema_in=user_in)

def delete_user(db: Session, user_id: str) -> Optional[user_model.User]:
    return delete_generic_item(db, model=user_model.User, item_id=user_id)

def authenticate_user(db: Session, email: str, password: str) -> Optional[user_model.User]:
    user = get_user_by_email(db, email=email)
    if not user:
        return {"status": "not_found"}
    if not verify_password(password, user.password):
        return {"status": "wrong_password"}
    if user.is_verified == False:
        return {"status": "inactive"}
    return {"status": "authenticated", "user": user}

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

def get_all_blogs(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    category: Optional[blog_schema.ArticleCategoryEnum] = None, # Optional category filter
    exclude_id: Optional[int] = None # Optional ID to exclude
) -> List[blog_model.BlogArticle]:
    """
    Retrieves all blog articles with optional filtering by category
    and an option to exclude a specific article by its ID.
    Articles are sorted by published date in descending order.
    """
    # Start with a base query
    query = db.query(blog_model.BlogArticle)

    # Apply category filter if provided
    if category:
        query = query.filter(blog_model.BlogArticle.category == category)

    # Apply exclusion filter if provided
    if exclude_id is not None:
        query = query.filter(blog_model.BlogArticle.id != exclude_id)
    
    # Order by most recent first, then apply limit and skip for pagination
    blogs = query.order_by(blog_model.BlogArticle.published_at.desc()).offset(skip).limit(limit).all()
    
    return blogs

def get_blog_by_id(db: Session, blog_id: int):
    return db.query(blog_model.BlogArticle).filter(blog_model.BlogArticle.id == blog_id).first()

def get_blog_by_slug(db: Session, slug: str):
    return db.query(blog_model.BlogArticle).filter(blog_model.BlogArticle.slug == slug).first()

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
#               Comment CRUD (Updated)
# ===============================================

def get_comment(db: Session, comment_id: int) -> Optional[comment_model.Comment]:
    return db.query(comment_model.Comment).filter(comment_model.Comment.id == comment_id).first()

def get_comments_by_discussion(db: Session, discussion_id: str) -> List[comment_model.Comment]:
    try:
        main_comment_id = int(discussion_id)
        return db.query(comment_model.Comment).filter(
            or_(
                comment_model.Comment.id == main_comment_id, 
                comment_model.Comment.parent_id == main_comment_id
            )
        ).order_by(comment_model.Comment.date).all()
    except ValueError:
        return db.query(comment_model.Comment).filter(
            comment_model.Comment.discussion_id == discussion_id
        ).order_by(comment_model.Comment.date.desc()).all()

def create_comment(db: Session, comment: comment_schema.CommentCreate) -> comment_model.Comment:
    db_comment = comment_model.Comment(**comment.model_dump())
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

def toggle_comment_like(db: Session, comment_id: int, user_id: str) -> Optional[comment_model.Comment]:
    """
    Adds a like if it doesn't exist, or removes it if it does.
    Returns the updated comment object.
    """
    like = db.query(comment_model.CommentLike).filter(
        comment_model.CommentLike.comment_id == comment_id,
        comment_model.CommentLike.user_id == user_id
    ).first()

    if like:
        # User has already liked it, so unlike (delete the record)
        db.delete(like)
        db.commit()
    else:
        # User has not liked it, so like (create the record)
        new_like = comment_model.CommentLike(comment_id=comment_id, user_id=user_id)
        db.add(new_like)
        db.commit()

    # Return the updated comment to get the new like count
    return get_comment(db, comment_id)

def get_liked_comment_ids_by_user(db: Session, user_id: str) -> List[int]:
    """
    Returns a list of all comment IDs a specific user has liked.
    """
    liked_comments = db.query(comment_model.CommentLike.comment_id).filter(
        comment_model.CommentLike.user_id == user_id
    ).all()
    # The result is a list of tuples, e.g., [(1,), (5,)], so we extract the first element
    return [item[0] for item in liked_comments]

def delete_comment(db: Session, comment_id: int) -> Optional[comment_model.Comment]:
    db_comment = get_comment(db, comment_id)
    if db_comment:
        db.delete(db_comment)
        db.commit()
    return db_comment

# ===============================================
#               Generic CRUD Functions
# ===============================================
# These can be used for simple models like Contact, FAQ, Documentation, Champion, Admin, Portfolio
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

def _update_one_to_many_relationship(
    db: Session,
    db_collection: List[Type[BaseModel]],
    incoming_data: List[BaseModel],
    model_class: Type[event_model.Base] # type: ignore
):
    """
    Synchronizes a one-to-many database collection with incoming data.

    - Deletes items from the database that are not in the incoming data.
    - Updates items that are in both the database and incoming data.
    - Creates new items from the incoming data that are not in the database.

    Args:
        db: The database session.
        db_collection: The SQLAlchemy relationship collection from the parent object (e.g., db_event.skills).
        incoming_data: The list of Pydantic models from the request.
        model_class: The SQLAlchemy model class for the items (e.g., event_model.Skill).
    """
    db_items_map = {item.id: item for item in db_collection}
    incoming_ids = {item.id for item in incoming_data if item.id is not None}

    # 1. Delete: Find items in the DB that are not in the incoming data
    ids_to_delete = db_items_map.keys() - incoming_ids
    for id_to_delete in ids_to_delete:
        db.delete(db_items_map[id_to_delete])

    # 2. Update and Create
    for item_data in incoming_data:
        item_dict = item_data.model_dump(exclude_unset=True)
        
        if item_data.id is not None and item_data.id in db_items_map:
            # Update existing item
            db_item = db_items_map[item_data.id]
            for key, value in item_dict.items():
                setattr(db_item, key, value)
        elif item_data.id is None:
            # Create new item
            new_item = model_class(**item_dict)
            db_collection.append(new_item)

def update_event(db: Session, db_event: event_model.Event, event_in: event_schema.EventUpdate) -> event_model.Event:
    # 1. Get update data, excluding relationships which are handled separately
    update_data = event_in.model_dump(
        exclude_unset=True,
        exclude={'mentors', 'skills', 'benefits', 'sessions'}
    )
    
    # 2. Update the top-level fields on the Event object
    for key, value in update_data.items():
        setattr(db_event, key, value)
        
    # 3. Handle relationship updates if they are provided in the payload
    
    # Mentors (Many-to-Many): Clear and replace
    if event_in.mentors is not None:
        mentors = db.query(mentor_model.Mentor).filter(mentor_model.Mentor.id.in_(event_in.mentors)).all()
        db_event.mentors = mentors

    # Skills (One-to-Many): Synchronize
    if event_in.skills is not None:
        _update_one_to_many_relationship(db, db_event.skills, event_in.skills, event_model.Skill)

    # Benefits (One-to-Many): Synchronize
    if event_in.benefits is not None:
        _update_one_to_many_relationship(db, db_event.benefits, event_in.benefits, event_model.Benefit)

    # Sessions (One-to-Many): Synchronize
    if event_in.sessions is not None:
        _update_one_to_many_relationship(db, db_event.sessions, event_in.sessions, event_model.Session)

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
#               Portfolio CRUD (User-Specific)
# ===============================================

def create_portfolio_project(db: Session, schema: portfolio_schema.PortfolioProjectCreate, user_id: str) -> portfolio_model.PortfolioProject:
    """Creates a new portfolio project linked to a specific user."""
    db_item = portfolio_model.PortfolioProject(**schema.model_dump(), user_id=user_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def get_portfolio_projects_by_user_id(db: Session, user_id: str, skip: int = 0, limit: int = 100) -> List[portfolio_model.PortfolioProject]:
    """Retrieves all portfolio projects for a specific user."""
    return db.query(portfolio_model.PortfolioProject).filter(portfolio_model.PortfolioProject.user_id == user_id).offset(skip).limit(limit).all()

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

def update_participant_certificate(db: Session, db_participant: participant_model.Participant, certificate_url: str) -> participant_model.Participant:
    """Updates the certificate URL for a single participant."""
    db_participant.certificate_url = certificate_url
    db.add(db_participant)
    db.commit()
    db.refresh(db_participant)
    return db_participant

def delete_participants_by_ids(db: Session, ids: List[int]) -> int:
    """Deletes multiple participants by their IDs and returns the count of deleted rows."""
    if not ids:
        return 0
    num_deleted = db.query(participant_model.Participant).filter(participant_model.Participant.id.in_(ids)).delete(synchronize_session=False)
    db.commit()
    return num_deleted