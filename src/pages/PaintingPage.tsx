import { Link } from "react-router-dom";

export default function PaintingPage() {
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
      <p className="mt-4 text-sm text-[var(--color-muted)] leading-relaxed">
        I mostly work with watercolors and ink. Landscapes, abstracts, and
        the occasional portrait of someone who didn't ask for one.
      </p>
      <div className="mt-10 space-y-6">
        <div className="border border-[var(--color-rule)] rounded p-6 text-center">
          <p className="text-xs text-[var(--color-muted)] italic font-light">
            Gallery coming soon. For now, imagine something beautiful here.
          </p>
        </div>
      </div>
      <p className="mt-8 text-sm text-[var(--color-muted)] leading-relaxed">
        If you'd like a painting or want to talk about art, just{" "}
        <a href="mailto:hello@suman.dev">say hello</a>.
      </p>
    </>
  );
}
