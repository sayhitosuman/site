import { useState, useEffect } from "react";
import { store, genId } from "./store";
import type { Publication } from "./store";
import MediaUploader from "./MediaUploader";

const c = {
  h1: { fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 4 } as React.CSSProperties,
  sub: { fontSize: 12, color: "#555", marginBottom: 24 } as React.CSSProperties,
  btnAdd: { background: "#f34e0c", border: "none", color: "#fff", padding: "0.5rem 1.2rem", fontSize: 12, cursor: "pointer", fontFamily: "inherit", borderRadius: 4, fontWeight: 600 } as React.CSSProperties,
  btnSave: { background: "#f34e0c", border: "none", color: "#fff", padding: "0.45rem 1.1rem", fontSize: 12, cursor: "pointer", fontFamily: "inherit", borderRadius: 4, fontWeight: 600 } as React.CSSProperties,
  btnCancel: { background: "none", border: "1px solid #2a2d38", color: "#888", padding: "0.45rem 1rem", fontSize: 12, cursor: "pointer", fontFamily: "inherit", borderRadius: 4 } as React.CSSProperties,
  btnEdit: { background: "none", border: "1px solid #2a2d38", color: "#aaa", padding: "0.35rem 0.8rem", fontSize: 11, cursor: "pointer", fontFamily: "inherit", borderRadius: 4 } as React.CSSProperties,
  btnDel: { background: "none", border: "1px solid #3a1818", color: "#c05050", padding: "0.35rem 0.8rem", fontSize: 11, cursor: "pointer", fontFamily: "inherit", borderRadius: 4 } as React.CSSProperties,
  form: { background: "#13151c", border: "1px solid #f34e0c55", borderRadius: 6, padding: "1.4rem 1.6rem", marginBottom: 24 } as React.CSSProperties,
  card: { background: "#16181f", border: "1px solid #1f2230", borderRadius: 6, padding: "1.1rem 1.4rem", marginBottom: 10 } as React.CSSProperties,
  label: { display: "block", fontSize: 10, color: "#666", marginBottom: 5, letterSpacing: "0.12em", textTransform: "uppercase" as const },
  input: { width: "100%", background: "#0d0f14", border: "1px solid #2a2d38", color: "#e0e0e0", padding: "0.5rem 0.7rem", fontSize: 13, fontFamily: "inherit", borderRadius: 4, marginBottom: 14, boxSizing: "border-box" as const },
  textarea: { width: "100%", background: "#0d0f14", border: "1px solid #2a2d38", color: "#e0e0e0", padding: "0.5rem 0.7rem", fontSize: 13, fontFamily: "inherit", borderRadius: 4, marginBottom: 14, boxSizing: "border-box" as const, resize: "vertical" as const },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 } as React.CSSProperties,
  row: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 } as React.CSSProperties,
  btns: { display: "flex", gap: 8 } as React.CSSProperties,
  title: { fontSize: 14, color: "#e8e8e8", fontWeight: 600, marginBottom: 3 } as React.CSSProperties,
  meta: { fontSize: 11, color: "#555" } as React.CSSProperties,
  error: { color: "#c05050", fontSize: 12, marginBottom: 16, background: "#1a1111", padding: "0.5rem 0.8rem", borderRadius: 4, border: "1px solid #3a1818" } as React.CSSProperties,
};

type FormState = { id: string; title: string; description: string; abstract: string; journal: string; year: string; doi: string; link: string; authors: string };
const blankForm = (): FormState => ({ id: genId(), title: "", description: "", abstract: "", journal: "", year: String(new Date().getFullYear()), doi: "", link: "", authors: "" });
const toItem = (f: FormState): Publication => ({ ...f, year: Number(f.year) || new Date().getFullYear(), authors: f.authors.split(",").map(s => s.trim()).filter(Boolean) });
const toForm = (p: Publication): FormState => ({ id: p.id, title: p.title, description: p.description, abstract: p.abstract ?? "", journal: p.journal ?? "", year: String(p.year), doi: p.doi ?? "", link: p.link ?? "", authors: (p.authors ?? []).join(", ") });

export default function PublicationsManager() {
  const [items, setItems] = useState<Publication[]>([]);
  const [form, setForm] = useState<FormState>(blankForm());
  const [mode, setMode] = useState<"idle" | "add" | "edit">("idle");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { store.getPublications().then(setItems).catch(e => setError(e.message)); }, []);

  const startAdd = () => { setForm(blankForm()); setMode("add"); setError(""); };
  const startEdit = (item: Publication) => { setForm(toForm(item)); setMode("edit"); setError(""); };
  const cancel = () => setMode("idle");

  const submit = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    setError("");
    try {
      const item = toItem(form);
      if (mode === "add") {
        const created = await store.createPublication(item);
        setItems(prev => [created, ...prev]);
      } else {
        const updated = await store.updatePublication(item);
        setItems(prev => prev.map(i => i.id === item.id ? updated : i));
      }
      cancel();
    } catch (e: any) {
      setError(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    if (!window.confirm("Delete this publication?")) return;
    try {
      await store.deletePublication(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (e: any) {
      setError(e.message || "Failed to delete");
    }
  };

  return (
    <div>
      <div style={c.h1}>Publications</div>
      <div style={c.sub}>{items.length} papers</div>

      {error && <div style={c.error}>⚠ {error}</div>}

      {mode === "idle" && <button style={c.btnAdd} onClick={startAdd}>+ Add Publication</button>}

      {mode !== "idle" && (
        <div style={c.form}>
          <div style={{ fontSize: 13, color: "#f34e0c", marginBottom: 16, fontWeight: 600 }}>
            {mode === "add" ? "New Publication" : "Edit Publication"}
          </div>
          <label style={c.label}>Title *</label>
          <input style={c.input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Full paper title" />
          <label style={c.label}>Short Description</label>
          <input style={c.input} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="One-liner for the list view" />
          <label style={c.label}>Abstract</label>
          <textarea style={{ ...c.textarea, minHeight: 130 }} value={form.abstract} onChange={e => setForm(f => ({ ...f, abstract: e.target.value }))} placeholder="Full abstract..." />
          <div style={c.grid2}>
            <div>
              <label style={c.label}>Journal</label>
              <input style={c.input} value={form.journal} onChange={e => setForm(f => ({ ...f, journal: e.target.value }))} placeholder="Journal name" />
            </div>
            <div>
              <label style={c.label}>Year</label>
              <input style={c.input} type="number" value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} placeholder="2024" />
            </div>
          </div>
          <div style={c.grid2}>
            <div>
              <label style={c.label}>DOI</label>
              <input style={c.input} value={form.doi} onChange={e => setForm(f => ({ ...f, doi: e.target.value }))} placeholder="10.xxxx/..." />
            </div>
            <div>
              <label style={c.label}>Link (URL to full paper)</label>
              <input style={c.input} value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} placeholder="https://..." />
            </div>
          </div>
          <label style={c.label}>Authors (comma separated)</label>
          <input style={c.input} value={form.authors} onChange={e => setForm(f => ({ ...f, authors: e.target.value }))} placeholder="Suman, A. Mehta, R. Singh" />
          <div style={c.btns}>
            <button style={c.btnSave} onClick={submit} disabled={saving}>{saving ? "Saving…" : "Save Publication"}</button>
            <button style={c.btnCancel} onClick={cancel}>Cancel</button>
          </div>

          <MediaUploader />
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        {items.length === 0 && <div style={{ color: "#444", fontSize: 13 }}>No publications yet.</div>}
        {items.map(item => (
          <div key={item.id} style={c.card}>
            <div style={c.row}>
              <div style={{ flex: 1 }}>
                <div style={c.title}>{item.title}</div>
                <div style={c.meta}>{(item.authors ?? []).join(", ")}</div>
                <div style={{ ...c.meta, marginTop: 4 }}>{item.journal} · {item.year}{item.doi ? ` · ${item.doi}` : ""}</div>
              </div>
              <div style={c.btns}>
                <button style={c.btnEdit} onClick={() => startEdit(item)}>Edit</button>
                <button style={c.btnDel} onClick={() => del(item.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
