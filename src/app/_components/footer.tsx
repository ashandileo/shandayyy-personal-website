"use client";

import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t py-8 text-center">
      <p className="text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Ashandi Leonadi.{" "}
        {t("footer.builtWith")}
      </p>
    </footer>
  );
}
