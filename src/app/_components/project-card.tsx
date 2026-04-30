"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { isVideo, type Project } from "@/data/projects";

const CATEGORY_BY_SLUG: Record<
  string,
  { label: string; color: string }
> = {
  maptrack:               { label: "SaaS · Fullstack · AI", color: "var(--secondary)" },
  "english-ai-interview": { label: "AI · Voice · Career",   color: "oklch(0.7 0.18 60)" },
  happy5:                 { label: "Performance · SaaS",    color: "var(--primary)" },
  "expense-tracker":      { label: "Finance · Personal",    color: "var(--accent)" },
  "shopbot-assistant":    { label: "AI · WhatsApp Bot",     color: "var(--secondary)" },
  "echo-test":            { label: "Education · AI",        color: "oklch(0.5 0.18 290)" },
  gomovies:               { label: "Entertainment",         color: "oklch(0.55 0.2 0)" },
  journal:                { label: "Mobile · PWA",          color: "oklch(0.65 0.18 60)" },
};

const TOTAL = 8;

function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

export function ProjectCard({
  project,
  index,
  onSelect,
  featured = false,
}: {
  project: Project;
  index: number;
  onSelect: () => void;
  featured?: boolean;
}) {
  const { t } = useTranslation();
  const category = CATEGORY_BY_SLUG[project.slug] ?? {
    label: "Project",
    color: "var(--muted-foreground)",
  };
  const number = pad2(index + 1);
  const cornerLabel = featured ? `${number} / ${pad2(TOTAL)}` : number;

  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect();
      }}
      className={`relative flex h-full cursor-pointer flex-col bg-card transition-colors hover:bg-muted ${
        featured ? "p-5" : "p-4"
      }`}
    >
      {/* Corner number */}
      <span className="pointer-events-none absolute right-4 top-3 font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
        {cornerLabel}
      </span>

      {/* Category */}
      <div
        className="mb-2 inline-flex items-center gap-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.15em]"
        style={{ color: category.color }}
      >
        <span
          aria-hidden
          className="inline-block h-[2px] w-4"
          style={{ background: category.color }}
        />
        {category.label}
      </div>

      {/* Thumbnail */}
      <div
        className={`relative w-full overflow-hidden border-[1.5px] border-border ${
          featured ? "aspect-[16/10] mb-4" : "aspect-video mb-3"
        }`}
      >
        {isVideo(project.images[0]) ? (
          <video
            src={project.images[0]}
            muted
            autoPlay
            loop
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <Image
            src={project.images[0]}
            alt={project.title}
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* Status row */}
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        {project.liveUrl && (
          <span className="inline-flex items-center gap-1 border-[1.5px] border-border bg-primary px-1.5 py-[1px] font-mono text-[8px] font-bold uppercase tracking-[0.1em] text-white shadow-[1px_1px_0_var(--border)]">
            ● Live
          </span>
        )}
        {project.repoUrl && (
          <span className="inline-flex items-center border-[1.5px] border-border bg-accent px-1.5 py-[1px] font-mono text-[8px] font-bold uppercase tracking-[0.1em] text-foreground shadow-[1px_1px_0_var(--border)]">
            {"{ } Code"}
          </span>
        )}
        {featured && (
          <span className="inline-flex items-center border-[1.5px] border-border bg-card px-1.5 py-[1px] font-mono text-[8px] font-bold uppercase tracking-[0.1em] text-muted-foreground shadow-[1px_1px_0_var(--border)]">
            ★ Featured
          </span>
        )}
      </div>

      {/* Title + summary */}
      <h3
        className={`font-black uppercase tracking-tight ${
          featured ? "text-lg sm:text-xl" : "text-[13px]"
        }`}
      >
        {project.title}
      </h3>
      <p
        className={`mt-1 mb-3 flex-1 leading-[1.55] text-muted-foreground ${
          featured ? "text-[12px] sm:text-sm" : "text-[10px]"
        } line-clamp-3`}
      >
        {t(`projects.items.${project.slug}.summary`)}
      </p>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-1">
        {project.techStack.slice(0, featured ? 6 : 4).map((tech) => (
          <span
            key={tech}
            className="border-[1.5px] border-border bg-muted px-1.5 py-[1px] font-mono text-[8px] font-bold uppercase tracking-[0.05em] text-muted-foreground"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
