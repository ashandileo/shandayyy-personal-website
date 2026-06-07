"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import "@/lib/i18n";
import { Navbar, Footer, ScrollToTop } from "@/app/_components";
import { ReadingProgress } from "./reading-progress";
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
      <ReadingProgress />
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
                    {meta.seriesPart != null
                      ? t("blog.seriesDayPart", { day: seriesDay, part: meta.seriesPart })
                      : t("blog.seriesDay", { day: seriesDay })}
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

            {seriesSlug && (
              <div className="mt-12 border-t-2 border-border pt-6">
                <Link
                  href={`/blogs/series/${seriesSlug}`}
                  className="mb-4 inline-block font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("blog.backToSeries")} ↑
                </Link>
                {(adjacent.prev || adjacent.next) && (
                  <div className="flex items-stretch gap-3">
                    {adjacent.prev && prevDisplay ? (
                      <Link
                        href={`/blogs/${adjacent.prev.slug}`}
                        className="flex flex-1 flex-col border-[1.5px] border-border bg-card px-3 py-3 transition-colors hover:bg-muted"
                      >
                        <span className="mb-1 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                          {prevDisplay.meta.seriesPart != null
                            ? t("blog.prevDayPart", { day: prevDisplay.meta.seriesDay ?? "?", part: prevDisplay.meta.seriesPart })
                            : t("blog.prevDay", { day: prevDisplay.meta.seriesDay ?? "?" })}
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
                          {nextDisplay.meta.seriesPart != null
                            ? t("blog.nextDayPart", { day: nextDisplay.meta.seriesDay ?? "?", part: nextDisplay.meta.seriesPart })
                            : t("blog.nextDay", { day: nextDisplay.meta.seriesDay ?? "?" })}
                        </span>
                        <span className="text-[11px] font-bold uppercase leading-tight">
                          {nextDisplay.meta.title}
                        </span>
                      </Link>
                    ) : (
                      <div className="flex-1" />
                    )}
                  </div>
                )}
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
