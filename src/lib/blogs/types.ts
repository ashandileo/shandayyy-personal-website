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
  seriesPart?: number;
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
