import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchProjects, fetchPublications, fetchBlogs, fetchNotes, fetchBrainDumps } from "../data";
import type { Project, Publication, BlogPost, Note, BrainDump } from "../data";
import { SkeletonList, SkeletonCard } from "../components/Skeleton";

function Divider() {
  return <hr className="border-[var(--color-rule)] my-14" />;
}

function SectionLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="text-sm font-light mt-6 inline-block">
      {children} →
    </Link>
  );
}

export default function Home() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [publications, setPublications] = useState<Publication[] | null>(null);
  const [blogs, setBlogs] = useState<BlogPost[] | null>(null);
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [brainDumps, setBrainDumps] = useState<BrainDump[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch everything in parallel
        const [p, pub, b, n, bd] = await Promise.all([
          fetchProjects(),
          fetchPublications(),
          fetchBlogs(),
          fetchNotes(),
          fetchBrainDumps(),
        ]);
        setProjects(p);
        setPublications(pub);
        setBlogs(b);
        setNotes(n);
        setBrainDumps(bd);
      } catch (err: any) {
        console.error("Home loading error:", err);
        setError(err.message);
      }
    };
    loadData();
  }, []);

  return (
    <>
      {/* 1. Greeting */}
      <section id="greeting">
        <h1 className="font-[var(--font-serif)] text-3xl md:text-4xl font-normal leading-tight italic">
          Hello, I'm Suman Mandal🙏
        </h1>
        <div className="mt-6 text-base leading-relaxed text-[var(--color-muted)] space-y-4">
          <p>
            An undergrad student at IIT Madras studying <Link to="/transcript" className="text-[var(--color-ink)] hover:text-[#f34e0c] transition-colors decoration-[var(--color-rule)] underline underline-offset-4">Data Science and Application</Link> and honestly, a guy who's just really obsessed with AI.
          </p>
          <p>
            I work in Machine Learning both building things with it and applying it across different fields. A big part of what I do involves testing and evaluating LLMs and SLMs, along with general software development whenever there's a problem worth solving.</p>
          <p>I like figuring out how things work and building stuff that actually does something useful.</p>
          <p>
            For more about my coding background, <Link to="/resume" className="text-[var(--color-ink)] hover:text-[#f34e0c] transition-colors decoration-[var(--color-rule)] underline underline-offset-4">click here</Link>.
            Curious about the person behind it? Read the <Link to="/about" className="text-[var(--color-ink)] hover:text-[#f34e0c] transition-colors decoration-[var(--color-rule)] underline underline-offset-4">about</Link>.
            And if you want your models tested—I'm serious about that—<Link to="/contact" className="text-[var(--color-ink)] hover:text-[#f34e0c] transition-colors decoration-[var(--color-rule)] underline underline-offset-4">let's talk</Link>.
          </p>
        </div>
      </section>

      {error && (
        <div className="mt-8 p-4 bg-red-900/10 border border-red-900/20 rounded text-red-500 text-sm">
          ⚠ Could not sync latest data. Some content might be slightly outdated.
        </div>
      )}

      <Divider />

      {/* 2. Projects */}
      <section id="projects">
        <p className="text-base leading-relaxed mb-8">
          Along the way, I've built a few things I'm proud of.
        </p>
        {!projects ? (
          <SkeletonList count={3} />
        ) : (
          <ol className="list-none space-y-6">
            {projects.slice(0, 3).map((p, i) => (
              <li key={p.id} className="flex gap-4">
                <span className="text-[var(--color-muted)] text-sm font-mono w-5 shrink-0 mt-1">{i + 1}.</span>
                <div className="flex gap-4 flex-1">
                  {p.imageUrl && (
                    <img src={p.imageUrl} alt="" className="w-16 h-12 rounded object-cover border border-[var(--color-rule)] shrink-0 hidden sm:block" />
                  )}
                  <div>
                    <Link to={"/projects/" + p.id} className="text-base font-medium">
                      {p.title}
                    </Link>
                    <p className="mt-1 text-sm text-[var(--color-muted)] leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
        <SectionLink to="/projects">all projects</SectionLink>
      </section>

      <Divider />

      {/* 3. Blogs */}
      <section id="blogs">
        <p className="text-base leading-relaxed mb-8">
          I also write — long-form, when the thought demands it.
        </p>
        {!blogs ? (
          <SkeletonList count={3} />
        ) : (
          <ol className="list-none space-y-6">
            {blogs.slice(0, 3).map((b, i) => (
              <li key={b.id} className="flex gap-4">
                <span className="text-[var(--color-muted)] text-sm font-mono w-5 shrink-0 mt-1">{i + 1}.</span>
                <div className="flex gap-4 flex-1">
                  {b.imageUrl && (
                    <img src={b.imageUrl} alt="" className="w-16 h-12 rounded object-cover border border-[var(--color-rule)] shrink-0 hidden sm:block" />
                  )}
                  <div>
                    <Link to={"/blogs/" + b.id} className="text-base font-medium">
                      {b.title}
                    </Link>
                    <p className="mt-1 text-sm text-[var(--color-muted)] leading-relaxed">
                      {b.excerpt}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
        <SectionLink to="/blogs">all blogs</SectionLink>
      </section>

      <Divider />

      {/* 4. Publications */}
      <section id="publications">
        <p className="text-base leading-relaxed mb-8">
          Some of this work has found its way into publications.
        </p>
        {!publications ? (
          <SkeletonList count={2} />
        ) : (
          <ol className="list-none space-y-6">
            {publications.slice(0, 3).map((p, i) => (
              <li key={p.id} className="flex gap-3">
                <span className="text-[var(--color-muted)] text-sm font-mono w-5 shrink-0">{i + 1}.</span>
                <div>
                  <Link to={"/publications/" + p.id} className="text-base font-medium">
                    {p.title}
                  </Link>
                  <p className="mt-1 text-sm text-[var(--color-muted)] leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
        <SectionLink to="/publications">all publications</SectionLink>
      </section>

      <Divider />

      {/* 5. Notes */}
      <section id="notes">
        <p className="text-base leading-relaxed mb-8">
          Notes — less polished, more honest. These are opinions, not facts.
        </p>
        {!notes ? (
          <SkeletonList count={2} />
        ) : (
          <ol className="list-none space-y-6">
            {notes.slice(0, 3).map((n, i) => (
              <li key={n.id} className="flex gap-3">
                <span className="text-[var(--color-muted)] text-sm font-mono w-5 shrink-0">{i + 1}.</span>
                <div>
                  <Link to={"/notes/" + n.id} className="text-base font-medium">
                    {n.title}
                  </Link>
                  <p className="mt-1 text-sm text-[var(--color-muted)] leading-relaxed">
                    {n.content}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
        <SectionLink to="/notes">all notes</SectionLink>
      </section>

      <Divider />

      {/* 6. Brain Dump */}
      <section id="brain-dump">
        <p className="text-base leading-relaxed mb-6">
          Brain Dump — fleeting thoughts, barely edited.
        </p>
        {!brainDumps ? (
          <div className="space-y-4 mb-6">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            {brainDumps.slice(0, 3).map((bd) => (
              <div
                key={bd.id}
                className="border border-[var(--color-rule)] rounded-lg p-4 hover:border-[#f34e0c] transition-colors group"
              >
                {/* Category tag */}
                {bd.category && (
                  <Link
                    to={`/brain-dump?category=${bd.category}`}
                    className="inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-[var(--color-rule)] text-[var(--color-muted)] rounded mb-3 hover:bg-[#f34e0c] hover:text-white transition-colors"
                    style={{ textDecoration: 'none' }}
                  >
                    {bd.category}
                  </Link>
                )}

                {/* Title */}
                <Link
                  to={"/brain-dump/" + bd.id}
                  style={{ textDecoration: 'none' }}
                >
                  <h3 className="text-base font-medium text-[var(--color-ink)] group-hover:text-[#f34e0c] transition-colors">
                    {bd.title}
                  </h3>
                </Link>
                {/* Footer */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-[var(--color-rule)]">
                  <span className="text-xs text-[var(--color-muted)] font-mono">{bd.date}</span>
                  <span className="text-xs text-[var(--color-muted)] font-mono flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {bd.likes || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        <SectionLink to="/brain-dump">all brain dumps</SectionLink>
      </section>

      <Divider />

      {/* 7. Painting */}
      <section id="painting">
        <p className="text-base leading-relaxed">
          When I'm not at a screen, I{" "}
          <Link to="/painting" className="font-medium">
            paint
          </Link>
          . It keeps the hands honest and the mind quiet.
        </p>
        <p className="mt-4 text-base leading-relaxed text-[var(--color-muted)]">
          I also write{" "}
          <Link to="/brain-dump?category=poem" className="font-medium text-[var(--color-ink)] hover:text-[#f34e0c] transition-colors">
            poems
          </Link>{" "}
          sometimes — when the paint dries and words don't.
        </p>
      </section>
      <Divider />

      {/* 8. Contact */}
      <section id="contact">
        <p className="text-base leading-relaxed">
          Say hello. I'm most active on{" "}
          <a href="https://linkedin.com/in/sayhitosuman" target="_blank" rel="noreferrer">linkedin</a> and{" "}
          <a href="https://twitter.com/sayhitosuman" target="_blank" rel="noreferrer">x.com</a>.
          Most of my code lives on{" "}
          <a href="https://github.com/sayhitosuman" target="_blank" rel="noreferrer">github</a>.
          You can always reach me at <a href="mailto:sayhitosuman@outlook.com">sayhitosuman@outlook.com</a>.{" "}
          More ways to connect on the{" "}
          <Link to="/contact">contact page</Link>.
        </p>
      </section>
    </>
  );
}

