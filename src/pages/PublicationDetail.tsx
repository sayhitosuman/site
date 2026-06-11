import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchPublications, getPublications } from "../data";
import type { Publication } from "../data";
import MarkdownContent from "../components/MarkdownContent";
import { SkeletonLine } from "../components/Skeleton";

// ── Chapter parsing ──────────────────────────────────────────
interface Chapter {
  title: string;
  body: string;
}

function parseChapters(content: string): Chapter[] {
  if (!content || !content.trim()) return [];
  // Split on ## headings (h2)
  const parts = content.split(/^(?=## )/gm);
  const chapters: Chapter[] = [];
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const match = trimmed.match(/^## (.+)/);
    if (match) {
      chapters.push({
        title: match[1].trim(),
        body: trimmed,
      });
    } else if (chapters.length === 0) {
      // Content before the first ## heading → treat as intro chapter
      chapters.push({ title: "Introduction", body: trimmed });
    }
  }
  return chapters;
}

// ── LocalStorage helpers ─────────────────────────────────────
function getLastChapter(pubId: string): number {
  try {
    const v = localStorage.getItem(`lastChapter_${pubId}`);
    return v ? parseInt(v, 10) : 0;
  } catch { return 0; }
}
function setLastChapter(pubId: string, idx: number) {
  try { localStorage.setItem(`lastChapter_${pubId}`, String(idx)); } catch {}
}

export default function PublicationDetail() {
  const { id } = useParams<{ id: string }>();
  const cached = getPublications();
  const [pub, setPub] = useState<Publication | null>(cached.find((p) => p.id === id) || null);
  const [loading, setLoading] = useState(pub === null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);

  useEffect(() => {
    fetchPublications().then((all) => {
      const found = all.find((p) => p.id === id) || null;
      setPub(found);
      if (found && id) {
        setCurrentChapter(getLastChapter(id));
      }
      setLoading(false);
    });
  }, [id]);

  const chapters = useMemo(() => {
    if (!pub?.content) return [];
    return parseChapters(pub.content);
  }, [pub?.content]);

  const hasChapters = chapters.length > 1;

  const goToChapter = useCallback((idx: number) => {
    setCurrentChapter(idx);
    if (id) setLastChapter(id, idx);
    setTocOpen(false);
    // Scroll to top of content
    document.getElementById("chapter-content")?.scrollTo(0, 0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (loading) {
    return (
      <div className="animate-in fade-in duration-500 max-w-2xl mx-auto">
        <SkeletonLine width="100px" height="12px" margin="0 0 32px 0" />
        <SkeletonLine width="150px" height="10px" margin="0 0 16px 0" />
        <SkeletonLine width="90%" height="28px" margin="0 0 12px 0" />
        <SkeletonLine width="60%" height="16px" margin="0 0 40px 0" />
        <div className="w-full h-[1px] bg-[var(--color-rule)] mb-8 opacity-30" />
        <SkeletonLine width="80px" height="10px" margin="0 0 20px 0" />
        <SkeletonLine width="100%" height="14px" margin="0 0 8px 0" />
        <SkeletonLine width="100%" height="14px" margin="0 0 8px 0" />
        <SkeletonLine width="95%" height="14px" margin="0 0 8px 0" />
      </div>
    );
  }

  if (!pub) {
    return (
      <>
        <Link to="/publications" className="text-xs text-[var(--color-muted)] no-underline hover:text-[var(--color-ink)]">
          ← back to resources
        </Link>
        <p className="mt-12 text-[var(--color-muted)]">Resource not found.</p>
      </>
    );
  }

  const safeChapterIdx = Math.min(currentChapter, Math.max(chapters.length - 1, 0));

  return (
    <>
      <Link to="/publications" className="text-xs text-[var(--color-muted)] no-underline hover:!text-[var(--color-ink)]">
        ← back to resources
      </Link>

      <div className="mt-8 max-w-2xl mx-auto">
        {/* Header */}
        <p className="text-[10px] tracking-[0.15em] text-[var(--color-muted)] uppercase mb-3">
          {pub.year}
        </p>

        <h1 className="font-[var(--font-serif)] text-2xl italic leading-snug">
          {pub.title}
        </h1>

        <hr className="border-[var(--color-rule)] my-8" />

        {/* Abstract — compact */}
        {(pub.abstract || pub.description) && (
          <div className="mb-8">
            <p className="text-[10px] tracking-[0.15em] text-[var(--color-muted)] uppercase mb-3">
              Abstract
            </p>
            <div className="text-sm leading-relaxed text-[var(--color-muted)]">
              <MarkdownContent content={pub.abstract || pub.description} />
            </div>
          </div>
        )}

        {/* Chapter Content */}
        {hasChapters ? (
          <>
            {/* Chapter TOC — collapsible top panel */}
            <div className="mb-6">
              <button
                onClick={() => setTocOpen(!tocOpen)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-[var(--color-rule)] bg-[var(--color-cream)] hover:border-[#3a5f73] transition-all duration-200 no-underline"
                style={{ textDecoration: 'none' }}
              >
                <span className="text-[10px] tracking-[0.15em] text-[var(--color-muted)] uppercase">
                  Chapter {safeChapterIdx + 1} of {chapters.length}: {chapters[safeChapterIdx]?.title}
                </span>
                <span className="text-[var(--color-muted)] text-xs transition-transform duration-200" style={{ transform: tocOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  ▾
                </span>
              </button>

              {tocOpen && (
                <div className="mt-1 border border-[var(--color-rule)] rounded-lg overflow-hidden bg-[var(--color-cream)]" style={{ animation: 'fadeSlideDown 0.2s ease' }}>
                  {chapters.map((ch, i) => (
                    <button
                      key={i}
                      onClick={() => goToChapter(i)}
                      className="w-full text-left px-4 py-2.5 text-sm transition-all duration-150 no-underline flex items-center gap-3"
                      style={{
                        textDecoration: 'none',
                        background: i === safeChapterIdx ? 'var(--color-rule)' : 'transparent',
                        color: i === safeChapterIdx ? 'var(--color-ink)' : 'var(--color-muted)',
                        fontWeight: i === safeChapterIdx ? 500 : 300,
                        borderBottom: i < chapters.length - 1 ? '1px solid var(--color-rule)' : 'none',
                      }}
                    >
                      <span className="font-mono text-[10px] opacity-50 w-5 shrink-0">{i + 1}</span>
                      {ch.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Current chapter content */}
            <div id="chapter-content" className="text-base leading-loose text-[var(--color-ink)] min-h-[200px]">
              <MarkdownContent content={chapters[safeChapterIdx]?.body || ""} />
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-12 pt-6 border-t border-[var(--color-rule)]">
              {safeChapterIdx > 0 ? (
                <button
                  onClick={() => goToChapter(safeChapterIdx - 1)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--color-rule)] text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:border-[#3a5f73] transition-all duration-200 no-underline"
                  style={{ textDecoration: 'none' }}
                >
                  <span>←</span>
                  <span className="max-w-[200px] truncate">{chapters[safeChapterIdx - 1].title}</span>
                </button>
              ) : <div />}
              
              {safeChapterIdx < chapters.length - 1 ? (
                <button
                  onClick={() => goToChapter(safeChapterIdx + 1)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--color-rule)] text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:border-[#3a5f73] transition-all duration-200 no-underline ml-auto"
                  style={{ textDecoration: 'none' }}
                >
                  <span className="max-w-[200px] truncate">{chapters[safeChapterIdx + 1].title}</span>
                  <span>→</span>
                </button>
              ) : (
                <div className="text-xs text-[var(--color-muted)] italic ml-auto">End of resource</div>
              )}
            </div>

            {/* Chapter progress indicator */}
            <div className="mt-4 flex gap-1">
              {chapters.map((_, i) => (
                <div
                  key={i}
                  className="h-[2px] flex-1 rounded-full transition-all duration-300 cursor-pointer"
                  style={{
                    background: i <= safeChapterIdx ? '#f34e0c' : 'var(--color-rule)',
                    opacity: i <= safeChapterIdx ? 1 : 0.4,
                  }}
                  onClick={() => goToChapter(i)}
                  title={chapters[i].title}
                />
              ))}
            </div>
          </>
        ) : (
          /* No chapters — show full content as single page */
          pub.content && pub.content.trim().length > 0 && (
            <div className="text-base leading-loose text-[var(--color-ink)]">
              <MarkdownContent content={pub.content} />
            </div>
          )
        )}

        {/* External link */}
        {pub.link && pub.link !== "#" && (
          <div className="mt-10 pt-6 border-t border-[var(--color-rule)]">
            <a href={pub.link} target="_blank" rel="noreferrer" className="text-sm">
              View external resource ↗
            </a>
          </div>
        )}
      </div>

      {/* Animation keyframe */}
      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
