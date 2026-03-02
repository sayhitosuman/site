import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchBrainDumps, BRAIN_DUMP_CATEGORIES } from "../data";
import { toggleLikeCount } from "../api";
import type { BrainDump } from "../data";

type SortMode = "recent" | "oldest" | "popular" | "unpopular";

export default function BrainDumpPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [dumps, setDumps] = useState<BrainDump[]>([]);
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("recent");
  const [activeCategory, setActiveCategory] = useState<string | null>(
    searchParams.get("category")
  );
  const [showTags, setShowTags] = useState(false);
  const [showSort, setShowSort] = useState(false);

  useEffect(() => {
    fetchBrainDumps().then(setDumps);
  }, []);

  const handleCategoryClick = (cat: string) => {
    if (activeCategory === cat) {
      setActiveCategory(null);
      setSearchParams({});
    } else {
      setActiveCategory(cat);
      setSearchParams({ category: cat });
    }
  };

  const handleLike = async (id: string) => {
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

  const filtered = dumps.filter((d) => {
    const matchesSearch = (d.title + " " + d.body).toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory ? d.category === activeCategory : true;
    return matchesSearch && matchesCategory;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sortMode) {
      case "recent":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "popular":
        return (b.likes || 0) - (a.likes || 0);
      case "unpopular":
        return (a.likes || 0) - (b.likes || 0);
      default:
        return 0;
    }
  });

  return (
    <section className="max-w-xl mx-auto">
      <h1 className="font-serif text-2xl mb-6">Brain Dump</h1>

      <div className="text-[10px] uppercase tracking-widest text-[var(--color-muted)] mb-3">Tags / Moods</div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="search thoughts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 bg-transparent border border-[var(--color-rule)] rounded-md text-[var(--color-ink)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[#f34e0c]"
        />
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setShowTags(!showTags)}
          className={`flex-1 px-4 py-2 text-xs font-mono rounded border transition-colors flex items-center justify-between ${showTags
            ? "border-[#f34e0c] text-[#f34e0c] bg-[#f34e0c]/5"
            : "border-[var(--color-rule)] text-[var(--color-muted)] hover:border-[#f34e0c] hover:text-[#f34e0c]"
            }`}
        >
          <span>{activeCategory ? `Tag: ${activeCategory}` : "Filter by Tags"}</span>
          <span className="text-[10px] opacity-50">{showTags ? "▲" : "▼"}</span>
        </button>
        <button
          onClick={() => setShowSort(!showSort)}
          className={`flex-1 px-4 py-2 text-xs font-mono rounded border transition-colors flex items-center justify-between ${showSort
            ? "border-[#f34e0c] text-[#f34e0c] bg-[#f34e0c]/5"
            : "border-[var(--color-rule)] text-[var(--color-muted)] hover:border-[#f34e0c] hover:text-[#f34e0c]"
            }`}
        >
          <span>Sort: {sortMode}</span>
          <span className="text-[10px] opacity-50">{showSort ? "▲" : "▼"}</span>
        </button>
      </div>

      {showTags && (
        <div className="flex flex-col gap-1 mb-8 p-2 border border-[var(--color-rule)] rounded-md animate-in fade-in slide-in-from-top-1 duration-200">
          {BRAIN_DUMP_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { handleCategoryClick(cat); setShowTags(false); }}
              className={`w-full text-left px-3 py-2 text-xs font-mono rounded transition-colors ${activeCategory === cat
                ? "bg-[#f34e0c] text-white"
                : "text-[var(--color-muted)] hover:bg-[var(--color-rule)] hover:text-[var(--color-ink)]"
                }`}
            >
              {cat}
            </button>
          ))}
          {activeCategory && (
            <button
              onClick={() => { setActiveCategory(null); setSearchParams({}); setShowTags(false); }}
              className="w-full text-left px-3 py-2 text-xs font-mono text-[var(--color-muted)] hover:text-[#f34e0c] border-t border-[var(--color-rule)] mt-1"
            >
              Clear filter
            </button>
          )}
        </div>
      )}

      {showSort && (
        <div className="flex flex-col gap-1 mb-6 p-2 border border-[var(--color-rule)] rounded-md animate-in fade-in slide-in-from-top-1 duration-200">
          {(["recent", "oldest", "popular", "unpopular"] as SortMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => { setSortMode(mode); setShowSort(false); }}
              className={`w-full text-left px-3 py-2 text-xs font-mono rounded transition-colors ${sortMode === mode
                ? "bg-[#f34e0c] text-white"
                : "text-[var(--color-muted)] hover:bg-[var(--color-rule)] hover:text-[var(--color-ink)]"
                }`}
            >
              {mode}
            </button>
          ))}
        </div>
      )}

      {sorted.length === 0 ? (
        <p className="text-[var(--color-muted)] italic">No thoughts found.</p>
      ) : (
        <div className="space-y-4">
          {sorted.map((d) => (
            <div key={d.id} className="border border-[var(--color-rule)] rounded-lg p-4 hover:border-[#f34e0c] transition-colors group">
              {d.category && (
                <button onClick={() => handleCategoryClick(d.category!)} className="inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-[var(--color-rule)] text-[var(--color-muted)] rounded mb-3 hover:bg-[#f34e0c] hover:text-white transition-colors">
                  {d.category}
                </button>
              )}

              <Link to={"/brain-dump/" + d.id} className="block group" style={{ textDecoration: 'none' }}>
                <h3 className="text-lg font-semibold text-[var(--color-ink)] group-hover:text-[#f34e0c] transition-colors leading-tight">
                  {d.title}
                </h3>
              </Link>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--color-rule)]">
                <span className="text-xs font-mono text-[var(--color-muted)]">
                  {d.date} {d.time && `· ${d.time}`}
                </span>

                <button onClick={() => handleLike(d.id)} className="flex items-center gap-1.5 text-xs font-mono text-[var(--color-muted)] hover:text-[#f34e0c] transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{d.likes || 0}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
