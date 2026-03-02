import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchBlogs } from "../data";
import type { BlogPost } from "../data";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBlogs().then(setBlogs);
  }, []);

  const filtered = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="max-w-xl mx-auto">
      <h1 className="font-serif text-2xl mb-6">Blogs</h1>

      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="search blogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 bg-transparent border border-[var(--color-rule)] rounded-md text-[var(--color-ink)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[#3a5f73]"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-[var(--color-muted)] italic">No blogs found.</p>
      ) : (
        <ul className="space-y-6">
          {filtered.map((b, i) => (
            <li key={b.id} className="flex gap-4">
              <span className="font-mono text-[var(--color-muted)] w-6 shrink-0">
                {i + 1}.
              </span>
              <div>
                <Link to={`/blogs/${b.id}`} className="font-medium">
                  {b.title}
                </Link>
                <p className="text-[var(--color-muted)] text-sm mt-1">
                  {b.excerpt}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
