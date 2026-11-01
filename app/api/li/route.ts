export async function POST(req: Request) {
  const { message, apiKey } = await req.json();
  const groqKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ;
  
  const system = `You are LARDI AI by Albert Kumasi Ghana. 
  CRITICAL CLEAN RULES:
    - NEVER use markdown tables with | and ---. 
    - NEVER use **. Use clean simple text.
    - Answer in CLEAN LIST format: Use emoji bullets.
    - Example GOOD: "Gold - Used for jewelry, electronics. Economic: 1st export ~$1.5bn"
    - Keep answer short, clean, easy to read on phone.
    - Max 120 words.
    - No **, no |, no ---.`;

  try{
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions",{
      method:"POST",
      headers:{"Content-Type":"application/json","Authorization":`Bearer ${groqKey}`},
      body:JSON.stringify({model:"llama-3.3-70b-versatile", messages:[{role:"system", content: system},{role:"user", content: message}], max_tokens:400, temperature:0.4})
    });
    const d = await r.json();
    let answer = d.choices?.[0]?.message?.content || "LI: "+message;
    // Clean it again
    answer = answer.replace(/\*\*/g, "").replace(/\|/g, " - ").replace(/---+/g, "").trim();
    return Response.json({answer, time: new Date().toISOString()});
  }catch(e){ return Response.json({answer: "Error: "+String(e)}); }
}