"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSectionFade } from "@/hooks";
import { CONTACTS } from "@/data/contacts";

const USERNAME = CONTACTS.github.replace(/.*github\.com\//i, "").replace(/\/$/, "");
const API_URL = `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`;

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const LEVEL_BG = [
  "color-mix(in oklch, var(--muted-foreground) 12%, transparent)",
  "color-mix(in oklch, var(--primary) 28%, var(--card))",
  "color-mix(in oklch, var(--primary) 55%, var(--card))",
  "color-mix(in oklch, var(--primary) 80%, var(--card))",
  "var(--primary)",
] as const;

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ContributionApiResponse {
  total: Record<string, number> & { lastYear?: number };
  contributions: ContributionDay[];
}

interface Week {
  days: (ContributionDay | null)[];
  firstDate: Date;
}

function groupByWeek(contributions: ContributionDay[]): Week[] {
  if (contributions.length === 0) return [];

  const weeks: Week[] = [];
  let currentWeek: (ContributionDay | null)[] = [];
  let weekFirstDate: Date | null = null;

  const firstDay = new Date(contributions[0].date);
  const padding = firstDay.getDay(); // 0 = Sunday
  for (let i = 0; i < padding; i++) currentWeek.push(null);
  if (padding === 0) weekFirstDate = firstDay;

  for (const day of contributions) {
    const date = new Date(day.date);
    if (currentWeek.length === 0) weekFirstDate = date;
    currentWeek.push(day);

    if (currentWeek.length === 7) {
      weeks.push({ days: currentWeek, firstDate: weekFirstDate ?? date });
      currentWeek = [];
      weekFirstDate = null;
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null);
    weeks.push({ days: currentWeek, firstDate: weekFirstDate ?? new Date(contributions[contributions.length - 1].date) });
  }

  return weeks;
}

function getMonthMarkers(weeks: Week[]): { weekIndex: number; label: string }[] {
  const markers: { weekIndex: number; label: string }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, idx) => {
    const month = week.firstDate.getMonth();
    if (month !== lastMonth) {
      markers.push({ weekIndex: idx, label: MONTH_LABELS[month] });
      lastMonth = month;
    }
  });
  return markers;
}

export function GitHubActivitySection() {
  const fadeRef = useSectionFade();
  const { t } = useTranslation();
  const [data, setData] = useState<ContributionApiResponse | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(API_URL)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
      .then((json: ContributionApiResponse) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const weeks = useMemo(() => groupByWeek(data?.contributions ?? []), [data]);
  const monthMarkers = useMemo(() => getMonthMarkers(weeks), [weeks]);
  const total = data?.total.lastYear ?? 0;

  return (
    <section
      id="github"
      className="relative scroll-mt-16 border-b-2 border-border px-6 py-16 sm:py-20"
    >
      <div ref={fadeRef} className="section-fade mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-3 flex items-center gap-3">
          <span className="border-2 border-primary bg-card px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-primary shadow-[2px_2px_0_var(--border)]">
            {t("github.badge")}
          </span>
          <h2 className="text-xl font-black uppercase tracking-tight sm:text-2xl">
            {t("github.title")}
          </h2>
          <span aria-hidden className="h-[2px] flex-1 bg-border opacity-10" />
        </div>
        <p className="mb-8 text-[11px] text-muted-foreground">
          {t("github.subtitle")}
        </p>

        {/* Card */}
        <div className="border-2 border-border bg-card p-5 shadow-[4px_4px_0_var(--border)] sm:p-7">
          {/* Total count */}
          <div className="mb-5 flex items-baseline gap-3">
            <span className="text-4xl font-black tracking-tight sm:text-5xl">
              {data ? total.toLocaleString() : "—"}
            </span>
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-muted-foreground sm:text-[10px]">
              {t("github.contributionsInLastYear")}
            </span>
          </div>

          {/* Graph */}
          {error ? (
            <p className="py-8 text-center font-mono text-[11px] text-muted-foreground">
              {t("github.unavailable")}
            </p>
          ) : (
            <div className="overflow-x-auto pb-1">
              <div
                className="inline-flex flex-col gap-1"
                style={{ minWidth: "fit-content" }}
              >
                {/* Month labels */}
                <div
                  className="grid"
                  style={{
                    gridTemplateColumns: `auto repeat(${Math.max(weeks.length, 1)}, 12px)`,
                    columnGap: "3px",
                  }}
                >
                  <span aria-hidden className="w-7" />
                  {weeks.map((_, idx) => {
                    const marker = monthMarkers.find((m) => m.weekIndex === idx);
                    return (
                      <span
                        key={idx}
                        className="font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-muted-foreground"
                      >
                        {marker?.label ?? ""}
                      </span>
                    );
                  })}
                </div>

                {/* Day rows */}
                {[0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) => (
                  <div
                    key={dayOfWeek}
                    className="grid items-center"
                    style={{
                      gridTemplateColumns: `auto repeat(${Math.max(weeks.length, 1)}, 12px)`,
                      columnGap: "3px",
                    }}
                  >
                    <span className="w-7 font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                      {dayOfWeek === 1 ? "Mon" : dayOfWeek === 3 ? "Wed" : dayOfWeek === 5 ? "Fri" : ""}
                    </span>
                    {weeks.map((week, weekIdx) => {
                      const day = week.days[dayOfWeek];
                      if (!data) {
                        return (
                          <span
                            key={weekIdx}
                            className="size-3 border border-border/30"
                            style={{ background: LEVEL_BG[0] }}
                          />
                        );
                      }
                      if (!day) {
                        return <span key={weekIdx} className="size-3" />;
                      }
                      return (
                        <span
                          key={weekIdx}
                          title={`${day.count} contributions on ${day.date}`}
                          className="size-3 border border-border/30 transition-transform hover:scale-110"
                          style={{ background: LEVEL_BG[day.level] }}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
