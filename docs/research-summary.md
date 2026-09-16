# Research Summary: Self-Improving Multi-Agent Frameworks

This document captures initial research on the landscape of "self-improving" LLM agents, specifically focusing on architectures that utilize **skills**, **hooks**, and the **architect** role.

## 1. Core Mechanisms of Self-Improving Agents

Modern self-improving frameworks aim to solve the "frozen model" problem—the inability of a deployed LLM to adapt to new tasks without expensive retraining. They achieve this by evolving the *scaffold* (prompts, tools, and workflows) rather than the model weights.

### Skills: Reusable "Knowledge" & Logic
Rather than relying on a static, monolithic prompt library, agents manage **Skills** as structured, modular instruction sets or tools.
- **Storage:** Skills are often stored as markdown files (e.g., `SKILL.md`) or structured code repositories that the agent can read, execute, and edit.
- **On-Demand Loading:** To optimize context window usage, agents load only necessary skills based on task requirements.
- **Evolution:** Agents "self-evolve" by mining past failures. If an agent repeatedly fails a specific type of task, it can generate or refine a skill to handle that edge case in the future.

### Hooks: Deterministic Control & Reliability
Because LLMs are inherently probabilistic (nondeterministic), **hooks** are used to bridge the gap with deterministic workflow requirements.
- **Integration Points:** Hooks are often bash scripts, API callbacks, or event-driven triggers that force the agent to perform specific actions regardless of internal reasoning.
- **Gating Behavior:** Hooks ensure 100% reliability for critical steps. For example, a hook might mandate that every piece of generated code passes through a static analysis tool or unit test suite before it is considered "complete."

### The Core "Self-Improving" Loop
Most self-improving agents follow a recurring cycle often referred to as **Generate → Reflect → Refine**:
1. **Generate:** The agent performs a task based on its current skill set.
2. **Reflect:** The agent (or a secondary "critic/judge" agent) analyzes the output against benchmarks or traces, specifically looking for failure patterns.
3. **Refine:** The agent updates its persistent "learnings" or modifies existing skills/hooks to incorporate these lessons.
4. **Repeat:** Subsequent executions benefit from the accumulated improvements.

## 2. Multi-Agent Architectures and Roles

While single tools (like Claude Code) provide autonomous coding capabilities, they are frequently integrated into multi-agent workflows.

### The "Architect" Role
In multi-agent teams, the **Architect** role is central:
- **Responsibilities:** Takes high-level requirements, maps dependencies, performs automated architecture reviews, defines the system design, and creates an execution plan.
- **Interaction:** The Architect typically delegates to a **Builder** (who writes code) and a **Reviewer** (who validates code against the Architect's design).

### Self-Improvement in Architect Roles
To build self-improving capabilities for an Architect:
- **Guardrails:** Store architectural preferences, rules, and naming conventions in a persistent file (e.g., `CLAUDE.md`).
- **Reflection Hooks:** Automated scripts (e.g., `/recursive-improve`) run after tasks to evaluate performance and commit improvements to the repository.
- **Iterative Cycles:** Large features are broken down. Memory is reset between iterations to maintain focus, while "learned" skills are kept in persistent storage.

## 3. Notable Existing Frameworks

Several research and open-source frameworks are actively exploring this domain:

- **EvoSkill & Skill-MAS:** Frameworks that treat "skills" as first-class, evolvable objects. EvoSkill focuses on iterative failure analysis to build an optimal set of agent programs. Skill-MAS conceptualizes orchestration as an "evolvable Meta-Skill."
- **SiriuS & MARTI:** Leverage Reinforcement Learning (RL) for multi-agent systems. SiriuS uses "bootstrapped reasoning" to learn from successful collaborative trajectories, while MARTI provides scalable architecture for training LLM-based systems via distributed policy training.
- **EvoAgentX:** An open-source framework designed to build and optimize agentic ecosystems through self-evolving algorithms and automated evaluation.

## 4. Key Takeaways for Building our Architecture

1. **Focus on Trace Analysis:** Well-structured trace analysis and automated verification are crucial. Frontier models can identify their own improvement paths if provided with a high-quality feedback loop.
2. **Evidence-Based Learning:** Self-improvement should be backed by evidence (e.g., failed test logs, reviewer corrections) rather than arbitrary prompt rewrites.
3. **Modular Design:** Start by designing a clear structure for how skills will be defined (e.g., schema, execution method) and how hooks will intercept agent workflows.
