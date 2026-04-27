"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useDarkMode } from "@/hooks";
import { NAV_ITEMS } from "@/data/navigation";

export function Navbar({ activeSection }: { activeSection: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { dark, toggle: toggleDark } = useDarkMode();
  const { t, i18n } = useTranslation();

  const resolveHref = (href: string) =>
    !isHome && href.startsWith("#") ? `/${href}` : href;

  const handleNavClick = useCallback(
    (e: React.MouseEvent, href: string) => {
      if (!href.startsWith("#")) return;
      const sectionId = href.slice(1);
      if (isHome) {
        e.preventDefault();
        document
          .getElementById(sectionId)
          ?.scrollIntoView({ behavior: "smooth" });
      }
    },
    [isHome],
  );

  const toggleLang = () => {
    const next = i18n.language === "en" ? "id" : "en";
    i18n.changeLanguage(next);
    localStorage.setItem("lang", next);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-40 w-full transition-colors duration-200 ${
        scrolled ? "border-b-2 border-border bg-background" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link
          href={resolveHref("#home")}
          onClick={(e) => handleNavClick(e, "#home")}
          className="font-heading text-base font-black tracking-tight text-primary"
        >
          Shandayyy
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-2 md:flex">
          <ul className="flex">
            {NAV_ITEMS.map((item, i) => {
              const isActive = item.href.startsWith("/")
                ? pathname === item.href
                : item.sectionId === activeSection;
              return (
                <li key={item.href} className={i === 0 ? "" : "-ml-[1.5px]"}>
                  <Link
                    href={resolveHref(item.href)}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`inline-flex items-center border-[1.5px] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] transition-colors ${
                      isActive
                        ? "border-border bg-foreground text-background shadow-[2px_2px_0_var(--border)]"
                        : "border-transparent text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="ml-2 flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleLang}
              aria-label="Switch language"
              className="border-[1.5px] border-border bg-card px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground shadow-[2px_2px_0_var(--border)] transition-colors hover:bg-foreground hover:text-background"
            >
              {i18n.language === "en" ? "ID" : "EN"}
            </button>
            <button
              type="button"
              onClick={toggleDark}
              aria-label="Toggle dark mode"
              className="border-[1.5px] border-border bg-card px-2.5 py-1.5 text-muted-foreground shadow-[2px_2px_0_var(--border)] transition-colors hover:bg-foreground hover:text-background"
            >
              {dark ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
            </button>
          </div>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-1.5 md:hidden">
          <button
            type="button"
            onClick={toggleLang}
            aria-label="Switch language"
            className="border-[1.5px] border-border bg-card px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground shadow-[2px_2px_0_var(--border)]"
          >
            {i18n.language === "en" ? "ID" : "EN"}
          </button>
          <button
            type="button"
            onClick={toggleDark}
            aria-label="Toggle dark mode"
            className="border-[1.5px] border-border bg-card px-2.5 py-1.5 text-muted-foreground shadow-[2px_2px_0_var(--border)]"
          >
            {dark ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="border-[1.5px] border-border bg-card px-2.5 py-1.5 text-muted-foreground shadow-[2px_2px_0_var(--border)]"
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mobile-menu-enter border-t-2 border-border bg-background px-6 pb-4 md:hidden">
          <ul className="flex flex-col gap-1 pt-2">
            {NAV_ITEMS.map((item) => {
              const isActive = item.href.startsWith("/")
                ? pathname === item.href
                : item.sectionId === activeSection;
              return (
                <li key={item.href}>
                  <Link
                    href={resolveHref(item.href)}
                    onClick={(e) => {
                      handleNavClick(e, item.href);
                      setMobileOpen(false);
                    }}
                    className={`block border-[1.5px] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.1em] ${
                      isActive
                        ? "border-border bg-foreground text-background"
                        : "border-transparent text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
