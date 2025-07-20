// supabase/functions/get-styling-advice/index.ts
import { serve } from "https://deno.land/std/http/server.ts";

// Replace with your own OpenAI API key
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

serve(async (req) => {
  try {
    const body = await req.json();
    const { season, styles } = body;

    if (!season || !styles || typeof season !== "string" || typeof styles !== "string") {
      return new Response("Missing or invalid 'season' or 'styles'", { status: 400 });
    }

    const prompt = `Generate flat lay outfit ideas with a ${styles} vibe for ${season}. Use all provided items if any. Lighting should be soft and natural.`;

    // start timing
    const startTime = Date.now();

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: 500,
        temperature: 0.7,
        messages: [
          { role: "system", content: "You are a helpful fashion stylist." },
          { role: "user", content: prompt },
        ],
      }),
    });

    // end timing
    const endTime = Date.now();
    const duration = endTime - startTime; // duration in milliseconds

    if (!openaiRes.ok) {
      const errorDetails = await openaiRes.text();
      return new Response(`OpenAI API error: ${errorDetails}`, { status: 500 });
    }

    const openaiData = await openaiRes.json();
    openaiData.responseTime = duration; // add response time to the data

    return new Response(JSON.stringify(openaiData), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
});
