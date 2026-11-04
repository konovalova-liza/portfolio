# Case brief: Design Digest (live coded case)

Branch: `case/design-digest` (from `portfolio-2`). Merge back into `portfolio-2` only after Liza approves. Never touch `main`.

## Goal
A standalone case page `cases/design-digest/index.html` that rebuilds the Design Digest canvas as a **live, interactive page in code**, not screenshots. It is later linked from the "Design Digest" card in `prototype/index.html` (Selected work) and shares the portfolio shell (header, footer, tokens).

Why this case matters: it is the strongest proof of the "UI design engineer" positioning — own illustration, motion and code in one piece.

## Rules
- Read `DESIGN.md` and `CLAUDE.md` first. Portfolio shell (header, back link, case intro, footer) uses DESIGN.md tokens only.
- The Digest canvas itself keeps its **own** look (sketchy illustrations, handwritten font, pastel stickers, dotted grid). Scope its styles under `.digest` so they never leak into the portfolio tokens. Add any new Digest-only values to a "Digest scope" section in DESIGN.md.
- Glass droplet cursor (DESIGN.md 5.2) is **off inside the Digest canvas**: the canvas has its own hovers. It stays on in the portfolio shell around it.
- Respect `prefers-reduced-motion` (static states, no autoplay) and touch (no hover-only content; tap reveals).
- No external image hosts. Assets live in `cases/design-digest/assets/`.

## Confirmed facts (2026-11-04)
- **What:** Design Digest 2025, the internal annual digest of DX:Enterprise, the enterprise design team at Trinetix. Audience: the team and the whole company.
- **Team:** 4 designers + 1 art lead. Each designer made one tab. Liza designed the whole DX:Enterprise page: concept, illustrations, copy, motion and the Figma prototype.
- **Scope of the rebuild:** only the DX:Enterprise page is rebuilt. The other tabs are inactive decoration, styled after a Figma canvas.
- **NDA:** "DX:Enterprise" and the Recipe numbers are OK to show publicly.
- **Font:** Figma Hand is **not** licensed for web (free only inside Figma products), so the page uses **Shantell Sans** (SIL OFL 1.1), self-hosted.
- **Fidelity:** pixel-perfect copies are not required. Keep the idea and feel of each drawing and animation; simplify when it saves weight or effort.
- **Team section:** roles only under every card (e.g. "Project Lead", "UX/UI designer"). No names at all, Liza's included, and no photos: the doodle SVGs also contain a photo and a name, so only the doodle frame is cropped. Static grid, no hover.
- **Colors:** the DESIGN.md accent/error restriction applies to the portfolio shell only. Inside `.digest` the canvas uses its own Digest-scope colors (quiz: green check, red sad face; DESIGN.md §5.7).

## Page structure
1. Portfolio header + "← All work" back link.
2. Case intro (short, DESIGN.md typography): title, one-line summary, role / team / year / tools chips, 1 paragraph context. **Facts to confirm with Liza before writing copy**: what Design Digest was used for, her role, team, year. Do not invent them.
3. The live canvas (main block, full-bleed, ~100vh viewport into a larger board).
4. "How it's built" notes: 3–5 short points (free scroll, frame animation, liquid morph, SVG assets, accessibility).
5. Next case link + portfolio footer.

## The canvas: what to rebuild
Source: Figma file `uEV7RsM69aXk884lza2AOM`, Design Digest section. Hero start node `0:25429`, components `0:25434`. Prototype link exists but Claude Code cannot open it; Liza provides PNG/SVG exports and screen recordings instead.

- **Board**: large board with dotted grid background. Free scroll on both axes (wheel/trackpad, drag to pan, keyboard arrows). On mobile (<768px) becomes a vertical stack of sections.
- **Top nav** (inside Digest): tabs DX: Enterprise (active), Projects, Cheers, Recommendations, Design Lab, Survey, Volunteering; close (×) returns to the case intro.
- **Hero intro sequence**: title "Hey, we're DX:Enterprise!" → subtitle "The ones who typically" → 4 stickers appear one by one (Design, Dig, Jam, Guide) → a hand-drawn loop line draws around them (SVG stroke-dashoffset).
- **Sticker hover**: label morphs into a thought bubble ("Design with purpose", "Dig into challenges", "Jam as a team", "Guide the vision") and the character swaps frame (cat sticks tongue out + "mur mur", dragon opens eye and exhales, etc.).
- **"Follow the paws… secrets below"**: slight jitter between two versions of the text; dotted paw trail connects sections across the board.
- **Paw buttons**: sketchy square with arrow; on hover a colored square appears behind with offset and rotation (green / yellow / red / purple / blue variants). Click moves the camera smoothly to the next section.
- **Our team**: grid of doodle portraits (Team management, Leads, Designers). Hover: doodle turns into photo via liquid morph (reuse LiquidReveal logic from DESIGN.md 5.1, small brush or full-card dissolve) and shows a fun caption.
  - **Privacy**: real photos and names of colleagues only with their consent. Default: Liza's own card shows photo; others stay doodle-only with role labels until consent is confirmed.
- **What We Do**: 5 cards (Enterprise design, Accessibility, AI-driven user interfaces, Graph design & Illustrations, Branding). Hover: image shrinks and moves up, description slides in; Enterprise design card also un-blurs.
- **Quick design test**: 3 questions with checkboxes, real answer checking with feedback (Q1 LEGO/NASA/IBM, Q2 Red/Green/Blue, Q3 Fair/Dark/Gray pattern — confirm correct answers with Liza).
- **At work, we value most**: values wheel (People, Purposeful design, Clear and honest communication, Taking initiative, A culture we love; inner ring Learn/Share/Improve/Reflect/Repeat/Grow). Slow rotation or hover highlight per segment.
- **Recipe for a DX legendary year**: burger illustration + list with arrows (Design Digest 1, Client projects 38, Team knowledge sharing sessions 12, Ideas bravely rejected 104, New teammates 4, Design team laughs ∞). Counters can count up when in view.
- **Cat finale**: frame animation (tail wags → cat peeks → paws → "mur mur") as SVG frames.
- **"That's all, folks" + DX Design playlist** card (link out, no iframe embeds — they are blocked in previews).
- Decorative props: giraffe, yarn ball, fish bowl, cat tower, litter box, planets, cat food can — static or light idle motion.

## Motion defaults
No timings exported. Use Smart Animate default ~300ms ease-out for state changes, stagger 120ms for intro stickers, line draw ~1.2s. Tune together with Liza from screen recordings.

## Assets Liza provides (ask for them, don't fake them)
- SVG: all illustrations (characters per frame, giraffe, cat frames, paws, paw buttons, props, values wheel, loop line).
- PNG/WebP 2x: photos, burger, What We Do card images.
- Handwritten font: name + file; check web license before use.
- Screen recording of the Figma prototype for timing.
Until assets arrive: build structure and motion with clearly labeled placeholders.

## Integration with the hero frame
- In `prototype/index.html`, the "Design Digest" card in Selected work links to `../cases/design-digest/index.html`.
- Shared shell: copy header/footer markup from the prototype; later both move to shared partials when the prototype is ported into the site.

## Done when
- Page works in Chrome, Safari, Firefox; desktop free-scroll and mobile stack both usable.
- Reduced motion and keyboard navigation work.
- Lighthouse performance ≥ 85 on desktop.
- Liza approves → PR `case/design-digest` → `portfolio-2`.
