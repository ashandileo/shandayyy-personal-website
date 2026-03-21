"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { Project } from "@/data/projects";

function ProjectDialogInner({
  project,
  onOpenChange,
}: {
  project: Project;
  onOpenChange: (open: boolean) => void;
}) {
  const [imgIndex, setImgIndex] = useState(0);
  const { t } = useTranslation();

  const hasPrev = imgIndex > 0;
  const hasNext = imgIndex < project.images.length - 1;

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg">{project.title}</DialogTitle>
          <DialogDescription>
            {t(`projects.items.${project.index}.summary`)}
          </DialogDescription>
        </DialogHeader>

        {/* Image carousel */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
          <Image
            src={project.images[imgIndex]}
            alt={`${project.title} screenshot ${imgIndex + 1}`}
            fill
            className="object-cover"
          />

          {hasPrev && (
            <button
              onClick={() => setImgIndex(imgIndex - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/90 p-2 shadow-lg backdrop-blur-sm transition-all hover:bg-background hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeft className="size-4" />
            </button>
          )}
          {hasNext && (
            <button
              onClick={() => setImgIndex(imgIndex + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/90 p-2 shadow-lg backdrop-blur-sm transition-all hover:bg-background hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight className="size-4" />
            </button>
          )}

          {/* Dots indicator */}
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-background/80 px-3 py-1.5 backdrop-blur-sm">
            {project.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setImgIndex(idx)}
                className={`rounded-full transition-all ${
                  idx === imgIndex
                    ? "size-2 bg-primary"
                    : "size-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {t(`projects.items.${project.index}.description`)}
        </p>

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

        <Separator />

        <div className="flex gap-2">
          {project.liveUrl && (
            <Button
              size="sm"
              nativeButton={false}
              className="rounded-full"
              render={
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <ExternalLink className="size-3.5" />
              Live Demo
            </Button>
          )}
          {project.repoUrl && (
            <Button
              size="sm"
              variant="outline"
              nativeButton={false}
              className="rounded-full"
              render={
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <FaGithub className="size-3.5" />
              {t("projects.sourceCode")}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ProjectDialog({
  project,
  onOpenChange,
}: {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!project) return null;
  return (
    <ProjectDialogInner
      key={project.title}
      project={project}
      onOpenChange={onOpenChange}
    />
  );
}
