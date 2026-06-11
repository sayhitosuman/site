const S = [
  { p: "Email", u: "mailto:sayhitosuman@outlook.com", g: 0, c: "#EA4335",
    v: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg> },
  { p: "GitHub", u: "https://github.com/sayhitosuman", g: 1, c: "#333",
    v: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.5.338c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg> },
  { p: "LinkedIn", u: "https://linkedin.com/in/sayhitosuman", g: 1, c: "#0A66C2",
    v: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg> },
  { p: "LeetCode", u: "https://leetcode.com/sayhitosuman", g: 1, c: "#FFA116",
    v: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515.528 1.364.015 1.878-.515.515-1.358.5-1.873-.015L13.3 12.1c-.309-.309-.747-.402-1.162-.291-.415.112-.717.432-.817.852-.036.15-.063.418-.063.658 0 .24.027.508.063.658.1.42.402.74.817.852.415.111.853.018 1.162-.291l2.697-2.607c.514-.515 1.357-.53 1.873-.015.515.515.5 1.364-.015 1.878zm-6.851-9.7h5.253a1.75 1.75 0 010 3.5H9.251a1.75 1.75 0 010-3.5z" /></svg> },
  { p: "HackerRank", u: "https://hackerrank.com/sayhitosuman", g: 1, c: "#00EA64",
    v: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.5 14.5h-3.5v-2h1.5v-5h-1.5V8h3.5v1.5H16v5h1.5v2zm-4-4h-3v2h2.5v1.5H8.5V10h3V8.5h-5V14h3v-2h2.5v1.5H11V16h2.5v-3.5z" /></svg> },
  { p: "X", u: "https://twitter.com/sayhitosuman", g: 2, c: "#000",
    v: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg> },
  { p: "Instagram", u: "https://instagram.com/sayhitosuman", g: 2, c: "#E4405F",
    v: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg> },
  { p: "YouTube", u: "https://youtube.com/@sayhitosuman", g: 2, c: "#FF0000",
    v: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg> },
  { p: "Discord", u: "https://discord.com/users/sayhitosuman", g: 2, c: "#5865F2",
    v: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" /></svg> },
  { p: "Google", u: "https://www.google.com/search?q=sayhitosuman", g: 3, c: "#4285F4",
    v: <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg> },
];

const GRP = ["write to me", "dev & work", "social & thoughts", "elsewhere"];

export default function Contact() {
  return (
    <>
      <p className="text-xs uppercase tracking-[0.35em] text-muted font-light">Connect</p>
      <h1 className="font-[var(--font-serif)] text-3xl font-bold tracking-tight mt-2 mb-6">Contact</h1>

      <div className="flex gap-6 mb-5">
        {[0, 3].map(i => (
          <div key={i} className="flex-1">
            <p className="text-[11px] uppercase tracking-[0.3em] text-muted font-light mb-2.5 ml-1">{GRP[i]}</p>
            <div className="grid gap-1">
              {S.filter(s => s.g === i).map(s => (
                <a key={s.p} href={s.u} target={s.u.startsWith("mailto") ? undefined : "_blank"} rel="noreferrer"
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg group no-underline transition-colors hover:bg-ink/5">
                  <span className="w-8 h-8 flex items-center justify-center shrink-0" style={{ color: s.c }}>
                    {s.v}
                  </span>
                  <span className="text-sm font-medium text-ink group-hover:text-[#f34e0c] transition-colors">{s.p}</span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {[1, 2].map(i => (
        <div key={i} className="mb-5">
          <p className="text-[11px] uppercase tracking-[0.3em] text-muted font-light mb-2.5 ml-1">{GRP[i]}</p>
          <div className="grid grid-cols-2 gap-1">
            {S.filter(s => s.g === i).map(s => (
              <a key={s.p} href={s.u} target={s.u.startsWith("mailto") ? undefined : "_blank"} rel="noreferrer"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg group no-underline transition-colors hover:bg-ink/5">
                <span className="w-8 h-8 flex items-center justify-center shrink-0" style={{ color: s.c }}>
                  {s.v}
                </span>
                <span className="text-sm font-medium text-ink group-hover:text-[#f34e0c] transition-colors">{s.p}</span>
              </a>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}