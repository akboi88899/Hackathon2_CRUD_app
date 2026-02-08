# Quickstart Guide: Todo In-Memory Python Console Application (Phase I)

**Version**: 1.0.0  
**Date**: 2026-01-01  
**Phase**: I - In-Memory Python Console App

---

## Overview

This quickstart guide helps you set up, run, and use the Phase I Todo console application. The application provides command-line task management with in-memory storage.

**Phase I Features**:
- ✅ Add tasks with title and description
- ✅ List all tasks
- ✅ Update task title and description
- ✅ Delete tasks by ID
- ✅ Mark tasks complete/incomplete
- ✅ In-memory storage (no persistence)

---

## Prerequisites

### Required
- **Python 3.12.4** (EXACT VERSION)
- Terminal/Command prompt access
- Text editor (for viewing code)

### Optional
- Git (for cloning repository)

---

## Installation

### 1. Clone Repository (if using Git)

```bash
git clone <repository-url>
cd Hackathon2_CRUD_task_with_agent
```

### 2. Verify Python Version

```bash
python --version
# Should output: Python 3.12.4
```

If you have multiple Python versions:
```bash
python3.12 --version
```

### 3. Install Optional Dependencies (Enhanced UI)

```bash
pip install rich
```

**Note**: The application works without `rich`, but it provides better formatting.

---

## Running the Application

### Start the Application

```bash
python src/main.py
```

Or if using Python 3.12 specifically:
```bash
python3.12 src/main.py
```

### Expected Output

```
Todo Application (Phase I)
Type 'help' for commands, 'exit' to quit

todo> _
```

---

## Commands Reference

### 1. Add Task

**Syntax**: `add`

**Description**: Add a new task interactively.

**Example**:
```
todo> add
Enter task title: Buy groceries
Enter task description (optional): Milk, bread, and eggs
✓ Task added successfully! ID: 550e8400
```

**Notes**:
- Title is required (cannot be empty)
- Description is optional (press Enter to skip)
- Task ID is auto-generated (UUID v4)

---

### 2. List Tasks

**Syntax**: `list`

**Description**: Display all tasks with details.

**Example**:
```
todo> list

Tasks (2 total):
┌──────────┬──────────────────────┬─────────────────┬────────┬─────────────────────┐
│ ID       │ Title                │ Description     │ Status │ Created             │
├──────────┼──────────────────────┼─────────────────┼────────┼─────────────────────┤
│ 550e8400 │ Buy groceries        │ Milk and bread  │ ✗      │ 2026-01-01 14:22:13 │
│ 7c9e6679 │ Write documentation  │ Phase I spec    │ ✓      │ 2026-01-01 14:25:30 │
└──────────┴──────────────────────┴─────────────────┴────────┴─────────────────────┘
```

**Status Indicators**:
- ✗ = Incomplete (pending)
- ✓ = Complete

**Notes**:
- Shows all tasks in creation order
- Empty list displays: "No tasks found"
- ID shown is first 8 characters of UUID

---

### 3. Update Task

**Syntax**: `update <task_id>`

**Description**: Update task title and/or description.

**Example**:
```
todo> update 550e8400
Update title (press Enter to skip): Buy groceries and toiletries
Update description (press Enter to skip): Milk, bread, eggs, shampoo
✓ Task 550e8400 updated successfully
```

**Notes**:
- Task ID can be full UUID or first 8 characters
- At least one field must be updated (both can be skipped only if neither is changed)
- Press Enter to keep existing value

---

### 4. Delete Task

**Syntax**: `delete <task_id>`

**Description**: Permanently delete a task.

**Example**:
```
todo> delete 7c9e6679
✓ Task 7c9e6679 deleted successfully
```

**Notes**:
- Task ID can be full UUID or first 8 characters
- Deletion is immediate and permanent
- No undo functionality in Phase I

---

### 5. Toggle Complete

**Syntax**: `toggle <task_id>`

**Description**: Mark task as complete or incomplete.

**Example**:
```
todo> toggle 550e8400
✓ Task 550e8400 marked as complete

todo> toggle 550e8400
✓ Task 550e8400 marked as incomplete
```

**Notes**:
- Toggles between complete (✓) and incomplete (✗)
- Task ID can be full UUID or first 8 characters

---

### 6. Help

**Syntax**: `help`

**Description**: Display available commands.

**Example**:
```
todo> help

Available Commands:
  add              Add a new task
  list             Display all tasks
  update <id>      Update task title/description
  delete <id>      Delete a task
  toggle <id>      Mark task complete/incomplete
  help             Show this help message
  exit, quit       Exit application
```

---

### 7. Exit

**Syntax**: `exit` or `quit`

**Description**: Exit the application.

**Example**:
```
todo> exit
Goodbye!
```

**Notes**:
- All data is lost on exit (in-memory only)
- Can also use `Ctrl+C` or `Ctrl+D` to exit

---

## Usage Examples

### Complete Workflow

```bash
# Start application
$ python src/main.py

# Add first task
todo> add
Enter task title: Learn Python
Enter task description (optional): Complete Python tutorial
✓ Task added successfully! ID: 12345678

# Add second task
todo> add
Enter task title: Build todo app
Enter task description (optional): Phase I implementation
✓ Task added successfully! ID: abcdef12

# List tasks
todo> list
Tasks (2 total):
┌──────────┬──────────────────┬─────────────────────┬────────┬─────────────────────┐
│ ID       │ Title            │ Description         │ Status │ Created             │
├──────────┼──────────────────┼─────────────────────┼────────┼─────────────────────┤
│ 12345678 │ Learn Python     │ Complete tutorial   │ ✗      │ 2026-01-01 10:00:00 │
│ abcdef12 │ Build todo app   │ Phase I impl        │ ✗      │ 2026-01-01 10:05:00 │
└──────────┴──────────────────┴─────────────────────┴────────┴─────────────────────┘

# Mark first task complete
todo> toggle 12345678
✓ Task 12345678 marked as complete

# Update second task
todo> update abcdef12
Update title (press Enter to skip): Build todo app - Phase I
Update description (press Enter to skip): Implement CRUD operations
✓ Task abcdef12 updated successfully

# List tasks again
todo> list
Tasks (2 total):
┌──────────┬──────────────────────┬─────────────────────┬────────┬─────────────────────┐
│ ID       │ Title                │ Description         │ Status │ Created             │
├──────────┼──────────────────────┼─────────────────────┼────────┼─────────────────────┤
│ 12345678 │ Learn Python         │ Complete tutorial   │ ✓      │ 2026-01-01 10:00:00 │
│ abcdef12 │ Build todo app - P1  │ Implement CRUD      │ ✗      │ 2026-01-01 10:05:00 │
└──────────┴──────────────────────┴─────────────────────┴────────┴─────────────────────┘

# Delete completed task
todo> delete 12345678
✓ Task 12345678 deleted successfully

# Exit application
todo> exit
Goodbye!
```

---

## Error Handling

### Common Errors and Solutions

#### 1. Empty Title Error
```
todo> add
Enter task title: 
✗ Error: Title cannot be empty
```
**Solution**: Provide a non-empty title.

---

#### 2. Task Not Found Error
```
todo> update 99999999
✗ Error: Task 99999999 not found
```
**Solution**: Use `list` command to find valid task IDs.

---

#### 3. Invalid Command Error
```
todo> remove
✗ Unknown command: remove
Type 'help' for available commands
```
**Solution**: Use `help` to see available commands. (Correct command is `delete`)

---

#### 4. No Tasks to Display
```
todo> list
No tasks found. Use 'add' to create your first task.
```
**Solution**: Add tasks using the `add` command.

---

## Tips & Best Practices

### 1. Using Short IDs
You can use just the first 8 characters of a task ID:
```
# Full ID
todo> delete 550e8400-e29b-41d4-a716-446655440000

# Short ID (recommended)
todo> delete 550e8400
```

### 2. Empty Descriptions
Descriptions are optional and can be left empty:
```
todo> add
Enter task title: Quick task
Enter task description (optional): [press Enter]
✓ Task added successfully!
```

### 3. Data Persistence
**IMPORTANT**: All data is stored in memory only. When you exit the application, all tasks are lost. This is expected behavior for Phase I.

### 4. Task Organization
Since Phase I has no categories or priorities, use clear task titles:
```
✓ Good: "Buy groceries - urgent"
✗ Poor: "Buy stuff"
```

---

## Keyboard Shortcuts

- `Ctrl+C` - Exit application (Linux/Mac/Windows)
- `Ctrl+D` - Exit application (Linux/Mac)
- `Ctrl+Z` then `Enter` - Exit application (Windows)

---

## Troubleshooting

### Python Version Issues

**Problem**: Wrong Python version installed.

**Solution**:
```bash
# Check version
python --version

# Use specific version
python3.12 src/main.py
```

### Module Not Found Errors

**Problem**: `ModuleNotFoundError: No module named 'src'`

**Solution**: Run from repository root directory:
```bash
cd Hackathon2_CRUD_task_with_agent
python src/main.py
```

### Rich Library Not Found

**Problem**: `ModuleNotFoundError: No module named 'rich'`

**Solution**: Application works without rich. Install it for better formatting:
```bash
pip install rich
```

---

## Phase I Limitations

### What's NOT Included (Future Phases)

- ❌ Persistent storage (data lost on exit)
- ❌ Database integration
- ❌ Web interface
- ❌ API endpoints
- ❌ Task categories
- ❌ Task priorities
- ❌ Due dates
- ❌ Task filtering/search
- ❌ User accounts
- ❌ AI features

These features will be added in Phases II-V.

---

## Next Steps

After completing Phase I:
1. Verify all 5 commands work correctly
2. Test error handling scenarios
3. Review code structure under `/src`
4. Proceed to Phase II planning (persistence + web UI)

---

## Getting Help

### Command Help
```
todo> help
```

### Documentation
- See `/specs/main/spec.md` for detailed specification
- See `/specs/main/data-model.md` for data structures
- See README.md for project overview

### Common Questions

**Q: How do I save my tasks?**  
A: Phase I does not support persistence. Tasks are lost on exit. Use Phase II for database storage.

**Q: Can I use task names instead of IDs?**  
A: No, Phase I requires UUID-based IDs. Use the first 8 characters for convenience.

**Q: How do I undo a delete?**  
A: Phase I has no undo functionality. Be careful when deleting tasks.

**Q: Can I import/export tasks?**  
A: Not in Phase I. This feature may be added in future phases.

---

## Validation Checklist

Use this checklist to verify Phase I completion:

- [ ] Application starts without errors
- [ ] Can add task with title only
- [ ] Can add task with title and description
- [ ] Can list tasks (empty and with tasks)
- [ ] Can update task title
- [ ] Can update task description
- [ ] Can update both title and description
- [ ] Can delete existing task
- [ ] Cannot delete non-existent task (error message)
- [ ] Can toggle task to complete
- [ ] Can toggle task back to incomplete
- [ ] Cannot update/delete/toggle with invalid ID (error message)
- [ ] Help command shows all commands
- [ ] Exit command closes application
- [ ] Empty title shows error
- [ ] All data lost after exit (expected)

---

**Quickstart Version**: 1.0.0  
**Last Updated**: 2026-01-01  
**Phase**: I - In-Memory Console App  
**Status**: Ready for Implementation ✅
