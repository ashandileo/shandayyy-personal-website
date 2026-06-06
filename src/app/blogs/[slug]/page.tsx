import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllSlugs, getPostBySlug, getAdjacentSeriesPosts } from "@/lib/blogs";
import { BlogPost } from "../_components/blog-post";

const SITE_URL = "https://ashandileonadi.vercel.app";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const meta = (post.en ?? post.id)?.meta;
  if (!meta) return {};
  const url = `${SITE_URL}/blogs/${slug}`;
  return {
    title: meta.title,
    description: meta.summary,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: meta.title,
      description: meta.summary,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.summary,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const seriesSlug = post.en?.meta.series ?? post.id?.meta.series;
  const adjacent = seriesSlug
    ? getAdjacentSeriesPosts(slug, seriesSlug)
    : { prev: null, next: null };
  return <BlogPost post={post} adjacent={adjacent} />;
}
