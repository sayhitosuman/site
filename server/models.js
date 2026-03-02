// ============================================================
// Mongoose Models — matches frontend types exactly
// ============================================================
import mongoose from "mongoose";

// --- Project ---
const projectSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    longDescription: { type: String, default: "" },
    status: { type: String, default: "Active" },
    sourceCode: { type: String, default: "" },
    liveUrl: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    tech: { type: [String], default: [] },
    year: { type: String, default: "" },
}, { timestamps: true });

export const Project = mongoose.model("Project", projectSchema);

// --- Publication ---
const publicationSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    abstract: { type: String, default: "" },
    journal: { type: String, default: "" },
    year: { type: Number, default: 2024 },
    doi: { type: String, default: "" },
    link: { type: String, default: "" },
    authors: { type: [String], default: [] },
}, { timestamps: true });

export const Publication = mongoose.model("Publication", publicationSchema);

// --- Blog ---
const blogSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    date: { type: String, default: "" },
    readTime: { type: String, default: "5 min" },
}, { timestamps: true });

export const Blog = mongoose.model("Blog", blogSchema);

// --- Note ---
const noteSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    content: { type: String, default: "" },
    fullContent: { type: String, default: "" },
    date: { type: String, default: "" },
}, { timestamps: true });

export const Note = mongoose.model("Note", noteSchema);

// --- BrainDump ---
const brainDumpSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    thought: { type: String, required: true },
    date: { type: String, default: "" },
    time: { type: String, default: "" },
    category: { type: String, default: "" },
    likes: { type: Number, default: 0 },
}, { timestamps: true });

export const BrainDump = mongoose.model("BrainDump", brainDumpSchema);

// --- Social / Contact ---
const socialSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    platform: { type: String, required: true },
    url: { type: String, default: "" },
    label: { type: String, default: "" },
}, { timestamps: true });

export const Social = mongoose.model("Social", socialSchema);
