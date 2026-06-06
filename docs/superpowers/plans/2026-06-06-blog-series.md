# Blog Series Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an ordered "series" grouping to the blog so daily Golang course notes can be published as Day 1, Day 2, etc., accessible at `/blogs/series/mastering-golang-microservice`.

**Architecture:** Two optional frontmatter fields (`series`, `seriesDay`) identify posts belonging to a series. New lib functions (`getAllSeries`, `getSeriesPosts`, `getAdjacentSeriesPosts`) drive a new series route and updates to the existing list and post components. Series posts are excluded from the main `/blogs` post list and only accessible through the series page.

**Tech Stack:** Next.js 15 App Router (server + client components), TypeScript, gray-matter (frontmatter parsing), react-i18next (translations), Tailwind CSS

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/lib/blogs/types.ts` | Modify | Add `series?`, `seriesDay?` to `PostMeta`; add `SeriesMeta` interface |
| `src/lib/blogs/read.ts` | Modify | Parse `series` + `seriesDay` from frontmatter |
| `src/lib/blogs/index.ts` | Modify | Add `getAllSeries`, `getSeriesPosts`, `getAdjacentSeriesPosts`; update `getAllPosts` to exclude series posts; export `SeriesMeta` |
| `src/locales/en.json` | Modify | Add series i18n keys under `blog` |
| `src/locales/id.json` | Modify | Add series i18n keys under `blog` |
| `src/app/blogs/page.tsx` | Modify | Also call `getAllSeries()` and pass `series` prop to `BlogList` |
| `src/app/blogs/_components/blog-list.tsx` | Modify | Accept `series` prop; render series section above post list |
| `src/app/blogs/[slug]/page.tsx` | Modify | Compute `adjacent` via `getAdjacentSeriesPosts` and pass to `BlogPost` |
| `src/app/blogs/_components/blog-post.tsx` | Modify | Accept `adjacent` prop; render prev/next nav + back-to-series link |
| `src/app/blogs/series/[series]/page.tsx` | Create | Server component for series page; generates static params from `getAllSeries()` |
| `src/app/blogs/series/[series]/_components/series-posts.tsx` | Create | Client component; locale-aware day list |
| `content/blogs/golang-microservice-day-1.id.md` | Create | First content file (template for user) |

---

### Task 1: Extend types and parse frontmatter

**Files:**
- Modify: `src/lib/blogs/types.ts`
- Modify: `src/lib/blogs/read.ts`

- [ ] **Step 1.1 — Update `PostMeta` and add `SeriesMeta`**

Replace the full contents of `src/lib/blogs/types.ts` with:

```ts
export type PostLang = "en" | "id";

export interface PostMeta {
  slug: string;
  lang: PostLang;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  readingMinutes: number;
  series?: string;
  seriesDay?: number;
}

export interface PostContent {
  meta: PostMeta;
  html?: string;
}

export interface LocalizedPost {
  slug: string;
  en?: PostContent;
  id?: PostContent;
}

export interface SeriesMeta {
  slug: string;
  totalDays: number;
}
```

- [ ] **Step 1.2 — Parse `series` + `seriesDay` in `readPostFile`**

In `src/lib/blogs/read.ts`, add the parsing block after the existing `tags` validation (after line 56) and include the new fields in the returned `meta`. Replace the full file with:

```ts
import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { PostLang, PostMeta } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content", "blogs");
const FILENAME_RE = /^(.+)\.(en|id)\.md$/;

export interface PostFile {
  slug: string;
  lang: PostLang;
  meta: PostMeta;
  body: string;
}

export interface PostFileRef {
  slug: string;
  lang: PostLang;
  filename: string;
}

export function listPostFiles(): PostFileRef[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const entries: PostFileRef[] = [];
  for (const filename of fs.readdirSync(CONTENT_DIR)) {
    const match = FILENAME_RE.exec(filename);
    if (!match) continue;
    const [, slug, lang] = match;
    entries.push({ slug, lang: lang as PostLang, filename });
  }
  return entries;
}

export function readPostFile(slug: string, lang: PostLang): PostFile | null {
  const filename = `${slug}.${lang}.md`;
  const filepath = path.join(CONTENT_DIR, filename);
  if (!fs.existsSync(filepath)) return null;

  const raw = fs.readFileSync(filepath, "utf8");
  const parsed = matter(raw);
  const data = parsed.data as Record<string, unknown>;

  if (typeof data.title !== "string" || !data.title.trim()) {
    throw new Error(`[blogs] ${filename}: frontmatter "title" is required and must be a non-empty string`);
  }
  if (typeof data.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    throw new Error(`[blogs] ${filename}: frontmatter "date" is required and must be a quoted ISO string in YYYY-MM-DD format`);
  }
  if (typeof data.summary !== "string" || !data.summary.trim()) {
    throw new Error(`[blogs] ${filename}: frontmatter "summary" is required and must be a non-empty string`);
  }
  if (!Array.isArray(data.tags) || !data.tags.every((t) => typeof t === "string")) {
    throw new Error(`[blogs] ${filename}: frontmatter "tags" is required and must be an array of strings`);
  }

  let series: string | undefined;
  let seriesDay: number | undefined;
  if (
    typeof data.series === "string" &&
    data.series.trim() &&
    typeof data.seriesDay === "number" &&
    Number.isInteger(data.seriesDay) &&
    data.seriesDay > 0
  ) {
    series = data.series.trim();
    seriesDay = data.seriesDay;
  }

  const stats = readingTime(parsed.content);

  return {
    slug,
    lang,
    body: parsed.content,
    meta: {
      slug,
      lang,
      title: data.title,
      date: data.date,
      summary: data.summary,
      tags: data.tags,
      readingMinutes: Math.max(1, Math.round(stats.minutes)),
      ...(series !== undefined ? { series, seriesDay } : {}),
    },
  };
}
```

- [ ] **Step 1.3 — Verify build passes**

```bash
pnpm build
```

Expected: build completes with no TypeScript errors.

- [ ] **Step 1.4 — Commit**

```bash
git add src/lib/blogs/types.ts src/lib/blogs/read.ts
git commit -m "feat(blogs): add series/seriesDay to PostMeta and read layer"
```

---

### Task 2: Add series lib functions and update getAllPosts

**Files:**
- Modify: `src/lib/blogs/index.ts`

- [ ] **Step 2.1 — Replace `src/lib/blogs/index.ts`**

```ts
import "server-only";
import { listPostFiles, readPostFile } from "./read";
import { compileMarkdown } from "./compile";
import type { LocalizedPost, PostLang, SeriesMeta } from "./types";

export type { PostMeta, PostContent, LocalizedPost, PostLang, SeriesMeta } from "./types";

interface SlugEntry {
  slug: string;
  langs: PostLang[];
}

function groupBySlug(): Map<string, SlugEntry> {
  const grouped = new Map<string, SlugEntry>();
  for (const file of listPostFiles()) {
    const existing = grouped.get(file.slug) ?? { slug: file.slug, langs: [] };
    existing.langs.push(file.lang);
    grouped.set(file.slug, existing);
  }
  return grouped;
}

function bestDate(post: LocalizedPost): string {
  return post.en?.meta.date ?? post.id?.meta.date ?? "";
}

export function getAllSlugs(): string[] {
  return [...groupBySlug().keys()];
}

export function getAllPosts(): LocalizedPost[] {
  const posts: LocalizedPost[] = [];
  for (const { slug, langs } of groupBySlug().values()) {
    const post: LocalizedPost = { slug };
    for (const lang of langs) {
      const file = readPostFile(slug, lang);
      if (file) post[lang] = { meta: file.meta };
    }
    const meta = post.en?.meta ?? post.id?.meta;
    if (meta?.series && meta.seriesDay != null) continue;
    posts.push(post);
  }
  posts.sort((a, b) => bestDate(b).localeCompare(bestDate(a)));
  return posts;
}

export function getAllSeries(): SeriesMeta[] {
  const seriesMap = new Map<string, Set<string>>();
  for (const { slug, langs } of groupBySlug().values()) {
    for (const lang of langs) {
      const file = readPostFile(slug, lang);
      if (!file?.meta.series || file.meta.seriesDay == null) continue;
      const slugSet = seriesMap.get(file.meta.series) ?? new Set<string>();
      slugSet.add(slug);
      seriesMap.set(file.meta.series, slugSet);
      break;
    }
  }
  return [...seriesMap.entries()]
    .map(([seriesSlug, slugSet]) => ({ slug: seriesSlug, totalDays: slugSet.size }))
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

export function getSeriesPosts(seriesSlug: string): LocalizedPost[] {
  const posts: LocalizedPost[] = [];
  for (const { slug, langs } of groupBySlug().values()) {
    const post: LocalizedPost = { slug };
    let belongsToSeries = false;
    for (const lang of langs) {
      const file = readPostFile(slug, lang);
      if (!file) continue;
      post[lang] = { meta: file.meta };
      if (file.meta.series === seriesSlug && file.meta.seriesDay != null) {
        belongsToSeries = true;
      }
    }
    if (belongsToSeries) posts.push(post);
  }
  posts.sort((a, b) => {
    const dayA = a.en?.meta.seriesDay ?? a.id?.meta.seriesDay ?? 0;
    const dayB = b.en?.meta.seriesDay ?? b.id?.meta.seriesDay ?? 0;
    return dayA - dayB;
  });
  return posts;
}

export function getAdjacentSeriesPosts(
  currentSlug: string,
  seriesSlug: string
): { prev: LocalizedPost | null; next: LocalizedPost | null } {
  const posts = getSeriesPosts(seriesSlug);
  const idx = posts.findIndex((p) => p.slug === currentSlug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? posts[idx - 1] : null,
    next: idx < posts.length - 1 ? posts[idx + 1] : null,
  };
}

export async function getPostBySlug(slug: string): Promise<LocalizedPost | null> {
  const entry = groupBySlug().get(slug);
  if (!entry) return null;
  const post: LocalizedPost = { slug };
  for (const lang of entry.langs) {
    const file = readPostFile(slug, lang);
    if (!file) continue;
    const html = await compileMarkdown(file.body);
    post[lang] = { meta: file.meta, html };
  }
  return post;
}
```

- [ ] **Step 2.2 — Verify build**

```bash
pnpm build
```

Expected: build completes. `getAllSeries`, `getSeriesPosts`, `getAdjacentSeriesPosts` are now available. `SeriesMeta` is exported.

- [ ] **Step 2.3 — Commit**

```bash
git add src/lib/blogs/index.ts
git commit -m "feat(blogs): add getAllSeries, getSeriesPosts, getAdjacentSeriesPosts"
```

---

### Task 3: i18n strings

**Files:**
- Modify: `src/locales/en.json`
- Modify: `src/locales/id.json`

- [ ] **Step 3.1 — Add series keys to `en.json`**

Inside the `"blog"` object in `src/locales/en.json`, add these keys after `"empty"`:

```json
"series": "Series",
"seriesDay": "Day {{day}}",
"seriesDays": "{{count}} days",
"backToSeries": "Back to series",
"prevDay": "← Day {{day}}",
"nextDay": "Day {{day}} →"
```

The full `"blog"` section becomes:

```json
"blog": {
  "badge": "Writing",
  "title": "Blog",
  "subtitle": "Notes, lessons, and things I'm learning.",
  "allTag": "All",
  "readingTime": "{{minutes}} min read",
  "backToList": "Back to all posts",
  "enOnly": "EN only",
  "idOnly": "ID only",
  "fallbackToEn": "Indonesian version not available yet. Showing English.",
  "fallbackToId": "English version not available yet. Showing Indonesian.",
  "empty": "No posts yet.",
  "series": "Series",
  "seriesDay": "Day {{day}}",
  "seriesDays": "{{count}} days",
  "backToSeries": "Back to series",
  "prevDay": "← Day {{day}}",
  "nextDay": "Day {{day}} →"
}
```

- [ ] **Step 3.2 — Add series keys to `id.json`**

Same location in `src/locales/id.json`:

```json
"blog": {
  "badge": "Tulisan",
  "title": "Blog",
  "subtitle": "Catatan, pelajaran, dan hal-hal yang saya pelajari.",
  "allTag": "Semua",
  "readingTime": "{{minutes}} menit baca",
  "backToList": "Kembali ke semua tulisan",
  "enOnly": "EN saja",
  "idOnly": "ID saja",
  "fallbackToEn": "Versi Indonesia belum tersedia. Menampilkan versi English.",
  "fallbackToId": "Versi English belum tersedia. Menampilkan versi Indonesia.",
  "empty": "Belum ada tulisan.",
  "series": "Seri",
  "seriesDay": "Hari {{day}}",
  "seriesDays": "{{count}} hari",
  "backToSeries": "Kembali ke seri",
  "prevDay": "← Hari {{day}}",
  "nextDay": "Hari {{day}} →"
}
```

- [ ] **Step 3.3 — Commit**

```bash
git add src/locales/en.json src/locales/id.json
git commit -m "feat(i18n): add series translation keys"
```

---

### Task 4: Series page

**Files:**
- Create: `src/app/blogs/series/[series]/_components/series-posts.tsx`
- Create: `src/app/blogs/series/[series]/page.tsx`

- [ ] **Step 4.1 — Create `series-posts.tsx` client component**

Create the file `src/app/blogs/series/[series]/_components/series-posts.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import "@/lib/i18n";
import { Navbar, Footer, ScrollToTop } from "@/app/_components";
import { useSectionFade } from "@/hooks";
import type { LocalizedPost, PostLang } from "@/lib/blogs/types";

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

interface SeriesPostsProps {
  seriesSlug: string;
  posts: LocalizedPost[];
}

export function SeriesPosts({ seriesSlug, posts }: SeriesPostsProps) {
  const fadeRef = useSectionFade();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved && saved !== i18n.language) {
      i18n.changeLanguage(saved);
    }
  }, [i18n]);

  const lang = (i18n.language === "id" ? "id" : "en") as PostLang;

  return (
    <>
      <Navbar activeSection="" />
      <main className="flex-1 pt-16">
        <section className="relative px-6 py-12 sm:py-16">
          <div ref={fadeRef} className="section-fade relative mx-auto max-w-3xl">
            <Link
              href="/blogs"
              className="mb-6 inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              {t("blog.backToList")}
            </Link>

            <div className="mb-3 flex items-center gap-3">
              <span className="border-2 border-secondary bg-card px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-secondary shadow-[2px_2px_0_var(--border)]">
                {t("blog.series")}
              </span>
              <h1 className="text-xl font-black uppercase tracking-tight sm:text-2xl">
                {slugToTitle(seriesSlug)}
              </h1>
              <span aria-hidden className="h-[2px] flex-1 bg-border opacity-10" />
            </div>
            <p className="mb-8 text-[11px] text-muted-foreground">
              {t("blog.seriesDays", { count: posts.length })}
            </p>

            <div className="border-y-2 border-border">
              {posts.length === 0 && (
                <p className="py-10 text-center text-[11px] text-muted-foreground">
                  {t("blog.empty")}
                </p>
              )}
              {posts.map((post) => {
                const preferred = post[lang];
                const fallback = preferred ? null : (post.en ?? post.id ?? null);
                const display = preferred ?? fallback;
                if (!display) return null;
                const day = display.meta.seriesDay ?? 0;

                return (
                  <Link
                    key={post.slug}
                    href={`/blogs/${post.slug}`}
                    className="block border-b border-border last:border-b-0 px-1 py-5 transition-colors hover:bg-muted"
                  >
                    <div className="mb-1 flex flex-wrap items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                      <span className="border-[1.5px] border-border bg-card px-1.5 py-[1px] text-[8px]">
                        {t("blog.seriesDay", { day })}
                      </span>
                      <time dateTime={display.meta.date}>{display.meta.date}</time>
                      <span aria-hidden>·</span>
                      <span>{t("blog.readingTime", { minutes: display.meta.readingMinutes })}</span>
                    </div>
                    <h2 className="mb-1 text-base font-black uppercase tracking-tight sm:text-lg">
                      {display.meta.title}
                    </h2>
                    <p className="text-[12px] leading-[1.55] text-muted-foreground line-clamp-2">
                      {display.meta.summary}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
```

- [ ] **Step 4.2 — Create `page.tsx` server component**

Create the file `src/app/blogs/series/[series]/page.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllSeries, getSeriesPosts } from "@/lib/blogs";
import { SeriesPosts } from "./_components/series-posts";

const SITE_URL = "https://ashandileonadi.vercel.app";

interface PageProps {
  params: Promise<{ series: string }>;
}

export async function generateStaticParams() {
  return getAllSeries().map(({ slug }) => ({ series: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { series } = await params;
  const title = series
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  const url = `${SITE_URL}/blogs/series/${series}`;
  return {
    title,
    alternates: { canonical: url },
    openGraph: { type: "website", title, url },
  };
}

export default async function SeriesPage({ params }: PageProps) {
  const { series } = await params;
  const posts = getSeriesPosts(series);
  if (posts.length === 0) notFound();
  return <SeriesPosts seriesSlug={series} posts={posts} />;
}
```

- [ ] **Step 4.3 — Verify build**

```bash
pnpm build
```

Expected: build completes, `/blogs/series/[series]` route is generated.

- [ ] **Step 4.4 — Commit**

```bash
git add src/app/blogs/series/
git commit -m "feat(blogs): add series page /blogs/series/[series]"
```

---

### Task 5: Update blog list with series section

**Files:**
- Modify: `src/app/blogs/page.tsx`
- Modify: `src/app/blogs/_components/blog-list.tsx`

- [ ] **Step 5.1 — Update `blogs/page.tsx` to pass `series`**

Replace `src/app/blogs/page.tsx` with:

```tsx
import type { Metadata } from "next";
import { getAllPosts, getAllSeries } from "@/lib/blogs";
import { BlogList } from "./_components/blog-list";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes, lessons, and things Ashandi Leonadi is learning — written in markdown, available in English and Indonesian.",
  alternates: {
    canonical: "https://ashandileonadi.vercel.app/blogs",
  },
};

export default function BlogsPage() {
  const posts = getAllPosts();
  const series = getAllSeries();
  return <BlogList posts={posts} series={series} />;
}
```

- [ ] **Step 5.2 — Update `blog-list.tsx` to render series section**

Replace `src/app/blogs/_components/blog-list.tsx` with:

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";
import { Navbar, Footer, ScrollToTop } from "@/app/_components";
import { useSectionFade } from "@/hooks";
import type { LocalizedPost, PostLang, SeriesMeta } from "@/lib/blogs/types";

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

interface BlogListProps {
  posts: LocalizedPost[];
  series: SeriesMeta[];
}

export function BlogList({ posts, series }: BlogListProps) {
  const fadeRef = useSectionFade();
  const { t, i18n } = useTranslation();
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved && saved !== i18n.language) {
      i18n.changeLanguage(saved);
    }
  }, [i18n]);

  const lang = (i18n.language === "id" ? "id" : "en") as PostLang;

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const post of posts) {
      post.en?.meta.tags.forEach((tag) => set.add(tag));
      post.id?.meta.tags.forEach((tag) => set.add(tag));
    }
    return [...set].sort();
  }, [posts]);

  const filtered = useMemo(() => {
    if (!activeTag) return posts;
    return posts.filter((post) => {
      const tags = new Set<string>([
        ...(post.en?.meta.tags ?? []),
        ...(post.id?.meta.tags ?? []),
      ]);
      return tags.has(activeTag);
    });
  }, [posts, activeTag]);

  return (
    <>
      <Navbar activeSection="" />
      <main className="flex-1 pt-16">
        <section className="relative px-6 py-12 sm:py-16">
          <div ref={fadeRef} className="section-fade relative mx-auto max-w-3xl">
            <div className="mb-3 flex items-center gap-3">
              <span className="border-2 border-secondary bg-card px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-secondary shadow-[2px_2px_0_var(--border)]">
                {t("blog.badge")}
              </span>
              <h1 className="text-xl font-black uppercase tracking-tight sm:text-2xl">
                {t("blog.title")}
              </h1>
              <span aria-hidden className="h-[2px] flex-1 bg-border opacity-10" />
            </div>
            <p className="mb-8 text-[11px] text-muted-foreground">
              {t("blog.subtitle")}
            </p>

            {series.length > 0 && (
              <div className="mb-10">
                <p className="mb-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  {t("blog.series")}
                </p>
                <div className="border-y-2 border-border">
                  {series.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/blogs/series/${s.slug}`}
                      className="flex items-center justify-between border-b border-border last:border-b-0 px-1 py-4 transition-colors hover:bg-muted"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-muted-foreground">📚</span>
                        <span className="text-sm font-black uppercase tracking-tight">
                          {slugToTitle(s.slug)}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {t("blog.seriesDays", { count: s.totalDays })} →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {allTags.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTag(null)}
                  className={`border-[1.5px] px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.1em] transition-colors ${
                    activeTag === null
                      ? "border-border bg-foreground text-background shadow-[2px_2px_0_var(--border)]"
                      : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {t("blog.allTag")}
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setActiveTag(tag)}
                    className={`border-[1.5px] px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.1em] transition-colors ${
                      activeTag === tag
                        ? "border-border bg-foreground text-background shadow-[2px_2px_0_var(--border)]"
                        : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}

            <div className="border-y-2 border-border">
              {filtered.length === 0 && (
                <p className="py-10 text-center text-[11px] text-muted-foreground">
                  {t("blog.empty")}
                </p>
              )}
              {filtered.map((post) => {
                const preferred = post[lang];
                const fallback = preferred ? null : (post.en ?? post.id ?? null);
                const display = preferred ?? fallback;
                if (!display) return null;
                let badgeKey: "enOnly" | "idOnly" | null = null;
                if (!preferred) {
                  if (post.en && !post.id) badgeKey = "enOnly";
                  else if (post.id && !post.en) badgeKey = "idOnly";
                }

                return (
                  <Link
                    key={post.slug}
                    href={`/blogs/${post.slug}`}
                    className="block border-b border-border last:border-b-0 px-1 py-5 transition-colors hover:bg-muted"
                  >
                    <div className="mb-1 flex flex-wrap items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                      <time dateTime={display.meta.date}>{display.meta.date}</time>
                      {badgeKey && (
                        <span className="border-[1.5px] border-border bg-muted px-1.5 py-[1px] text-[8px]">
                          {t(`blog.${badgeKey}`)}
                        </span>
                      )}
                      <span aria-hidden>·</span>
                      <span>{t("blog.readingTime", { minutes: display.meta.readingMinutes })}</span>
                    </div>
                    <h2 className="mb-1 text-base font-black uppercase tracking-tight sm:text-lg">
                      {display.meta.title}
                    </h2>
                    <p className="mb-2 text-[12px] leading-[1.55] text-muted-foreground line-clamp-2">
                      {display.meta.summary}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {display.meta.tags.map((tag) => (
                        <span
                          key={tag}
                          className="border-[1.5px] border-border bg-card px-1.5 py-[1px] font-mono text-[8px] font-bold uppercase tracking-[0.05em] text-muted-foreground"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
```

- [ ] **Step 5.3 — Verify build**

```bash
pnpm build
```

Expected: build completes; `/blogs` page compiles without TypeScript errors.

- [ ] **Step 5.4 — Commit**

```bash
git add src/app/blogs/page.tsx src/app/blogs/_components/blog-list.tsx
git commit -m "feat(blogs): render series section above post list on /blogs"
```

---

### Task 6: Update blog post with series navigation

**Files:**
- Modify: `src/app/blogs/[slug]/page.tsx`
- Modify: `src/app/blogs/_components/blog-post.tsx`

- [ ] **Step 6.1 — Update `[slug]/page.tsx` to compute adjacent posts**

Replace `src/app/blogs/[slug]/page.tsx` with:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllSlugs, getPostBySlug, getAdjacentSeriesPosts } from "@/lib/blogs";
import { BlogPost } from "../_components/blog-post";

const SITE_URL = "https://ashandileonadi.vercel.app";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const meta = (post.en ?? post.id)?.meta;
  if (!meta) return {};
  const url = `${SITE_URL}/blogs/${slug}`;
  return {
    title: meta.title,
    description: meta.summary,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: meta.title,
      description: meta.summary,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.summary,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const seriesSlug = post.en?.meta.series ?? post.id?.meta.series;
  const adjacent = seriesSlug
    ? getAdjacentSeriesPosts(slug, seriesSlug)
    : { prev: null, next: null };
  return <BlogPost post={post} adjacent={adjacent} />;
}
```

- [ ] **Step 6.2 — Update `blog-post.tsx` to render series navigation**

Replace `src/app/blogs/_components/blog-post.tsx` with:

```tsx
"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import "@/lib/i18n";
import { Navbar, Footer, ScrollToTop } from "@/app/_components";
import { useSectionFade } from "@/hooks";
import type { LocalizedPost, PostContent, PostLang } from "@/lib/blogs/types";

interface BlogPostProps {
  post: LocalizedPost;
  adjacent: { prev: LocalizedPost | null; next: LocalizedPost | null };
}

type FallbackKey = "fallbackToEn" | "fallbackToId" | null;

export function BlogPost({ post, adjacent }: BlogPostProps) {
  const fadeRef = useSectionFade();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved && saved !== i18n.language) {
      i18n.changeLanguage(saved);
    }
  }, [i18n]);

  const lang = (i18n.language === "id" ? "id" : "en") as PostLang;

  const { display, fallbackKey } = useMemo<{
    display: PostContent | null;
    fallbackKey: FallbackKey;
  }>(() => {
    const preferred = post[lang];
    if (preferred?.html) {
      return { display: preferred, fallbackKey: null };
    }
    const otherLang: PostLang = lang === "en" ? "id" : "en";
    const fallback = post[otherLang];
    if (fallback?.html) {
      return {
        display: fallback,
        fallbackKey: lang === "en" ? "fallbackToId" : "fallbackToEn",
      };
    }
    return { display: null, fallbackKey: null };
  }, [post, lang]);

  if (!display) return null;

  const meta = display.meta;
  const seriesSlug = meta.series;
  const seriesDay = meta.seriesDay;

  const prevDisplay = adjacent.prev?.[lang] ?? adjacent.prev?.en ?? adjacent.prev?.id ?? null;
  const nextDisplay = adjacent.next?.[lang] ?? adjacent.next?.en ?? adjacent.next?.id ?? null;

  return (
    <>
      <Navbar activeSection="" />
      <main className="flex-1 pt-16">
        <section className="relative px-6 py-12 sm:py-16">
          <article ref={fadeRef} className="section-fade relative mx-auto max-w-3xl">
            <Link
              href="/blogs"
              className="mb-6 inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              {t("blog.backToList")}
            </Link>

            <h1 className="mb-3 text-2xl font-black uppercase tracking-tight sm:text-3xl">
              {meta.title}
            </h1>

            <div className="mb-6 flex flex-wrap items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
              <time dateTime={meta.date}>{meta.date}</time>
              <span aria-hidden>·</span>
              <span>{t("blog.readingTime", { minutes: meta.readingMinutes })}</span>
              {seriesDay != null && (
                <>
                  <span aria-hidden>·</span>
                  <span className="border-[1.5px] border-border bg-card px-1.5 py-[1px] text-[8px]">
                    {t("blog.seriesDay", { day: seriesDay })}
                  </span>
                </>
              )}
              {meta.tags.map((tag) => (
                <span
                  key={tag}
                  className="border-[1.5px] border-border bg-card px-1.5 py-[1px] text-[8px] tracking-[0.05em]"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {fallbackKey && (
              <div className="mb-6 border-[1.5px] border-border bg-muted px-3 py-2 font-mono text-[10px] text-muted-foreground">
                {t(`blog.${fallbackKey}`)}
              </div>
            )}

            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: display.html ?? "" }}
            />

            {seriesSlug && (adjacent.prev || adjacent.next) && (
              <div className="mt-12 border-t-2 border-border pt-6">
                <Link
                  href={`/blogs/series/${seriesSlug}`}
                  className="mb-4 inline-block font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("blog.backToSeries")} ↑
                </Link>
                <div className="flex items-stretch gap-3">
                  {adjacent.prev && prevDisplay ? (
                    <Link
                      href={`/blogs/${adjacent.prev.slug}`}
                      className="flex flex-1 flex-col border-[1.5px] border-border bg-card px-3 py-3 transition-colors hover:bg-muted"
                    >
                      <span className="mb-1 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                        {t("blog.prevDay", { day: prevDisplay.meta.seriesDay })}
                      </span>
                      <span className="text-[11px] font-bold uppercase leading-tight">
                        {prevDisplay.meta.title}
                      </span>
                    </Link>
                  ) : (
                    <div className="flex-1" />
                  )}
                  {adjacent.next && nextDisplay ? (
                    <Link
                      href={`/blogs/${adjacent.next.slug}`}
                      className="flex flex-1 flex-col items-end border-[1.5px] border-border bg-card px-3 py-3 text-right transition-colors hover:bg-muted"
                    >
                      <span className="mb-1 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                        {t("blog.nextDay", { day: nextDisplay.meta.seriesDay })}
                      </span>
                      <span className="text-[11px] font-bold uppercase leading-tight">
                        {nextDisplay.meta.title}
                      </span>
                    </Link>
                  ) : (
                    <div className="flex-1" />
                  )}
                </div>
              </div>
            )}
          </article>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
```

- [ ] **Step 6.3 — Verify build**

```bash
pnpm build
```

Expected: build completes. All six tasks' files compile cleanly.

- [ ] **Step 6.4 — Commit**

```bash
git add src/app/blogs/[slug]/page.tsx src/app/blogs/_components/blog-post.tsx
git commit -m "feat(blogs): add prev/next series navigation to blog post"
```

---

### Task 7: First content file

**Files:**
- Create: `content/blogs/golang-microservice-day-1.id.md`

- [ ] **Step 7.1 — Create the Day 1 template**

Create `content/blogs/golang-microservice-day-1.id.md`:

```markdown
---
title: "Day 1 — "
date: "2026-06-06"
summary: ""
tags: ["golang", "microservice"]
series: "mastering-golang-microservice"
seriesDay: 1
---

(isi konten di sini)
```

Fill in the `title` and `summary` fields with what you learned on Day 1.

- [ ] **Step 7.2 — Verify build (series page now has content)**

```bash
pnpm build
```

Expected: build completes; `/blogs/series/mastering-golang-microservice` is generated as a static route with 1 entry.

- [ ] **Step 7.3 — Commit**

```bash
git add content/blogs/golang-microservice-day-1.id.md
git commit -m "content: add golang microservice day 1"
```

---

## Ongoing: adding new days

For each new day, copy the previous day's file, increment `seriesDay`, update `title`, `date`, `summary`, and fill in the content. No code changes needed.

```bash
cp content/blogs/golang-microservice-day-1.id.md content/blogs/golang-microservice-day-2.id.md
# edit the new file: seriesDay: 2, title, date, summary, content
git add content/blogs/golang-microservice-day-2.id.md
git commit -m "content: add golang microservice day 2"
```
