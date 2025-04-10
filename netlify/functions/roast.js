import { OpenAI } from 'openai';

export default async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }

  try {
    const { text } = await req.json();
    
    if (!text || text.length < 10) {
      throw new Error('Resume text too short');
    }

    const openai = new OpenAI(process.env.OPENAI_API_KEY);
    const prompt = `Roast this resume professionally in 3 bullet points:
    1) Formatting issue
    2) Weak phrase
    3) Improvement suggestion
    
    Resume: ${text.substring(0, 1500)}`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 200
    });

    const roast = response.choices[0]?.message?.content?.trim() || "No roast generated";
    
    return new Response(JSON.stringify({ roast }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message || 'Roasting failed',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};