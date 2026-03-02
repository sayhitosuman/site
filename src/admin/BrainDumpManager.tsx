import { useState, useEffect } from "react";
import { store, genId } from "./store";
import type { BrainDump } from "../data";
import { BRAIN_DUMP_CATEGORIES } from "../data";

interface FormData {
  thought: string;
  date: string;
  time: string;
  category: string;
  likes: number;
}

const empty: FormData = { thought: "", date: "", time: "", category: "", likes: 0 };

export default function BrainDumpManager() {
  const [items, setItems] = useState<BrainDump[]>([]);
  const [form, setForm] = useState<FormData>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setItems(store.getBrainDumps());
  }, []);

  const save = (list: BrainDump[]) => {
    setItems(list);
    store.setBrainDumps(list);
  };

  const handleSubmit = () => {
    if (!form.thought.trim()) return;
    const id = editingId || genId();
    const item: BrainDump = {
      id,
      thought: form.thought,
      date: form.date || new Date().toISOString().split("T")[0],
      time: form.time || undefined,
      category: form.category || undefined,
      likes: form.likes || 0,
    };
    if (editingId) {
      save(items.map((i) => (i.id === editingId ? item : i)));
    } else {
      save([item, ...items]);
    }
    setForm(empty);
    setEditingId(null);
  };

  const handleEdit = (item: BrainDump) => {
    setForm({
      thought: item.thought,
      date: item.date,
      time: item.time || "",
      category: item.category || "",
      likes: item.likes || 0,
    });
    setEditingId(item.id);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this thought?")) save(items.filter((i) => i.id !== id));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Brain Dumps</h2>

      {/* Form */}
      <div className="bg-neutral-800 p-4 rounded-lg mb-6 space-y-3">
        <textarea
          placeholder="Thought..."
          value={form.thought}
          onChange={(e) => setForm({ ...form, thought: e.target.value })}
          className="w-full p-2 bg-neutral-700 rounded text-white placeholder:text-neutral-400"
          rows={3}
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="p-2 bg-neutral-700 rounded text-white"
          />
          <input
            type="text"
            placeholder="Time (e.g., 2:30pm)"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            className="p-2 bg-neutral-700 rounded text-white placeholder:text-neutral-400"
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="p-2 bg-neutral-700 rounded text-white"
          >
            <option value="">No category</option>
            {BRAIN_DUMP_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Likes"
            value={form.likes}
            onChange={(e) => setForm({ ...form, likes: parseInt(e.target.value) || 0 })}
            className="p-2 bg-neutral-700 rounded text-white placeholder:text-neutral-400"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-white"
        >
          {editingId ? "Update" : "Add"} Thought
        </button>
        {editingId && (
          <button
            onClick={() => {
              setForm(empty);
              setEditingId(null);
            }}
            className="px-4 py-2 ml-2 bg-neutral-600 hover:bg-neutral-500 rounded text-white"
          >
            Cancel
          </button>
        )}
      </div>

      {/* List */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-neutral-800 p-4 rounded-lg flex flex-col gap-2"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {item.category && (
                  <span className="inline-block px-2 py-0.5 text-[10px] font-mono uppercase bg-neutral-700 text-neutral-300 rounded mb-2">
                    {item.category}
                  </span>
                )}
                <p className="italic text-neutral-200">"{item.thought}"</p>
                <p className="text-xs text-neutral-500 mt-2">
                  {item.date} {item.time && `· ${item.time}`} · ♡ {item.likes || 0}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleEdit(item)}
                  className="px-3 py-1 text-xs bg-neutral-700 hover:bg-neutral-600 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1 text-xs bg-red-800 hover:bg-red-700 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
