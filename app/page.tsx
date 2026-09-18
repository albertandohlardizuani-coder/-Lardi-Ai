'use client'
import { useRef, useState } from 'react';
export default function Home(){
  const [person,setPerson]=useState<any>(null);
  const [bg,setBg]=useState<any>(null);
  const [result,setResult]=useState<any>(null);
  const [loading,setLoading]=useState(false);
  const canvasRef=useRef<any>(null);
  const onFile=(e:any,s:any)=>{
    const f=e.target.files?.[0]; if(!f) return;
    const r=new FileReader(); r.onload=()=>s(r.result); r.readAsDataURL(f);
  }
  const generate=async()=>{
    if(!person||!bg) return alert("Upload BOTH photos!");
    setLoading(true);
    const canvas=canvasRef.current; const ctx=canvas.getContext('2d');
    const bgImg=new Image(); const fgImg=new Image();
    await new Promise<void>(res=>{
      let c=0; const ch=()=>{c++; if(c==2) res();};
      bgImg.onload=ch; fgImg.onload=ch; bgImg.src=bg; fgImg.src=person;
    });
    canvas.width=1024; canvas.height=1024;
    ctx.drawImage(bgImg,0,0,1024,1024);
    const pw=870; const ph=(fgImg.height/fgImg.width)*pw;
    const px=(1024-pw)/2; const py=1024-ph-20;
    ctx.save(); ctx.shadowColor="rgba(0,0,0,0.4)"; ctx.shadowBlur=30;
    ctx.filter="contrast(1.08) brightness(1.03)"; ctx.drawImage(fgImg,px,py,pw,ph); ctx.restore();
    ctx.fillStyle="rgba(0,0,0,0.28)"; ctx.beginPath();
    ctx.ellipse(512,py+ph-8,pw*0.32,16,0,0,Math.PI*2); ctx.fill();
    ctx.globalCompositeOperation="soft-light"; ctx.globalAlpha=0.2;
    ctx.drawImage(bgImg,px,py,pw,ph); ctx.globalAlpha=1; ctx.globalCompositeOperation="source-over";
    setResult(canvas.toDataURL("image/png")); setLoading(false);
  }
  return(
    <div style={{maxWidth:480,margin:"0 auto",padding:20,background:"#0a0a0a",color:"white",minHeight:"100vh"}}>
      <h1 style={{textAlign:"center",fontWeight:800}}>LARDI AI 🇬🇭 v2</h1>
      <p style={{textAlign:"center",opacity:0.6,fontSize:12}}>TRUE BLEND - No Rectangle! | lardi-ai.vercel.app</p>
      <div style={{background:"#1a1a1a",padding:14,borderRadius:14,marginTop:14}}>
        <b>1. Your Photo</b><input type="file" accept="image/*" onChange={e=>onFile(e,setPerson)} style={{width:"100%",marginTop:8}}/>
        {person&&<img src={person} style={{width:"100%",borderRadius:12,marginTop:8}}/>}
      </div>
      <div style={{background:"#1a1a1a",padding:14,borderRadius:14,marginTop:10}}>
        <b>2. Background</b><input type="file" accept="image/*" onChange={e=>onFile(e,setBg)} style={{width:"100%",marginTop:8}}/>
        {bg&&<img src={bg} style={{width:"100%",borderRadius:12,marginTop:8}}/>}
      </div>
      <button onClick={generate} style={{width:"100%",marginTop:14,padding:15,borderRadius:10,border:0,fontWeight:800,background:"white",color:"black"}}>{loading?"Blending...":"✨ Generate TRUE Blend"}</button>
      <canvas ref={canvasRef} style={{display:"none"}}/>
      {result&&<div style={{marginTop:16}}><img src={result} style={{width:"100%",borderRadius:12}}/><a href={result} download="lardi.png" style={{display:"block",background:"white",color:"black",textAlign:"center",padding:12,borderRadius:10,marginTop:10,textDecoration:"none",fontWeight:700}}>Download HD</a></div>}
    </div>
  )
}
