import Link from "next/link";
import { getBlogPosts } from "@/lib/blog";

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <main className="min-h-screen bg-black-100 text-white px-5 py-12">
      <div className="mx-auto w-full max-w-4xl space-y-10">
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-purple">Blog</p>
          <h1 className="text-4xl font-bold md:text-5xl">Posts do repositório</h1>
          <p className="text-white-200">
            Esta página lê dinamicamente todos os ficheiros JSON da pasta <code>data/blog-posts</code>.
          </p>
          <Link
            href="/blog/timeline"
            className="inline-flex rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
          >
            Ver timeline vertical
          </Link>
        </header>

        <section className="space-y-6">
          {posts.map((post) => (
            <article key={post.slug} className="rounded-2xl border border-white/10 bg-black-200/60 p-6">
              <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-purple">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("pt-PT", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-white/10 px-2 py-1 text-xs text-white">
                    {tag}
                  </span>
                ))}
              </div>

              <h2 className="mb-2 text-2xl font-semibold">{post.title}</h2>
              <p className="mb-4 text-white-200">{post.summary}</p>

              <div className="space-y-2 text-white-100">
                {post.content.map((paragraph, index) => (
                  <p key={`${post.slug}-${index}`}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
