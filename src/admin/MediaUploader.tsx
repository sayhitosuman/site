import { useState } from "react";
import { uploadFile } from "../api";

const s = {
    root: { background: "#111318", border: "1px solid #1f2230", borderRadius: 6, padding: "1.2rem", marginTop: 20 },
    h: { fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" },
    drop: { border: "1px dashed #333", borderRadius: 4, padding: "1.5rem", textAlign: "center" as const, cursor: "pointer", transition: "all 0.2s" },
    item: { padding: "0.8rem", background: "#0d0f14", borderRadius: 4, marginTop: 10, display: "flex", alignItems: "center", gap: 12, border: "1px solid #1f2230" },
    tag: { fontSize: 10, fontFamily: "monospace", background: "#1a1c24", padding: "4px 8px", borderRadius: 3, color: "#f34e0c", flex: 1, cursor: "pointer" },
    btn: { background: "#f34e0c", border: "none", color: "#fff", padding: "4px 10px", fontSize: 10, borderRadius: 3, cursor: "pointer" },
};

export default function MediaUploader() {
    const [uploading, setUploading] = useState(false);
    const [history, setHistory] = useState<{ url: string; type: string }[]>([]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const res = await uploadFile(file);
            const type = file.type.startsWith("video") ? "video" : "image";
            setHistory(prev => [{ url: res.url, type }, ...prev]);
        } catch (err: any) {
            alert("Upload failed: " + err.message);
        } finally {
            setUploading(false);
        }
    };

    const copy = (txt: string) => {
        navigator.clipboard.writeText(txt);
        alert("Markdown copied to clipboard!");
    };

    return (
        <div style={s.root}>
            <div style={s.h}>
                <span>Media Uploader (Images/Videos)</span>
                {uploading && <span style={{ fontSize: 10, color: "#f34e0c" }}>Uploading…</span>}
            </div>

            <label style={s.drop}>
                <input type="file" hidden onChange={handleUpload} disabled={uploading} accept="image/*,video/*" />
                <span style={{ fontSize: 12, color: "#666" }}>
                    {uploading ? "Please wait…" : "Click to upload media for any post"}
                </span>
            </label>

            {history.map((item, i) => {
                const markdown = item.type === "video"
                    ? `<video src="${item.url}" controls style="width:100%; border-radius:8px;"></video>`
                    : `![caption](${item.url})`;

                return (
                    <div key={i} style={s.item}>
                        <div style={{ width: 40, height: 40, background: "#000", borderRadius: 4, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {item.type === "video" ? (
                                <span style={{ fontSize: 10 }}>🎬</span>
                            ) : (
                                <img src={item.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            )}
                        </div>
                        <div style={s.tag} title="Click to copy markdown" onClick={() => copy(markdown)}>
                            {markdown.substring(0, 40)}…
                        </div>
                        <button style={s.btn} onClick={() => copy(markdown)}>Copy</button>
                    </div>
                );
            })}

            <div style={{ fontSize: 10, color: "#444", marginTop: 12, lineHeight: 1.4 }}>
                💡 Upload an image or video, then <b>Copy</b> and <b>Paste</b> the tag anywhere into your "Body" or "Content" field.
            </div>
        </div>
    );
}
