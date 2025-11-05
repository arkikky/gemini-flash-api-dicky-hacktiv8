import "dotenv/config";
import express from "express";
import multer from "multer";
import fs from "fs/promises";
import path from "path";
import { GoogleGenAI } from "@google/genai";

// @create-upload-folders
const UPLOADS_DIR = "./uploads";
await fs.mkdir(UPLOADS_DIR, { recursive: true });

// @configuration-multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const app = express();
// const upload = multer();
const upload = multer({ storage });
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// @gemini-model
const GEMINI_MODEL = "gemini-2.5-flash";

// @set(mime-type)
const getMimeType = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  const mimeMap = {
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    ".aac": "audio/aac",
    ".flac": "audio/flac",
    ".ogg": "audio/ogg",
    ".webm": "audio/webm",
    ".m4a": "audio/mp4",
  };
  return mimeMap[ext] || "application/octet-stream";
};

app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ready on http://localhost:${PORT}`));

// @generate-text
app.post("/generate-text", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });

    res.status(200).json({ result: response.text });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
});

// @generate-image
app.post("/generate-from-image", upload.single("image"), async (req, res) => {
  const { prompt } = req.body;

  if (!req.file) {
    return res.status(400).json({
      message:
        "File gambar tidak ditemukan. Harap unggah dengan field 'image'.",
    });
  }
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ message: "Prompt teks wajib diisi." });
  }

  try {
    const filePath = req.file.path;
    const fileBuffer = await fs.readFile(filePath);
    const base64Image = fileBuffer.toString("base64");

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        { text: prompt, type: "text" },
        { inlineData: { data: base64Image, mimeType: req.file.mimetype } },
      ],
    });

    res.status(200).json({ result: response.text });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ message: e.message || "Terjadi kesalahan internal." });
  }
});

// @generate-from-document
app.post(
  "/generate-from-document",
  upload.single("document"),
  async (req, res) => {
    const { prompt } = req.body;

    const filePath = req.file.path;
    const fileBuffer = await fs.readFile(filePath);
    const base64Document = fileBuffer.toString("base64");

    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: [
          {
            text: prompt ?? "Apa judul dari dokumen ini?",
            type: "text",
          },
          { inlineData: { data: base64Document, mimeType: req.file.mimetype } },
        ],
      });

      res.status(200).json({ result: response.text });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: e.message });
    }
  }
);

// @generate-from-audio
app.post("/generate-from-audio", upload.single("audio"), async (req, res) => {
  const { prompt } = req.body;

  const filePath = req.file.path;
  const fileBuffer = await fs.readFile(filePath);
  const base64Audio = fileBuffer.toString("base64");

  const mimeType =
    req.file.mimetype && req.file.mimetype !== "application/octet-stream"
      ? req.file.mimetype
      : getMimeType(req.file.originalname);

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          text:
            prompt ?? "Tolong transkripsikan dengan singkat isi rekaman ini.",
          type: "text",
        },
        { inlineData: { data: base64Audio, mimeType } },
      ],
    });

    res.status(200).json({ result: response.text });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
});
