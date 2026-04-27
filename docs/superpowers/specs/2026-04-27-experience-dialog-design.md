# Experience Section: Click-to-Open Detail Dialog

## Context

The Work Experience section currently renders a brutalism-styled timeline (`src/app/_components/experience-section.tsx`) with one card per role. Each card shows the company initials, role, period, location, and tech-stack tags.

Description bullets for each role already exist in `src/locales/en.json` and `src/locales/id.json` under `experience.jobs[i].description` (and `Experience.descriptionCount` in `src/data/experiences.ts` mirrors the bullet counts), but they are not rendered anywhere in the UI — the renderer was dropped during the brutalism refactor.

## Goal

Restore the description bullets, surfaced through a detail dialog opened by clicking a timeline card. The pattern mirrors the existing project card → project dialog flow.

## Non-Goals

- No changes to the timeline card's inline visual content (role/period/location/skills stay the only inline data).
- No image/screenshot carousel for experiences (no per-company assets).
- No translation file changes — bullets already exist in both locales.
- No new top-level layout or navigation work.

## Inline card behavior

The card stays visually identical to today. We only add interactivity:

- `cursor-pointer`, `role="button"`, `tabIndex={0}`
- `onClick` opens the dialog; `onKeyDown` opens on Enter or Space
- The existing hover shadow lift (`hover:shadow-[6px_6px_0_var(--border)]`) is the affordance — matches `ProjectCard`

No "Read more" label is added.

## Dialog (Option C: colored header strip)

The dialog reuses the same `STYLES[i]` (color, `lightBg`, `initials`, `isLightInitials`) the timeline card uses, so opening the dialog feels like a continuation of the card.

Structure:

```
DialogContent (sm:max-w-2xl, brutalism: border-2 border-border, sharp corners)
├─ Colored header strip (background: STYLES[i].lightBg, border-b-2 border-border)
│   ├─ Initials block (size-11, STYLES[i].color, border-2, shadow-[2px_2px_0_…])
│   ├─ DialogTitle = company (font-black uppercase, tracking-tight)
│   ├─ DialogDescription = role (mono uppercase, muted)
│   └─ Right side:
│       - "● Current" pill (only if i === 0)
│       - Period badge (border-2, mono, shadow)
│       - Location · type (mono uppercase muted)
│
├─ Body (px-5 py-4 space-y-4)
│   ├─ Description bullets <ul> — read from t("experience.jobs.{i}.description", { returnObjects: true })
│   │   - Bullet marker: brutalism square (size-1.5 bg-foreground) instead of native disc
│   │   - text-[12px] sm:text-[13px] leading-relaxed
│   │
│   ├─ <Separator />
│   │
│   ├─ Skills tags row — same mono uppercase style used in the timeline card
│   │
│   └─ Optional "Visit Company ↗" button (only if website is set)
│       - Renders inside the body, after the skills row
│       - Brutalism button: border-2, shadow-[3px_3px_0_…], hover lift -1px
```

`DialogTitle` and `DialogDescription` are visible inside the colored strip (no `VisuallyHidden` wrappers). They carry the a11y semantics that the Radix Dialog requires.

## Data changes

### `src/data/experiences.ts`

1. Add optional field on `Experience`:
   ```ts
   website?: string;
   ```
2. Populate `website` on entries we already have URLs for (sourced from `src/data/projects.ts`):
   - MapTrack → `https://maptrack.com`
   - Happy5 (both entries) → `https://www.happy5.co/`
   Other entries leave `website` undefined; the dialog button does not render.
3. Export `STYLES` (currently inline in `experience-section.tsx`) so both card and dialog read from one source. `STYLES` and its `Style` type move into `experiences.ts` next to the data they describe.

### Translations

No changes. Both `en.json` and `id.json` already have `experience.jobs[i].description` arrays with matching counts.

## Component changes

### `src/app/_components/experience-card.tsx` — new

Lifts the existing per-item card markup out of `experience-section.tsx`. Props:

```ts
{
  experience: Experience;
  index: number;
  style: Style;
  isCurrent: boolean;
  onSelect: () => void;
}
```

Adds `cursor-pointer`, `role="button"`, `tabIndex`, and key/click handlers. Visuals are identical to the current per-item markup.

### `src/app/_components/experience-dialog.tsx` — new

Modeled on `project-dialog.tsx`. Outer wrapper accepts `experience: Experience | null` and only mounts the inner content when an experience is selected (so each open animation re-keys cleanly). Inner content reads bullets via `useTranslation`:

```ts
const bullets = t(`experience.jobs.${index}.description`, { returnObjects: true }) as string[];
```

Renders the structure described above.

### `src/app/_components/experience-section.tsx`

- Removes the inline `STYLES` array (now imported from `@/data/experiences`).
- Adds `selectedExperience` state.
- Replaces the inline `<li>` body with `<ExperienceCard … />`.
- Renders `<ExperienceDialog … />` at the bottom, mirroring the projects-section pattern.

### `src/app/_components/index.ts`

Add exports for `ExperienceCard` and `ExperienceDialog` for symmetry with the existing project exports.

## Accessibility

- `DialogTitle` / `DialogDescription` are present and visible (in the colored strip). Radix Dialog will not warn.
- Card uses `role="button"`, `tabIndex={0}`, and handles Enter/Space — same pattern as `ProjectCard`.
- The decorative timeline dot keeps `aria-hidden`.

## Out of scope / future work

- Filling in `website` URLs for Kodegiri, Rakamin Academy, and Smarteschool — left for the user to provide.
- Inline preview of bullets on the timeline card (rejected during brainstorming — keeps the timeline scannable).
