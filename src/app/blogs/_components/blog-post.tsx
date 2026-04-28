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
