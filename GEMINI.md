# Project entry (Gemini / IDE context)

**What this repo is**

- A **harness** for **Cursor** and **Gemini CLI** (or similar) with hooks, skills, and policies under **`.gemini/`**.
- **Product / stack** guidance (FastAPI backend, Flutter client) is **separate** and may exist before application code lands in the tree. Use the files below for role-specific AI context.

**Start here (human + model)**

1. [ARCHITECTURE.md](ARCHITECTURE.md) — how `.gemini` hooks, skills, scripts, and `manifest/` fit together; run with **repo root** as `cwd` for hook commands.
2. **Product context (optional scope):**
   - [context/backend.md](context/backend.md) — API / FastAPI / Python backend conventions.
   - [context/frontend.md](context/frontend.md) — Flutter / client conventions.
3. **Skills (agent instructions):** `.gemini/skills/<name>/SKILL.md` (see [manifest/skills.json](.gemini/manifest/skills.json) for the list).
4. **IDE rules:** [`.cursor/rules/`](.cursor/rules/) for stable, short policies; use `context/*` for longer stack guidance.
5. **Best-of-N (workflow):** [.gemini/docs/BEST_OF_N.md](.gemini/docs/BEST_OF_N.md) and the demo script in `.gemini/scripts/`.

**Secrets:** Do not commit real secrets. `.env` is blocked for agent read tools; keep placeholders in docs and real values only in a local, gitignored env file.
