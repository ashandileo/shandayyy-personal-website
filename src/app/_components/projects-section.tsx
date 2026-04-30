"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { useSectionFade, useStaggeredFade } from "@/hooks";
import { PROJECTS } from "@/data/projects";
import type { Project } from "@/data/projects";
import { ProjectCard } from "./project-card";
import { ProjectDialog } from "./project-dialog";

const HOME_LIMIT = 5;

export function ProjectsSection() {
  const [selected, setSelected] = useState<Project | null>(null);
  const fadeRef = useSectionFade();
  const staggerRef = useStaggeredFade(120);
  const { t } = useTranslation();

  const visible = PROJECTS.slice(0, HOME_LIMIT);
  const [featured, ...rest] = visible;

  return (
    <section
      id="projects"
      className="relative scroll-mt-16 border-b-2 border-border px-6 py-16 sm:py-20"
    >
      <div ref={fadeRef} className="section-fade relative mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-3 flex items-center gap-3">
          <span className="border-2 border-secondary bg-card px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-secondary shadow-[2px_2px_0_var(--border)]">
            {t("projects.badge")}
          </span>
          <h2 className="text-xl font-black uppercase tracking-tight sm:text-2xl">
            {t("projects.title")}
          </h2>
          <span aria-hidden className="h-[2px] flex-1 bg-border opacity-10" />
        </div>
        <p className="mb-8 text-[11px] text-muted-foreground">
          {t("projects.subtitle")}
        </p>

        {/* Featured + 2x2 grid (Option A) */}
        <div
          ref={staggerRef}
          className="grid grid-cols-1 border-2 border-border shadow-[4px_4px_0_var(--border)] md:[grid-template-columns:2fr_1fr_1fr]"
        >
          {/* Featured (col 1, spans 2 rows on md+) */}
          <div className="stagger-item border-b-2 border-border md:col-start-1 md:row-span-2 md:border-b-0 md:border-r-2">
            <ProjectCard
              project={featured}
              index={0}
              onSelect={() => setSelected(featured)}
              featured
            />
          </div>

          {/* 4 small cards in 2x2 grid on cols 2-3 */}
          {rest.map((project, idx) => {
            const projectIndex = idx + 1;
            const isLastColMd = idx % 2 === 1; // idx 1, 3 sit in column 3 on md+
            const isLastRowMd = idx >= 2;       // idx 2, 3 sit in row 2 on md+
            const isLastDomCell = idx === rest.length - 1;
            const bottomBase = isLastDomCell ? "border-b-0" : "border-b-2";
            const bottomMd = isLastRowMd && !isLastDomCell ? "md:border-b-0" : "";
            const rightMd = isLastColMd ? "md:border-r-0" : "md:border-r-2";
            return (
              <div
                key={project.slug}
                className={`stagger-item border-border ${bottomBase} ${bottomMd} ${rightMd}`}
              >
                <ProjectCard
                  project={project}
                  index={projectIndex}
                  onSelect={() => setSelected(project)}
                />
              </div>
            );
          })}
        </div>

        {/* View all CTA */}
        <div className="mt-6 flex justify-center">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 border-2 border-border bg-card px-5 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-foreground shadow-[3px_3px_0_var(--border)] transition-all hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0_var(--border)] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_var(--border)]"
          >
            {t("projects.viewAll", { count: PROJECTS.length })}
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <ProjectDialog
          project={selected}
          open={!!selected}
          onOpenChange={(open) => {
            if (!open) setSelected(null);
          }}
        />
      </div>
    </section>
  );
}
