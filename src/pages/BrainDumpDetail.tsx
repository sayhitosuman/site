import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchBrainDumps } from "../data";
import { toggleLikeCount } from "../api";
import type { BrainDump } from "../data";
import MarkdownContent from "../components/MarkdownContent";

export default function BrainDumpDetail() {
  const { id } = useParams();
  const [dumps, setDumps] = useState<BrainDump[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBrainDumps().then((all) => {
      setDumps(all);
      setLoading(false);
    });
  }, [id]);

  const dump = dumps.find((d) => d.id === id);

  const handleLike = async () => {
    if (!dump || !id) return;
    try {
      const res = await toggleLikeCount("brain-dumps", id);
      setDumps((prev) =>
        prev.map((d) =>
          d.id === id ? { ...d, likes: res.likes } : d
        )
      );
    } catch (e) {
      console.error("Like failed", e);
    }
  };

  if (loading) {
    return (
      <section className="max-w-xl mx-auto text-center py-20">
        <p className="text-[var(--color-muted)] animate-pulse">Loading…</p>
      </section>
    );
  }

  if (!dump) {
    return (
      <section className="max-w-xl mx-auto text-center py-20">
        <p className="text-[var(--color-muted)]">Thought not found.</p>
        <Link to="/brain-dump" className="text-sm mt-4 inline-block text-[#f34e0c] hover:underline">
          ← back to brain dump
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-xl mx-auto">
      <Link
        to="/brain-dump"
        className="text-sm text-[var(--color-muted)] hover:text-[#f34e0c] mb-8 inline-block"
      >
        ← back to brain dump
      </Link>

      <article className="border border-[var(--color-rule)] rounded-lg p-8 bg-[var(--color-card)]">
        {dump.category && (
          <Link
            to={`/brain-dump?category=${dump.category}`}
            className="inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-[var(--color-rule)] text-[var(--color-muted)] rounded mb-4 hover:bg-[#f34e0c] hover:text-white transition-colors"
          >
            {dump.category}
          </Link>
        )}

        <h1 className="text-3xl font-bold text-[var(--color-ink)] mb-8 leading-tight">
          {dump.title}
        </h1>

        <div className="text-[var(--color-ink)] leading-relaxed">
          <MarkdownContent content={dump.body} />
        </div>

        <div className="flex items-center justify-between mt-10 pt-6 border-t border-[var(--color-rule)]">
          <span className="text-xs font-mono text-[var(--color-muted)]">
            {dump.date} {dump.time && `· ${dump.time}`}
          </span>

          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 text-sm font-mono text-[var(--color-muted)] hover:text-[#f34e0c] transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>{dump.likes || 0}</span>
          </button>
        </div>
      </article>
    </section>
  );
}

