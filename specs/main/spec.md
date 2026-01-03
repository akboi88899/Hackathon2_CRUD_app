# Feature Specification: Todo In-Memory Python Console Application (Phase I)

**Version**: 1.0.0  
**Date**: 2026-01-01  
**Phase**: I - In-Memory Python Console App  
**Spec Type**: Backend Logic (Console-Based)

---

## 1. PURPOSE

Build a command-line Todo application that stores all data strictly in-memory and demonstrates core CRUD functionality using Python 3.12.4.

This is Phase I of the "Evolution of Todo – 5-Phase Hackathon" project, operating under the Master Constitution.

---

## 2. SCOPE

### IN SCOPE (Phase I)
- Add Task
- Delete Task
- Update Task
- View Task List
- Mark Task as Complete / Incomplete
- In-memory storage using Python data structures
- Console/CLI interaction only

### OUT OF SCOPE (Future Phases)
- Database usage (Neon/Postgres)
- Web UI
- API endpoints
- AI agents
- Persistence across sessions
- Advanced features (filtering, categories, priorities)

---

## 3. FUNCTIONAL REQUIREMENTS

### FR1: Add Task
**Description**: User can add a new task with title and description.

**Acceptance Criteria**:
- Task is assigned a unique UUID v4 identifier
- Task has title (required, non-empty string)
- Task has description (optional, can be empty string)
- Task starts with `completed = False`
- Task has `created_at` timestamp
- Success message confirms task creation with ID
- Check for duplicate titles; warn user and require confirmation if duplicate found

**Input**: Title and description via interactive CLI prompts only (no command arguments)
**Output**: Confirmation message with task ID; moderate error messages showing error type + reason

---

### FR2: View Task List
**Description**: User can view all tasks with their details.

**Acceptance Criteria**:
- DEFAULT: Display incomplete tasks first, then by creation time
- Support user-configurable sorting options:
  - Option A: Insertion order (simple list order)
  - Option B: Creation time (oldest first)
  - Option C: Creation time (newest first)
  - Option D: Incomplete first, then by creation time (DEFAULT)
- Show task ID (first 8 characters for readability; accept any length prefix if unique)
- Show task title
- Show task description
- Show completion status (✓ or ✗ or similar indicator)
- Show created_at timestamp
- Handle empty list gracefully ("No tasks found")

**Input**: View command; optional sort parameter
**Output**: Formatted list of all tasks sorted by selected option

---

### FR3: Update Task
**Description**: User can update title and/or description of an existing task.

**Acceptance Criteria**:
- User provides task ID (any length prefix accepted if unique; fail if ambiguous)
- User can update title (optional)
- User can update description (optional)
- At least one field must be updated
- Invalid ID returns moderate error message (error type + reason)
- Ambiguous ID prefix returns error listing matching IDs
- Success message confirms update

**Input**: Task ID via interactive prompt, new title and/or description via prompts
**Output**: Confirmation message or moderate error (type + reason)

---

### FR4: Delete Task
**Description**: User can delete a task by ID.

**Acceptance Criteria**:
- User provides task ID (any length prefix accepted if unique; fail if ambiguous)
- Task is removed from in-memory store
- Invalid ID returns moderate error message (error type + reason)
- Ambiguous ID prefix returns error listing matching IDs
- Success message confirms deletion

**Input**: Task ID via interactive prompt
**Output**: Confirmation message or moderate error (type + reason)

---

### FR5: Mark Task Complete/Incomplete
**Description**: User can toggle task completion status.

**Acceptance Criteria**:
- User provides task ID (any length prefix accepted if unique; fail if ambiguous)
- Task `completed` field is toggled
- Invalid ID returns moderate error message (error type + reason)
- Ambiguous ID prefix returns error listing matching IDs
- Success message shows new status

**Input**: Task ID via interactive prompt
**Output**: Confirmation message with new status or moderate error (type + reason)

---

## 4. DATA MODEL

### Task Entity

```python
{
    "id": str,          # UUID v4 as string
    "title": str,       # Required, non-empty
    "description": str, # Optional, can be empty
    "completed": bool,  # Default: False
    "created_at": str   # ISO 8601 datetime string
}
```

### In-Memory Storage
- Python dictionary keyed by task ID
- Structure: `Dict[str, Task]`
- No persistence required
- Data lost on application exit

---

## 5. INTERFACE REQUIREMENTS

### CLI Commands
The application MUST support the following commands:

1. **add** - Add a new task (interactive prompts only)
2. **list** - View all tasks (with optional sort parameter)
3. **update** - Update a task (interactive prompts only)
4. **delete** - Delete a task (interactive prompts only)
5. **toggle** - Mark task complete/incomplete (interactive prompts only)
6. **sort** - Configure task display sorting preference
7. **exit/quit** - Exit application

### Command Flow
- Interactive REPL-style interface (NO command-line arguments)
- All inputs via interactive prompts after command invocation
- Clear command prompt
- Moderate error messages (error type + reason)
- Task ID prefix matching (any length accepted if unique; error if ambiguous)
- Duplicate title warnings with confirmation prompt
- Graceful handling of invalid inputs
- Exit confirmation (optional)

---

## 6. NON-FUNCTIONAL REQUIREMENTS

### NFR1: Code Quality
- Clean, modular Python code
- Proper separation of concerns
- No monolithic scripts
- Pythonic naming conventions (PEP 8)

### NFR2: User Experience
- Clear, readable output
- Intuitive command names
- Moderate error messages: Show error type + reason (not stack traces)
- Consistent formatting
- Task ID prefix matching for convenience (any length if unique)
- Duplicate task title warnings with confirmation option
- User-configurable sorting preferences

### NFR3: Performance
- Instant response time (in-memory operations)
- No external dependencies for core functionality

### NFR4: Structure
- Code organized under `/src` directory
- Proper module structure
- Entry point clearly defined

---

## 7. VALIDATION & ACCEPTANCE

### Manual Verification Steps

1. **Add Task Test**
   - Add task with title only
   - Add task with title and description
   - Verify UUID generation
   - Verify initial completed=False

2. **List Tasks Test**
   - List empty tasks (initial state)
   - List after adding 3+ tasks
   - Verify all fields display correctly
   - Verify completion status indicators

3. **Update Task Test**
   - Update title only
   - Update description only
   - Update both fields
   - Test with invalid ID

4. **Delete Task Test**
   - Delete existing task
   - Verify task removed from list
   - Test with invalid ID

5. **Toggle Complete Test**
   - Mark task complete
   - Mark task incomplete
   - Test with invalid ID

6. **Error Handling Test**
   - Invalid commands
   - Empty task title
   - Malformed IDs

### Phase I Completion Criteria

- [ ] All 5 core commands implemented
- [ ] All acceptance criteria met
- [ ] Manual verification completed successfully
- [ ] Code organized under `/src`
- [ ] README.md with setup and usage instructions
- [ ] No manual code edits (spec-driven only)

---

## 8. CLARIFICATIONS

### Session 2026-01-01

- Q: CLI Command Format (Interactive vs. Argument-based) → A: Interactive prompts only (Option B)
- Q: Task ID Input Format (Full UUID vs. Prefix matching) → A: Any length prefix if unique, fail if ambiguous (Option D)
- Q: Error Message Verbosity (Minimal vs. Detailed) → A: Moderate: Error type + reason (Option B)
- Q: Task Uniqueness Check (Duplicate titles allowed?) → A: Warn but allow on confirmation (Option C)
- Q: Task Display Order Stability (Sorting behavior) → A: Option D (incomplete first) as DEFAULT + user-configurable sorting options (A/B/C/D available)

---

## 9. TECHNICAL CONSTRAINTS

### Language & Version
- Python 3.12.4 (EXACT VERSION)

### Allowed Dependencies
- Standard library only for core functionality
- `uuid` for ID generation
- `datetime` for timestamps
- `sys`, `os` for CLI interaction
- Optional: `rich` or `colorama` for enhanced CLI output (if needed)

### Prohibited
- No databases (SQLite, PostgreSQL, etc.)
- No web frameworks (Flask, FastAPI, etc.)
- No REST/GraphQL APIs
- No AI/ML libraries
- No external file storage

---

## 10. IMPLEMENTATION APPROACH

### Development Methodology
- Spec-Driven Development (SDD) using Spec-Kit Plus
- Implementation MUST be generated from this spec
- No manual code editing allowed
- If output is incorrect, refine spec and regenerate

### Workflow
1. This spec is the source of truth
2. Generate implementation plan
3. Generate task breakdown
4. Use Claude Code or Gemini CLI to generate code
5. Validate against acceptance criteria
6. If issues found, update spec and regenerate

---

## 11. DELIVERABLES

### Required Files

1. **`/src/main.py`** - Entry point
2. **`/src/models/task.py`** - Task entity model
3. **`/src/services/task_service.py`** - Business logic with duplicate detection and ID prefix matching
4. **`/src/cli/command_handler.py`** - CLI command processing (interactive prompts only)
5. **`/src/storage/memory_store.py`** - In-memory storage with sorting capabilities
6. **`/src/cli/sort_manager.py`** - User sorting preference management
7. **`README.md`** - Setup and usage instructions

### Documentation Requirements

- README.md must include:
  - Project description
  - Python version requirement
  - Setup instructions (if any dependencies)
  - How to run the application
  - Example usage for each command
  - Phase I scope clarification

---

## 12. FUTURE EVOLUTION (NOT IN PHASE I)

Phase II will add:
- Persistent storage (database)
- Web interface
- RESTful API
- Task categories and priorities
- Filtering and search

Phase III will add:
- AI-powered chatbot interface
- Natural language task management

Phases IV & V will add:
- Kubernetes deployment
- Cloud-native architecture

**These features are FORBIDDEN in Phase I.**

---

## CHANGE LOG

| Version | Date | Changes | Phase |
|---------|------|---------|-------|
| 1.0.0 | 2026-01-01 | Initial specification | I |

---

**Approved**: 2026-01-01  
**Constitution Compliance**: ✓ Verified against Master Constitution v1.0.0
