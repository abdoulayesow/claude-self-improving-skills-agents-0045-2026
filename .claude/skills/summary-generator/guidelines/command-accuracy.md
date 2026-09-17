# Command Accuracy Guidelines

Get it right the first time through verification and pattern-matching.

## Core Rules

1. **Verify before executing** — Check assumptions before running commands or modifying files
2. **Follow existing patterns** — Match the established ES module, class-based architecture in `src/`
3. **Read definitions first** — Understand types (`src/core/types.js`), base classes (`Agent`, `Skill`, `Hook`), and interfaces before extending them
4. **Use forward slashes** — Always
5. **Test incrementally** — Validate changes step-by-step

## Path Accuracy

**Do:**
- Use forward slashes: `src/skills/FileReadSkill.js`
- Verify paths exist before referencing: check directory structure
- Match exact case (Linux is case-sensitive)
- Keep relative imports explicit with `.js` extensions for Node ES modules (e.g. `import { Hook } from '../core/Hook.js'`)

**Don't:**
- Use backslashes
- Omit `.js` file extensions in ESM imports
- Assume folders exist without checking (`mkdir -p` if needed)

## Skill / Agent / Hook Authoring

**Do:**
- Match the YAML frontmatter format in `.claude/skills/<name>/SKILL.md`
- Subclass the base classes (`Skill`, `Hook`, `Agent`) properly in `src/`
- Keep skills modular with a single, clear responsibility
- Map `toToolSchema()` accurately to Anthropic tool schema format

**Don't:**
- Skip YAML frontmatter in `.claude/skills/`
- Hardcode domain logic inside the base orchestrator or base agent
- Expose unvalidated tool parameters

## Pre-Execution Checklist

- [ ] Path uses forward slashes and explicit `.js` extensions
- [ ] Base classes inspected before authoring subclasses
- [ ] Git status clean or changes staged intentionally
- [ ] No sensitive credentials written to tracked files

## Recovery

When a command or tool fails:
1. Read the error message carefully.
2. Verify assumptions (path, syntax, schema requirements).
3. If related to an agent execution trace, ensure the error is properly reflected in `context.state.lastError`.
