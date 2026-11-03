# Konovalova Portfolio — Design System

**Status: DRAFT v0, extracted from prototype/index.html**

This document records what `prototype/index.html` actually does. Nothing here has been normalised or "fixed". Every value was found in the prototype unless it is marked **inferred** (derived by reading or calculating, not copied as-is). Proposed token *names* for values the prototype hardcodes are also marked inferred; the values themselves come from the file.

Line references (`L123`) point to `prototype/index.html` at commit `320ad0d`.

---

## 1. Tokens

### 1.1 CSS custom properties

The first block is copied verbatim from `:root` (L9–19). The second block gives draft names to values the prototype hardcodes. The names are inferred, the values are not.

```css
:root {
  /* — Defined in prototype :root (verbatim) — */
  color-scheme: light;
  --background:#ffffff; --foreground:#111111; --ink:#0a0a0a;
  --muted:#8d8d8d; --line:#e6e5e2; --surface:#f1f0ee; --surface-2:#e3e2df;
  --accent:#4f5bd5; --holo-1:#6fe3e1; --holo-2:#b9a7ff; --holo-3:#ffc7a3;
  --hero-to:#c9c9c9;
  --r-card:2rem; --r-card-sm:1.25rem; --r-ctl:.875rem;
  --font:"Onest", "Helvetica Neue", Arial, sans-serif;
  --ease-line:cubic-bezier(.215,.61,.355,1); --ease-word:cubic-bezier(.165,.84,.44,1);
  --ease-spring:cubic-bezier(.22,1,.36,1); --ease-hover:cubic-bezier(.2,.8,.2,1);

  /* — Draft aliases for hardcoded values (names inferred, values found) — */
  --on-ink:#fff;                                   /* text/icons on --ink */
  --holo-gradient:linear-gradient(135deg,var(--holo-1),var(--holo-2) 55%,var(--holo-3)); /* .bt.h */
  --holo-gradient-text:linear-gradient(135deg,var(--holo-1),var(--holo-2),var(--holo-3)); /* .wc .mark span */
  --holo-gradient-bar:linear-gradient(90deg,var(--holo-1),var(--holo-2),var(--holo-3));   /* loader .fill */
  --r-pill:9999px;
  --r-shell:2rem;                                  /* loader / hero / footer outer corners */
  --shadow-panel:0 25px 50px -12px rgba(0,0,0,.25),0 0 0 1px var(--line);
  --shadow-hcard:0 1px 2px rgba(0,0,0,.05),0 0 0 1px rgba(230,229,226,.7);
  --blur-ctl:blur(4px); --blur-card:blur(12px); --blur-overlay:blur(16px);
}
```

### 1.2 Colors

#### Semantic tokens

| Token | Value | Where used |
|---|---|---|
| `--background` | `#ffffff` | `body` background |
| `--foreground` | `#111111` | `body` text, `.pill.light` text. Also hardcoded as `#111` in 6 places (`.chip .t`, `.nb button:hover`, `.partners li:hover`, `.globe .note .ico`, `.bt.h`, `.mx:hover`) |
| `--ink` | `#0a0a0a` | Dark surfaces: loader, `.pill.dark`, `.pill .bd`, `.tile`, `.bt.d`, `.wc` case card, `.srow .ar`, `.stats`, `footer`, `#nav`, `.ok .bdg`, `.skip:focus`. Also `<meta name="theme-color">` |
| `--muted` | `#8d8d8d` | Used only by `.stmt h2 .g` (secondary half of the About statement) |
| `--line` | `#e6e5e2` | Borders: `.pill.outline`, `.eb-pill`, `.sfoot`, `.svc li`, form fields. Rings: `.nb button`, `.panel` |
| `--surface` | `#f1f0ee` | `.pill.light`, `.soc`, `.bt.l`, `.srow:hover`, `.mx` |
| `--surface-2` | `#e3e2df` | Used only by `.mx:hover` |
| `--accent` | `#4f5bd5` | `:focus-visible` outline, `.logo .ico`, `.rating .stars`, `.soc.a` background, `.mh .k::before` dot |
| `--holo-1` | `#6fe3e1` | Holo gradients, dark-hero `.rating .stars`, `#nav .nl button:hover small` |
| `--holo-2` | `#b9a7ff` | Holo gradients; brand icon on ink (`#loader .brand .ico`, `.tile`, `header.top.dark .logo .ico`, `.fcols .b .ico`, `#nav .tb .b .ico`, `.ok .bdg`) |
| `--holo-3` | `#ffc7a3` | Holo gradients |
| `--hero-to` | `#c9c9c9` | `#home` background (visible until the photo loads) |

#### Holo gradients (all use `--holo-1/2/3`)

| Use | Value |
|---|---|
| Band "Design" pill `.bt.h` | `linear-gradient(135deg,var(--holo-1),var(--holo-2) 55%,var(--holo-3))` |
| Case-card wordmark `.wc .mark span` (clipped to text) | `linear-gradient(135deg,var(--holo-1),var(--holo-2),var(--holo-3))` |
| Loader progress `.fill` | `linear-gradient(90deg,var(--holo-1),var(--holo-2),var(--holo-3))` |
| WebGL droplet iridescence | Cosine palette `film()` mixed with `vec3(.3,.95,.9)` at `.3`. Shader-only, no CSS token |

#### Hardcoded colors outside tokens

- **Ink-alpha text, `rgba(17,17,17,α)`** (= `--foreground` with alpha). α values used: `.1` `.2` `.3` `.35` `.4` `.45` `.5` `.55` `.6` `.7`
  - `.7`: secondary text (`.eyebrow`, `.rating`, `.chip`, `.partners li`, `.globe .note`, `.soc`, `.nb button`, active dot)
  - `.6`: `.status`, `.mx`, `.mh .k`, `.ok p`
  - `.55`: `.srow p`
  - `.5`: `.eyebrow::before`, form label
  - `.45`: tertiary/caption (`.chip .lbl`, `.item small`, `.partners p`, `.sfoot p`, `.fb small`)
  - `.4`: `.partners li .ico`, `.srow .ix`
  - `.35`: `.bt.g` text
  - `.3`: `.chip .sep`, focused input border, modal scrim `rgba(17,17,17,.3)`
  - `.2`: inactive carousel dot
  - `.1`: `.status` top border, `.globe .big` icon
- **White-alpha on ink / dark hero, `rgba(255,255,255,α)`**. α values: `.05` `.1` `.12` `.15` `.16` `.2` `.25` `.3` `.35` `.4` `.45` `.5` `.55` `.6` `.65` `.7` `.75` `.78` `.8`. Main uses:
  - `.8`: loader counter
  - `.78`: dark-hero eyebrow/rating
  - `.75` / `.7`: links, nav items, `.xbtn`
  - `.55`: body copy on ink (`.wc p`, `.sg p`, `.fcols .tg`)
  - `.45`: meta (`.wc .meta`, `.legal`, `#nav .bb`)
  - `.4`: footer `h4`
  - `.3`: nav index numbers
  - `.25`–`.1`: borders and rings
  - `.05`: footer watermark, `.wc` ring
- **Line-alpha**: `rgba(230,229,226,.8)` (`.chip`, `.menu-btn` border), `rgba(230,229,226,.7)` (`.hcard` ring)
- **Surface-alpha**: `rgba(241,240,238,.7)` (`.pane`), `rgba(241,240,238,.6)` (`.bt.g`), `rgba(241,240,238,.5)` (form fields)
- **Glass white**: `rgba(255,255,255,.4)` (chip/menu-btn, light), `rgba(255,255,255,.7)` (menu-btn hover, `.hcard`)
- **Black**: `rgba(0,0,0,.05)` and `rgba(0,0,0,.25)` (shadows); `rgba(0,0,0,.28)` and `rgba(0,0,0,.3)` (dark-hero vignette)
- **Vignette (light)**: `linear-gradient(to bottom,rgba(255,255,255,.35),transparent,rgba(255,255,255,.35))`
- **Vignette (dark)**: `linear-gradient(to bottom,rgba(0,0,0,.28),transparent 45%,rgba(0,0,0,.3))`
- **JS-only (canvas)**: `placeholder()` uses `#ecebe9`, `#c9c9c9` and `#a9a8a5`. `holoize()` uses `#6fe3e1`, `#b9a7ff`, `#ffc7a3`, `#8ff0c8`, `#a9b8ff`, `rgba(255,255,255,.85)`, `rgba(40,20,120,.55)` and `rgba(255,255,255,.35)`. Both functions are defined but never called (see §5).

### 1.3 Typography

**Family:** `--font: "Onest", "Helvetica Neue", Arial, sans-serif`. Loaded from Google Fonts with weights `400;500;600;700` and `display=swap`.
**Rendering:** `-webkit-font-smoothing:antialiased`. `line-height` is not set on `body` (browser `normal`).
**Tabular figures** (`font-variant-numeric:tabular-nums`): loader counter `.prog .row b`, clock `.chip .t`, stat numbers `.sg .n`.

Sizes are in `rem`. The rem itself scales with viewport width (see §1.4). "→" marks the next breakpoint up.

| Role | Size | Weight | Line-height | Letter-spacing | Transform | Where |
|---|---|---|---|---|---|---|
| **display / watermark** | `min(13rem,16vw)` | 700 | 1 | `-.03em` | — | `.wm` (hero, `KONOVALOVA`), `.fwm` (footer) |
| display / card wordmark | `4.5rem` | 700 | — | `-.04em` | — | `.wc .mark span` (holo text) |
| **digits (stat)** | `3rem` → `3.75rem` (640) → `4.5rem` (768) | 600 | 1 | `-.02em` | — | `.sg .n`, tabular-nums |
| **h1** | `2.25rem` → `3rem` (640) → `3.75rem` (768) | 600 | `.98` | `-.02em` | — | `#home h1`, max `18ch` |
| h1 (footer CTA) | `2.25rem` → `3rem` → `3.75rem` | 600 | `1.02` | `-.02em` | — | `.fcta h2`, max `16ch` |
| nav overlay link | `2.25rem` → `3.75rem` (640) | 600 | — | `-.02em` | — | `#nav .nl button` |
| **h2** | `2.25rem` → `3rem` (640) | 600 | `1.05` | `-.02em` | — | `.h2` (section titles) |
| h2 (stats) | `1.875rem` → `2.25rem` (768) | 500 | `1.15` | `-.01em` | — | `.stats h2` |
| h2 (statement) | `1.5rem` → `1.875rem` (640) | 500 | `1.35` | `-.01em` | — | `.stmt h2` |
| band label | `1.875rem` → `2.25rem` (640) | 500 | — | — | — | `.bt` |
| **h3** (list row) | `1.5rem` → `1.875rem` (640) → `2.25rem` (768) | 500 | — | `-.01em` | — | `.srow h3` |
| h3 (case card) | `1.5rem` → `1.875rem` (640) | 500 | — | `-.01em` | — | `.wc h3` |
| h3 (modal title) | `1.5rem` → `1.875rem` (640) | 600 | — | `-.01em` | — | `.mh h2`, `.ok h2` (`.ok h2` does not scale) |
| brand (loader) | `1.875rem` | 600 | — | — | — | `#loader .brand` |
| brand (header/footer/nav) | `1.125rem` | 600 | — | `-.01em` (`.logo` only) | — | `.logo`, `.fcols .b`, `#nav .tb .b` |
| **body** | `.875rem` | 400/500 | — (`.item span`: `1.35`) | — | — | Default UI text, `.pill`, paragraphs, tags, form fields |
| body-lg | `1rem` | 400 | — | — | — | `#nav .nl small` |
| social glyph | `.8rem` | 600 | — | — | — | `.soc` |
| **small / meta** | `.75rem` | 400/500 | — | `.025em` or `.05em` | uppercase (mostly) | `.status`, `.wc .meta`, `.fcols h4`, form label, `#nav .bb` (`.025em`); `.menu-btn`, `.xbtn`, `.prog .row` (`.05em`); `.chip`, `.partners`, `.legal`, `.fb small` (not uppercase) |
| **eyebrow** | `.875rem` | 500 | — | — | — | `.eyebrow`, `.mh .k`: 6px dot (`.375rem`) + label |
| micro | `.65rem` | 500 | — | `.05em` | uppercase | `.item small` (carousel caption) |

### 1.4 Spacing, rem scaling and grid

**Root font-size (CSS, L21–25):**

| Viewport | `html{font-size}` | 1rem at the top of the range (**inferred**) |
|---|---|---|
| default (> 1920px) | `16px` | 16px |
| `max-width:1920px` | `.833333vw` | 16px at 1920 |
| `max-width:1440px` | `1.111111vw` | 16px at 1440 |
| `max-width:1024px` | `1.5625vw` | 16px at 1024 |
| `max-width:640px` | `4.444444vw` | 16px at 360 (28.4px at 640) |

**JS `grid()` (L608–610):** `B=16,W=1920,k=.6666`, `s = B − B·(((W−w)/W)·100·k)/100`. It writes the inline `font-size` only when `s > 16`, i.e. viewport wider than 1920px. Below that it removes the inline value and the CSS above applies. Result: above 1920 the rem grows by about 0.6666 × the overflow ratio (**inferred**).

**Breakpoints (min-width, component level):** `640px`, `768px`, `1024px`. Max-width mirrors: `639px` (`.menu-btn .word`, `.partners ul`). Root-scale breakpoints: `640 / 1024 / 1440 / 1920`.

**Container `.shell`:** `max-width:88rem`, centred. Side padding `max(1.25rem, env(safe-area-inset-left, 0px))`, becoming `2rem` at ≥640.

**Hero grid `.hgrid`:** flex column with `gap:2rem` (padding `7rem` top / `5rem` bottom). At ≥1024 it switches to `grid-template-columns:repeat(12,1fr)`, `gap:2.5rem`, `min-height:100lvh`, padding `9rem` / `7rem`. Left column spans 7, right spans 5.

**Section rhythm (padding-block):**

| Section | Mobile | ≥640 / ≥768 | ≥1024 |
|---|---|---|---|
| `.about` | `5rem` | — | `7rem` |
| `.band` | `2.5rem` | — | — |
| `.sec` (work, approach) | `2.5rem 5rem` | — | bottom `7rem` |
| stats wrapper (inline) | bottom `5rem` | — | — |
| `.stats` card | `3rem 1.5rem` | `4rem 2rem` → inline `4rem` (768) | — |
| `footer .shell` | top `5rem`, bottom `2.5rem` | — | top `6rem` |
| `.fcta` / `.fcols` | bottom `4rem` / block `4rem` | — | — |

**Gaps in use:** `.25rem`, `.375rem`, `.5rem`, `.6rem` (`#loader .brand` only), `.75rem`, `1rem`, `1.25rem`, `1.5rem`, `1.75rem`, `2rem`, `2.5rem`, `3rem`, `3.5rem` (`.sg` margin-top). The scale is effectively 4px-based with one outlier at `.6rem` (**inferred**).

**Other grids:**
- `.cards`: 1 column, 2 at ≥768, gap `1.5rem`
- `.sg`: 2 columns, 4 at ≥1024, column-gap `2rem`, row-gap `3rem`
- `.fcols`: 1 → 2 (768) → 4 (1024) columns, gap `3rem`
- `.partners ul`: 4 columns (3 at ≤639), column-gap `1rem`, row-gap `.75rem`
- `.about`: 1 → 2 columns (1024), gap `3rem`

### 1.5 Radii, borders, shadows, blur, z-index

- **Radii:**
  - `--r-card:2rem`: `.wc`, `.stats`, `.panel`
  - `--r-card-sm:1.25rem`: `.hcard`, `.srow`
  - `--r-ctl:.875rem`: `.chip`, `.menu-btn`, `.xbtn`, `.tile`, `.pane`, form fields, `.skip:focus`
  - `9999px`: pills, dots, round buttons
  - `50%`: `#lens`
  - Hardcoded `2rem`: `#loader` and `#home` (`0 0 2rem 2rem`), `footer` (`2rem 2rem 0 0`)
- **Borders:** always `1px solid`, using `var(--line)`, `rgba(230,229,226,.8)`, `rgba(17,17,17,.1)` or white alphas `.1` `.15` `.2` `.25` `.35`.
- **Rings (box-shadow `0 0 0 1px`):**
  - `var(--line)`: `.nb button`, `.panel`
  - `rgba(230,229,226,.7)`: `.hcard`
  - `rgba(255,255,255,.05)`: `.wc`
  - `rgba(255,255,255,.15)`: `.wc .badge`
  - `rgba(255,255,255,.16)`: dark `.hcard`
- **Shadows:** `0 1px 2px rgba(0,0,0,.05)` (`.hcard`). `0 25px 50px -12px rgba(0,0,0,.25)` (`.panel`). There are no other elevation shadows.
- **Backdrop blur:**
  - `blur(4px)`: `.chip`, `.menu-btn`
  - `blur(12px)`: `.hcard`
  - `blur(16px)`: `#modal` scrim
  - `blur(1.4px) saturate(1.8)`: `#lens`
  - Canvas `blur(28px)` in the unused `placeholder()`
- **z-index:**
  - `0`: `.lr`, `.fwm`
  - `1`: `.vig`, `.wm`
  - `10`: `footer .shell`
  - `20`: `.hgrid`, `.status`
  - `50`: header
  - `99`: `#lens`
  - `100`: `#drop`
  - `110`: `#modal`
  - `115`: `#nav`
  - `120`: `#loader`
  - `130`: `.skip:focus`

### 1.6 Motion

**Easing tokens:**

| Token | Value | Used for |
|---|---|---|
| `--ease-spring` | `cubic-bezier(.22,1,.36,1)` | `.rv` reveals, loader exit, carousel items, `.srow` hover, `#nav`/`#modal` fade, `.panel` slide |
| `--ease-line` | `cubic-bezier(.215,.61,.355,1)` | `.ln>span` line-mask reveal |
| `--ease-word` | `cubic-bezier(.165,.84,.44,1)` | `.w` word reveal |
| `--ease-hover` | `cubic-bezier(.2,.8,.2,1)` | Every hover transform: pill, logo, pnav, partners, soc, band, case card, badge, `.srow .ar`, `.al` |
| *(untokenised)* `ease-out` | — | `#nav .nl button` entrance (`all .5s ease-out`) |
| *(untokenised)* default `ease` | — | Transitions with no easing: `.pnav` opacity `.3s`, `.menu-btn` background `.3s`, `.dots i` `all .3s`, `.al` opacity `.3s`, `#nav .nl small/span` color `.3s`, form fields `.2s` |
| JS loader curve | `t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2` | Cubic in-out for the loader fill and counter |

**Durations:**

| Value | Used for |
|---|---|
| `.2s` | Form field focus |
| `.3s` | Small hovers: pnav, dots, `.soc`, partners, `.al`, nav colours |
| `.35s` | Pill, logo, `.bt`, `.srow .ar` hovers |
| `.4s` | `.wc .badge`, `#modal` fade |
| `.45s` | `.wc` hover, `.srow` background/padding, `#nav` fade |
| `.5s` | Carousel item, `.panel`, nav links |
| `.6s` | Loader content |
| `.7s` | Word reveal |
| `.8s` | `.rv`, loader slide-out |
| `.9s` | Line reveal |

**JS timings:**

| Value | What |
|---|---|
| `FILL=reduce?1:1300` | Loader fill duration (ms) |
| `1000` | Loader done() fallback |
| `6000` | Force-reveal fallback |
| `500` | Carousel old-item removal; fake submit |
| `300` | Modal reset after close |
| `200` | Focus name field after open |
| `120` | Nav close → scroll delay |
| `30` | Count-up throttle |
| `35ms` | Per-word reveal stagger |

**Reveal offsets (`--y`, default `16px`):**

| Offset | Element |
|---|---|
| `-14px` | Header |
| `0px` | `.status` |
| `10px` | Hero eyebrow |
| `12px` | `.note`, `.sfoot` |
| `14px` | `.partners` |
| `16px` + `--s:.96` | `.hcard` |
| `20px` | `.wm`, `.sg li` |
| `24px` | `.svc li` |
| `28px` | `.band li` |
| `40px` + `--s:.99` | `.stats` |
| `48px` | `.cards li` |

Other entrance offsets: words `translateY(24px)`, lines `translateY(100%)`, loader content `-12px`, carousel `14px`, `.panel` `28px`, nav links `1rem`.

**Stagger / delays (`--d`):**

- **Hero:**

  | Delay | Element |
  |---|---|
  | `150ms` | Header |
  | `200ms` | Eyebrow |
  | `250` / `370` / `490ms` | h1 lines |
  | `300ms` | Watermark |
  | `400ms` | `.hcard` |
  | `550ms` | Partners |
  | `650ms` | Rating |
  | `750ms` | CTAs |
  | `900ms` | Status |

- **Lists:** case cards and stats `0/90/180/270ms`. Services `0/80/160/240ms`. Band `0/120/240/360ms`. Section h2 lines `120ms` (stats second line `220ms`). Footer lines `0/100ms`. `.sfoot` `200ms`.
- **Nav overlay links:** `80/125/170/215/260/305ms` (step 45).

**Hover transforms (all inside `@media (hover:hover)` unless noted):**

| Transform | Element |
|---|---|
| `scale(1.04)` | Pill, logo |
| `scale(1.03)` | `.bt` |
| `scale(1.18)` | `.soc` glyph |
| `translateY(-8px) scale(1.012)` | `.wc` |
| `rotate(45deg) scale(1.08)` | `.wc .badge` |
| Arrow `translateX(3px)` / `translate(2px,-2px)` | Pill arrows |
| `translateX(5px)` | `.srow .ar` |
| `translateX(4px)` | `.al` |
| `translateY(-2px)` | pnav, partners |
| Padding shift `1.5rem` → `2rem / 1.25rem` + `--surface` bg | `.srow` |

**Scroll:** Lenis `1.1.13`, `smoothWheel:true`. It is disabled under reduced motion. Scroll is locked while the loader, nav or modal is open.

**IntersectionObserver:** `threshold:.12`. Elements with `data-hero` or inside `#home` wait for the loader to finish.

---

## 2. Components

`not defined` means the prototype has no code for that state.

### 2.1 Pill button `.pill`
- **Purpose:** Primary and secondary CTAs.
- **Variants:**
  - `.dark`: `--ink` bg, `#fff` text
  - `.light`: `--surface` bg
  - `.outline`: `1px solid var(--line)`, transparent
  - `.arrow`: padding `.375rem .375rem .375rem 1.5rem`, plus a round `.bd` badge of `2.25rem` (inverted colours on `.dark`)
  - Dark-hero overrides: `.dark` becomes white bg and `--ink` text; `.outline` border becomes `rgba(255,255,255,.35)`
- **Tokens:** radius `9999px`; `.875rem`/500; padding `.875rem 1.75rem`; gap `.75rem`; `--ease-hover` `.35s`.
- **States:**

  | State | Behaviour |
  |---|---|
  | Hover | `scale(1.04)`; arrow nudges `3px` (→) or `2px,-2px` (↗) |
  | Focus | Global `:focus-visible` (2px `--accent`, offset 2px) |
  | Active | not defined |
  | Disabled | not defined |
  | Loading | Text swap only (`Send` → `Sending… `), no disabled attribute |

- **Motion:** Hover only.
- **Don't:** Don't use more than the four listed fills (**inferred**, nothing else exists).

### 2.2 Eyebrow `.eyebrow`
- **Purpose:** Section label.
- **Spec:** `.875rem`/500, `rgba(17,17,17,.7)`, `.375rem` dot at `rgba(17,17,17,.5)`.
- **Variants:**
  - `.light` (on ink): text `.7`, dot `.6` white
  - Dark hero: `.78` / `.6`
  - `.eb-pill`: adds `1px solid var(--line)` border, `9999px` radius, padding `.375rem 1rem`
  - Modal `.mh .k`: same pattern with an `--accent` dot and `.6` text
- **States:** Static, none.

### 2.3 Tag `.tags span`
- **Purpose:** Discipline labels inside case cards.
- **Spec:** `1px solid rgba(255,255,255,.25)`, `9999px`, padding `.5rem 1rem`, `.875rem`, gap `.5rem`.
- **States:** Hover, focus and disabled are not defined (non-interactive).
- **Variants:** On ink only. A light-surface variant is not defined.

### 2.4 Case card `.wc`
- **Purpose:** Case study teaser (link).
- **Spec:**
  - `--ink` bg, `--r-card`, ring `rgba(255,255,255,.05)`
  - `min-height:22rem`, padding `1.5rem`; at ≥640 `26rem` and `2rem`
  - Meta row `.75rem` uppercase `.025em` at `.45` white
  - `.badge`: `2.75rem` circle, `.1` white bg, `.15` ring
  - Holo wordmark `.mark`: `4.5rem`/700, gradient text, opacity `.9`, top 58% of card
  - Bottom: h3 + `.wc p` (`.875rem`, `.55` white, max `28rem`) + tags
- **States:**

  | State | Behaviour |
  |---|---|
  | Hover | `translateY(-8px) scale(1.012)` (`.45s`), badge `rotate(45deg) scale(1.08)` (`.4s`) |
  | Focus | Global outline only |
  | Active | not defined |
  | Disabled | not defined |

- **Cursor:** `data-holo="lg"`, so the droplet grows to 72 and is magnetised to the card centre.
- **Layout:** Grid 1 → 2 columns at 768.

### 2.5 List row `.srow` (Approach)
- **Purpose:** Service line item (link).
- **Spec:**
  - Index `.ix`: `.875rem`/500, `.4` ink, width `1.75rem` / `2.5rem`
  - h3 per §1.3
  - Description `.srow p`: `.875rem`, `.55` ink, max `20rem`, shown only at ≥1024
  - Arrow `.ar`: `2.5rem` / `3rem`, `--ink` circle
  - Divider `1px solid var(--line)` between rows (not above the first)
  - Radius `--r-card-sm`, padding `1.5rem` (block `2rem` at ≥640)
- **States:**

  | State | Behaviour |
  |---|---|
  | Hover | bg `--surface`, padding-left `2rem` / right `1.25rem` (`.45s` spring), arrow `translateX(5px)` |
  | Focus | Global outline only. Hover styling is not mirrored on focus |
  | Active | not defined |
  | Disabled | not defined |

- **Cursor:** `data-holo="md"`.

### 2.6 Numbers panel `.stats`
- **Purpose:** Key metrics.
- **Spec:**
  - `--ink` card, `--r-card`
  - Eyebrow `.light`
  - h2 (§1.3)
  - Grid `.sg` (2 → 4 columns)
  - `.n` digits (tabular, 600, `-.02em`, lh 1) + caption `.875rem` `.55` white, max `18ch`
- **Motion:** Count-up is scroll-linked, not time-based. Progress `p` runs from element top at the viewport bottom to element centred, `Math.round(p*+n.dataset.count)` plus suffix (`+`, `×`). It is throttled to 30ms. It is reversible: scrolling back down the page decreases the numbers (**inferred** from the code).
- **Cursor:** `data-read`, so the droplet shrinks to radius 5 over the panel.
- **States:** Static.

### 2.7 Header with clock `header.top`
- **Purpose:** Brand, primary nav, Kyiv clock, menu.
- **Spec:**
  - Absolute over the hero, `z-index:50`, padding-block `1.25rem` / `1.5rem`
  - `.logo`: 1.125rem/600 + `--accent` icon; `--holo-2` on the `.dark` header
  - `.pnav`: `.875rem`/500, gap `2rem`, opacity `.8`, `aria-current` → 1; shown at ≥1024
  - `.chip`: glass `rgba(255,255,255,.4)` + `blur(4px)` + `rgba(230,229,226,.8)` border, `--r-ctl`, `.75rem`; label `.45`, time `#111` tabular `min-width:3.5rem`, separator `.3`; shown at ≥768
  - `.menu-btn`: same glass, uppercase `.75rem` `.05em`; word hidden ≤639
- **Clock:** `Europe/Kyiv`, format `h:mmam/pm` and `D Month, YYYY`, updates every 1000ms.
- **Variants:** `.dark` (the one used): glass becomes `rgba(255,255,255,.1)` bg and `.2` border; text `.75`/`#fff`.
- **States:**

  | State | Behaviour |
  |---|---|
  | Hover | logo `scale(1.04)`; pnav `translateY(-2px)` + opacity 1; menu-btn bg `.7` (light) / `.2` (dark) |
  | Focus | Global only |
  | Active | not defined |
  | Disabled | not defined |

- **Motion:** Header reveal `--y:-14px`, `--d:150ms`.
- **Known gap:** `aria-current` is static in HTML, never updated by JS.

### 2.8 Band "I / Design / → / Ship" `.band`
- **Purpose:** Principle strip.
- **Spec:** Four equal pills (`9999px`). Height `6rem` / `10rem` (≥640). Text `1.875rem` / `2.25rem`, 500. Column layout on mobile with gap `.75rem`; row at ≥640 with gap `1rem`.
- **Fill per pill:**

  | Pill | Fill |
  |---|---|
  | `.l` "I" | `--surface` |
  | `.h` "Design" | holo gradient, `#111` text |
  | `.d` "→" | `--ink` + white arrow (`2.25rem` / `3rem` icon) |
  | `.g` "Ship" | `rgba(241,240,238,.6)`, text `rgba(17,17,17,.35)` (deliberately faded) |

- **States:**

  | State | Behaviour |
  |---|---|
  | Hover | `scale(1.03)` |
  | Focus | not defined (non-interactive `div`s) |
  | Disabled | not defined |

- **Motion:** Stagger 0/120/240/360ms, `--y:28px`.
- **Cursor:** `data-holo="md"`.

### 2.9 Modal `#modal` / `.panel`
- **Purpose:** Contact form (demo, sends nothing).
- **Spec:**
  - Scrim `rgba(17,17,17,.3)` + `blur(16px)`, `z-index:110`, bottom-aligned on mobile, centred at ≥640, padding `1rem`
  - `.panel`: `#fff`, `--r-card`, max `32rem`, padding `1.5rem` / `2rem`, shadow per §1.5
  - Close `.mx`: `2.25rem` circle `--surface`; hover `--surface-2` + `#111`
  - Header `.mh`
  - Form fields: `1px solid var(--line)`, bg `rgba(241,240,238,.5)`, `--r-ctl`, padding `.75rem 1rem`, `.875rem`
  - Labels `.75rem` uppercase `.025em` `.5` ink
  - Footer `.fb`: `.75rem` `.45` note + `.pill.dark.arrow` submit
  - Success `.ok`: `3.5rem` ink badge with `--holo-2` icon
- **States:**

  | State | Behaviour |
  |---|---|
  | Field focus | border `rgba(17,17,17,.3)`, bg `#fff`, `outline:none` |
  | Field invalid/error | not defined (browser `required` only) |
  | Field disabled | not defined |
  | Submit loading | Text only |

- **Motion:** Fade `.4s` spring; panel `translateY(28px)` → 0 over `.5s`; focus moves to Name after 200ms; reset 300ms after close.
- **Close:** Scrim click, `.mx`, success "Close" button, `Escape`.
- **Not implemented:** focus trap, focus return to the trigger.

### 2.10 Fullscreen menu `#nav`
- **Purpose:** Mobile/secondary navigation.
- **Spec:**
  - `--ink` full-screen, `z-index:115`
  - Top bar: brand + `.xbtn` (`1px solid rgba(255,255,255,.15)`, `--r-ctl`, uppercase `.75rem` `.05em`, `.7` white)
  - Links: index `<small>` (`1rem`/400, `.3` white) + label (`.7` white), size per §1.3, `gap:1rem`
  - Bottom bar: Kyiv time + "Start a conversation →", `.75rem` uppercase `.025em` `.45` white, border-top `.1` white
- **States:**

  | State | Behaviour |
  |---|---|
  | Hover (link) | index → `--holo-1`, label → `#fff` (not wrapped in `hover:hover`) |
  | Hover (`.xbtn`) | border `.4`, text `#fff` |
  | Hover (bottom button) | underline + `#fff` |
  | Focus | Global only |
  | Active | not defined |
  | Disabled | not defined |

- **Motion:** Fade `.45s` spring; links `translateY(1rem)` → 0 with `all .5s ease-out`, staggered 80–305ms.
- **Behaviour:** Opening locks scroll; a `data-go` link closes the menu, then scrolls after 120ms. `Escape` closes it.
- **Not implemented:** focus move into the dialog, focus trap, focus return.

### 2.11 Footer `footer`
- **Purpose:** Final CTA, sitemap, contacts, legal.
- **Spec:**
  - `--ink`, top corners `2rem`
  - `.fcta`: h2 + `.pill.light.arrow`, border-bottom `.1` white
  - `.fcols`: brand + tagline (`.875rem` `.55`); column headings `h4` `.75rem` uppercase `.025em` `.4` white; links `.al` at opacity `.65`
  - `.legal`: `.75rem` `.45` white
  - Watermark `.fwm` at `rgba(255,255,255,.05)`, `bottom:-1.5rem`
- **States:**

  | State | Behaviour |
  |---|---|
  | Hover (`.al`) | `translateX(4px)` + opacity 1 |
  | Focus | Global only |
  | Active | not defined |
  | Disabled | not defined |

### 2.12 Loader `#loader`
- **Purpose:** Intro and progress while the page settles.
- **Spec:**
  - `--ink` full-screen, `z-index:120`, bottom corners `2rem`
  - Brand `1.875rem`/600 with `--holo-2` icon
  - Tagline `.875rem` `.55` white, max `24ch`
  - Progress: `width:min(22rem,72vw)`, 1px track `rgba(255,255,255,.15)`, holo gradient fill, row `.75rem` uppercase `.05em` `.45`, counter `000` (padStart 3, `.8` white, tabular)
- **Motion:** Fill over `1300`ms with the cubic in-out curve. Then `.out`: `translateY(-100%)` over `.8s` spring; content fades and lifts `-12px` over `.6s`. `done()` runs on `transitionend` or after 1000ms. Hero reveals wait for `done()`.
- **Accessibility:** `role="status"`, `aria-live="polite"`.

### 2.13 Hero support pieces
- **`.hcard` carousel:**
  - Glass `rgba(255,255,255,.7)` + `blur(12px)`, `--r-card-sm`, padding `.5rem`
  - `.tile` `6rem` ink square with `--holo-2` icon
  - `.pane` `rgba(241,240,238,.7)`
  - 3 items; captions `.65rem`, text `.875rem`/500 lh `1.35`
  - Dots `.25rem × .375rem`; active `1rem` wide
  - Prev/next `1.75rem` white circles
  - Clicking anywhere on the card advances
  - Items slide `14px` over `.5s` spring
  - Hover: `.nb button:hover` → `#111` (not gated by `hover:hover`)
  - Focus: global
  - Autoplay: not defined
- **`.rating`:** 5 `--accent` stars + `.875rem`/500 `.7` text (stars `--holo-1` on the dark hero).
- **`.partners` (Toolkit):** 4/3-column list, `.75rem`, icon `.875rem` at `.4`; hover `translateY(-2px)` + `#111`.
- **`.status` strip:** 3 spans, `.75rem` uppercase `.025em` `.6` ink, border-top `rgba(17,17,17,.1)`; middle span hidden <640.
- **Skip link `.skip`:** off-screen. On focus: fixed `1rem/1rem`, `--ink`, `#fff`, `.875rem`, `--r-ctl`.

---

## 3. Effects rules

### 3.1 LiquidReveal (hero brush), L716–745
- **Where:** Only inside `#home` (`#lr` wrapper). The canvas `#lrc` sits over the B/W portrait `#baseImg` and paints the colour source `COLOR_SRC` (a second embedded JPEG) through a soft brush.
- **Parameters:**

  | Parameter | Value |
  |---|---|
  | Brush radius | `BR=143` (CSS px) × `dpr`, `dpr` capped at `2` |
  | Brush falloff | Radial gradient alpha `1` → `.82` at `.55` → `0` |
  | Stroke interpolation | step `radius*.3`, max `60` stamps per move |
  | Decay while drawing | `DECAY=.016` per frame (`destination-out`) |
  | Decay when idle | `min(DECAY+idle*.004,.5)` per frame; canvas cleared after `120` idle frames |

- **Input:** Window `pointermove`. Ignored when the pointer is more than one radius outside the canvas.
- **Reduced motion:** Fully disabled. No ResizeObserver, no tick, no painting. The B/W photo stays static.
- **Touch:** not defined. The handler does not filter `pointerType` and is not gated by `(pointer: coarse)`, so touch drags may paint (**inferred**).

### 3.2 Glass droplet cursor (WebGL), L747–792
- **Where:** A full-viewport `#drop` canvas (`z-index:100`) plus a `#lens` backdrop element (`blur(1.4px) saturate(1.8)`, `z-index:99`). Both have `pointer-events:none`.
- **Radius by zone** (`zone()` checks `elementFromPoint` on move and scroll):

  | Zone | Rule | Radius |
  |---|---|---|
  | `off` | Inside `#loader`, `#nav`, `#modal` | `0` (hidden) |
  | `hero` | Inside `#home`, not on `[data-holo]` | `0`: hero belongs to LiquidReveal |
  | `md` (in hero) | `[data-holo]` inside `#home` (pills, header menu) | `30` |
  | `read` | Inside `[data-read]` (stats panel) | `5`: shrinks so numbers stay legible |
  | `lg` | `[data-holo="lg"]` (case cards) | `72`, pulled toward the card centre by `.18` |
  | `md` | Any other `[data-holo]` (pills, rows, band, socials) | `30` |
  | `default` | Everything else | `16` |

- **Follow:**
  - Position lerp `.2` per frame; radius lerp `.12`
  - Radius is `0` until `ready` (loader done) and while the pointer is outside the window
  - Drawn when `r>.4`; lens visible when `r>2`
  - Canvas `dpr` capped at `1.5`
- **Shader parameters:**

  | Parameter | Value |
  |---|---|
  | Edge wobble | noise `.18` + `sin(ang*3)` `.025` |
  | Time speeds | `.35` / `.27` / `.8` |
  | Fresnel | `pow(sc,8.)` |
  | Specular | `pow(...,36.)` toward `(-.45,-.6,.9)` |
  | Alpha | `.06+.8*fr+spec*.6` |
  | Cut-off | `s>1.08` |
  | Iridescence | Cosine film palette, 30% toward `vec3(.3,.95,.9)` |

- **Disabled when:**
  - `prefers-reduced-motion` (both JS and CSS `display:none`)
  - `(pointer: coarse)` (both JS and CSS)
  - `pointerType==='touch'` events are ignored
  - Inside loader, nav or modal
- **Rule for new UI (inferred from the zone map):**
  - Interactive targets get `data-holo="md"`
  - Large content cards get `data-holo="lg"`
  - Dense data blocks get `data-read`
  - Never place the droplet over overlays

### 3.3 Reveals
- `.rv` (fade + translate/scale), `.lines` (line masks), `.words` (per-word, `35ms` stagger, built by JS from `[data-words]`).
- Trigger: IO `.12`. Hero items wait for the loader. Everything is force-revealed after 6000ms as a fallback.

### 3.4 Reduced motion (`prefers-reduced-motion: reduce`)
- CSS:
  - `*{animation:none!important;transition:none!important}`
  - `.rv`, `.ln>span`, `.w` are forced visible
  - `#drop` and `#lens` are hidden
- JS:
  - Lenis off (native scroll, `behavior:'auto'`)
  - Loader `FILL=reduce?1:1300` → 1ms, fallback `setTimeout(done,reduce?0:1000)` → 0ms
  - LiquidReveal off
  - WebGL droplet off
- **Still active under reduced motion:** stat count-up (scroll-linked, no `reduce` check), carousel content swap (instant), clock.

### 3.5 Touch / coarse pointer
- Droplet and lens are hidden.
- Hover effects are mostly wrapped in `@media (hover:hover)`. Exceptions are listed in §5.
- LiquidReveal: not defined for touch (see 3.1).

---

## 4. Accessibility as implemented
- Global `:focus-visible{outline:2px solid var(--accent);outline-offset:2px}`. Form fields override this with `outline:none` plus a border change.
- Skip link, `aria-label`s on icon buttons, `aria-live` on loader and carousel, `aria-roledescription="carousel"`.
- Nav and modal have `role="dialog"` and `aria-modal="true"`, but no focus trap or focus return (see §5).

---

## 5. Inconsistencies & open questions

Contrast ratios were calculated with WCAG 2.x relative luminance after alpha-compositing over the stated background (**inferred** by calculation). AA thresholds: 4.5:1 for normal text, 3:1 for large text (≥24px, or ≥18.66px bold) and for UI components.

### 5.1 Near-duplicate values
1. **Two near-blacks:** `--foreground:#111111` and `--ink:#0a0a0a`. Text on white uses `#111`; dark surfaces use `#0a0a0a`. `#111` is also hardcoded 6 times instead of `var(--foreground)`.
2. **Three near-identical greys for secondary text:**

   | Value | Rendered | Where |
   |---|---|---|
   | `--muted:#8d8d8d` | — | Only `.stmt h2 .g` |
   | `rgba(17,17,17,.5)` | #888888 | Form labels, eyebrow dot |
   | `rgba(17,17,17,.45)` | #949494 | Captions |

   Also `.4` → #a0a0a0.
3. **Alpha ladders are too fine:**
   - Ink text uses 10 alpha steps (`.1`–`.7`)
   - White uses about 19 steps, with near-duplicates: `.75`/`.78`/`.8`, `.55`/`.6`, `.12`/`.15`/`.16`, `.3`/`.35`
4. **`--line` with alpha variants:** `rgba(230,229,226,.8)` (chip, menu-btn) and `rgba(230,229,226,.7)` (hcard ring) are hardcoded versions of `--line` with alpha.
5. **Surface alphas:** `rgba(241,240,238,.7)`, `.6` and `.5` are hardcoded versions of `--surface` with alpha.
6. **Glass white:** `rgba(255,255,255,.7)` serves both as `.hcard` glass and as `.menu-btn:hover`, while `rgba(255,255,255,.4)` is the resting glass. There is no glass token.
7. **`--hero-to:#c9c9c9`** equals the end stop of the unused `placeholder()` gradient. Its name suggests a gradient endpoint, but it is used as a flat background.
8. **Easing for similar entrances:**
   - Three different curves for "text enters": `.rv` spring `.8s`, `.ln` line `.9s`, `.w` word `.7s`
   - Nav links use the untokenised `ease-out` `.5s`
   - Several hover/colour transitions fall back to the browser default `ease`
9. **Overlay durations:** modal fade `.4s`, nav fade `.45s`, panel slide `.5s`.
10. **Hover durations:** both `.3s` and `.35s` with `--ease-hover` are used for equivalent micro-hovers.
11. **Stagger steps:** five different steps, 45 / 80 / 90 / 100 / 120 ms, across similar lists.
12. **Radius:** the outer "sheet" corners `2rem` (loader, hero, footer) are hardcoded rather than `var(--r-card)` (same value).
13. **Gap outlier:** `.6rem` in `#loader .brand`; everything else is on a `.25rem` grid.
14. **Display sizing mixes units:** `min(13rem,16vw)` uses vw while everything else is rem.

### 5.2 Hardcoded instead of tokens
15. `#fff` / `rgba(255,255,255,…)` is used everywhere as "on-ink" text. There is no `--on-ink` token.
16. Holo gradients are written out three times with different angles and stops (`135deg … 55%`, `135deg` even, `90deg`). There is no gradient token.
17. Shadows, backdrop blurs (`4px` / `12px` / `16px` / `1.4px`) and z-index values are all literals.
18. `holoize()` repeats `#6fe3e1`, `#b9a7ff`, `#ffc7a3` as literals and adds two colours, `#8ff0c8` and `#a9b8ff`, that exist nowhere else.
19. JS effect constants (`BR`, `DECAY`, droplet radii `5/16/30/72`, lerps `.2/.12/.18`) are not exposed as CSS custom properties or a config object.

### 5.3 Dead / orphan code
20. `placeholder()` and `holoize()` are defined but never called.
21. `.upl` and `#photo` styles exist, but no element with that class or id is in the markup.
22. `.pnav button[aria-current]` is styled, but `aria-current` is hard-set on "Home" and never updated on scroll or navigation.
23. The base (light) hero and header styles are defined, but only the `.dark` variant is used in markup. Should the light variant be kept as an official variant?

### 5.4 Root-scale discontinuities (inferred by calculation)
24. The `vw`-based root font-size jumps at every breakpoint, because each range is calibrated to 16px at its top edge:

    | Viewport | 1rem |
    |---|---|
    | 1441px | ≈12.0px |
    | 1440px | 16px |
    | 1025px | ≈11.4px |
    | 1024px | 16px |
    | 641px | ≈10.0px |
    | 640px | ≈28.4px |

    Text and layout can shrink or grow by up to about 2.8× across a 1px resize. Is this intended (Lumora-style) or should it be continuous?
25. Component breakpoints (`640/768/1024`) change rem *sizes* on top of the vw-scaled rem, so the two scalings compound.
26. `grid()` in JS only acts above 1920px. Is the JS needed at all, or could it be a CSS rule?

### 5.5 Missing states and focus
27. **Disabled:** not defined for any component (pill, form fields, nav, carousel buttons). The submit button is not disabled while "Sending…".
28. **Active / pressed:** not defined anywhere.
29. **Focus parity:** hover effects are not mirrored on `:focus-visible`. A keyboard user on `.srow`, `.wc`, `.pill`, `.al` gets only the outline, not the motion or background change.
30. **Form fields:** `outline:none`. The focus indicator is a border change to `rgba(17,17,17,.3)` (≈1.98:1 against white, below the 3:1 non-text minimum, **inferred**).
31. **Focus ring on ink:** `--accent` on `--ink` is 3.57:1. That passes 3:1, but it is noticeably weaker than on white (5.54:1).
32. **Error / invalid state** for form fields: not defined.
33. **Dialogs:** `#nav` and `#modal` have no focus trap and no focus return to the trigger. `#nav` does not move focus into itself on open.
34. **Carousel:** the whole `.hcard .row` advances on click (`cursor:pointer`) but is not keyboard-operable as a whole. Only the two arrow buttons are focusable.
35. **Non-interactive hover:** `.bt` band pills have hover scale and `data-holo` but are not links or buttons. Is that intentional?

### 5.6 Hover / touch gating
36. These hovers are **not** wrapped in `@media (hover:hover)` and will stick on touch: `.nb button:hover`, `.xbtn:hover`, `#nav .nl button:hover`, `#nav .bb button:hover`, `.mx:hover`, `#home.dark .partners li:hover`.
37. LiquidReveal has no touch/coarse rule (see §3.1). What should happen on mobile?

### 5.7 Reduced motion gaps
38. Stat count-up still animates with scroll under `prefers-reduced-motion`. Should it show final values?
39. The carousel still swaps content (instantly). Autoplay is not defined, so there is no conflict.

### 5.8 Contrast (WCAG 2.x)

**On white `#ffffff`:**

| Pair | Ratio | Where / size | Result |
|---|---|---|---|
| `#111111` text | 18.88 | body | ✅ AA/AAA |
| `rgba(17,17,17,.7)` → #585858 | 7.11 | secondary text `.875rem` | ✅ |
| `rgba(17,17,17,.6)` → #707070 | 4.95 | `.status`, `.ok p`, `.mh .k` | ✅ AA |
| `rgba(17,17,17,.55)` → #7c7c7c | 4.17 | `.srow p` `.875rem` | ❌ AA normal |
| `rgba(17,17,17,.5)` → #888888 | 3.54 | form labels `.75rem` | ❌ AA normal |
| `rgba(17,17,17,.45)` → #949494 | 3.03 | captions `.75rem`/`.875rem` (`.chip .lbl`, `.partners p`, `.sfoot p`, `.fb small`, `.item small`) | ❌ AA normal |
| `rgba(17,17,17,.4)` → #a0a0a0 | 2.61 | `.srow .ix` `.875rem` | ❌ |
| `--muted #8d8d8d` | 3.32 | `.stmt h2 .g` at `1.5rem`/`1.875rem` | ⚠️ passes only as large text; with rem ≈12px (1441–1919px wide) `1.5rem` = 18px → ❌ (**inferred**) |
| `--accent #4f5bd5` (stars, logo icon, focus ring) | 5.54 | — | ✅ |
| `--line #e6e5e2` (input/outline borders) | 1.26 | form field borders | ❌ 3:1 non-text (1.4.11) |

**On surfaces:**

| Pair | Ratio | Result |
|---|---|---|
| `#111` on `--surface` | 16.58 | ✅ |
| `rgba(17,17,17,.7)` on `--surface` (`.soc`) | 6.66 | ✅ |
| `rgba(17,17,17,.35)` on `rgba(241,240,238,.6)`/#fff (`.bt.g` "Ship", large) | 2.26 | ❌ even for large text (looks deliberate, but needs a decision) |
| `#fff` on `--accent` (`.soc.a`) | 5.54 | ✅ |
| `#111` on holo stops `#6fe3e1` / `#b9a7ff` / `#ffc7a3` | 12.36 / 9.02 / 12.54 | ✅ |

**On ink `#0a0a0a`:**

| Pair | Ratio | Where | Result |
|---|---|---|---|
| `#fff` | 19.80 | headings | ✅ |
| white `.8` / `.75` / `.7` / `.65` | 12.58 / 11.11 / 9.76 / 8.42 | links, nav | ✅ |
| white `.55` → #919191 | 6.28 | body on ink | ✅ |
| white `.45` → #787878 | 4.48 | `.wc .meta`, `.legal`, `#nav .bb`, loader row (`.75rem`) | ❌ (just under 4.5) |
| white `.4` → #6c6c6c | 3.77 | footer `h4` `.75rem` | ❌ |
| white `.3` → #545454 | 2.61 | nav index `small` `1rem` | ❌ |
| `--holo-2` icons | 9.46 | — | ✅ |
| `--accent` focus ring | 3.57 | — | ✅ 3:1 (weak) |

**Not computed:** hero text over the photo (`#home.dark`: white and `rgba(255,255,255,.78/.7/.55)` over the portrait plus a `rgba(0,0,0,.28)`→`.3` vignette). It depends on image pixels and needs a visual check. The same applies to glass elements (`.chip`, `.menu-btn`, `.hcard`) over the photo.

### 5.9 Open questions
40. Is `--muted` meant to be *the* secondary text token? If so, should the `rgba(17,17,17,.45–.55)` family collapse into it, and at what contrast target?
41. Should `--foreground` and `--ink` merge, or is the 2-step difference intentional (text vs surface)?
42. Should there be a dark theme? Currently `color-scheme: light` only, with dark achieved per-section via `--ink` surfaces and the `.dark` hero class.
43. Should the canonical text-entrance easing be `--ease-spring`, with `--ease-line` and `--ease-word` kept only for masks?
44. What is the official stagger step for lists (80, 90 or 120ms)?
