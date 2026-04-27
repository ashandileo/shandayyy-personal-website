# Brutalism Content Adjustment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle every homepage component and the resume page to match the new brutalism theme tokens already wired into `src/app/globals.css`.

**Architecture:** Pure presentational change — no new data, no new routes, no new dependencies. Each task touches one file (or one tight pair) and produces a verifiable visual change. All section data, hooks, and i18n keys stay intact; only the JSX structure and Tailwind classes change.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind v4 (with `@theme inline` tokens), shadcn-ui (already brutalism-ready via tokens), `react-i18next`, `lucide-react`, `react-icons/si`, `react-icons/fa`.

**Spec reference:** `docs/superpowers/specs/2026-04-27-brutalism-content-design.md`

**Mockup references:**
- Homepage: `.superpowers/brainstorm/41588-1777293684/content/final-composite.html` (with contact replaced by Option C from `contact-options.html`)
- Resume page: `.superpowers/brainstorm/41588-1777293684/content/resume-page.html`

---

## File Structure

Files **created**: none.

Files **modified** (with single responsibility per file):

| File | Responsibility |
|---|---|
| `src/app/globals.css` | Add marquee keyframes; remove three unused animations |
| `src/app/_components/navbar.tsx` | Brutalism nav links + theme/lang button restyle |
| `src/app/_components/hero-section.tsx` | Center-aligned hero with SVG decorations + marquee strip |
| `src/app/_components/project-card.tsx` | Sharp card with corner number, category tag, status badges |
| `src/app/_components/projects-section.tsx` | Asymmetric featured-grid layout |
| `src/app/_components/experience-section.tsx` | Colored left timeline with company-initials header strip |
| `src/app/_components/contact-section.tsx` | Two-column asymmetric layout with diagonal stripe + channel cards |
| `src/app/_components/footer.tsx` | Mono uppercase footer line |
| `src/app/resume/_components/resume-header.tsx` | Section tag + brutalism title |
| `src/app/resume/_components/resume-actions.tsx` | Brutalism card with icon block + sharp buttons |
| `src/app/resume/_components/resume-preview.tsx` | Header strip + sharp iframe wrapper + footer strip |
| `src/app/resume/page.tsx` | Add deco SVG shapes to the page wrapper |

Tasks are sequenced so each can be verified visually in isolation in the dev server.

---

## Pre-flight (do once before Task 1)

Open a terminal in the project root and start the dev server. Keep it running for the entire plan.

```bash
pnpm install   # only if node_modules is missing
pnpm dev
```

Open `http://localhost:3000` in a browser — this is the homepage. The resume page is at `http://localhost:3000/resume`. Tabs to keep open while working: homepage + resume + a Tailwind cheat sheet.

---

## Task 1: globals.css — marquee keyframes, drop unused animations

**Files:**
- Modify: `src/app/globals.css`

The CSS tokens (`--radius: 0`, hard shadow values, color vars) are already correct — leave them. Three keyframe blocks are no longer used after this plan and should be removed; one new keyframe is needed for the hero marquee strip.

- [ ] **Step 1.1: Open `src/app/globals.css`**

Locate the section at line ~318 starting with `/*  CAROUSEL SLIDE ANIMATION ... */`. Three blocks will be removed:
1. `@keyframes card-swap { ... }` and `.animate-card-swap { ... }` (lines ~315–335)
2. `@keyframes gradient-shimmer { ... }` and `.gradient-shimmer { ... }` (lines ~338–350)
3. The three `.glow-orb-{1,2,3}` rules and `@keyframes float-slow*` (lines ~227–249)

- [ ] **Step 1.2: Delete the three blocks**

Remove `card-swap`, `gradient-shimmer`, and `float-slow*` keyframes plus their consumer classes. Keep everything else (`.hero-grid`, `.timeline-line`, `.section-fade`, `.hero-stagger`, `.stagger-item`, `.tech-pill`, `.contact-icon`, `.mobile-menu-enter`, `.typewriter-cursor`, `.project-card`, `.glass-card`).

Note: `.timeline-line`, `.timeline-dot`, `.project-card`, and `.glass-card` are also no longer used after later tasks, but leaving them in place now is fine — they cause no harm. They will be removed in Task 13 (cleanup).

- [ ] **Step 1.3: Add the marquee keyframe**

Append to the end of the file:

```css
/* ------------------------------------------------------------------ */
/*  HERO MARQUEE STRIP                                                 */
/* ------------------------------------------------------------------ */

@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.animate-marquee {
  animation: marquee 18s linear infinite;
  display: inline-block;
  white-space: nowrap;
}
```

- [ ] **Step 1.4: Verify the dev server still compiles**

Switch to your browser tab on `http://localhost:3000`. The page should reload cleanly. No console errors. The visuals are still the OLD homepage at this point — that's expected.

- [ ] **Step 1.5: Commit**

```bash
git add src/app/globals.css
git commit -m "style(css): drop unused animations, add marquee keyframes"
```

---

## Task 2: Navbar restyle

**Files:**
- Modify: `src/app/_components/navbar.tsx`

Strip the `backdrop-blur` + `rounded-full` + gradient logo. Replace with hard borders, a black active state with a 2px offset shadow, and mono-flavored buttons.

- [ ] **Step 2.1: Replace the entire `Navbar` JSX**

Open `src/app/_components/navbar.tsx`. Replace **only** the `return (...)` body of the `Navbar` function (the imports and hook calls at the top stay exactly as they are). New return:

```tsx
  return (
    <header
      className={`fixed top-0 z-40 w-full transition-colors duration-200 ${
        scrolled ? "border-b-2 border-border bg-background" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link
          href={resolveHref("#home")}
          onClick={(e) => handleNavClick(e, "#home")}
          className="font-heading text-base font-black tracking-tight text-primary"
        >
          Shandayyy
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-2 md:flex">
          <ul className="flex">
            {NAV_ITEMS.map((item, i) => {
              const isActive = item.href.startsWith("/")
                ? pathname === item.href
                : item.sectionId === activeSection;
              return (
                <li key={item.href} className={i === 0 ? "" : "-ml-[1.5px]"}>
                  <Link
                    href={resolveHref(item.href)}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`inline-flex items-center border-[1.5px] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] transition-colors ${
                      isActive
                        ? "border-border bg-foreground text-background shadow-[2px_2px_0_var(--border)]"
                        : "border-transparent text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="ml-2 flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleLang}
              aria-label="Switch language"
              className="border-[1.5px] border-border bg-card px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground shadow-[2px_2px_0_var(--border)] transition-colors hover:bg-foreground hover:text-background"
            >
              {i18n.language === "en" ? "ID" : "EN"}
            </button>
            <button
              type="button"
              onClick={toggleDark}
              aria-label="Toggle dark mode"
              className="border-[1.5px] border-border bg-card px-2.5 py-1.5 text-muted-foreground shadow-[2px_2px_0_var(--border)] transition-colors hover:bg-foreground hover:text-background"
            >
              {dark ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
            </button>
          </div>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-1.5 md:hidden">
          <button
            type="button"
            onClick={toggleLang}
            aria-label="Switch language"
            className="border-[1.5px] border-border bg-card px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground shadow-[2px_2px_0_var(--border)]"
          >
            {i18n.language === "en" ? "ID" : "EN"}
          </button>
          <button
            type="button"
            onClick={toggleDark}
            aria-label="Toggle dark mode"
            className="border-[1.5px] border-border bg-card px-2.5 py-1.5 text-muted-foreground shadow-[2px_2px_0_var(--border)]"
          >
            {dark ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="border-[1.5px] border-border bg-card px-2.5 py-1.5 text-muted-foreground shadow-[2px_2px_0_var(--border)]"
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mobile-menu-enter border-t-2 border-border bg-background px-6 pb-4 md:hidden">
          <ul className="flex flex-col gap-1 pt-2">
            {NAV_ITEMS.map((item) => {
              const isActive = item.href.startsWith("/")
                ? pathname === item.href
                : item.sectionId === activeSection;
              return (
                <li key={item.href}>
                  <Link
                    href={resolveHref(item.href)}
                    onClick={(e) => {
                      handleNavClick(e, item.href);
                      setMobileOpen(false);
                    }}
                    className={`block border-[1.5px] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.1em] ${
                      isActive
                        ? "border-border bg-foreground text-background"
                        : "border-transparent text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
```

The `Button` import from `@/components/ui/button` is no longer used here — leave it imported if linting allows, otherwise remove it. The `router` from `useRouter()` is also unused after this change; remove the `const router = useRouter();` line and the `useRouter` import.

- [ ] **Step 2.2: Verify in browser**

Reload `http://localhost:3000`. Check:
- Navbar has sharp corners (no pills).
- Active link is solid black with a 2px offset shadow.
- Inactive links have no border until hover, then show a 1.5px black border.
- Theme + lang buttons are sharp with shadows.
- Scrolling: navbar gets a 2px bottom border (no blur).
- Mobile (resize ≤768px): toggle still opens, links match desktop styling.
- No console errors.

- [ ] **Step 2.3: Commit**

```bash
git add src/app/_components/navbar.tsx
git commit -m "style(navbar): brutalism nav links and theme/lang buttons"
```

---

## Task 3: Hero — full restyle (decorations + content + marquee)

**Files:**
- Modify: `src/app/_components/hero-section.tsx`

Big task. Replace the entire component file. Preserves: typewriter hook, i18n, scroll-to-experience button, tech-stack icons, hero-stagger animation classes from `globals.css`. Removes: glow orbs, gradient text, `rounded-full` everywhere, `backdrop-blur`. Adds: 5 SVG decorations, color stripe at left edge, marquee strip below the section.

- [ ] **Step 3.1: Replace the entire file**

Open `src/app/_components/hero-section.tsx` and replace its full contents with:

```tsx
"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowDown, Sparkles, Send, FileText } from "lucide-react";
import { useTypewriter } from "@/hooks";
import { TECH_STACK } from "@/data/tech-stack";

export function HeroSection() {
  const { t } = useTranslation();
  const roles = t("hero.roles", { returnObjects: true }) as string[];
  const typed = useTypewriter({ words: roles });

  return (
    <>
      <section
        id="home"
        className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden border-b-2 border-border px-6 pt-20 pb-24 text-center"
      >
        {/* Background grid */}
        <div className="hero-grid hero-grid-fade pointer-events-none absolute inset-0" />

        {/* Vertical color stripe — left edge */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[6px]"
          style={{
            background:
              "linear-gradient(to bottom, var(--primary) 0%, var(--primary) 33%, var(--secondary) 33%, var(--secondary) 66%, var(--accent) 66%, var(--accent) 100%)",
          }}
        />

        {/* Decorative SVG shapes */}
        <svg
          aria-hidden
          className="pointer-events-none absolute"
          style={{ top: 60, left: 60, width: 130, height: 130, opacity: 0.13 }}
          viewBox="0 0 130 130"
        >
          <g
            stroke="oklch(0.5687 0.1498 151.9380)"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          >
            <line x1="65" y1="6" x2="65" y2="124" />
            <line x1="6" y1="65" x2="124" y2="65" />
            <line x1="22" y1="22" x2="108" y2="108" />
            <line x1="108" y1="22" x2="22" y2="108" />
          </g>
        </svg>

        <svg
          aria-hidden
          className="pointer-events-none absolute"
          style={{ top: 86, right: 0, width: 160, height: 100, opacity: 0.55 }}
          viewBox="0 0 160 100"
        >
          <path
            d="M10 50 C36 12,68 90,100 50 C124 22,140 65,154 50"
            fill="none"
            stroke="oklch(0.6088 0.2498 29.2339)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <polyline
            points="142,32 158,50 142,68"
            fill="none"
            stroke="oklch(0.6088 0.2498 29.2339)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <svg
          aria-hidden
          className="pointer-events-none absolute"
          style={{ top: 80, right: 170, width: 80, height: 80, opacity: 0.32 }}
          viewBox="0 0 80 80"
        >
          <rect
            x="8"
            y="8"
            width="64"
            height="64"
            fill="none"
            stroke="oklch(0.7721 0.1727 64.1585)"
            strokeWidth="4"
            transform="rotate(20 40 40)"
          />
        </svg>

        <svg
          aria-hidden
          className="pointer-events-none absolute"
          style={{ bottom: 96, left: 48, width: 88, height: 88, opacity: 0.18 }}
          viewBox="0 0 88 88"
        >
          <g fill="oklch(0.1759 0.0275 161.2531)">
            <circle cx="11" cy="11" r="4" />
            <circle cx="44" cy="11" r="4" />
            <circle cx="77" cy="11" r="4" />
            <circle cx="11" cy="44" r="4" />
            <circle cx="44" cy="44" r="4" />
            <circle cx="77" cy="44" r="4" />
            <circle cx="11" cy="77" r="4" />
            <circle cx="44" cy="77" r="4" />
            <circle cx="77" cy="77" r="4" />
          </g>
        </svg>

        <svg
          aria-hidden
          className="pointer-events-none absolute"
          style={{ bottom: 110, right: 60, width: 78, height: 78, opacity: 0.22 }}
          viewBox="0 0 78 78"
        >
          <circle
            cx="39"
            cy="39"
            r="32"
            fill="none"
            stroke="oklch(0.1759 0.0275 161.2531)"
            strokeWidth="2.5"
          />
          <circle
            cx="39"
            cy="39"
            r="18"
            fill="none"
            stroke="oklch(0.1759 0.0275 161.2531)"
            strokeWidth="1.5"
          />
          <line
            x1="39"
            y1="2"
            x2="39"
            y2="76"
            stroke="oklch(0.1759 0.0275 161.2531)"
            strokeWidth="2"
          />
          <line
            x1="2"
            y1="39"
            x2="76"
            y2="39"
            stroke="oklch(0.1759 0.0275 161.2531)"
            strokeWidth="2"
          />
        </svg>

        {/* Content */}
        <div className="hero-stagger relative z-[2] mx-auto max-w-2xl">
          {/* Status badge */}
          <div className="mb-6 inline-flex items-center gap-2 border-2 border-border bg-card px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] shadow-[3px_3px_0_var(--border)]">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            <span>{t("hero.available")}</span>
          </div>

          <h1 className="text-4xl font-black uppercase tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-foreground">{t("hero.greeting")}</span>
            <br />
            <span className="text-primary">Ashandi</span>
            <br />
            <span className="underline decoration-secondary decoration-[5px] underline-offset-[6px]">
              Leonadi
            </span>
          </h1>

          <p className="mt-4 font-mono text-sm font-medium text-muted-foreground sm:text-base">
            {typed}
            <span className="typewriter-cursor ml-0.5 inline-block w-[2px] bg-primary" />
          </p>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t("hero.description")}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="#projects"
              className="inline-flex items-center gap-2 border-2 border-border bg-foreground px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-background shadow-[4px_4px_0_var(--border)] transition-transform hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0_var(--border)]"
            >
              <Sparkles className="size-4" />
              {t("hero.viewProjects")}
            </Link>
            <Link
              href="/resume"
              className="inline-flex items-center gap-2 border-2 border-border bg-accent px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-foreground shadow-[4px_4px_0_var(--border)] transition-transform hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0_var(--border)]"
            >
              <FileText className="size-4" />
              {t("hero.resume")}
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 border-2 border-muted-foreground px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Send className="size-4" />
              {t("hero.contactMe")}
            </Link>
          </div>

          {/* Tech Stack */}
          <div className="mt-12">
            <p className="mb-3 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              {t("hero.techStack")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {TECH_STACK.map((tech, i) => {
                const Icon = tech.icon;
                return (
                  <span
                    key={tech.name}
                    className="tech-pill inline-flex items-center gap-1.5 border-[1.5px] border-border bg-card px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.05em] text-foreground shadow-[2px_2px_0_var(--border)] transition-transform hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[3px_3px_0_var(--border)]"
                    style={{ animationDelay: `${0.9 + i * 0.05}s` }}
                  >
                    <Icon className={`size-3.5 ${tech.color}`} />
                    {tech.name}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            document
              .getElementById("experience")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="absolute bottom-8 z-[2] flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
          aria-label="Scroll to experience"
        >
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em]">
            {t("hero.scrollToExplore")}
          </span>
          <ArrowDown className="size-4 animate-bounce" />
        </button>
      </section>

      {/* Marquee strip — full-bleed below hero */}
      <div className="overflow-hidden border-y-2 border-border bg-foreground py-2 text-background">
        <div className="animate-marquee font-mono text-[11px] font-bold uppercase tracking-[0.18em]">
          {(() => {
            const items = [
              ...roles,
              t("hero.available"),
              ...roles,
              t("hero.available"),
            ];
            return items.map((label, i) => (
              <span key={i} className="mx-3">
                <span className="mr-3 text-accent">✦</span>
                {label}
              </span>
            ));
          })()}
        </div>
      </div>
    </>
  );
}
```

The `Button` import is intentionally dropped (we use plain `<Link>` now). The `useTypewriter`, `useTranslation`, `TECH_STACK`, and lucide icons stay exactly as they were.

- [ ] **Step 3.2: Verify in browser**

Reload `http://localhost:3000`. Check, in order:
- Hero is centered (text + buttons + tech pills).
- Color stripe (green / orange / amber) on the very left edge, top to bottom.
- Five SVG shapes visible: green asterisk top-left, orange squiggly arrow top-right, amber rotated square upper-right, dark dot grid bottom-left, dark crosshair bottom-right. All faint (low opacity) but visible.
- "Ashandi" is solid green (no gradient shimmer).
- "Leonadi" has a thick orange underline.
- Typewriter still cycles roles.
- Three buttons are sharp with offset shadows. Hover lifts them up-left.
- Tech pills are sharp with thin offset shadows; all 22 icons render with their colors.
- Marquee strip below hero scrolls left smoothly with `✦` glyphs in amber and the role names plus `Available for work`.
- No console errors.

- [ ] **Step 3.3: Lint check**

```bash
pnpm lint
```

Expected: clean (or only pre-existing warnings unrelated to your edits).

- [ ] **Step 3.4: Commit**

```bash
git add src/app/_components/hero-section.tsx
git commit -m "style(hero): brutalism restyle with deco shapes, color stripe, marquee"
```

---

## Task 4: Project Card restyle

**Files:**
- Modify: `src/app/_components/project-card.tsx`

Adds the corner number, category line, and live/code/featured status badges. Drops `rounded-*`, `ring-*`, the gradient overlay, and hover scaling. Skill tags become mono pills.

- [ ] **Step 4.1: Define the per-project category map**

Open `src/app/_components/project-card.tsx`. Replace the entire file with:

```tsx
"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { isVideo, type Project } from "@/data/projects";

const CATEGORY_BY_TITLE: Record<
  string,
  { label: string; color: string }
> = {
  MapTrack:           { label: "SaaS · Fullstack · AI",  color: "var(--secondary)" },
  Happy5:             { label: "Performance · SaaS",     color: "var(--primary)" },
  "Expense Tracker":  { label: "Finance · Personal",     color: "var(--accent)" },
  "Shopbot Assistant":{ label: "AI · WhatsApp Bot",      color: "var(--secondary)" },
  "Echo Test":        { label: "Education · AI",         color: "oklch(0.5 0.18 290)" },
  GoMovies:           { label: "Entertainment",          color: "oklch(0.55 0.2 0)" },
  Journal:            { label: "Mobile · PWA",           color: "oklch(0.65 0.18 60)" },
};

const TOTAL = 7;

function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

export function ProjectCard({
  project,
  onSelect,
  featured = false,
}: {
  project: Project;
  onSelect: () => void;
  featured?: boolean;
}) {
  const { t } = useTranslation();
  const category = CATEGORY_BY_TITLE[project.title] ?? {
    label: "Project",
    color: "var(--muted-foreground)",
  };
  const number = pad2(project.index + 1);
  const cornerLabel = featured ? `${number} / ${pad2(TOTAL)}` : number;

  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect();
      }}
      className={`relative flex h-full cursor-pointer flex-col bg-card transition-colors hover:bg-muted ${
        featured ? "p-5" : "p-4"
      }`}
    >
      {/* Corner number */}
      <span className="pointer-events-none absolute right-4 top-3 font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
        {cornerLabel}
      </span>

      {/* Category */}
      <div
        className="mb-2 inline-flex items-center gap-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.15em]"
        style={{ color: category.color }}
      >
        <span
          aria-hidden
          className="inline-block h-[2px] w-4"
          style={{ background: category.color }}
        />
        {category.label}
      </div>

      {/* Thumbnail */}
      <div
        className={`relative w-full overflow-hidden border-[1.5px] border-border ${
          featured ? "aspect-[16/10] mb-4" : "aspect-video mb-3"
        }`}
      >
        {isVideo(project.images[0]) ? (
          <video
            src={project.images[0]}
            muted
            autoPlay
            loop
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <Image
            src={project.images[0]}
            alt={project.title}
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* Status row */}
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        {project.liveUrl && (
          <span className="inline-flex items-center gap-1 border-[1.5px] border-border bg-primary px-1.5 py-[1px] font-mono text-[8px] font-bold uppercase tracking-[0.1em] text-white shadow-[1px_1px_0_var(--border)]">
            ● Live
          </span>
        )}
        {project.repoUrl && (
          <span className="inline-flex items-center border-[1.5px] border-border bg-accent px-1.5 py-[1px] font-mono text-[8px] font-bold uppercase tracking-[0.1em] text-foreground shadow-[1px_1px_0_var(--border)]">
            {"{ } Code"}
          </span>
        )}
        {featured && (
          <span className="inline-flex items-center border-[1.5px] border-border bg-card px-1.5 py-[1px] font-mono text-[8px] font-bold uppercase tracking-[0.1em] text-muted-foreground shadow-[1px_1px_0_var(--border)]">
            ★ Featured
          </span>
        )}
      </div>

      {/* Title + summary */}
      <h3
        className={`font-black uppercase tracking-tight ${
          featured ? "text-lg sm:text-xl" : "text-[13px]"
        }`}
      >
        {project.title}
      </h3>
      <p
        className={`mt-1 mb-3 flex-1 leading-[1.55] text-muted-foreground ${
          featured ? "text-[12px] sm:text-sm" : "text-[10px]"
        } line-clamp-3`}
      >
        {t(`projects.items.${project.index}.summary`)}
      </p>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-1">
        {project.techStack.slice(0, featured ? 6 : 4).map((tech) => (
          <span
            key={tech}
            className="border-[1.5px] border-border bg-muted px-1.5 py-[1px] font-mono text-[8px] font-bold uppercase tracking-[0.05em] text-muted-foreground"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
```

A few things changed from the original:
- The `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, and `Badge` imports are gone — we use plain `div`s.
- The `gradient` field on `Project` is no longer used in the card (kept in data for the dialog's potential use).
- A `featured` prop was added — used by the section in Task 5.
- The wrapper is a `div` with `role="button"` instead of a shadcn `Card` so we can control the layout exactly.

- [ ] **Step 4.2: Verify the card on the page**

The projects section (Task 5) hasn't been updated yet, so individual cards now look slightly different inside the old grid. That's fine for now — verify:
- Each card has sharp corners and a faint border around the thumbnail.
- The corner number "01"–"07" appears in the top right.
- Below the card, the category line shows up in the right color (green/orange/amber/violet/red/warm-orange).
- "● Live" and `{ } Code` pills appear conditionally.
- No console errors.

- [ ] **Step 4.3: Commit**

```bash
git add src/app/_components/project-card.tsx
git commit -m "style(project-card): brutalism card with corner number, category, status badges"
```

---

## Task 5: Projects Section — asymmetric featured grid

**Files:**
- Modify: `src/app/_components/projects-section.tsx`

Replace the uniform 3-column grid with a 3-column grid where the first project spans 3 rows. Wraps the grid in a `border-2` shell with a `4px 4px 0` shadow. Each cell gets right + bottom borders that are dropped on the last column / last row.

- [ ] **Step 5.1: Replace the entire file**

```tsx
"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSectionFade, useStaggeredFade } from "@/hooks";
import { PROJECTS } from "@/data/projects";
import type { Project } from "@/data/projects";
import { ProjectCard } from "./project-card";
import { ProjectDialog } from "./project-dialog";

export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const fadeRef = useSectionFade();
  const staggerRef = useStaggeredFade(120);
  const { t } = useTranslation();

  const [featured, ...rest] = PROJECTS;

  return (
    <section
      id="projects"
      className="relative scroll-mt-16 border-b-2 border-border px-6 py-16 sm:py-20"
    >
      <div ref={fadeRef} className="section-fade relative mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-3 flex items-center gap-3">
          <span className="border-2 border-secondary bg-card px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-secondary shadow-[2px_2px_0_var(--border)]">
            {t("projects.badge")}
          </span>
          <h2 className="text-xl font-black uppercase tracking-tight sm:text-2xl">
            {t("projects.title")}
          </h2>
          <span aria-hidden className="h-[2px] flex-1 bg-border opacity-10" />
        </div>
        <p className="mb-8 text-[11px] text-muted-foreground">
          {t("projects.subtitle")}
        </p>

        {/* Asymmetric grid */}
        <div
          ref={staggerRef}
          className="grid grid-cols-1 border-2 border-border shadow-[4px_4px_0_var(--border)] md:grid-cols-3"
        >
          {/* Featured (col 1, spans 3 rows on md+) */}
          <div className="stagger-item border-b-2 border-border md:col-span-1 md:row-span-3 md:border-b-0 md:border-r-2">
            <ProjectCard
              project={featured}
              onSelect={() => setSelectedProject(featured)}
              featured
            />
          </div>

          {/* Other 6 projects fill cols 2-3 over 3 rows */}
          {rest.map((project, idx) => {
            // idx: 0..5 ; on md+ col index in the right block: idx % 2 (0 = col2, 1 = col3)
            const isLastColMd = idx % 2 === 1;        // idx 1, 3, 5 sit in column 3 on md+
            const isLastRowMd = idx >= 4;             // idx 4, 5 sit in the third (last) row on md+
            const isLastDomCell = idx === 5;          // very last cell when stacked on mobile
            const bottomBase = isLastDomCell ? "border-b-0" : "border-b-2";
            const bottomMd = isLastRowMd && !isLastDomCell ? "md:border-b-0" : "";
            const rightMd = isLastColMd ? "md:border-r-0" : "md:border-r-2";
            return (
              <div
                key={project.title}
                className={`stagger-item border-border ${bottomBase} ${bottomMd} ${rightMd}`}
              >
                <ProjectCard
                  project={project}
                  onSelect={() => setSelectedProject(project)}
                />
              </div>
            );
          })}
        </div>

        <ProjectDialog
          project={selectedProject}
          open={!!selectedProject}
          onOpenChange={(open) => {
            if (!open) setSelectedProject(null);
          }}
        />
      </div>
    </section>
  );
}
```

- [ ] **Step 5.2: Verify the layout**

Reload the page and scroll to "Featured Projects". On a desktop viewport (≥768px):
- Single 2px outer border around the whole grid with a 4px black offset shadow.
- Featured card (MapTrack) takes the entire left column and is taller (spans 3 rows).
- Right side has 6 cards in 2 columns × 3 rows: Happy5, Expense Tracker, Shopbot, Echo Test, GoMovies, Journal.
- Inner borders are crisp (no double borders, no gaps).
- Bottom row + last column have no outer border bleeding through (handled by the `border-r-0` / `border-b-0` toggles).
- On mobile (≤640px): single column, all cards stacked.

- [ ] **Step 5.3: Commit**

```bash
git add src/app/_components/projects-section.tsx
git commit -m "style(projects): asymmetric featured-grid layout"
```

---

## Task 6: Experience Section — colored timeline

**Files:**
- Modify: `src/app/_components/experience-section.tsx`

Big restructure. Replaces the alternating center timeline with a left-anchored timeline. Each entry gets a colored dot, a card with a tinted-color header strip, a 44×44 colored initials block, and a body row with skill pills. The `current` flag is true only for the first entry (MapTrack).

- [ ] **Step 6.1: Replace the entire file**

```tsx
"use client";

import { useTranslation } from "react-i18next";
import { useSectionFade, usePerItemFade } from "@/hooks";
import { EXPERIENCES } from "@/data/experiences";

type Style = { color: string; initials: string; lightBg: string; isLightInitials?: boolean };

// Indexed by EXPERIENCES position so the two Happy5 entries get different colors.
const STYLES: Style[] = [
  { color: "var(--primary)",         lightBg: "color-mix(in oklch, var(--primary) 8%, transparent)",   initials: "MT" },
  { color: "var(--secondary)",       lightBg: "color-mix(in oklch, var(--secondary) 8%, transparent)", initials: "H5" },
  { color: "var(--accent)",          lightBg: "color-mix(in oklch, var(--accent) 10%, transparent)",   initials: "KG", isLightInitials: true },
  { color: "oklch(0.45 0.14 190)",   lightBg: "color-mix(in oklch, oklch(0.45 0.14 190) 8%, transparent)", initials: "RA" },
  { color: "oklch(0.5 0.18 290)",    lightBg: "color-mix(in oklch, oklch(0.5 0.18 290) 8%, transparent)",  initials: "SS" },
  { color: "oklch(0.75 0.18 29)",    lightBg: "color-mix(in oklch, oklch(0.75 0.18 29) 8%, transparent)",  initials: "H5", isLightInitials: true },
];

export function ExperienceSection() {
  const fadeRef = useSectionFade();
  const itemFadeRef = usePerItemFade();
  const { t } = useTranslation();

  return (
    <section
      id="experience"
      className="relative scroll-mt-16 border-b-2 border-border px-6 py-16 sm:py-20"
    >
      <div ref={fadeRef} className="section-fade mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-3 flex items-center gap-3">
          <span className="border-2 border-secondary bg-card px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-secondary shadow-[2px_2px_0_var(--border)]">
            {t("experience.badge")}
          </span>
          <h2 className="text-xl font-black uppercase tracking-tight sm:text-2xl">
            {t("experience.title")}
          </h2>
          <span aria-hidden className="h-[2px] flex-1 bg-border opacity-10" />
        </div>
        <p className="mb-10 text-[11px] text-muted-foreground">
          {t("experience.subtitle")}
        </p>

        {/* Timeline */}
        <div ref={itemFadeRef} className="relative pl-7">
          {/* Vertical line */}
          <span
            aria-hidden
            className="absolute left-2 top-0 bottom-0 w-[3px] bg-border opacity-10"
          />

          <ul className="flex flex-col gap-5">
            {EXPERIENCES.map((exp, i) => {
              const style = STYLES[i] ?? STYLES[0];
              const isCurrent = i === 0;
              const [location, type] = exp.location.split(",").map((s) => s.trim());
              return (
                <li key={i} className="stagger-item relative">
                  {/* Dot */}
                  <span
                    aria-hidden
                    className="absolute left-[-30px] top-5 size-4 border-[2.5px] border-border shadow-[2px_2px_0_var(--border)]"
                    style={{ background: style.color }}
                  />

                  {/* Card */}
                  <div className="border-2 border-border bg-card shadow-[4px_4px_0_var(--border)] transition-shadow hover:shadow-[6px_6px_0_var(--border)]">
                    {/* Header strip */}
                    <div
                      className="flex flex-col gap-3 border-b-2 border-border px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between"
                      style={{ background: style.lightBg }}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className="flex size-11 shrink-0 items-center justify-center border-2 border-border font-mono text-[13px] font-black shadow-[2px_2px_0_var(--border)]"
                          style={{
                            background: style.color,
                            color: style.isLightInitials ? "var(--foreground)" : "#fff",
                          }}
                        >
                          {style.initials}
                        </div>
                        <div>
                          <div className="mb-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                            {exp.company}
                          </div>
                          <div className="text-[13px] font-black uppercase tracking-tight">
                            {exp.role}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-start gap-1 sm:items-end">
                        {isCurrent && (
                          <span className="border-[1.5px] border-border bg-primary px-1.5 py-[1px] font-mono text-[7px] font-bold uppercase tracking-[0.1em] text-white shadow-[1px_1px_0_var(--border)]">
                            ● Current
                          </span>
                        )}
                        <span className="border-2 border-border bg-card px-2 py-0.5 font-mono text-[9px] font-bold whitespace-nowrap shadow-[2px_2px_0_var(--border)]">
                          {exp.period}
                        </span>
                        <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground">
                          {[location, type].filter(Boolean).join(" · ")}
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="flex flex-wrap gap-1.5 px-5 py-3">
                      {exp.skills.map((skill) => (
                        <span
                          key={skill}
                          className="border-[1.5px] border-border bg-muted px-1.5 py-[1px] font-mono text-[8px] font-bold uppercase tracking-[0.05em] text-muted-foreground"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
```

The `MapPin`, `Building2`, and `Badge` imports are dropped — the new design renders this info as plain text + custom pills. The per-bullet description rendering (`Array.from({length: exp.descriptionCount}, ...)`) is also removed; descriptions stay accessible via the resume PDF / future expansion.

- [ ] **Step 6.2: Verify the timeline**

Scroll to "Work Experience". Check:
- Vertical line on the very left (faint).
- 6 dots, top-down, in colors: green / orange / amber / teal / violet / light-orange.
- Each card has 2px black border, 4px offset shadow, hover lifts to 6px.
- Header strip has tinted background (very light) matching the dot color.
- Initials block (44×44) is colored with `MT`, `H5`, `KG`, `RA`, `SS`, `H5`.
- First card (MapTrack) has a green `● Current` pill.
- Period pill is mono with offset shadow.
- Skill row at the bottom has mono pills.
- No console errors.

- [ ] **Step 6.3: Commit**

```bash
git add src/app/_components/experience-section.tsx
git commit -m "style(experience): colored left-anchored timeline with company initials"
```

---

## Task 7: Contact Section — diagonal stripe + channel cards

**Files:**
- Modify: `src/app/_components/contact-section.tsx`

Drops the centered icon-only layout. New: cream background with a diagonal-stripe pattern overlay, 2-column grid (heading on the left, 3 channel cards on the right), CTA button, and an animated availability tag.

- [ ] **Step 7.1: Replace the entire file**

```tsx
"use client";

import { useTranslation } from "react-i18next";
import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useSectionFade, useStaggeredFade } from "@/hooks";
import { CONTACTS } from "@/data/contacts";

const GH_HANDLE = CONTACTS.github.replace(/.*github\.com\//i, "@").replace(/\/$/, "");
const LI_HANDLE = CONTACTS.linkedin.replace(/.*linkedin\.com\/in\//i, "").replace(/\/$/, "");

export function ContactSection() {
  const fadeRef = useSectionFade();
  const staggerRef = useStaggeredFade(100);
  const { t } = useTranslation();

  return (
    <section
      id="contact"
      className="relative scroll-mt-16 overflow-hidden border-t-2 border-border px-6 py-16 sm:py-20"
    >
      {/* Diagonal stripe pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(135deg, transparent 0 38px, oklch(0 0 0 / 0.04) 38px 40px)",
        }}
      />

      {/* Deco asterisk top-right */}
      <svg
        aria-hidden
        className="pointer-events-none absolute"
        style={{ top: 30, right: 30, width: 70, height: 70, opacity: 0.5 }}
        viewBox="0 0 70 70"
      >
        <g
          stroke="oklch(0.5687 0.1498 151.9380)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        >
          <line x1="35" y1="5" x2="35" y2="65" />
          <line x1="5" y1="35" x2="65" y2="35" />
          <line x1="14" y1="14" x2="56" y2="56" />
          <line x1="56" y1="14" x2="14" y2="56" />
        </g>
      </svg>

      <div
        ref={fadeRef}
        className="section-fade relative z-[2] mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[1fr_auto]"
      >
        {/* Left column — heading + CTA */}
        <div>
          <span className="mb-4 inline-flex items-center gap-2 border-2 border-primary bg-card px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-primary shadow-[2px_2px_0_var(--border)]">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
            </span>
            {t("contact.badge")}
          </span>

          <h2 className="text-3xl font-black uppercase leading-[0.95] tracking-tight sm:text-4xl lg:text-5xl">
            Let&apos;s Work
            <br />
            <span className="text-secondary">Together</span>
          </h2>

          <p className="mt-4 max-w-md font-mono text-[12px] leading-[1.65] text-muted-foreground sm:text-[13px]">
            {t("contact.subtitle")}
          </p>

          <a
            href={`mailto:${CONTACTS.email}`}
            className="mt-6 inline-flex items-center gap-2 border-2 border-border bg-foreground px-7 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-background shadow-[5px_5px_0_var(--border)] transition-transform hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[7px_7px_0_var(--border)]"
          >
            ✦ Send a message →
          </a>
        </div>

        {/* Right column — channel cards */}
        <ul ref={staggerRef} className="flex flex-col gap-3">
          <li className="stagger-item">
            <a
              href={`mailto:${CONTACTS.email}`}
              className="flex min-w-[260px] items-center gap-3.5 border-2 border-border bg-card px-4 py-3 shadow-[3px_3px_0_var(--border)] transition-transform hover:-translate-x-[2px] hover:-translate-y-[2px] hover:bg-muted hover:shadow-[5px_5px_0_var(--border)]"
            >
              <span className="flex size-9 shrink-0 items-center justify-center border-[1.5px] border-border bg-primary text-white">
                <Mail className="size-4" />
              </span>
              <span>
                <span className="block font-mono text-[8px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                  Email
                </span>
                <span className="block text-[12px] font-black tracking-tight">
                  {CONTACTS.email}
                </span>
              </span>
            </a>
          </li>
          <li className="stagger-item">
            <a
              href={CONTACTS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-w-[260px] items-center gap-3.5 border-2 border-border bg-card px-4 py-3 shadow-[3px_3px_0_var(--border)] transition-transform hover:-translate-x-[2px] hover:-translate-y-[2px] hover:bg-muted hover:shadow-[5px_5px_0_var(--border)]"
            >
              <span className="flex size-9 shrink-0 items-center justify-center border-[1.5px] border-border bg-foreground text-background">
                <FaGithub className="size-4" />
              </span>
              <span>
                <span className="block font-mono text-[8px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                  GitHub
                </span>
                <span className="block text-[12px] font-black tracking-tight">
                  {GH_HANDLE}
                </span>
              </span>
            </a>
          </li>
          <li className="stagger-item">
            <a
              href={CONTACTS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-w-[260px] items-center gap-3.5 border-2 border-border bg-card px-4 py-3 shadow-[3px_3px_0_var(--border)] transition-transform hover:-translate-x-[2px] hover:-translate-y-[2px] hover:bg-muted hover:shadow-[5px_5px_0_var(--border)]"
            >
              <span className="flex size-9 shrink-0 items-center justify-center border-[1.5px] border-border bg-secondary text-white">
                <FaLinkedin className="size-4" />
              </span>
              <span>
                <span className="block font-mono text-[8px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                  LinkedIn
                </span>
                <span className="block text-[12px] font-black tracking-tight">
                  {LI_HANDLE}
                </span>
              </span>
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
```

The `Badge` import is dropped. `useStaggeredFade` is preserved (used on the channel-cards `<ul>`).

- [ ] **Step 7.2: Verify**

Scroll to the contact section. Check:
- Background is the same cream as the rest of the page.
- Faint diagonal-stripe pattern visible across the bg.
- Green asterisk top-right (more visible than before).
- Two-column layout on desktop: heading + CTA on left, three channel cards on right.
- "Together" word is orange.
- "Send a message" button is solid black with 5px offset shadow.
- Channel cards: email (green icon), github (black icon), linkedin (orange icon). Each with handle + label.
- All channel cards are real links (mailto + github + linkedin URLs).
- On mobile: stacks to single column.

- [ ] **Step 7.3: Commit**

```bash
git add src/app/_components/contact-section.tsx
git commit -m "style(contact): asymmetric two-column layout with channel cards"
```

---

## Task 8: Footer restyle

**Files:**
- Modify: `src/app/_components/footer.tsx`

Tiny change.

- [ ] **Step 8.1: Replace the file**

```tsx
"use client";

import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t-2 border-border py-5 text-center">
      <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
        © {new Date().getFullYear()} Ashandi Leonadi. {t("footer.builtWith")}
      </p>
    </footer>
  );
}
```

- [ ] **Step 8.2: Verify**

Scroll to the very bottom: thick top border, mono uppercase footer line.

- [ ] **Step 8.3: Commit**

```bash
git add src/app/_components/footer.tsx
git commit -m "style(footer): mono uppercase brutalism footer"
```

---

## Task 9: Resume Header — section tag + brutalism title

**Files:**
- Modify: `src/app/resume/_components/resume-header.tsx`

- [ ] **Step 9.1: Replace the file**

```tsx
export function ResumeHeader() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-24 text-center">
      <span className="mb-4 inline-flex items-center gap-2 border-2 border-secondary bg-card px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-secondary shadow-[2px_2px_0_var(--border)]">
        <svg
          aria-hidden
          width="11"
          height="13"
          viewBox="0 0 14 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 1H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4z" />
          <polyline points="9 1 9 4 12 4" />
          <line x1="9" y1="8" x2="5" y2="8" />
          <line x1="9" y1="11" x2="5" y2="11" />
        </svg>
        Document
      </span>
      <h1 className="text-4xl font-black uppercase leading-[0.92] tracking-[-2px] sm:text-5xl">
        My{" "}
        <span className="underline decoration-primary decoration-[5px] underline-offset-[6px]">
          Resume
        </span>
      </h1>
      <p className="mx-auto mt-3 max-w-md font-mono text-[12px] leading-[1.65] text-muted-foreground">
        Download or view my professional resume to learn more about my
        experience and skills.
      </p>
    </div>
  );
}
```

- [ ] **Step 9.2: Verify on /resume**

Visit `http://localhost:3000/resume`. The "Document" section tag and brutalism title should render. The downstream cards still look old at this point.

- [ ] **Step 9.3: Commit**

```bash
git add src/app/resume/_components/resume-header.tsx
git commit -m "style(resume-header): document tag + brutalism title"
```

---

## Task 10: Resume Actions card

**Files:**
- Modify: `src/app/resume/_components/resume-actions.tsx`

- [ ] **Step 10.1: Replace the file**

```tsx
import { Eye, Download, FileText } from "lucide-react";

export function ResumeActions() {
  return (
    <div className="relative border-2 border-border bg-card p-6 shadow-[5px_5px_0_var(--border)]">
      <span className="pointer-events-none absolute right-4 top-3 font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
        01 / 02
      </span>

      <div className="flex items-start gap-3.5">
        <span className="flex size-11 shrink-0 items-center justify-center border-2 border-border bg-primary text-white shadow-[2px_2px_0_var(--border)]">
          <FileText className="size-5" strokeWidth={2.5} />
        </span>
        <div>
          <h2 className="text-base font-black uppercase tracking-tight">
            Professional Resume
          </h2>
          <p className="mt-1 font-mono text-[11px] leading-[1.6] text-muted-foreground">
            View or download my latest resume in PDF format.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3 border-t-2 border-border pt-4">
        <a
          href="/Ashandi_Leonadi_CV_2026.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border-2 border-border bg-foreground px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-background shadow-[4px_4px_0_var(--border)] transition-transform hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0_var(--border)]"
        >
          <Eye className="size-4" />
          View Online
        </a>
        <a
          href="/Ashandi_Leonadi_CV_2026.pdf"
          download
          className="inline-flex items-center gap-2 border-2 border-border bg-accent px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-foreground shadow-[4px_4px_0_var(--border)] transition-transform hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0_var(--border)]"
        >
          <Download className="size-4" />
          Download PDF
        </a>
      </div>
    </div>
  );
}
```

The shadcn `Button` import is dropped — we use plain `<a>` tags for cleaner brutalism control.

- [ ] **Step 10.2: Verify**

Reload `/resume`. Card has 2px black border, 5px offset shadow. Green icon block on the left. "01 / 02" in the corner. Two buttons (solid black + amber) below a horizontal divider line. Clicking each button opens / downloads the PDF correctly.

- [ ] **Step 10.3: Commit**

```bash
git add src/app/resume/_components/resume-actions.tsx
git commit -m "style(resume-actions): brutalism card with icon block and sharp buttons"
```

---

## Task 11: Resume Preview card

**Files:**
- Modify: `src/app/resume/_components/resume-preview.tsx`

- [ ] **Step 11.1: Replace the file**

```tsx
export function ResumePreview() {
  return (
    <div className="relative border-2 border-border bg-card shadow-[5px_5px_0_var(--border)]">
      <span className="pointer-events-none absolute right-4 top-3 z-[2] font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
        02 / 02
      </span>

      {/* Header strip */}
      <div
        className="flex items-center justify-between gap-4 border-b-2 border-border px-5 py-4"
        style={{ background: "color-mix(in oklch, var(--accent) 10%, transparent)" }}
      >
        <div>
          <h2 className="text-[14px] font-black uppercase tracking-tight">
            Resume Preview
          </h2>
          <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
            Ashandi_Leonadi_CV_2026.pdf
          </p>
        </div>
        <span className="border-2 border-border bg-card px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.05em] text-accent shadow-[2px_2px_0_var(--border)]">
          PDF · 1 PAGE
        </span>
      </div>

      {/* iframe */}
      <div className="m-4 overflow-hidden border-2 border-border bg-muted">
        <iframe
          src="/Ashandi_Leonadi_CV_2026.pdf"
          title="Resume - Ashandi Leonadi"
          className="h-[70vh] w-full sm:h-[80vh]"
        />
      </div>

      {/* Footer strip */}
      <div className="border-t-2 border-border bg-muted px-5 py-3 text-center font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
        ↑ If preview doesn&apos;t load, use the buttons above to view or download
      </div>
    </div>
  );
}
```

- [ ] **Step 11.2: Verify**

`/resume` now has both cards in brutalism style. The header strip has a faint amber tint, the `PDF · 1 PAGE` pill is on the right, the iframe loads the PDF inside a 2px border, and the bottom footer strip shows the fallback note.

- [ ] **Step 11.3: Commit**

```bash
git add src/app/resume/_components/resume-preview.tsx
git commit -m "style(resume-preview): header strip + sharp iframe + footer strip"
```

---

## Task 12: Resume page wrapper — deco shapes

**Files:**
- Modify: `src/app/resume/page.tsx`

Add the four scattered SVG decorations to the page wrapper, behind the content.

- [ ] **Step 12.1: Replace the file**

```tsx
import type { Metadata } from "next";
import { ResumeLayout, ResumeHeader, ResumeActions, ResumePreview } from "./_components";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "View or download the resume of Ashandi Leonadi — Frontend Developer specializing in React, Next.js, and TypeScript.",
  alternates: {
    canonical: "https://ashandileonadi.vercel.app/resume",
  },
};

export default function ResumePage() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-background">
      {/* Decorative shapes */}
      <svg
        aria-hidden
        className="pointer-events-none absolute"
        style={{ top: 120, left: 60, width: 90, height: 90, opacity: 0.45 }}
        viewBox="0 0 90 90"
      >
        <g
          stroke="oklch(0.5687 0.1498 151.9380)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        >
          <line x1="45" y1="6" x2="45" y2="84" />
          <line x1="6" y1="45" x2="84" y2="45" />
          <line x1="18" y1="18" x2="72" y2="72" />
          <line x1="72" y1="18" x2="18" y2="72" />
        </g>
      </svg>

      <svg
        aria-hidden
        className="pointer-events-none absolute"
        style={{ top: 140, right: 80, width: 100, height: 60, opacity: 0.5 }}
        viewBox="0 0 100 60"
      >
        <path
          d="M6 30 C26 8,52 52,72 30 C84 16,90 40,94 30"
          fill="none"
          stroke="oklch(0.6088 0.2498 29.2339)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <polyline
          points="86,18 96,30 86,42"
          fill="none"
          stroke="oklch(0.6088 0.2498 29.2339)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <svg
        aria-hidden
        className="pointer-events-none absolute"
        style={{ bottom: 200, left: 60, width: 60, height: 60, opacity: 0.4 }}
        viewBox="0 0 60 60"
      >
        <rect
          x="6"
          y="6"
          width="48"
          height="48"
          fill="none"
          stroke="oklch(0.7721 0.1727 64.1585)"
          strokeWidth="3.5"
          transform="rotate(20 30 30)"
        />
      </svg>

      <svg
        aria-hidden
        className="pointer-events-none absolute"
        style={{ bottom: 240, right: 60, width: 60, height: 60, opacity: 0.3 }}
        viewBox="0 0 60 60"
      >
        <g fill="oklch(0.1759 0.0275 161.2531)">
          <circle cx="8" cy="8" r="3" />
          <circle cx="30" cy="8" r="3" />
          <circle cx="52" cy="8" r="3" />
          <circle cx="8" cy="30" r="3" />
          <circle cx="30" cy="30" r="3" />
          <circle cx="52" cy="30" r="3" />
          <circle cx="8" cy="52" r="3" />
          <circle cx="30" cy="52" r="3" />
          <circle cx="52" cy="52" r="3" />
        </g>
      </svg>

      <ResumeLayout>
        <ResumeHeader />
        <main className="relative z-[2] mx-auto max-w-3xl space-y-5 px-6 py-10">
          <ResumeActions />
          <ResumePreview />
        </main>
      </ResumeLayout>
    </div>
  );
}
```

- [ ] **Step 12.2: Verify**

Reload `/resume`. The four shapes — green asterisk top-left, orange squiggly arrow top-right, amber rotated square mid-left, dark dot grid mid-right — are visible behind the content. Cards still render on top with `z-[2]`.

- [ ] **Step 12.3: Commit**

```bash
git add src/app/resume/page.tsx
git commit -m "style(resume): add deco shapes to page wrapper"
```

---

## Task 13: Cleanup unused CSS rules

**Files:**
- Modify: `src/app/globals.css`

Now that all sections are restyled, four CSS rule blocks are confirmed unused and should be removed for hygiene.

- [ ] **Step 13.1: Verify these classes are not used anywhere**

Run a grep over `src/`:

```bash
grep -RIn --include="*.tsx" --include="*.ts" \
  -e 'timeline-line' \
  -e 'timeline-dot' \
  -e 'project-card' \
  -e 'glass-card' \
  -e 'animate-card-swap' \
  -e 'gradient-shimmer' \
  src/
```

Expected: no matches.

- [ ] **Step 13.2: Remove unused CSS blocks**

In `src/app/globals.css` delete:
- `.timeline-line { ... }` and `.timeline-dot { ... }` (the "TIMELINE GLOW" section).
- `.project-card { ... }` and `.project-card:hover { ... }` (the "PROJECT CARD HOVER" section).
- `.glass-card { ... }` and `.dark .glass-card { ... }` (the "CONTACT CARD GLASS" section).

Keep all other rules (`.hero-grid`, `.section-fade`, `.hero-stagger`, `.stagger-item`, `.tech-pill`, `.contact-icon`, `.mobile-menu-enter`, `.typewriter-cursor`, `.animate-marquee`).

- [ ] **Step 13.3: Verify**

Reload the homepage and `/resume`. No visual regressions. No console errors.

- [ ] **Step 13.4: Commit**

```bash
git add src/app/globals.css
git commit -m "style(css): drop unused timeline/glass/project-card rules"
```

---

## Task 14: Final verification

**Files:**
- None (verification only)

- [ ] **Step 14.1: Lint**

```bash
pnpm lint
```

Expected: no errors. Pre-existing warnings (if any) must not have grown.

- [ ] **Step 14.2: Production build**

```bash
pnpm build
```

Expected: build succeeds. TypeScript errors are blocking — fix them in the offending file and re-run.

- [ ] **Step 14.3: Manual verification checklist**

Open `http://localhost:3000` (and `/resume`) in a fresh browser tab and walk through:

- [ ] Navbar: sticky, sharp, active link is solid black with offset shadow.
- [ ] Theme toggle still flips light/dark mode.
- [ ] Language toggle still switches EN/ID.
- [ ] Hero: 5 deco shapes, color stripe, centered content, all 22 tech pills, typewriter cycling, bouncing scroll arrow.
- [ ] Marquee strip scrolling left smoothly.
- [ ] Projects: featured grid, MapTrack as the big card, 6 others on the right (Happy5, Expense Tracker, Shopbot, Echo Test, GoMovies, Journal). Status pills (`Live`, `Code`, `Featured`) appear correctly per project. Clicking a card opens the existing dialog.
- [ ] Experience: 6 timeline cards, colored dots + initials, MapTrack flagged `Current`.
- [ ] Contact: cream bg, diagonal stripes, 2-column layout, channel cards link to email/github/linkedin.
- [ ] Footer: thick top border, mono uppercase line.
- [ ] `/resume`: header tag + title, both cards in brutalism style, PDF iframe loads.
- [ ] Resize to 375px width: everything stacks cleanly, no horizontal scroll, no overlap.
- [ ] No `rounded-full`, no gradient text, no `backdrop-blur`, no glow orbs visible anywhere.
- [ ] No console errors or warnings in DevTools across the homepage and `/resume`.

- [ ] **Step 14.4: If anything fails the checklist, fix it in a focused commit and re-verify before declaring done.**

---

## Self-review notes

- Spec coverage: every numbered section (1–8) of the spec has a corresponding task. Task 1 + 13 split the CSS work for better commit hygiene; Tasks 9–12 cover the resume page in fine-grained pieces.
- No placeholders: every step has either concrete code or an exact command + expected outcome.
- Type consistency: the per-project category and per-experience style maps are defined locally within their own files; the `Project` type from `@/data/projects` is unchanged. The new `featured?: boolean` prop on `ProjectCard` is the only public-API change and is consumed by `ProjectsSection` in Task 5.
- Animations preserved: `useTypewriter`, `useSectionFade`, `useStaggeredFade`, `usePerItemFade`, plus the `.section-fade`, `.stagger-item`, `.tech-pill`, and `.hero-stagger` CSS hooks all remain intact.
