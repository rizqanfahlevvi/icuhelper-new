import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

  const getFallback = () => {
    const isRefresh = req.query.refresh === 'true';
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    const startIndex = isRefresh 
      ? Math.floor(Math.random() * fallbackDatabase.length) 
      : (dayOfYear % fallbackDatabase.length);
    
    const dailyNews = [];
    for (let i = 0; i < 3; i++) {
      dailyNews.push(fallbackDatabase[(startIndex + i) % fallbackDatabase.length]);
    }
    return dailyNews;
  };

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is missing, returning fallback");
      return res.status(200).json(getFallback());
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const isRefresh = req.query.refresh === 'true';
    const refreshPrompt = isRefresh ? `\nPlease provide completely different news/guidelines from the previous ones. Randomized ID: ${Date.now()}` : "";
    
    const prompt = `Berikan 3 ringkasan berita medis terbaru, update guideline klinis, atau temuan studi klinis yang SANGAT RELEVAN untuk dokter jaga di IGD (Instalasi Gawat Darurat) dan ICU (Intensive Care Unit) dalam bahasa Indonesia.
Fokus pada penanganan gawat darurat, resusitasi, critical care, ACLS, ATLS, sepsis, ventilasi mekanik, atau farmakoterapi kritis.

Respond in strict JSON array format with objects containing:
- "title": a short, concise title (string)
- "summary": a brief 1-2 sentence description (string)
- "source": the name of the organization, journal, or guideline (string)
- "link": a URL pointing to the actual guideline document or source article (string)

Return ONLY the raw JSON array without any markdown formatting or code blocks.${refreshPrompt}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: isRefresh ? 0.7 : 0.2,
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text from Gemini API");
    }

    let jsonStr = text;
    if (text.includes("```json")) {
      jsonStr = text.split("```json")[1].split("```")[0].trim();
    } else if (text.includes("```")) {
      jsonStr = text.split("```")[1].split("```")[0].trim();
    }

    const data = JSON.parse(jsonStr);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Vercel API route error:", error);
    // Always use fallback data if there's any API error
    return res.status(200).json(getFallback());
  }
}
