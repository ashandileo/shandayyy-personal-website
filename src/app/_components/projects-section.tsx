"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { useSectionFade } from "@/hooks";
import { PROJECTS } from "@/data/projects";
import type { Project } from "@/data/projects";
import { ProjectCard } from "./project-card";
import { ProjectDialog } from "./project-dialog";

export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const fadeRef = useSectionFade();
  const { t } = useTranslation();

  return (
    <section
      id="projects"
      className="relative scroll-mt-16 overflow-hidden px-6 py-24"
    >
      {/* Subtle gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-muted/40 via-muted/20 to-transparent" />

      <div ref={fadeRef} className="section-fade relative mx-auto max-w-5xl">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4 rounded-full px-3 py-1">
            {t("projects.badge")}
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t("projects.title")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("projects.subtitle")}
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {PROJECTS.map((project) => (
            <ProjectCard
              key={project.title}
              project={project}
              onSelect={() => setSelectedProject(project)}
            />
          ))}
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
