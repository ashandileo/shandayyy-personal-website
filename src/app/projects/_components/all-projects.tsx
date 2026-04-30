"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import "@/lib/i18n";
import { Navbar, Footer, ScrollToTop } from "@/app/_components";
import { ProjectCard } from "@/app/_components/project-card";
import { ProjectDialog } from "@/app/_components/project-dialog";
import { useSectionFade, useStaggeredFade } from "@/hooks";
import { PROJECTS } from "@/data/projects";
import type { Project } from "@/data/projects";

export function AllProjects() {
  const [selected, setSelected] = useState<Project | null>(null);
  const fadeRef = useSectionFade();
  const staggerRef = useStaggeredFade(80);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved && saved !== i18n.language) {
      i18n.changeLanguage(saved);
    }
  }, [i18n]);

  return (
    <>
      <Navbar activeSection="" />
      <main className="flex-1 pt-16">
        <section className="relative px-6 py-12 sm:py-16">
          <div ref={fadeRef} className="section-fade relative mx-auto max-w-5xl">
            {/* Back link */}
            <Link
              href="/#projects"
              className="mb-6 inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              {t("projects.backHome")}
            </Link>

            {/* Header */}
            <div className="mb-3 flex items-center gap-3">
              <span className="border-2 border-secondary bg-card px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-secondary shadow-[2px_2px_0_var(--border)]">
                {t("projects.badge")}
              </span>
              <h1 className="text-xl font-black uppercase tracking-tight sm:text-2xl">
                {t("projects.allTitle")}
              </h1>
              <span aria-hidden className="h-[2px] flex-1 bg-border opacity-10" />
            </div>
            <p className="mb-8 text-[11px] text-muted-foreground">
              {t("projects.allSubtitle")}
            </p>

            {/* Full grid — all projects */}
            <div
              ref={staggerRef}
              className="grid grid-cols-1 border-2 border-border shadow-[4px_4px_0_var(--border)] sm:grid-cols-2 md:grid-cols-3"
            >
              {PROJECTS.map((project, idx) => {
                const total = PROJECTS.length;
                const colsSm = 2;
                const colsMd = 3;
                const isLastDom = idx === total - 1;
                // Mobile (1 col): only borders bottom matter
                // sm (2 cols)
                const isLastColSm = idx % colsSm === colsSm - 1;
                const isLastRowSm = idx >= total - (total % colsSm || colsSm);
                // md (3 cols)
                const isLastColMd = idx % colsMd === colsMd - 1;
                const isLastRowMd = idx >= total - (total % colsMd || colsMd);

                const bottomBase = isLastDom ? "border-b-0" : "border-b-2";
                const bottomSm = isLastRowSm && !isLastDom ? "sm:border-b-0" : "sm:border-b-2";
                const bottomMd = isLastRowMd && !isLastDom ? "md:border-b-0" : "md:border-b-2";
                const rightSm = isLastColSm ? "sm:border-r-0" : "sm:border-r-2";
                const rightMd = isLastColMd ? "md:border-r-0" : "md:border-r-2";

                return (
                  <div
                    key={project.slug}
                    className={`stagger-item border-border ${bottomBase} ${bottomSm} ${bottomMd} ${rightSm} ${rightMd}`}
                  >
                    <ProjectCard
                      project={project}
                      index={idx}
                      onSelect={() => setSelected(project)}
                    />
                  </div>
                );
              })}
            </div>

            <ProjectDialog
              project={selected}
              open={!!selected}
              onOpenChange={(open) => {
                if (!open) setSelected(null);
              }}
            />
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
