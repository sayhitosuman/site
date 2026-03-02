import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchPaintings, Painting } from "../data";
import * as api from "../api";

export default function PaintingPage() {
  const [items, setItems] = useState<Painting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaintings().then(data => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const handleLike = async (id: string) => {
    try {
      const res = await api.toggleLikeCount('paintings', id);
      setItems(prev => prev.map(p => p.id === id ? { ...p, likes: res.likes } : p));
    } catch (err) {
      console.error("Failed to like:", err);
    }
  };

  return (
    <>
      <Link to="/" className="text-xs text-[var(--color-muted)] no-underline hover:text-[var(--color-ink)]">
        ← back
      </Link>
      <h1 className="font-[var(--font-serif)] text-3xl mt-8 italic">Painting</h1>
      <p className="mt-6 text-sm text-[var(--color-muted)] leading-relaxed">
        Sometimes I paint. It's the slowest thing I do, and maybe the most
        important. No screens, no undo button — just pigment and patience.
      </p>

      {loading ? (
        <div className="mt-10 py-20 text-center text-xs text-[var(--color-muted)] animate-pulse">
          Loading gallery...
        </div>
      ) : items.length === 0 ? (
        <div className="mt-10 border border-[var(--color-rule)] rounded p-12 text-center">
          <p className="text-xs text-[var(--color-muted)] italic font-light">
            Gallery coming soon. For now, imagine something beautiful here.
          </p>
        </div>
      ) : (
        <div className="mt-12 space-y-16">
          {items.map(item => (
            <PaintingCard key={item.id} item={item} onLike={() => handleLike(item.id)} />
          ))}
        </div>
      )}

      <p className="mt-16 text-sm text-[var(--color-muted)] leading-relaxed mb-10">
        If you'd like a painting or want to talk about art, just{" "}
        <a href="mailto:hello@suman.dev">say hello</a>.
      </p>
    </>
  );
}

function PaintingCard({ item, onLike }: { item: Painting, onLike: () => void }) {
  const [idx, setIdx] = useState(0);
  const hasMultiple = item.imageUrls.length > 1;

  const next = () => setIdx((idx + 1) % item.imageUrls.length);

  return (
    <div className="group">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-rule)] rounded-sm border border-[var(--color-rule)]">
        <img
          src={item.imageUrls[idx]}
          alt={item.title}
          className="w-full h-full object-cover transition-opacity duration-500"
          onClick={hasMultiple ? next : undefined}
          style={{ cursor: hasMultiple ? 'pointer' : 'default' }}
        />

        {/* Progress dots for multiple images */}
        {hasMultiple && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 px-2 py-1 bg-[#00000044] rounded-full backdrop-blur-sm">
            {item.imageUrls.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === idx ? 'bg-white' : 'bg-white/40'}`}
              />
            ))}
          </div>
        )}

        {/* Info Overlay (Optional, only show if you want Instagram-like feel) */}
        {hasMultiple && (
          <div className="absolute top-3 right-3 text-[10px] text-white bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm pointer-events-none">
            {idx + 1} / {item.imageUrls.length}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="mt-4 flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="font-medium text-sm text-[var(--color-ink)]">{item.title}</h3>
          <p className="mt-1 text-xs text-[var(--color-muted)] leading-relaxed max-w-lg">
            {item.description}
          </p>
          {item.date && (
            <span className="mt-2 block text-[10px] text-[var(--color-dim)] font-mono uppercase tracking-widest">
              {new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
            </span>
          )}
        </div>

        <button
          onClick={onLike}
          className="flex items-center gap-1.5 text-xs text-[var(--color-muted)] hover:text-red-500 transition-colors pt-0.5"
        >
          <span className="text-base leading-none">♥</span>
          <span className="font-mono">{item.likes || 0}</span>
        </button>
      </div>
    </div>
  );
}
