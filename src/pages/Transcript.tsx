export default function Transcript() {
    return (
        <>
            <section id="transcript-heading">
                <h1 className="font-[var(--font-serif)] text-3xl italic">
                    Academic Transcript.
                </h1>
                <p className="mt-6 text-base leading-relaxed text-[var(--color-muted)]">
                    Undergraduate student at IIT Madras, pursuing a Bachelor's in Data Science and Applications.
                </p>
            </section>

            <hr className="border-[var(--color-rule)] my-12" />

            <section id="transcript-details" className="max-w-2xl space-y-12">
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <p className="text-xs tracking-widest uppercase text-[var(--color-muted)] font-light mb-1">Degree</p>
                        <p className="text-base font-medium">B.S. (Hons) in Data Science & Applications</p>
                    </div>
                    <div>
                        <p className="text-xs tracking-widest uppercase text-[var(--color-muted)] font-light mb-1">Institution</p>
                        <p className="text-base font-medium">IIT Madras</p>
                    </div>
                    <div>
                        <p className="text-xs tracking-widest uppercase text-[var(--color-muted)] font-light mb-1">Current Credits</p>
                        <p className="text-base font-medium">32</p>
                    </div>
                    <div>
                        <p className="text-xs tracking-widest uppercase text-[var(--color-muted)] font-light mb-1">CGPA</p>
                        <p className="text-base font-medium text-[var(--color-muted)] italic">Pending</p>
                    </div>
                </div>

                <div>
                    <h2 className="text-sm tracking-widest uppercase text-[var(--color-muted)] font-light mb-6">Foundation Level</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[var(--color-rule)]">
                                    <th className="py-3 text-xs font-mono uppercase text-[var(--color-muted)] w-24">Code</th>
                                    <th className="py-3 text-xs font-mono uppercase text-[var(--color-muted)]">Course Name</th>
                                    <th className="py-3 text-xs font-mono uppercase text-[var(--color-muted)] text-center w-20">Credits</th>
                                    <th className="py-3 text-xs font-mono uppercase text-[var(--color-muted)] text-right w-20">Grade</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {[
                                    { code: "BSMA1001", name: "Mathematics for Data Science I", credits: 4 },
                                    { code: "BSMA1002", name: "Statistics for Data Science I", credits: 4 },
                                    { code: "BSCS1001", name: "Computational Thinking", credits: 4 },
                                    { code: "BSHS1001", name: "English I", credits: 4 },
                                    { code: "BSMA1003", name: "Mathematics for Data Science II", credits: 4 },
                                    { code: "BSMA1004", name: "Statistics for Data Science II", credits: 4 },
                                    { code: "BSCS1002", name: "Programming in Python", credits: 4 },
                                    { code: "BSHS1002", name: "English II", credits: 4 },
                                ].map((c) => (
                                    <tr key={c.code} className="border-b border-[var(--color-rule)]/30 hover:bg-[var(--color-rule)]/10 transition-colors">
                                        <td className="py-4 font-mono text-xs">{c.code}</td>
                                        <td className="py-4 text-[var(--color-muted)]">{c.name}</td>
                                        <td className="py-4 text-center font-mono text-xs">{c.credits}</td>
                                        <td className="py-4 text-right font-mono text-xs italic text-[var(--color-muted)]">Pending</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="text-sm text-[var(--color-muted)] leading-relaxed italic">
                        I am currently in the Foundation Level of the program. As examinations have not yet been conducted for these courses, the grades are marked as Pending.
                    </p>
                    <p className="text-xs text-[var(--color-muted)] opacity-60">
                        * This is a web view of my academic record. Official transcripts available upon request.
                    </p>
                </div>

                <div className="pt-8 text-center sm:text-left">
                    <a
                        href="mailto:sayhitosuman@outlook.com?subject=Transcript Request"
                        className="inline-block px-6 py-2 border border-[var(--color-ink)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-white transition-colors text-sm"
                    >
                        Request Official Transcript
                    </a>
                </div>
            </section>
        </>
    );
}
