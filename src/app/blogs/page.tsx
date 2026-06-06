import type { Metadata } from "next";
import { getAllPosts, getAllSeries } from "@/lib/blogs";
import { BlogList } from "./_components/blog-list";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes, lessons, and things Ashandi Leonadi is learning — written in markdown, available in English and Indonesian.",
  alternates: {
    canonical: "https://ashandileonadi.vercel.app/blogs",
  },
};

export default function BlogsPage() {
  const posts = getAllPosts();
  const series = getAllSeries();
  return <BlogList posts={posts} series={series} />;
}
