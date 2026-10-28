import { NextResponse } from "next/server";
const cleanAll=(t:string)=>t.replaceAll("**","").replaceAll("__","").replaceAll("##","").replaceAll("###","").replaceAll("|"," ").replaceAll("---","").replaceAll(":::","").trim();
export async function POST(req:Request){
 const {messages}=await req.json();
 const systemPrompt=`You are Mama Lardi, LARDI AI built by Albert in Kumasi Ghana. ABSOLUTE RULE NEVER USE ** or __ or ## or | or tables. Never create markdown table like | # | Technique |. Write plain simple English only. List with dash or numbers. You are Ghanaian mother, warm and simple.`;
 const r=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${process.env.OPENAI_API_KEY}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:systemPrompt},...messages]})});
 const data=await r.json(); let reply=data.choices?.[0]?.message?.content||"Network small Boss"; reply=cleanAll(reply); return NextResponse.json({reply});