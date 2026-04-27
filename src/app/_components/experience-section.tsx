"use client";

import { useTranslation } from "react-i18next";
import { useSectionFade, usePerItemFade } from "@/hooks";
import { EXPERIENCES, EXPERIENCE_STYLES } from "@/data/experiences";

export function ExperienceSection() {
  const fadeRef = useSectionFade();
  const itemFadeRef = usePerItemFade();
  const { t } = useTranslation();

  return (
    <section
      id="experience"
      className="relative scroll-mt-16 border-b-2 border-border px-6 py-16 sm:py-20"
    >
      <div ref={fadeRef} className="section-fade mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-3 flex items-center gap-3">
          <span className="border-2 border-secondary bg-card px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-secondary shadow-[2px_2px_0_var(--border)]">
            {t("experience.badge")}
          </span>
          <h2 className="text-xl font-black uppercase tracking-tight sm:text-2xl">
            {t("experience.title")}
          </h2>
          <span aria-hidden className="h-[2px] flex-1 bg-border opacity-10" />
        </div>
        <p className="mb-10 text-[11px] text-muted-foreground">
          {t("experience.subtitle")}
        </p>

        {/* Timeline */}
        <div ref={itemFadeRef} className="relative pl-7">
          {/* Vertical line */}
          <span
            aria-hidden
            className="absolute left-2 top-0 bottom-0 w-[3px] bg-border opacity-10"
          />

          <ul className="flex flex-col gap-5">
            {EXPERIENCES.map((exp, i) => {
              const style = EXPERIENCE_STYLES[i] ?? EXPERIENCE_STYLES[0];
              const isCurrent = i === 0;
              const [location, type] = exp.location.split(",").map((s) => s.trim());
              return (
                <li key={i} className="stagger-item relative">
                  {/* Dot */}
                  <span
                    aria-hidden
                    className="absolute left-[-30px] top-5 size-4 border-[2.5px] border-border shadow-[2px_2px_0_var(--border)]"
                    style={{ background: style.color }}
                  />

                  {/* Card */}
                  <div className="border-2 border-border bg-card shadow-[4px_4px_0_var(--border)] transition-shadow hover:shadow-[6px_6px_0_var(--border)]">
                    {/* Header strip */}
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
                            {exp.company}
                          </div>
                          <div className="text-[13px] font-black uppercase tracking-tight">
                            {exp.role}
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
                          {exp.period}
                        </span>
                        <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground">
                          {[location, type].filter(Boolean).join(" · ")}
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="flex flex-wrap gap-1.5 px-5 py-3">
                      {exp.skills.map((skill) => (
                        <span
                          key={skill}
                          className="border-[1.5px] border-border bg-muted px-1.5 py-[1px] font-mono text-[8px] font-bold uppercase tracking-[0.05em] text-muted-foreground"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
