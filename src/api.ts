// ============================================================
// API Client — talks to your Express backend
// ============================================================

// In development, backend is on localhost:4000
// In production, change this to your Render URL
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// ── Token management ─────────────────────────────────────────
let token: string | null = localStorage.getItem("admin_token");

export function setToken(t: string | null) {
    token = t;
    if (t) localStorage.setItem("admin_token", t);
    else localStorage.removeItem("admin_token");
}

export function getToken(): string | null {
    return token;
}

// ── Base fetch wrapper ───────────────────────────────────────
async function apiFetch<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}/api${path}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || res.statusText);
    }

    return res.json();
}

// ── Auth ─────────────────────────────────────────────────────
export async function login(password: string): Promise<string> {
    const data = await apiFetch<{ token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ password }),
    });
    setToken(data.token);
    return data.token;
}

export async function verifyToken(): Promise<boolean> {
    try {
        await apiFetch<{ valid: boolean }>("/auth/verify");
        return true;
    } catch {
        setToken(null);
        return false;
    }
}

export function logout() {
    setToken(null);
}

// ── Generic CRUD ─────────────────────────────────────────────
export async function getAll<T>(resource: string): Promise<T[]> {
    return apiFetch<T[]>(`/${resource}`);
}

export async function getOne<T>(resource: string, id: string): Promise<T> {
    return apiFetch<T>(`/${resource}/${id}`);
}

export async function create<T>(resource: string, data: T): Promise<T> {
    return apiFetch<T>(`/${resource}`, {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function update<T>(resource: string, id: string, data: T): Promise<T> {
    return apiFetch<T>(`/${resource}/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function remove(resource: string, id: string): Promise<void> {
    await apiFetch(`/${resource}/${id}`, { method: "DELETE" });
}

export async function bulkReplace<T>(resource: string, items: T[]): Promise<void> {
    await apiFetch(`/${resource}`, {
        method: "PUT",
        body: JSON.stringify(items),
    });
}

// ── Like an item (public) ───────────────────────────────
export async function toggleLikeCount(resource: "brain-dumps" | "paintings", id: string): Promise<{ likes: number, liked: boolean }> {
    return apiFetch<{ likes: number, liked: boolean }>(`/${resource}/${id}/like`, {
        method: "POST",
    });
}

// ── File upload ──────────────────────────────────────────────
export interface UploadResult {
    url: string;
    publicId: string;
    width?: number;
    height?: number;
    format?: string;
    size?: number;
}

export async function uploadFile(file: File): Promise<UploadResult> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${BASE_URL}/api/upload`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || res.statusText);
    }

    return res.json();
}
