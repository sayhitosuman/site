import { useState, useEffect } from "react";
import { store, genId } from "./store";
import { Project } from "./store";
import { uploadFile } from "../api";
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
  tag: { display: "inline-block", background: "#1f2230", color: "#888", fontSize: 10, padding: "2px 7px", borderRadius: 3, marginRight: 4 } as React.CSSProperties,
  error: { color: "#c05050", fontSize: 12, marginBottom: 16, background: "#1a1111", padding: "0.5rem 0.8rem", borderRadius: 4, border: "1px solid #3a1818" } as React.CSSProperties,
  imgPreview: { width: 80, height: 60, borderRadius: 4, objectFit: "cover" as const, background: "#0d0f14", border: "1px solid #2a2d38" } as React.CSSProperties,
};

const blank = (): Project => ({ id: genId(), title: "", description: "", longDescription: "", status: "Active", sourceCode: "", liveUrl: "", tech: [], year: String(new Date().getFullYear()), imageUrl: "" });

export default function ProjectsManager() {
  const [items, setItems] = useState<Project[]>([]);
  const [form, setForm] = useState<Project>(blank());
  const [mode, setMode] = useState<"idle" | "add" | "edit">("idle");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    store.getProjects().then(setItems).catch((e) => setError(e.message));
  }, []);

  const startAdd = () => { setForm(blank()); setMode("add"); setError(""); };
  const startEdit = (item: Project) => { setForm({ ...item, tech: item.tech ?? [] }); setMode("edit"); setError(""); };
  const cancel = () => setMode("idle");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const result = await uploadFile(file);
      setForm(f => ({ ...f, imageUrl: result.url }));
    } catch (e: any) {
      setError("Upload failed: " + e.message);
    } finally {
      setUploading(false);
    }
  };

  const submit = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    setError("");
    try {
      const techArr = typeof form.tech === "string"
        ? (form.tech as unknown as string).split(",").map(s => s.trim()).filter(Boolean)
        : form.tech ?? [];
      const item: Project = { ...form, tech: techArr };
      if (mode === "add") {
        const created = await store.createProject(item);
        setItems(prev => [created, ...prev]);
      } else {
        const updated = await store.updateProject(item);
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
    if (!window.confirm("Delete this project?")) return;
    try {
      await store.deleteProject(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (e: any) {
      setError(e.message || "Failed to delete");
    }
  };

  const techStr = Array.isArray(form.tech) ? form.tech.join(", ") : "";

  return (
    <div>
      <div style={c.h1}>Projects</div>
      <div style={c.sub}>{items.length} projects · saved to Turso Cloud</div>

      {error && <div style={c.error}>⚠ {error}</div>}

      {mode === "idle" && <button style={c.btnAdd} onClick={startAdd}>+ Add Project</button>}

      {mode !== "idle" && (
        <div style={c.form}>
          <div style={{ fontSize: 13, color: "#f34e0c", marginBottom: 16, fontWeight: 600 }}>
            {mode === "add" ? "New Project" : `Editing: ${form.title}`}
          </div>
          <div style={c.grid2}>
            <div>
              <label style={c.label}>Title *</label>
              <input style={c.input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Project name" />
            </div>
            <div>
              <label style={c.label}>Year</label>
              <input style={c.input} value={form.year ?? ""} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} placeholder="2024" />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={c.label}>Project Image</label>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              {form.imageUrl ? (
                <img src={form.imageUrl} style={c.imgPreview} alt="Preview" />
              ) : (
                <div style={{ ...c.imgPreview, display: "flex", alignItems: "center", justifyContent: "center", fontStyle: "italic", fontSize: 9, color: "#444" }}>No Image</div>
              )}
              <div style={{ flex: 1 }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ fontSize: 11, color: "#666" }}
                />
                {uploading && <div style={{ fontSize: 10, color: "#f34e0c", marginTop: 4 }}>Uploading to Cloudinary…</div>}
                {form.imageUrl && <div style={{ fontSize: 9, color: "#444", marginTop: 4, wordBreak: "break-all" }}>{form.imageUrl}</div>}
              </div>
            </div>
          </div>

          <label style={c.label}>Short Description *</label>
          <input style={c.input} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="One-liner shown on homepage" />
          <label style={c.label}>Long Description (shown on project page)</label>
          <textarea style={{ ...c.textarea, minHeight: 120 }} value={form.longDescription ?? ""} onChange={e => setForm(f => ({ ...f, longDescription: e.target.value }))} placeholder="Full write-up. Use double newlines for paragraphs." />

          <div style={c.grid2}>
            <div>
              <label style={c.label}>Status</label>
              <select style={{ ...c.input }} value={form.status ?? "Active"} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option>Active</option><option>Stable</option><option>In Use</option><option>Archived</option>
              </select>
            </div>
            <div>
              <label style={c.label}>Tech Stack (comma separated)</label>
              <input style={c.input} value={techStr} onChange={e => setForm(f => ({ ...f, tech: e.target.value.split(",").map(s => s.trim()) }))} placeholder="React, Python, PostgreSQL" />
            </div>
          </div>
          <div style={c.grid2}>
            <div>
              <label style={c.label}>Source Code URL</label>
              <input style={c.input} value={form.sourceCode ?? ""} onChange={e => setForm(f => ({ ...f, sourceCode: e.target.value }))} placeholder="https://github.com/..." />
            </div>
            <div>
              <label style={c.label}>Live URL</label>
              <input style={c.input} value={form.liveUrl ?? ""} onChange={e => setForm(f => ({ ...f, liveUrl: e.target.value }))} placeholder="https://..." />
            </div>
          </div>
          <div style={c.btns}>
            <button style={c.btnSave} onClick={submit} disabled={saving || uploading}>{saving ? "Saving…" : "Save Project"}</button>
            <button style={c.btnCancel} onClick={cancel}>Cancel</button>
          </div>

          <MediaUploader />
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        {items.length === 0 && <div style={{ color: "#444", fontSize: 13 }}>No projects yet. Add one above.</div>}
        {items.map(item => (
          <div key={item.id} style={c.card}>
            <div style={c.row}>
              <div style={{ display: "flex", gap: 14, flex: 1 }}>
                {item.imageUrl && <img src={item.imageUrl} style={{ width: 60, height: 45, borderRadius: 3, objectFit: "cover" }} alt="" />}
                <div style={{ flex: 1 }}>
                  <div style={c.title}>{item.title}</div>
                  <div style={c.meta}>{item.description}</div>
                  <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap" as const, gap: 4 }}>
                    {item.status && <span style={{ ...c.tag, color: "#f34e0c", borderColor: "#f34e0c33" }}>{item.status}</span>}
                    {item.year && <span style={c.tag}>{item.year}</span>}
                    {(item.tech ?? []).map(t => <span key={t} style={c.tag}>{t}</span>)}
                  </div>
                </div>
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
