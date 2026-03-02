import { Link } from "react-router-dom";

export default function Resume() {
    return (
        <>
            <section id="resume-heading">
                <h1 className="font-[var(--font-serif)] text-3xl italic">
                    Coding Background.
                </h1>
                <p className="mt-6 text-base leading-relaxed text-[var(--color-muted)]">
                    The technical summary of my professional journey, skills, and work.
                </p>
            </section>

            <hr className="border-[var(--color-rule)] my-12" />

            {/* Skills Section */}
            <section id="skills" className="space-y-12">
                <h2 className="text-sm tracking-widest uppercase text-[var(--color-muted)] font-light">Technical Stack</h2>

                <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <h3 className="text-base font-medium mb-4">Data Science & AI</h3>
                        <div className="space-y-2 text-sm text-[var(--color-muted)]">
                            <p><span className="text-[var(--color-ink)] font-mono text-xs">Languages:</span> Python, R</p>
                            <p><span className="text-[var(--color-ink)] font-mono text-xs">Libraries:</span> NumPy, Pandas, Matplotlib, Seaborn, Scikit-learn</p>
                            <p><span className="text-[var(--color-ink)] font-mono text-xs">AI/ML:</span> LLM/SLM Evaluation, Prompt Engineering, Predictive Modeling</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-base font-medium mb-4">Web Development</h3>
                        <div className="space-y-2 text-sm text-[var(--color-muted)]">
                            <p><span className="text-[var(--color-ink)] font-mono text-xs">Frontend:</span> Next.js, React, Tailwind CSS, TypeScript</p>
                            <p><span className="text-[var(--color-ink)] font-mono text-xs">Backend:</span> Node.js, Express, REST APIs</p>
                            <p><span className="text-[var(--color-ink)] font-mono text-xs">State:</span> Redux, Context API</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-base font-medium mb-4">Database & Infrastructure</h3>
                        <div className="space-y-2 text-sm text-[var(--color-muted)]">
                            <p><span className="text-[var(--color-ink)] font-mono text-xs">Databases:</span> MySQL, MongoDB, PostgreSQL, SQLite</p>
                            <p><span className="text-[var(--color-ink)] font-mono text-xs">Tools:</span> Git, Docker, Vercel, Cloudinary</p>
                            <p><span className="text-[var(--color-ink)] font-mono text-xs">Environment:</span> Linux, Bash scripting</p>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-[var(--color-rule)] my-12" />

            <section id="projects-link" className="p-8 border border-[var(--color-rule)] rounded-lg text-center bg-[var(--color-rule)]/10">
                <p className="text-base font-medium mb-4">Want to see what I've built?</p>
                <Link
                    to="/projects"
                    className="inline-block px-6 py-2 border border-[var(--color-ink)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-white transition-colors text-sm"
                >
                    View All Projects
                </Link>
            </section>

            <hr className="border-[var(--color-rule)] my-12" />

            <section id="downloads" className="space-y-8">
                <div>
                    <h2 className="text-sm tracking-widest uppercase text-[var(--color-muted)] font-light mb-6">Downloads</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <a
                            href="/resume.pdf"
                            className="flex items-center justify-between p-4 border border-[var(--color-rule)] rounded-lg hover:border-[#f34e0c] transition-colors group"
                            target="_blank"
                        >
                            <div>
                                <span className="block text-base font-medium group-hover:text-[#f34e0c]">Resume / CV</span>
                                <span className="text-xs text-[var(--color-muted)]">One-page professional summary</span>
                            </div>
                            <svg className="w-5 h-5 text-[var(--color-muted)] group-hover:text-[#f34e0c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                        </a>
                        <a
                            href="/detailed_cv.pdf"
                            className="flex items-center justify-between p-4 border border-[var(--color-rule)] rounded-lg hover:border-[#f34e0c] transition-colors group"
                            target="_blank"
                        >
                            <div>
                                <span className="block text-base font-medium group-hover:text-[#f34e0c]">Detailed CV</span>
                                <span className="text-xs text-[var(--color-muted)]">Full list of projects and experiences</span>
                            </div>
                            <svg className="w-5 h-5 text-[var(--color-muted)] group-hover:text-[#f34e0c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                        </a>
                    </div>
                </div>
            </section>

            <hr className="border-[var(--color-rule)] my-12" />

            <section id="quick-links">
                <h2 className="text-sm tracking-widest uppercase text-[var(--color-muted)] font-light mb-6">Online Presence</h2>
                <div className="space-y-3">
                    <div className="flex items-baseline gap-4">
                        <span className="text-xs text-[var(--color-muted)] w-24 shrink-0 font-light">LinkedIn</span>
                        <a href="https://linkedin.com/in/sayhitosuman" target="_blank" rel="noreferrer" className="text-base underline underline-offset-4 decoration-[var(--color-rule)] hover:decoration-[#f34e0c]">linkedin.com/in/sayhitosuman</a>
                    </div>
                    <div className="flex items-baseline gap-4">
                        <span className="text-xs text-[var(--color-muted)] w-24 shrink-0 font-light">GitHub</span>
                        <a href="https://github.com/sayhitosuman" target="_blank" rel="noreferrer" className="text-base underline underline-offset-4 decoration-[var(--color-rule)] hover:decoration-[#f34e0c]">github.com/sayhitosuman</a>
                    </div>
                </div>
            </section>
        </>
    );
}
