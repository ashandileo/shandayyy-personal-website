import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllSeries, getSeriesPosts } from "@/lib/blogs";
import { SeriesPosts } from "./_components/series-posts";

const SITE_URL = "https://ashandileonadi.vercel.app";

interface PageProps {
  params: Promise<{ series: string }>;
}

export async function generateStaticParams() {
  return getAllSeries().map(({ slug }) => ({ series: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { series } = await params;
  const title = series
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  const url = `${SITE_URL}/blogs/series/${series}`;
  return {
    title,
    alternates: { canonical: url },
    openGraph: { type: "website", title, url },
  };
}

export default async function SeriesPage({ params }: PageProps) {
  const { series } = await params;
  const posts = getSeriesPosts(series);
  if (posts.length === 0) notFound();
  return <SeriesPosts seriesSlug={series} posts={posts} />;
}
