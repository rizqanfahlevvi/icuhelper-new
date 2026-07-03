import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { getDailyNews } from "./api/_lib/dailyNews";
import { verifyIdToken, extractBearerToken } from "./api/_lib/verifyToken";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/daily-news", async (req, res) => {
    const idToken = extractBearerToken(req.headers.authorization);
    if (!(await verifyIdToken(idToken))) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const isRefresh = req.query.refresh === 'true';
    const data = await getDailyNews(process.env.GEMINI_API_KEY, isRefresh);
    res.json(data);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
