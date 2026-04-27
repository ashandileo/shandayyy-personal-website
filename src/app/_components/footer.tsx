"use client";

import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t-2 border-border py-5 text-center">
      <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
        © {new Date().getFullYear()} Ashandi Leonadi. {t("footer.builtWith")}
      </p>
    </footer>
  );
}
