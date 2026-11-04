# Konovalova Portfolio — Design System

**Status: v1, approved 2026-11-03. Prototype not yet aligned, see Stage 3 backlog**

v1 is the **normative** spec. `prototype/index.html` (commit `320ad0d`) still follows the v0 extraction and differs from this document in the places listed in [§8 Stage 3 backlog](#8-stage-3-backlog).

How to read the doc:

- **(v0)** means a value carried over unchanged from the prototype.
- **(v1)** means a value introduced or changed by the decisions of 2026-11-03.
- **(proposed)** means a concrete value chosen to implement a decision. It is not an explicit decision and must be checked live in Stage 3.
- `Lnnn` line references point to `prototype/index.html` at `320ad0d`.

---

## 1. Decisions log (2026-11-03)

| # | Area | Decision | Applied in |
|---|---|---|---|
| D1 | Accent | `--accent:#4f5bd5` stays the **only** spot accent. Uses: links, focus ring on light backgrounds, last word of the band. Holo colors (`#6fe3e1`, `#b9a7ff`, `#ffc7a3`) are **never** a text color, only backgrounds, gradients and effects. | [§2.1](#21-colors), [§4.8](#48-band-i--design----ship) |
| D2 | Fonts | **Onest** is the primary family. **Geist Mono** (status: *trial*, decision after a live check) is for the eyebrow, the header clock, case meta (role, dates, platform) and stats digits. Mono is never larger than the eyebrow size, except for the stats digits. Digits must not change width during count-up. | [§2.2](#22-typography) |
| D3 | Effects | Every effect stays. **LiquidReveal** in the hero (B/W → color). The **glass holo droplet cursor** works on every page, including the hero and case pages. In the hero the droplet sits **above** the brush, its diameter is **smaller than brushRadius 143**, and the revealed color shows through the glass. On touch / `pointer:coarse` and with `prefers-reduced-motion` there is no droplet and no brush; the hero shows a static B/W photo. | [§5](#5-effects-rules) |
| D4 | Loader | The `000→100` loader stays. **Note:** it was not visible during the review; find the cause in Stage 3. | [§4.12](#412-loader), backlog #27 |
| D5 | Band "I / Design / → / Ship" | The last word uses `--accent`. The words are temporary (placeholder). The pills are **static**: no hover, no cursor change, not links or buttons. | [§4.8](#48-band-i--design----ship) |
| D6 | Theme | There is no dark theme. The page background is always light; dark only appears as `--ink` blocks (hero, case cards, footer, menu, loader). The **light variant of the hero and header is removed** from the system. | [§2.1](#21-colors), [§4.7](#47-header-with-clock), [§4.13](#413-hero) |
| D7 | Contact modal (2026-11-04) | "Let's talk" opens a contact modal: Telegram and LinkedIn link pills, an "or send an email" divider, and a Name / Email / Message form sent via Formspree (demo mode while the endpoint is empty). States are shown strictly one at a time. `--error:#b42318` is approved as the error color. | [§4.9](#49-contact-modal), [§2.1](#21-colors) |

The technical rules T1–T11 below implement the decisions and close the v0 inconsistencies. None of them overrides D1–D6.

| # | Rule | Section |
|---|---|---|
| T1 | Text on light uses `--text` / `--text-2` / `--text-3`. Hardcoded `#111` and `rgba(17,17,17,.4–.55)` are banned; `--muted` is retired. | [§2.1](#21-colors) |
| T2 | Text on `--ink` uses `--on-ink` / `--on-ink-2` / `--on-ink-3`. | [§2.1](#21-colors) |
| T3 | `--foreground` (text) and `--ink` (surfaces) stay separate tokens. | [§2.1](#21-colors) |
| T4 | Field borders and UI borders are ≥ 3:1 against their background. | [§2.4](#24-radii-borders-shadows-blur-z-index) |
| T5 | New tokens: `--on-ink*`, `--glass-*`, `--holo-gradient`, alpha line/surface tokens, shadows, blur, z-index, and `2rem` = `--r-card`. Effect constants live in one JS config object. | [§2](#2-tokens), [§5.3](#53-effect-config-object) |
| T6 | Motion: `--ease-spring` for every entrance; line/word curves only for text masks; list stagger 80ms; overlays 400ms; micro-hover 300ms; the default browser `ease` is banned. | [§2.5](#25-motion) |
| T7 | Spacing uses a `.25rem` step scale; `.6rem` becomes `.5rem`; component sizes never mix `vw` with `rem`. | [§2.3](#23-spacing-scale-and-grid) |
| T8 | The rem scale is continuous (`clamp`), and JS `grid()` is removed. | [§2.3](#23-spacing-scale-and-grid) |
| T9 | Every interactive component has hover (inside `hover:hover`), focus-visible (= hover + ring), active and disabled states, and fields have an error state. Send is disabled while sending. | [§3](#3-interaction-states) |
| T10 | Nav and modal manage focus (move in, trap, `Esc`, return). `aria-current` updates on navigation. The carousel is fully keyboard-operable. | [§6](#6-accessibility-rules) |
| T11 | With reduced motion, the stats panel shows final values immediately. | [§5.4](#54-reduced-motion) |

---

## 2. Tokens

### 2.0 Token block

Contrast ratios are WCAG 2.x, computed after alpha-compositing over the stated background. Abbreviations: W = `#ffffff`, S = `--surface #f1f0ee`, SS = `--surface-soft` over white (`#f8f8f6`), I = `--ink #0a0a0a`, G1/G2 = `--glass-rest`/`--glass-hover` over ink (`#222222` / `#3b3b3b`).

```css
:root {
  color-scheme: light;                                   /* D6: no dark theme */

  /* Surfaces (v0) */
  --background:#ffffff;
  --surface:#f1f0ee;
  --surface-2:#e3e2df;                                   /* pressed/hover of --surface controls */
  --surface-soft:rgba(241,240,238,.5);                   /* (v1) replaces .5/.6/.7 surface alphas */
  --ink:#0a0a0a;                                         /* dark blocks only (D6) */

  /* Text on light (v1, T1/T3) */
  --foreground:#111111;
  --text:var(--foreground);                              /* W 18.88 · S 16.58 · SS 17.76 */
  --text-2:rgba(17,17,17,.7);                            /* W 7.11 · S 6.66 · SS 6.90 — AA body */
  --text-3:rgba(17,17,17,.5);                            /* W 3.54 · S 3.46 · SS 3.52 — large/decorative only */

  /* Text on ink (v1, T2) */
  --on-ink:#ffffff;                                      /* I 19.80 · G1 15.91 · G2 11.20 */
  --on-ink-2:rgba(255,255,255,.7);                       /* I 9.76 · G1 8.47 · G2 6.42 — AA body */
  --on-ink-3:rgba(255,255,255,.5);                       /* I 5.29 · G1 4.98 · G2 4.13 — large/decorative only (≥3:1) */

  /* Lines and borders (v1, T4) */
  --line:#e6e5e2;                                        /* decorative dividers only: W 1.26, not a UI border */
  --line-on-ink:rgba(255,255,255,.1);                    /* decorative dividers on ink */
  --border-ctl:rgba(17,17,17,.5);                        /* field / control borders: W 3.54 · S 3.46 · SS 3.52 */
  --border-on-ink:rgba(255,255,255,.4);                  /* control borders on ink: I 3.77 */

  /* Accent and status */
  --accent:#4f5bd5;                                      /* W 5.54 · S 4.87 · SS 5.21 · I 3.57 (never text on ink) */
  --error:#b42318;                                       /* (v1, D7) W 6.57 · S 5.77 · SS 6.18 — field errors only, never decorative */

  /* Holo (D1: backgrounds, gradients, effects only — never text) */
  --holo-1:#6fe3e1; --holo-2:#b9a7ff; --holo-3:#ffc7a3;
  --holo-gradient:linear-gradient(135deg,var(--holo-1),var(--holo-2),var(--holo-3)); /* (v1) one angle, even stops */

  /* Glass (v1) — on ink / dark hero only */
  --glass-rest:rgba(255,255,255,.1);
  --glass-hover:rgba(255,255,255,.2);

  /* Focus (v1, T9) */
  --ring-light:var(--accent);                            /* W 5.54 · S 4.87 · SS 5.21 */
  --ring-ink:var(--on-ink);                              /* I 19.80 · G2 11.20 */

  /* Type (D2) */
  --font:"Onest", "Helvetica Neue", Arial, sans-serif;
  --font-mono:"Geist Mono", ui-monospace, Menlo, monospace;  /* (v1, trial) */

  /* Radii */
  --r-card:2rem;                                         /* also loader/hero/footer sheet corners (T5) */
  --r-card-sm:1.25rem;
  --r-ctl:.875rem;
  --r-pill:9999px;

  /* Shadows (v1 names, v0 values) */
  --shadow-sm:0 1px 2px rgba(0,0,0,.05);
  --shadow-panel:0 25px 50px -12px rgba(0,0,0,.25);
  --ring-hairline:0 0 0 1px;                             /* combine with a color: box-shadow: var(--ring-hairline) var(--line-on-ink) */

  /* Blur (v1 names, v0 values) */
  --blur-ctl:blur(4px);
  --blur-card:blur(12px);
  --blur-overlay:blur(16px);
  --blur-lens:blur(1.4px) saturate(1.8);

  /* Z-index (v1 names, v0 values) */
  --z-bg:0; --z-decor:1; --z-raised:10; --z-content:20; --z-header:50;
  --z-lens:99; --z-cursor:100; --z-modal:110; --z-nav:115; --z-loader:120; --z-skip:130;

  /* Motion (T6) */
  --ease-spring:cubic-bezier(.22,1,.36,1);               /* every entrance and overlay */
  --ease-line:cubic-bezier(.215,.61,.355,1);             /* text line masks only */
  --ease-word:cubic-bezier(.165,.84,.44,1);              /* text word masks only */
  --ease-hover:cubic-bezier(.2,.8,.2,1);                 /* hover / focus / active and color changes */
  --dur-micro:300ms;                                     /* micro-hover, color, field focus */
  --dur-surface:450ms;                                   /* (v0) card/row hover — see §7 Q6 */
  --dur-item:500ms;                                      /* carousel item swap */
  --dur-overlay:400ms;                                   /* modal, menu, panel */
  --dur-exit:600ms;                                      /* loader content */
  --dur-word:700ms;
  --dur-reveal:800ms;                                    /* .rv, loader sheet */
  --dur-line:900ms;
  --stagger-list:80ms;                                   /* (v1) every list */
  --stagger-line:120ms;                                  /* (proposed) heading lines — see §7 Q7 */
  --stagger-word:35ms;
}
```

Retired in v1: `--muted` (replaced by `--text-2`/`--text-3`), `--hero-to` (the hero is an `--ink` block, D6), and every hardcoded `#111`, `#fff`, `rgba(17,17,17,…)`, `rgba(255,255,255,…)`, `rgba(230,229,226,…)` and `rgba(241,240,238,…)` in component CSS.

### 2.1 Colors

#### Rules
- **Page:** always `--background` (light). Dark only as `--ink` blocks: hero, case cards, footer, menu, loader (D6). The stats panel is also `--ink` in v0 but is not in D6's list ([§7 Q10](#71-open-questions)).
- **Text on light (T1):**
  - `--text`: primary text.
  - `--text-2`: all small secondary text, including captions, labels and meta. Previous `.45`–`.6` uses move up to `--text-2`.
  - `--text-3`: only for text ≥ 24px (or ≥ 18.66px bold) and decorative glyphs (e.g. the big globe icon, Toolkit icons).
- **Text on ink (T2):**
  - `--on-ink`: headings and primary text.
  - `--on-ink-2`: body, meta and links.
  - `--on-ink-3`: large or decorative only.
- **Separate tokens (T3):** `--foreground` is a text color and `--ink` is a surface color. They are never swapped.
- **Accent (D1):**

  | Use | Rule | Contrast |
  |---|---|---|
  | Links on light | Text color | W 5.54 · S 4.87 |
  | Focus ring on light | Ring color | — |
  | Band last word | Text color | SS 5.21 |

  Any other existing accent use (`.soc.a` background, `.mh .k` dot) is an open question ([§7 Q2](#71-open-questions)). The accent is never text on `--ink` (3.57:1); links on ink use `--on-ink-2` → `--on-ink` on hover/focus.
- **Holo (D1):** only `--holo-gradient`, holo backgrounds and effects (droplet, LiquidReveal). Never `color:` on text. Holo-tinted icons are an open question ([§7 Q3](#71-open-questions)).
- **Glass:** `--glass-rest` / `--glass-hover` only on ink or the dark hero. There is no light glass in v1, because the light header was removed (D6).

#### Contrast of v1 color tokens

| Token | Background | Ratio | Target | Pass |
|---|---|---|---|---|
| `--text` | W / S / SS | 18.88 / 16.58 / 17.76 | 4.5 | ✅ |
| `--text-2` | W / S / SS | 7.11 / 6.66 / 6.90 | 4.5 | ✅ |
| `--text-3` | W / S / SS | 3.54 / 3.46 / 3.52 | 3.0 | ✅ (large/decor only) |
| `--on-ink` | I / G1 / G2 | 19.80 / 15.91 / 11.20 | 4.5 | ✅ |
| `--on-ink-2` | I / G1 / G2 | 9.76 / 8.47 / 6.42 | 4.5 | ✅ |
| `--on-ink-3` | I / G1 / G2 | 5.29 / 4.98 / 4.13 | 3.0 | ✅ |
| `--border-ctl` | W / S / SS | 3.54 / 3.46 / 3.52 | 3.0 | ✅ |
| `--border-on-ink` | I | 3.77 | 3.0 | ✅ |
| `--accent` (text, ring) | W / S / SS | 5.54 / 4.87 / 5.21 | 4.5 / 3.0 | ✅ |
| `--accent` | I | 3.57 | — | ⛔ not used on ink |
| `--ring-ink` | I / G2 | 19.80 / 11.20 | 3.0 | ✅ |
| `--error` | W / S / SS | 6.57 / 5.77 / 6.18 | 4.5 | ✅ |
| `--line` | W | 1.26 | — | decorative only, never a control border |
| `--text` on holo stops | `#6fe3e1` / `#b9a7ff` / `#ffc7a3` | 12.36 / 9.02 / 12.54 | 4.5 | ✅ (text on gradient, D1-compliant) |

Not computable from tokens: any text over the hero photo. This needs a visual check (backlog #28).

### 2.2 Typography

**Families (D2)**
- `--font` (Onest, weights 400/500/600/700): everything not listed below.
- `--font-mono` (Geist Mono, **trial**): used only for:

  | Element | Size |
  |---|---|
  | Eyebrow (`.eyebrow`, `.mh .k`) | `.875rem` |
  | Header clock (`.chip .t`, `.chip .dt`) | `.75rem` |
  | Case meta (role, dates, platform; `.wc .meta`) | `.75rem` |
  | Stats digits (`.sg .n`) | per scale below |

- **Mono size cap:** mono text is never larger than the eyebrow size (`.875rem`). The only exception is `.sg .n`.
- **Stable digits:** `.sg .n` and the clock use `font-variant-numeric:tabular-nums`, which also covers the Onest fallback if the trial is rejected. `.sg .n` reserves the width of its final value, including the suffix (`min-width` in `ch` equal to the final string length), so count-up never shifts the layout.
- **If the trial is rejected:** the same elements fall back to `--font` with `tabular-nums`. The size rules do not change.

**Scale (v0 sizes; the rem is continuous per §2.3)**

| Role | Family | Size (→ 640 → 768) | Weight | LH | Tracking |
|---|---|---|---|---|---|
| digits (stats) | mono (trial) | `3rem` → `3.75rem` → `4.5rem` | 600 | 1 | `-.02em` |
| display / card wordmark | Onest | `4.5rem` | 700 | — | `-.04em` (holo gradient text) |
| footer watermark | Onest | rem-only size, value set in Stage 3 (T7; v0 was `min(13rem,16vw)`) | 700 | 1 | `-.03em` |
| h1 (hero, footer CTA) | Onest | `2.25rem` → `3rem` → `3.75rem` | 600 | `.98` / `1.02` | `-.02em` |
| nav overlay link | Onest | `2.25rem` → `3.75rem` | 600 | — | `-.02em` |
| h2 | Onest | `2.25rem` → `3rem` | 600 | `1.05` | `-.02em` |
| h2 (stats) | Onest | `1.875rem` → — → `2.25rem` | 500 | `1.15` | `-.01em` |
| h2 (statement) | Onest | `1.5rem` → `1.875rem` | 500 | `1.35` | `-.01em` |
| h3 (row) | Onest | `1.5rem` → `1.875rem` → `2.25rem` | 500 | — | `-.01em` |
| h3 (card, modal) | Onest | `1.5rem` → `1.875rem` | 500 / 600 | — | `-.01em` |
| band label | Onest | `1.875rem` → `2.25rem` | 500 | — | — |
| brand | Onest | `1.875rem` (loader), `1.125rem` (header/footer/nav) | 600 | — | `-.01em` |
| body | Onest | `.875rem` | 400/500 | — | — |
| body-lg | Onest | `1rem` | 400 | — | — |
| **eyebrow** | mono (trial) | `.875rem` | 500 | — | — |
| small / meta | Onest; mono for clock and case meta | `.75rem` | 400/500 | — | `.025em` uppercase (meta, labels, status, footer h4) |
| micro | Onest | `.65rem` | 500 | — | `.05em` uppercase |

### 2.3 Spacing, scale and grid

**Root scale (T8, proposed formula).** It replaces the four `vw` media queries (L22–25) and the JS `grid()` (L608–610):

```css
html{font-size:clamp(16px, calc(5.3333px + .5555vw), 21.3333px)}
```

- Below 1920px the rem is a constant `16px`. At 1920px it is exactly `16px`. Above that it grows continuously with the same slope as the v0 `grid()` (`k=.6666`), capped at `21.3333px` (reached at 2880px; the cap is proposed). There are no jumps at any breakpoint.
- Responsive sizing below 1920 comes only from the component breakpoints (`640 / 768 / 1024`).
- **Why:** CSS covers the behaviour, so `grid()` is deleted (backlog #18).

**Spacing scale (T7).** Steps of `.25rem`. Values in use: `.25 .375 .5 .75 1 1.25 1.5 1.75 2 2.5 3 3.5 4 5 6 7 9rem`.
- `.375rem` is allowed only for dot/icon micro-geometry.
- `.6rem` (`#loader .brand` gap) becomes `.5rem`.

**No mixed units (T7).** Component sizes never combine `vw` with `rem` (no `min(13rem,16vw)`, no `min(22rem,72vw)`). Use rem with breakpoints; the continuous rem handles the rest.

**Unchanged (v0):**
- **Container:** `.shell` max `88rem`, side padding `max(1.25rem, env(safe-area-inset-*))`, `2rem` at ≥640.
- **Hero grid:** 12 columns at ≥1024, `gap:2.5rem`, left span 7, right span 5.
- **Section rhythm:**
  - `.about` `5rem` / `7rem`
  - `.sec` `2.5rem 5rem` / bottom `7rem`
  - `.band` `2.5rem`
  - footer top `5rem` / `6rem`, bottom `2.5rem`
- **Grids:**

  | Grid | Columns | Gap |
  |---|---|---|
  | `.cards` | 1 → 2 (768) | `1.5rem` |
  | `.sg` | 2 → 4 (1024) | col `2rem`, row `3rem` |
  | `.fcols` | 1 → 2 → 4 | `3rem` |

### 2.4 Radii, borders, shadows, blur, z-index

- **Radii:**

  | Token | Used by |
  |---|---|
  | `--r-card` | `.wc`, `.stats`, `.panel`, and the sheet corners of the loader (`0 0 var(--r-card) var(--r-card)`), hero (same) and footer (`var(--r-card) var(--r-card) 0 0`) |
  | `--r-card-sm` | `.hcard`, `.srow` |
  | `--r-ctl` | Chips, menu buttons, fields, tiles |
  | `--r-pill` | Pills, round buttons, dots, tags |

- **Borders (T4):** always `1px solid`.

  | Kind | On light | On ink |
  |---|---|---|
  | Interactive or field border | `--border-ctl` | `--border-on-ink` |
  | Divider (decorative) | `--line` | `--line-on-ink` |
  | Non-interactive outline (tags, `.eb-pill`) | `--line` | `--line-on-ink` |

  Tags and `.eb-pill` are not UI components, so the 3:1 rule does not apply to them.
- **Shadows:**
  - `.panel`: `var(--shadow-panel), var(--ring-hairline) var(--line)`
  - `.hcard`: `var(--ring-hairline) var(--line-on-ink)` (dark hero only, D6)
  - Ring on `.wc` / `.badge`: `var(--ring-hairline) var(--line-on-ink)`
  - `--shadow-sm` is kept for light cards if one appears; no current light card uses it.
- **Blur:**

  | Token | Used by |
  |---|---|
  | `--blur-ctl` | Chip, menu button |
  | `--blur-card` | `.hcard` |
  | `--blur-overlay` | Modal scrim |
  | `--blur-lens` | `#lens` |

- **Z-index:** only the `--z-*` tokens. Stack from bottom to top:

  | Token | Layer |
  |---|---|
  | `--z-bg` | Hero image and brush canvas |
  | `--z-decor` | Vignette, watermark |
  | `--z-raised` | Footer content |
  | `--z-content` | Hero content |
  | `--z-header` | Header |
  | `--z-lens` | Lens |
  | `--z-cursor` | Droplet canvas; above the brush canvas (D3) |
  | `--z-modal` | Modal |
  | `--z-nav` | Menu |
  | `--z-loader` | Loader |
  | `--z-skip` | Skip link |

### 2.5 Motion

**Easing (T6)**

| Token | Use |
|---|---|
| `--ease-spring` | **Every entrance and exit:** `.rv`, loader, carousel items, nav links, overlays, panel |
| `--ease-line` | Only `.ln>span` (line mask) |
| `--ease-word` | Only `.w` (word mask) |
| `--ease-hover` | Hover, focus-visible, active, and color/opacity/background changes |
| browser `ease` / `ease-out` / `linear` | **Banned.** Every `transition` names one of the four tokens. Single exception: the continuous rotation of a loading spinner (contact modal Send) uses `linear` |

**Durations**

| Token | Value | Use |
|---|---|---|
| `--dur-micro` | 300ms | **All micro-hovers** (pill, logo, pnav, soc, `.al`, badge, arrows), color changes, field focus |
| `--dur-overlay` | 400ms | Modal fade, menu fade, panel slide, nav-link entrance (T6) |
| `--dur-surface` | 450ms | `.wc` lift, `.srow` background/padding (open: [§7 Q6](#71-open-questions)) |
| `--dur-item` | 500ms | Carousel item |
| `--dur-exit` | 600ms | Loader content |
| `--dur-word` / `--dur-reveal` / `--dur-line` | 700 / 800 / 900ms | Word mask, reveal and loader sheet, line mask |

**Stagger**
- `--stagger-list:80ms` for every list: case cards, stats, services, band, nav overlay links, footer columns.
- Heading lines use `--stagger-line:120ms` (proposed).
- Words use `--stagger-word:35ms`.
- The hero intro sequence keeps its v0 choreography (`150 → 900ms`). It is a sequence, not a list.

**Reveal offsets** keep the v0 `--y` values (`-14px` … `48px`). **JS timings** are in the config object ([§5.3](#53-effect-config-object)).

---

## 3. Interaction states

These rules apply to **every** interactive component (T9). Component sections only list deviations.

| State | Rule |
|---|---|
| **Hover** | Only inside `@media (hover:hover)`. Duration `--dur-micro` (micro) or `--dur-surface` (cards/rows); easing `--ease-hover`. |
| **Focus-visible** | Repeats the hover visual (same transform, background and color) **plus** a ring: `outline:2px solid var(--ring-light)` on light, `var(--ring-ink)` on ink/dark hero; `outline-offset:2px`. Never `outline:none` without this replacement. |
| **Active** | Pills and round buttons: `transform:scale(.98)` (proposed). Rows and cards keep the hover visual. Duration `--dur-micro`. |
| **Disabled** | `disabled` attribute (or `aria-disabled="true"` on links), `opacity:.4` (proposed), `cursor:not-allowed`, no hover/active response. Exempt from contrast rules. |
| **Error (fields)** | Border `--error`. Message below the field at `.75rem`/500 in `--error`. `aria-invalid="true"` + `aria-describedby` pointing at the message. |
| **Loading** | Button text changes to "Sending…" **and** the button is `disabled` until the request settles. |
| **Non-interactive** | No hover, no `cursor:pointer`, no `data-holo` (e.g. band pills, tags). |

---

## 4. Components

Tokens refer to §2. Where a component's v0 values are unchanged, the section does not repeat them; `DESIGN.md` v0 is in git history (`f2c53c5`).

### 4.1 Pill button `.pill`
- **Variants:**

  | Variant | On light | On ink |
  |---|---|---|
  | `dark` | `--ink` bg / `--on-ink` | `--on-ink` bg / `--ink` text |
  | `light` | `--surface` bg / `--text` | — |
  | `outline` | `--border-ctl` | `--border-on-ink` |
  | `arrow` | adds the `.bd` badge | adds the `.bd` badge |

- **Spec:** `--r-pill`, `.875rem`/500, padding `.875rem 1.75rem`.
- **States:**

  | State | Behaviour |
  |---|---|
  | Hover / focus | `scale(1.04)` + arrow nudge |
  | Active | `scale(.98)` |
  | Disabled | Per §3 |
  | Loading | Per §3 |

  Durations: `--dur-micro`.

### 4.2 Eyebrow `.eyebrow`
- **Spec:** `--font-mono` (trial), `.875rem`/500, `--text-2` with a `.375rem` dot in `--text-3`. On ink: `--on-ink-2` with an `--on-ink-3` dot.
- **Variants:** `.eb-pill` (outline `--line`). Modal `.mh .k` (dot color: [§7 Q2](#71-open-questions)).
- **States:** Static.

### 4.3 Tag `.tags span`
- **Spec:** on ink, `1px solid var(--line-on-ink)`, `--r-pill`, `.5rem 1rem`, `.875rem`, `--on-ink-2`.
- **States:** Static, non-interactive.

### 4.4 Case card `.wc`
- **Spec:**
  - `--ink`, `--r-card`, ring `--line-on-ink`
  - Meta row in `--font-mono` `.75rem` uppercase `.025em`, `--on-ink-2`. Content: role, dates, platform (D2)
  - Wordmark uses `--holo-gradient` as background-clip text. That is a gradient fill, allowed by D1
  - Description in `--on-ink-2`
- **States:**

  | State | Behaviour |
  |---|---|
  | Hover / focus | `translateY(-8px) scale(1.012)` (`--dur-surface`); badge `rotate(45deg) scale(1.08)` (`--dur-micro`) |
  | Focus ring | `--ring-ink` |
  | Active | Hover visual |
  | Disabled | n/a (always a link) |

- **Droplet:** `data-holo="lg"` (magnet).

### 4.5 List row `.srow`
- **Spec:**
  - Index `.ix` in `--text-2` (it is `.875rem` text)
  - Description in `--text-2`
  - Divider `--line`
- **States:**

  | State | Behaviour |
  |---|---|
  | Hover / focus | `--surface` bg + padding shift (`--dur-surface`); arrow `translateX(5px)` (`--dur-micro`) |
  | Focus ring | `--ring-light` |
  | Active | Hover visual |

### 4.6 Numbers panel `.stats`
- **Spec:**
  - `--ink` block (pending [§7 Q10](#71-open-questions))
  - Digits `.sg .n` in `--font-mono` (trial), tabular, width reserved for the final value (D2)
  - Captions in `--on-ink-2`
- **Motion:** Scroll-linked count-up. Under reduced motion the final values show immediately (T11).
- **Droplet:** `data-read` (radius 5).

### 4.7 Header with clock
- **Variant:** **Single variant only** (on ink / dark hero). The light variant is removed (D6).
- **Spec:**
  - Logo icon: [§7 Q3](#71-open-questions)
  - `.pnav`: `--on-ink-2` → `--on-ink` for `aria-current` and hover/focus
  - `.chip` and `.menu-btn`: `--glass-rest` bg, `--border-on-ink` border, `--blur-ctl`
  - Clock in `--font-mono` `.75rem`, tabular
- **States:**

  | State | Behaviour |
  |---|---|
  | Hover / focus (`.menu-btn`) | `--glass-hover` |
  | Hover / focus (logo) | `scale(1.04)` |
  | Hover / focus (pnav) | `translateY(-2px)` + `--on-ink` |
  | Focus ring | `--ring-ink` |
  | Active | `scale(.98)` on `.menu-btn` |

- **`aria-current`:** updates to the section in view and on nav click (T10).

### 4.8 Band "I / Design / → / Ship"
- **Status:** Placeholder words (D5).
- **Fills:**

  | Pill | Fill | Text |
  |---|---|---|
  | `I` | `--surface` | `--text` |
  | `Design` | `--holo-gradient` | `--text` |
  | `→` | `--ink` | `--on-ink` |
  | Last word (`Ship`) | `--surface-soft` | **`--accent`**, 5.21:1 on SS |

- **Static (D5):** no hover, no `cursor:pointer`, no `data-holo`, not links or buttons (plain `li > div`). The droplet shows its default size over the band.
- **Motion:** Entrance stagger `--stagger-list` (80ms), `--ease-spring`.

### 4.9 Contact modal
Opened by every `[data-contact]` trigger ("Let's talk", "Contact", "Start a conversation"). D7.

- **Layout (top to bottom):**
  - Eyebrow `.mh .k` "Let's talk" + title `h2#mtitle`
  - `.mlinks`: two `.pill.light.arrow` links, **Telegram** and **LinkedIn**. They open in a new tab (`target="_blank" rel="noopener noreferrer"`) and carry a visually hidden "(opens in a new tab)". Grid `repeat(auto-fit,minmax(9rem,1fr))`, gap `.75rem`
  - Divider `.or` "or send an email": `.75rem`/500 uppercase `.025em`, `--text-2`, lines `--line`
  - Form: Name, Email, Message, plus honeypot `_gotcha` (off-screen, `tabindex="-1"`, `aria-hidden`) and hidden `_subject`
  - Footer `.fb`: mode note (`--text-2`) + Send `.pill.dark.arrow`
- **Spec:**
  - Scrim `rgba(17,17,17,.3)` + `--blur-overlay`. The scrim color is not a text color, so T1 does not apply; it is kept (v0)
  - Panel `--background`, `--r-card`, shadow per §2.4, max `32rem`; `max-height:calc(100dvh - 2rem)` with internal scroll on small screens
  - Fields: `--surface-soft` bg, `1px` `--border-ctl` border (3.52:1 on SS), `--r-ctl`, text `--text`
  - Labels `.75rem` uppercase in `--text-2`
- **Transport:** `FORM_ENDPOINT` constant at the top of the script.
  - **Empty → demo mode:** simulated send of ~1000ms. Success by default; `?formstate=error` simulates a network error.
  - **Set → Formspree:** `POST` `FormData` with `Accept: application/json`; 15s timeout → error.
  - The recipient is configured in Formspree.
  - A filled honeypot skips sending and shows success.
- **States** (strictly one at a time, `mstate` = `idle | invalid | sending | success | error`):

  | State | View | What the user sees | a11y |
  |---|---|---|---|
  | idle | form | Empty or kept values, no errors; Send enabled | — |
  | invalid | form | Errors under the failing fields, borders `--error`; focus on the first failing field | `aria-invalid`, `aria-describedby`; live: "N fields need attention." |
  | sending | form | Send `disabled` + `aria-busy`, label "Sending…", spinner replaces the arrow; fields `disabled` at opacity `.6`; no error text | live: "Sending your message…" |
  | success | `#mok` | Badge (`--ink`), "Message sent", confirmation that it reached the inbox, Close. Demo mode adds a `.75rem` note that nothing was delivered. Form is cleared | Focus on the heading; live: "Message sent." |
  | error | `#merr` | Badge (`--surface` + `--error` icon), "Couldn't send", explanation, **Retry** (`.pill.dark`) + Telegram and LinkedIn (`.pill.outline`). Values are kept | Focus on the heading; live: "Couldn't send…" |

- **Validation:**

  | Field | Rule | Message |
  |---|---|---|
  | Name | Required (trimmed) | "Please enter your name." |
  | Email | Required + `name@domain.tld` | "Please enter your email." / "Enter a valid email, like name@company.com." |
  | Message | Required, ≥ 10 characters (trimmed) | "Please write a message." / "Your message is too short: at least 10 characters." |

  - Checked on **blur** once the field has been edited, and on **submit** (all fields).
  - While a field is invalid, typing re-checks it and clears the error as soon as it passes.
- **Transitions:**
  - Retry → sending (form view, kept values) → success or error.
  - Closing keeps values unless the last state was success.
  - Reopening after success or error starts in idle.
- **Motion:**
  - Fade and panel slide `--dur-overlay` (400ms), `--ease-spring`. View switches are instant.
  - The spinner is `.8s linear` (the §2.5 exception); under reduced motion it is static, and the "Sending…" label carries the state.
- **Interaction:**
  - Pills follow §4.1 (hover/focus `scale(1.04)`, active `scale(.98)`).
  - Disabled Send does not scale.
  - `.mx` close: hover/focus `--surface-2` + `--text`.
- **Focus (§6):**
  - On open, focus goes to Name (or the title while sending). `#main`, header and footer become `inert`
  - Tab and Shift+Tab are trapped in the panel
  - `Esc`, the scrim click and `.mx` close it
  - Focus returns to the opener; the menu button if the opener was inside the menu

### 4.10 Fullscreen menu
- **Spec:**
  - `--ink`
  - Index `small` in `--on-ink-3` (decorative number) → `--on-ink` on hover/focus. Holo is never used as text (D1)
  - Label `--on-ink-2` → `--on-ink`
  - `.xbtn`: `--border-on-ink`
  - Bottom bar `--on-ink-2`, divider `--line-on-ink`
- **Motion:** Fade `--dur-overlay`. Links enter over `--dur-overlay` with `--ease-spring`, staggered `--stagger-list`.
- **Focus:** Per §6.

### 4.11 Footer
- **Spec:**
  - `--ink`, sheet corners `--r-card`
  - Tagline and links `--on-ink-2` → `--on-ink` on hover/focus
  - Column `h4` and legal in `--on-ink-2`
  - Dividers `--line-on-ink`
  - **Watermark `KONOVALOVA` stays here only.** Color `rgba(255,255,255,.05)` is decorative and kept (v0); size in rem only (T7)

### 4.12 Loader
- **Spec:**
  - `--ink`, `--z-loader`, sheet corners `--r-card`
  - Brand gap `.5rem` (T7)
  - Progress width rem-only (T7)
  - Fill uses `--holo-gradient`
  - Counter `000→100` in `--on-ink-2`, tabular
- **Motion:** Fill 1300ms (cubic in-out), sheet `--dur-reveal`, content `--dur-exit`, all `--ease-spring`.
- **Known issue (D4):** not visible during the 2026-11-03 review. On 2026-11-04 the page was in quirks mode (no doctype), which also blocked Lenis scrolling. After adding the doctype and moving the inline photos (~0.5MB of base64) out of the HTML, the loader shows from `000`. Backlog #27 tracks the remaining checks.

### 4.13 Hero
- **Spec:**
  - `--ink` block (D6), replacing `--hero-to`
  - B/W portrait + LiquidReveal color layer + dark vignette
  - **Photo files:** `prototype/assets/hero-bw-{1280,2337}.webp` (the `<img srcset>`, `sizes="100vw"`) and `hero-color-{1280,2337}.webp` (the LiquidReveal source, 2337 when `innerWidth × dpr > 1280`). WebP q84, aspect 2337×1568, no upscaling. **The B/W file is always derived from the color file** (desaturate + contrast 1.08) so both layers align pixel-for-pixel. Sources live in `prototype/assets/src/` and are git-ignored
  - Text uses the on-ink tokens
- **Removed:** the hero watermark `KONOVALOVA` (it moves to the footer only) and the Toolkit list (it moves to About).
- **`.hcard` carousel:**
  - `--glass-rest` (+ `--blur-card`); pane `--glass-rest`
  - Fully keyboard-operable (T10, §6)
  - Captions `--on-ink-2`
- **Rating stars:** color is an open question ([§7 Q3](#71-open-questions)).

### 4.14 About — Toolkit
- `.toolkit` in About, under the statement `h2`, above "Find me online".
- Items: Research, Design systems, UI design in Figma, AI-assisted design, Prototyping in code, Image & video generation.
- Label `.75rem`/500 and items `.875rem` in `--text-2`; dot icons in `--text-3` (decorative).
- Grid 2 columns, 3 at ≥640, column-gap `1rem`, row-gap `.75rem`.
- Hover `translateY(-2px)` only if the items become links; otherwise the list is static.

### 4.15 Project card (small) `.pc`
"Other projects" block in `#works`, below the Selected work `.cards`. Smaller sibling of the case card (§4.4). (v1, 2026-11-04)

- **Layout:**
  - Block heading `h3` "Other projects", centred, h3 (card) scale `1.5rem` → `1.875rem` (640), 500, `-.01em`, `margin-bottom:2rem`. Block `margin-top:5rem` after `.cards`.
  - Grid `.pcards`: 1 column → 2 (640) → 3 (1024), gap `1.5rem`. Six cards = 3×2 on desktop.
- **Spec:**
  - `<a class="pc" href="…">` (currently `#`), flex column, `min-height:14rem`, `height:100%` so cards in a row match
  - `--ink`, `--r-card-sm`, padding `1.5rem`, ring `0 0 0 1px var(--line-on-ink)`
  - Content, in order: title `h4` `1.5rem`/500/`-.01em` in `--on-ink`; one-sentence description `.875rem` in `--on-ink-2` (`margin-top:.5rem`); exactly one tag (§4.3, `--line-on-ink` border, `--on-ink-2`) pushed to the bottom (`margin-top:auto`, `padding-top:1.25rem`)
  - No wordmark, no holo gradient text, no meta row, no badge (these stay case-card only)
- **States:**

  | State | Behaviour |
  |---|---|
  | Hover / focus | `translateY(-8px) scale(1.012)`, `--dur-surface`, `--ease-hover` (same as §4.4) |
  | Focus ring | `--ring-light`: the ring sits on the light page outside the card |
  | Active | Hover visual |

- **Droplet:** `data-holo="lg"` (radius 72, magnet), same as case cards.
- **Motion:** `.rv` entrance, `--y:24px`, stagger `--stagger-list` (0–400ms).
- **Placeholders:** unknown copy is written as "Description TBD" / "Tag" and marked `<!-- TBD -->` in the markup (Appmatrix, 2026-11-04).

### 4.16 Accordion row `.acc` / `.srow`
"What I do best" list. Replaces the link rows of §4.5: each row is a disclosure button. (v1, 2026-11-04)

- **Markup:** `ul.acc > li > h3 > button.srow[aria-expanded][aria-controls]` + `div.sp[role=region][aria-labelledby]`. The button holds the index `.ix`, the title `.st` and the `+` badge `.ar` (`aria-hidden`). Title sizes as §4.5 h3 (`1.5rem` → `1.875rem` → `2.25rem`).
- **Panel content:** two lines of text (`1rem`, `--text-2`, `max-width:30rem`) and one case link `.cl` ("<Case> case study →", `.875rem`/500, `--accent`, D1). Indented to the title column: `padding-left:4.25rem` → `5.5rem` (640) = row padding + index width + gap; bottom `2rem`.
- **Behaviour:**
  - Click, `Enter` or `Space` toggles the row (native button)
  - **One open at a time:** opening a row closes the others; activating the open row closes it. All rows start closed
  - A closed panel is `visibility:hidden`, so its link is out of the tab order
- **States:**

  | State | Behaviour |
  |---|---|
  | Hover / focus | Row `--surface` bg + padding shift (`--dur-surface`); `.ar` `scale(1.08)` (`--dur-micro`) |
  | Focus ring | `--ring-light` |
  | Expanded | `+` icon `rotate(45deg)` → ×, `--dur-micro`, `--ease-hover` |
  | Link hover / focus | Arrow `translateX(3px)`, `--dur-micro` |

- **Motion:** The panel opens and closes by `grid-template-rows` `0fr ↔ 1fr`, `--dur-overlay` (400ms), `--ease-spring`; `visibility` flips at the end of the close. Under reduced motion every transition is off (§5.4), so the panel switches instantly.
- **Droplet:** `data-holo="md"` on the button.

---

## 5. Effects rules

### 5.1 LiquidReveal (hero brush)
- **Where:** The hero only. It reveals a color image over the B/W portrait (D3).
- **Parameters:** `FX.brush` ([§5.3](#53-effect-config-object)). Radius `143`.
- **Disabled when:** `(pointer: coarse)`, `pointerType==='touch'` or `prefers-reduced-motion`. The hero then shows the **static B/W photo** (D3).

### 5.2 Glass holo droplet cursor
- **Where:** **Every page**, including the hero and case pages (D3). Hidden (radius 0) over the loader, menu and modal.
- **Radii** (`FX.drop.radius`):

  | Zone | Radius |
  |---|---|
  | `default` | 16 |
  | `md` (`[data-holo]`) | 30 |
  | `lg` (`[data-holo="lg"]`, magnet `.18`) | 72 |
  | `read` (`[data-read]`) | 5 |
  | `hero` | 16 |
  | `heroHolo` | 30 |
  | `off` | 0 |

- **In the hero (D3):**
  - The droplet renders **above** the brush canvas (`--z-cursor` > `--z-bg`)
  - Diameter must be **< 143px**, so the hero radius is ≤ 71. With 16/30 the diameters are 32/60
  - The droplet's low centre alpha (`.06`) lets the color revealed by the brush show through. The `#lens` backdrop blur is **not** shown over the hero, because it would re-blur the live brush canvas every frame (§5.6). The shader rim carries the glass look there
  - The brush keeps painting under the droplet
- **Disabled when:** `(pointer: coarse)`, `pointerType==='touch'` or `prefers-reduced-motion`. No droplet or lens is rendered (D3).
- **Position:** The droplet centre equals the pointer, except for the `follow` smoothing and the `lg` magnet. Measured offset ≤ 1.3px at 1440 and 745 widths (2026-11-04). The canvas is `FX.drop.box` CSS px square and follows the droplet via `transform`; the shader's `uDpr` is the exact backing/CSS ratio.

### 5.3 Effect config object
All effect constants live in one JS object (T5), `FX` in `prototype/index.html`. The values are v0 except `drop.radius.hero` and `heroHolo` (v1, D3) and the performance fields `dprMax`, `drop.box`, `drop.settleMs` and `countUp` (2026-11-04).

```js
const FX = {
  dprMax: 1.5,                                   // both canvases (§5.6)
  brush: { radius: 143, decay: .016, idleDecayStep: .004, idleDecayMax: .5,
           idleClearFrames: 120, stepRatio: .3, maxStamps: 60 },
  drop:  { radius: { off: 0, read: 5, default: 16, md: 30, lg: 72, hero: 16, heroHolo: 30 },
           follow: .2, grow: .12, magnet: .18, drawMin: .4, lensMin: 2,
           settleMs: 1200,                       // wobble keeps animating this long after the last pointer move
           box: 192 },                           // droplet canvas size, CSS px (≥ 2 × 72 × 1.2 + AA)
  countUp: { duration: 1200, stagger: 80, threshold: .35 }
};
// invariant (D3): 2 * max(FX.drop.radius.hero, FX.drop.radius.heroHolo) < FX.brush.radius
```

### 5.4 Reduced motion
- CSS kills animations and transitions, and forces reveals visible.
- Lenis is off.
- The loader still renders `000→100` but completes instantly (open: see backlog #27).
- No LiquidReveal and no droplet (D3).
- **Stats show final values immediately (T11).** Otherwise the count-up starts once, when `.stats` is 35% in view (IntersectionObserver, which also works with Lenis because Lenis drives native scroll), over 1200ms with an 80ms stagger.
- The carousel swaps instantly.

### 5.5 Touch / coarse pointer
- No droplet, no lens, no brush (D3).
- Every hover rule is inside `@media (hover:hover)`, so no hover state sticks on touch (T9).


### 5.6 Performance
Target: 60 fps while scrolling and moving the pointer, and an idle page when nothing moves. Measured on 2026-11-04 (Chrome, 1440×900, DPR 2, 10s scripted wheel + pointer trace): 53 → 60 fps, frames dropped at 60Hz 70 → 1–4, 0 main-thread frames > 16ms; rAF callbacks while idle 441–540 / 3s → 0.

- **One rAF loop.** Every per-frame effect (Lenis, brush, droplet, count-up) is a task in one shared `requestAnimationFrame` loop. A task returns `true` while it still has work; the loop stops when none does and restarts on input (`wake()`). No effect may start its own perpetual rAF.
- **Handlers only record.** `pointermove`, `scroll`, `wheel` and `keydown` handlers store coordinates or flags and call `wake()`. All reading and drawing happens inside the loop.
- **No layout reads per frame.** Rects (`#home`, every `[data-holo]` and `[data-read]`) are cached in document coordinates by `measure()` on resize, body resize, image load and `transitionend`. Zones are hit-tested against that cache, not `elementFromPoint`. The scroll offset is read once per frame (`lenis.animatedScroll`, else `scrollY`) before any style writes.
- **Pause when idle or hidden.**
  - The brush stops when its trail has fully faded and the pointer is still, and does not render while the hero is off-screen (IntersectionObserver; the trail is cleared on exit).
  - The droplet stops `settleMs` after the last pointer move, once position and radius have converged, keeping its last frame.
  - The loop does not run while `document.hidden`.
- **Canvas density.** `devicePixelRatio` is capped at `FX.dprMax` (1.5) for both canvases.
- **Small droplet canvas.** `#drop` is a `FX.drop.box` square that follows the droplet with `transform`, not a full-viewport WebGL canvas.
- **Brush fade on the dirty rect only.** `destination-out` fades only the bounding box of stamps since the trail was last empty. Outside it the canvas is already transparent, so the result is identical.
- **Compositor-only writes.** Moving or resizing the droplet and lens changes only `transform` and `opacity` (the lens is a fixed 160px box scaled by `transform`), and only when the value changed.
- **No live `backdrop-filter` over animated content.** A backdrop blur above a canvas that changes every frame is re-rendered every frame.
  - `.hcard` uses a **pre-blurred glass**: a static `filter:blur(12px)` copy of the hero photo with the same cover math, vignette and `.12` white tint, positioned by `measure()`. Measured difference against the live blur: mean 0.4/255 at 1440, 8/255 at 745.
  - `.chip` and `.menu-btn` have no blur. It was invisible over the dark backdrop: mean difference ≤ 0.5/255.
  - The lens is hidden over the hero (§5.2).
  - `backdrop-filter` stays only on static overlays (modal scrim) and on the lens outside the hero.

---

## 6. Accessibility rules

- **Focus ring:** `--ring-light` on light, `--ring-ink` on ink. Both are ≥ 3:1 (§2.1). Focus-visible mirrors hover (§3).
- **Menu and modal (T10):**
  - On open, focus moves inside: the menu goes to its first link, the modal to the Name field
  - Tab and Shift+Tab are trapped inside
  - `Esc` closes
  - On close, focus returns to the element that opened it
  - The background is inert while open
- **`aria-current`:** updates on navigation and when a section enters view (T10).
- **Carousel (T10):**
  - Prev/next are focusable buttons; `←`/`→` work while focus is inside the carousel group
  - The live region announces the new item
  - Clicking the card body is only a pointer shortcut; the keyboard path is the buttons and arrow keys
- **Form:**
  - Labels are tied to fields
  - Errors per §3
  - The submit button is disabled while sending
- **Skip link:** kept (v0).

---

## 7. Inconsistencies & open questions

Each v0 item (DESIGN.md §5 at commit `f2c53c5`) is either **Resolved → rule**, or left **Open**.

### 7.0 Status of v0 items

**5.1 Near-duplicate values**

| # | Item | Status |
|---|---|---|
| 1 | Two near-blacks `#111111` / `#0a0a0a`; `#111` hardcoded | **Resolved →** [T3, T1 §2.1](#21-colors) |
| 2 | Three near-identical greys (`--muted`, `.5`, `.45`) | **Resolved →** [`--text-2`/`--text-3` §2.1](#21-colors) |
| 3 | Alpha ladders too fine | **Resolved →** [text and on-ink tokens §2.0](#20-token-block) |
| 4 | `--line` with alpha (`rgba(230,229,226,.8/.7)`) | **Resolved →** [§2.0](#20-token-block): only the removed light header/hcard used them (D6); `--line-on-ink` covers dark |
| 5 | Surface alphas `.7/.6/.5` | **Resolved →** [`--surface-soft` §2.0](#20-token-block) |
| 6 | No glass token | **Resolved →** [`--glass-rest`/`--glass-hover` §2.1](#21-colors) |
| 7 | `--hero-to` misnamed flat background | **Resolved →** [§4.13](#413-hero): hero is `--ink`, token retired |
| 8 | Different easing for similar entrances; untokenised `ease-out` / `ease` | **Resolved →** [T6 §2.5](#25-motion) |
| 9 | Overlay durations `.4/.45/.5s` | **Resolved →** [`--dur-overlay` 400ms §2.5](#25-motion) |
| 10 | Hover durations `.3s`/`.35s` | **Resolved →** [`--dur-micro` 300ms §2.5](#25-motion) |
| 11 | Five stagger steps | **Resolved →** [`--stagger-list` 80ms §2.5](#25-motion) (heading lines: Q7) |
| 12 | Sheet corners `2rem` hardcoded | **Resolved →** [`--r-card` §2.4](#24-radii-borders-shadows-blur-z-index) |
| 13 | Gap `.6rem` | **Resolved →** [T7 §2.3](#23-spacing-scale-and-grid) (`.5rem`) |
| 14 | `min(13rem,16vw)` mixes vw/rem | **Resolved →** [T7 §2.3](#23-spacing-scale-and-grid) |

**5.2 Hardcoded instead of tokens**

| # | Item | Status |
|---|---|---|
| 15 | No `--on-ink` | **Resolved →** [T2 §2.1](#21-colors) |
| 16 | Holo gradient written three ways | **Resolved →** [`--holo-gradient` §2.0](#20-token-block) |
| 17 | Shadows, blur, z-index as literals | **Resolved →** [§2.4](#24-radii-borders-shadows-blur-z-index) |
| 18 | `holoize()` extra colors | **Resolved →** dead code removed ([backlog #24](#8-stage-3-backlog)) |
| 19 | Effect constants not centralised | **Resolved →** [`FX` §5.3](#53-effect-config-object) |

**5.3 Dead / orphan code**

| # | Item | Status |
|---|---|---|
| 20 | `placeholder()`, `holoize()` unused | **Resolved →** [backlog #24](#8-stage-3-backlog) |
| 21 | `.upl`, `#photo` orphan styles | **Resolved →** [backlog #24](#8-stage-3-backlog) |
| 22 | `aria-current` static | **Resolved →** [T10 §6](#6-accessibility-rules) |
| 23 | Light hero/header variant unused | **Resolved →** [D6](#1-decisions-log-2026-11-03): removed |

**5.4 Root scale**

| # | Item | Status |
|---|---|---|
| 24 | rem jumps at breakpoints | **Resolved →** [T8 §2.3](#23-spacing-scale-and-grid) |
| 25 | Breakpoint sizes compound with vw-scaled rem | **Resolved →** [T8 §2.3](#23-spacing-scale-and-grid): rem is constant below 1920, so only breakpoints scale |
| 26 | Is JS `grid()` needed | **Resolved →** [T8 §2.3](#23-spacing-scale-and-grid): removed |

**5.5 States and focus**

| # | Item | Status |
|---|---|---|
| 27 | No disabled state; Send not disabled | **Resolved →** [T9 §3](#3-interaction-states) |
| 28 | No active state | **Resolved →** [§3](#3-interaction-states) |
| 29 | Focus doesn't mirror hover | **Resolved →** [§3](#3-interaction-states) |
| 30 | Field `outline:none`, weak border | **Resolved →** [§3, §4.9, T4](#3-interaction-states) |
| 31 | Accent ring weak on ink | **Resolved →** [`--ring-ink` §2.1](#21-colors) |
| 32 | No error state | **Resolved →** [§3](#3-interaction-states), [§4.9](#49-contact-modal) |
| 33 | Dialog focus management | **Resolved →** [T10 §6](#6-accessibility-rules) |
| 34 | Carousel not keyboard-operable | **Resolved →** [T10 §6](#6-accessibility-rules) |
| 35 | Band pills have hover but aren't interactive | **Resolved →** [D5 §4.8](#48-band-i--design----ship): static |

**5.6 Hover and touch**

| # | Item | Status |
|---|---|---|
| 36 | Hovers not gated by `hover:hover` | **Resolved →** [§3](#3-interaction-states) |
| 37 | LiquidReveal on touch | **Resolved →** [D3 §5.1](#51-liquidreveal-hero-brush): off on coarse/touch |

**5.7 Reduced motion**

| # | Item | Status |
|---|---|---|
| 38 | Count-up animates under reduced motion | **Resolved →** [T11 §5.4](#54-reduced-motion) |
| 39 | Carousel swap under reduced motion | **Resolved →** no conflict, instant swap kept ([§5.4](#54-reduced-motion)) |

**5.8 Contrast**

| Item | Status |
|---|---|
| `.55/.5/.45/.4` ink text on white | **Resolved →** [`--text-2`/`--text-3` §2.1](#21-colors) |
| `--muted` | **Resolved →** retired |
| `--line` field borders 1.26 | **Resolved →** [`--border-ctl` T4](#24-radii-borders-shadows-blur-z-index) |
| "Ship" 2.26 | **Resolved →** [D5](#48-band-i--design----ship): `--accent` on `--surface-soft`, 5.21 |
| White `.45/.4/.3` on ink | **Resolved →** [`--on-ink-2`/`--on-ink-3` §2.1](#21-colors) |
| Text and glass **over the hero photo** | **Open** — needs a visual check ([backlog #28](#8-stage-3-backlog)) |

**5.9 v0 open questions**

| # | Question | Status |
|---|---|---|
| 40 | Is `--muted` the secondary token? | **Resolved →** T1, retired |
| 41 | Merge `--foreground`/`--ink`? | **Resolved →** T3, kept separate |
| 42 | Dark theme? | **Resolved →** D6, none |
| 43 | Canonical entrance easing | **Resolved →** T6, `--ease-spring` |
| 44 | Official list stagger | **Resolved →** T6, 80ms |

### 7.1 Open questions

| # | Question |
|---|---|
| Q1 | **Geist Mono trial (D2):** keep or fall back to Onest after the live check? |
| Q2 | **Other accent uses:** v0 also uses `--accent` for the LinkedIn `.soc.a` background and the modal `.mh .k` dot. D1 lists only links, the focus ring and the band word. Keep these, or move them to `--ink`/`--text`? |
| Q3 | **Holo-tinted icons:** brand icon (`--holo-2` on ink), dark-hero rating stars (`--holo-1`), success badge icon. D1 bans holo as *text*. Are icons allowed, or should they become `--on-ink`? |
| Q4 | ~~`--error` color~~ **Resolved 2026-11-04 (D7):** `#b42318`, 6.57:1 on white. |
| Q5 | **Hero text contrast over the photo:** to be measured visually in Stage 3. |
| Q6 | **`--dur-surface` 450ms** for card/row hover: T6 sets micro-hover to 300ms but says nothing about large surfaces. Keep 450ms or unify to 300ms? |
| Q7 | **Heading line stagger:** 120ms proposed (v0 used 100 and 120). Confirm. |
| Q8 | **Root scale above 1920px:** cap at `21.3333px` (2880px viewport) is proposed. Confirm or remove the cap. |
| Q9 | **Loader not visible (D4):** see backlog #27. Under reduced motion, should the loader show a static `100` frame briefly, or skip? |
| Q10 | **Stats panel:** D6 lists the `--ink` blocks as hero, case cards, footer, menu and loader. The stats panel is `--ink` in v0. Is it one more allowed ink block, or should it move to a light surface? v1 keeps it on `--ink` until answered. |

---

## 8. Stage 3 backlog

Concrete edits to `prototype/index.html` that bring it to v1. Each item cites the rule it implements.

1. **Token block.** Replace `:root` (L9–19) with the §2.0 block. Remove `--muted` and `--hero-to`.
2. **Remove the light variant (D6).**
   - Fold the `#home.dark` / `header.top.dark` rules (L154–174) into the base selectors.
   - Delete the light-only base declarations they override (`.vig` light gradient, light `.hcard`/`.pane`, light `.chip`/`.menu-btn` glass, light `.eyebrow`/`.rating`/`.status` colors in the hero).
   - Drop the `dark` classes from `#home` and `#hdr`.
3. **Text tokens on light (T1).**
   - Replace every `rgba(17,17,17,.4–.7)` text color with `--text-2`, or `--text-3` only where the text is ≥24px or decorative.
   - Replace `#111` with `var(--text)`.
   - Replace `.stmt h2 .g`'s `--muted` with `--text-2`.
   - `.srow .ix` (`.875rem`) → `--text-2`.
4. **Text tokens on ink (T2).** Replace `#fff` with `--on-ink` and the white alphas with `--on-ink-2`/`--on-ink-3` across the loader, `.wc`, `.stats`, footer, `#nav`, hero.
5. **Borders (T4).**
   - Fields: `--border-ctl`.
   - Outline pill and `.xbtn`/`.chip`/`.menu-btn` on ink: `--border-on-ink`.
   - Dividers: `--line` / `--line-on-ink`.
6. **Glass and surfaces (T5).**
   - `.chip`, `.menu-btn`, `.hcard`, `.pane`: `--glass-rest`; hover `--glass-hover`.
   - Field bg and the band last pill: `--surface-soft`.
7. **Holo gradient (T5).** `.bt.h`, `.wc .mark span` and `.fill` use `var(--holo-gradient)`.
8. **Shadows, blur, z-index, radius (T5).**
   - Replace literals with `--shadow-*`, `--ring-hairline`, `--blur-*` and `--z-*`.
   - Use `--r-card` for the `#loader`, `#home` and `footer` sheet corners.
9. **Hero background (D6).** `#home{background:var(--ink)}`.
10. **Holo never as text (D1).** `#nav .nl button:hover small` changes from `--holo-1` to `--on-ink`. Then grep that no `color:var(--holo-*)` remains on a text element (icons per Q3).
11. **Remove the hero watermark.** Delete `.wm` markup (L401) and CSS (L108–109, L168). Keep the footer `.fwm`, sized in rem only (T7).
12. **Move Toolkit to About.** *Done 2026-11-04 (§4.14).*
    - Move the `.partners` markup out of `.hrc` into `#about`.
    - Restyle it for light with `--text-2` and `--text-3` icons.
    - Drop the `data-hero` delay.
    - Re-check the hero right column with only `.hcard` in it.
13. **Band (D5).**
    - Last word color `--accent`, bg `--surface-soft`.
    - Remove `.bt:hover` and the `data-holo` attributes on `.bt`.
    - Ensure `cursor:default`.
    - Keep the words as placeholders.
14. **Fonts (D2).**
    - Load Geist Mono from Google Fonts.
    - Add `--font-mono` to `.eyebrow`, `.mh .k`, `.chip .t`/`.chip .dt`, `.wc .meta` and `.sg .n`.
    - Rewrite the case meta content as role · dates · platform.
    - Reserve the final width on `.sg .n` (`min-width` in `ch`) and keep `tabular-nums`.
    - Verify that no mono text is larger than `.875rem` except `.sg .n`.
15. **Easing (T6).**
    - `.rv`, loader, carousel, nav links, `#nav`, `#modal` and `.panel` use `--ease-spring`.
    - Remove `ease-out` (L303) and every transition without an easing token (`.pnav`, `.menu-btn`, `.dots i`, `.al`, `#nav .nl small/span`, form fields).
16. **Durations (T6).**
    - Overlays: `#modal`, `#nav` and `.panel` at 400ms; nav links at 400ms.
    - Micro-hovers: change `.35s` and `.4s` (badge) to 300ms.
    - Field focus `.2s` → 300ms.
    - Update the JS `setTimeout`s that mirror these durations (modal reset 300 → keep ≥ 400, nav close delay).
17. **Stagger (T6).**
    - Lists at 80ms steps: cards and stats (0/80/160/240), band (0/80/160/240), nav links (0/80/160/240/320/400), services (already 80).
    - Heading lines at 120ms (Q7).
18. **Root scale (T8).** Replace the media queries at L22–25 with the `clamp` from §2.3 and delete `grid()` with its resize listener (L607–610).
19. **Spacing and units (T7).** `#loader .brand` gap `.6rem` → `.5rem`. `.prog` width `min(22rem,72vw)` → rem-only (e.g. `width:100%; max-width:22rem`).
20. **States (T9).**
    - Wrap `.nb button:hover`, `.xbtn:hover`, `#nav .nl button:hover`, `#nav .bb button:hover`, `.mx:hover` (and any remaining hover) in `@media (hover:hover)`.
    - Add `:focus-visible` rules that mirror each hover, plus the ring (`--ring-light` / `--ring-ink`).
    - Add `:active` `scale(.98)` on pills and round buttons.
    - Add `:disabled` / `[aria-disabled]` styles.
    - Add the field error style and messages.
    - Set `disabled` on `#send` while "Sending…".
21. **Dialogs (T10).** *Modal done 2026-11-04 (§4.9); the menu remains.* In `openNav` and `openModal`: store the opener, move focus inside, trap Tab, make the background `inert`. In `closeNav` and `closeModal`: restore focus to the opener. Keep `Esc`.
22. **`aria-current` (T10).** Update it from an IntersectionObserver on the sections and on `data-go` clicks, in both `.pnav` and `#nav`.
23. **Carousel keyboard (T10).** Add `←`/`→` handling on `#carousel`. Keep prev/next buttons. Do not let the body click be the only path. Expose position ("1 of 3") to the live region.
24. **Dead code.** Delete `placeholder()` (L694–699), `holoize()` (L700–712), `.upl` and `#photo` CSS (L150–151), and the light-variant CSS (see #2).
25. **Effects config and droplet in the hero (T5, D3).**
    - Introduce `FX` (§5.3) and replace the scattered constants.
    - In `zone()`, return `hero` (16) / `heroHolo` (30) instead of `0` inside `#home`.
    - Assert `2*radius < FX.brush.radius`.
    - Confirm the droplet draws above the `#lrc` brush and the revealed color shows through.
    - Include the droplet script on case pages.
26. **Touch and reduced motion for the brush (D3, T11).**
    - Gate the LiquidReveal `pointermove` and tick on `!coarse` and `pointerType!=='touch'`, keeping the static B/W photo.
    - Under reduced motion, set `.sg .n` to final values on load and skip the scroll listener.
27. **Loader check (D4).** *2026-11-04: doctype added and inline photos removed; the loader is visible from `000` in local checks.* Remaining: reproduce on the original review setup. Hypotheses to test:
    - a. `prefers-reduced-motion` was on, so `FILL` is 1ms and the fallback is 0ms.
    - b. The preview opened after the 1.3s run.
    - c. A `transitionend` race removed it early.

    Fix it so it is visible for its full fill in the normal case. Decide (Q9) whether reduced motion should show a static `100` frame briefly or skip.
28. **Visual contrast check over the photo (Q5).** Measure hero text, glass chip/menu and `.hcard` against the darkest/lightest photo regions, with and without the brush reveal. Adjust the vignette, not the tokens, if needed.
29. **Verification greps after the edits:**
    - `rgba(17,17,17` only in the modal scrim.
    - No `#111` or `--muted`.
    - No `ease-out` / bare `ease`.
    - No `vw` inside component sizes.
    - No `color:var(--holo`.
    - Every `:hover` inside `@media (hover:hover)`.
