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
    const isSeries = [post.en, post.id].some(c => c?.meta.series && c.meta.seriesDay != null);
    if (isSeries) continue;
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
    }
  }
  return [...seriesMap.entries()]
    .map(([seriesSlug, slugSet]) => ({ slug: seriesSlug, totalDays: slugSet.size }))
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

export function getSeriesPosts(seriesSlug: string): LocalizedPost[] {
  const entries: Array<{ post: LocalizedPost; seriesDay: number }> = [];
  for (const { slug, langs } of groupBySlug().values()) {
    const post: LocalizedPost = { slug };
    let matchedSeriesDay: number | null = null;
    for (const lang of langs) {
      const file = readPostFile(slug, lang);
      if (!file) continue;
      post[lang] = { meta: file.meta };
      if (file.meta.series === seriesSlug && file.meta.seriesDay != null) {
        matchedSeriesDay = file.meta.seriesDay;
      }
    }
    if (matchedSeriesDay !== null) entries.push({ post, seriesDay: matchedSeriesDay });
  }
  entries.sort((a, b) => a.seriesDay - b.seriesDay);
  return entries.map(({ post }) => post);
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
