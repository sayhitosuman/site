import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { fetchBlogs } from "../data";
import type { BlogPost } from "../data";
import MarkdownContent from "../components/MarkdownContent";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs().then((all) => {
      setPost(all.find((b) => b.id === id) || null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <p className="text-[var(--color-muted)] animate-pulse">Loading…</p>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <Link to="/blogs" className="text-xs text-[var(--color-muted)] no-underline hover:text-[var(--color-ink)]">
          ← back to blog
        </Link>
        <p className="mt-12 text-[var(--color-muted)]">Post not found.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <Link to="/blogs" className="text-xs text-[var(--color-muted)] no-underline hover:!text-[var(--color-ink)]">
        ← back to blog
      </Link>

      <div className="mt-8 max-w-2xl mx-auto">
        <h1 className="font-[var(--font-serif)] text-3xl italic leading-snug">
          {post.title}
        </h1>

        <div className="flex items-center gap-3 mt-3">
          <span className="text-xs text-[var(--color-muted)]">{formatDate(post.date)}</span>
          {post.readTime && (
            <>
              <span className="text-[var(--color-rule)]">·</span>
              <span className="text-xs text-[var(--color-muted)]">{post.readTime} read</span>
            </>
          )}
        </div>

        <hr className="border-[var(--color-rule)] my-8" />

        {post.imageUrl && (
          <img src={post.imageUrl} alt={post.title} className="w-full h-auto mb-10 rounded-lg border border-[var(--color-rule)]" />
        )}

        <div className="max-w-none text-sm leading-loose">
          <MarkdownContent content={post.content} />
        </div>
      </div>
    </Layout>
  );
}
