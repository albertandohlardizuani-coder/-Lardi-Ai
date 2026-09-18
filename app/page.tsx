"use client";
import { useState, useRef } from "react";

const COUNTRIES = [
  { id: "germany", name: "Germany 🇩🇪", prompt: "Berlin Brandenburg Gate street" },
  { id: "usa", name: "USA 🇺🇸", prompt: "New York Times Square street" },
  { id: "uk", name: "UK 🇬🇧", prompt: "London Big Ben street" },
  { id: "canada", name: "Canada 🇨🇦", prompt: "Toronto city street" },
  { id: "dubai", name: "Dubai 🇦🇪", prompt: "Dubai Burj Khalifa street" },
];

export default function Home(){
  const [person,setPerson]=useState<string|null>(null);
  const [country,setCountry]=useState(COUNTRIES[0]);
  const [result,setResult]=useState<string|null>(null);
  const [loading,setLoading]=useState(false);
  const canvasRef=useRef<HTMLCanvasElement>(null);

  const onFile=(e:any)=>{
    const f=e.target.files?.[0]; if(!f) return;
    setPerson(URL.createObjectURL(f));
    setResult(null);
  };

  const generate=async()=>{
    if(!person||!canvasRef.current) return;
    setLoading(true);
    const canvas=canvasRef.current;
    const ctx=canvas.getContext("2d")!;
    canvas.width=1024; canvas.height=1024;

    const bg=new Image(); bg.crossOrigin="anonymous";
    bg.src=`https://source.unsplash.com/1024x1024/?${country.prompt}`;
    const p=new Image(); p.src=person;

    await new Promise(r=>{
      let c=0; const done=()=>{c++; if(c>=2) r(true)};
      bg.onload=done; p.onload=done;
      setTimeout(done,3000);
    });

    ctx.clearRect(0,0,1024,1024);
    ctx.drawImage(bg,0,0,1024,1024);
    ctx.fillStyle="rgba(0,0,0,0.45)";
    ctx.beginPath(); ctx.ellipse(512,920,200,45,0,0,Math.PI*2); ctx.fill();
    ctx.shadowColor="rgba(0,0,0,0.6)"; ctx.shadowBlur=30;
    ctx.drawImage(p,262,100,500,800);
    ctx.shadowBlur=0;
    ctx.globalCompositeOperation="soft-light";
    ctx.fillStyle="rgba(255,230,200,0.2)"; ctx.fillRect(0,0,1024,1024);
    ctx.globalCompositeOperation="source-over";
    setResult(canvas.toDataURL("image/png"));
    setLoading(false);
  };

  return (
    <main style={{minHeight:"100vh",background:"#0a0a0a",color:"#fff",padding:20,fontFamily:"system-ui"}}>
      <h1 style={{textAlign:"center",fontSize:28,fontWeight:800}}>LARDI AI 🌍 TRUE BLEND</h1>
      <p style={{textAlign:"center",opacity:0.6,fontSize:13}}>By Albert - Mama Lardi AI - No Rectangle!</p>
      <div style={{maxWidth:480,margin:"20px auto",display:"flex",flexDirection:"column",gap:14}}>
        <input type="file" accept="image/*" onChange={onFile} style={{background:"#222",padding:12,borderRadius:10}}/>
        <select value={country.id} onChange={e=>setCountry(COUNTRIES.find(c=>c.id===e.target.value)!)} style={{padding:12,borderRadius:10,background:"#222",color:"#fff"}}>
          {COUNTRIES.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={generate} disabled={!person||loading} style={{padding:14,borderRadius:12,fontWeight:800,background:loading?"#555":"#fff",color:"#000"}}>
          {loading?"Blending... ✨":"Generate TRUE BLEND 🔥"}
        </button>
        {person&&<img src={person} style={{width:"100%",borderRadius:12,border:"1px solid #333"}}/>}
        {result&&<div><img src={result} style={{width:"100%",borderRadius:12}}/><a href={result} download={`lardi-${country.id}.png`} style={{display:"block",marginTop:10,padding:12,background:"#fff",color:"#000",textAlign:"center",borderRadius:10,fontWeight:700,textDecoration:"none"}}>Download ⬇️</a></div>}
      </div>
      <canvas ref={canvasRef} style={{display:"none"}}/>
    </main>
  );
}
