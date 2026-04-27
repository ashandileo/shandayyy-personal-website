# Experience Dialog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make each timeline card in the Work Experience section clickable, opening a detail dialog that shows the role's description bullets (already in locale files) plus the skills tags and an optional "Visit Company" link.

**Architecture:** Mirror the existing `ProjectCard` → `ProjectDialog` pattern. Extract the per-item card markup into `ExperienceCard`, add a new `ExperienceDialog` that uses the same colored header strip styling as the inline timeline card, and have `ExperienceSection` hold the selected-experience state.

**Tech Stack:** Next.js 16 (App Router, client components), React 19, Tailwind CSS v4 (brutalism design tokens), `react-i18next` for translations, `@base-ui/react` Dialog (already wrapped in `src/components/ui/dialog.tsx`).

**Test infrastructure note:** This repo has no test runner configured (no jest/vitest/playwright in `package.json`). Verification per task is: `pnpm lint`, TypeScript type check (`pnpm exec tsc --noEmit`), and visual confirmation in the dev server (`pnpm dev`).

**Spec:** `docs/superpowers/specs/2026-04-27-experience-dialog-design.md`

---

## File Structure

| File | Status | Responsibility |
|---|---|---|
| `src/data/experiences.ts` | Modify | Add `Style` type, export `EXPERIENCE_STYLES`, add optional `website` field to `Experience`, populate URLs for MapTrack and Happy5. |
| `src/app/_components/experience-section.tsx` | Modify | Drop the inline `STYLES` and `<li>` body; import `EXPERIENCE_STYLES`, render `<ExperienceCard>`, hold `selectedExperience` state, render `<ExperienceDialog>`. |
| `src/app/_components/experience-card.tsx` | Create | Per-item card markup, clickable (cursor + role + key/click handlers). |
| `src/app/_components/experience-dialog.tsx` | Create | Detail dialog: colored header strip, description bullets, skills tags, optional "Visit Company" button. |

No translation file changes — bullets already exist in `src/locales/en.json` and `src/locales/id.json` under `experience.jobs[i].description`.

---

## Task 1: Move styles and add website field to data layer

**Files:**
- Modify: `src/data/experiences.ts`
- Modify: `src/app/_components/experience-section.tsx`

- [ ] **Step 1: Update `src/data/experiences.ts`**

Replace the file with:

```ts
export interface Style {
  color: string;
  initials: string;
  lightBg: string;
  isLightInitials?: boolean;
}

export interface Experience {
  role: string;
  company: string;
  location: string;
  period: string;
  descriptionCount: number;
  skills: string[];
  website?: string;
}

export const EXPERIENCES: Experience[] = [
  {
    role: "Product Software Engineer (Fullstack)",
    company: "MapTrack",
    location: "Remote, Full-time",
    period: "Jan 2025 — Present",
    descriptionCount: 3,
    skills: ["Next.js", "TypeScript", "Supabase", "OpenAI", "TanStack DB", "Amazon DynamoDB"],
    website: "https://maptrack.com",
  },
  {
    role: "Frontend Web/Mobile Engineer",
    company: "Happy5",
    location: "Remote, Full-time",
    period: "Mar 2021 — Dec 2025",
    descriptionCount: 9,
    skills: ["React", "React Native", "TypeScript", "Tailwind CSS", "Cypress", "Storybook", "Amplitude"],
    website: "https://www.happy5.co/",
  },
  {
    role: "Frontend Web Engineer",
    company: "Kodegiri",
    location: "Remote, Freelance",
    period: "Mar 2024 — Jun 2024",
    descriptionCount: 4,
    skills: ["React.js", "TypeScript", "Tailwind CSS", "Ant Design"],
  },
  {
    role: "Frontend Web Engineer",
    company: "Rakamin Academy",
    location: "Remote, Freelance",
    period: "Mar 2022 — Apr 2022",
    descriptionCount: 5,
    skills: ["React.js", "React Query", "Styled Components"],
  },
  {
    role: "Frontend Web Engineer",
    company: "Smarteschool",
    location: "Remote, Freelance",
    period: "Jul 2021 — Feb 2022",
    descriptionCount: 6,
    skills: ["Next.js", "Bootstrap", "React"],
  },
  {
    role: "Frontend Web Engineer (Intern)",
    company: "Happy5",
    location: "Remote, Intern",
    period: "May 2020 — Mar 2021",
    descriptionCount: 4,
    skills: ["React", "Cypress", "@react-pdf/renderer"],
    website: "https://www.happy5.co/",
  },
];

// Indexed by EXPERIENCES position so the two Happy5 entries get different colors.
export const EXPERIENCE_STYLES: Style[] = [
  { color: "var(--primary)",         lightBg: "color-mix(in oklch, var(--primary) 8%, transparent)",   initials: "MT" },
  { color: "var(--secondary)",       lightBg: "color-mix(in oklch, var(--secondary) 8%, transparent)", initials: "H5" },
  { color: "var(--accent)",          lightBg: "color-mix(in oklch, var(--accent) 10%, transparent)",   initials: "KG", isLightInitials: true },
  { color: "oklch(0.45 0.14 190)",   lightBg: "color-mix(in oklch, oklch(0.45 0.14 190) 8%, transparent)", initials: "RA" },
  { color: "oklch(0.5 0.18 290)",    lightBg: "color-mix(in oklch, oklch(0.5 0.18 290) 8%, transparent)",  initials: "SS" },
  { color: "oklch(0.75 0.18 29)",    lightBg: "color-mix(in oklch, oklch(0.75 0.18 29) 8%, transparent)",  initials: "H5", isLightInitials: true },
];
```

- [ ] **Step 2: Update `src/app/_components/experience-section.tsx`**

Remove the local `Style` type and `STYLES` array (lines 7–17 in the current file) and switch to the imported version. The change is the import and the lookup variable name.

Old (lines 5–17):
```tsx
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
```

New:
```tsx
import { EXPERIENCES, EXPERIENCE_STYLES } from "@/data/experiences";
```

In the `.map` body, change the lookup line:

Old (line 54):
```tsx
const style = STYLES[i] ?? STYLES[0];
```

New:
```tsx
const style = EXPERIENCE_STYLES[i] ?? EXPERIENCE_STYLES[0];
```

- [ ] **Step 3: Verify lint and types**

```bash
pnpm lint
pnpm exec tsc --noEmit
```

Expected: both pass with no errors.

- [ ] **Step 4: Visual smoke check**

```bash
pnpm dev
```

Open `http://localhost:3000` and scroll to the Work Experience section. The timeline should look identical to before this task (no behavioral or visual change).

- [ ] **Step 5: Commit**

```bash
git add src/data/experiences.ts src/app/_components/experience-section.tsx
git commit -m "refactor(experience): export styles and add optional website field"
```

---

## Task 2: Extract ExperienceCard component (visual no-op)

**Files:**
- Create: `src/app/_components/experience-card.tsx`
- Modify: `src/app/_components/experience-section.tsx`

- [ ] **Step 1: Create `src/app/_components/experience-card.tsx`**

```tsx
"use client";

import type { Experience, Style } from "@/data/experiences";

export function ExperienceCard({
  experience,
  style,
  isCurrent,
}: {
  experience: Experience;
  style: Style;
  isCurrent: boolean;
}) {
  const [location, type] = experience.location.split(",").map((s) => s.trim());

  return (
    <div className="border-2 border-border bg-card shadow-[4px_4px_0_var(--border)] transition-shadow hover:shadow-[6px_6px_0_var(--border)]">
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
              {experience.company}
            </div>
            <div className="text-[13px] font-black uppercase tracking-tight">
              {experience.role}
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
            {experience.period}
          </span>
          <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground">
            {[location, type].filter(Boolean).join(" · ")}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 px-5 py-3">
        {experience.skills.map((skill) => (
          <span
            key={skill}
            className="border-[1.5px] border-border bg-muted px-1.5 py-[1px] font-mono text-[8px] font-bold uppercase tracking-[0.05em] text-muted-foreground"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update `src/app/_components/experience-section.tsx` to use the new component**

Add the import near the top (alongside `EXPERIENCES`):

```tsx
import { ExperienceCard } from "./experience-card";
```

Replace the body of the `.map` (the entire `<li>...</li>` return, currently lines 57–119) with:

```tsx
return (
  <li key={i} className="stagger-item relative">
    <span
      aria-hidden
      className="absolute left-[-30px] top-5 size-4 border-[2.5px] border-border shadow-[2px_2px_0_var(--border)]"
      style={{ background: style.color }}
    />
    <ExperienceCard experience={exp} style={style} isCurrent={isCurrent} />
  </li>
);
```

The only thing that stays inline in the `<li>` is the timeline dot (it's positioned relative to the `<li>`, not the card).

- [ ] **Step 3: Verify lint and types**

```bash
pnpm lint
pnpm exec tsc --noEmit
```

Expected: both pass.

- [ ] **Step 4: Visual smoke check**

```bash
pnpm dev
```

The Work Experience timeline should be visually identical to before. No interactions added yet.

- [ ] **Step 5: Commit**

```bash
git add src/app/_components/experience-card.tsx src/app/_components/experience-section.tsx
git commit -m "refactor(experience): extract ExperienceCard component"
```

---

## Task 3: Make the card clickable

**Files:**
- Modify: `src/app/_components/experience-card.tsx`
- Modify: `src/app/_components/experience-section.tsx`

- [ ] **Step 1: Add `onSelect` prop and interactive attributes to `experience-card.tsx`**

Update the props and the outer wrapper. New file contents:

```tsx
"use client";

import type { Experience, Style } from "@/data/experiences";

export function ExperienceCard({
  experience,
  style,
  isCurrent,
  onSelect,
}: {
  experience: Experience;
  style: Style;
  isCurrent: boolean;
  onSelect: () => void;
}) {
  const [location, type] = experience.location.split(",").map((s) => s.trim());

  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className="cursor-pointer border-2 border-border bg-card shadow-[4px_4px_0_var(--border)] transition-shadow hover:shadow-[6px_6px_0_var(--border)] focus-visible:outline-none focus-visible:shadow-[6px_6px_0_var(--border)]"
    >
      {/* (rest of the component body is unchanged from Task 2) */}
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
              {experience.company}
            </div>
            <div className="text-[13px] font-black uppercase tracking-tight">
              {experience.role}
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
            {experience.period}
          </span>
          <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground">
            {[location, type].filter(Boolean).join(" · ")}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 px-5 py-3">
        {experience.skills.map((skill) => (
          <span
            key={skill}
            className="border-[1.5px] border-border bg-muted px-1.5 py-[1px] font-mono text-[8px] font-bold uppercase tracking-[0.05em] text-muted-foreground"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update `experience-section.tsx` to pass `onSelect` (no-op for now)**

Update the `<ExperienceCard ... />` call to pass `onSelect`. We pass an empty handler temporarily so the wiring is in place; it gets replaced in Task 4.

```tsx
<ExperienceCard
  experience={exp}
  style={style}
  isCurrent={isCurrent}
  onSelect={() => {}}
/>
```

- [ ] **Step 3: Verify lint and types**

```bash
pnpm lint
pnpm exec tsc --noEmit
```

Expected: both pass.

- [ ] **Step 4: Visual / interaction smoke check**

```bash
pnpm dev
```

Hover a card — cursor should be a pointer. Tab through cards — each should receive focus (visible via the boosted shadow). Pressing Enter or Space does nothing visible yet.

- [ ] **Step 5: Commit**

```bash
git add src/app/_components/experience-card.tsx src/app/_components/experience-section.tsx
git commit -m "feat(experience): make ExperienceCard clickable and keyboard-focusable"
```

---

## Task 4: Build ExperienceDialog and wire it up

**Files:**
- Create: `src/app/_components/experience-dialog.tsx`
- Modify: `src/app/_components/experience-section.tsx`

- [ ] **Step 1: Create `src/app/_components/experience-dialog.tsx`**

```tsx
"use client";

import { useTranslation } from "react-i18next";
import { ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { EXPERIENCES, EXPERIENCE_STYLES, type Experience } from "@/data/experiences";

function ExperienceDialogInner({
  experience,
  onOpenChange,
}: {
  experience: Experience;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  const index = EXPERIENCES.indexOf(experience);
  const style = EXPERIENCE_STYLES[index] ?? EXPERIENCE_STYLES[0];
  const isCurrent = index === 0;
  const [location, type] = experience.location.split(",").map((s) => s.trim());
  const bullets = t(`experience.jobs.${index}.description`, {
    returnObjects: true,
  }) as string[];

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl gap-0 p-0 overflow-hidden">
        {/* Colored header strip — mirrors the inline timeline card */}
        <DialogHeader
          className="flex flex-col gap-3 border-b-2 border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
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
              <DialogDescription className="mb-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                {experience.company}
              </DialogDescription>
              <DialogTitle className="text-[14px] font-black uppercase tracking-tight">
                {experience.role}
              </DialogTitle>
            </div>
          </div>
          <div className="flex flex-col items-start gap-1 sm:items-end">
            {isCurrent && (
              <span className="border-[1.5px] border-border bg-primary px-1.5 py-[1px] font-mono text-[7px] font-bold uppercase tracking-[0.1em] text-white shadow-[1px_1px_0_var(--border)]">
                ● Current
              </span>
            )}
            <span className="border-2 border-border bg-card px-2 py-0.5 font-mono text-[9px] font-bold whitespace-nowrap shadow-[2px_2px_0_var(--border)]">
              {experience.period}
            </span>
            <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground">
              {[location, type].filter(Boolean).join(" · ")}
            </span>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="flex flex-col gap-4 px-5 py-4">
          <ul className="flex flex-col gap-2">
            {bullets.map((bullet, i) => (
              <li
                key={i}
                className="flex gap-2.5 text-[12px] leading-relaxed text-foreground sm:text-[13px]"
              >
                <span
                  aria-hidden
                  className="mt-[7px] inline-block size-1.5 shrink-0 bg-foreground"
                />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <Separator />

          <div className="flex flex-wrap gap-1.5">
            {experience.skills.map((skill) => (
              <span
                key={skill}
                className="border-[1.5px] border-border bg-muted px-1.5 py-[1px] font-mono text-[8px] font-bold uppercase tracking-[0.05em] text-muted-foreground"
              >
                {skill}
              </span>
            ))}
          </div>

          {experience.website && (
            <div className="flex">
              <Button
                size="sm"
                nativeButton={false}
                className="border-2 border-border bg-card font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-foreground shadow-[3px_3px_0_var(--border)] transition-all hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_var(--border)] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_var(--border)]"
                render={
                  <a
                    href={experience.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <ExternalLink className="size-3.5" />
                Visit Company
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ExperienceDialog({
  experience,
  onOpenChange,
}: {
  experience: Experience | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!experience) return null;
  return (
    <ExperienceDialogInner
      key={experience.company + experience.period}
      experience={experience}
      onOpenChange={onOpenChange}
    />
  );
}
```

Notes for the engineer:
- The component pattern (outer wrapper that returns `null` until an experience is selected, inner wrapper keyed so each open re-mounts cleanly) matches `project-dialog.tsx` line 161-177.
- `t("experience.jobs.{i}.description", { returnObjects: true })` returns the bullet array — same pattern used in `hero-section.tsx:11`. The `as string[]` cast is required because `t`'s default return type is `string`.
- `gap-0 p-0 overflow-hidden` on `DialogContent` overrides the default `gap-4 p-4` so the colored header strip can sit flush against the dialog edges.
- `DialogTitle` and `DialogDescription` are placed inside the colored strip (not visually hidden) — this satisfies base-ui's a11y requirement without an extra hidden element.
- The "Visit Company" button reuses the same brutalism shadow-and-lift styling pattern as `projects-section.tsx:84` (the "View All Projects" link).

- [ ] **Step 2: Wire the dialog into `experience-section.tsx`**

Add three things: state, dialog import, and render. Final file contents:

```tsx
"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSectionFade, usePerItemFade } from "@/hooks";
import { EXPERIENCES, EXPERIENCE_STYLES, type Experience } from "@/data/experiences";
import { ExperienceCard } from "./experience-card";
import { ExperienceDialog } from "./experience-dialog";

export function ExperienceSection() {
  const fadeRef = useSectionFade();
  const itemFadeRef = usePerItemFade();
  const { t } = useTranslation();
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);

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
          <span
            aria-hidden
            className="absolute left-2 top-0 bottom-0 w-[3px] bg-border opacity-10"
          />

          <ul className="flex flex-col gap-5">
            {EXPERIENCES.map((exp, i) => {
              const style = EXPERIENCE_STYLES[i] ?? EXPERIENCE_STYLES[0];
              const isCurrent = i === 0;
              return (
                <li key={i} className="stagger-item relative">
                  <span
                    aria-hidden
                    className="absolute left-[-30px] top-5 size-4 border-[2.5px] border-border shadow-[2px_2px_0_var(--border)]"
                    style={{ background: style.color }}
                  />
                  <ExperienceCard
                    experience={exp}
                    style={style}
                    isCurrent={isCurrent}
                    onSelect={() => setSelectedExperience(exp)}
                  />
                </li>
              );
            })}
          </ul>
        </div>

        <ExperienceDialog
          experience={selectedExperience}
          open={!!selectedExperience}
          onOpenChange={(open) => {
            if (!open) setSelectedExperience(null);
          }}
        />
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify lint and types**

```bash
pnpm lint
pnpm exec tsc --noEmit
```

Expected: both pass.

- [ ] **Step 4: Manual interaction check**

```bash
pnpm dev
```

In the Work Experience section:

1. Click the **MapTrack** card (top of timeline). Dialog opens with:
   - Colored header strip (primary color), `MT` initials block.
   - Company `MapTrack`, role `Product Software Engineer (Fullstack)`.
   - "● Current" pill, period badge `Jan 2025 — Present`, location `Remote · Full-time`.
   - 3 description bullets (the OpenAI/PDF, TanStack DB offline-first, GPS battery monitoring items from `en.json`).
   - Skills tags row.
   - "Visit Company ↗" button.
2. Press Esc or click the close X. Dialog closes; selection state clears.
3. Tab to the **Kodegiri** card and press Enter. Dialog opens with 4 bullets, no "Visit Company" button (no website set).
4. Switch the language toggle to ID, reopen any card. Bullets should render in Indonesian.
5. Re-confirm: all 6 cards open dialogs without errors. The Happy5 entries (rows 2 and 6) show different colors (secondary vs. orange) in both the timeline and the dialog header.

If any step misbehaves, debug before committing.

- [ ] **Step 5: Commit**

```bash
git add src/app/_components/experience-dialog.tsx src/app/_components/experience-section.tsx
git commit -m "feat(experience): add detail dialog with description bullets"
```

---

## Task 5: Final verification

- [ ] **Step 1: Run a production build**

```bash
pnpm build
```

Expected: build succeeds. No type errors, no missing module errors.

- [ ] **Step 2: Re-run lint**

```bash
pnpm lint
```

Expected: clean.

- [ ] **Step 3: Confirm git status is clean**

```bash
git status
```

Expected: working tree clean (or only the unrelated pre-existing modifications listed in the initial repo status).

No commit for Task 5 — it's verification only.

---

## Verification summary

After all tasks:

- 4 commits added (Tasks 1–4).
- 2 new files: `src/app/_components/experience-card.tsx`, `src/app/_components/experience-dialog.tsx`.
- 2 modified files: `src/data/experiences.ts`, `src/app/_components/experience-section.tsx`.
- Each timeline card opens a dialog showing description bullets, skills, and an optional company link.
- No translation file changes.
- No regressions in the timeline's visual appearance when dialogs are closed.
