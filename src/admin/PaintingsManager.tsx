import { useState, useEffect } from "react";
import { store, genId } from "./store";
import { Painting } from "./store";
import { uploadFile } from "../api";

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
    btns: { display: "flex", gap: 8 } as React.CSSProperties,
    title: { fontSize: 14, color: "#e8e8e8", fontWeight: 600, marginBottom: 3 } as React.CSSProperties,
    meta: { fontSize: 11, color: "#555" } as React.CSSProperties,
    error: { color: "#c05050", fontSize: 12, marginBottom: 16, background: "#1a1111", padding: "0.5rem 0.8rem", borderRadius: 4, border: "1px solid #3a1818" } as React.CSSProperties,
    imgPreview: { width: 80, height: 80, borderRadius: 4, objectFit: "cover" as const, background: "#0d0f14", border: "1px solid #2a2d38" } as React.CSSProperties,
};

const blank = (): Painting => ({ id: genId(), title: "", description: "", imageUrls: [], date: new Date().toISOString().slice(0, 10), likes: 0 });

export default function PaintingsManager() {
    const [items, setItems] = useState<Painting[]>([]);
    const [form, setForm] = useState<Painting>(blank());
    const [mode, setMode] = useState<"idle" | "add" | "edit">("idle");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [uploading, setUploading] = useState(false);

    useEffect(() => { store.getPaintings().then(setItems).catch(e => setError(e.message)); }, []);

    const startAdd = () => { setForm(blank()); setMode("add"); setError(""); };
    const startEdit = (item: Painting) => { setForm({ ...item }); setMode("edit"); setError(""); };
    const cancel = () => setMode("idle");

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setUploading(true);
        setError("");
        try {
            const urls: string[] = [];
            for (let i = 0; i < files.length; i++) {
                const result = await uploadFile(files[i]);
                urls.push(result.url);
            }
            setForm(f => ({ ...f, imageUrls: [...f.imageUrls, ...urls] }));
        } catch (e: any) {
            setError("Upload failed: " + e.message);
        } finally {
            setUploading(false);
        }
    };

    const removeImg = (idx: number) => {
        setForm(f => ({ ...f, imageUrls: f.imageUrls.filter((_, i) => i !== idx) }));
    };

    const submit = async () => {
        if (!form.title.trim()) return;
        setSaving(true);
        setError("");
        try {
            if (mode === "add") {
                const created = await store.createPainting(form);
                setItems(prev => [created, ...prev]);
            } else {
                const updated = await store.updatePainting(form);
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
        if (!window.confirm("Delete this painting?")) return;
        try {
            await store.deletePainting(id);
            setItems(prev => prev.filter(i => i.id !== id));
        } catch (e: any) {
            setError(e.message || "Failed to delete");
        }
    };

    return (
        <div>
            <div style={c.h1}>Paintings</div>
            <div style={c.sub}>{items.length} paintings · support single and multiple images</div>

            {error && <div style={c.error}>⚠ {error}</div>}

            {mode === "idle" && <button style={c.btnAdd} onClick={startAdd}>+ Add Painting</button>}

            {mode !== "idle" && (
                <div style={c.form}>
                    <div style={{ fontSize: 13, color: "#f34e0c", marginBottom: 16, fontWeight: 600 }}>
                        {mode === "add" ? "New Painting" : `Editing: ${form.title}`}
                    </div>
                    <label style={c.label}>Title *</label>
                    <input style={c.input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Painting title" />

                    <div style={{ marginBottom: 14 }}>
                        <label style={c.label}>Images (can select multiple)</label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
                            {form.imageUrls.map((url, idx) => (
                                <div key={idx} style={{ position: "relative" }}>
                                    <img src={url} style={c.imgPreview} alt="" />
                                    <button
                                        onClick={() => removeImg(idx)}
                                        style={{ position: "absolute", top: -5, right: -5, background: "#c05050", color: "#fff", border: "none", borderRadius: "50%", width: 18, height: 18, fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <div style={{ ...c.imgPreview, display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed #333", background: "none" }}>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    style={{ opacity: 0, position: "absolute", width: 80, height: 80, cursor: "pointer" }}
                                />
                                <span style={{ fontSize: 20, color: "#444" }}>+</span>
                            </div>
                        </div>
                        {uploading && <div style={{ fontSize: 10, color: "#f34e0c" }}>Uploading to Cloudinary…</div>}
                    </div>

                    <label style={c.label}>Description</label>
                    <textarea style={{ ...c.textarea, minHeight: 100 }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="A short story about this piece..." />

                    <div style={{ width: "50%" }}>
                        <label style={c.label}>Date</label>
                        <input style={c.input} type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                    </div>

                    <div style={c.btns}>
                        <button style={c.btnSave} onClick={submit} disabled={saving || uploading}>{saving ? "Saving…" : "Save Painting"}</button>
                        <button style={c.btnCancel} onClick={cancel}>Cancel</button>
                    </div>
                </div>
            )}

            <div style={{ marginTop: 24 }}>
                {items.length === 0 && <div style={{ color: "#444", fontSize: 13 }}>No paintings yet.</div>}
                {items.map(item => (
                    <div key={item.id} style={c.card}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                                <div style={{ display: "flex", gap: 4 }}>
                                    {item.imageUrls.slice(0, 3).map((url, i) => (
                                        <img key={i} src={url} style={{ width: 40, height: 40, borderRadius: 3, objectFit: "cover" }} alt="" />
                                    ))}
                                    {item.imageUrls.length > 3 && <div style={{ width: 40, height: 40, borderRadius: 3, background: "#222", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>+{item.imageUrls.length - 3}</div>}
                                </div>
                                <div>
                                    <div style={c.title}>{item.title}</div>
                                    <div style={c.meta}>{item.description.slice(0, 60)}{item.description.length > 60 ? "..." : ""}</div>
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
