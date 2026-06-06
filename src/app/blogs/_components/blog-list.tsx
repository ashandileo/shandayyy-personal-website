"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";
import { Navbar, Footer, ScrollToTop } from "@/app/_components";
import { useSectionFade } from "@/hooks";
import type { LocalizedPost, PostLang, SeriesMeta } from "@/lib/blogs/types";
import { slugToTitle } from "../_utils";

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
