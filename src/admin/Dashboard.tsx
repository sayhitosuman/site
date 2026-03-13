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
        <div style={{ color: "#fca5a5", fontSize: 13, marginBottom: 24, background: "rgba(239, 68, 68, 0.1)", padding: "1rem", borderRadius: 8, border: "1px solid rgba(239, 68, 68, 0.2)", display: "flex", alignItems: "start", gap: 10 }}>
          <span style={{ fontSize: 16 }}>⚠</span>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>API Error: {error}</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>
              If you see a 401 error, your admin session might have expired. Try logging out and back in.
              Also ensure the backend server environment variables (JWT_SECRET, etc.) are correctly set.
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
