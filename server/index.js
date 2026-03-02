// ============================================================
// Main Express Server — Turso (SQLite) Version
// ============================================================
import "dotenv/config";
import express from "express";
import cors from "cors";
import { createClient } from "@libsql/client";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

const app = express();
const PORT = process.env.PORT || 4000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ── Root Route ────────────────────────────────────────────────
app.get("/", (req, res) => {
    res.send("🚀 Suman's API is running!");
});

// ── Cloudinary config ────────────────────────────────────────
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Connect to Turso ─────────────────────────────────────────
const db = createClient({
    url: process.env.TURSO_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

// ── Initialize Schema ────────────────────────────────────────
async function initDB() {
    try {
        await db.executeMultiple(`
            CREATE TABLE IF NOT EXISTS projects (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT DEFAULT '',
                longDescription TEXT DEFAULT '',
                status TEXT DEFAULT 'Active',
                sourceCode TEXT DEFAULT '',
                liveUrl TEXT DEFAULT '',
                imageUrl TEXT DEFAULT '',
                tech TEXT DEFAULT '[]',
                year TEXT DEFAULT '',
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS publications (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT DEFAULT '',
                abstract TEXT DEFAULT '',
                journal TEXT DEFAULT '',
                year INTEGER DEFAULT 2024,
                doi TEXT DEFAULT '',
                link TEXT DEFAULT '',
                authors TEXT DEFAULT '[]',
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS blogs (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                excerpt TEXT DEFAULT '',
                content TEXT DEFAULT '',
                imageUrl TEXT DEFAULT '',
                date TEXT DEFAULT '',
                readTime TEXT DEFAULT '5 min',
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS notes (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                content TEXT DEFAULT '',
                fullContent TEXT DEFAULT '',
                date TEXT DEFAULT '',
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS brain_dumps (
                id TEXT PRIMARY KEY,
                title TEXT DEFAULT '',
                thought TEXT DEFAULT '',
                body TEXT DEFAULT '',
                date TEXT DEFAULT '',
                time TEXT DEFAULT '',
                category TEXT DEFAULT '',
                likes INTEGER DEFAULT 0,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS socials (
                id TEXT PRIMARY KEY,
                platform TEXT NOT NULL,
                url TEXT DEFAULT '',
                label TEXT DEFAULT '',
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS like_logs (
                item_id TEXT,
                ip_address TEXT,
                PRIMARY KEY (item_id, ip_address)
            );
        `);

        // --- Migration: Add columns if they don't exist ---
        const tableInfo = await db.execute("PRAGMA table_info(brain_dumps)");
        const columns = tableInfo.rows.map(r => r.name);
        if (!columns.includes("title")) {
            await db.execute("ALTER TABLE brain_dumps ADD COLUMN title TEXT DEFAULT ''");
            console.log("🛠️ Added 'title' column to brain_dumps");
        }
        if (!columns.includes("body")) {
            await db.execute("ALTER TABLE brain_dumps ADD COLUMN body TEXT DEFAULT ''");
            console.log("🛠️ Added 'body' column to brain_dumps");
        }

        console.log("✅ Turso Database initialized");
    } catch (err) {
        console.error("❌ Turso Init Error:", err.message);
    }
}
initDB();

// ── Auth middleware ──────────────────────────────────────────
const requireAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        return res.status(401).json({ error: "Invalid token" });
    }
};

// ── Auth routes ──────────────────────────────────────────────
let adminHash = "";
(async () => {
    adminHash = await bcryptjs.hash(process.env.ADMIN_PASSWORD, 10);
})();

app.post("/api/auth/login", async (req, res) => {
    try {
        const { password } = req.body;
        const valid = await bcryptjs.compare(password, adminHash);
        if (!valid) return res.status(401).json({ error: "Wrong password" });
        const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/auth/verify", requireAuth, (req, res) => {
    res.json({ valid: true });
});

// ── File upload via Cloudinary ───────────────────────────────
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

app.post("/api/upload", requireAuth, upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file provided" });
        const b64 = req.file.buffer.toString("base64");
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: "sayhitosuman",
            resource_type: "auto",
        });
        res.json({ url: result.secure_url, publicId: result.public_id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── SQL Helpers ──────────────────────────────────────────────
function parseItem(item) {
    if (!item) return null;
    const result = { ...item };
    if (result.tech) result.tech = JSON.parse(result.tech);
    if (result.authors) result.authors = JSON.parse(result.authors);
    return result;
}

function stringifyItem(body) {
    const result = { ...body };
    if (Array.isArray(result.tech)) result.tech = JSON.stringify(result.tech);
    if (Array.isArray(result.authors)) result.authors = JSON.stringify(result.authors);
    return result;
}

// ── Generic CRUD factory (SQL version) ────────────────────────
function createCrudRoutes(apiPath, tableName) {
    // GET all
    app.get(`/api/${apiPath}`, async (req, res) => {
        try {
            const result = await db.execute(`SELECT * FROM ${tableName} ORDER BY createdAt DESC`);
            res.json(result.rows.map(parseItem));
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // GET one
    app.get(`/api/${apiPath}/:id`, async (req, res) => {
        try {
            const result = await db.execute({
                sql: `SELECT * FROM ${tableName} WHERE id = ?`,
                args: [req.params.id]
            });
            if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
            res.json(parseItem(result.rows[0]));
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // POST create
    app.post(`/api/${apiPath}`, requireAuth, async (req, res) => {
        try {
            const item = stringifyItem(req.body);
            const keys = Object.keys(item);
            const placeholders = keys.map(() => "?").join(", ");
            const values = Object.values(item);

            await db.execute({
                sql: `INSERT INTO ${tableName} (${keys.join(", ")}) VALUES (${placeholders})`,
                args: values
            });
            res.status(201).json(req.body);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // PUT update
    app.put(`/api/${apiPath}/:id`, requireAuth, async (req, res) => {
        try {
            const item = stringifyItem(req.body);
            delete item.id; // Don't update the ID
            const keys = Object.keys(item);
            const setClause = keys.map(k => `${k} = ?`).join(", ");
            const values = [...Object.values(item), req.params.id];

            await db.execute({
                sql: `UPDATE ${tableName} SET ${setClause} WHERE id = ?`,
                args: values
            });
            res.json(req.body);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // DELETE
    app.delete(`/api/${apiPath}/:id`, requireAuth, async (req, res) => {
        try {
            await db.execute({
                sql: `DELETE FROM ${tableName} WHERE id = ?`,
                args: [req.params.id]
            });
            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // BULK REPLACE
    app.put(`/api/${apiPath}`, requireAuth, async (req, res) => {
        try {
            const items = req.body;
            if (!Array.isArray(items)) return res.status(400).json({ error: "Expected array" });

            await db.execute(`DELETE FROM ${tableName}`);
            for (const item of items) {
                const sItem = stringifyItem(item);
                const keys = Object.keys(sItem);
                const placeholders = keys.map(() => "?").join(", ");
                await db.execute({
                    sql: `INSERT INTO ${tableName} (${keys.join(", ")}) VALUES (${placeholders})`,
                    args: Object.values(sItem)
                });
            }
            res.json({ success: true, count: items.length });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}

// Register routes
createCrudRoutes("projects", "projects");
createCrudRoutes("publications", "publications");
createCrudRoutes("blogs", "blogs");
createCrudRoutes("notes", "notes");
createCrudRoutes("brain-dumps", "brain_dumps");
createCrudRoutes("contacts", "socials");

// ── Like a brain dump (IP Tracked Toggling) ──────────────────
app.post("/api/brain-dumps/:id/like", async (req, res) => {
    const { id } = req.params;
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    if (typeof ip === 'string' && ip.includes(',')) ip = ip.split(',')[0].trim();

    console.log(`[LIKE] Attempt for ID: ${id} from IP: ${ip}`);

    try {
        // We use a manual check but enforced by DB constraints
        const check = await db.execute({
            sql: "SELECT 1 FROM like_logs WHERE item_id = ? AND ip_address = ?",
            args: [id, ip]
        });

        const alreadyLiked = check.rows.length > 0;

        // Start transaction if possible (Turso supports batches)
        if (alreadyLiked) {
            console.log(`[LIKE] Unliking for IP: ${ip}`);
            await db.batch([
                { sql: "UPDATE brain_dumps SET likes = CASE WHEN likes > 0 THEN likes - 1 ELSE 0 END WHERE id = ?", args: [id] },
                { sql: "DELETE FROM like_logs WHERE item_id = ? AND ip_address = ?", args: [id, ip] }
            ], "write");
        } else {
            console.log(`[LIKE] Liking for IP: ${ip}`);
            await db.batch([
                { sql: "INSERT INTO like_logs (item_id, ip_address) VALUES (?, ?)", args: [id, ip] },
                { sql: "UPDATE brain_dumps SET likes = likes + 1 WHERE id = ?", args: [id] }
            ], "write");
        }

        const result = await db.execute({
            sql: "SELECT likes FROM brain_dumps WHERE id = ?",
            args: [id]
        });

        const currentLikes = result.rows[0]?.likes || 0;
        res.json({ likes: currentLikes, liked: !alreadyLiked });
    } catch (err) {
        console.error(`[LIKE] Error: ${err.message}`);
        // If it failed because of Unique Constraint, it means they liked it in a race condition
        res.status(500).json({ error: "Could not process like. Please try again." });
    }
});

// ── Health check ─────────────────────────────────────────────
app.get("/api/health", async (req, res) => {
    try {
        await db.execute("SELECT 1");
        res.json({ status: "ok", db: "turso_connected", time: new Date().toISOString() });
    } catch (err) {
        res.json({ status: "degraded", error: err.message });
    }
});

// ── Start server ─────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`✨ Turso DB: ${process.env.TURSO_URL}`);
});
