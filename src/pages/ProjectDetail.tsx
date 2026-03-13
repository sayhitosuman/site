import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProjects } from "../data";
import type { Project } from "../data";
import MarkdownContent from "../components/MarkdownContent";
import { SkeletonLine } from "../components/Skeleton";

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
      <div className="animate-in fade-in duration-500">
        <SkeletonLine width="100px" height="12px" margin="0 0 32px 0" />
        <SkeletonLine width="60%" height="32px" margin="0 0 24px 0" />
        <div className="aspect-video w-full bg-[var(--color-rule)] animate-pulse rounded-lg opacity-20 mb-8" />
        <SkeletonLine width="90%" height="16px" margin="0 0 8px 0" />
        <SkeletonLine width="85%" height="16px" margin="0 0 8px 0" />
        <SkeletonLine width="70%" height="16px" margin="0 0 40px 0" />
        <div className="flex gap-2">
          <div className="w-16 h-8 bg-[var(--color-rule)] animate-pulse rounded opacity-20" />
          <div className="w-16 h-8 bg-[var(--color-rule)] animate-pulse rounded opacity-20" />
          <div className="w-16 h-8 bg-[var(--color-rule)] animate-pulse rounded opacity-20" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <>
        <Link to="/projects" className="text-xs text-[var(--color-muted)] no-underline hover:text-[var(--color-ink)]">
          ← back to projects
        </Link>
        <p className="mt-12 text-[var(--color-muted)]">Project not found.</p>
      </>
    );
  }

  return (
    <>
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
    </>
  );
}

