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

    const prompt = `Generate outfit ideas in flat lay photography style for the following vibes: ${styles}, suitable for the ${season} season. Each outfit should include all items from the provided images (if any). The lighting is soft and natural.`;

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        max_tokens: 500, 
        messages: [
          { role: "system", content: "You are a helpful fashion stylist." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!openaiRes.ok) {
      const errorDetails = await openaiRes.text();
      return new Response(`OpenAI API error: ${errorDetails}`, { status: 500 });
    }

    const openaiData = await openaiRes.json();
    return new Response(JSON.stringify(openaiData), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
});
