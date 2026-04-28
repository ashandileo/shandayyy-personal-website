# Bilingual Markdown Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/blogs` section where the author writes posts as plain markdown files in two languages (EN + ID), reads them at build time via Server Components, and renders with the existing client-side i18n.

**Architecture:** Markdown files live in `content/blogs/<slug>.<en|id>.md`. A server-only library (`src/lib/blogs/`) parses frontmatter, validates fields, computes reading time, and compiles markdown to HTML using the unified/remark/rehype pipeline with Shiki syntax highlighting. Server Components (`app/blogs/page.tsx`, `app/blogs/[slug]/page.tsx`) call the library and pass data to small Client Components (`BlogList`, `BlogPost`) that switch language using `useTranslation()` from the existing i18n setup. Each post is statically generated through `generateStaticParams`.

**Tech Stack:** Next.js 16.2.1 (App Router, async `params`), React 19, TypeScript, Tailwind v4, react-i18next (existing). New deps: `gray-matter`, `unified`, `remark-parse`, `remark-gfm`, `remark-rehype`, `rehype-pretty-code`, `rehype-stringify`, `shiki`, `reading-time`.

**Verification model:** This project has no unit-test infrastructure (no `npm test` script, no test runner installed). Tasks verify via TypeScript checking (`npx tsc --noEmit`), lint (`npm run lint`), full build (`npm run build`), and manual inspection in `npm run dev`. Where a behavior can be verified statically (compile-time types, build success), do that. Where it requires the rendered UI, do a manual dev-server check before committing the UI tasks.

**Spec:** [`docs/superpowers/specs/2026-04-28-bilingual-markdown-blog-design.md`](../specs/2026-04-28-bilingual-markdown-blog-design.md)

---

## File Structure

Files this plan creates or modifies:

```
content/blogs/
  setting-up-a-bilingual-markdown-blog.en.md         (Task 13 — sample post EN)
  setting-up-a-bilingual-markdown-blog.id.md         (Task 13 — sample post ID)

src/lib/blogs/
  types.ts                                            (Task 2)
  read.ts                                             (Task 3)
  compile.ts                                          (Task 4)
  index.ts                                            (Task 5)

src/data/navigation.ts                                (Task 6 — add Blog nav item)
src/locales/en.json                                   (Task 6 — add nav.blog + blog.* keys)
src/locales/id.json                                   (Task 6 — add nav.blog + blog.* keys)

src/app/blogs/
  _components/
    blog-list.tsx                                     (Task 7 — Client Component)
    blog-post.tsx                                     (Task 9 — Client Component)
  page.tsx                                            (Task 8 — Server Component)
  [slug]/
    page.tsx                                          (Task 10 — Server Component)

src/app/globals.css                                   (Task 11 — append .blog-content styles)
src/app/sitemap.ts                                    (Task 12 — add /blogs and post URLs)

package.json                                          (Task 1 — new deps)
package-lock.json                                     (Task 1)
```

Responsibilities:

- `src/lib/blogs/types.ts` — pure type declarations, zero runtime
- `src/lib/blogs/read.ts` — filesystem I/O, frontmatter parsing, validation, reading time
- `src/lib/blogs/compile.ts` — markdown → HTML pipeline (single pure async function)
- `src/lib/blogs/index.ts` — public API, composes read + compile, sorts, groups by slug
- `src/app/blogs/_components/blog-list.tsx` — list UI, tag filter, i18n switching, fallback badges
- `src/app/blogs/_components/blog-post.tsx` — post UI, fallback notice, dangerouslySetInnerHTML
- `src/app/blogs/page.tsx` — Server Component shell for list
- `src/app/blogs/[slug]/page.tsx` — Server Component shell for post + `generateStaticParams` + `generateMetadata`

---

## Task 1: Install dependencies

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Install runtime dependencies**

Run:

```bash
npm install gray-matter unified remark-parse remark-gfm remark-rehype rehype-pretty-code rehype-stringify shiki reading-time
```

Expected: install completes, `package.json` `dependencies` now contains all 9 packages, `package-lock.json` updated.

- [ ] **Step 2: Verify each package resolves**

Run:

```bash
npm ls gray-matter unified remark-parse remark-gfm remark-rehype rehype-pretty-code rehype-stringify shiki reading-time
```

Expected: every package shows a resolved version, no `(empty)` or `UNMET DEPENDENCY` lines.

- [ ] **Step 3: Verify the project still type-checks**

Run:

```bash
npx tsc --noEmit
```

Expected: exit code 0, no output.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(blog): install markdown pipeline dependencies"
```

---

## Task 2: Create blog library types

**Files:**
- Create: `src/lib/blogs/types.ts`

- [ ] **Step 1: Create the types file**

Create `src/lib/blogs/types.ts` with:

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
```

- [ ] **Step 2: Verify type-check**

Run:

```bash
npx tsc --noEmit
```

Expected: exit code 0, no output.

- [ ] **Step 3: Commit**

```bash
git add src/lib/blogs/types.ts
git commit -m "feat(blog): add post type definitions"
```

---

## Task 3: Create filesystem reader

**Files:**
- Create: `src/lib/blogs/read.ts`

- [ ] **Step 1: Create the reader**

Create `src/lib/blogs/read.ts` with:

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
    },
  };
}
```

Notes:
- `import "server-only"` is provided by Next.js — no need to install anything.
- Date is required to be a quoted string. If the user writes `date: 2026-04-28` without quotes, YAML parses it as a `Date` object and the type check fails with the message above (which tells them how to fix it).
- `readingMinutes` is rounded to at least 1 so very short posts don't show "0 min read".

- [ ] **Step 2: Create empty content directory placeholder**

Run:

```bash
mkdir -p content/blogs
```

Expected: directory exists. (No `.gitkeep` needed yet because Task 13 adds files.)

- [ ] **Step 3: Verify type-check**

Run:

```bash
npx tsc --noEmit
```

Expected: exit code 0, no output.

- [ ] **Step 4: Commit**

```bash
git add src/lib/blogs/read.ts
git commit -m "feat(blog): add filesystem reader and frontmatter validator"
```

---

## Task 4: Create markdown compiler

**Files:**
- Create: `src/lib/blogs/compile.ts`

- [ ] **Step 1: Create the compiler**

Create `src/lib/blogs/compile.ts` with:

```ts
import "server-only";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";

const prettyCodeOptions: PrettyCodeOptions = {
  theme: { light: "github-light", dark: "github-dark" },
  keepBackground: false,
  defaultLang: "plaintext",
};

export async function compileMarkdown(body: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypePrettyCode, prettyCodeOptions)
    .use(rehypeStringify)
    .process(body);
  return String(file);
}
```

Notes:
- `keepBackground: false` lets our CSS in Task 11 control the code-block background.
- Two themes (light + dark) produce inline `--shiki-light` / `--shiki-dark` CSS variables on every span; CSS in Task 11 selects the right one based on the `.dark` parent class.
- `allowDangerousHtml: false` is the default but stated explicitly so any future reviewer sees the choice.

- [ ] **Step 2: Verify type-check**

Run:

```bash
npx tsc --noEmit
```

Expected: exit code 0, no output.

- [ ] **Step 3: Commit**

```bash
git add src/lib/blogs/compile.ts
git commit -m "feat(blog): add markdown pipeline with shiki highlighting"
```

---

## Task 5: Create blog library public API

**Files:**
- Create: `src/lib/blogs/index.ts`

- [ ] **Step 1: Create the public API**

Create `src/lib/blogs/index.ts` with:

```ts
import "server-only";
import { listPostFiles, readPostFile } from "./read";
import { compileMarkdown } from "./compile";
import type { LocalizedPost, PostLang } from "./types";

export type { PostMeta, PostContent, LocalizedPost, PostLang } from "./types";

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
    posts.push(post);
  }
  posts.sort((a, b) => bestDate(b).localeCompare(bestDate(a)));
  return posts;
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

- [ ] **Step 2: Verify type-check**

Run:

```bash
npx tsc --noEmit
```

Expected: exit code 0, no output.

- [ ] **Step 3: Commit**

```bash
git add src/lib/blogs/index.ts
git commit -m "feat(blog): add public library API"
```

---

## Task 6: Add navigation and i18n strings

**Files:**
- Modify: `src/data/navigation.ts`
- Modify: `src/locales/en.json`
- Modify: `src/locales/id.json`

- [ ] **Step 1: Add Blog item to navigation**

Replace the contents of `src/data/navigation.ts` with:

```ts
export const SECTION_IDS = ["home", "experience", "projects", "contact"];

export const NAV_ITEMS = [
  { labelKey: "nav.home", href: "#home", sectionId: "home" },
  { labelKey: "nav.experience", href: "#experience", sectionId: "experience" },
  { labelKey: "nav.projects", href: "#projects", sectionId: "projects" },
  { labelKey: "nav.resume", href: "/resume", sectionId: null },
  { labelKey: "nav.blog", href: "/blogs", sectionId: null },
  { labelKey: "nav.contact", href: "#contact", sectionId: "contact" },
];
```

- [ ] **Step 2: Add English locale strings**

In `src/locales/en.json`, inside the existing `"nav"` object, add a `"blog"` key. Find:

```json
  "nav": {
    "home": "Home",
    "experience": "Experience",
    "projects": "Projects",
    "resume": "Resume",
    "contact": "Contact"
  },
```

Replace with:

```json
  "nav": {
    "home": "Home",
    "experience": "Experience",
    "projects": "Projects",
    "resume": "Resume",
    "blog": "Blog",
    "contact": "Contact"
  },
```

Then add a new top-level `"blog"` namespace. Find the closing of `"contact"` and the start of `"footer"`:

```json
  "contact": {
    "badge": "Contact",
    "title": "Let's Work Together",
    "subtitle": "Feel free to reach out — I'm always open to new opportunities and collaborations."
  },
  "footer": {
```

Insert a `"blog"` block between them so it becomes:

```json
  "contact": {
    "badge": "Contact",
    "title": "Let's Work Together",
    "subtitle": "Feel free to reach out — I'm always open to new opportunities and collaborations."
  },
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
    "empty": "No posts yet."
  },
  "footer": {
```

- [ ] **Step 3: Add Indonesian locale strings**

In `src/locales/id.json`, mirror the same shape. Add `"blog": "Blog"` inside the existing `"nav"` object (in the same position as in English).

Then add a top-level `"blog"` namespace between `"contact"` and `"footer"`:

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
    "empty": "Belum ada tulisan."
  },
```

- [ ] **Step 4: Verify JSON parses and types still check**

Run:

```bash
node -e "JSON.parse(require('fs').readFileSync('src/locales/en.json','utf8')); JSON.parse(require('fs').readFileSync('src/locales/id.json','utf8')); console.log('ok')"
npx tsc --noEmit
```

Expected: prints `ok`, then `tsc` exits 0 with no output.

- [ ] **Step 5: Commit**

```bash
git add src/data/navigation.ts src/locales/en.json src/locales/id.json
git commit -m "feat(blog): add navigation entry and i18n strings"
```

---

## Task 7: Create BlogList Client Component

**Files:**
- Create: `src/app/blogs/_components/blog-list.tsx`

- [ ] **Step 1: Create the component**

Create `src/app/blogs/_components/blog-list.tsx` with:

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";
import { Navbar, Footer, ScrollToTop } from "@/app/_components";
import { useSectionFade } from "@/hooks";
import type { LocalizedPost, PostLang } from "@/lib/blogs/types";

interface BlogListProps {
  posts: LocalizedPost[];
}

export function BlogList({ posts }: BlogListProps) {
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

Notes:
- `lang` is derived defensively (only "en"/"id" accepted) instead of casting i18n.language directly, in case other code ever sets it to an unexpected value.
- Importing `@/lib/i18n` ensures the i18n singleton is initialized before the component reads from it (matches `all-projects.tsx` pattern).
- The Server Component (next task) will pass posts without `html`, only metadata — `BlogList` never reads `html`.

- [ ] **Step 2: Verify type-check and lint**

Run:

```bash
npx tsc --noEmit
npm run lint
```

Expected: both exit 0. (The component is referenced nowhere yet, so type-check/lint validate only the file itself.)

- [ ] **Step 3: Commit**

```bash
git add src/app/blogs/_components/blog-list.tsx
git commit -m "feat(blog): add BlogList client component"
```

---

## Task 8: Create blogs list page (Server Component)

**Files:**
- Create: `src/app/blogs/page.tsx`

- [ ] **Step 1: Create the page**

Create `src/app/blogs/page.tsx` with:

```tsx
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blogs";
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
  return <BlogList posts={posts} />;
}
```

Notes:
- This is a Server Component (no `"use client"`). It calls `getAllPosts()`, which only returns metadata (no compiled HTML), so the JSON payload sent to the client is small.
- Posts are read at build time — for a fully static page, no server runtime is needed at request time.

- [ ] **Step 2: Verify type-check and lint**

Run:

```bash
npx tsc --noEmit
npm run lint
```

Expected: both exit 0.

- [ ] **Step 3: Manual dev-server check**

Run `npm run dev` in another terminal, then open `http://localhost:3000/blogs`. Expected:

- Page renders without runtime errors in the browser console
- Header "Blog" with badge "Writing" and subtitle is visible
- The post list shows the empty state ("No posts yet.") because no posts exist yet
- Toggling language in the navbar updates the header/subtitle text
- Stop the dev server with Ctrl-C before continuing

(This is the first time the route exists; subsequent tasks will populate it.)

- [ ] **Step 4: Commit**

```bash
git add src/app/blogs/page.tsx
git commit -m "feat(blog): add blogs list route"
```

---

## Task 9: Create BlogPost Client Component

**Files:**
- Create: `src/app/blogs/_components/blog-post.tsx`

- [ ] **Step 1: Create the component**

Create `src/app/blogs/_components/blog-post.tsx` with:

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
}

type FallbackKey = "fallbackToEn" | "fallbackToId" | null;

export function BlogPost({ post }: BlogPostProps) {
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
          </article>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
```

Notes:
- `dangerouslySetInnerHTML` is acceptable here because the HTML is generated by our own server pipeline from markdown we author. There is no user-supplied content. `remarkRehype` is configured with `allowDangerousHtml: false` (Task 4) so raw HTML in `.md` files is dropped, not passed through.
- Both EN and ID `html` are received in the same component. Switching language re-runs the `useMemo` and changes which `html` string is rendered — no navigation, no fetch.

- [ ] **Step 2: Verify type-check and lint**

Run:

```bash
npx tsc --noEmit
npm run lint
```

Expected: both exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/app/blogs/_components/blog-post.tsx
git commit -m "feat(blog): add BlogPost client component"
```

---

## Task 10: Create blog post page (Server Component)

**Files:**
- Create: `src/app/blogs/[slug]/page.tsx`

- [ ] **Step 1: Create the dynamic route**

Create `src/app/blogs/[slug]/page.tsx` with:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllSlugs, getPostBySlug } from "@/lib/blogs";
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
  return <BlogPost post={post} />;
}
```

Notes:
- `params` is a Promise per Next.js 16 — must be awaited (confirmed against `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md`).
- `generateStaticParams` returns every slug, so every post is statically rendered at build time.
- Falling back to `post.en ?? post.id` for metadata: prefer English for SEO meta, since the canonical URL is the same regardless of language.

- [ ] **Step 2: Verify type-check and lint**

Run:

```bash
npx tsc --noEmit
npm run lint
```

Expected: both exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/app/blogs/[slug]/page.tsx
git commit -m "feat(blog): add dynamic blog post route with static generation"
```

---

## Task 11: Add markdown content styles

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Append blog content styles**

Append to the end of `src/app/globals.css`:

```css
/* Blog post markdown content */
.blog-content h2 {
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.25rem;
  font-size: 1.25rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  color: var(--foreground);
  border-bottom: 1.5px solid var(--border);
}

.blog-content h3 {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  font-size: 1.0625rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  color: var(--foreground);
}

.blog-content p {
  margin-block: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--foreground);
}

.blog-content ul,
.blog-content ol {
  margin-block: 0.75rem;
  padding-left: 1.25rem;
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--foreground);
}

.blog-content ul {
  list-style: disc;
}

.blog-content ol {
  list-style: decimal;
}

.blog-content li {
  margin-block: 0.25rem;
}

.blog-content a {
  color: var(--primary);
  text-decoration: underline;
  text-underline-offset: 2px;
  font-weight: 600;
}

.blog-content a:hover {
  text-decoration: none;
}

.blog-content code:not(pre code) {
  font-family: var(--font-mono);
  font-size: 0.78em;
  background: var(--muted);
  padding: 0.1rem 0.35rem;
  border: 1.5px solid var(--border);
  border-radius: 2px;
}

.blog-content pre {
  margin-block: 1rem;
  padding: 0.875rem 1rem;
  border: 1.5px solid var(--border);
  background: var(--card);
  box-shadow: 2px 2px 0 var(--border);
  overflow-x: auto;
  font-size: 0.78rem;
  line-height: 1.6;
}

.blog-content pre code {
  font-family: var(--font-mono);
  display: block;
}

.blog-content blockquote {
  margin-block: 1rem;
  padding-left: 1rem;
  border-left: 3px solid var(--primary);
  color: var(--muted-foreground);
  font-style: italic;
}

.blog-content img {
  margin-block: 1rem;
  max-width: 100%;
  height: auto;
  border: 1.5px solid var(--border);
}

.blog-content hr {
  margin-block: 2rem;
  border: 0;
  border-top: 2px solid var(--border);
}

.blog-content table {
  margin-block: 1rem;
  width: 100%;
  border: 1.5px solid var(--border);
  font-size: 0.85rem;
  border-collapse: collapse;
}

.blog-content th,
.blog-content td {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border);
  text-align: left;
}

.blog-content th {
  background: var(--muted);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.75rem;
}

/* Shiki dual-theme: rehype-pretty-code emits inline --shiki-light / --shiki-dark
   variables on every span; these rules pick the right color per theme. */
.blog-content code[data-theme*=" "] span {
  color: var(--shiki-light);
}

html.dark .blog-content code[data-theme*=" "] span {
  color: var(--shiki-dark);
}
```

Notes:
- The selectors `code[data-theme*=" "]` match the dual-theme attribute that rehype-pretty-code adds (e.g. `data-theme="github-light github-dark"`). This is the documented dual-theme pattern.
- We keep `keepBackground: false` from Task 4, so the code block background is our own `--card` color.

- [ ] **Step 2: Verify lint and build**

Run:

```bash
npm run lint
```

Expected: exit 0. (CSS isn't lint-checked by ESLint here; this confirms no JS files were broken.)

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(blog): style markdown content with neo-brutalist theme"
```

---

## Task 12: Update sitemap

**Files:**
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Replace sitemap to include blog routes**

Replace `src/app/sitemap.ts` contents with:

```ts
import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/blogs";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ashandileonadi.vercel.app";
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/resume`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  const blogRoutes: MetadataRoute.Sitemap = getAllSlugs().map((slug) => ({
    url: `${baseUrl}/blogs/${slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes];
}
```

- [ ] **Step 2: Verify type-check and lint**

Run:

```bash
npx tsc --noEmit
npm run lint
```

Expected: both exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "feat(blog): include blog routes in sitemap"
```

---

## Task 13: Write the sample post (EN + ID)

**Files:**
- Create: `content/blogs/setting-up-a-bilingual-markdown-blog.en.md`
- Create: `content/blogs/setting-up-a-bilingual-markdown-blog.id.md`

- [ ] **Step 1: Write the English version**

Create `content/blogs/setting-up-a-bilingual-markdown-blog.en.md` with:

````markdown
---
title: "Setting up a bilingual markdown blog"
date: "2026-04-28"
summary: "How I built this blog without a database, using markdown files and the existing Next.js + i18n setup."
tags: ["nextjs", "blog", "lessons"]
---

I wanted a place to write down what I learn — but I didn't want to spin up a CMS, manage a database, or host an extra service. So I built this blog around the simplest thing that could work: a folder of markdown files, read at build time.

## Why markdown

Three reasons:

1. **No infra.** No database, no CMS, no API. Files live next to the code, version-controlled with everything else.
2. **Portable.** If I ever rebuild the site, I just copy the `content/` folder and the posts come along. No export script needed.
3. **Fast to write.** I open my editor, type in markdown, save. No "publish" button, no draft state, no admin panel.

## How it's wired

Each post is two files — one per language:

```
content/blogs/<slug>.en.md
content/blogs/<slug>.id.md
```

A small library reads the directory, parses the frontmatter, compiles the body to HTML, and hands the data to a Server Component:

```ts
import { getAllPosts } from "@/lib/blogs";

export default function BlogsPage() {
  const posts = getAllPosts();
  return <BlogList posts={posts} />;
}
```

The Server Component does the file I/O at build time, then passes the data to a Client Component that handles language switching via the existing i18n setup. Each post page is statically generated through `generateStaticParams`.

### The tools

- [`gray-matter`](https://github.com/jonschlinkert/gray-matter) for parsing frontmatter
- `unified` + `remark-parse` + `remark-rehype` for the markdown → HTML pipeline
- [`rehype-pretty-code`](https://rehype-pretty.pages.dev/) (powered by Shiki) for syntax highlighting — the same library Vercel uses on their docs site
- `reading-time` to auto-calculate the "5 min read" indicator

## What this isn't

This blog is intentionally minimal. There is no search, no comments, no RSS feed, no draft system, no related posts. If I find I need any of those, I'll add them — but starting small means there's less to maintain and less to think about when I just want to write.

> The best system is the one you'll actually use.

That's the goal. Less ceremony, more writing.
````

- [ ] **Step 2: Write the Indonesian version**

Create `content/blogs/setting-up-a-bilingual-markdown-blog.id.md` with:

````markdown
---
title: "Membuat blog markdown bilingual"
date: "2026-04-28"
summary: "Cara saya bikin blog ini tanpa database, pakai file markdown dan setup Next.js + i18n yang sudah ada."
tags: ["nextjs", "blog", "lessons"]
---

Saya pengen punya tempat buat nulis hal-hal yang saya pelajari — tapi saya gak mau setup CMS, ngurus database, atau host service tambahan. Jadi saya bikin blog ini dengan pendekatan paling simple yang bisa jalan: folder berisi file markdown, dibaca pas build.

## Kenapa markdown

Tiga alasan:

1. **Tanpa infrastruktur.** Gak ada database, gak ada CMS, gak ada API. File-nya ada di samping code, ikut version control bareng yang lain.
2. **Portable.** Kalau suatu saat saya rebuild website-nya, tinggal copy folder `content/` dan semua tulisan ikut. Gak perlu script export.
3. **Cepat dipakai.** Buka editor, ketik markdown, save. Gak ada tombol "publish", gak ada draft state, gak ada admin panel.

## Cara setup-nya

Setiap post itu dua file — satu per bahasa:

```
content/blogs/<slug>.en.md
content/blogs/<slug>.id.md
```

Library kecil baca folder-nya, parse frontmatter, compile body ke HTML, lalu kasih data-nya ke Server Component:

```ts
import { getAllPosts } from "@/lib/blogs";

export default function BlogsPage() {
  const posts = getAllPosts();
  return <BlogList posts={posts} />;
}
```

Server Component handle file I/O pas build time, terus pass data-nya ke Client Component yang ngurus language switching pakai setup i18n yang sudah ada. Halaman tiap post di-generate statis via `generateStaticParams`.

### Tools yang dipakai

- [`gray-matter`](https://github.com/jonschlinkert/gray-matter) buat parse frontmatter
- `unified` + `remark-parse` + `remark-rehype` buat pipeline markdown → HTML
- [`rehype-pretty-code`](https://rehype-pretty.pages.dev/) (powered by Shiki) buat syntax highlighting — library yang sama yang Vercel pakai di docs mereka
- `reading-time` buat auto-calculate indikator "5 menit baca"

## Yang tidak ada

Blog ini sengaja minimal. Tidak ada search, tidak ada komentar, tidak ada RSS feed, tidak ada sistem draft, tidak ada related posts. Kalau nanti saya butuh salah satunya, saya tambah — tapi mulai kecil bikin lebih sedikit yang harus di-maintain dan lebih sedikit yang harus dipikirin pas mau nulis aja.

> Sistem terbaik adalah yang benar-benar Anda pakai.

Itu tujuannya. Lebih sedikit ceremony, lebih banyak nulis.
````

- [ ] **Step 3: Commit**

```bash
git add content/blogs/setting-up-a-bilingual-markdown-blog.en.md content/blogs/setting-up-a-bilingual-markdown-blog.id.md
git commit -m "content(blog): add sample bilingual post"
```

---

## Task 14: End-to-end verification

**Files:** none modified — this task only verifies.

- [ ] **Step 1: Type-check and lint the full project**

Run:

```bash
npx tsc --noEmit
npm run lint
```

Expected: both exit 0 with no errors.

- [ ] **Step 2: Production build**

Run:

```bash
npm run build
```

Expected:
- Build completes successfully (exit 0).
- Output shows `/blogs` and `/blogs/setting-up-a-bilingual-markdown-blog` as static (`○` or `●` marker, not `λ`).
- No runtime errors related to file system access, missing modules, or unfulfilled `params` promises.

- [ ] **Step 3: Manual UI verification on dev server**

Run `npm run dev` and walk through this checklist in the browser. Stop the server when done.

List page (`http://localhost:3000/blogs`):
- [ ] "Blog" badge "WRITING", title, subtitle render correctly in EN
- [ ] Tag chips show: `All`, `#nextjs`, `#blog`, `#lessons`
- [ ] Sample post appears with date `2026-04-28`, "1 min read" or similar, and the three tags
- [ ] Clicking a tag chip filters the list; clicking `All` resets
- [ ] Toggling language to ID via navbar changes the badge to "TULISAN", subtitle to Indonesian, and the post title/summary switch to the ID version

Post page (click the sample post or go to `http://localhost:3000/blogs/setting-up-a-bilingual-markdown-blog`):
- [ ] "← Back to all posts" link visible at top
- [ ] Title, date, reading time, and tags render
- [ ] H2 headings have the bottom border, H3 headings don't
- [ ] Code blocks have syntax highlighting (TypeScript snippet shows colored tokens)
- [ ] Inline `code` is styled with the bordered chip
- [ ] Blockquote has the left primary-color border
- [ ] Toggling EN ↔ ID swaps the article content in place (no navigation, URL stays the same)
- [ ] Toggling dark mode swaps the code block colors (light theme ↔ dark theme)

Fallback (optional spot-check — temporarily rename one of the sample post files to simulate a missing translation):
- [ ] Renaming `*.id.md` to `*.id.md.bak` and reloading `/blogs` shows the post with an "EN only" badge while in Indonesian mode
- [ ] Opening the post in Indonesian mode shows the fallback notice "Versi Indonesia belum tersedia. Menampilkan versi English." and the English content
- [ ] Restore the file after testing — `mv content/blogs/<slug>.id.md.bak content/blogs/<slug>.id.md`

- [ ] **Step 4: Final commit (if any tweaks were needed)**

If verification surfaced any small fixes, commit them with descriptive messages. Otherwise nothing to commit at this step.

---

## Self-review checklist (already performed)

- **Spec coverage:**
  - File layout (`content/blogs/<slug>.<en|id>.md`) → Tasks 3, 13
  - Routes `/blogs` and `/blogs/[slug]` → Tasks 8, 10
  - Server/client split → Tasks 5, 7, 8, 9, 10
  - Markdown pipeline (gray-matter + remark + rehype-pretty-code + shiki + reading-time) → Tasks 3, 4
  - Frontmatter schema + validation with build error → Task 3
  - Bilingual fallback (badge in list, notice on post page) → Tasks 7, 9, 6 (locale strings)
  - List UI: simple stacked list with tag filter chips → Task 7
  - Post UI: title + date + reading time + tags + markdown → Task 9
  - Navbar entry between Resume and Contact → Task 6
  - Locale strings (`nav.blog`, `blog.*`) in EN and ID → Task 6
  - Sitemap including `/blogs` and per-post URLs → Task 12
  - SEO metadata per post (`generateMetadata`) → Task 10
  - Sample bilingual post (no images) → Task 13
  - Markdown content styles matching neo-brutalist aesthetic → Task 11

- **Placeholder scan:** No `TODO`, `TBD`, "implement later", or vague "add error handling" instructions. Every code step contains complete code; every command step has the exact command and expected output.

- **Type consistency:** `PostMeta`, `PostContent`, `LocalizedPost`, `PostLang` are defined in Task 2 and used unchanged in Tasks 3, 5, 7, 9, 10. Locale keys (`blog.allTag`, `blog.readingTime`, `blog.backToList`, `blog.enOnly`, `blog.idOnly`, `blog.fallbackToEn`, `blog.fallbackToId`, `blog.empty`) match between Task 6 (definition) and Tasks 7, 9 (consumption). Library function signatures (`getAllPosts`, `getAllSlugs`, `getPostBySlug`) match between Task 5 (definition) and Tasks 8, 10, 12 (consumption).
