import { Link } from "react-router-dom";

export default function Resume() {
    return (
        <>
            <section id="resume-heading" className="max-w-3xl mx-auto">
                <div className="mb-12">
                    <p className="text-sm uppercase tracking-[0.35em] text-muted font-light">Resume</p>
                    <h1 className="font-[var(--font-serif)] text-4xl md:text-5xl font-bold tracking-tight mt-4">
                        Suman Mandal
                    </h1>
                    <p className="mt-3 text-base text-muted max-w-2xl leading-relaxed">
                        Data Science & Applications student at IIT Madras with experience in AI research, full-stack product development, and LLM evaluation. I build polished web products and data-driven tools for real-world workflows.
                    </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                    <div className="rounded-2xl border-2 border-ink/15 bg-cream p-5">
                        <p className="text-xs uppercase tracking-[0.35em] text-muted font-light mb-3">Degree</p>
                        <p className="text-base font-semibold text-ink">B.S. (Hons) in Data Science & Applications</p>
                    </div>
                    <div className="rounded-2xl border-2 border-ink/15 bg-cream p-5">
                        <p className="text-xs uppercase tracking-[0.35em] text-muted font-light mb-3">Institution</p>
                        <p className="text-base font-semibold text-ink">IIT Madras</p>
                    </div>
                    <div className="rounded-2xl border-2 border-ink/15 bg-cream p-5">
                        <p className="text-xs uppercase tracking-[0.35em] text-muted font-light mb-3">CGPA</p>
                        <p className="text-base font-semibold text-ink">6.5</p>
                        <p className="text-xs text-muted mt-2">Jan–May 2026 term</p>
                    </div>
                </div>
            </section>

            <hr className="border-rule my-16" />

            <section id="summary" className="max-w-3xl mx-auto space-y-8">
                <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
                    <div className="space-y-6">
                        <div>
                            <p className="text-sm uppercase tracking-[0.35em] text-muted font-light mb-3">Professional Summary</p>
                            <p className="text-base leading-relaxed text-ink">
                                I build meaningful software systems that combine data science, AI evaluation, and clean user experiences. My focus is on practical ML products that are easy to understand, test, and deploy.
                            </p>
                        </div>
                        <div>
                            <p className="text-sm uppercase tracking-[0.35em] text-muted font-light mb-3">Highlights</p>
                            <ul className="list-disc space-y-2 pl-5 text-sm text-muted leading-relaxed">
                                <li>Built full-stack projects using React, TypeScript, Node.js, and PostgreSQL.</li>
                                <li>Designed LLM/SLM evaluation workflows for prompt testing and model comparison.</li>
                                <li>Delivered polished interfaces with Tailwind CSS and responsive design.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="rounded-3xl border-2 border-ink/15 bg-cream p-6">
                        <p className="text-sm uppercase tracking-[0.35em] text-muted font-light mb-4">Contact</p>
                        <div className="space-y-5 text-sm text-ink">
                            <div>
                                <p className="font-semibold text-ink">Email</p>
                                <p className="text-muted mt-0.5">sayhitosuman@outlook.com</p>
                            </div>
                            <div>
                                <p className="font-semibold text-ink">LinkedIn</p>
                                <a href="https://linkedin.com/in/sayhitosuman" target="_blank" rel="noreferrer" className="text-muted underline underline-offset-4 decoration-rule hover:decoration-[#f34e0c] mt-0.5 block">linkedin.com/in/sayhitosuman</a>
                            </div>
                            <div>
                                <p className="font-semibold text-ink">GitHub</p>
                                <a href="https://github.com/sayhitosuman" target="_blank" rel="noreferrer" className="text-muted underline underline-offset-4 decoration-rule hover:decoration-[#f34e0c] mt-0.5 block">github.com/sayhitosuman</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-rule my-16" />

            <section id="skills" className="max-w-3xl mx-auto space-y-10">
                <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-muted font-light mb-6">Technical Stack</p>
                    <div className="grid gap-5 md:grid-cols-3">
                        <div className="rounded-3xl border-2 border-ink/15 bg-cream p-6">
                            <h3 className="text-base font-bold text-ink mb-3">Data Science</h3>
                            <p className="text-sm leading-relaxed text-muted">
                                Python, Pandas, NumPy, Scikit-learn, Matplotlib, Seaborn, R
                            </p>
                        </div>
                        <div className="rounded-3xl border-2 border-ink/15 bg-cream p-6">
                            <h3 className="text-base font-bold text-ink mb-3">AI & Evaluation</h3>
                            <p className="text-sm leading-relaxed text-muted">
                                LLM/SLM testing, prompt engineering, model benchmarking, evaluation pipelines
                            </p>
                        </div>
                        <div className="rounded-3xl border-2 border-ink/15 bg-cream p-6">
                            <h3 className="text-base font-bold text-ink mb-3">Web & Backend</h3>
                            <p className="text-sm leading-relaxed text-muted">
                                React, Next.js, TypeScript, Node.js, Express, Tailwind CSS, APIs, Git
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-rule my-16" />

            <section id="projects-link" className="max-w-3xl mx-auto p-8 rounded-3xl border-2 border-ink/15 bg-cream">
                <div className="flex flex-col gap-5 sm:flex-row sm:justify-between sm:items-center">
                    <div>
                        <p className="text-sm uppercase tracking-[0.35em] text-muted font-light mb-2">Featured Work</p>
                        <p className="text-base font-medium text-ink">Explore projects that combine AI, data, and web design.</p>
                    </div>
                    <Link
                        to="/projects"
                        className="inline-flex items-center justify-center rounded-full bg-[#f34e0c] px-6 py-3 text-sm font-semibold !text-white transition-colors hover:bg-[#d44206]"
                    >
                        View Projects
                    </Link>
                </div>
            </section>

            <hr className="border-rule my-16" />

            <section id="downloads" className="max-w-3xl mx-auto space-y-8">
                <p className="text-sm uppercase tracking-[0.35em] text-muted font-light">Downloads</p>
                <div className="grid gap-5 sm:grid-cols-2">
                    <a
                        href="/resume.pdf"
                        className="group rounded-3xl border-2 border-dashed border-ink/15 bg-cream p-6 transition hover:border-[#f34e0c] hover:bg-[#f34e0c]/5"
                        target="_blank"
                    >
                        <p className="text-base font-semibold text-ink group-hover:text-[#f34e0c]">Resume / CV</p>
                        <p className="text-sm text-muted mt-2">One-page summary for recruiters.</p>
                    </a>
                    <a
                        href="/detailed_cv.pdf"
                        className="group rounded-3xl border-2 border-dashed border-ink/15 bg-cream p-6 transition hover:border-[#f34e0c] hover:bg-[#f34e0c]/5"
                        target="_blank"
                    >
                        <p className="text-base font-semibold text-ink group-hover:text-[#f34e0c]">Detailed CV</p>
                        <p className="text-sm text-muted mt-2">Complete project and experience portfolio.</p>
                    </a>
                </div>
            </section>
        </>
    );
}
