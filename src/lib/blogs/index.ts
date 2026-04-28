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
