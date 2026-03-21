"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/data/projects";

export function ProjectCard({
  project,
  onSelect,
}: {
  project: Project;
  onSelect: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Card
      className="project-card cursor-pointer overflow-hidden border-0 ring-1 ring-border/50"
      onClick={onSelect}
    >
      {/* Image with gradient overlay */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Image
          src={project.images[0]}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
        <div
          className={`pointer-events-none absolute inset-0 bg-linear-to-t ${project.gradient}`}
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{project.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {t(`projects.items.${project.index}.summary`)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <Badge
              key={tech}
              variant="secondary"
              className="rounded-full text-[11px]"
            >
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
