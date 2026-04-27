"use client";

import { useTranslation } from "react-i18next";
import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useSectionFade, useStaggeredFade } from "@/hooks";
import { CONTACTS } from "@/data/contacts";

const GH_HANDLE = CONTACTS.github.replace(/.*github\.com\//i, "@").replace(/\/$/, "");
const LI_HANDLE = CONTACTS.linkedin.replace(/.*linkedin\.com\/in\//i, "").replace(/\/$/, "");

export function ContactSection() {
  const fadeRef = useSectionFade();
  const staggerRef = useStaggeredFade<HTMLUListElement>(100);
  const { t } = useTranslation();

  return (
    <section
      id="contact"
      className="relative scroll-mt-16 overflow-hidden border-t-2 border-border px-6 py-16 sm:py-20"
    >
      {/* Diagonal stripe pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(135deg, transparent 0 38px, oklch(0 0 0 / 0.04) 38px 40px)",
        }}
      />

      {/* Deco asterisk top-right */}
      <svg
        aria-hidden
        className="pointer-events-none absolute"
        style={{ top: 30, right: 30, width: 70, height: 70, opacity: 0.5 }}
        viewBox="0 0 70 70"
      >
        <g
          stroke="oklch(0.5687 0.1498 151.9380)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        >
          <line x1="35" y1="5" x2="35" y2="65" />
          <line x1="5" y1="35" x2="65" y2="35" />
          <line x1="14" y1="14" x2="56" y2="56" />
          <line x1="56" y1="14" x2="14" y2="56" />
        </g>
      </svg>

      <div
        ref={fadeRef}
        className="section-fade relative z-[2] mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[1fr_auto]"
      >
        {/* Left column — heading + CTA */}
        <div>
          <span className="mb-4 inline-flex items-center gap-2 border-2 border-primary bg-card px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-primary shadow-[2px_2px_0_var(--border)]">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
            </span>
            {t("contact.badge")}
          </span>

          <h2 className="text-3xl font-black uppercase leading-[0.95] tracking-tight sm:text-4xl lg:text-5xl">
            Let&apos;s Work
            <br />
            <span className="text-secondary">Together</span>
          </h2>

          <p className="mt-4 max-w-md font-mono text-[12px] leading-[1.65] text-muted-foreground sm:text-[13px]">
            {t("contact.subtitle")}
          </p>

          <a
            href={`mailto:${CONTACTS.email}`}
            className="mt-6 inline-flex items-center gap-2 border-2 border-border bg-foreground px-7 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-background shadow-[5px_5px_0_var(--border)] transition-transform hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[7px_7px_0_var(--border)]"
          >
            ✦ Send a message →
          </a>
        </div>

        {/* Right column — channel cards */}
        <ul ref={staggerRef} className="flex flex-col gap-3">
          <li className="stagger-item">
            <a
              href={`mailto:${CONTACTS.email}`}
              className="flex min-w-[260px] items-center gap-3.5 border-2 border-border bg-card px-4 py-3 shadow-[3px_3px_0_var(--border)] transition-transform hover:-translate-x-[2px] hover:-translate-y-[2px] hover:bg-muted hover:shadow-[5px_5px_0_var(--border)]"
            >
              <span className="flex size-9 shrink-0 items-center justify-center border-[1.5px] border-border bg-primary text-white">
                <Mail className="size-4" />
              </span>
              <span>
                <span className="block font-mono text-[8px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                  Email
                </span>
                <span className="block text-[12px] font-black tracking-tight">
                  {CONTACTS.email}
                </span>
              </span>
            </a>
          </li>
          <li className="stagger-item">
            <a
              href={CONTACTS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-w-[260px] items-center gap-3.5 border-2 border-border bg-card px-4 py-3 shadow-[3px_3px_0_var(--border)] transition-transform hover:-translate-x-[2px] hover:-translate-y-[2px] hover:bg-muted hover:shadow-[5px_5px_0_var(--border)]"
            >
              <span className="flex size-9 shrink-0 items-center justify-center border-[1.5px] border-border bg-foreground text-background">
                <FaGithub className="size-4" />
              </span>
              <span>
                <span className="block font-mono text-[8px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                  GitHub
                </span>
                <span className="block text-[12px] font-black tracking-tight">
                  {GH_HANDLE}
                </span>
              </span>
            </a>
          </li>
          <li className="stagger-item">
            <a
              href={CONTACTS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-w-[260px] items-center gap-3.5 border-2 border-border bg-card px-4 py-3 shadow-[3px_3px_0_var(--border)] transition-transform hover:-translate-x-[2px] hover:-translate-y-[2px] hover:bg-muted hover:shadow-[5px_5px_0_var(--border)]"
            >
              <span className="flex size-9 shrink-0 items-center justify-center border-[1.5px] border-border bg-secondary text-white">
                <FaLinkedin className="size-4" />
              </span>
              <span>
                <span className="block font-mono text-[8px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                  LinkedIn
                </span>
                <span className="block text-[12px] font-black tracking-tight">
                  {LI_HANDLE}
                </span>
              </span>
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
