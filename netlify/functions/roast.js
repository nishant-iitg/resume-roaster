// netlify/functions/roast.js
import { OpenAI } from 'openai';

export default async (req) => {
  const { text } = await req.json();
  
  const openai = new OpenAI(process.env.OPENAI_API_KEY);
  const prompt = `
    Roast this resume in 3 bullet points (be brutally honest but constructive):
    - Formatting issue
    - Useless buzzword
    - Missing metric
    ---
    ${text}
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8  // More creative roasts
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ 
      roast: response.choices[0].message.content 
    })
  };
};