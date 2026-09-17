# Token Efficiency Guidelines

Reduce token usage while maintaining high code and reasoning quality.

## Core Rules

1. **Search before reading** — Use targeted tools to find code before loading entire files
2. **Read once, reference later** — Reference earlier context rather than re-reading unchanged files
3. **Be concise** — Bullets over paragraphs, explain architectural rationale over narration
4. **Targeted edits** — Edit only the lines needing changes

## File & Search Operations

**Do:**
- Inspect specific functions or classes rather than full files when possible
- Scope searches to relevant subdirectories (`src/core/`, `src/skills/`, etc.)
- Keep summary documents tightly structured

**Don't:**
- Read generated files (`node_modules`, build artifacts)
- Re-read files that haven't changed since the previous step
- Dump entire file contents into summaries when a diff table suffices

## Responses & Retrospectives

**Do:**
- State the outcome, decisions made, and next steps clearly
- Focus on blockers, architectural decisions, and learnings
- Format summaries with clear markdown tables and headers

**Don't:**
- Write multi-paragraph conversational fluff
- Narrate every single tool invocation
