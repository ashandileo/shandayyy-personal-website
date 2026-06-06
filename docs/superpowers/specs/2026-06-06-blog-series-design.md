# Blog Series Feature — Design Spec

**Date:** 2026-06-06  
**Context:** User is following the course "Mastering Microservice Golang: Online Soccer Field Booking" and wants to document daily learning progress in the existing blog system.

---

## Goal

Add a **series** concept to the blog so posts can be grouped into an ordered sequence (Day 1, Day 2, …). The first series is daily notes from the Golang microservice course. The feature must not break existing non-series posts.

---

## 1. Frontmatter Schema

Two optional fields added to post markdown frontmatter:

```yaml
series: "mastering-golang-microservice"   # string slug, identifies the series
seriesDay: 1                               # integer, order within the series
```

Posts without these fields continue to work exactly as before. Both fields must be present together — a post with only one of them is treated as a regular post.

---

## 2. Data Layer

### Types (`src/lib/blogs/types.ts`)

`PostMeta` gains two optional fields:

```ts
series?: string
seriesDay?: number
```

### Read (`src/lib/blogs/read.ts`)

Parse `series` and `seriesDay` from frontmatter. Both are optional; if present, validate that `series` is a non-empty string and `seriesDay` is a positive integer. Ignore gracefully if only one is provided.

### Lib (`src/lib/blogs/index.ts`)

Three new exported functions:

- **`getAllSeries(): SeriesMeta[]`** — scans all posts, collects unique series slugs, returns `{ slug, totalDays }` for each, sorted alphabetically by slug.
- **`getSeriesPosts(seriesSlug: string): LocalizedPost[]`** — returns all posts belonging to the series, sorted ascending by `seriesDay`.
- **`getAdjacentSeriesPosts(currentSlug: string, seriesSlug: string): { prev: LocalizedPost | null; next: LocalizedPost | null }`** — returns the previous and next posts in the series relative to `currentSlug`, for bottom-of-post navigation.

New type:

```ts
export interface SeriesMeta {
  slug: string;
  totalDays: number;
}
```

---

## 3. Pages & Routes

### New: `/blogs/series/[series]`

**File:** `src/app/blogs/series/[series]/page.tsx`  
**Static params:** generated from `getAllSeries()`

Layout:
```
SERIES · MASTERING GOLANG MICROSERVICE
Learning Go From Scratch
12 days

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DAY 1   Variables & Types          2026-06-06
DAY 2   Functions & Control Flow   2026-06-07
DAY 3   Structs & Interfaces       2026-06-08
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Each row links to `/blogs/[slug]`. Rows are sorted ascending by `seriesDay`. The page shows the preferred language per the user's locale setting (same fallback logic as existing blog post page).

**Component:** `src/app/blogs/series/[series]/_components/series-posts.tsx` — client component, handles locale for display.

---

## 4. Updates to Existing Components

### Blog List (`src/app/blogs/_components/blog-list.tsx`)

If any series exist, render a **"Series" section** above the individual post list:

```
SERIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 Mastering Microservice Golang   12 days  →
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

POSTS
DAY 1 — Variables & Types ...
Setting up a bilingual blog ...
```

Each series card links to `/blogs/series/[slug]`. The existing tag filter applies only to individual posts — the series section is always visible.

Posts that belong to a series are **excluded from the individual post list** on `/blogs`. They are only accessible via the series page. This keeps the main list clean and avoids duplicating entries.

### Blog Post (`src/app/blogs/_components/blog-post.tsx`)

If the displayed post has `series` + `seriesDay` in its meta, render a **prev/next navigation bar** at the bottom of the article:

```
← DAY 1                              DAY 3 →
  Variables & Types          Structs & Interfaces
```

- Left button: previous day (null if Day 1)
- Right button: next day (null if latest day)
- Each button links to `/blogs/[slug]`
- Also add a small "Back to series" link above the prev/next, linking to `/blogs/series/[seriesSlug]`

---

## 5. i18n

Add under the `"blog"` key in both `src/locales/en.json` and `src/locales/id.json`:

| Key | EN | ID |
|-----|----|----|
| `blog.series` | `Series` | `Seri` |
| `blog.seriesDay` | `Day {{day}}` | `Hari {{day}}` |
| `blog.seriesDays` | `{{count}} days` | `{{count}} hari` |
| `blog.backToSeries` | `Back to series` | `Kembali ke seri` |
| `blog.prevDay` | `← Day {{day}}` | `← Hari {{day}}` |
| `blog.nextDay` | `Day {{day}} →` | `Hari {{day}} →` |

---

## 6. First Content File

Create `content/blogs/golang-microservice-day-1.id.md` as a template the user fills in:

```yaml
---
title: "Day 1 — ..."
date: "2026-06-06"
summary: "..."
tags: ["golang", "microservice"]
series: "mastering-golang-microservice"
seriesDay: 1
---

(isi konten di sini)
```

Only `.id.md` is created — English fallback is handled by the existing system.

---

## 7. Out of Scope

- No `/blogs/series` index page listing all series (not needed until there are multiple series)
- No series description/cover image (can be added later)
- No progress indicator / completion tracking
- No RSS feed changes
