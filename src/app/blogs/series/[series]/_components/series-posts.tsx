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
