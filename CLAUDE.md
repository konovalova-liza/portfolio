# CLAUDE.md

## Design system

The design system lives in [DESIGN.md](DESIGN.md) (currently v1, extracted from `prototype/index.html`).

- **Before any UI change** (HTML, CSS, JS that affects visuals or motion), read `DESIGN.md`.
- **Use only its tokens**: colors, type scale, spacing, radii, shadows, blur, easing, durations and effect parameters, plus the component specs and effect rules it defines.
- **Do not introduce new values** (a new color, size, radius, duration, easing, z-index, effect constant) without first adding them to `DESIGN.md` in the same change, with where and why they are used.
- If a needed value conflicts with an item in "Inconsistencies & open questions", flag it to the user instead of picking one silently.

## Parallel sessions

- One folder (worktree) per Claude Code session. Never run `git checkout` / `git switch` in a folder another session may use.
- **Active now:** `~/Documents/portfolio` on `portfolio-2`. No other worktrees.
- Before starting, every session checks `pwd` and the branch and reports them.
- New parallel work: `git worktree add ../portfolio-<slug> -b case/<slug> portfolio-2`, and list it under "Active now". Remove it from that list when retired.
- All Design Digest work happens in `~/Documents/portfolio` on `portfolio-2`. The `case/design-digest` branch is closed; never check it out or merge it again.
- Untracked and ignored files (`assets/ref/`, `prototype/assets/src/`, source SVGs) are not in git and do not travel between worktrees. Backups live in `~/Documents/portfolio-assets-backup/`.
- Colleagues' doodle SVGs contain real names and photos: never copy them into the repo; only cropped, neutrally named WebP go into the build.
- Retire a worktree: status clean → branch pushed and merged → back up untracked/ignored files with a `shasum` check → `git worktree remove` (no `--force`) → `git worktree prune`, on this Mac only.
- One local server, started from the session's own folder; report its port and branch.
- Git diagnostics only from Claude Code on this Mac; remote/cloud tools see different paths and report false "prunable".
