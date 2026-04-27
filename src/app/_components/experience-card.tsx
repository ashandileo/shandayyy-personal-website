"use client";

import type { Experience, ExperienceStyle } from "@/data/experiences";

export function ExperienceCard({
  experience,
  style,
  isCurrent,
}: {
  experience: Experience;
  style: ExperienceStyle;
  isCurrent: boolean;
}) {
  const [location, type] = experience.location.split(",").map((s) => s.trim());

  return (
    <div className="border-2 border-border bg-card shadow-[4px_4px_0_var(--border)] transition-shadow hover:shadow-[6px_6px_0_var(--border)]">
      <div
        className="flex flex-col gap-3 border-b-2 border-border px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between"
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
            <div className="mb-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
              {experience.company}
            </div>
            <div className="text-[13px] font-black uppercase tracking-tight">
              {experience.role}
            </div>
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
      </div>

      <div className="flex flex-wrap gap-1.5 px-5 py-3">
        {experience.skills.map((skill) => (
          <span
            key={skill}
            className="border-[1.5px] border-border bg-muted px-1.5 py-[1px] font-mono text-[8px] font-bold uppercase tracking-[0.05em] text-muted-foreground"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
