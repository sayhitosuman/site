import { useState, useEffect } from "react";
import { store, genId } from "./store";
import type { BrainDump } from "./store";
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
  meta: { fontSize: 11, color: "#555" } as React.CSSProperties,
  error: { color: "#c05050", fontSize: 12, marginBottom: 16, background: "#1a1111", padding: "0.5rem 0.8rem", borderRadius: 4, border: "1px solid #3a1818" } as React.CSSProperties,
};

const now = () => {
  const d = new Date();
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase();
};
const blank = (): BrainDump => ({ id: genId(), title: "", body: "", date: new Date().toISOString().slice(0, 10), time: now(), category: "random", likes: 0 });

export default function BrainDumpsManager() {
  const [items, setItems] = useState<BrainDump[]>([]);
  const [form, setForm] = useState<BrainDump>(blank());
  const [mode, setMode] = useState<"idle" | "add" | "edit">("idle");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { store.getBrainDumps().then(setItems).catch(e => setError(e.message)); }, []);

  const startAdd = () => { setForm(blank()); setMode("add"); setError(""); };
  const startEdit = (item: BrainDump) => { setForm({ ...item, title: item.title || "", body: item.body || "" }); setMode("edit"); setError(""); };
  const cancel = () => setMode("idle");

  const submit = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, thought: form.title };
      if (mode === "add") {
        const created = await store.createBrainDump(payload);
        setItems(prev => [created, ...prev]);
      } else {
        const updated = await store.updateBrainDump(payload);
        setItems(prev => prev.map(i => i.id === form.id ? updated : i));
      }
      cancel();
    } catch (e: any) {
      setError(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    if (!window.confirm("Delete this dump?")) return;
    try {
      await store.deleteBrainDump(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (e: any) {
      setError(e.message || "Failed to delete");
    }
  };

  return (
    <div>
      <div style={c.h1}>Brain Dumps</div>
      <div style={c.sub}>{items.length} micro-thoughts · raw, unfiltered</div>

      {error && <div style={c.error}>⚠ {error}</div>}

      {mode === "idle" && <button style={c.btnAdd} onClick={startAdd}>+ Add Brain Dump</button>}

      {mode !== "idle" && (
        <div style={c.form}>
          <div style={{ fontSize: 13, color: "#f34e0c", marginBottom: 16, fontWeight: 600 }}>
            {mode === "add" ? "New Brain Dump" : "Edit Brain Dump"}
          </div>

          <label style={c.label}>Title (Shown in lists) *</label>
          <input style={c.input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="The main hook or summary" />

          <label style={c.label}>Body (Markdown supported - Images/Videos here) *</label>
          <textarea style={{ ...c.textarea, minHeight: 180 }} value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} placeholder="Write your thoughts here. You can use Markdown or HTML." />

          <div style={c.grid2}>
            <div>
              <label style={c.label}>Tag / Category / Sticker</label>
              <select
                style={c.input}
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              >
                {["rant", "poem", "good", "tech", "life", "idea", "random"].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={c.label}>Date</label>
              <input style={c.input} type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
          </div>

          <div style={c.btns}>
            <button style={c.btnSave} onClick={submit} disabled={saving}>{saving ? "Saving…" : "Save Dump"}</button>
            <button style={c.btnCancel} onClick={cancel}>Cancel</button>
          </div>

          <MediaUploader />
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        {items.length === 0 && <div style={{ color: "#444", fontSize: 13 }}>No brain dumps yet.</div>}
        {items.map(item => (
          <div key={item.id} style={c.card}>
            <div style={c.row}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 11, color: "#f34e0c", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{item.category}</div>
                <div style={{ fontSize: 13, color: "#888", lineHeight: 1.5, maxHeight: "3em", overflow: "hidden" }}>{item.body}</div>
                <div style={{ ...c.meta, marginTop: 10 }}>{item.date}{item.time ? ` · ${item.time}` : ""} · {item.likes || 0} likes</div>
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
