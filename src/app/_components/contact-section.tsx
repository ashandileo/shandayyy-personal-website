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

        <div className="mt-10 flex items-center justify-center gap-4">
          <a
            href={`mailto:${CONTACTS.email}`}
            aria-label="Email"
            className="flex size-12 items-center justify-center rounded-full border bg-card text-muted-foreground transition-all hover:border-primary/20 hover:bg-primary hover:text-primary-foreground hover:shadow-md"
          >
            <Mail className="size-5" />
          </a>
          <a
            href={CONTACTS.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="flex size-12 items-center justify-center rounded-full border bg-card text-muted-foreground transition-all hover:border-primary/20 hover:bg-primary hover:text-primary-foreground hover:shadow-md"
          >
            <FaGithub className="size-5" />
          </a>
          <a
            href={CONTACTS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="flex size-12 items-center justify-center rounded-full border bg-card text-muted-foreground transition-all hover:border-primary/20 hover:bg-primary hover:text-primary-foreground hover:shadow-md"
          >
            <FaLinkedin className="size-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
