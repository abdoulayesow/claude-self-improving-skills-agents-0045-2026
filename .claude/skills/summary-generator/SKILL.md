---
name: summary-generator
description: Generates session summaries and resume prompts for multi-session work on this self-improving Claude agent framework (agents, skills, hooks, memory loop). Use when completing features, refactoring architecture, before context limits (~50% capacity), or when user says "summary", "wrap up", "save progress", "end session". Creates markdown in .claude/summaries/YYYY-MM-DD/ with completed work, files modified, and a copy-paste resume prompt.
allowed-tools: Read, Edit, Glob, Grep, Bash(git diff:*), Bash(git log:*), Bash(git status:*), Write
---

# Session Summary Generator

## Overview

Creates session summaries for multi-session work on this repo, enabling seamless resumption. Generates a Markdown file in `.claude/summaries/YYYY-MM-DD/` with a standardized format, plus a self-reflection step that updates auto memory and learnings.

## Project Context This Skill Serves

This project is a **self-improving Claude Code architect and multi-agent framework** featuring:
1. **Core Engine & Orchestrator** (`src/core/`) — Lifecycle manager running Generate → Reflect → Refine loops, API integration, and tool dispatch.
2. **Agents** (`src/agents/`) — Specialized LLM roles (Architect, Builder, Reviewer/Critic).
3. **Skills** (`src/skills/`) — Dynamic, executable tools and instructions exposed to agents via tool schemas.
4. **Hooks** (`src/hooks/`) — Deterministic lifecycle callbacks enforcing reliability (pre-task, post-generation, on-failure).
5. **Memory & Reflection** (`src/memory/`) — Persistent storage (`learnings.json`, `LEARNINGS.md`) that stores lessons learned from execution traces.

When summarizing, segment the session's work by which architectural layer it served so resuming agents immediately know which subsystems evolved.

## When to Use

- User requests a summary ("generate summary", "wrap up", "save progress", "end session", "create summary")
- Completing a new agent, skill, hook, or core orchestrator feature
- Completing a major refactor or clean-code review
- Updating persistent memory schemas or reflection flows
- Conversation context reaching ~50% capacity before auto-compact
- Before starting a new chat session

## Output Location

```
.claude/summaries/YYYY-MM-DD/YYYY-MM-DDTHH-MM_feature-name.md
```

- **Folder**: date portion of the filename (`YYYY-MM-DD`)
- **Filename**: `YYYY-MM-DDTHH-MM_kebab-feature-name.md` (time from current timestamp; `-` instead of `:` for filesystem safety)
- **Feature name**: kebab-case, descriptive (`tool-execution-loop`, `reviewer-reflection-hook`, `memory-manager-persistence`, etc.)

## Template Tiers

Choose based on session scope:

### Lean Summary
Use for: short or narrow sessions — single bug fixes, dependency updates, single hook additions, small doc edits.

### Full Summary
Use for: multi-component features, architectural refactoring, end-to-end self-improving loops, or sessions with significant design decisions.

See [TEMPLATE.md](TEMPLATE.md) for both templates.

## Guidelines

Follow these when gathering information and writing the summary:

- **Token efficiency** (`guidelines/token-efficiency.md`): Search before reading, combine operations, scope searches to relevant dirs, don't re-read files already in context. Keep summary prose concise — bullets over paragraphs.
- **Command accuracy** (`guidelines/command-accuracy.md`): Use forward slashes in all paths, verify paths with Glob before referencing them in the summary, copy exact file paths from tool output.

## Instructions

### Step 1: Analyze Current Work

Run git inspection commands:
```bash
git status
git diff --stat
git log --oneline -10
```

Review the conversation to identify:
- Code changes in `src/core/`, `src/agents/`, `src/skills/`, `src/hooks/`, `src/memory/`
- Documentation and research notes updated
- Dependencies installed or environment config updated
- Unit tests or execution runs performed
- Persistent learnings added to `learnings.json`

### Step 2: Choose Template Tier

- **Lean**: narrow scope, ≤3 files/actions
- **Full**: multi-component work, new agents/skills/hooks, refactors, design decisions

### Step 3: Generate Summary File

Group "Completed Work" by this project's natural categories:
- **Core Orchestrator & Engine** (`src/core/`)
- **Agents & Roles** (`src/agents/`)
- **Skills & Tools** (`src/skills/`)
- **Hooks & Guardrails** (`src/hooks/`)
- **Memory & Self-Improvement** (`src/memory/`, `learnings.json`)
- **Documentation & Tests** (`docs/`, `tests/`, `README.md`)

### Step 4: Create Resume Prompt

Copy-paste ready, working with zero conversation context. Must include:
- Reference to the generated summary file
- Specific files to review first (e.g. `src/index.js`, `src/core/Orchestrator.js`)
- Current status (clean git tree, tests passing, pending items)
- Immediate next steps and any blockers

### Step 5: Session Retrospective (Full template only)

Honest, qualitative assessment:
- **Efficiency**: Good / Fair / Poor with one-sentence justification
- **What went well** / **What could improve**
- **Notable issues**: only actual errors/failures

### Step 6: Self-Reflection & Memory Update

Runs for **both** Lean and Full summaries:
1. Scan for failed commands, edit retries, or execution trace failures.
2. Check if a pattern or rule should be saved into `learnings.json` or project guidelines.
3. Keep entries actionable, concise, and focused on preventing regressions.

## Example Usage

When user says: "Let's wrap up for today" or "/summary-generator":

1. Analyze git changes and session history.
2. Create `.claude/summaries/YYYY-MM-DD/YYYY-MM-DDTHH-MM_feature-name.md`.
3. Provide the resume prompt in chat.
4. Suggest starting the next session with the resume prompt.
