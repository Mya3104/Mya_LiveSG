import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_NEIGHBORHOODS, WORKPLACE_HUBS } from './src/data/singaporeData.ts';
import { rankNeighborhoods, parseNaturalLanguageQuery } from './src/utils/recommendationEngine.ts';
import { UserPreferences } from './src/types.ts';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Google GenAI client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'WhereSG AI Singapore Intelligence API' });
});

// 2. Real-time Singapore Data API (Simulating Live Gov/LTA/NEA/MAS feeds)
app.get('/api/realtime-sg', (req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    weather: {
      temperature: 30.5,
      condition: 'Fair & Warm',
      uvIndex: 7,
      psiAirQuality: 38, // Good
      forecast: 'Isolated afternoon showers in Central/West SG',
    },
    financial: {
      masSoraBenchmarkRate: 3.12, // %
      bankMortgageRate3YFixed: 2.85,
      hdbConcessionaryLoanRate: 2.60,
    },
    transport: {
      mrtSystemStatus: 'Normal Operations',
      ltaCongestionIndex: 'Moderate (Peak Evening)',
    },
    market: {
      uraPrivatePropertyIndexQoQ: '+1.1%',
      hdbResalePriceIndexQoQ: '+1.5%',
    },
  });
});

// 3. Recommendation API
app.post('/api/recommend', async (req, res) => {
  try {
    const preferences: UserPreferences = req.body;
    let enrichedQuery = preferences.query || '';

    // Step A: Rank based on Singapore real multi-attribute mathematical model
    const ranked = rankNeighborhoods(preferences, INITIAL_NEIGHBORHOODS);

    // Step B: If Gemini API is available and query is non-empty, enrich top results with bespoke AI insight
    const ai = getAIClient();
    if (ai && enrichedQuery.trim().length > 5) {
      try {
        const prompt = `You are WhereSG AI, an elite Singapore urban planner, property economist, and relocation expert.
The user submitted this specific Singapore housing requirement:
"${enrichedQuery}"

Top ranked recommended estate: ${ranked[0].name} (${ranked[0].region} Region, Match score: ${ranked[0].matchScore}/100).
Second ranked: ${ranked[1]?.name || 'N/A'}.

In 2-3 concise, highly factual sentences with real Singapore context (mentioning specific MRT lines, travel times, schools, or price psf), explain why ${ranked[0].name} is the optimal match for their exact constraints. Be objective, helpful, and specific.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
        });

        if (response.text) {
          ranked[0].whyGreatMatch = response.text.trim();
        }
      } catch (aiErr) {
        console.warn('Gemini API optional enhancement skipped:', aiErr);
      }
    }

    res.json({
      success: true,
      preferences,
      results: ranked,
    });
  } catch (error: any) {
    console.error('Recommendation API error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// 4. AI Deep Estate Analysis & Transition Plan
app.post('/api/ai/deep-analysis', async (req, res) => {
  try {
    const { neighborhoodId, userPreferences } = req.body;
    const estate = INITIAL_NEIGHBORHOODS.find((n) => n.id === neighborhoodId) || INITIAL_NEIGHBORHOODS[0];

    const ai = getAIClient();
    if (!ai) {
      return res.json({
        success: true,
        analysis: `${estate.name} offers a compelling blend of connectivity and amenities for your lifestyle. With ${estate.mrtStations.length} MRT stations nearby and top schools like ${estate.schools[0]?.name}, it provides strong day-to-day balance within your target parameters.`,
      });
    }

    const prompt = `You are WhereSG AI's Senior Relocation Strategist.
Generate a structured deep evaluation for living in ${estate.name}, Singapore.
User requirements:
- Query: ${userPreferences.query || 'Standard family profile'}
- Property Category: ${userPreferences.propertyCategory}
- Budget: SGD $${userPreferences.budgetMax?.toLocaleString()}
- Workplace: ${userPreferences.primaryWorkplace} (Commute: ${estate.commutes[userPreferences.primaryWorkplace]?.mrtDurationMins || 25} mins)
- Primary Schools: ${estate.schools.map((s) => s.name).join(', ')}

Please provide:
1. Commute & Transit Efficiency Analysis
2. Primary School Balloting Strategy (<1km and <2km dynamics)
3. 5-Year Capital Appreciation & Exit Strategy
4. Hidden Local Gem & Lifestyle Pro-Tip`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
    });

    res.json({
      success: true,
      analysis: response.text || '',
    });
  } catch (error: any) {
    console.error('Deep analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 5. AI Community Forum Sentiment Synthesizer
app.post('/api/ai/sentiment-summary', async (req, res) => {
  try {
    const { neighborhoodName, focus } = req.body;
    const ai = getAIClient();
    if (!ai) {
      return res.json({
        summary: `Residents in ${neighborhoodName} appreciate the self-contained amenities, abundant parks, and direct public transport access. Minor concerns center on peak hour train passenger volume.`,
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: `Summarize resident consensus from Singapore local forums (HardwareZone EDMW, Reddit r/singapore, PropertyGuru) regarding living in ${neighborhoodName}, focusing on ${focus || 'family livability, noise, and amenities'}. Keep to 3 clear bullet points.`,
    });

    res.json({
      summary: response.text || '',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Vite Middleware & Production Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WhereSG AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
