
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({ message: "AI Legal Advisor Backend is running!" });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    keyLoaded: Boolean(process.env.OPENAI_API_KEY),
    version: "legal-advisor-debug-2",
  });
});

app.post("/api/legal-advice", async (req, res) => {
  try {
    const question = req.body?.question;

    if (typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        error: "Please enter a legal question.",
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "Backend cannot read OPENAI_API_KEY.",
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const result = await openai.responses.create({
      model: "gpt-4.1-mini",
      instructions:
        "Provide general legal information. Ask for jurisdiction when needed. Never invent laws or citations. Explain uncertainty and recommend a qualified lawyer for case-specific advice.",
      input: question.trim(),
    });

    res.json({
      answer: result.output_text,
      disclaimer:
        "General legal information only, not a substitute for advice from a qualified lawyer.",
    });
  } catch (error) {
    console.error("AI request failed:", error.message);

    res.status(500).json({
      error: error.message || "AI request failed.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
  console.log(
    "OpenAI key loaded:",
    Boolean(process.env.OPENAI_API_KEY)
  );
});
