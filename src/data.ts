// ============================================================
// Types & public data layer
// Frontend fetches from the Express API.
// Falls back to defaults if the server is unreachable.
// ============================================================

import * as api from "./api";
import {
  projects as _p,
  publications as _pub,
  blogs as _b,
  notes as _n,
  brainDumps as _bd,
  socials as _s,
} from "./data.defaults";

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  status?: string;
  sourceCode?: string;
  liveUrl?: string;
  imageUrl?: string;
  tech?: string[];
  year?: string;
}

export interface Publication {
  id: string;
  title: string;
  description: string;
  abstract?: string;
  journal?: string;
  year: number;
  doi?: string;
  link?: string;
  authors?: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  date: string;
  readTime?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  fullContent?: string;
  date: string;
}

export interface BrainDump {
  id: string;
  title: string;
  body: string;
  thought?: string; // Legacy field for db constraint
  date: string;
  time?: string;
  category?: string;
  likes?: number;
}

export const BRAIN_DUMP_CATEGORIES = [
  "rant",
  "poem",
  "good",
  "tech",
  "life",
  "idea",
  "random"
] as const;

export interface Social {
  id: string;
  platform: string;
  url: string;
  label: string;
}

export interface Painting {
  id: string;
  title: string;
  description: string;
  imageUrls: string[];
  date?: string;
  likes?: number;
}

// --- Caching Helper ---
function getCache<T>(key: string): T | null {
  try {
    const data = localStorage.getItem(`cache_${key}`);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function setCache<T>(key: string, data: T) {
  try {
    localStorage.setItem(`cache_${key}`, JSON.stringify(data));
  } catch (e) {
    console.warn("Cache save failed", e);
  }
}

// --- Async fetchers (try API first, fallback to cache, then defaults) ---

export async function fetchProjects(): Promise<Project[]> {
  try {
    const data = await api.getAll<Project>("projects");
    setCache("projects", data);
    return data;
  } catch (err) {
    console.error("Fetch projects failed:", err);
    return getCache<Project[]>("projects") || _p;
  }
}

export async function fetchPublications(): Promise<Publication[]> {
  try {
    const data = await api.getAll<Publication>("publications");
    setCache("publications", data);
    return data;
  } catch (err) {
    console.error("Fetch publications failed:", err);
    return getCache<Publication[]>("publications") || _pub;
  }
}

export async function fetchBlogs(): Promise<BlogPost[]> {
  try {
    const data = await api.getAll<BlogPost>("blogs");
    setCache("blogs", data);
    return data;
  } catch (err) {
    console.error("Fetch blogs failed:", err);
    return getCache<BlogPost[]>("blogs") || _b;
  }
}

export async function fetchNotes(): Promise<Note[]> {
  try {
    const data = await api.getAll<Note>("notes");
    setCache("notes", data);
    return data;
  } catch (err) {
    console.error("Fetch notes failed:", err);
    return getCache<Note[]>("notes") || _n;
  }
}

export async function fetchBrainDumps(): Promise<BrainDump[]> {
  try {
    const data = await api.getAll<BrainDump>("brain-dumps");
    setCache("brain-dumps", data);
    return data;
  } catch (err) {
    console.error("Fetch brain-dumps failed:", err);
    return getCache<BrainDump[]>("brain-dumps") || _bd;
  }
}

export async function fetchPaintings(): Promise<Painting[]> {
  try {
    const data = await api.getAll<Painting>("paintings");
    setCache("paintings", data);
    return data;
  } catch (err) {
    console.error("Fetch paintings failed:", err);
    return getCache<Painting[]>("paintings") || [];
  }
}

export async function fetchSocials(): Promise<Social[]> {
  try {
    const data = await api.getAll<Social>("contacts");
    setCache("contacts", data);
    return data;
  } catch (err) {
    console.error("Fetch socials failed:", err);
    return getCache<Social[]>("contacts") || _s;
  }
}

// --- Synchronous getters (for backward compatibility / initial render) ---
// These return hardcoded defaults instantly. Pages should prefer the async versions.

export function getProjects(): Project[] { return _p; }
export function getPublications(): Publication[] { return _pub; }
export function getBlogs(): BlogPost[] { return _b; }
export function getNotes(): Note[] { return _n; }
export function getBrainDumps(): BrainDump[] { return _bd; }
export function getPaintings(): Painting[] { return []; }
export function getSocials(): Social[] { return _s; }

// Legacy static exports for backward compatibility
export const projects: Project[] = _p;
export const publications: Publication[] = _pub;
export const blogs: BlogPost[] = _b;
export const notes: Note[] = _n;
export const brainDumps: BrainDump[] = _bd;
export const paintings: Painting[] = [];
export const socials: Social[] = _s;
