import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit for base64 camera images
app.use(express.json({ limit: "15mb" }));

// Lazy initialize Gemini AI client
let ai: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      console.warn("WARNING: GEMINI_API_KEY is not configured or uses the placeholder value. Please configure it in your Settings > Secrets panel.");
    }
    ai = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return ai;
}

// ---------------------------------------------------------
// 1. SMART TRAVEL PLANNER ENDPOINT
// ---------------------------------------------------------
app.post("/api/planner", async (req, res) => {
  try {
    const { destination, duration, budget, interests, transport, weather, crowdPreference } = req.body;
    
    const client = getGeminiClient();
    
    const prompt = `Create a highly personalized, complete travel itinerary for a trip to ${destination}.
    Trip Details:
    - Duration: ${duration} days
    - Budget Level: ${budget}
    - Interests: ${Array.isArray(interests) ? interests.join(", ") : interests}
    - Transportation Preference: ${transport}
    - Weather Context: ${weather}
    - Crowd Preference: ${crowdPreference}
    
    You must optimize the route and schedules considering the crowd preference ("${crowdPreference}") and weather ("${weather}"). Include budget estimates, crowd-density warnings for each time slot, and transportation details.
    
    Return a clean JSON object according to the schema specified.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["title", "summary", "budgetBreakdown", "itinerary"],
          properties: {
            title: { type: Type.STRING, description: "A catchy title for the itinerary" },
            summary: { type: Type.STRING, description: "A highly engaging overview of the customized travel plan" },
            budgetBreakdown: {
              type: Type.OBJECT,
              required: ["food", "activities", "lodging", "transportation", "currency"],
              properties: {
                food: { type: Type.NUMBER, description: "Estimated cost for food in local currency" },
                activities: { type: Type.NUMBER, description: "Estimated activities cost" },
                lodging: { type: Type.NUMBER, description: "Estimated accommodation cost" },
                transportation: { type: Type.NUMBER, description: "Estimated transportation cost" },
                currency: { type: Type.STRING, description: "Currency symbol or code (e.g. INR, USD, EUR)" }
              }
            },
            itinerary: {
              type: Type.ARRAY,
              description: "Day-by-day travel plan",
              items: {
                type: Type.OBJECT,
                required: ["dayNumber", "theme", "activities"],
                properties: {
                  dayNumber: { type: Type.INTEGER },
                  theme: { type: Type.STRING, description: "Theme/focus for the day" },
                  activities: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      required: ["time", "activity", "description", "crowdStatus", "transportRecommendation", "tips"],
                      properties: {
                        time: { type: Type.STRING, description: "e.g. 09:00 AM - 11:30 AM" },
                        activity: { type: Type.STRING, description: "Name of the place, tour, or activity" },
                        description: { type: Type.STRING, description: "Engaging details" },
                        crowdStatus: { type: Type.STRING, description: "Crowd status for this hour: Low, Moderate, High" },
                        transportRecommendation: { type: Type.STRING, description: "Best transport to get here or between sites" },
                        tips: { type: Type.STRING, description: "Local secret, photo tip, or weather warning" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Planner API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate travel plan" });
  }
});

// ---------------------------------------------------------
// 2. HERITAGE RECOGNITION & EXPLORER ENDPOINT
// ---------------------------------------------------------
app.post("/api/heritage/recognize", async (req, res) => {
  try {
    const { image, name, targetLanguage } = req.body;
    const client = getGeminiClient();
    
    let contents: any;
    let systemPrompt = `You are a world-class heritage exploration AI guide, specializing in identifying monuments, cultural sites, and artworks, and providing deeply detailed histories, legends, and travel analytics.
    
    Produce a detailed, premium documentation for the identified or specified monument.
    You must translate the response text fields to the target language if specified. Target language requested: "${targetLanguage || "English"}".
    
    Include:
    1. Monument identification (name, location, estimated age, primary builder)
    2. Deep historical details, architectural style explanations, and cultural significance.
    3. Fictional/historical folklore, myths, and legends.
    4. Best visual/photo spots with angles and golden hours.
    5. A 3-question interactive quiz about this monument to test user's knowledge.
    6. Local business connector recommendations (Supporting local craftsmen, traditional food, artisan workshops, and local guide community).
    
    Ensure all string properties in your JSON response are completely translated to "${targetLanguage || "English"}".`;

    if (image) {
      // Multimodal vision recognition
      const imagePart = {
        inlineData: {
          mimeType: "image/jpeg",
          data: image.split(",")[1] || image // strip base64 header if present
        }
      };
      const textPart = {
        text: `Analyze this image of a historical monument or heritage item. Identify it and provide complete, rich, structured information about it in JSON format.`
      };
      contents = { parts: [imagePart, textPart] };
    } else if (name) {
      // Text-based query for selected monument
      contents = `Generate comprehensive, rich heritage intelligence for the landmark: "${name}". Ensure it includes architecture, history, mythology, best photo spots, local business support suggestions, nearby attractions, and an interactive quiz.`;
    } else {
      return res.status(400).json({ error: "Either image or name must be provided" });
    }

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "name", "location", "quickFacts", "history", "architecture", 
            "culturalSignificance", "legends", "timeline", "photoSpots", 
            "nearbyAttractions", "localBusinesses", "quiz"
          ],
          properties: {
            name: { type: Type.STRING },
            location: { type: Type.STRING },
            quickFacts: {
              type: Type.OBJECT,
              required: ["established", "builder", "architecturalStyle", "primaryDeityOrPurpose", "bestTimeToVisit"],
              properties: {
                established: { type: Type.STRING },
                builder: { type: Type.STRING },
                architecturalStyle: { type: Type.STRING },
                primaryDeityOrPurpose: { type: Type.STRING },
                bestTimeToVisit: { type: Type.STRING }
              }
            },
            history: { type: Type.STRING, description: "Detailed, immersive historical narrative" },
            architecture: { type: Type.STRING, description: "Explanation of architectural techniques, styles, elements" },
            culturalSignificance: { type: Type.STRING, description: "Its cultural and spiritual significance to local communities" },
            legends: { type: Type.STRING, description: "Fascinating myths, legends, or folklore associated with it" },
            timeline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["year", "event"],
                properties: {
                  year: { type: Type.STRING },
                  event: { type: Type.STRING }
                }
              }
            },
            photoSpots: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["spot", "bestTime", "tip"],
                properties: {
                  spot: { type: Type.STRING, description: "Name of the vantage point" },
                  bestTime: { type: Type.STRING, description: "e.g. Sunrise, Sunset" },
                  tip: { type: Type.STRING, description: "Camera angle, composition, or secret tip" }
                }
              }
            },
            nearbyAttractions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["name", "distance", "description"],
                properties: {
                  name: { type: Type.STRING },
                  distance: { type: Type.STRING, description: "e.g. 500m walk, 2km drive" },
                  description: { type: Type.STRING }
                }
              }
            },
            localBusinesses: {
              type: Type.OBJECT,
              required: ["handicrafts", "restaurants", "performances", "workshops"],
              properties: {
                handicrafts: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ["name", "itemType", "description"],
                    properties: {
                      name: { type: Type.STRING, description: "Name of local boutique, vendor market or item" },
                      itemType: { type: Type.STRING, description: "e.g. Woodcarvings, Handloom Silks" },
                      description: { type: Type.STRING }
                    }
                  }
                },
                restaurants: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ["name", "cuisineType", "mustTryDish", "description"],
                    properties: {
                      name: { type: Type.STRING },
                      cuisineType: { type: Type.STRING },
                      mustTryDish: { type: Type.STRING },
                      description: { type: Type.STRING }
                    }
                  }
                },
                performances: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ["name", "schedule", "description"],
                    properties: {
                      name: { type: Type.STRING, description: "Name/type of traditional dance or performance" },
                      schedule: { type: Type.STRING },
                      description: { type: Type.STRING }
                    }
                  }
                },
                workshops: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ["name", "duration", "description"],
                    properties: {
                      name: { type: Type.STRING, description: "Artisan or pottery workshop name" },
                      duration: { type: Type.STRING },
                      description: { type: Type.STRING }
                    }
                  }
                }
              }
            },
            quiz: {
              type: Type.ARRAY,
              description: "A fun trivia quiz about this specific site",
              items: {
                type: Type.OBJECT,
                required: ["question", "options", "answerIndex", "explanation"],
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  answerIndex: { type: Type.INTEGER, description: "0-based index of correct option" },
                  explanation: { type: Type.STRING, description: "Educational explanation of why this answer is correct" }
                }
              }
            }
          }
        }
      }
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Heritage Recognition Error:", error);
    res.status(500).json({ error: error.message || "Failed to identify or explore heritage monument" });
  }
});

// ---------------------------------------------------------
// 3. CONVERSATIONAL HERITAGE GUIDE (CHAT) ENDPOINT
// ---------------------------------------------------------
app.post("/api/heritage/chat", async (req, res) => {
  try {
    const { history, message, systemInstruction } = req.body;
    const client = getGeminiClient();

    // Reconstruct the chat with custom configuration
    const chat = client.chats.create({
      model: "gemini-3.5-flash",
      history: history || [],
      config: {
        systemInstruction: systemInstruction || "You are a professional, friendly, and engaging heritage guide. Answer user questions with fascinating details, historical contexts, and a storytelling flair. Keep responses informative yet concise."
      }
    });

    const response = await chat.sendMessage({ message });
    
    // Construct response history in a compliant schema
    const newHistory = [
      ...(history || []),
      { role: "user", parts: [{ text: message }] },
      { role: "model", parts: [{ text: response.text }] }
    ];

    res.json({
      text: response.text,
      history: newHistory
    });
  } catch (error: any) {
    console.error("Heritage Chat Error:", error);
    res.status(500).json({ error: error.message || "Failed to chat with heritage guide" });
  }
});

// ---------------------------------------------------------
// 4. TEXT TO SPEECH (VOICE TOUR GUIDE) ENDPOINT
// ---------------------------------------------------------
app.post("/api/heritage/tts", async (req, res) => {
  try {
    const { text, voiceName } = req.body;
    const client = getGeminiClient();

    const selectedVoice = voiceName || "Kore"; // Kore, Zephyr, Puck, Charon, Fenrir

    console.log(`Generating TTS audio with voice: ${selectedVoice} for text of length: ${text.length}`);

    const response = await client.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: `Read this text in a pleasant tour guide style: ${text}` }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: selectedVoice }
          }
        }
      }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      res.json({ audio: base64Audio });
    } else {
      res.status(500).json({ error: "No audio was generated by the model" });
    }
  } catch (error: any) {
    console.error("Heritage TTS Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate TTS narration" });
  }
});

// ---------------------------------------------------------
// 5. DECISION INTELLIGENCE DASHBOARD ENDPOINT
// ---------------------------------------------------------
app.post("/api/analytics", async (req, res) => {
  try {
    const { selectedRegion, selectedTimeframe } = req.body;
    const client = getGeminiClient();

    const prompt = `You are a Chief Tourism Advisory AI and City Planner, generating highly realistic visitor, crowd, revenue, and conservation advisory analytics for the region "${selectedRegion || "Nationwide"}" over the timeframe "${selectedTimeframe || "Last 30 Days"}".
    
    Using standard municipal and tourism trends, generate:
    1. Monthly visitor trends and ticket revenues.
    2. Popularity ranking of the top 4 heritage attractions.
    3. An hourly crowd heatmap density list (0-100 density score, with descriptive labels) to optimize queue lines.
    4. Feedback sentiment distribution (Positive, Neutral, Negative) and key qualitative visitor feedback comments.
    5. A highly comprehensive, detailed AI Heritage Conservation Advisory Report outlining:
       - Structural health observations
       - Tourist pressure impact analysis
       - Recommendations for eco-tourism and sustainable community support.
       - Conservation budget allocation advice
       
    Provide the response in the specified JSON schema.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "region", "timeframe", "visitorTraffic", "attractionsPopularity", 
            "hourlyCrowdHeatmap", "touristSentiment", "conservationAdvisory"
          ],
          properties: {
            region: { type: Type.STRING },
            timeframe: { type: Type.STRING },
            visitorTraffic: {
              type: Type.ARRAY,
              description: "Visitor trends for the last 6 points in time",
              items: {
                type: Type.OBJECT,
                required: ["label", "visitors", "revenue"],
                properties: {
                  label: { type: Type.STRING, description: "e.g. Month or Week name" },
                  visitors: { type: Type.INTEGER, description: "Number of tourists" },
                  revenue: { type: Type.INTEGER, description: "Revenue in local currency" }
                }
              }
            },
            attractionsPopularity: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["name", "percentage", "rating"],
                properties: {
                  name: { type: Type.STRING },
                  percentage: { type: Type.INTEGER, description: "Visitor share percentage (e.g. 45 for 45%)" },
                  rating: { type: Type.NUMBER, description: "Average rating out of 5" }
                }
              }
            },
            hourlyCrowdHeatmap: {
              type: Type.ARRAY,
              description: "24-hour heat map representing crowd density",
              items: {
                type: Type.OBJECT,
                required: ["hour", "density", "status"],
                properties: {
                  hour: { type: Type.STRING, description: "e.g. 09:00 AM, 12:00 PM" },
                  density: { type: Type.INTEGER, description: "0 to 100 crowd level" },
                  status: { type: Type.STRING, description: "Low, Medium, Peak, Overloaded" }
                }
              }
            },
            touristSentiment: {
              type: Type.OBJECT,
              required: ["positive", "neutral", "negative", "keyFeedback"],
              properties: {
                positive: { type: Type.INTEGER, description: "Percentage e.g. 75" },
                neutral: { type: Type.INTEGER, description: "Percentage e.g. 15" },
                negative: { type: Type.INTEGER, description: "Percentage e.g. 10" },
                keyFeedback: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              }
            },
            conservationAdvisory: {
              type: Type.OBJECT,
              required: ["structuralHealthSummary", "environmentalFactors", "conservationActions", "budgetAllocationRecommendation"],
              properties: {
                structuralHealthSummary: { type: Type.STRING, description: "Analysis of stone decay, environmental wear, or structural challenges." },
                environmentalFactors: { type: Type.STRING, description: "How air quality, water seepage, heat, or foot traffic impacts the materials." },
                conservationActions: {
                  type: Type.ARRAY,
                  description: "Specific urgent or long-term conservation protocols needed.",
                  items: { type: Type.STRING }
                },
                budgetAllocationRecommendation: { type: Type.STRING, description: "Detailed guide on dividing restoration budgets between reinforcement, sensor networks, local training, and waste management." }
              }
            }
          }
        }
      }
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Analytics Dashboard API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate city advisory analytics" });
  }
});

// ---------------------------------------------------------
// VITE AND ASSETS STATIC ROUTING
// ---------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Smart Tourism & Heritage Platform running on port ${PORT}`);
  });
}

startServer();
