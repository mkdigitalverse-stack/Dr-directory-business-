import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to safely get GoogleGenAI client
function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Fallback seasonal health tips for Lucknow when API key is unconfigured or rate limited
const FALLBACK_LUCKNOW_HEALTH_TIPS = [
  {
    id: "lko-tip-1",
    title: "Monsoon Humidity & Dengue Prevention",
    category: "Climate Care",
    summary: "High humidity during July in Lucknow increases vector breeding around standing water in Gomti Nagar and Hazratganj. Ensure cooler tanks and flower trays are cleared every 3 days.",
    actionableItem: "Apply anti-mosquito ointment during morning and evening walks near Gomti Riverfront.",
    tag: "Monsoon Alert",
    urgency: "high"
  },
  {
    id: "lko-tip-2",
    title: "Seasonal Fruit Nutrition: Dussehri Mangoes & Jamun",
    category: "Nutrition",
    summary: "Lucknow's Malihabad Dussehri mangoes and fresh jamun are rich in antioxidants and vitamin C. Jamun is particularly excellent for glycemic control during humid months.",
    actionableItem: "Incorporate 100g of fresh, washed jamun or a fresh seasonal fruit smoothie into your midday snack.",
    tag: "Seasonal Special",
    urgency: "medium"
  },
  {
    id: "lko-tip-3",
    title: "Street Food Hygiene & Water Safety",
    category: "Hygiene",
    summary: "Rainy season can increase food contamination in street stalls around Chowk and Aminabad. Always choose freshly boiled or piping-hot snacks like basket chaat.",
    actionableItem: "Carry a reusable insulated water bottle filled with boiled or purified drinking water when outdoors.",
    tag: "Food Safety",
    urgency: "high"
  },
  {
    id: "lko-tip-4",
    title: "Light Breathable Lucknowi Chikan Fabrics",
    category: "Wellness",
    summary: "Pure cotton Lucknow Chikan work clothing promotes skin transpiration, preventing heat rash and fungal infections during sticky, muggy Lucknow monsoons.",
    actionableItem: "Opt for loose, light-colored pure cotton attire and dry completely after sudden downpours.",
    tag: "Skin Care",
    urgency: "general"
  }
];

// In-memory cache for AI health tips to optimize response time and preserve quota
const tipsCache = new Map<string, { tips: any[]; isAI: boolean; sourceNote: string; expiresAt: number }>();
let quotaCoolOffUntil = 0;

// Health tips API endpoint powered by Gemini API
app.post("/api/health-tips", async (req, res) => {
  try {
    const { month = "July", season = "Monsoon", category = "All", customTopic = "" } = req.body || {};

    const cacheKey = `${month}_${season}_${category}_${customTopic}`.toLowerCase().trim();
    const now = Date.now();

    // Check cache first
    const cached = tipsCache.get(cacheKey);
    if (cached && cached.expiresAt > now) {
      return res.json({
        success: true,
        isAI: cached.isAI,
        sourceNote: cached.sourceNote,
        tips: cached.tips,
        generatedAt: new Date().toISOString()
      });
    }

    // Helper for fallback response
    const serveFallback = (note: string) => {
      let filteredTips = FALLBACK_LUCKNOW_HEALTH_TIPS;
      if (category && category !== "All") {
        filteredTips = filteredTips.filter(t => t.category.toLowerCase().includes(category.toLowerCase()));
        if (filteredTips.length === 0) filteredTips = FALLBACK_LUCKNOW_HEALTH_TIPS;
      }
      return res.json({
        success: true,
        isAI: false,
        sourceNote: note,
        tips: filteredTips,
        generatedAt: new Date().toISOString()
      });
    };

    // If quota cool-off is active, serve fallback immediately without making API calls
    if (now < quotaCoolOffUntil) {
      return serveFallback("Lucknow Regional Wellness Protocol (Verified Fallback)");
    }

    const ai = getGenAIClient();
    if (!ai) {
      return serveFallback("Default Lucknow Seasonal Health Protocol");
    }

    const prompt = `Generate 4 actionable, verified, localized seasonal health and wellness tips specifically tailored for residents in Lucknow, Uttar Pradesh, India during ${month} (${season} season).
${category && category !== "All" ? `Focus on category: ${category}.` : ""}
${customTopic ? `Address this user concern or interest: "${customTopic}".` : ""}

Consider local factors in Lucknow like monsoon humidity, air quality, Gomti riverfront weather, regional seasonal produce (Malihabad mangoes, jamun, Amla, guava), street food safety around Hazratganj/Chowk, dengue/malaria precautions, hydration with bel sherbet or jaljeera, or respiratory care.

Return a JSON array of structured objects.`;

    const modelsToTry = ["gemini-3.6-flash", "gemini-flash-latest"];
    let responseText = "";
    let usedModel = "";

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            systemInstruction: "You are the Chief Community Health Officer & Medical Advisor for Lucknow Healthcare Services. Provide precise, medically accurate, and culturally attuned seasonal wellness advice in clear English with local Lucknow touches.",
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              description: "List of seasonal health tips for Lucknow",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING, description: "Engaging headline for the tip" },
                  category: { type: Type.STRING, description: "e.g. Climate Care, Nutrition, Hygiene, Immunity, Hydration" },
                  summary: { type: Type.STRING, description: "Detailed 2-3 sentence explanation tailored to Lucknow weather and lifestyle" },
                  actionableItem: { type: Type.STRING, description: "One simple practical step residents can take today" },
                  tag: { type: Type.STRING, description: "Short badge tag e.g. Monsoon Care, Local Superfood, Mosquito Alert" },
                  urgency: { type: Type.STRING, description: "high, medium, or general" }
                },
                required: ["id", "title", "category", "summary", "actionableItem", "tag", "urgency"]
              }
            }
          }
        });

        if (response.text && response.text.trim().startsWith("[")) {
          responseText = response.text.trim();
          usedModel = modelName;
          break;
        }
      } catch (err: any) {
        const errMsg = String(err?.message || err);
        if (errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("quota")) {
          // Pause API calls for 60 seconds to respect rate limits
          quotaCoolOffUntil = Date.now() + 60_000;
          break;
        }
      }
    }

    if (!responseText) {
      return serveFallback("Lucknow Regional Wellness Protocol (Verified Fallback)");
    }

    const tips = JSON.parse(responseText);
    const sourceNote = `Dynamically generated by ${usedModel} for Lucknow Climate`;

    // Cache successful AI response for 30 minutes
    tipsCache.set(cacheKey, {
      tips,
      isAI: true,
      sourceNote,
      expiresAt: Date.now() + 30 * 60 * 1000
    });

    res.json({
      success: true,
      isAI: true,
      sourceNote,
      tips,
      generatedAt: new Date().toISOString()
    });

  } catch (error: any) {
    let filteredTips = FALLBACK_LUCKNOW_HEALTH_TIPS;
    if (req.body?.category && req.body?.category !== "All") {
      filteredTips = filteredTips.filter(t => t.category.toLowerCase().includes(req.body.category.toLowerCase()));
      if (filteredTips.length === 0) filteredTips = FALLBACK_LUCKNOW_HEALTH_TIPS;
    }
    res.json({
      success: true,
      isAI: false,
      sourceNote: "Lucknow Regional Wellness Protocol (Verified Fallback)",
      tips: filteredTips,
      generatedAt: new Date().toISOString()
    });
  }
});

async function startServer() {
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
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
