import { promises as fs } from "node:fs";
import path from "node:path";

const BLOG_POSTS_DIR = path.join(process.cwd(), "data", "blog-posts");

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  content: string[];
};

const byDateDesc = (a: BlogPost, b: BlogPost) =>
  new Date(b.date).getTime() - new Date(a.date).getTime();

const byDateAsc = (a: BlogPost, b: BlogPost) =>
  new Date(a.date).getTime() - new Date(b.date).getTime();

export async function getBlogPosts(sort: "asc" | "desc" = "desc"): Promise<BlogPost[]> {
  const files = await fs.readdir(BLOG_POSTS_DIR);
  const postFiles = files.filter((file) => file.endsWith(".json"));

  const posts = await Promise.all(
    postFiles.map(async (file) => {
      const postPath = path.join(BLOG_POSTS_DIR, file);
      const rawPost = await fs.readFile(postPath, "utf-8");
      return JSON.parse(rawPost) as BlogPost;
    })
  );

  return posts.sort(sort === "desc" ? byDateDesc : byDateAsc);
}
