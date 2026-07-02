import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import { getCompletionFromOpenAI, generateRepoCards } from "./openai.js";
import { assertSafeUrl } from "./lib/url-guard.js";
import { extractTextFromPDF, fetchPdfBuffer } from "./lib/pdf.js";
import { rateLimit } from "./lib/rate-limit.js";

dotenv.config();

// Restrict CORS to your frontend origins (override via ALLOWED_ORIGINS, comma-separated).
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const app = express();
app.set("trust proxy", true); // behind a proxy (Vercel/Azure/etc.) — needed for correct client IP
app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));

// Throttle the expensive, unauthenticated endpoint.
const limiter = rateLimit({ windowMs: 60_000, max: 20 });

// Health check.
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Extract a résumé PDF (by URL) into the structured JSON schema.
app.post("/extract-pdf", limiter, async (req, res) => {
  const { pdfUrl } = req.body ?? {};

  try {
    const safeUrl = await assertSafeUrl(pdfUrl); // SSRF guard: http(s) only, no private hosts
    const buffer = await fetchPdfBuffer(safeUrl.toString());
    const text = await extractTextFromPDF(buffer);

    const json = await getCompletionFromOpenAI(JSON.stringify({ text }, null, 2));

    let parsed;
    try {
      parsed = JSON.parse(json);
    } catch {
      return res.status(502).json({ error: "Upstream returned malformed data." });
    }

    return res.json(parsed);
  } catch (error) {
    const status = error.statusCode || 500;
    if (status >= 500) console.error("Error processing PDF:", error);
    return res.status(status).json({ error: error.message || "Failed to process PDF" });
  }
});

// Turn GitHub repos into recruiter-legible project cards (AI-written).
app.post("/github-cards", limiter, async (req, res) => {
  const { repos } = req.body ?? {};
  if (!Array.isArray(repos) || repos.length === 0) {
    return res.status(400).json({ error: "Provide a non-empty repos array." });
  }
  try {
    const cards = await generateRepoCards(repos);
    return res.json({ cards });
  } catch (error) {
    console.error("Error generating repo cards:", error);
    return res.status(502).json({ error: "Failed to generate cards." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SnapCV backend running on port ${PORT}`);
});
