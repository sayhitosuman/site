import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchBlogs } from "../data";
import type { BlogPost } from "../data";
import MarkdownContent from "../components/MarkdownContent";
import { SkeletonLine } from "../components/Skeleton";

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
      <div className="animate-in fade-in duration-500 max-w-2xl mx-auto">
        <SkeletonLine width="80px" height="12px" margin="0 0 32px 0" />
        <SkeletonLine width="85%" height="36px" margin="0 0 12px 0" />
        <SkeletonLine width="200px" height="12px" margin="0 0 40px 0" />
        <div className="w-full h-[1px] bg-[var(--color-rule)] mb-8 opacity-30" />
        <div className="aspect-[16/9] w-full bg-[var(--color-rule)] animate-pulse rounded-lg opacity-20 mb-10" />
        <SkeletonLine width="100%" height="16px" margin="0 0 8px 0" />
        <SkeletonLine width="95%" height="16px" margin="0 0 8px 0" />
        <SkeletonLine width="98%" height="16px" margin="0 0 8px 0" />
        <SkeletonLine width="90%" height="16px" margin="0 0 8px 0" />
      </div>
    );
  }

  if (!post) {
    return (
      <>
        <Link to="/blogs" className="text-xs text-[var(--color-muted)] no-underline hover:text-[var(--color-ink)]">
          ← back to blog
        </Link>
        <p className="mt-12 text-[var(--color-muted)]">Post not found.</p>
      </>
    );
  }

  return (
    <>
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
    </>
  );
}

