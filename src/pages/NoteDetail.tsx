import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchNotes } from "../data";
import type { Note } from "../data";
import MarkdownContent from "../components/MarkdownContent";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function NoteDetail() {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes().then((all) => {
      setNote(all.find((n) => n.id === id) || null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <>
        <p className="text-[var(--color-muted)] animate-pulse">Loading…</p>
      </>
    );
  }

  if (!note) {
    return (
      <>
        <Link to="/notes" className="text-xs text-[var(--color-muted)] no-underline hover:text-[var(--color-ink)]">
          ← back to notes
        </Link>
        <p className="mt-12 text-[var(--color-muted)]">Note not found.</p>
      </>
    );
  }

  return (
    <>
      <Link to="/notes" className="text-xs text-[var(--color-muted)] no-underline hover:!text-[var(--color-ink)]">
        ← back to notes
      </Link>

      <div className="mt-8 max-w-xl mx-auto">
        <p className="text-[10px] tracking-[0.15em] text-[var(--color-muted)] uppercase mb-3">
          Note · {formatDate(note.date)}
        </p>

        <h1 className="font-[var(--font-serif)] text-2xl italic leading-snug">
          {note.title}
        </h1>

        <hr className="border-[var(--color-rule)] my-8" />

        <div className="max-w-none text-sm leading-loose">
          <MarkdownContent content={note.fullContent || note.content} />
        </div>
      </div>
    </>
  );
}

