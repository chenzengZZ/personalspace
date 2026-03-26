# AGENTS.md

This file defines the default collaboration rules for the entire repository.

## Scope

These instructions apply to the whole project unless a deeper `AGENTS.md` overrides them.

## Project Collaboration Rules

### 1. Default mode: design before code

Unless the user explicitly says to start coding, default to:

- clarify the goal
- split the task
- identify dependencies and conflicts
- define scope
- define acceptance criteria
- update relevant docs

Do not jump into implementation by default.

### 2. Use threads by goal

Treat one thread as one clear goal.

Examples:

- plan multi-address management
- prepare cloud integration
- create release checklist

Do not mix unrelated goals in the same working thread when avoidable.

### 3. Worktree only for high-conflict themes

Only recommend or use a new worktree when:

- the task touches core flows
- the task may interfere with another active task
- experimental work needs isolation
- stable work must be protected from risky changes

### 4. Multi-agent only when boundaries are clear

Only use multiple agents when:

- subtasks are parallelizable
- ownership is clear
- they do not need to edit the same critical files at the same time

### 5. Documentation is part of the work

Key decisions must be written into project files instead of relying on conversation memory.

Preferred files:

- `docs/CURRENT_TASK.md`
- `docs/HANDOFF_LOG.md`
- `docs/WORKFLOW_CHECKLIST.md`
- `PROJECT.md`
- `CLOUD_HANDOFF.md`

### 6. Required logging points

Update docs at these points:

- after goal confirmation
- after key design decisions
- before coding starts
- before pausing, switching thread, or opening a new window

### 7. Priority rules

When many issues exist, prioritize by:

1. blocks launch goal
2. affects core user flow
3. belongs to a high-conflict theme
4. depends on external real-world conditions
5. can form a minimal closed loop

### 8. Risk levels

Low risk:

- copy
- style
- static layout

Medium risk:

- forms
- address editing
- ordinary page transitions

High risk:

- order creation
- payment
- status transitions
- cloud integration
- global configuration

High-risk work requires design and doc alignment before coding.

### 9. Current user preference for this repo

The user prefers:

- concise but structured reasoning
- explicit explanation of why a task is chosen
- separating "developer action" from "learning explanation"
- strong context continuity through files, not only chat memory

### 10. Current default workflow for this repo

Default sequence:

1. align goal
2. split task
3. analyze dependency/conflict
4. define scope
5. define acceptance criteria
6. document
7. implement
