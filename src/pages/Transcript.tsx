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
                        <p className="text-xs tracking-widest uppercase text-[var(--color-muted)] font-light mb-1">Cumulative Grade Point Average</p>
                        <p className="text-base font-medium">6.5</p>
                        <p className="text-xs text-[var(--color-muted)] mt-1">Jan–May 2026 term</p>
                    </div>
                    <div>
                        <p className="text-xs tracking-widest uppercase text-[var(--color-muted)] font-light mb-1">Completed Credits</p>
                        <p className="text-base font-medium">32</p>
                        <p className="text-xs text-[var(--color-muted)] mt-1">No new credits this term; totals reflect completed foundation-level work through last term.</p>
                    </div>
                </div>

                <div className="pt-8 text-center sm:text-left">
                    <a
                        href="mailto:sayhitosuman@outlook.com?subject=Official%20Transcript%20Request%20-%20Add%20Reason&body=Hello%2C%0D%0A%0D%0AI%20would%20like%20to%20request%20an%20official%20transcript.%20Please%20include%20the%20reason%20for%20this%20request.%0D%0A%0D%0AThank%20you."
                        className="inline-block px-6 py-2 border border-[var(--color-ink)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-white transition-colors text-sm"
                    >
                        Request Official Transcript
                    </a>
                </div>
            </section>
        </>
    );
}
