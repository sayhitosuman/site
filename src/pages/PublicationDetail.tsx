import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { fetchPublications } from "../data";
import type { Publication } from "../data";
import MarkdownContent from "../components/MarkdownContent";

export default function PublicationDetail() {
  const { id } = useParams<{ id: string }>();
  const [pub, setPub] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublications().then((all) => {
      setPub(all.find((p) => p.id === id) || null);
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

  if (!pub) {
    return (
      <Layout>
        <Link to="/publications" className="text-xs text-[var(--color-muted)] no-underline hover:text-[var(--color-ink)]">
          ← back to publications
        </Link>
        <p className="mt-12 text-[var(--color-muted)]">Publication not found.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <Link to="/publications" className="text-xs text-[var(--color-muted)] no-underline hover:!text-[var(--color-ink)]">
        ← back to publications
      </Link>

      <div className="mt-8 max-w-2xl mx-auto">
        <p className="text-[10px] tracking-[0.15em] text-[var(--color-muted)] uppercase mb-3">
          {pub.journal} · {pub.year}
        </p>

        <h1 className="font-[var(--font-serif)] text-2xl italic leading-snug">
          {pub.title}
        </h1>

        {pub.authors && (
          <p className="mt-3 text-xs text-[var(--color-muted)]">
            {pub.authors.join(", ")}
          </p>
        )}

        <hr className="border-[var(--color-rule)] my-8" />

        <div>
          <p className="text-[10px] tracking-[0.15em] text-[var(--color-muted)] uppercase mb-4">
            Abstract
          </p>
          <div className="text-sm leading-loose text-[var(--color-muted)]">
            <MarkdownContent content={pub.abstract || pub.description} />
          </div>
        </div>

        <div className="mt-10 space-y-3 pt-6 border-t border-[var(--color-rule)]">
          {pub.doi && (
            <div className="flex items-center gap-3">
              <span className="text-[10px] tracking-[0.15em] text-[var(--color-muted)] uppercase w-16">
                DOI
              </span>
              <span className="text-xs text-[var(--color-muted)] font-mono">{pub.doi}</span>
            </div>
          )}
          {pub.link && pub.link !== "#" && (
            <div className="flex items-center gap-3">
              <span className="text-[10px] tracking-[0.15em] text-[var(--color-muted)] uppercase w-16">
                Read
              </span>
              <a href={pub.link} target="_blank" rel="noreferrer" className="text-sm">
                Full paper ↗
              </a>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
