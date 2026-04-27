"use client";

import { useTranslation } from "react-i18next";
import { ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { EXPERIENCES, EXPERIENCE_STYLES, type Experience } from "@/data/experiences";

function ExperienceDialogInner({
  experience,
  onOpenChange,
}: {
  experience: Experience;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  const index = EXPERIENCES.indexOf(experience);
  if (index === -1) return null;
  const style = EXPERIENCE_STYLES[index] ?? EXPERIENCE_STYLES[0];
  const isCurrent = index === 0;
  const [location, type] = experience.location.split(",").map((s) => s.trim());
  const bullets = t(`experience.jobs.${index}.description`, {
    returnObjects: true,
  }) as string[];

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl gap-0 p-0 overflow-hidden">
        {/* Colored header strip — mirrors the inline timeline card */}
        <DialogHeader
          className="flex flex-col gap-3 border-b-2 border-border pl-5 pr-12 py-4 sm:flex-row sm:items-center sm:justify-between"
          style={{ background: style.lightBg }}
        >
          <div className="flex items-center gap-3.5">
            <div
              className="flex size-11 shrink-0 items-center justify-center border-2 border-border font-mono text-[13px] font-black shadow-[2px_2px_0_var(--border)]"
              style={{
                background: style.color,
                color: style.isLightInitials ? "var(--foreground)" : "#fff",
              }}
            >
              {style.initials}
            </div>
            <div>
              <DialogDescription className="mb-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                {experience.company}
              </DialogDescription>
              <DialogTitle className="text-[14px] font-black uppercase tracking-tight">
                {experience.role}
              </DialogTitle>
            </div>
          </div>
          <div className="flex flex-col items-start gap-1 sm:items-end">
            {isCurrent && (
              <span className="border-[1.5px] border-border bg-primary px-1.5 py-[1px] font-mono text-[7px] font-bold uppercase tracking-[0.1em] text-white shadow-[1px_1px_0_var(--border)]">
                ● Current
              </span>
            )}
            <span className="border-2 border-border bg-card px-2 py-0.5 font-mono text-[9px] font-bold whitespace-nowrap shadow-[2px_2px_0_var(--border)]">
              {experience.period}
            </span>
            <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground">
              {[location, type].filter(Boolean).join(" · ")}
            </span>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="flex flex-col gap-4 px-5 py-4">
          <ul className="flex flex-col gap-2">
            {bullets.map((bullet, i) => (
              <li
                key={i}
                className="flex gap-2.5 text-[12px] leading-relaxed text-foreground sm:text-[13px]"
              >
                <span
                  aria-hidden
                  className="mt-[7px] inline-block size-1.5 shrink-0 bg-foreground"
                />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <Separator />

          <div className="flex flex-wrap gap-1.5">
            {experience.skills.map((skill) => (
              <span
                key={skill}
                className="border-[1.5px] border-border bg-muted px-1.5 py-[1px] font-mono text-[8px] font-bold uppercase tracking-[0.05em] text-muted-foreground"
              >
                {skill}
              </span>
            ))}
          </div>

          {experience.website && (
            <div className="flex">
              <Button
                size="sm"
                nativeButton={false}
                className="rounded-none border-2 border-border bg-card font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-foreground shadow-[3px_3px_0_var(--border)] transition-all hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_var(--border)] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_var(--border)]"
                render={
                  <a
                    href={experience.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <ExternalLink className="size-3.5" />
                Visit Company
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ExperienceDialog({
  experience,
  onOpenChange,
}: {
  experience: Experience | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!experience) return null;
  return (
    <ExperienceDialogInner
      key={experience.company + experience.period}
      experience={experience}
      onOpenChange={onOpenChange}
    />
  );
}
