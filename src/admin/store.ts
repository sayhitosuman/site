// ============================================================
// Admin Store — talks to Express API
// ============================================================
import type { Project, BlogPost, Publication, Note, BrainDump, Social } from "../data";
import * as api from "../api";

export type { Project, BlogPost, Publication, Note, BrainDump, Social };

// Resource name mapping
const RESOURCES = {
  projects: "projects",
  blogs: "blogs",
  publications: "publications",
  notes: "notes",
  brainDumps: "brain-dumps",
  contacts: "contacts",
} as const;

export function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// --- Async CRUD operations ---
export const store = {
  // Projects
  getProjects: async (): Promise<Project[]> => api.getAll<Project>(RESOURCES.projects),
  createProject: async (d: Project): Promise<Project> => api.create<Project>(RESOURCES.projects, d),
  updateProject: async (d: Project): Promise<Project> => api.update<Project>(RESOURCES.projects, d.id, d),
  deleteProject: async (id: string): Promise<void> => api.remove(RESOURCES.projects, id),

  // Blogs
  getBlogs: async (): Promise<BlogPost[]> => api.getAll<BlogPost>(RESOURCES.blogs),
  createBlog: async (d: BlogPost): Promise<BlogPost> => api.create<BlogPost>(RESOURCES.blogs, d),
  updateBlog: async (d: BlogPost): Promise<BlogPost> => api.update<BlogPost>(RESOURCES.blogs, d.id, d),
  deleteBlog: async (id: string): Promise<void> => api.remove(RESOURCES.blogs, id),

  // Publications
  getPublications: async (): Promise<Publication[]> => api.getAll<Publication>(RESOURCES.publications),
  createPublication: async (d: Publication): Promise<Publication> => api.create<Publication>(RESOURCES.publications, d),
  updatePublication: async (d: Publication): Promise<Publication> => api.update<Publication>(RESOURCES.publications, d.id, d),
  deletePublication: async (id: string): Promise<void> => api.remove(RESOURCES.publications, id),

  // Notes
  getNotes: async (): Promise<Note[]> => api.getAll<Note>(RESOURCES.notes),
  createNote: async (d: Note): Promise<Note> => api.create<Note>(RESOURCES.notes, d),
  updateNote: async (d: Note): Promise<Note> => api.update<Note>(RESOURCES.notes, d.id, d),
  deleteNote: async (id: string): Promise<void> => api.remove(RESOURCES.notes, id),

  // Brain Dumps
  getBrainDumps: async (): Promise<BrainDump[]> => api.getAll<BrainDump>(RESOURCES.brainDumps),
  createBrainDump: async (d: BrainDump): Promise<BrainDump> => api.create<BrainDump>(RESOURCES.brainDumps, d),
  updateBrainDump: async (d: BrainDump): Promise<BrainDump> => api.update<BrainDump>(RESOURCES.brainDumps, d.id, d),
  deleteBrainDump: async (id: string): Promise<void> => api.remove(RESOURCES.brainDumps, id),

  // Contacts
  getContacts: async (): Promise<Social[]> => api.getAll<Social>(RESOURCES.contacts),
  createContact: async (d: Social): Promise<Social> => api.create<Social>(RESOURCES.contacts, d),
  updateContact: async (d: Social): Promise<Social> => api.update<Social>(RESOURCES.contacts, d.id, d),
  deleteContact: async (id: string): Promise<void> => api.remove(RESOURCES.contacts, id),
};
