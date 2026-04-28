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
