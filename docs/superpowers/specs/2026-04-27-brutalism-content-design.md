# Brutalism Theme Content Adjustment — Design Spec

**Date:** 2026-04-27
**Status:** Approved
**Scope:** Adjust all homepage content (hero, projects, experience, contact, navbar, footer) to match the brutalism theme that was applied to `globals.css`

## Problem

The brutalism theme has been applied to `globals.css` (sharp corners via `--radius: 0px`, hard black borders, hard offset shadows `4px 4px 0 hsl(0 0% 0%)`, Montserrat + Space Mono fonts). However the existing components still use `rounded-full`, glass/blur effects, gradient text, floating glow orbs, and other styles that conflict with brutalism.

This spec covers the **visual adjustments** required across the homepage (`src/app/page.tsx` and `src/app/_components/*`) to match the new theme. It is **not** a refactor — content, data, i18n keys, and component boundaries stay exactly as they are.

## Out of Scope

- Resume page (`src/app/resume/*`) — keep as-is
- Project dialog (modal) — keep as-is
- Data files (`src/data/*`) — content unchanged
- i18n keys (`src/locales/*`) — content unchanged
- `globals.css` color tokens — already set, do not change
- Adding new features (no new sections, no new fields)

## Design Tokens (Reference)

All from `globals.css` light mode (no new tokens):
- `--bg`: cream `oklch(0.9923 0.0104 91.4994)`
- `--fg`: dark green-black `oklch(0.1759 0.0275 161.2531)`
- `--card`: white `oklch(1 0 0)`
- `--primary`: medium green `oklch(0.5687 0.1498 151.9380)`
- `--secondary`: orange `oklch(0.6088 0.2498 29.2339)`
- `--accent`: amber `oklch(0.7721 0.1727 64.1585)`
- `--muted`: light cream `oklch(0.9465 0.0314 91.6628)`
- `--muted-fg`: warm grey `oklch(0.3525 0.0379 91.7268)`
- `--border`: pure black `oklch(0 0 0)`

Two extra company brand colors used only in the experience timeline (no token, used inline):
- Teal: `oklch(0.45 0.14 190)` — for Rakamin
- Violet: `oklch(0.5 0.18 290)` — for Smarteschool
- Light orange: `oklch(0.75 0.18 29)` — for Happy5 intern

## Universal Brutalism Style Rules

These apply globally to all components touched in this spec:

1. **No rounded corners** — replace every `rounded-full`, `rounded-2xl`, `rounded-xl` with sharp corners (`rounded-none` or just remove). Exception: `rounded-full` is OK only for the status dot (8px circle) and the badge dot.
2. **No gradient text** — remove `gradient-shimmer`, `bg-clip-text`, `bg-linear-to-r`. Use solid `text-primary` instead.
3. **No glass/blur effects** — remove `backdrop-blur-*`, `bg-background/60`, `glass-card`. Use solid `bg-card` or `bg-background`.
4. **No glow orbs** — remove the three floating glow `<div>`s in hero. Replace with the SVG decorative shapes described below.
5. **Bold borders** — `border-2 border-border` becomes the default for major surfaces (cards, buttons, sections).
6. **Hard offset shadow** — interactive surfaces use `shadow-[3px_3px_0_var(--border)]` or `4px_4px_0`. On hover: shift to `6px_6px_0` and `translate(-2px,-2px)`.
7. **Mono for labels/tags/periods** — use `font-mono` (Space Mono) for section tags, period badges, tech pills, dot labels, status badges.
8. **Uppercase + tight tracking** for titles and roles (`uppercase tracking-tight letter-spacing:-0.3px`).

## Section-by-Section Spec

### 1. Navbar — `src/app/_components/navbar.tsx`

Behavior preserved. Only visual changes:
- Container: keep `sticky top-0`, change `border-b bg-background/80 backdrop-blur-xl` → `border-b-2 border-border bg-background` (no blur).
- Logo: solid `text-primary font-black` (drop the `bg-linear-to-r ... bg-clip-text` gradient).
- Nav links:
  - Default: `border-1.5 border-transparent text-muted-foreground uppercase tracking-wider text-[10px] font-bold px-3 py-1.5`. Remove `rounded-full`.
  - Active: `bg-foreground text-background border-border shadow-[2px_2px_0_var(--border)]` (no `rounded-full`, no `:after` underline pill).
  - Hover (non-active): `bg-muted border-border text-foreground`.
- Theme + lang buttons: `border-1.5 border-border shadow-[2px_2px_0_var(--border)]`, keep size, remove `rounded`.
- Mobile menu: same logic, all `rounded-xl` → `rounded-none`, drop `backdrop-blur-xl`.

### 2. Hero — `src/app/_components/hero-section.tsx`

Layout: keep center-aligned. Replace floating glow orbs with **decorative SVG shapes** + add **vertical color stripe** + **scrolling marquee** below.

**Removed:**
- `glow-orb-1/2/3` divs (3 of them)
- `gradient-shimmer bg-linear-to-r ...` on the name
- `rounded-full` on every pill, button, badge

**Added (in this order, all behind the hero content with `pointer-events-none`):**
- **Background grid** — keep existing `.hero-grid` and `.hero-grid-fade`.
- **Color stripe** — vertical 6px stripe on the LEFT edge of the hero, three colors stacked: `--primary` (top third) / `--secondary` (mid third) / `--accent` (bottom third).
- **Five SVG decorative shapes** scattered with absolute positioning, no animation:
  1. **Big asterisk** top-left, `~130px`, stroke `--primary`, opacity 0.13
  2. **Squiggly arrow** top-right, `~160×100px`, stroke `--secondary`, opacity 0.55
  3. **Rotated square** top-right (different position), `~80px`, stroke `--accent`, opacity 0.32
  4. **Dot grid 3×3** bottom-left, `~88px`, fill `--foreground`, opacity 0.18
  5. **Crosshair (concentric circles + cross)** bottom-right, `~78px`, stroke `--foreground`, opacity 0.22
- All shapes are inline SVG (no asset files), all use stroke-based shapes (no emoji).

**Hero content (all `border-2 border-border`, no rounded):**
- **Status badge** — keep `Available for work` text + green dot. Style: `bg-card border-2 shadow-[3px_3px_0]` instead of `bg-background/60 rounded-full backdrop-blur`.
- **Title** — H1 keeps text. `font-size: ~60px` mobile-responsive, `font-black tracking-tight letter-spacing:-3.5px`.
  - Word "Hi, I'm" plain.
  - "Ashandi" → `text-primary` (solid color, no gradient).
  - "Leonadi" → `underline decoration-secondary decoration-[5px] underline-offset-[6px]`.
- **Typewriter role** — keep typewriter behavior, but render in `font-mono` 13px `text-muted-foreground`. Cursor: 2px primary bar (not background pill).
- **Description** — keep text. `text-muted-foreground text-[13px] max-w-[480px] leading-[1.65]`.
- **Buttons** — three buttons, no `rounded-full`. Use the brutalism Button variant (see component note below):
  - `View Projects` → solid (bg-foreground text-background), shadow 4px 4px 0
  - `Resume` → accent (bg-accent text-foreground), shadow 4px 4px 0
  - `Contact Me` → ghost (transparent, border-muted-fg)
- **Tech stack** — label "Tech Stack" in mono uppercase 9px tracking-wider. All 22 pills from `TECH_STACK`. Each pill: `font-mono text-[9px] font-bold uppercase border-1.5 border-border bg-card shadow-[2px_2px_0]`. Remove `rounded-full`. **Keep the icon coloring** (already in `tech.color`).
- **Scroll indicator** — keep the bouncing arrow at bottom but restyle without rounded.

**Marquee strip (new element, full-bleed, sits BELOW the hero section):**
- Black bar, full width.
- Border top + bottom 2px.
- Background `--fg`, text `--bg`.
- Content: animated scrolling text with the 4 roles from i18n (`hero.roles`) plus `Open for Work`, separated by `✦` glyphs.
- Mono 11px uppercase tracking 0.18em.
- Animation: `transform: translateX` keyframe, 18s linear infinite. Duplicate content twice for seamless loop.

### 3. Projects — `src/app/_components/projects-section.tsx` + `project-card.tsx`

Layout changes from a uniform 3-column grid to a **featured asymmetric grid**.

**Layout grid (CSS):**
- `grid-template-columns: 2fr 1fr 1fr`
- The first project (`PROJECTS[0]` = MapTrack) spans `grid-row: span 3` in column 1 — it becomes the featured card and stays tall.
- The remaining 6 projects (Happy5, Expense Tracker, Shopbot, Echo Test, GoMovies, Journal) fill columns 2-3 across 3 rows = 6 cells. Total = 7 projects, all visible.
- Cell border logic: `border-r-2 border-b-2 border-border` on every cell, then drop right border on cells in column 3, drop bottom border on cells in the last row, plus drop bottom border on the featured cell since it spans the full height.

**Per-card visual changes (`ProjectCard`):**
- Remove `ring-1 ring-border/50 rounded-* project-card` (the soft ring + rounded card style).
- Border: outer wrapper `border-2 border-border` with `box-shadow: 4px 4px 0 var(--border)` on the grid container, individual cells share borders (right + bottom), so cells use `border-r-2 border-b-2 border-border`. Last column drops right border, last row drops bottom border.
- Card background: `bg-card`, hover `bg-muted`.
- **Add small label "01 / 07"** in the top-right corner of the featured card; "02"–"07" in the other cards (use the project's index in `PROJECTS` + 1, padded to 2 digits). Mono 8px tracking-widest text-muted-foreground.
- **Add category tag line** above thumbnail per project (replaces nothing; new element):
  - Format: `— SaaS · Fullstack · AI` (mono 8px uppercase tracking-wider, color varies by project, with a 16×2px line as `::before`)
  - Categories per project (hardcoded in component, since data file shouldn't change):
    - MapTrack → "SaaS · Fullstack · AI" (color: `--secondary`)
    - Happy5 → "Performance · SaaS" (color: `--primary`)
    - Expense Tracker → "Finance · Personal" (color: `--accent`)
    - Shopbot Assistant → "AI · WhatsApp Bot" (color: `--secondary`)
    - Echo Test → "Education · AI" (color: violet `oklch(0.5 0.18 290)`)
    - GoMovies → "Entertainment" (color: red `oklch(0.55 0.2 0)`)
    - Journal → "Mobile · PWA" (color: warm orange `oklch(0.65 0.18 60)`)
- **Thumbnail** — keep existing image/video logic. Replace gradient overlay with a 1.5px black border. Drop `transition-transform hover:scale-105` (brutalism doesn't scale).
- **Title** — keep text, restyle: `font-black uppercase tracking-tight text-[13px]` (featured: 20px).
- **Summary** — keep text, restyle: `text-[10px] text-muted-foreground leading-[1.55]` (featured: 12px).
- **Status badges row** (new, between summary and tech tags):
  - `● Live` pill if `project.liveUrl` exists. `bg-primary text-white`.
  - `{ } Code` pill if `project.repoUrl` exists. `bg-accent text-foreground`.
  - `★ Featured` pill on the featured card only. `bg-card text-muted-foreground`.
  - All: `font-mono text-[8px] font-bold uppercase border-1.5 border-border shadow-[1px_1px_0]`.
- **Tech tags** — keep all techStack items. Restyle pill: `font-mono text-[8px] font-bold uppercase border-1.5 border-border bg-muted text-muted-foreground`. Drop `rounded-full`.

### 4. Experience — `src/app/_components/experience-section.tsx`

Replace the existing center-line alternating timeline with a **left-anchored colored timeline** with header strips.

**Container:**
- Remove the existing center timeline-line + alternating layout.
- New layout: `position: relative; padding-left: 24px` for the list. Vertical 3px line at `left: 8px`, `bg-border opacity-12`. Spans full height.

**Per-item:**
- Wrapper: `position: relative; margin-bottom: 20px`.
- **Dot** at `left: -30px; top: 20px`. 16×16px square with `border-2.5 border-border shadow-[2px_2px_0]`, background = company color.
- **Card**: `border-2 border-border shadow-[4px_4px_0]`, hover `shadow-[6px_6px_0]`. Two-row internal layout (header + body).
- **Header strip** — full-width, `border-b-2 border-border`, padding 14px 20px. Subtle tinted background using `color-mix` with the company color at 8-10% opacity. Two halves (flex justify-between):
  - **Left**: 44×44px **initials block** (company initials, e.g. `MT`, `H5`, `KG`) — `bg-{companyColor} text-white border-2 border-border shadow-[2px_2px_0] font-mono font-black text-[13px]`. **Plus** beside it the company name (small label, `font-bold uppercase text-[11px] text-muted-foreground`) and the role below (`font-black uppercase text-[13px] tracking-tight`).
  - **Right** (column, items end): optional `Current` pill (only on first/MapTrack — `font-mono text-[7px] bg-primary text-white border-1.5 shadow-[1px_1px_0]`), the period pill (`font-mono text-[9px] border-2 shadow-[2px_2px_0] bg-card`), and the location/type below (`font-mono text-[8px] text-muted-foreground uppercase` — derived from existing `exp.location` field, just split on `, ` for "Remote · Full-time" formatting).
- **Body** — padding 12px 20px. Skills row only (no description list — descriptions stay in the existing dialog/expanded view if any, but for the homepage card we just show skill tags). Each skill: `font-mono text-[8px] font-bold uppercase border-1.5 border-border bg-muted text-muted-foreground`.

**Company colors** (hardcoded inline since `EXPERIENCES[]` data shouldn't change):
- MapTrack → `--primary` (green)
- Happy5 (full-time) → `--secondary` (orange)
- Kodegiri → `--accent` (amber)
- Rakamin Academy → teal `oklch(0.45 0.14 190)`
- Smarteschool → violet `oklch(0.5 0.18 290)`
- Happy5 (intern) → light orange `oklch(0.75 0.18 29)`

A simple way to wire this: a small `companyColors` map keyed by `EXPERIENCES[i].company + i` (since "Happy5" appears twice with different colors).

**Important:** The existing `descriptionCount` + `t('experience.jobs.${i}.description.${j}')` rendering is **removed from the card body** for the new design. The descriptions are no longer shown on the homepage card. If the user wants to keep them somewhere, that's a follow-up — not in this spec.

### 5. Contact — `src/app/_components/contact-section.tsx`

Replace the current centered "icons only" layout with an **asymmetric two-column layout** with diagonal stripe pattern background.

**Section wrapper:**
- `bg-background` (NOT amber — match the rest of the page).
- `border-t-2 border-border`.
- Padding `64px 40px`.
- `position: relative; overflow: hidden`.

**Diagonal stripe pattern (background):**
- Absolute, `inset: 0`, `pointer-events-none`.
- `background: repeating-linear-gradient(135deg, transparent 0 38px, oklch(0 0 0 / 0.04) 38px 40px)`.

**Decorative shape:**
- One big asterisk top-right, `~70px`, stroke `--primary`, opacity 0.5 (more visible than before — user feedback was the previous shapes were too subtle).

**Content layout:**
- Inner container: `max-width: 920px; margin: 0 auto; display: grid; grid-template-columns: 1fr auto; gap: 40px; align-items: center; position: relative; z-index: 2`.
- On mobile (`md:` breakpoint), stack to single column.

**Left column:**
- **"Get in touch" tag** — small mono pill at top: `font-mono text-[9px] font-bold uppercase tracking-widest text-primary border-2 border-primary px-2.5 py-1 bg-card shadow-[2px_2px_0]`. With a 7×7 animated green dot (same as hero badge).
- **Heading** — Use existing `t('contact.title')` "Let's Work Together". Style: `font-black uppercase text-[56px] tracking-[-2px] leading-[0.92]`. The word "Together" gets `text-secondary`.
- **Subtitle** — `t('contact.subtitle')`, style `font-mono text-[13px] text-muted-foreground leading-[1.65] max-w-[480px]`.
- **CTA button** — `✦ Send a message →`, links to `mailto:${CONTACTS.email}`. Style: `bg-foreground text-background border-2 border-border px-7 py-3.5 font-bold uppercase tracking-wider text-[12px] shadow-[5px_5px_0]`, hover `translate(-2px,-2px) shadow-[7px_7px_0]`.

**Right column — three "channel cards"** stacked vertically (gap 12px). Each card is 260px wide minimum, `border-2 border-border bg-card px-4.5 py-3 shadow-[3px_3px_0]`, hover `translate(-2px,-2px) shadow-[5px_5px_0] bg-muted`. Layout per card: 36×36 colored icon block on the left, then small label + value column.
1. **Email**: icon `bg-primary text-white`, label "Email", value `CONTACTS.email` (i.e. `ashandileonadi@gmail.com`), card is an `<a href="mailto:...">`.
2. **GitHub**: icon `bg-foreground text-background`, label "GitHub", value `@ashandileo` (extract from `CONTACTS.github` URL — it's `https://www.github.com/ashandileo`), card is `<a href={CONTACTS.github} target="_blank">`.
3. **LinkedIn**: icon `bg-secondary text-white`, label "LinkedIn", value `ashandi-leonadi`, card is `<a href={CONTACTS.linkedin} target="_blank">`.

Use existing icon SVGs (Lucide `Mail`, `react-icons/fa` `FaGithub`, `FaLinkedin`).

### 6. Footer — `src/app/_components/footer.tsx`

Minimal change:
- `border-t` → `border-t-2 border-border`.
- `text-xs text-muted-foreground` → `font-mono text-[9px] text-muted-foreground uppercase tracking-wider`.

### 7. Shared UI Components — `src/components/ui/*`

The shared shadcn components (`button.tsx`, `badge.tsx`, `card.tsx`, `dialog.tsx`, `separator.tsx`) are **already** receiving the brutalism styles via the CSS tokens (`--radius: 0`, `--shadow: 4px 4px 0...`). They should **not** need code changes.

**However:** several callsites pass `rounded-full` / `rounded-2xl` Tailwind classes that override the token. The fix is at the callsite (per-section above), not in the shared component.

Verify only: open each `ui/*` component once and confirm they read from CSS tokens (radius / shadow) rather than hardcoding values. If any hardcode, file a quick fix.

## Animations

Keep the existing scroll-triggered fade-in animations intact:
- `.section-fade` and intersection observer hooks
- `.stagger-item`, `useStaggeredFade`, `usePerItemFade`
- `.hero-stagger`, `.tech-pill` keyframes
- Typewriter cursor (`hooks/use-typewriter.ts`)

Add **one** new animation: the marquee strip (`@keyframes marquee` translateX 0 → -50%, 18s linear infinite).

Remove these animations (no longer used):
- `glow-orb-*` floats (orbs deleted)
- `gradient-shimmer` (gradient text deleted)
- `card-swap` (was for old carousel)
- `pill-pop` — keep, still used on tech pills
- Hover scaling on cards (`transition-transform hover:scale-105`)

## Files Affected

```
src/app/globals.css                                — keep tokens, add .marquee keyframes, remove unused
src/app/_components/navbar.tsx                     — restyle nav links + theme buttons
src/app/_components/hero-section.tsx               — full restyle, add SVG decorations + marquee
src/app/_components/projects-section.tsx           — change grid layout (asymmetric: featured spans 3 rows + 6 in cols 2-3)
src/app/_components/project-card.tsx               — add corner number, category tag, status badges; remove rounded
src/app/_components/experience-section.tsx         — replace timeline layout + add company colors map
src/app/_components/contact-section.tsx            — full rewrite to two-column asymmetric layout
src/app/_components/footer.tsx                     — minor restyle
```

No changes to:
- `src/data/*`
- `src/locales/*`
- `src/components/ui/*` (verify only)
- `src/hooks/*`
- `src/app/resume/*`
- `src/app/layout.tsx`
- `globals.css` color tokens

## Acceptance

- All 7 sections (navbar, hero, marquee, projects, experience, contact, footer) match the approved final composite mockup at `.superpowers/brainstorm/41588-1777293684/content/final-composite.html` (with the contact section updated to Option C from `contact-options.html`).
- Existing functionality preserved: typewriter, dark mode toggle, language toggle, smooth scroll, active section highlight, project dialog open, all i18n keys still resolved.
- No `rounded-full`, `gradient-shimmer`, `glass-card`, `glow-orb-*`, or `backdrop-blur-*` left in homepage components.
- Project data, experience data, and locale strings unchanged.
- Lint + typecheck pass.
