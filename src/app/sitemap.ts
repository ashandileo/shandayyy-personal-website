import type { MetadataRoute } from "next";
import { getAllSlugs, getAllSeries } from "@/lib/blogs";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ashandileonadi.vercel.app";
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/resume`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  const seriesRoutes: MetadataRoute.Sitemap = getAllSeries().map(({ slug }) => ({
    url: `${baseUrl}/blogs/series/${slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.65,
  }));

  const blogRoutes: MetadataRoute.Sitemap = getAllSlugs().map((slug) => ({
    url: `${baseUrl}/blogs/${slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...seriesRoutes, ...blogRoutes];
}
