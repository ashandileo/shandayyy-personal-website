"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowDown, Sparkles, Send, FileText } from "lucide-react";
import { useTypewriter } from "@/hooks";
import { TECH_STACK } from "@/data/tech-stack";

export function HeroSection() {
  const { t } = useTranslation();
  const roles = t("hero.roles", { returnObjects: true }) as string[];
  const typed = useTypewriter({ words: roles });

  return (
    <>
      <section
        id="home"
        className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden border-b-2 border-border px-6 pt-20 pb-24 text-center"
      >
        {/* Background grid */}
        <div className="hero-grid hero-grid-fade pointer-events-none absolute inset-0" />

        {/* Vertical color stripe — left edge */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[6px]"
          style={{
            background:
              "linear-gradient(to bottom, var(--primary) 0%, var(--primary) 33%, var(--secondary) 33%, var(--secondary) 66%, var(--accent) 66%, var(--accent) 100%)",
          }}
        />

        {/* Decorative SVG shapes */}
        <svg
          aria-hidden
          className="pointer-events-none absolute"
          style={{ top: 60, left: 60, width: 130, height: 130, opacity: 0.13 }}
          viewBox="0 0 130 130"
        >
          <g
            stroke="oklch(0.5687 0.1498 151.9380)"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          >
            <line x1="65" y1="6" x2="65" y2="124" />
            <line x1="6" y1="65" x2="124" y2="65" />
            <line x1="22" y1="22" x2="108" y2="108" />
            <line x1="108" y1="22" x2="22" y2="108" />
          </g>
        </svg>

        <svg
          aria-hidden
          className="pointer-events-none absolute"
          style={{ top: 86, right: 0, width: 160, height: 100, opacity: 0.55 }}
          viewBox="0 0 160 100"
        >
          <path
            d="M10 50 C36 12,68 90,100 50 C124 22,140 65,154 50"
            fill="none"
            stroke="oklch(0.6088 0.2498 29.2339)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <polyline
            points="142,32 158,50 142,68"
            fill="none"
            stroke="oklch(0.6088 0.2498 29.2339)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <svg
          aria-hidden
          className="pointer-events-none absolute"
          style={{ top: 80, right: 170, width: 80, height: 80, opacity: 0.32 }}
          viewBox="0 0 80 80"
        >
          <rect
            x="8"
            y="8"
            width="64"
            height="64"
            fill="none"
            stroke="oklch(0.7721 0.1727 64.1585)"
            strokeWidth="4"
            transform="rotate(20 40 40)"
          />
        </svg>

        <svg
          aria-hidden
          className="pointer-events-none absolute"
          style={{ bottom: 96, left: 48, width: 88, height: 88, opacity: 0.18 }}
          viewBox="0 0 88 88"
        >
          <g fill="oklch(0.1759 0.0275 161.2531)">
            <circle cx="11" cy="11" r="4" />
            <circle cx="44" cy="11" r="4" />
            <circle cx="77" cy="11" r="4" />
            <circle cx="11" cy="44" r="4" />
            <circle cx="44" cy="44" r="4" />
            <circle cx="77" cy="44" r="4" />
            <circle cx="11" cy="77" r="4" />
            <circle cx="44" cy="77" r="4" />
            <circle cx="77" cy="77" r="4" />
          </g>
        </svg>

        <svg
          aria-hidden
          className="pointer-events-none absolute"
          style={{ bottom: 110, right: 60, width: 78, height: 78, opacity: 0.22 }}
          viewBox="0 0 78 78"
        >
          <circle
            cx="39"
            cy="39"
            r="32"
            fill="none"
            stroke="oklch(0.1759 0.0275 161.2531)"
            strokeWidth="2.5"
          />
          <circle
            cx="39"
            cy="39"
            r="18"
            fill="none"
            stroke="oklch(0.1759 0.0275 161.2531)"
            strokeWidth="1.5"
          />
          <line
            x1="39"
            y1="2"
            x2="39"
            y2="76"
            stroke="oklch(0.1759 0.0275 161.2531)"
            strokeWidth="2"
          />
          <line
            x1="2"
            y1="39"
            x2="76"
            y2="39"
            stroke="oklch(0.1759 0.0275 161.2531)"
            strokeWidth="2"
          />
        </svg>

        {/* Content */}
        <div className="hero-stagger relative z-[2] mx-auto max-w-2xl">
          {/* Status badge */}
          <div className="mb-6 inline-flex items-center gap-2 border-2 border-border bg-card px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] shadow-[3px_3px_0_var(--border)]">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            <span>{t("hero.available")}</span>
          </div>

          <h1 className="text-4xl font-black uppercase tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-foreground">{t("hero.greeting")}</span>
            <br />
            <span className="text-primary">Ashandi</span>
            <br />
            <span className="underline decoration-secondary decoration-[5px] underline-offset-[6px]">
              Leonadi
            </span>
          </h1>

          <p className="mt-4 font-mono text-sm font-medium text-muted-foreground sm:text-base">
            {typed}
            <span className="typewriter-cursor ml-0.5 inline-block w-[2px] bg-primary" />
          </p>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t("hero.description")}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="#projects"
              className="inline-flex items-center gap-2 border-2 border-border bg-foreground px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-background shadow-[4px_4px_0_var(--border)] transition-transform hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0_var(--border)]"
            >
              <Sparkles className="size-4" />
              {t("hero.viewProjects")}
            </Link>
            <Link
              href="/resume"
              className="inline-flex items-center gap-2 border-2 border-border bg-accent px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-foreground shadow-[4px_4px_0_var(--border)] transition-transform hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0_var(--border)]"
            >
              <FileText className="size-4" />
              {t("hero.resume")}
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 border-2 border-muted-foreground px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Send className="size-4" />
              {t("hero.contactMe")}
            </Link>
          </div>

          {/* Tech Stack */}
          <div className="mt-12">
            <p className="mb-3 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              {t("hero.techStack")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {TECH_STACK.map((tech, i) => {
                const Icon = tech.icon;
                return (
                  <span
                    key={tech.name}
                    className="tech-pill inline-flex items-center gap-1.5 border-[1.5px] border-border bg-card px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.05em] text-foreground shadow-[2px_2px_0_var(--border)] transition-transform hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[3px_3px_0_var(--border)]"
                    style={{ animationDelay: `${0.9 + i * 0.05}s` }}
                  >
                    <Icon className={`size-3.5 ${tech.color}`} />
                    {tech.name}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            document
              .getElementById("experience")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="absolute bottom-8 z-[2] flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
          aria-label="Scroll to experience"
        >
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em]">
            {t("hero.scrollToExplore")}
          </span>
          <ArrowDown className="size-4 animate-bounce" />
        </button>
      </section>

      {/* Marquee strip — full-bleed below hero */}
      <div className="overflow-hidden border-y-2 border-border bg-foreground py-2 text-background">
        <div className="flex w-max animate-marquee font-mono text-[11px] font-bold uppercase tracking-[0.18em]">
          {(() => {
            const items = [...roles, t("hero.available")];
            const Group = (
              <div className="flex shrink-0">
                {items.map((label, i) => (
                  <span key={i} className="mx-3 whitespace-nowrap">
                    <span className="mr-3 text-accent">✦</span>
                    {label}
                  </span>
                ))}
              </div>
            );
            return (
              <>
                {Group}
                {Group}
              </>
            );
          })()}
        </div>
      </div>
    </>
  );
}
