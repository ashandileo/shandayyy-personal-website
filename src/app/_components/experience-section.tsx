"use client";

import { useTranslation } from "react-i18next";
import { MapPin, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSectionFade } from "@/hooks";
import { EXPERIENCES } from "@/data/experiences";

export function ExperienceSection() {
  const fadeRef = useSectionFade();
  const { t } = useTranslation();

  return (
    <section id="experience" className="scroll-mt-16 px-6 py-24">
      <div ref={fadeRef} className="section-fade mx-auto max-w-3xl">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4 rounded-full px-3 py-1">
            {t("experience.badge")}
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t("experience.title")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("experience.subtitle")}
          </p>
        </div>

        <div className="relative mt-16">
          {/* Timeline line */}
          <div className="timeline-line absolute left-4 top-0 h-full w-px md:left-1/2 md:-translate-x-px" />

          <div className="flex flex-col gap-14">
            {EXPERIENCES.map((exp, i) => (
              <div
                key={i}
                className="relative grid grid-cols-[32px_1fr] gap-6 md:grid-cols-2 md:gap-10"
              >
                {/* Dot */}
                <div className="timeline-dot absolute left-4 top-1 z-10 size-3 -translate-x-1/2 rounded-full bg-primary md:left-1/2" />

                {/* Left side — period (desktop only) */}
                <div
                  className={`hidden md:flex md:items-start ${
                    i % 2 === 0 ? "md:justify-end md:text-right" : "md:order-2"
                  }`}
                >
                  <span className="mt-0.5 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {exp.period}
                  </span>
                </div>

                {/* Content card */}
                <div
                  className={`col-start-2 rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md md:col-start-auto ${
                    i % 2 === 0 ? "" : "md:order-1"
                  }`}
                >
                  {/* Mobile period */}
                  <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary md:hidden">
                    {exp.period}
                  </span>

                  <h3 className="text-base font-semibold">{exp.role}</h3>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Building2 className="size-3" /> {exp.company}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3" /> {exp.location}
                    </span>
                  </div>

                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {Array.from({ length: exp.descriptionCount }, (_, j) => (
                      <li key={j} className="flex gap-2.5">
                        <span className="mt-2 block size-1 shrink-0 rounded-full bg-primary/50" />
                        {t(`experience.jobs.${i}.description.${j}`)}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {exp.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="rounded-full text-[11px]"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
