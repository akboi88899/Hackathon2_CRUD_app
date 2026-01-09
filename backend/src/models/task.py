"""Task model and schemas."""
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from uuid import uuid4
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from src.models.user import User


class Task(SQLModel, table=True):
    """Todo task belonging to a user."""
    
    __tablename__ = "tasks"
    
    id: str = Field(
        default_factory=lambda: str(uuid4()),
        primary_key=True,
        description="Unique task identifier (UUID v4)"
    )
    
    user_id: str = Field(
        foreign_key="users.id",
        index=True,
        description="Task owner user ID (foreign key)"
    )
    
    title: str = Field(
        max_length=200,
        description="Task title (required, max 200 chars)"
    )
    
    description: str = Field(
        default="",
        max_length=1000,
        description="Task description (optional, max 1000 chars)"
    )
    
    completed: bool = Field(
        default=False,
        index=True,
        description="Completion status (default False)"
    )
    
    deadline: Optional[datetime] = Field(
        default=None,
        nullable=True,
        description="Task deadline (optional, UTC)"
    )
    
    is_recurring: bool = Field(
        default=False,
        description="Whether task repeats"
    )
    
    recurrence_type: Optional[str] = Field(
        default=None,
        max_length=20,
        description="Recurrence pattern: daily, weekly, monthly"
    )
    
    recurrence_interval: Optional[int] = Field(
        default=None,
        description="Interval for recurrence (e.g., every 2 weeks)"
    )
    
    recurrence_days: Optional[str] = Field(
        default=None,
        max_length=50,
        description="Specific days for weekly recurrence (e.g., 'Mon,Wed,Fri')"
    )
    
    recurrence_end_date: Optional[datetime] = Field(
        default=None,
        nullable=True,
        description="When to stop recurring (optional)"
    )
    
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Creation timestamp (UTC)"
    )
    
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Last update timestamp (UTC)"
    )
    
    user: Optional["User"] = Relationship(back_populates="tasks")


class TaskCreate(SQLModel):
    """Request model for creating task."""
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default="", max_length=1000)
    deadline: Optional[datetime] = None
    is_recurring: Optional[bool] = False
    recurrence_type: Optional[str] = None
    recurrence_interval: Optional[int] = 1
    recurrence_days: Optional[str] = None
    recurrence_end_date: Optional[datetime] = None


class TaskUpdate(SQLModel):
    """Request model for updating task."""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    deadline: Optional[datetime] = None
    is_recurring: Optional[bool] = None
    recurrence_type: Optional[str] = None
    recurrence_interval: Optional[int] = None
    recurrence_days: Optional[str] = None
    recurrence_end_date: Optional[datetime] = None


class TaskRead(SQLModel):
    """Response model for task."""
    id: str
    user_id: str
    title: str
    description: str
    completed: bool
    deadline: Optional[datetime]
    is_recurring: bool
    recurrence_type: Optional[str]
    recurrence_interval: Optional[int]
    recurrence_days: Optional[str]
    recurrence_end_date: Optional[datetime]
    created_at: datetime
    updated_at: datetime
