import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

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
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `Provide a daily summary of the latest medical news or clinical practice guideline updates specifically relevant to Emergency Room (ER/IGD) and Intensive Care Unit (ICU) patients. 
Return exactly 3 to 5 items.
Format the output as a clean JSON array of objects.
Each object must have the following keys:
- "title": a short, concise title (string)
- "summary": a brief 1-2 sentence description (string)
- "source": the name of the organization, journal, or guideline (string)
- "link": a URL pointing to the actual guideline document or source article (string)

Return ONLY the raw JSON array without any markdown formatting or code blocks.`;

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
        config: {
          temperature: 0.2,
          tools: [{ googleSearch: {} }]
        }
      });

      let text = response.text || "[]";
      // Remove any markdown code block artifacts if they exist
      text = text.replace(/```json\n?/g, "").replace(/```/g, "").trim();
      
      const data = JSON.parse(text);
      res.json(data);
    } catch (error: any) {
      const errStr = String(error);
      const errMsg = error?.message || "";
      
      console.warn("Fallback triggered due to Gemini API issue:", errMsg);
      
      // Fallback data (Database Guideline & Clinical Updates ER/ICU)
      const fallbackDatabase = [
        {
          title: "Surviving Sepsis Campaign Updates",
          summary: "Penekanan pada pengenalan dini, penyelesaian hour-1 bundle, dan resusitasi cairan bijaksana menggunakan parameter dinamis.",
          source: "Critical Care Medicine",
          link: "https://journals.lww.com/ccmjournal/Fulltext/2021/11000/Surviving_Sepsis_Campaign__International.21.aspx"
        },
        {
          title: "Global ARDS Definition 2023",
          summary: "Kriteria baru ARDS kini mencakup penggunaan High-Flow Nasal Oxygen (HFNO) ≥30 L/min dan SpO2/FiO2 ratio (≤315) jika PaO2 tidak tersedia.",
          source: "Am J Respir Crit Care Med",
          link: "https://www.atsjournals.org/doi/10.1164/rccm.202303-0558WS"
        },
        {
          title: "UKKA 2023 Hyperkalaemia Guidelines",
          summary: "Revisi panduan dosis insulin/dextrose berdasarkan GDS pre-treatment (GDS < 126 mg/dL wajib ditambah D10W follow-on) untuk cegah hipoglikemia berat.",
          source: "UK Kidney Association",
          link: "https://ukkidney.org/sites/default/files/UKKA_guideline_Treatment_of_Acute_Hyperkalaemia_in_Adults_v2_clean.pdf"
        },
        {
          title: "KDIGO 2024: Acute Kidney Injury",
          summary: "Pendekatan baru staging AKI dan penggunaan biomarker untuk memandu inisiasi Renal Replacement Therapy (RRT) di ICU.",
          source: "Kidney International",
          link: "https://kdigo.org/wp-content/uploads/2024/03/KDIGO-2024-AKI-Guideline-Public-Review-Draft.pdf"
        },
        {
          title: "AHA/ACC 2023: Cardiac Arrest Survivors",
          summary: "Panduan neuroprognostikasi dan Targeted Temperature Management (TTM) yang lebih fleksibel antara 32°C hingga 36°C.",
          source: "Circulation",
          link: "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001185"
        },
        {
          title: "GOLD 2024: COPD Exacerbation",
          summary: "Rekomendasi kuat untuk ventilasi non-invasif (NIV) awal pada eksaserbasi PPOK dengan asidosis respiratorik (pH ≤ 7.35).",
          source: "Global Initiative for Chronic Obstructive Lung Disease",
          link: "https://goldcopd.org/wp-content/uploads/2023/12/GOLD-2024-v1.1-1-Dec-2023_WMV.pdf"
        },
        {
          title: "IDSA/ATS: Severe CAP Management",
          summary: "Penggunaan kortikosteroid (Hydrocortisone) direkomendasikan pada pasien Pneumonia Komunitas berat dengan syok refrakter.",
          source: "Clinical Infectious Diseases",
          link: "https://academic.oup.com/cid/article/69/11/e27/5587930"
        },
        {
          title: "Brain Trauma Foundation: Severe TBI",
          summary: "Target CPP (Cerebral Perfusion Pressure) dipertahankan antara 60-73 mmHg; hindari hiperventilasi profilaksis pada 24 jam pertama.",
          source: "Neurosurgery",
          link: "https://braintrauma.org/guidelines/guidelines-for-the-management-of-severe-tbi-4th-ed"
        },
        {
          title: "ESC 2023: Acute Heart Failure",
          summary: "Inisiasi dini terapi kombinasi (SGLT2i, ARNI, MRA, Beta-blocker) sebelum pasien pulang dari perawatan dekompensasi akut.",
          source: "European Heart Journal",
          link: "https://academic.oup.com/eurheartj/article/44/37/3627/7248962"
        },
        {
          title: "GINA 2024: Severe Asthma in ER",
          summary: "Penggunaan ICS-Formoterol sebagai reliever lebih disarankan dibanding SABA tunggal untuk mengurangi risiko eksaserbasi berat.",
          source: "Global Initiative for Asthma",
          link: "https://ginasthma.org/wp-content/uploads/2024/05/GINA-2024-Main-Report-WMS-1.pdf"
        }
      ];

      // Always use fallback data if there's any API error
      // Rotasi harian berdasarkan tanggal
      const today = new Date();
      const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
      const startIndex = dayOfYear % fallbackDatabase.length;
      
      // Ambil 3 item secara melingkar (circular)
      const dailyNews = [];
      for (let i = 0; i < 3; i++) {
        dailyNews.push(fallbackDatabase[(startIndex + i) % fallbackDatabase.length]);
      }
      
      return res.json(dailyNews);
    }
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
