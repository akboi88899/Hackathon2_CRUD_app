# Data Model: Todo In-Memory Python Console Application (Phase I)

**Date**: 2026-01-01  
**Phase**: 1 - Design & Contracts  
**Feature**: Phase I Todo Console App

---

## Purpose

This document defines all data entities, their fields, relationships, validation rules, and state transitions for the Phase I Todo application.

---

## Entities

### 1. Task

**Description**: Represents a single todo item with title, description, completion status, and metadata.

**Python Implementation**: Dataclass

#### Fields

| Field | Type | Required | Default | Constraints | Description |
|-------|------|----------|---------|-------------|-------------|
| `id` | `str` | Yes | Generated | UUID v4 format | Unique task identifier |
| `title` | `str` | Yes | - | Non-empty, max 200 chars | Task title/summary |
| `description` | `str` | No | `""` | Max 1000 chars | Detailed task description |
| `completed` | `bool` | Yes | `False` | True or False | Completion status |
| `created_at` | `str` | Yes | Generated | ISO 8601 format | Creation timestamp |

#### Field Validation Rules

1. **id**:
   - Format: UUID v4 (e.g., `550e8400-e29b-41d4-a716-446655440000`)
   - Generated automatically via `uuid.uuid4()`
   - Immutable after creation

2. **title**:
   - Cannot be empty or whitespace-only
   - Strip leading/trailing whitespace
   - Maximum length: 200 characters
   - Validation: `if not title.strip(): raise ValueError("Title cannot be empty")`

3. **description**:
   - Optional field (can be empty string)
   - Strip leading/trailing whitespace
   - Maximum length: 1000 characters
   - Default: `""`

4. **completed**:
   - Boolean type only
   - Default: `False` on creation
   - Togglable via toggle command

5. **created_at**:
   - ISO 8601 format (e.g., `2026-01-01T14:22:13.123456`)
   - Generated via `datetime.utcnow().isoformat()`
   - UTC timezone
   - Immutable after creation

#### State Transitions

```
┌─────────────┐
│   Created   │
│ completed = │
│    False    │
└──────┬──────┘
       │
       │ toggle command
       ↓
┌─────────────┐
│  Completed  │
│ completed = │
│    True     │
└──────┬──────┘
       │
       │ toggle command
       ↓
┌─────────────┐
│   Pending   │
│ completed = │
│    False    │
└─────────────┘
       ↓
    (cycle)
```

**State Transition Rules**:
- Tasks start in "Pending" state (`completed = False`)
- Toggle command flips boolean: `True` ↔ `False`
- No other state changes allowed in Phase I
- Deletion removes task from system entirely

#### Entity Relationships

**Phase I**: No relationships (single entity system)

**Future Phases** (Out of Scope):
- Phase II: Task → Category (many-to-one)
- Phase II: Task → Tags (many-to-many)
- Phase III: Task → User (many-to-one)

---

## Data Structures

### 1. TaskStore (In-Memory)

**Description**: Storage manager for all Task entities with sorting and ID prefix resolution.

**Implementation**: Dictionary with UUID keys

**Structure**:
```python
{
    "550e8400-e29b-41d4-a716-446655440000": Task(...),
    "7c9e6679-fe0c-425c-883b-1e1d3e8c9f12": Task(...),
    ...
}
```

**Type Signature**: `Dict[str, Task]`

**Operations**:
- Add: O(1)
- Get by ID: O(1)
- Get by prefix: O(n) for matching
- Update: O(1)
- Delete: O(1)
- List all: O(n)
- Sort: O(n log n)
- Check duplicate title: O(n)

**Sorting Options**:
- **A**: Insertion order (simple list order)
- **B**: Creation time (oldest first)
- **C**: Creation time (newest first)
- **D**: Incomplete first, then by creation time (DEFAULT)

**ID Prefix Matching**:
- Accept any length prefix (minimum 1 character)
- Return full ID if unique match
- Error if ambiguous (multiple matches)
- Error if no matches

**Constraints**:
- Maximum 10,000 tasks (memory limit)
- All data lost on application exit
- No concurrent access (single-threaded)

---

## Python Implementation

### Task Dataclass

```python
from dataclasses import dataclass
from datetime import datetime
import uuid


@dataclass
class Task:
    """
    Represents a todo task with title, description, and completion status.
    
    Attributes:
        id: Unique identifier (UUID v4)
        title: Task title (required, non-empty)
        description: Detailed description (optional)
        completed: Completion status (default False)
        created_at: Creation timestamp (ISO 8601 UTC)
    """
    id: str
    title: str
    description: str
    completed: bool
    created_at: str
    
    @staticmethod
    def create(title: str, description: str = "") -> 'Task':
        """
        Factory method to create a new Task with generated ID and timestamp.
        
        Args:
            title: Task title (required, non-empty)
            description: Task description (optional)
            
        Returns:
            New Task instance
            
        Raises:
            ValueError: If title is empty or whitespace-only
        """
        title = title.strip()
        if not title:
            raise ValueError("Title cannot be empty")
        
        if len(title) > 200:
            raise ValueError("Title cannot exceed 200 characters")
        
        description = description.strip()
        if len(description) > 1000:
            raise ValueError("Description cannot exceed 1000 characters")
        
        return Task(
            id=str(uuid.uuid4()),
            title=title,
            description=description,
            completed=False,
            created_at=datetime.utcnow().isoformat()
        )
    
    def update(self, title: str | None = None, description: str | None = None) -> None:
        """
        Update task title and/or description.
        
        Args:
            title: New title (optional)
            description: New description (optional)
            
        Raises:
            ValueError: If title is empty or whitespace-only
            ValueError: If no fields provided for update
        """
        if title is None and description is None:
            raise ValueError("At least one field must be provided for update")
        
        if title is not None:
            title = title.strip()
            if not title:
                raise ValueError("Title cannot be empty")
            if len(title) > 200:
                raise ValueError("Title cannot exceed 200 characters")
            self.title = title
        
        if description is not None:
            description = description.strip()
            if len(description) > 1000:
                raise ValueError("Description cannot exceed 1000 characters")
            self.description = description
    
    def toggle_completed(self) -> None:
        """Toggle completion status between True and False."""
        self.completed = not self.completed
    
    def short_id(self) -> str:
        """Return first 8 characters of ID for display."""
        return self.id[:8]
    
    def to_dict(self) -> dict:
        """Convert Task to dictionary (for future serialization)."""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'completed': self.completed,
            'created_at': self.created_at
        }
    
    @staticmethod
    def from_dict(data: dict) -> 'Task':
        """Create Task from dictionary (for future deserialization)."""
        return Task(
            id=data['id'],
            title=data['title'],
            description=data['description'],
            completed=data['completed'],
            created_at=data['created_at']
        )
```

### MemoryStore Class

```python
from typing import Dict, List, Optional


class MemoryStore:
    """
    In-memory storage for Task entities using dictionary.
    
    Attributes:
        _tasks: Dictionary mapping task IDs to Task objects
    """
    
    def __init__(self):
        """Initialize empty task store."""
        self._tasks: Dict[str, Task] = {}
    
    def add(self, task: Task) -> None:
        """
        Add task to store.
        
        Args:
            task: Task to add
        """
        self._tasks[task.id] = task
    
    def get(self, task_id: str) -> Optional[Task]:
        """
        Get task by ID.
        
        Args:
            task_id: Task ID to lookup
            
        Returns:
            Task if found, None otherwise
        """
        return self._tasks.get(task_id)
    
    def get_all(self) -> List[Task]:
        """
        Get all tasks ordered by creation time.
        
        Returns:
            List of all tasks
        """
        return list(self._tasks.values())
    
    def get_all_sorted(self, sort_option: str = 'D') -> List[Task]:
        """
        Get all tasks with specified sorting.
        
        Args:
            sort_option: Sorting option (A/B/C/D)
                A: Insertion order
                B: Creation time (oldest first)
                C: Creation time (newest first)
                D: Incomplete first, then by creation time (DEFAULT)
        
        Returns:
            List of sorted tasks
        """
        tasks = list(self._tasks.values())
        
        if sort_option == 'A':
            # Insertion order (as-is)
            return tasks
        elif sort_option == 'B':
            # Oldest first
            return sorted(tasks, key=lambda t: t.created_at)
        elif sort_option == 'C':
            # Newest first
            return sorted(tasks, key=lambda t: t.created_at, reverse=True)
        elif sort_option == 'D':
            # Incomplete first, then by creation time
            return sorted(tasks, key=lambda t: (t.completed, t.created_at))
        else:
            # Default to D
            return sorted(tasks, key=lambda t: (t.completed, t.created_at))
    
    def find_by_prefix(self, prefix: str) -> List[str]:
        """
        Find task IDs matching the given prefix.
        
        Args:
            prefix: ID prefix to search for
            
        Returns:
            List of matching task IDs
        """
        return [task_id for task_id in self._tasks.keys() if task_id.startswith(prefix)]
    
    def check_duplicate_title(self, title: str) -> bool:
        """
        Check if a task with the given title already exists.
        
        Args:
            title: Task title to check
            
        Returns:
            True if duplicate exists, False otherwise
        """
        normalized_title = title.strip().lower()
        return any(task.title.strip().lower() == normalized_title for task in self._tasks.values())
    
    def delete(self, task_id: str) -> bool:
        """
        Delete task by ID.
        
        Args:
            task_id: Task ID to delete
            
        Returns:
            True if task was deleted, False if not found
        """
        if task_id in self._tasks:
            del self._tasks[task_id]
            return True
        return False
    
    def exists(self, task_id: str) -> bool:
        """
        Check if task exists.
        
        Args:
            task_id: Task ID to check
            
        Returns:
            True if task exists, False otherwise
        """
        return task_id in self._tasks
    
    def count(self) -> int:
        """
        Get total number of tasks.
        
        Returns:
            Task count
        """
        return len(self._tasks)
```

---

## Validation Summary

### Creation Validation
- ✅ Title is required and non-empty
- ✅ Title max length: 200 characters
- ✅ Description max length: 1000 characters
- ✅ ID is auto-generated UUID v4
- ✅ created_at is auto-generated ISO 8601 timestamp
- ✅ completed defaults to False

### Update Validation
- ✅ At least one field must be provided
- ✅ Title cannot be empty if provided
- ✅ Title max length: 200 characters
- ✅ Description max length: 1000 characters
- ✅ ID and created_at are immutable
- ✅ ID prefix accepted (any length if unique)
- ✅ Ambiguous prefix rejected with error listing matches

### Toggle Validation
- ✅ Task must exist
- ✅ Completed field flips boolean value

### Delete Validation
- ✅ Task must exist (returns False if not found)
- ✅ Task removed from storage

---

## Future Evolution

### Phase II Additions (Out of Scope for Phase I):
- Add `category_id` field (optional, foreign key)
- Add `tags` field (list of strings)
- Add `priority` field (enum: low, medium, high)
- Add `due_date` field (optional ISO 8601 date)
- Add `updated_at` field (timestamp of last modification)

### Phase III Additions (Out of Scope for Phase I):
- Add `user_id` field (foreign key)
- Add `ai_suggestions` field (list of AI-generated suggestions)

---

## Acceptance Criteria

- [x] Task entity fully defined with all required fields
- [x] Validation rules specified for all fields
- [x] State transitions documented
- [x] Python dataclass implementation provided
- [x] MemoryStore implementation provided
- [x] Factory method for task creation
- [x] Update and toggle methods defined
- [x] Serialization methods for future phases
- [x] All field constraints documented
- [x] No database dependencies

---

**Data Model Complete**: 2026-01-01  
**Constitution Compliance**: ✅ Spec-driven, Phase I scope only  
**Ready for Implementation**: ✅
