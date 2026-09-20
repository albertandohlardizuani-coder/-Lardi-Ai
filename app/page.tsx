"use client";
import { useState, useRef } from "react";
// FIX 1: Use ENV - no more blocking!
const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || "";
const META_MODEL = "llama-3.3-70b-versatile";

const COUNTRIES = [
  { id: "germany", name: "Germany 🇩🇪" },
  { id: "usa", name: "USA 🇺🇸" },
  { id: "uk", name: "UK 🇬🇧" },
  { id: "canada", name: "Canada 🇨🇦" },
  { id: "dubai", name: "Dubai 🇦🇪" },
  { id: "space", name: "Space 🚀" },
];

// FIX 2: CLEAN FOR SCREEN - removes dash dash dash!
function cleanForDisplay(t: string) {
  return t
   .replace(/\|---+\|/g, "")
   .replace(/\|/g, " ")
   .replace(/###/g, "")
   .replace(/\*\*/g, "")
   .replace(/---+/g, " ")
   .replace(/--/g, " ")
   .replace(/—/g, " ")
   .replace(/```[\s\S]*?```/g, "")
   .replace(/`[^`]*`/g, "")
   .replace(/\s{2,}/g, " ")
   .trim();
}

function cleanForSpeech(t: string) {
  return cleanForDisplay(t).replace(/['\"]{3,}/g," ").replace(/[,]{2,}/g,",").replace(/[.]{3,}/g,". ");
}

export default function Home() {
  const [personUrl, setPersonUrl] = useState<string | null>(null);
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [prompt, setPrompt] = useState("");
  const [chat, setChat] = useState<{role:string,text:string}[]>([
    {role:"ai", text:"🇬🇭 LARDI AI with META + VIDEO! I'm Mama Lardi by Albert! Upload photo, I can make picture AND video!"}
  ]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [mode, setMode] = useState<"image"|"video">("image");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const speak = (t: string) => {
    if (!("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(cleanForSpeech(t));
    u.rate = 0.95; window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
  };

  const askMeta = async (txt: string) => {
    try {
      if (!GROQ_API_KEY) return `Boss, add GROQ key in Vercel Settings!`;
      const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: META_MODEL,
          messages: [
            { role: "system", content: `You are LARDI AI by Albert Kumasi Ghana. Answer in simple plain English only. No tables, no markdown, no ---, no ###, no | symbols. Just 2 short sentences.` },
            { role: "user", content: txt }
          ],
          max_tokens: 120
        })
      });
      const d = await r.json();
      let raw = d.choices?.[0]?.message?.content || "Done Boss!";
      return cleanForDisplay(raw); // FIX 3: CLEAN IT!
    } catch { return `Done! Your ${mode} in ${country.name} ready! 🇬🇭`; }
  };

  const onFile = async (e: any) => {
    const f = e.target.files?.[0]; if (!f) return;
    const url = URL.createObjectURL(f);
    setPersonUrl(url); setResult(null); setVideoUrl(null);
    const reply = await askMeta("uploaded photo");
    setChat(p=>[...p, {role:"user", text:"📸 Photo uploaded"}, {role:"ai", text: reply}]);
    speak(reply);
  };

  const generateImageBlend = async (): Promise<string> => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = 1024; canvas.height = 1280;
    const bg = new Image(); bg.crossOrigin = "anonymous";
    bg.src = `https://picsum.photos/seed/${country.id}${Date.now()}/1024/1280`;
    const person = new Image(); person.src = personUrl!;
    await new Promise<void>(r=>{
      let l=0; const c=()=>{l++; if(l>=2) r();};
      bg.onload=c; person.onload=c; bg.onerror=c; person.onerror=c;
      setTimeout(()=>r(), 4000);
    });
    ctx.drawImage(bg, 0, 0, 1024, 1280);
    const grad = ctx.createLinearGradient(0,0,0,1280);
    grad.addColorStop(0,"rgba(0,0,0,0)"); grad.addColorStop(1,"rgba(0,0,0,0.5)");
    ctx.fillStyle = grad; ctx.fillRect(0,0,1024,1280);
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.beginPath(); ctx.ellipse(512, 1190, 240, 55, 0, 0, Math.PI*2); ctx.fill();
    ctx.shadowColor = "rgba(0,0,0,0.8)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 15;
    ctx.drawImage(person, (1024-540)/2, 340, 540, 800);
    ctx.shadowBlur=0; ctx.shadowOffsetY=0;
    ctx.globalCompositeOperation="soft-light";
    ctx.fillStyle="rgba(255,220,180,0.12)"; ctx.fillRect(0,0,1024,1280);
    ctx.globalCompositeOperation="source-over";
    return canvas.toDataURL("image/png");
  };

  const generateVideoAI = async (imageData: string) => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = 1024; canvas.height = 1280;
    const img = new Image(); img.src = imageData;
    await new Promise(r=>{ img.onload=()=>r(null); setTimeout(()=>r(null),2000); });
    const stream = canvas.captureStream(30);
    const recorder = new MediaRecorder(stream, {mimeType:"video/webm;codecs=vp9"});
    const chunks: Blob[] = [];
    recorder.ondataavailable = e=>{ if(e.data.size>0) chunks.push(e.data); };
    const videoPromise = new Promise<string>(resolve=>{
      recorder.onstop = ()=>{
        const blob = new Blob(chunks, {type:"video/webm"});
        const url = URL.createObjectURL(blob);
        resolve(url);
      };
    });
    recorder.start();
    let frame = 0;
    const animate = () => {
      frame++;
      const zoom = 1 + frame*0.002;
      const xShake = Math.sin(frame*0.05)*3;
      ctx.clearRect(0,0,1024,1280);
      ctx.save();
      ctx.translate(512,640);
      ctx.scale(zoom,zoom);
      ctx.translate(-512 + xShake, -640);
      ctx.drawImage(img, 0, 0, 1024, 1280);
      ctx.restore();
      if(frame%5===0){
        ctx.fillStyle = `rgba(255,255,255,${Math.random()*0.5})`;
        ctx.beginPath();
        ctx.arc(Math.random()*1024, Math.random()*1280, Math.random()*3, 0, Math.PI*2);
        ctx.fill();
      }
      if(frame < 150){ requestAnimationFrame(animate); }
      else { recorder.stop(); }
    };
    animate();
    return videoPromise;
  };

  const generate = async () => {
    if (!personUrl) { alert("Upload photo first Boss!"); return; }
    setLoading(true);
    const userMsg = prompt || `Make ${mode} of me in ${country.name}`;
    setChat(p=>[...p, {role:"user", text: userMsg}]);
    const imageData = await generateImageBlend();
    setResult(imageData);
    if (mode === "video") {
      setChat(p=>[...p, {role:"ai", text: "🎬 Generating AI VIDEO... adding motion, sparkles..."}]);
      const vUrl = await generateVideoAI(imageData);
      setVideoUrl(vUrl);
      const reply = await askMeta(userMsg + " video done");
      setChat(p=>[...p, {role:"ai", text: reply + " Video ready! Save it!"}]);
      speak(reply + " Video ready!");
    } else {
      const reply = await askMeta(userMsg);
      setChat(p=>[...p, {role:"ai", text: reply}]);
      speak(reply);
    }
    setLoading(false);
  };

  const saveImage = () => {
    if(!result) return;
    const a = document.createElement("a");
    a.href = result; a.download = `lardi-${country.id}.png`; a.click();
  };
  const saveVideo = () => {
    if(!videoUrl) return;
    const a = document.createElement("a");
    a.href = videoUrl; a.download = `lardi-${country.id}.webm`; a.click();
  };

  return (
    <main style={{minHeight:"100vh",background:"#050505",color:"#fff",fontFamily:"system-ui",paddingBottom:90}}>
      <header style={{padding:14,textAlign:"center",borderBottom:"1px solid #222",position:"sticky",top:0,background:"#050505",zIndex:10}}>
        <h1 style={{fontSize:26,fontWeight:900,margin:0}}>🇬🇭 LARDI AI</h1>
        <p style={{fontSize:10,opacity:0.6,marginTop:4}}>META: {META_MODEL} | 🎬 AI VIDEO + 📸 IMAGE | by Albert</p>
      </header>
      <div style={{maxWidth:520,margin:"0 auto",padding:16,display:"flex",flexDirection:"column",gap:12}}>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setMode("image")} style={{flex:1,padding:12,borderRadius:10,fontWeight:800,background:mode==="image"?"#fff":"#222",color:mode==="image"?"#000":"#fff",border:"1px solid #333"}}>📸 IMAGE</button>
          <button onClick={()=>setMode("video")} style={{flex:1,padding:12,borderRadius:10,fontWeight:800,background:mode==="video"?"#fff":"#222",color:mode==="video"?"#000":"#fff",border:"1px solid #333"}}>🎬 AI VIDEO</button>
        </div>
        <div style={{background:"#111",borderRadius:16,padding:12,maxHeight:200,overflowY:"auto",display:"flex",flexDirection:"column",gap:8}}>
          {chat.slice(-4).map((m,i)=>(
            <div key={i} style={{alignSelf:m.role==="user"?"flex-end":"flex-start",background:m.role==="user"?"#fff":"#222",color:m.role==="user"?"#000":"#fff",padding:"8px 12px",borderRadius:14,fontSize:13,maxWidth:"85%"}}>{cleanForDisplay(m.text)}</div>
          ))}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={onFile} style={{display:"none"}}/>
        <button onClick={()=>fileInputRef.current?.click()} style={{padding:14,borderRadius:12,background:"#222",border:"1px dashed #555",color:"#fff",fontWeight:700}}>📸 Upload Photo</button>
        {personUrl && <img src={personUrl} style={{width:"100%",borderRadius:12,border:"1px solid #333",maxHeight:240,objectFit:"contain"}}/>}
        <select value={country.id} onChange={e=>setCountry(COUNTRIES.find(c=>c.id===e.target.value)!)} style={{padding:12,borderRadius:10,background:"#222",color:"#fff",border:"1px solid #333"}}>
          {COUNTRIES.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder={mode==="video"?"Describe video... (e.g., walking in Germany)":"Ask Meta or describe image..."} style={{padding:12,borderRadius:10,background:"#111",border:"1px solid #333",color:"#fff"}}/>
        <button onClick={generate} disabled={!personUrl||loading} style={{padding:16,borderRadius:14,fontWeight:900,fontSize:16,background:loading?"#444":personUrl?"#fff":"#222",color:personUrl?"#000":"#777"}}>
          {loading? (mode==="video"?"🎬 Creating AI Video...":"✨ Blending...") : (mode==="video"?"🎬 Generate AI VIDEO":"🚀 Generate IMAGE")}
        </button>
        {result && (
          <div style={{background:"#111",padding:12,borderRadius:16,border:"1px solid #333"}}>
            <p style={{fontSize:12,margin:"0 0 8px",fontWeight:700}}>{mode==="video"?"🎬 Preview Frame:":"📸 Result:"}</p>
            <img src={result} style={{width:"100%",borderRadius:12}}/>
            <button onClick={saveImage} style={{width:"100%",marginTop:10,padding:14,background:"#333",color:"#fff",borderRadius:10,fontWeight:800,border:"none"}}>💾 Save Image</button>
            {videoUrl && (
              <div style={{marginTop:12}}>
                <video src={videoUrl} controls loop autoPlay style={{width:"100%",borderRadius:12,border:"1px solid #444"}}/>
                <button onClick={saveVideo} style={{width:"100%",marginTop:10,padding:16,background:"#fff",color:"#000",borderRadius:12,fontWeight:900,fontSize:16,border:"none"}}>💾 SAVE AI VIDEO TO PHONE</button>
              </div>
            )}
          </div>
        )}
      </div>
      <canvas ref={canvasRef} style={{display:"none"}}/>
    </main>
  );
}