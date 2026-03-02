import { useState, useEffect } from "react";
import { store, genId } from "./store";
import type { Social } from "./store";

const c = {
  h1: { fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 4 } as React.CSSProperties,
  sub: { fontSize: 12, color: "#555", marginBottom: 24 } as React.CSSProperties,
  btnAdd: { background: "#f34e0c", border: "none", color: "#fff", padding: "0.5rem 1.2rem", fontSize: 12, cursor: "pointer", fontFamily: "inherit", borderRadius: 4, fontWeight: 600 } as React.CSSProperties,
  btnSave: { background: "#f34e0c", border: "none", color: "#fff", padding: "0.45rem 1.1rem", fontSize: 12, cursor: "pointer", fontFamily: "inherit", borderRadius: 4, fontWeight: 600 } as React.CSSProperties,
  btnCancel: { background: "none", border: "1px solid #2a2d38", color: "#888", padding: "0.45rem 1rem", fontSize: 12, cursor: "pointer", fontFamily: "inherit", borderRadius: 4 } as React.CSSProperties,
  btnEdit: { background: "none", border: "1px solid #2a2d38", color: "#aaa", padding: "0.35rem 0.8rem", fontSize: 11, cursor: "pointer", fontFamily: "inherit", borderRadius: 4 } as React.CSSProperties,
  btnDel: { background: "none", border: "1px solid #3a1818", color: "#c05050", padding: "0.35rem 0.8rem", fontSize: 11, cursor: "pointer", fontFamily: "inherit", borderRadius: 4 } as React.CSSProperties,
  form: { background: "#13151c", border: "1px solid #f34e0c55", borderRadius: 6, padding: "1.4rem 1.6rem", marginBottom: 24 } as React.CSSProperties,
  card: { background: "#16181f", border: "1px solid #1f2230", borderRadius: 6, padding: "1rem 1.4rem", marginBottom: 8 } as React.CSSProperties,
  label: { display: "block", fontSize: 10, color: "#666", marginBottom: 5, letterSpacing: "0.12em", textTransform: "uppercase" as const },
  input: { width: "100%", background: "#0d0f14", border: "1px solid #2a2d38", color: "#e0e0e0", padding: "0.5rem 0.7rem", fontSize: 13, fontFamily: "inherit", borderRadius: 4, marginBottom: 14, boxSizing: "border-box" as const },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 } as React.CSSProperties,
  row: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 } as React.CSSProperties,
  btns: { display: "flex", gap: 8 } as React.CSSProperties,
  meta: { fontSize: 11, color: "#555" } as React.CSSProperties,
  error: { color: "#c05050", fontSize: 12, marginBottom: 16, background: "#1a1111", padding: "0.5rem 0.8rem", borderRadius: 4, border: "1px solid #3a1818" } as React.CSSProperties,
};

const blank = (): Social => ({ id: genId(), platform: "", url: "", label: "" });

export default function ContactsManager() {
  const [items, setItems] = useState<Social[]>([]);
  const [form, setForm] = useState<Social>(blank());
  const [mode, setMode] = useState<"idle" | "add" | "edit">("idle");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { store.getContacts().then(setItems).catch(e => setError(e.message)); }, []);

  const startAdd = () => { setForm(blank()); setMode("add"); setError(""); };
  const startEdit = (item: Social) => { setForm({ ...item }); setMode("edit"); setError(""); };
  const cancel = () => setMode("idle");

  const submit = async () => {
    if (!form.platform.trim() || !form.url.trim()) return;
    setSaving(true);
    setError("");
    try {
      if (mode === "add") {
        const created = await store.createContact(form);
        setItems(prev => [...prev, created]);
      } else {
        const updated = await store.updateContact(form);
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
    if (!window.confirm("Delete this contact?")) return;
    try {
      await store.deleteContact(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (e: any) {
      setError(e.message || "Failed to delete");
    }
  };

  return (
    <div>
      <div style={c.h1}>Contacts</div>
      <div style={c.sub}>{items.length} social links / contact methods</div>

      {error && <div style={c.error}>⚠ {error}</div>}

      {mode === "idle" && <button style={c.btnAdd} onClick={startAdd}>+ Add Contact</button>}

      {mode !== "idle" && (
        <div style={c.form}>
          <div style={{ fontSize: 13, color: "#f34e0c", marginBottom: 16, fontWeight: 600 }}>
            {mode === "add" ? "New Contact / Social Link" : "Edit Contact"}
          </div>
          <div style={c.grid3}>
            <div>
              <label style={c.label}>Platform *</label>
              <input style={c.input} value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))} placeholder="GitHub" />
            </div>
            <div>
              <label style={c.label}>Label (display text)</label>
              <input style={c.input} value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="@suman / handle" />
            </div>
            <div>
              <label style={c.label}>URL *</label>
              <input style={c.input} value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://github.com/suman" />
            </div>
          </div>
          <div style={c.btns}>
            <button style={c.btnSave} onClick={submit} disabled={saving}>{saving ? "Saving…" : "Save Contact"}</button>
            <button style={c.btnCancel} onClick={cancel}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        {items.length === 0 && <div style={{ color: "#444", fontSize: 13 }}>No contacts yet.</div>}
        {items.map(item => (
          <div key={item.id} style={c.card}>
            <div style={c.row}>
              <div style={{ flex: 1, display: "flex", gap: 24, alignItems: "center" }}>
                <span style={{ fontSize: 13, color: "#ccc", fontWeight: 600, minWidth: 120 }}>{item.platform}</span>
                <span style={c.meta}>{item.label}</span>
                <span style={{ ...c.meta, color: "#1e17e8", fontSize: 11 }}>{item.url}</span>
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
