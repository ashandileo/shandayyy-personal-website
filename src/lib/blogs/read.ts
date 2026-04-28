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
