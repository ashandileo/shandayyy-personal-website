# Bilingual Markdown Blog — Design Spec

**Date:** 2026-04-28
**Owner:** Ashandi Leonadi
**Status:** Approved (pending implementation)

## Goal

Add a `/blogs` section to the personal website where the author can publish notes about things they learn. Content must be written as plain markdown files (no database, no CMS). The blog must follow the existing site's bilingual model (EN + ID) and visual style (neo-brutalist, thick borders, neon green accent).

## Non-goals

- No comments, likes, reactions, or any form of reader interaction
- No tag pages, archive pages, RSS feed, or pagination (single list, all posts shown)
- No drafts toggle in frontmatter (unfinished posts stay on a branch or are deleted)
- No MDX (no JSX in markdown) — keep content portable plain markdown
- No search

## User decisions captured during brainstorming

| Question | Decision |
|---|---|
| Bilingual model | Full bilingual — each post has EN and ID versions |
| Frontmatter scope | Standard set (title, date, summary, tags) — `coverImage` later removed |
| Syntax highlighting | Yes, via Shiki |
| List page UI | Simple stacked list (no cover images) with tag filter chips |
| Per-post features | Reading time displayed; no TOC, no related posts |
| URL path | `/blogs` (plural) |
| Navbar position | Between Resume and Contact: `Home, Experience, Projects, Resume, Blog, Contact` |
| Technical approach | Server Components compile markdown at build; pass HTML to small Client Component for i18n switching |
| Fallback for missing translation | Always show in list with "EN only" / "ID only" badge; on post page, fall back to available language with a notice |
| Sample post images | Skip — text + code block only |

## Architecture

### File layout

```
content/
  blogs/
    <slug>.en.md
    <slug>.id.md
src/
  app/
    blogs/
      page.tsx                  # Server Component → list page
      [slug]/
        page.tsx                # Server Component → post page
      _components/
        blog-list.tsx           # Client Component (filter + i18n switching)
        blog-post.tsx           # Client Component (HTML render + i18n switching)
  lib/
    blogs/
      index.ts                  # public API: getAllPosts, getPostBySlug
      read.ts                   # filesystem reading
      compile.ts                # remark + rehype + shiki pipeline
      types.ts                  # PostMeta, PostContent, LocalizedPost
  data/
    navigation.ts               # add { labelKey: "nav.blog", href: "/blogs", sectionId: null }
  locales/
    en.json                     # add nav.blog and blog.* keys
    id.json                     # add nav.blog and blog.* keys
```

### Slug convention

- Slug is the filename without the language suffix and `.md` extension.
- Example: `setting-up-a-bilingual-blog.en.md` and `setting-up-a-bilingual-blog.id.md` → slug `setting-up-a-bilingual-blog`.
- File name pattern is enforced: `<slug>.<en|id>.md`. Any other pattern is ignored with a build warning.

### Server / client split

- `src/lib/blogs/*` runs server-only — uses `fs` and the markdown pipeline. Never imported into a Client Component.
- `app/blogs/page.tsx` is a Server Component. It calls `getAllPosts()`, which returns an array of `LocalizedPost` objects (each containing both EN and ID metadata where available). It passes that array to `<BlogList>`.
- `app/blogs/[slug]/page.tsx` is a Server Component. It calls `getPostBySlug(slug)` for both EN and ID, getting back compiled HTML for each language. It passes both to `<BlogPost>`.
- Both `[slug]` pages use `generateStaticParams` so every post is statically pre-rendered at build time.
- `<BlogList>` and `<BlogPost>` are Client Components that read `i18n.language` via `useTranslation()` and render the EN or ID variant accordingly.

### Markdown compilation pipeline

```
.md file
  → gray-matter (extract frontmatter + body)
  → remark
  → remark-gfm (tables, task lists, strikethrough)
  → remark-rehype
  → rehype-pretty-code (Shiki syntax highlighting)
  → rehype-stringify
  → HTML string
```

Reading time is computed from the raw markdown body (before HTML conversion) using the `reading-time` package and stored on `PostMeta`.

### Frontmatter schema

```yaml
---
title: "Setting up a bilingual markdown blog"
date: "2026-04-28"
summary: "How I built this blog without a database, using markdown files."
tags: ["nextjs", "blog", "lessons"]
---
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | Display title |
| `date` | string (ISO `YYYY-MM-DD`) | yes | Used for sort and display |
| `summary` | string | yes | One-line description shown in list and as `<meta name="description">` |
| `tags` | string[] | yes | Empty array allowed (`tags: []`); used for filter chips |

A missing or malformed required field causes a build error with a message identifying the file and field. This prevents broken posts from reaching production.

## Bilingual handling

A post can exist as EN-only, ID-only, or both. The internal model is:

```ts
type LocalizedPost = {
  slug: string;
  en?: { meta: PostMeta; html: string };  // html only set on detail fetch
  id?: { meta: PostMeta; html: string };
};
```

### List page behavior

- Every post appears in the list regardless of which language(s) exist.
- Each post item renders in the user's currently-selected language if available, otherwise in the other language with a small `EN only` or `ID only` badge.
- Tags shown for filtering are aggregated across all available language variants of all posts.

### Post page behavior

- If both EN and ID exist, the user's selected language is rendered. Toggling language toggles the rendered HTML in place (no navigation).
- If only one language exists, that version is always rendered. When the user has selected the missing language, a thin notice appears at the top of the article:
  - English fallback: "Indonesian version not available yet. Showing English."
  - Indonesian fallback: "Versi Indonesia belum tersedia. Menampilkan English."

## UI design

The blog matches the existing visual style of the site (see `src/app/_components/project-card.tsx`, `src/app/_components/projects-section.tsx` for reference):

- Thick borders (`border-[1.5px] border-border`)
- Hard offset shadows (`shadow-[2px_2px_0_var(--border)]`)
- Mono font for metadata (date, tags)
- Neon green primary accent for active states

### List page (`/blogs`)

```
[BADGE] WRITING
Blog
Notes, lessons, and things I'm learning.

[ All ] [ nextjs ] [ react ] [ career ]   ← tag filter chips, single-select

──────────────────────────────────────────
2026-04-28                    #nextjs #blog
Setting up a bilingual markdown blog
Catatan singkat soal cara saya bikin blog…
──────────────────────────────────────────
2026-04-15                    #react
Why I switched to TanStack Query
Lorem ipsum summary text here…
──────────────────────────────────────────
```

- Single-column stacked list with horizontal dividers.
- Sort by `date` descending (newest first).
- Tag chips at top: clicking a tag filters the list to posts containing that tag. `All` resets. Single-select behavior.
- Each row clickable, navigates to `/blogs/[slug]`.
- "EN only" / "ID only" badge appears next to the date when relevant.

### Post page (`/blogs/[slug]`)

```
← Back to all posts

Title (large heading)
2026-04-28 · 5 min read · #nextjs #blog

──────────────────

(rendered markdown — typography styled,
 code blocks via Shiki, h2/h3 headings,
 lists, links, blockquotes, etc.)
```

- Container `max-w-3xl` for readability (matches resume page width).
- "← Back to all posts" link to `/blogs` at the top.
- Reading time auto-calculated and displayed alongside date and tags.
- Markdown content styled with custom Tailwind classes that match the site's neo-brutalist aesthetic (manual styling, not the `prose` plugin, to keep visual consistency).
- Shiki theme: pick one light + one dark theme from Shiki's bundled themes so the code blocks switch with the site's existing dark mode.

## Internationalization

Add to `src/locales/en.json` and `src/locales/id.json` under a new `blog` namespace:

```json
{
  "nav": { "blog": "Blog" },
  "blog": {
    "badge": "Writing",
    "title": "Blog",
    "subtitle": "Notes, lessons, and things I'm learning.",
    "allTag": "All",
    "readingTime": "{{minutes}} min read",
    "backToList": "Back to all posts",
    "enOnly": "EN only",
    "idOnly": "ID only",
    "fallbackEn": "Indonesian version not available yet. Showing English.",
    "fallbackId": "Versi Indonesia belum tersedia. Menampilkan English.",
    "empty": "No posts yet."
  }
}
```

Indonesian values translated appropriately.

Add to `src/data/navigation.ts`:
```ts
{ labelKey: "nav.blog", href: "/blogs", sectionId: null }
```
Inserted between the Resume and Contact entries.

## Dependencies

```
gray-matter           # frontmatter parsing
remark                # markdown parser
remark-gfm            # GFM extension
remark-rehype         # markdown AST → HTML AST
rehype-pretty-code    # Shiki-based code highlighting
rehype-stringify      # HTML AST → string
shiki                 # peer of rehype-pretty-code
reading-time          # auto reading time
```

All are stable, mature, and widely used in Next.js blog setups (including Vercel's own examples).

## Metadata / SEO

Each post page sets:

- `title`: the post's frontmatter `title`
- `description`: the post's frontmatter `summary`
- `openGraph` + `twitter` from the same fields
- `alternates.canonical`: `https://ashandileonadi.vercel.app/blogs/<slug>`

The list page uses static metadata (`title: "Blog"`, generic description).

`src/app/sitemap.ts` is updated to include `/blogs` and every post URL `/blogs/<slug>`.

## Sample content (delivered with implementation)

One sample post in both EN and ID, slug `setting-up-a-bilingual-markdown-blog`. Topic: a brief author's note explaining how this blog was built (Next.js 16 + markdown + the existing i18n pipeline) and why markdown was chosen over a CMS. Demonstrates: H2/H3 headings, paragraphs with **bold**, *italic*, inline `code`, bullet list, numbered list, a TypeScript code block (to verify Shiki), an external link, and a blockquote. No images.

## Build-time validation

If any of these conditions are detected during build, fail with a clear error:

- A `.md` file in `content/blogs/` does not match `<slug>.<en|id>.md`
- A required frontmatter field is missing or empty
- A `date` field is not a valid ISO date string
- A slug has a `.en.md` and a `.id.md` whose `tags` field is malformed (must be array of strings)

A slug existing in only one language is **not** an error — it's a supported case (handled in UI as documented).

## Out of scope (explicit)

These were considered and rejected for this iteration:

- Drafts (`draft: true` flag) — defer until needed
- Cover images per post — removed during brainstorming for simplicity
- Tag pages (`/blogs/tag/[tag]`) — single list with chips is enough
- RSS feed — easy to add later if requested
- Per-post images / image co-location pattern — postpone until first post needs an image
- MDX / custom React components inside posts — use plain markdown only
- Pagination — keep single-page list; revisit if post count grows large
- Comments / reactions — out of scope, never planned

## Risks / open questions

- **Next.js 16 API drift**: `AGENTS.md` warns the project is on a Next.js version with breaking changes versus typical training data. Implementation must consult `node_modules/next/dist/docs/` to confirm the exact `generateStaticParams`, `generateMetadata`, and dynamic `params` signatures used here.
- **Shiki bundle size**: Shiki ships full-language grammars; if final bundle grows uncomfortably, switch to lazy-loaded subset or `bright`. Defer until measured.
