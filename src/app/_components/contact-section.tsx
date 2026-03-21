"use client";

import { useTranslation } from "react-i18next";
import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { useSectionFade } from "@/hooks";
import { CONTACTS } from "@/data/contacts";

export function ContactSection() {
  const fadeRef = useSectionFade();
  const { t } = useTranslation();

  return (
    <section id="contact" className="relative scroll-mt-16 px-6 py-24">
      <div ref={fadeRef} className="section-fade mx-auto max-w-lg text-center">
        <Badge variant="secondary" className="mb-4 rounded-full px-3 py-1">
          {t("contact.badge")}
        </Badge>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {t("contact.title")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("contact.subtitle")}
        </p>

        <div className="mt-10 flex flex-col items-center gap-3">
          <a
            href={`mailto:${CONTACTS.email}`}
            className="glass-card group flex w-full max-w-sm items-center gap-4 rounded-2xl border px-5 py-4 text-sm transition-all hover:shadow-md hover:border-primary/20"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Mail className="size-5" />
            </div>
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="font-medium">{CONTACTS.email}</p>
            </div>
          </a>

          <a
            href={CONTACTS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card group flex w-full max-w-sm items-center gap-4 rounded-2xl border px-5 py-4 text-sm transition-all hover:shadow-md hover:border-primary/20"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <FaGithub className="size-5" />
            </div>
            <div className="text-left">
              <p className="text-xs text-muted-foreground">GitHub</p>
              <p className="font-medium">github.com/ashandileonadi</p>
            </div>
          </a>

          <a
            href={CONTACTS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card group flex w-full max-w-sm items-center gap-4 rounded-2xl border px-5 py-4 text-sm transition-all hover:shadow-md hover:border-primary/20"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <FaLinkedin className="size-5" />
            </div>
            <div className="text-left">
              <p className="text-xs text-muted-foreground">LinkedIn</p>
              <p className="font-medium">linkedin.com/in/ashandileonadi</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
