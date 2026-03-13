import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchNotes } from "../data";
import type { Note } from "../data";
import { SkeletonList } from "../components/Skeleton";

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchNotes()
      .then(setNotes)
      .finally(() => setLoading(false));
  }, []);

  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="max-w-xl mx-auto">
      <h1 className="font-serif text-2xl mb-6">Notes</h1>

      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 bg-transparent border border-[var(--color-rule)] rounded-md text-[var(--color-ink)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[#3a5f73]"
        />
      </div>

      {loading ? (
        <SkeletonList count={5} />
      ) : filtered.length === 0 ? (
        <p className="text-[var(--color-muted)] italic">No notes found.</p>
      ) : (
        <ul className="space-y-6">
          {filtered.map((n, i) => (
            <li key={n.id} className="flex gap-4">
              <span className="font-mono text-[var(--color-muted)] w-6 shrink-0">
                {i + 1}.
              </span>
              <div>
                <Link to={`/notes/${n.id}`} className="font-medium">
                  {n.title}
                </Link>
                <p className="text-[var(--color-muted)] text-sm mt-1">
                  {n.content}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
