"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSectionFade, useStaggeredFade } from "@/hooks";
import { PROJECTS } from "@/data/projects";
import type { Project } from "@/data/projects";
import { ProjectCard } from "./project-card";
import { ProjectDialog } from "./project-dialog";

export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const fadeRef = useSectionFade();
  const staggerRef = useStaggeredFade(120);
  const { t } = useTranslation();

  const [featured, ...rest] = PROJECTS;

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

        {/* Asymmetric grid */}
        <div
          ref={staggerRef}
          className="grid grid-cols-1 border-2 border-border shadow-[4px_4px_0_var(--border)] md:grid-cols-3"
        >
          {/* Featured (col 1, spans 3 rows on md+) */}
          <div className="stagger-item border-b-2 border-border md:col-span-1 md:row-span-3 md:border-b-0 md:border-r-2">
            <ProjectCard
              project={featured}
              onSelect={() => setSelectedProject(featured)}
              featured
            />
          </div>

          {/* Other 6 projects fill cols 2-3 over 3 rows */}
          {rest.map((project, idx) => {
            // idx: 0..5 ; on md+ col index in the right block: idx % 2 (0 = col2, 1 = col3)
            const isLastColMd = idx % 2 === 1;        // idx 1, 3, 5 sit in column 3 on md+
            const isLastRowMd = idx >= 4;             // idx 4, 5 sit in the third (last) row on md+
            const isLastDomCell = idx === 5;          // very last cell when stacked on mobile
            const bottomBase = isLastDomCell ? "border-b-0" : "border-b-2";
            const bottomMd = isLastRowMd && !isLastDomCell ? "md:border-b-0" : "";
            const rightMd = isLastColMd ? "md:border-r-0" : "md:border-r-2";
            return (
              <div
                key={project.title}
                className={`stagger-item border-border ${bottomBase} ${bottomMd} ${rightMd}`}
              >
                <ProjectCard
                  project={project}
                  onSelect={() => setSelectedProject(project)}
                />
              </div>
            );
          })}
        </div>

        <ProjectDialog
          project={selectedProject}
          open={!!selectedProject}
          onOpenChange={(open) => {
            if (!open) setSelectedProject(null);
          }}
        />
      </div>
    </section>
  );
}
