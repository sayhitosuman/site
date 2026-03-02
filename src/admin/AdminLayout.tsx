import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { login, verifyToken, logout, getToken } from "../api";

const nav = [
  { to: "/backend", label: "⌂ Dashboard", end: true },
  { to: "/backend/projects", label: "◈ Projects" },
  { to: "/backend/blogs", label: "✎ Blogs" },
  { to: "/backend/publications", label: "◉ Publications" },
  { to: "/backend/notes", label: "◇ Notes" },
  { to: "/backend/brain-dumps", label: "⚡ Brain Dumps" },
  { to: "/backend/contacts", label: "@ Contacts" },
];

const s = {
  root: { minHeight: "100vh", background: "#0d0f14", color: "#d0d0d0", fontFamily: "'Space Grotesk', monospace, sans-serif", display: "flex" } as React.CSSProperties,
  sidebar: { width: 230, minHeight: "100vh", background: "#111318", borderRight: "1px solid #1f2230", display: "flex", flexDirection: "column" as const, flexShrink: 0 },
  logo: { padding: "1.8rem 1.5rem 1.4rem", borderBottom: "1px solid #1f2230" },
  tag: { fontSize: 10, color: "#444", letterSpacing: "0.2em", textTransform: "uppercase" as const, marginBottom: 6 },
  site: { fontSize: 17, color: "#fff", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 2 },
  sub: { fontSize: 11, color: "#444" },
  nav: { padding: "1rem 0", flex: 1 },
  foot: { padding: "1.2rem 1.5rem", borderTop: "1px solid #1f2230" },
  main: { flex: 1, padding: "2.5rem 3rem", overflowY: "auto" as const, maxWidth: 900 },
};

const loginStyles = {
  root: { minHeight: "100vh", background: "#0d0f14", display: "flex", alignItems: "center", justifyContent: "center" } as React.CSSProperties,
  card: { background: "#111318", border: "1px solid #1f2230", borderRadius: 8, padding: "2.5rem", width: 360, maxWidth: "90vw" } as React.CSSProperties,
  title: { fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 6, letterSpacing: "-0.02em" } as React.CSSProperties,
  desc: { fontSize: 12, color: "#555", marginBottom: 28 } as React.CSSProperties,
  label: { display: "block", fontSize: 10, color: "#666", marginBottom: 6, letterSpacing: "0.12em", textTransform: "uppercase" as const } as React.CSSProperties,
  input: { width: "100%", background: "#0d0f14", border: "1px solid #2a2d38", color: "#e0e0e0", padding: "0.6rem 0.8rem", fontSize: 14, fontFamily: "inherit", borderRadius: 4, marginBottom: 20, boxSizing: "border-box" as const } as React.CSSProperties,
  btn: { width: "100%", background: "#f34e0c", border: "none", color: "#fff", padding: "0.6rem", fontSize: 13, cursor: "pointer", fontFamily: "inherit", borderRadius: 4, fontWeight: 600 } as React.CSSProperties,
  error: { color: "#c05050", fontSize: 12, marginBottom: 16, background: "#1a1111", padding: "0.5rem 0.8rem", borderRadius: 4, border: "1px solid #3a1818" } as React.CSSProperties,
};

export default function AdminLayout() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState<boolean | null>(null); // null = checking
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [logging, setLogging] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setAuthed(false);
      return;
    }
    verifyToken().then((valid) => setAuthed(valid));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLogging(true);
    setError("");
    try {
      await login(password);
      setAuthed(true);
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLogging(false);
    }
  };

  const handleLogout = () => {
    logout();
    setAuthed(false);
    setPassword("");
  };

  // Still checking token
  if (authed === null) {
    return (
      <div style={{ ...loginStyles.root, color: "#555", fontFamily: "'Space Grotesk', monospace, sans-serif" }}>
        <p>Verifying session…</p>
      </div>
    );
  }

  // Not authenticated → show login form
  if (!authed) {
    return (
      <div style={{ ...loginStyles.root, fontFamily: "'Space Grotesk', monospace, sans-serif" }}>
        <form onSubmit={handleLogin} style={loginStyles.card}>
          <div style={loginStyles.title}>suman.dev</div>
          <div style={loginStyles.desc}>Admin login — enter your password</div>
          {error && <div style={loginStyles.error}>{error}</div>}
          <label style={loginStyles.label}>Password</label>
          <input
            type="password"
            style={loginStyles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            autoFocus
          />
          <button type="submit" style={loginStyles.btn} disabled={logging}>
            {logging ? "Logging in…" : "Login →"}
          </button>
        </form>
      </div>
    );
  }

  // Authenticated → show admin panel
  return (
    <div style={s.root}>
      <aside style={s.sidebar}>
        <div style={s.logo}>
          <div style={s.tag}>CMS / Backend</div>
          <div style={s.site}>suman.dev</div>
          <div style={s.sub}>content management</div>
        </div>
        <nav style={s.nav}>
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                display: "block",
                padding: "0.6rem 1.5rem",
                fontSize: 13,
                color: isActive ? "#f34e0c" : "#666",
                textDecoration: "none",
                borderLeft: `2px solid ${isActive ? "#f34e0c" : "transparent"}`,
                background: isActive ? "#1a1c24" : "transparent",
                letterSpacing: "0.01em",
                transition: "all 0.12s",
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div style={s.foot}>
          <button
            onClick={handleLogout}
            style={{ background: "none", border: "1px solid #3a1818", color: "#c05050", padding: "0.45rem 1rem", fontSize: 11, cursor: "pointer", fontFamily: "inherit", borderRadius: 4, width: "100%", marginBottom: 8 }}
          >
            ⊘ Logout
          </button>
          <button
            onClick={() => navigate("/")}
            style={{ background: "none", border: "1px solid #222", color: "#555", padding: "0.45rem 1rem", fontSize: 11, cursor: "pointer", fontFamily: "inherit", borderRadius: 4, width: "100%" }}
          >
            ← view public site
          </button>
        </div>
      </aside>
      <main style={s.main}>
        <Outlet />
      </main>
    </div>
  );
}
