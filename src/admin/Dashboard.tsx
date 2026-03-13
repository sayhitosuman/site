import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { store } from "./store";

export default function Dashboard() {
  const [counts, setCounts] = useState({ p: 0, b: 0, pub: 0, n: 0, bd: 0, c: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      store.getProjects(),
      store.getBlogs(),
      store.getPublications(),
      store.getNotes(),
      store.getBrainDumps(),
      store.getContacts(),
    ])
      .then(([p, b, pub, n, bd, c]) => {
        setCounts({
          p: p.length,
          b: b.length,
          pub: pub.length,
          n: n.length,
          bd: bd.length,
          c: c.length,
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { to: "/backend/projects", num: counts.p, label: "Projects", hint: "add / edit projects" },
    { to: "/backend/blogs", num: counts.b, label: "Blogs", hint: "long-form writing" },
    { to: "/backend/publications", num: counts.pub, label: "Publications", hint: "research papers" },
    { to: "/backend/notes", num: counts.n, label: "Notes", hint: "opinion pieces" },
    { to: "/backend/brain-dumps", num: counts.bd, label: "Brain Dumps", hint: "micro-thoughts" },
    { to: "/backend/contacts", num: counts.c, label: "Contacts", hint: "social links" },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 4, letterSpacing: "-0.02em" }}>Dashboard</h1>
      <p style={{ fontSize: 12, color: "#555", marginBottom: 32 }}>All content for suman.dev — managed via the Turso API.</p>

      {error && (
        <div style={{ color: "#fca5a5", fontSize: 13, marginBottom: 24, background: "rgba(239, 68, 68, 0.1)", padding: "1.5rem", borderRadius: 8, border: "1px solid rgba(239, 68, 68, 0.2)", display: "flex", alignItems: "start", gap: 14 }}>
          <span style={{ fontSize: 20 }}>⚠</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 14 }}>Connection or Authentication Error</div>
            <div style={{ color: "#fca5a5", fontFamily: "monospace", fontSize: 11, marginBottom: 12, padding: "8px", background: "rgba(0,0,0,0.2)", borderRadius: 4 }}>
              {error}
            </div>

            <div style={{ fontSize: 11, opacity: 0.8, marginBottom: 16, lineHeight: 1.6 }}>
              <strong>Possible fixes:</strong>
              <ul style={{ margin: "8px 0", paddingLeft: "1.2rem" }}>
                <li>Confirm <strong>ADMIN_PASSWORD</strong>, <strong>JWT_SECRET</strong>, <strong>TURSO_URL</strong>, and <strong>TURSO_AUTH_TOKEN</strong> are set in your Render.com Environment Variables.</li>
                <li>Check your <a href="https://sayhitosuman-api.onrender.com/api/health" target="_blank" rel="noreferrer" style={{ color: "#f34e0c" }}>API Health Status</a> — it should say "ok".</li>
                <li>Try logging out and back in manually.</li>
              </ul>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => { localStorage.clear(); window.location.reload(); }}
                style={{ background: "#f34e0c", border: "none", color: "#fff", padding: "6px 14px", borderRadius: 4, fontSize: 11, cursor: "pointer", fontWeight: 600 }}
              >
                Clear All & Restart Session
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{ background: "#2a2d38", border: "none", color: "#ccc", padding: "6px 14px", borderRadius: 4, fontSize: 11, cursor: "pointer" }}
              >
                Retry Connection
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14, marginBottom: 40 }}>
        {cards.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            style={{ background: "#16181f", border: "1px solid #1f2230", borderRadius: 6, padding: "1.4rem", textDecoration: "none", display: "block", transition: "border-color 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "#f34e0c")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "#1f2230")}
          >
            <div style={{ fontSize: 38, fontWeight: 800, color: "#f34e0c", fontFamily: "monospace", lineHeight: 1 }}>
              {loading ? "…" : c.num}
            </div>
            <div style={{ fontSize: 13, color: "#ccc", marginTop: 8, fontWeight: 600 }}>{c.label}</div>
            <div style={{ fontSize: 11, color: "#444", marginTop: 3 }}>{c.hint}</div>
          </Link>
        ))}
      </div>

      <div style={{ background: "#13151c", border: "1px solid #1f2230", borderRadius: 6, padding: "1.4rem 1.6rem", fontSize: 12, color: "#555", lineHeight: 1.9 }}>
        <div style={{ color: "#888", marginBottom: 8, fontWeight: 600, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>How this works</div>
        Data is stored in <code style={{ color: "#f34e0c", background: "#0d0f14", padding: "1px 5px", borderRadius: 3 }}>Turso (SQLite)</code> and
        files are uploaded to <code style={{ color: "#f34e0c", background: "#0d0f14", padding: "1px 5px", borderRadius: 3 }}>Cloudinary</code>.
        The backend runs on <code style={{ color: "#f34e0c", background: "#0d0f14", padding: "1px 5px", borderRadius: 3 }}>Express.js</code> and
        all changes are persisted instantly via the API.
      </div>
    </div>
  );
}
