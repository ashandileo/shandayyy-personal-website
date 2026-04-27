"use client";

import { useTranslation } from "react-i18next";
import { useSectionFade, usePerItemFade } from "@/hooks";
import { EXPERIENCES, EXPERIENCE_STYLES } from "@/data/experiences";
import { ExperienceCard } from "./experience-card";

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
              return (
                <li key={i} className="stagger-item relative">
                  <span
                    aria-hidden
                    className="absolute left-[-30px] top-5 size-4 border-[2.5px] border-border shadow-[2px_2px_0_var(--border)]"
                    style={{ background: style.color }}
                  />
                  <ExperienceCard experience={exp} style={style} isCurrent={isCurrent} />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
