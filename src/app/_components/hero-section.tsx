"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowDown, Sparkles, Send, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TECH_STACK } from "@/data/tech-stack";

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section
      id="home"
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      {/* Animated grid background */}
      <div className="hero-grid hero-grid-fade pointer-events-none absolute inset-0" />

      {/* Floating glow orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="glow-orb-1 absolute -top-32 left-1/4 size-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="glow-orb-2 absolute -bottom-32 right-1/4 size-80 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="glow-orb-3 absolute top-1/3 right-1/3 size-64 rounded-full bg-sky-500/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-2xl">
        {/* Status badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/60 px-4 py-1.5 text-sm backdrop-blur-sm">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-muted-foreground">{t("hero.available")}</span>
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          {t("hero.greeting")}{" "}
          <span className="bg-linear-to-r from-primary via-purple-500 to-sky-500 bg-clip-text text-transparent">
            Ashandi Leonadi
          </span>
        </h1>

        <p className="mt-4 text-lg font-medium text-muted-foreground sm:text-xl">
          {t("hero.role")}
        </p>

        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
          {t("hero.description")}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            nativeButton={false}
            render={<Link href="#projects" />}
            className="rounded-full px-6"
          >
            <Sparkles className="size-4" />
            {t("hero.viewProjects")}
          </Button>
          <Button
            variant="outline"
            size="lg"
            nativeButton={false}
            render={<Link href="/resume" />}
            className="rounded-full px-6"
          >
            <FileText className="size-4" />
            {t("hero.resume")}
          </Button>
          <Button
            variant="outline"
            size="lg"
            nativeButton={false}
            render={<Link href="#contact" />}
            className="rounded-full px-6"
          >
            <Send className="size-4" />
            {t("hero.contactMe")}
          </Button>
        </div>

        {/* Tech Stack */}
        <div className="mt-12">
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {t("hero.techStack")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {TECH_STACK.map((tech) => {
              const Icon = tech.icon;
              return (
                <span
                  key={tech.name}
                  className="inline-flex items-center gap-1.5 rounded-full border bg-background/60 px-3 py-1.5 text-xs font-medium backdrop-blur-sm transition-colors hover:bg-accent"
                >
                  <Icon className={`size-3.5 ${tech.color}`} />
                  {tech.name}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <Link
        href="#experience"
        className="absolute bottom-8 flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
        aria-label="Scroll to experience"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.2em]">
          {t("hero.scrollToExplore")}
        </span>
        <ArrowDown className="size-4 animate-bounce" />
      </Link>
    </section>
  );
}
