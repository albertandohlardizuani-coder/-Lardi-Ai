"use client";
import { useState, useEffect, useRef } from "react";

export default function Page() {
  const [q, setQ] = useState("");
  const [chats, setChats] = useState<any[]>([]);
  const [memories, setMemories] = useState<any[]>([]);
  const [goal, setGoal] = useState("");
  const [showSet, setShowSet] = useState(false);
  const [liveDate, setLiveDate] = useState("");
  const [liveTime, setLiveTime] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ✅ VERCEL ENV - From your choice 1 - No block!
  const groqKey = process.env.NEXT_PUBLIC_GROQ_KEY || "";
  const geminiKey = process.env.NEXT_PUBLIC_GEMINI_KEY || "";

  // ✅ YOUR EXACT CLEANER FROM SCREENSHOT - Boss this is YOUR code!
  const cleanAIAnswer = (text: string) => {
    if (!text) return "";
    let t = text;
    t = t.replace(/^\s*\|\?\s*[-|:s]+\s*$/gm, "");
    t = t.replace(/^\s*\|\s*#\s*\|\s*$/gm, "");
    t = t.replace(/\*\*\*(.*?)\*\*\*/g, "$1");
    t = t.replace(/\*\*(.*?)\*\*/g, "$1");
    t = t.replace(/__(.*?)__/g, "$1");
    t = t.replace(/```[\s\S]*?```/g, "");
    t = t.replace(/`([^`]+)`/g, "$1");
    t = t.replace(/^#{1,6}\s*/gm, "");
    t = t.replace(/:::/g, "");
    t = t.replace(/^\s*[-_]{3,}\s*$/gm, "");
    t = t.replace(/^\s*[|]\s*[-]+\s*$/gm, "");
    t = t.replace(/\|\//g, " - ");
    t = t.replace(/\s*-\s*-\s*-\s*/g, " ");
    t = t.replace(/[-]{2,}/g, "-");
    t = t.replace(/[=]{2,}/g, "");
    t = t.replace(/^\s*>\s*/gm, "");
    t = t.replace(/[¥°`]+/g, "");
    t = t.replace(/\n\s*\n\s*\n/g, "\n\n");
    t = t.replace(/\s{3,}/g, " ");
    t = t.replace(/\*\//g, "");
    t = t.replace(/\|/g, " ");
    t = t.replace(/\*\*/g, "");
    t = t.replace(/\*/g, "");
    return t.trim();
  };

  useEffect(() => {
    const h = JSON.parse(localStorage.getItem("lardi_si_history") || "[]");
    const m = JSON.parse(localStorage.getItem("lardi_si_knowledge") || "[]");
    const g = localStorage.getItem("lardi_si_goal") || "";
    setChats(h); setMemories(m); setGoal(g);
    setTimeout(()=>{ const el=document.getElementById("splash"); if(el) el.style.display="none"; },800);
    
    const updateTime = () => {
      const now = new Date();
      setLiveDate(now.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric',timeZone:'Africa/Accra'}));
      setLiveTime(now.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true,timeZone:'Africa/Accra'}));
    };
    updateTime();
    setInterval(updateTime,1000);
  }, []);

  useEffect(()=>{ chatEndRef.current?.scrollIntoView({behavior:"smooth"}); }, [chats]);

  const save = (newChats:any[], newMems:any[]) => {
    localStorage.setItem("lardi_si_history", JSON.stringify(newChats.slice(-80)));
    localStorage.setItem("lardi_si_knowledge", JSON.stringify(newMems.slice(-80)));
  };

  const speakText = (text: string) => {
    try{
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text.replace(/<[^>]*>/g,"").substring(0,400));
      u.rate = 0.92; u.pitch = 1.1;
      speechSynthesis.speak(u);
    }catch(e){}
  };

  const callGroq = async (prompt:string, memText:string) => {
    if(!groqKey) throw new Error("No Groq");
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions",{
      method:"POST",
      headers:{"Content-Type":"application/json","Authorization":"Bearer "+groqKey},
      body:JSON.stringify({model:"openai/gpt-oss-20b",messages:[{role:"system",content:"You are LARDI SI. Goal: "+goal+" Memories: "+memText+" Answer clean, no symbols."},{role:"user",content:prompt}],max_tokens:400})
    });
    const data = await res.json();
    if(data.error) throw new Error(data.error.message);
    return cleanAIAnswer(data.choices[0].message.content);
  };

  const callGemini = async (prompt:string, memText:string) => {
    if(!geminiKey) throw new Error("No Gemini");
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
    const res = await fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:"You are LARDI SI. Goal: "+goal+" Memories: "+memText+" User: "+prompt+" Answer clean, no symbols"}]}]})});
    const data = await res.json();
    if(data.error) throw new Error(data.error.message);
    return cleanAIAnswer(data.candidates[0].content.parts[0].text);
  };

  const askSI = async () => {
    if(!q.trim()) return;
    const userQ = q; setQ("");
    const dateStr = new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',timeZone:'Africa/Accra'});
    const timeStr = new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true,timeZone:'Africa/Accra'});

    const userItem = { text: userQ, role: "user", time: timeStr, date: dateStr };
    const newChatsTemp = [...chats, userItem];
    setChats(newChatsTemp); save(newChatsTemp, memories);

    if(userQ.toLowerCase().includes("correct is")){
      const correct = cleanAIAnswer(userQ.split("correct is")[1]?.trim() || "");
      if(correct){
        const newMems = [...memories, { q: userQ.slice(0,80), a: correct, t: Date.now() }];
        setMemories(newMems); save(newChatsTemp, newMems);
        setTimeout(()=> setChats(prev=>[...prev, {text: "🧠 LEARNED FOREVER! "+correct, role:"ai", time: timeStr, date: dateStr}]), 400);
        return;
      }
    }
    if(userQ.toLowerCase().startsWith("my goal is")){
      const g = cleanAIAnswer(userQ.substring(10).trim()); setGoal(g);
      localStorage.setItem("lardi_si_goal", g);
      setTimeout(()=> setChats(prev=>[...prev, {text: "🎯 GOAL LOCKED! "+g, role:"ai", time: timeStr, date: dateStr}]), 400);
      return;
    }
    if(userQ.toLowerCase().includes("picture of")){
      const prompt = userQ.replace(/picture of/gi,"").trim();
      const seed = Math.floor(Math.random()*999999);
      const url = "https://image.pollinations.ai/prompt/"+encodeURIComponent(prompt)+"?width=768&height=1024&nologo=true&seed="+seed;
      setTimeout(()=> setChats(prev=>[...prev, {text: "✅ Generated: "+prompt+" <br><img src='"+url+"' style='width:300px;border-radius:12px;border:3px solid #ffcc00' />", role:"ai", time: timeStr, date: dateStr}]), 800);
      return;
    }

    const thinking = {text: "Mama Lardi is thinking... 💭🧠💙", role:"ai", time: timeStr, date: dateStr};
    setChats(prev=>[...prev, thinking]);

    try{
      const memText = memories.slice(-3).map(m=>m.q+":"+m.a).join(" | ");
      let results:any[] = [];
      try{ const g = await callGroq(userQ, memText); results.push({brain:"Groq ⚡",text:g}); }catch(e){}
      try{ const gm = await callGemini(userQ, memText); results.push({brain:"Gemini 🧠",text:gm}); }catch(e){}

      let finalAns = "";
      if(results.length===0) finalAns = "Akwaaba Boss! Set Vercel Env NEXT_PUBLIC_GROQ_KEY + NEXT_PUBLIC_GEMINI_KEY then Redeploy! Your cleaner is active! 💙";
      else if(results.length===1) finalAns = results[0].text+"<br><br><small>🧠 "+results[0].brain+" • "+dateStr+" • "+timeStr+"</small>";
      else finalAns = results[0].text+"<br><br><small>👥 Swarm: "+results.map(r=>r.brain).join(" + ")+" • "+dateStr+" • "+timeStr+"</small>";

      setChats(prev=>{ 
        const filtered = prev.filter(c=>!c.text.includes("Mama Lardi is thinking")); 
        const newC = [...filtered, {text: finalAns, role:"ai", time: timeStr, date: dateStr}]; 
        save(newC, memories); 
        return newC; 
      });
    }catch(e){
      setChats(prev=>{ 
        const filtered = prev.filter(c=>!c.text.includes("Mama Lardi is thinking")); 
        return [...filtered, {text: "Akwaaba! I am Mama Lardi SI 💙", role:"ai", time: timeStr, date: dateStr}]; 
      });
    }
  };

  return (
    <div style={{background:"#000",color:"#fff",height:"100dvh",display:"flex",flexDirection:"column",fontFamily:"Arial"}}>
      <div id="splash" style={{position:"fixed",inset:0,background:"#000",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:9999}}>
        <img src="https://i.ibb.co/ycmRvwnK/IMG-20260822-WA6915.jpg" style={{width:140,height:140,borderRadius:"50%",border:"4px solid #ffcc00"}} alt="mama" />
        <div style={{color:"#ffcc00",fontSize:28,fontWeight:"bold",marginTop:20}}>🧠 LARDI SI</div>
        <div style={{color:"#000",fontSize:10,marginTop:6,background:"#ffcc00",padding:"4px 12px",borderRadius:20,fontWeight:"bold"}}>YOUR CLEANER ACTIVE ✅</div>
      </div>

      <div style={{display:"flex",justifyContent:"space-between",padding:"8px 10px",background:"#0a0a0a",borderBottom:"1px solid #222"}}>
        <div style={{display:"flex",gap:8,alignItems:"center"}}><button onClick={()=>setShowSet(true)} style={{background:"#222",color:"#ffcc00",border:"none",width:38,height:38,borderRadius:"50%"}}>☰</button><span style={{background:"#ffcc00",color:"#000",padding:"3px 10px",borderRadius:12,fontSize:10,fontWeight:"bold"}}>{groqKey?"⚡":""} {groqKey && geminiKey ? "+" : ""} {geminiKey?"🧠":""} MAMA LARDI 💙</span></div>
        <button onClick={()=>{if(confirm("Exit?")) location.reload()}} style={{background:"#ff2222",color:"#fff",border:"none",padding:"6px 12px",borderRadius:15,fontSize:11,fontWeight:"bold"}}>EXIT ✕</button>
      </div>

      <div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:"#0a0a0a",borderBottom:"1px solid #222"}}>
        <img src="https://i.ibb.co/ycmRvwnK/IMG-20260822-WA6915.jpg" style={{width:34,height:34,borderRadius:"50%",border:"2px solid #ffcc00"}} alt="mama"/>
        <div><div style={{fontSize:13,fontWeight:"bold",color:"#ffcc00"}}>Mama Lardi SI 💙</div><div style={{fontSize:10,color:"#00ff88"}}>online • {groqKey?"Groq ⚡":"No Env"} • {geminiKey?"Gemini 🧠":"No Env"}</div></div>
        <div style={{marginLeft:"auto",fontSize:11,color:"#ffcc00",fontWeight:"bold"}}>{liveTime}</div>
      </div>

      <div style={{background:"#0a0a0a",borderBottom:"1px solid #222",padding:"6px 10px",textAlign:"center",fontSize:11,color:"#ffcc00",fontWeight:"bold",display:"flex",justifyContent:"center",gap:10}}>
        <span>{liveDate}</span><span>{liveTime}</span><span>🇬🇭 Kumasi</span>
      </div>

      {showSet && (
        <div style={{position:"fixed",inset:0,background:"#000",zIndex:9998,padding:16}}>
          <button onClick={()=>setShowSet(false)} style={{background:"#222",color:"#ffcc00",border:"none",width:40,height:40,borderRadius:"50%",fontSize:20}}>←</button>
          <h2 style={{color:"#ffcc00",margin:"12px 0"}}>Settings - Your Cleaner 💙</h2>
          <div style={{background:"#1a1a00",border:"2px solid #ffcc00",borderRadius:16,padding:12,fontSize:12,lineHeight:2,whiteSpace:"pre-wrap"}}>
            ⚡ Groq Env: {groqKey ? "✅ Connected" : "❌ Not set in Vercel"}<br/>
            🧠 Gemini Env: {geminiKey ? "✅ Connected" : "❌ Not set in Vercel"}<br/>
            🧠 Memories: {memories.length}<br/>
            🎯 Goal: {goal || "Not set"}<br/>
            📅 {liveDate} • {liveTime}<br/>
            🧹 Your cleaner from screenshot:<br/>
            - |? -|: removed ✅<br/>
            - ** *** __ ``` removed ✅<br/>
            - ## ::: > removed ✅<br/>
            - | --- = -- removed ✅<br/>
            - ¥ ° ` removed ✅
          </div>
          <button onClick={()=>setShowSet(false)} style={{width:"100%",marginTop:16,padding:12,borderRadius:25,background:"#222",color:"#fff",border:"none"}}>Close ✕</button>
        </div>
      )}

      <div style={{flex:1,overflowY:"auto",padding:10,background:"#000"}}>
        {chats.map((c,i)=>(
          <div key={i} style={{margin:"10px 0",padding:"12px 36px 24px 12px",borderRadius: c.role==="user"?"18px 18px 4px 18px":"4px 18px 18px 18px",maxWidth:"85%",background: c.role==="user"?"#2a2a2a":"#1a1a00",marginLeft: c.role==="user"?"auto":"0",borderLeft: c.role==="user"?"none":"3px solid #ffcc00",fontSize:14,lineHeight:1.6,position:"relative"}}>
            <button onClick={()=>speakText(c.text)} style={{position:"absolute",top:5,right:5,width:24,height:24,background: c.role==="user"?"#ffcc00":"#222",color: c.role==="user"?"#000":"#ffcc00",border: c.role==="user"?"none":"1px solid #ffcc00",borderRadius:"50%",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>{c.role==="user"?"🎙️":"🎤"}</button>
            <span dangerouslySetInnerHTML={{__html:c.text}} />
            <span style={{position:"absolute",bottom:4,right:10,fontSize:9,color:"#666"}}>{c.date || liveDate} • {c.time || liveTime} {c.role==="user" && "✓✓"}</span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div style={{background:"#111",borderTop:"1px solid #333",padding:8}}>
        <div style={{display:"flex",gap:6}}>
          <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>{if(e.key==="Enter") askSI()}} placeholder="Ask Mama Lardi 💬💙" style={{flex:1,padding:"14px 16px",borderRadius:25,border:"none",background:"#222",color:"#fff",fontSize:16,outline:"none"}} />
          <button onClick={askSI} style={{background:"#ffcc00",color:"#000",minWidth:50,width:50,height:50,borderRadius:"50%",fontWeight:"bold",fontSize:22}}>↑</button>
        </div>
      </div>
    </div>
  );
}