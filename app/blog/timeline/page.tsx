import Link from "next/link";
import { getBlogPosts } from "@/lib/blog";

export default async function BlogTimelinePage() {
  const posts = await getBlogPosts("asc");

  return (
    <main className="min-h-screen bg-black-100 px-5 py-12 text-white">
      <div className="mx-auto w-full max-w-4xl space-y-10">
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-purple">Timeline</p>
          <h1 className="text-4xl font-bold md:text-5xl">Linha temporal dos blog posts</h1>
          <p className="text-white-200">Todos os artigos organizados por ordem cronológica.</p>
          <Link href="/blog" className="inline-flex rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10">
            Voltar ao blog
          </Link>
        </header>

        <section className="relative ml-3 border-l border-white/20 pl-8">
          {posts.map((post, index) => (
            <article key={post.slug} className="relative pb-10 last:pb-0">
              <span className="absolute -left-[2.2rem] top-1 h-4 w-4 rounded-full border border-white/40 bg-purple" />

              <p className="mb-2 text-sm text-purple">
                {new Date(post.date).toLocaleDateString("pt-PT", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <h2 className="text-2xl font-semibold">{post.title}</h2>
              <p className="mt-2 text-white-200">{post.summary}</p>
              <p className="mt-3 text-sm text-white-100">Evento #{index + 1}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
