import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchPublications } from "../data";
import type { Publication } from "../data";
import { SkeletonList } from "../components/Skeleton";

export default function PublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPublications()
      .then(setPublications)
      .finally(() => setLoading(false));
  }, []);

  const filtered = publications.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="max-w-xl mx-auto">
      <h1 className="font-serif text-2xl mb-6">Publications</h1>

      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="search publications..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 bg-transparent border border-[var(--color-rule)] rounded-md text-[var(--color-ink)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[#3a5f73]"
        />
      </div>

      {loading ? (
        <SkeletonList count={5} />
      ) : filtered.length === 0 ? (
        <p className="text-[var(--color-muted)] italic">No publications found.</p>
      ) : (
        <ul className="space-y-6">
          {filtered.map((p, i) => (
            <li key={p.id} className="flex gap-4">
              <span className="font-mono text-[var(--color-muted)] w-6 shrink-0">
                {i + 1}.
              </span>
              <div>
                <Link to={`/publications/${p.id}`} className="font-medium">
                  {p.title}
                </Link>
                <p className="text-[var(--color-muted)] text-sm mt-1">
                  {p.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
