# Session Summary Templates

Two tiers: **Lean** for short/narrow sessions, **Full** for substantial architectural and implementation work.

---

## Lean Template

For config changes, single hook additions, small bug fixes, or minor doc updates.

```markdown
# Session Summary: [FEATURE_NAME]

**Date:** YYYY-MM-DD HH:MM
**Session Focus:** [one-line description]

## Completed Work

- [bullet point]
- [bullet point]

## Key Files Modified

| File | Changes |
|------|---------|
| `src/path/to/file.js` | [brief description] |

## Current State

[git status: branch state, what's committed vs pending]

## Next Steps

1. [next task]
2. [following task]

## Mistakes & Learnings

[Only if there were failed commands, retries, or avoidable mistakes]

- **[mistake]** → Fix: [what worked]. Saved to memory: [yes/no]

## Resume Prompt

```text
Resume [FEATURE_NAME] session.

## Context
Previous session completed:
- [key accomplishment 1]
- [key accomplishment 2]

Session summary: .claude/summaries/YYYY-MM-DD/YYYY-MM-DDTHH-MM_feature-name.md
Project context: README.md, docs/research-summary.md

## Key Files to Review First
- src/path/to/file.js (primary changes)

## Current Status
[brief status]

## Next Steps
1. [immediate next task]
2. [following task]
```
```

---

## Full Template

For multi-agent implementations, core engine refactors, skill/hook expansions, or end-to-end loops.

```markdown
# Session Summary: [FEATURE_NAME]

**Date:** YYYY-MM-DD HH:MM
**Session Focus:** [brief description]

## Overview

[1-2 paragraph summary of goals and outcomes]

## Completed Work

### Core Orchestrator & Engine
- [Orchestrator updates, lifecycle hooks, tool dispatch]

### Agents
- [Architect, Builder, Reviewer implementations or prompt tweaks]

### Skills & Tools
- [New skills added, tool schema definitions]

### Hooks & Guardrails
- [Pre-task, post-generation, failure recovery hooks]

### Memory & Self-Improvement
- [Learnings persistence, trace capture, reflection updates]

### Documentation & Infrastructure
- [README, docs, package config, git repositories]

(Drop categories that don't apply this session.)

## Key Files Modified

| File | Changes |
|------|---------|
| `src/core/...` | [brief description] |
| `src/agents/...` | [brief description] |

## Design Decisions

- **[Decision]**: [what was chosen and why; trade-off considered]

## Plan Progress

| Task | Status | Notes |
|------|--------|-------|
| Task 1 | **COMPLETED** | [notes] |
| Task 2 | **PENDING** | [what remains] |

## Next Steps

1. [next task with context]
2. [following task]

### Blockers or Decisions Needed
- [any blockers discovered]

## Session Retrospective

**Efficiency:** [Good / Fair / Poor] — [1-sentence justification]

### What Went Well
- [bullet]

### What Could Improve
- [bullet]

### Notable Issues
- [only if there were actual errors/failures worth documenting]

## Lessons Learned & System Memory

- [pattern or insight worth remembering for future sessions]

| Mistake / Failure | Root Cause | Fix | Saved to Memory? |
|-------------------|------------|-----|------------------|
| [error or failed trace] | [why it happened] | [what worked] | [yes — learnings.json / no] |

## Resume Prompt

```text
Resume [FEATURE_NAME] session.

## Context
Previous session completed:
- [key accomplishment 1]
- [key accomplishment 2]
- [key accomplishment 3]

Session summary: .claude/summaries/YYYY-MM-DD/YYYY-MM-DDTHH-MM_feature-name.md
Project context: README.md, docs/research-summary.md

## Key Files to Review First
- src/index.js (composition root)
- src/core/Orchestrator.js (lifecycle loop)

## Current Status
[brief status statement]

## Next Steps
1. [immediate next task]
2. [following task]

## Important Notes
- [critical context]
- [blockers or decisions needed]
```
```

---

## Template Tips

1. **Feature Name**: Use kebab-case for the filename (e.g., `tool-execution-loop`, `reviewer-reflection-hook`)
2. **Completed Work**: Group by the project's natural architectural categories
3. **Files Table**: Include only files with significant changes
4. **Resume Prompt**: Make it copy-paste ready — must work with zero conversation context
5. **Retrospective**: Be honest — don't fabricate metrics you can't measure
