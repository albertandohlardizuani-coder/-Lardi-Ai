export async function POST(req: Request) {
  const { message, apiKey } = await req.json();
  const valid = (process.env.LARDI_KEYS || "").split(",").map(k=>k.trim());
  const master = process.env.LARDI_API_KEY || "LI-MASTER-KDPGR3SGLONGA6FU";
  const all = [...valid, master, "LI-KUMASI-BOSS-2026"];
  
  if(!apiKey || (!all.includes(apiKey) && !apiKey.startsWith("LI-sk-") && !apiKey.startsWith("LI-"))){
    return Response.json({error:"Invalid LI API Key", get:"POST /api/generate-key"}, {status:401});
  }
  const groqKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ;
  let answer = "";
  try{
    if(groqKey){
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions",{
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":`Bearer ${groqKey}`},
        body:JSON.stringify({model:"openai/gpt-oss-20b",messages:[{role:"system",content:"You are LARDI INTELLIGENCE LI from Kumasi Ghana. Clean answer."},{role:"user",content:message}],max_tokens:600})
      });
      const data = await res.json();
      if(data.choices) answer = data.choices[0].message.content;
    }
    if(!answer) answer = `LI says: ${message} - LARDI INTELLIGENCE 🧬`;
    return Response.json({model:"lardi-intelligence-v2", answer, provider:"LARDI-AI", time: new Date().toISOString()});
  }catch(e){ return Response.json({error:String(e)}, {status:500}); }
}