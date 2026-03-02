import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { fetchProjects } from "../data";
import type { Project } from "../data";
import MarkdownContent from "../components/MarkdownContent";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects().then((all) => {
      setProject(all.find((p) => p.id === id) || null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <p className="text-[var(--color-muted)] animate-pulse">Loading…</p>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <Link to="/projects" className="text-xs text-[var(--color-muted)] no-underline hover:text-[var(--color-ink)]">
          ← back to projects
        </Link>
        <p className="mt-12 text-[var(--color-muted)]">Project not found.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <Link to="/projects" className="text-xs text-[var(--color-muted)] no-underline hover:!text-[var(--color-ink)]">
        ← back to projects
      </Link>

      <div className="mt-8">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h1 className="font-[var(--font-serif)] text-3xl italic">{project.title}</h1>
          {project.status && (
            <span className="text-xs text-[var(--color-muted)] border border-[var(--color-rule)] px-2 py-0.5 rounded-sm">
              {project.status}
            </span>
          )}
        </div>

        {project.imageUrl && (
          <img src={project.imageUrl} alt={project.title} className="w-full h-auto mt-6 rounded-lg border border-[var(--color-rule)] shadow-sm" />
        )}

        <p className="mt-6 text-sm leading-relaxed text-[var(--color-muted)] font-serif italic">
          {project.description}
        </p>

        {project.longDescription && (
          <div className="mt-8 max-w-none text-sm leading-loose">
            <MarkdownContent content={project.longDescription} />
          </div>
        )}

        {project.tech && (
          <div className="mt-10">
            <p className="text-[10px] tracking-[0.15em] text-[var(--color-muted)] uppercase mb-3">
              Built with
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="text-xs border border-[var(--color-rule)] px-2.5 py-1 text-[var(--color-muted)]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 flex flex-col gap-3">
          {project.sourceCode && (
            <div className="flex items-center gap-3">
              <span className="text-[10px] tracking-[0.15em] text-[var(--color-muted)] uppercase w-24">
                Source
              </span>
              <a href={project.sourceCode} target="_blank" rel="noreferrer" className="text-sm">
                {project.sourceCode.replace("https://", "")}
              </a>
            </div>
          )}
          {project.liveUrl && (
            <div className="flex items-center gap-3">
              <span className="text-[10px] tracking-[0.15em] text-[var(--color-muted)] uppercase w-24">
                Live
              </span>
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-sm">
                {project.liveUrl.replace("https://", "")}
              </a>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
