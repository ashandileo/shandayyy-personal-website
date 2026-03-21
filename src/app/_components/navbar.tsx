"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      className={`fixed top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? "border-b bg-background/80 backdrop-blur-xl shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link
          href={resolveHref("#home")}
          className="relative font-heading text-xl font-bold tracking-tight"
        >
          <span className="bg-linear-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            Shandayyy
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          <ul className="flex gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = item.href.startsWith("/")
                ? pathname === item.href
                : item.sectionId === activeSection;
              return (
                <li key={item.href}>
                  <Link
                    href={resolveHref(item.href)}
                    className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    {t(item.labelKey)}
                    {isActive && (
                      <span className="absolute inset-x-1 -bottom-px h-0.5 rounded-full bg-primary" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="ml-2 flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={toggleLang}
              aria-label="Switch language"
            >
              <span className="text-base leading-none">
                {i18n.language === "en"
                  ? "\u{1F1EE}\u{1F1E9}"
                  : "\u{1F1FA}\u{1F1F8}"}
              </span>
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={toggleDark}
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-1 md:hidden">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleLang}
            aria-label="Switch language"
          >
            <span className="text-base leading-none">
              {i18n.language === "en"
                ? "\u{1F1EE}\u{1F1E9}"
                : "\u{1F1FA}\u{1F1F8}"}
            </span>
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleDark}
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mobile-menu-enter border-t bg-background/95 px-6 pb-4 backdrop-blur-xl md:hidden">
          <ul className="flex flex-col gap-1 pt-2">
            {NAV_ITEMS.map((item) => {
              const isActive = item.href.startsWith("/")
                ? pathname === item.href
                : item.sectionId === activeSection;
              return (
                <li key={item.href}>
                  <Link
                    href={resolveHref(item.href)}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
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
