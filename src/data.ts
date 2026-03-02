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

// --- Async fetchers (try API first, fallback to defaults) ---

export async function fetchProjects(): Promise<Project[]> {
  try {
    return await api.getAll<Project>("projects");
  } catch {
    return _p;
  }
}

export async function fetchPublications(): Promise<Publication[]> {
  try {
    return await api.getAll<Publication>("publications");
  } catch {
    return _pub;
  }
}

export async function fetchBlogs(): Promise<BlogPost[]> {
  try {
    return await api.getAll<BlogPost>("blogs");
  } catch {
    return _b;
  }
}

export async function fetchNotes(): Promise<Note[]> {
  try {
    return await api.getAll<Note>("notes");
  } catch {
    return _n;
  }
}

export async function fetchBrainDumps(): Promise<BrainDump[]> {
  try {
    return await api.getAll<BrainDump>("brain-dumps");
  } catch {
    return _bd;
  }
}

export async function fetchSocials(): Promise<Social[]> {
  try {
    return await api.getAll<Social>("contacts");
  } catch {
    return _s;
  }
}

// --- Synchronous getters (for backward compatibility / initial render) ---
// These return hardcoded defaults instantly. Pages should prefer the async versions.

export function getProjects(): Project[] { return _p; }
export function getPublications(): Publication[] { return _pub; }
export function getBlogs(): BlogPost[] { return _b; }
export function getNotes(): Note[] { return _n; }
export function getBrainDumps(): BrainDump[] { return _bd; }
export function getSocials(): Social[] { return _s; }

// Legacy static exports for backward compatibility
export const projects: Project[] = _p;
export const publications: Publication[] = _pub;
export const blogs: BlogPost[] = _b;
export const notes: Note[] = _n;
export const brainDumps: BrainDump[] = _bd;
export const socials: Social[] = _s;
