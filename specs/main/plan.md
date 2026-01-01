# Implementation Plan: Todo In-Memory Python Console Application (Phase I)

**Branch**: `main` | **Date**: 2026-01-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/main/spec.md`

**Note**: This plan follows the Spec-Kit Plus workflow and the Master Constitution v1.0.0.

## Summary

Build a command-line Todo application using Python 3.12.4 that stores data in-memory and provides core CRUD operations (Add, View, Update, Delete, Toggle Complete). This is Phase I of the 5-phase Evolution of Todo Hackathon, implementing only console-based functionality with no persistence, databases, or web interfaces.

## Technical Context

**Language/Version**: Python 3.12.4 (EXACT)  
**Primary Dependencies**: Python standard library (uuid, datetime, sys, os); Optional: rich/colorama for enhanced CLI output  
**Storage**: In-memory Python dictionary (Dict[str, Task])  
**Testing**: Manual CLI verification (no automated tests in Phase I)  
**Target Platform**: Windows/Linux/macOS console  
**Project Type**: Single project (console application)  
**Performance Goals**: Instant response time (<10ms for all operations)  
**Constraints**: No persistence, no databases, no web frameworks, no AI agents, console-only interaction  
**Scale/Scope**: Small-scale personal task management (expected <1000 tasks per session, 5 commands, single-user)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Compliance Status: ✅ PASS

#### Master Constitution v1.0.0 Requirements:

1. **Spec-Driven Development (Section 3)**: ✅ COMPLIANT
   - Code will be generated from approved spec only
   - No manual code editing allowed
   - Spec is single source of truth
   - Refinement process defined

2. **Documentation Rules (Section 4)**: ✅ COMPLIANT
   - Using single evolving spec file: `/specs/main/spec.md`
   - Plan maintained at: `/specs/main/plan.md`
   - No unnecessary Markdown proliferation
   - Changes tracked with version and phase info

3. **Phase Execution Rules (Section 7)**: ✅ COMPLIANT
   - This is Phase I - correctly scoped
   - Spec defined before implementation
   - Acceptance criteria defined
   - Validation approach documented
   - Phase freeze criteria established

4. **Feature Evolution Rules (Section 8)**: ✅ COMPLIANT
   - Phase I implements only: Core CRUD + completion
   - Phase II features (persistence, web) explicitly forbidden
   - Phase III features (AI agents) explicitly forbidden
   - Phase IV/V features (K8s, cloud) explicitly forbidden

5. **Hackathon Alignment (Section 9)**: ✅ COMPLIANT
   - Focus on Phase I core completion
   - Bonus features deferred
   - Clear scope boundaries

6. **Agentic Stack & Tooling (Section 6)**: ✅ COMPLIANT
   - Using Gemini CLI / Copilot CLI as primary interface
   - Claude Code for code generation
   - No LangChain or unapproved frameworks
   - Python standard library only

7. **Quality & Compliance (Section 10)**: ✅ COMPLIANT
   - Deterministic output (in-memory operations)
   - Reproducible (from spec)
   - Cleanly structured (modular design)
   - Phase-aligned (Phase I only)
   - Traceable to spec

### Constitution Violations: NONE

All requirements from the Master Constitution are satisfied for Phase I scope.

## Project Structure

### Documentation (this feature)

```text
specs/main/
├── spec.md              # Feature specification (created)
├── plan.md              # This file (in progress)
├── research.md          # Phase 0 output (to be created)
├── data-model.md        # Phase 1 output (to be created)
├── quickstart.md        # Phase 1 output (to be created)
└── contracts/           # Phase 1 output (N/A for Phase I - no APIs)
```

### Source Code (repository root)

```text
src/
├── __init__.py                    # Package marker
├── main.py                        # Entry point - CLI runner
├── models/
│   ├── __init__.py
│   └── task.py                    # Task entity (dataclass)
├── services/
│   ├── __init__.py
│   └── task_service.py            # Business logic (CRUD + ID prefix + duplicate check)
├── storage/
│   ├── __init__.py
│   └── memory_store.py            # In-memory storage + sorting
└── cli/
    ├── __init__.py
    ├── command_handler.py         # Command dispatcher (interactive prompts only)
    ├── display.py                 # Output formatting
    └── sort_manager.py            # User sorting preference manager

README.md                          # Setup and usage instructions
requirements.txt                   # Optional dependencies (rich/colorama)
.gitignore                         # Python standard ignores
```

**Structure Decision**: Single project structure selected because Phase I is a standalone console application with no web, mobile, or multi-project requirements. All code lives under `/src` following Python best practices with clear separation of concerns:

- **models/**: Data structures and entities
- **services/**: Business logic and operations
- **storage/**: Data persistence layer (in-memory)
- **cli/**: User interface and command handling

This structure supports:
- Clean imports and modularity
- Easy testing (future phases)
- Clear separation of concerns
- Natural evolution to Phase II (persistence layer swap)
- Pythonic conventions (PEP 8 compliant)

## Complexity Tracking

**Status**: NOT APPLICABLE - No constitution violations detected.

All complexity is justified within Phase I scope and Master Constitution compliance.

---

## High-Level Architecture

### Component Diagram (Text-only)

```
┌─────────────────────────────────────────────────────────────┐
│                         User (CLI)                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    main.py (Entry Point)                    │
│  • Initializes components                                   │
│  • Runs command loop (REPL)                                 │
│  • Handles Ctrl+C / exit signals                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  cli/command_handler.py                     │
│  • Parses user input (command only, no args)               │
│  • Dispatches to appropriate command                        │
│  • Interactive prompts for all inputs                       │
│  • Task ID prefix matching (any length if unique)          │
│  • Duplicate title detection with confirmation             │
│  • Moderate error messages (type + reason)                 │
│  • Coordinates with Display for output                      │
└────────────┬────────────────────────────┬───────────────────┘
             │                            │
             ↓                            ↓
┌────────────────────────┐    ┌──────────────────────────────┐
│   cli/display.py       │    │  services/task_service.py    │
│  • Format task list    │    │  • Add task                  │
│  • Format messages     │    │  • Get task by ID or prefix  │
│  • Status indicators   │    │  • Update task               │
│  • Error messages      │    │  • Delete task               │
└────────────────────────┘    │  • Toggle complete           │
                              │  • List all tasks (sorted)   │
                              │  • Check duplicate titles    │
                              │  • Resolve ID prefix         │
                              └──────────┬───────────────────┘
                                         │
                                         ↓
                              ┌──────────────────────────────┐
                              │  storage/memory_store.py     │
                              │  • Dict[str, Task]           │
                              │  • CRUD operations           │
                              │  • O(1) lookups              │
                              │  • Sorting: A/B/C/D options  │
                              │  • Title duplicate check     │
                              │  • ID prefix resolution      │
                              └──────────┬───────────────────┘
                                         │
                                         ↓
                              ┌──────────────────────────────┐
                              │     models/task.py           │
                              │  • Task dataclass            │
                              │  • Factory method            │
                              │  • Validation rules          │
                              │  • Update/toggle methods     │
                              └──────────────────────────────┘
```

### Data Flow

#### Example: Add Task Flow

```
1. User types: "add"
   ↓
2. main.py reads input, passes to CommandHandler
   ↓
3. CommandHandler.dispatch("add", [])
   ↓
4. CommandHandler.handle_add():
   - Prompts for title
   - Prompts for description
   - Validates input
   ↓
5. TaskService.add_task(title, description)
   ↓
6. Task.create(title, description)
   - Generates UUID
   - Sets defaults (completed=False, timestamp)
   ↓
7. MemoryStore.add(task)
   - Stores in dictionary: _tasks[task.id] = task
   ↓
8. Return success to CommandHandler
   ↓
9. Display.show_success(f"Task {task.short_id()} added")
   ↓
10. User sees: "✓ Task added successfully! ID: 550e8400"
```

### Layer Responsibilities

| Layer | Responsibility | Files |
|-------|----------------|-------|
| **Entry** | Application initialization, REPL loop | main.py |
| **CLI** | User interaction, command parsing, output formatting | cli/command_handler.py, cli/display.py |
| **Service** | Business logic, orchestration, validation | services/task_service.py |
| **Storage** | Data persistence (in-memory), CRUD operations | storage/memory_store.py |
| **Model** | Data structures, entity validation, factory methods | models/task.py |

### Design Principles

1. **Separation of Concerns**: Each layer has a single responsibility
2. **Dependency Injection**: Service receives store via constructor
3. **Encapsulation**: Storage implementation hidden behind TaskService
4. **Immutability**: Task IDs and timestamps cannot be changed
5. **Factory Pattern**: Task creation centralized in factory method
6. **Command Pattern**: Commands dispatched through handler dictionary

---

## Implementation Workflow

### Phase 0: Research ✅ COMPLETE
- [x] Created research.md
- [x] All technical decisions documented
- [x] All NEEDS CLARIFICATION resolved
- [x] Best practices identified

### Phase 1: Design & Contracts ✅ COMPLETE
- [x] Created data-model.md (Task entity, MemoryStore)
- [x] Created quickstart.md (user documentation)
- [x] Updated agent context (Copilot instructions)
- [x] No API contracts needed (console-only)

### Phase 2: Task Breakdown (NOT PART OF THIS COMMAND)
Will be handled by `/sp.tasks` command to generate tasks.md:
- Break down implementation into discrete tasks
- Categorize tasks (models, services, CLI, tests, docs)
- Define dependencies between tasks
- Estimate complexity

### Phase 3: Implementation (FUTURE)
Code generation by Claude Code or Gemini CLI:
1. Create models/task.py (Task dataclass)
2. Create storage/memory_store.py (MemoryStore)
3. Create services/task_service.py (TaskService)
4. Create cli/display.py (Display formatting)
5. Create cli/command_handler.py (CommandHandler)
6. Create main.py (Entry point)
7. Create README.md (Setup instructions)
8. Create requirements.txt (Optional dependencies)
9. Create .gitignore (Python ignores)

### Phase 4: Validation (FUTURE)
Manual verification against acceptance criteria:
- Test all 5 commands (add, list, update, delete, toggle)
- Test error handling (empty title, invalid ID)
- Test edge cases (empty list, toggle twice)
- Verify output formatting
- Verify Phase I scope compliance

---

## Feature Breakdown

### Core Features (ALL Required for Phase I)

#### 1. Task Model
**Files**: `models/task.py`
**Description**: Task entity with validation and factory methods
**Acceptance Criteria**:
- Dataclass with id, title, description, completed, created_at
- Factory method generates UUID and timestamp
- Update method validates title/description
- Toggle method flips completed boolean
- Validation: title non-empty, max lengths enforced

#### 2. Memory Storage
**Files**: `storage/memory_store.py`
**Description**: In-memory dictionary-based storage
**Acceptance Criteria**:
- Dict[str, Task] internal structure
- CRUD operations: add, get, get_all, delete
- O(1) lookup by ID
- exists() and count() utility methods
- No persistence (expected behavior)

#### 3. Task Service
**Files**: `services/task_service.py`
**Description**: Business logic orchestration
**Acceptance Criteria**:
- add_task(title, description) creates and stores task after duplicate check with confirmation
- get_task(task_id_or_prefix) retrieves by full ID or unique prefix with error handling
- resolve_id_prefix(prefix) returns full ID or error if ambiguous/not found
- check_duplicate_title(title) returns boolean for duplicate detection
- update_task(task_id_or_prefix, title, description) validates and updates
- delete_task(task_id_or_prefix) removes from storage
- toggle_task(task_id_or_prefix) marks complete/incomplete
- list_tasks(sort_option) returns all tasks with specified sorting (A/B/C/D)
- Moderate error messages: type + reason only

#### 4. Command Handler
**Files**: `cli/command_handler.py`
**Description**: Command parsing and dispatch
**Acceptance Criteria**:
- Command dictionary maps command strings to handlers
- NO command-line arguments; all inputs via interactive prompts
- Interactive prompts for add (title, description, confirmation if duplicate)
- Interactive prompts for update (ID prefix, title, description)
- Interactive prompts for delete (ID prefix)
- Interactive prompts for toggle (ID prefix)
- Moderate error handling (type + reason) for invalid commands and IDs
- ID prefix matching with ambiguity detection
- Help command lists all commands
- Sort command sets user sorting preference
- Exit command terminates application

#### 5. Display Formatter
**Files**: `cli/display.py`
**Description**: Output formatting and presentation
**Acceptance Criteria**:
- Format task list with table layout (sorted by user preference)
- Show ID (8 chars minimum, accept any prefix length for input)
- Show title, description, status, timestamp
- Status indicators: ✓ (complete) / ✗ (incomplete)
- Success messages (green if using rich)
- Moderate error messages (red if using rich): error type + reason only
- Ambiguous ID error lists matching IDs
- Duplicate title warning message
- Fallback to plain text if rich unavailable

#### 6. Entry Point
**Files**: `main.py`
**Description**: Application initialization and REPL
**Acceptance Criteria**:
- Initialize all components (Store, Service, Handler, Display)
- Welcome message with instructions
- Infinite loop reading commands
- Handle Ctrl+C, Ctrl+D, EOF gracefully
- Exit message on quit
- if __name__ == "__main__" pattern

#### 7. Documentation
**Files**: `README.md`, `requirements.txt`, `.gitignore`
**Description**: Setup and usage documentation
**Acceptance Criteria**:
- README: Python version, setup, how to run, example usage
- Document interactive prompt workflow (no command args)
- Document ID prefix matching feature
- Document duplicate title warning behavior
- Document sorting options (A/B/C/D) with default (D)
- Document moderate error message format
- requirements.txt: rich (optional)
- .gitignore: Python standard ignores (__pycache__, *.pyc, etc.)

#### 8. Sort Manager
**Files**: `cli/sort_manager.py`
**Description**: User sorting preference management
**Acceptance Criteria**:
- Store current user sorting preference (in-memory)
- Default: Option D (incomplete first, then by creation time)
- Support options: A (insertion), B (oldest first), C (newest first), D (incomplete first)
- Provide get/set methods for current preference
- Integrate with task listing flow

---

## Validation Strategy

### Manual Testing Checklist

#### Add Task Tests
- [ ] Add task with title only → Success with ID
- [ ] Add task with title and description → Success with details
- [ ] Add task with empty title → Error message
- [ ] Add task with very long title (>200 chars) → Error message
- [ ] Verify UUID generated correctly
- [ ] Verify completed=False by default
- [ ] Verify timestamp in ISO 8601 format

#### List Tasks Tests
- [ ] List when no tasks exist → "No tasks found"
- [ ] List with 1 task → Shows task details
- [ ] List with 3+ tasks → Shows all in creation order
- [ ] Verify ID shortened to 8 characters
- [ ] Verify status indicators (✓/✗) displayed correctly
- [ ] Verify timestamps formatted correctly
- [ ] Verify table alignment

#### Update Task Tests
- [ ] Update title only → Title changed, description unchanged
- [ ] Update description only → Description changed, title unchanged
- [ ] Update both fields → Both changed
- [ ] Update with invalid ID → Error message "Task not found"
- [ ] Update with empty title → Error message
- [ ] Verify updated values in next list command

#### Delete Task Tests
- [ ] Delete existing task → Success message
- [ ] Verify task removed (not in list)
- [ ] Delete invalid ID → Error message "Task not found"
- [ ] Delete same ID twice → Second time fails
- [ ] Delete all tasks → List shows "No tasks found"

#### Toggle Complete Tests
- [ ] Toggle incomplete → marked complete (✓)
- [ ] Toggle complete → marked incomplete (✗)
- [ ] Toggle invalid ID → Error message
- [ ] Toggle multiple times → alternates correctly
- [ ] Verify status in list command

#### Error Handling Tests
- [ ] Invalid command → "Unknown command" message
- [ ] Command with missing arguments → Helpful error
- [ ] Empty input → Ignored (re-prompt)
- [ ] Ctrl+C → Graceful exit
- [ ] Ctrl+D → Graceful exit

#### Integration Tests
- [ ] Full workflow: add → list → update → toggle → delete
- [ ] Multiple tasks workflow
- [ ] Data lost after exit (expected behavior)
- [ ] Application restarts with empty state

### Success Criteria

Phase I is complete when:
1. ✅ All 5 core commands implemented and working
2. ✅ All acceptance criteria met (from spec.md)
3. ✅ Manual testing checklist 100% passed
4. ✅ Code structured under `/src` with proper modules
5. ✅ README.md with clear setup and usage instructions
6. ✅ No manual code edits (spec-driven generation only)
7. ✅ No database, web, or AI components (Phase I scope)
8. ✅ Constitution compliance verified (no violations)

---

## Risk & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Python version mismatch | High | Document exact version (3.12.4) in README and spec |
| Task ID collision | Low | UUID v4 has negligible collision probability |
| Memory limit with many tasks | Low | Phase I scope <1000 tasks, well within limits |
| User confusion with UUID IDs | Medium | Display only first 8 chars, accept partial IDs |
| Data loss on exit | Expected | Document clearly in README and quickstart |
| Incorrect code generation | Medium | Use detailed spec, validate against acceptance criteria |

---

## Phase I Completion Checklist

### Planning (Current Phase)
- [x] Feature specification created (spec.md)
- [x] Implementation plan created (plan.md)
- [x] Research completed (research.md)
- [x] Data model defined (data-model.md)
- [x] Quickstart guide created (quickstart.md)
- [x] Agent context updated (copilot-instructions.md)
- [x] Constitution compliance verified

### Implementation (Next Phase)
- [ ] Task breakdown created (tasks.md via `/sp.tasks`)
- [ ] All source files generated under `/src`
- [ ] README.md created with setup instructions
- [ ] requirements.txt created (if needed)
- [ ] .gitignore created

### Validation (Final Phase)
- [ ] Manual testing checklist completed
- [ ] All acceptance criteria verified
- [ ] Error handling tested
- [ ] Documentation reviewed
- [ ] Phase I frozen and approved

---

## Next Steps

1. **Run `/sp.tasks` command** to generate detailed task breakdown
2. **Generate implementation** using Claude Code or Gemini CLI from tasks
3. **Validate implementation** against manual testing checklist
4. **Document completion** and prepare for Phase II planning

---

**Plan Status**: ✅ COMPLETE  
**Ready for Task Breakdown**: ✅ YES  
**Constitution Compliance**: ✅ VERIFIED  
**Phase**: I - In-Memory Python Console Application  
**Date**: 2026-01-01
