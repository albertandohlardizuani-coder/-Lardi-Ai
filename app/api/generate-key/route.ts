export async function POST(req: Request) {
  const { name } = await req.json().catch(()=>({name:"LI-USER"}));
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let s = "";
  for(let i=0;i<32;i++) s+=chars.charAt(Math.floor(Math.random()*chars.length));
  const key = `LI-sk-${s.slice(0,8)}${Date.now().toString(36).toUpperCase()}${s.slice(8,24)}`;
  return Response.json({
    api_key: key,
    name: name || "LI-USER",
    instruction: "Add this key to Vercel LARDI_KEYS env, comma separated, then Redeploy. Save it! You see it once like Groq!",
    usage: `curl -X POST https://lardi-ai.vercel.app/api/li -d '{"apiKey":"${key}","message":"Hello"}' -H "Content-Type: application/json"`
  });
}
export async function GET(){
  return Response.json({how_to:"POST /api/generate-key with {name:'MyApp'} to get LI-sk-xxx key like Groq gsk_..."});
}