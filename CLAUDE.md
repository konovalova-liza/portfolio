# CLAUDE.md

## Design system

The design system lives in [DESIGN.md](DESIGN.md) (currently v1, extracted from `prototype/index.html`).

- **Before any UI change** (HTML, CSS, JS that affects visuals or motion), read `DESIGN.md`.
- **Use only its tokens**: colors, type scale, spacing, radii, shadows, blur, easing, durations and effect parameters, plus the component specs and effect rules it defines.
- **Do not introduce new values** (a new color, size, radius, duration, easing, z-index, effect constant) without first adding them to `DESIGN.md` in the same change, with where and why they are used.
- If a needed value conflicts with an item in "Inconsistencies & open questions", flag it to the user instead of picking one silently.

## Parallel sessions

- Каждая параллельная сессия работает в своей папке-worktree.
- Не переключать ветку в папке, где работает другая сессия.
- Каркас: `~/Documents/portfolio` (`portfolio-2`).
- Design Digest: `~/Documents/portfolio-digest` (`case/design-digest`).
