# Slug-based Projects & Experiences Data — Design

## Problem

Adding, reordering, or removing one project or work experience currently requires editing 3–4 files at exactly matching array indices:

- **Projects** — visual data in `src/data/projects.ts`, locale strings in `src/locales/{en,id}.json` under `projects.items[N]`. Components look up locale strings by array index: `t(\`projects.items.${index}.summary\`)`.
- **Experiences** — entry in `EXPERIENCES[]` and a parallel entry in `EXPERIENCE_STYLES[]` (both in `src/data/experiences.ts`, coupled by index, see comment at `experiences.ts:72`), plus locale `experience.jobs[N].description` in both `en.json` and `id.json`. A `descriptionCount` field manually mirrors the locale array length and is guaranteed to drift.

The shared root cause: data for a single conceptual item is split across files and assembled by **array position**. There is no stable identifier per item.

## Goal

One project/experience = one entry per file, looked up by a stable `slug`. Adding, reordering, or deleting an item should never require keeping array indices in sync.

## Non-goals

- Migrating descriptions to MDX (deferred — descriptions stay as plain strings/arrays in locale JSON).
- Adding validation tooling (script to check slug consistency across files). TypeScript + manual verification is enough for the current scale (~8 projects, 6 experiences).
- Changing the blog pipeline at `src/lib/blogs/`.
- Restyling, reordering content, or any visual change.

## Design

### Data shape — `src/data/projects.ts`

Add a `slug` field. Everything else unchanged.

```ts
export interface Project {
  slug: string;
  title: string;
  images: string[];
  techStack: string[];
  liveUrl?: string;
  repoUrl?: string;
  gradient: string;
}
```

Slugs:
`maptrack`, `english-ai-interview`, `shopbot-assistant`, `echo-test`, `happy5`, `expense-tracker`, `gomovies`, `journal`.

### Data shape — `src/data/experiences.ts`

Add `slug`, inline `style`, drop `descriptionCount`, delete `EXPERIENCE_STYLES`.

```ts
export interface ExperienceStyle {
  color: string;
  initials: string;
  lightBg: string;
  isLightInitials?: boolean;
}

export interface Experience {
  slug: string;
  role: string;
  company: string;
  location: string;
  period: string;
  skills: string[];
  website?: string;
  style: ExperienceStyle;
}
```

Slugs (Happy5 appears twice, so they must be distinguished):
`maptrack-fullstack`, `happy5-fullstack`, `kodegiri`, `rakamin`, `smarteschool`, `happy5-intern`.

`descriptionCount` is removed. A grep confirmed it is only declared and assigned inside `src/data/experiences.ts` and has no consumers, so deletion is safe.

### Locale shape — `src/locales/{en,id}.json`

`projects.items` and `experience.jobs` change from **arrays** to **objects keyed by slug**.

Before:

```json
"projects": { "items": [ { "summary": "...", "description": "..." }, ... ] }
"experience": { "jobs": [ { "description": [ "...", "..." ] }, ... ] }
```

After:

```json
"projects": {
  "items": {
    "maptrack": { "summary": "...", "description": "..." },
    "english-ai-interview": { "summary": "...", "description": "..." }
  }
}
"experience": {
  "jobs": {
    "maptrack-fullstack": { "description": [ "...", "..." ] },
    "happy5-fullstack": { "description": [ "...", "..." ] }
  }
}
```

The slug set in `en.json` must match `id.json` must match the data files. Mismatches are caught at runtime by missing-translation behavior in i18next; no extra tooling is added.

### Component changes

| File | Change |
| --- | --- |
| `src/app/_components/project-card.tsx` | Replace index-based i18n key with slug-based: use `project.slug` in the `projects.items.<key>.summary` lookup. Accept the project object as a prop instead of (or in addition to) `index`. |
| `src/app/_components/project-dialog.tsx` | Same pattern for `summary` and `description`. |
| `src/app/_components/projects-section.tsx` | Pass the project object (which already includes slug) to children; drop index threading where possible. |
| `src/app/projects/_components/all-projects.tsx` | Same — use `project.slug` for locale lookups. |
| `src/app/_components/experience-section.tsx` | Drop `EXPERIENCE_STYLES[i]` lookup; use `exp.style`. Pass slug instead of index. |
| `src/app/_components/experience-dialog.tsx` | Drop `EXPERIENCES.indexOf(experience)`; use `experience.style` and `experience.jobs.<experience.slug>.description` as the i18n key. |

### Verification

- `pnpm tsc --noEmit` clean.
- Dev server: visit home (projects section + experience section), `/projects`, open a project dialog, open an experience dialog. Toggle EN ↔ ID and confirm strings render in both.
- Specifically check the two Happy5 experience entries — they must keep distinct colors and distinct description bullets (this is the case the old positional system was most fragile around).

### Out of scope (will not change)

- `src/data/tech-stack.ts`, `src/data/contacts.ts`, `src/data/navigation.ts` — not part of this refactor.
- Any visual/copy edits.
- Locale loading mechanism in `src/lib/i18n.ts`.

## Risks

- **Locale key drift** — adding a new project but forgetting one locale file. Surfaced as missing-translation at runtime; acceptable trade-off vs. building a validator.
- **Two Happy5 experiences sharing a company** — addressed by distinct slugs (`happy5-fullstack`, `happy5-intern`); style is now inlined per entry, so they cannot accidentally share styling.
- **Existing `descriptionCount` references** — implementation must grep for it before deleting; if any consumer remains, replace with derived length.
