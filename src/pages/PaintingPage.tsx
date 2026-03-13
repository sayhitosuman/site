import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchPaintings, Painting } from "../data";
import * as api from "../api";
import { SkeletonGrid } from "../components/Skeleton";

export default function PaintingPage() {
  const [items, setItems] = useState<Painting[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Painting | null>(null);

  useEffect(() => {
    fetchPaintings().then(data => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const handleLike = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const res = await api.toggleLikeCount('paintings', id);
      const updated = items.map(p => p.id === id ? { ...p, likes: res.likes } : p);
      setItems(updated);
      if (selectedItem?.id === id) {
        setSelectedItem({ ...selectedItem, likes: res.likes });
      }
    } catch (err) {
      console.error("Failed to like:", err);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <Link to="/" className="text-xs text-[var(--color-muted)] no-underline hover:text-[var(--color-ink)]">
          ← back
        </Link>
        <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted)]">Gallery</span>
      </div>

      <h1 className="font-[var(--font-serif)] text-3xl italic">Painting</h1>
      <p className="mt-6 text-sm text-[var(--color-muted)] leading-relaxed max-w-xl">
        Sometimes I paint. It's the slowest thing I do, and maybe the most
        important. No screens, no undo button — just pigment and patience.
      </p>

      {loading ? (
        <div className="mt-12">
          <SkeletonGrid count={6} />
        </div>
      ) : items.length === 0 ? (
        <div className="mt-12 border border-[var(--color-rule)] rounded-xl p-16 text-center bg-[rgba(255,255,255,0.01)] backdrop-blur-sm">
          <p className="text-sm text-[var(--color-muted)] italic font-light">
            Gallery coming soon. For now, imagine something beautiful here.
          </p>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
          {items.map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group relative aspect-square bg-[#0d0f14] border border-[var(--color-rule)] rounded-md overflow-hidden cursor-pointer transition-all hover:border-[#f34e0c]/50"
            >
              <img
                src={item.imageUrls[0]}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                <h3 className="text-white text-xs font-medium mb-2 line-clamp-2">{item.title}</h3>
                <div className="flex items-center gap-1.5 text-white/90 text-xs">
                  <span>♥</span>
                  <span className="font-mono">{item.likes || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full View Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative w-full max-w-5xl max-h-full flex flex-col md:flex-row bg-[#0a0c10] border border-[var(--color-rule)] rounded-xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Image Section */}
            <div className="flex-1 bg-black flex items-center justify-center relative min-h-[50vh] md:min-h-0">
              <img
                src={selectedItem.imageUrls[0]}
                alt={selectedItem.title}
                className="max-w-full max-h-[80vh] object-contain"
              />
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center bg-black/50 text-white rounded-full hover:bg-black transition-colors md:hidden"
              >
                ✕
              </button>
            </div>

            {/* Content Section */}
            <div className="w-full md:w-80 flex flex-col p-6 border-t md:border-t-0 md:border-l border-[var(--color-rule)]">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-lg font-medium text-white leading-tight">{selectedItem.title}</h2>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="hidden md:flex text-gray-500 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <p className="text-sm text-gray-400 leading-relaxed">
                  {selectedItem.description}
                </p>
                {selectedItem.date && (
                  <div className="mt-8 pt-4 border-t border-[var(--color-rule)]/50">
                    <span className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">
                      Completed: {new Date(selectedItem.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--color-rule)] flex items-center justify-between">
                <button
                  onClick={(e) => handleLike(selectedItem.id, e)}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--color-rule)]/30 hover:bg-[#f34e0c]/20 rounded-full transition-colors text-white"
                >
                  <span className="text-lg text-[#f34e0c]">♥</span>
                  <span className="font-mono text-sm">{selectedItem.likes || 0}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <p className="mt-20 text-sm text-[var(--color-muted)] leading-relaxed mb-20 italic">
        If you're interested in any of these pieces or want to talk process, feel free to{" "}
        <a href="mailto:hello@suman.dev" className="text-[var(--color-ink)] underline underline-offset-4 decoration-[var(--color-rule)] hover:decoration-[#f34e0c] transition-colors">say hello</a>.
      </p>
    </>
  );
}
