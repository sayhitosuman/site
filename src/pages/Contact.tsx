import Layout from "../components/Layout";

const SOCIALS = [
  { platform: "Email", url: "mailto:sayhitosuman@outlook.com", label: "sayhitosuman@outlook.com", group: "write to me" },
  { platform: "GitHub", url: "https://github.com/sayhitosuman", label: "github.com/sayhitosuman", group: "dev & work" },
  { platform: "LinkedIn", url: "https://linkedin.com/in/sayhitosuman", label: "linkedin.com/in/sayhitosuman", group: "dev & work" },
  { platform: "LeetCode", url: "https://leetcode.com/sayhitosuman", label: "leetcode", group: "dev & work" },
  { platform: "HackerRank", url: "https://hackerrank.com/sayhitosuman", label: "hackerrank", group: "dev & work" },
  { platform: "Twitter / X", url: "https://twitter.com/sayhitosuman", label: "twitter.com/sayhitosuman", group: "social & thoughts" },
  { platform: "Instagram", url: "https://instagram.com/sayhitosuman", label: "instagram", group: "social & thoughts" },
  { platform: "YouTube", url: "https://youtube.com/@sayhitosuman", label: "youtube", group: "social & thoughts" },
  { platform: "Discord", url: "https://discord.com/users/sayhitosuman", label: "discord", group: "social & thoughts" },
  { platform: "Google", url: "https://www.google.com/search?q=sayhitosuman", label: "google", group: "elsewhere" },
];

const groups = [
  {
    label: "write to me",
    note: "Email is the best way. I read everything and usually reply within 24 hours.",
  },
  {
    label: "dev & work",
    note: "GitHub is where all my code lives. LinkedIn is where I maintain my professional network.",
  },
  {
    label: "social & thoughts",
    note: "I'm quite active on X (Twitter). Others are mostly for presence.",
  },
  {
    label: "elsewhere",
    note: "A few other places you might find my name.",
  },
];

export default function Contact() {
  return (
    <>
      <section id="contact-heading">
        <h1 className="font-[var(--font-serif)] text-3xl italic">
          Contact.
        </h1>
        <p className="mt-5 text-base leading-relaxed text-[var(--color-muted)]">
          I'm generally reachable. No cold pitches, but genuine conversation is
          always welcome — about work, ideas, or just something you found
          interesting.
        </p>
      </section>

      <hr className="border-[var(--color-rule)] my-12" />

      <div className="space-y-12">
        {groups.map((g) => (
          <section key={g.label}>
            <p className="text-xs tracking-widest uppercase text-[var(--color-muted)] font-light mb-5">
              {g.label}
            </p>
            <div className="space-y-3">
              {SOCIALS.filter(s => s.group === g.label).map((s) => (
                <div key={s.platform} className="flex items-baseline gap-4">
                  <span className="text-xs text-[var(--color-muted)] w-24 shrink-0 font-light">
                    {s.platform}
                  </span>
                  <a
                    href={s.url}
                    target={s.url.startsWith("mailto") ? undefined : "_blank"}
                    rel="noreferrer"
                    className="text-base"
                  >
                    {s.label}
                  </a>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-[var(--color-muted)] leading-relaxed font-light italic">
              {g.note}
            </p>
          </section>
        ))}
      </div>

      <hr className="border-[var(--color-rule)] my-12" />

      <section className="mb-10">
        <p className="text-sm text-[var(--color-muted)] leading-relaxed">
          Response time varies. If it's urgent, say so in the subject line.
          If it's not, I'll get to it when I do.
        </p>
      </section>
    </>
  );
}
