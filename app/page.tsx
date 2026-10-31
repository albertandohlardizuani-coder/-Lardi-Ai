"use client";
export default function Page() {
const htmlCode = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>LARDI SI v1 - SUPER INTELLIGENT</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}html,body{height:100%;width:100%;overflow:hidden}
body{background:#000;color:#fff;font-family:Arial;display:flex;flex-direction:column;height:100vh;height:100dvh;width:100vw;overflow:hidden}
#splash{position:fixed;inset:0;width:100vw;height:100vh;height:100dvh;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999999;transition:opacity.5s}
#splash.hide{opacity:0;pointer-events:none}
.splash-glow{position:relative;width:180px;height:180px;display:flex;align-items:center;justify-content:center}
.splash-glow::before{content:'';position:absolute;width:200px;height:200px;background:radial-gradient(circle,rgba(255,204,0,1) 0%,rgba(255,204,0,.5) 30%,transparent 70%);border-radius:50%;filter:blur(12px);animation:growGlow 2s ease-in-out infinite}
.splash-img{width:150px;height:150px;border-radius:50%;border:4px solid #ffcc00;object-fit:cover;z-index:2;box-shadow:0 0 40px rgba(255,204,0,.8)}
@keyframes growGlow{0%,100%{transform:scale(.9);opacity:.7}50%{transform:scale(1.3);opacity:1}}
@keyframes spinWell{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
.loader{width:48px;height:48px;border:4px solid rgba(255,204,0,0.15);border-top:4px solid #ffcc00;border-right:4px solid #ffcc00;border-radius:50%;animation:spinWell 0.7s linear infinite;margin-top:28px}
.topbar{display:flex;justify-content:space-between;padding:8px 10px;background:#0a0a0a;border-bottom:1px solid #222;flex-shrink:0}
#chat{flex:1;overflow-y:auto;padding:10px;background:#000}
.msg{margin:10px 0;padding:12px 36px 24px 12px;border-radius:18px;max-width:85%;font-size:14.5px;position:relative;line-height:1.6;word-wrap:break-word;white-space:pre-wrap}
.user{background:#2a2a2a;margin-left:auto;border-radius:18px 18px 4px 18px}.ai{background:#1a1a00;border-left:3px solid #ffcc00;border-radius:4px 18px 18px 18px}
.msg img{max-width:100%;border-radius:12px;margin-top:8px;display:block;border:2px solid #ffcc00}
.time{position:absolute;bottom:4px;right:10px;font-size:9px;color:#666;display:flex;gap:4px}
.input-area{flex-shrink:0;background:#111;border-top:1px solid #333;padding:8px 6px 10px 6px;width:100%}
.row{display:flex;gap:6px;align-items:center;width:100%}
#q{flex:1;min-width:0;padding:14px 16px;border-radius:25px;border:none;background:#222;color:#fff;font-size:16px;outline:none}
button.send{background:#ffcc00;color:#000;border:3px solid #ffaa00;min-width:50px;width:50px;height:50px;border-radius:50%;font-weight:bold;font-size:22px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}
button.icon-btn{background:#222;color:#ffcc00;border:none;min-width:42px;width:42px;height:42px;border-radius:50%;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.si-badge{background:linear-gradient(90deg,#ffcc00,#ff8800);color:#000;padding:3px 10px;border-radius:12px;font-size:10px;font-weight:bold;animation:growGlow 1.5s infinite}
@keyframes pulseSI{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
#dateTimeBar{background:#0a0a0a;border-bottom:1px solid #222;padding:6px 10px;text-align:center;font-size:11px;color:#ffcc00;font-weight:bold;display:flex;justify-content:center;gap:10px;flex-shrink:0}
.date-sep{display:block;margin:14px auto;padding:5px 14px;background:#1e1e1e;border:1px solid #ffcc00;color:#ffcc00;border-radius:20px;font-size:11px;font-weight:bold;text-align:center;width:fit-content}
.speak-btn{position:absolute;top:5px;right:5px;width:24px;height:24px;background:#ffcc00;color:#000;border:none;border-radius:50%;font-size:11px;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:5}
.speak-btn.ai-mic{background:#222;color:#ffcc00;border:1px solid #ffcc00}
.wa-top{display:flex;align-items:center;gap:8px;padding:6px 10px;background:#0a0a0a;border-bottom:1px solid #222;flex-shrink:0}
.wa-top img{width:34px;height:34px;border-radius:50%;border:2px solid #ffcc00}
#settingsModal{position:fixed;inset:0;width:100vw;height:100vh;height:100dvh;background:#000;z-index:99998;display:none;flex-direction:column}
#settingsModal.show{display:flex!important}
.set-top{display:flex;align-items:center;gap:12px;padding:14px 16px;background:#0a0a0a;border-bottom:1px solid #222}
.back-btn{background:#222;color:#ffcc00;border:none;width:40px;height:40px;border-radius:50%;font-size:22px;cursor:pointer;display:flex;align-items:center;justify-content:center}
</style></head><body>
<div id="splash" onclick="closeSplashNow()">
<div class="splash-glow"><img src="https://i.ibb.co/ycmRvwnK/IMG-20260822-WA6915.jpg" class="splash-img"></div>
<div style="color:#ffcc00;font-size:32px;font-weight:bold;margin-top:32px">🧠 LARDI SI v1</div>
<div style="color:#fff;font-size:14px;margin-top:8px;background:linear-gradient(90deg,#ffcc00,#ff8800);color:#000;padding:4px 14px;border-radius:20px;font-weight:bold">SUPER INTELLIGENT PROTOTYPE 🚀</div>
<div style="color:#ffcc00;font-size:13px;margin-top:10px">Built by Albert 🔥 15yo Kumasi</div>
<div id="splashTime" style="color:#ffcc00;margin-top:8px;font-size:11px;background:#1a1a00;padding:5px 10px;border-radius:12px;border:1px solid #ffcc00">Loading SI Brain...</div>
<div class="loader"></div>
<div style="color:#333;font-size:11px;margin-top:20px">Tap to skip 👆</div>
</div>

<div id="settingsModal">
<div class="set-top"><button class="back-btn" onclick="closeSettings()">←</button><h2 style="color:#ffcc00;margin:0;font-size:16px">🧠 LARDI SI Settings</h2></div>
<div style="flex:1;overflow-y:auto;padding:16px">
<div style="background:#1a1a00;border:2px solid #ffcc00;border-radius:16px;padding:14px;margin-bottom:12px">
<div style="color:#ffcc00;font-weight:bold;font-size:14px">🧠 SI Brain Status</div>
<div id="siStats" style="color:#fff;font-size:12px;margin-top:8px;line-height:1.6"></div>
</div>
<div style="background:#111;border:1px solid #333;border-radius:16px;padding:14px;margin-bottom:12px">
<div style="color:#ffcc00;font-weight:bold">🎯 My Goal (SI remembers)</div>
<input id="userGoal" placeholder="e.g. Pass WASSCE, Build app" style="width:100%;padding:12px;margin-top:8px;border-radius:10px;border:1px solid #333;background:#222;color:#fff">
<button onclick="saveGoal()" style="width:100%;margin-top:8px;padding:12px;border-radius:20px;background:#ffcc00;color:#000;font-weight:bold;border:none">Save Goal 🎯</button>
</div>
<div style="background:#111;border:1px solid #333;border-radius:16px;padding:14px">
<div style="color:#ffcc00;font-weight:bold">📚 Things You Taught Me</div>
<div id="knowledgeList" style="color:#ccc;font-size:11px;margin-top:8px;max-height:200px;overflow-y:auto"></div>
<button onclick="clearKnowledge()" style="margin-top:10px;padding:8px 16px;border-radius:15px;background:#ff2222;color:#fff;border:none;font-size:11px">Clear Brain 🗑️</button>
</div>
<button onclick="closeSettings()" style="width:100%;margin-top:16px;padding:12px;border-radius:25px;background:#222;color:#fff;border:none">Close ✕</button>
</div>
</div>

<div class="topbar">
<div style="display:flex;align-items:center;gap:8px">
<button class="icon-btn" onclick="openSettings()" type="button">☰</button>
<div class="si-badge">SI v1 🧠</div>
</div>
<div style="display:flex;gap:6px;align-items:center">
<button class="icon-btn" style="background:#ffcc00;color:#000;font-size:12px;font-weight:bold" onclick="showSwarmInfo()" type="button">👥</button>
<button onclick="exitApp()" type="button" style="background:#ff2222;color:#fff;border:none;padding:8px 14px;border-radius:15px;font-size:11px;font-weight:bold">EXIT</button>
</div>
</div>
<div class="wa-top">
<img src="https://i.ibb.co/ycmRvwnK/IMG-20260822-WA6915.jpg">
<div><div style="font-size:13px;font-weight:bold;color:#ffcc00">Mama Lardi SI 💙 Super Brain</div><div style="font-size:10px;color:#00ff88" id="waStatus">Super Intelligent • Learning...</div></div>
<div style="margin-left:auto"><span id="waTime" style="font-size:11px;color:#ffcc00"></span></div>
</div>
<div id="dateTimeBar"><span id="liveDate">Oct 31, 2026</span><span id="liveClock">05:16 AM</span><span>🧠 SI Learning</span></div>
<h1 style="color:#ffcc00;text-align:center;margin:6px 0 2px 0;font-size:20px">🇬🇭 LARDI SI v1</h1>
<p style="color:#ffcc00;text-align:center;font-size:11px;font-weight:bold;margin:0 0 6px 0">Self-Learning + Swarm Debate 🔥 Built by Albert</p>
<div id="chat"></div>
<div class="input-area">
<div id="quickBar" style="display:flex;gap:6px;margin-bottom:8px;overflow-x:auto">
<button onclick="teachMode()" style="background:#1a1a00;color:#ffcc00;border:1px solid #ffcc00;padding:6px 12px;border-radius:20px;font-size:11px;white-space:nowrap">🧠 Teach SI</button>
<button onclick="quickAsk('My goal is ')" style="background:#222;color:#fff;border:1px solid #333;padding:6px 12px;border-radius:20px;font-size:11px;white-space:nowrap">🎯 Set Goal</button>
<button onclick="quickAsk('What do you remember about me?')" style="background:#222;color:#fff;border:1px solid #333;padding:6px 12px;border-radius:20px;font-size:11px;white-space:nowrap">🧠 Memory</button>
<button onclick="quickAsk('Picture of anything amazing')" style="background:#222;color:#fff;border:1px solid #333;padding:6px 12px;border-radius:20px;font-size:11px;white-space:nowrap">🎨 Picture</button>
</div>
<div class="row">
<input id="q" placeholder="Ask SI anything or Teach it: 'Wrong, correct is...' 💬🧠" autocomplete="off">
<button class="send" onclick="ask()" id="sendBtn" type="button">↑</button>
</div>
</div>
<script>
const MAMA_PIC="https://i.ibb.co/ycmRvwnK/IMG-20260822-WA6915.jpg";
let GROQ_KEY="YOUR_GROQ_KEY_HERE"; let GEMINI_KEY="YOUR_GEMINI_KEY_HERE";
let currentUser=localStorage.getItem("lardi_user")||"Boss"; let chatHistory=JSON.parse(localStorage.getItem("lardi_si_history")||"[]");
let knowledgeBase=JSON.parse(localStorage.getItem("lardi_si_knowledge")||"[]"); 
let userGoal=localStorage.getItem("lardi_si_goal")||"";
let splashClosed=false; let voices=[]; 
function cleanAIAnswer(t){ if(!t) return ""; t=t.replace(/\\*\\*(.*?)\\*\\*/g,"$1").replace(/\\*\\*/g,"").replace(/\\|/g," - ").replace(/^#{1,6}\\s*/gm,""); return t.trim(); }
function loadVoices(){try{voices=speechSynthesis.getVoices();}catch(e){}}
if('speechSynthesis' in window){speechSynthesis.onvoiceschanged=loadVoices;loadVoices();}
function closeSplashNow(){if(splashClosed) return;splashClosed=true;let el=document.getElementById("splash");if(el){el.classList.add("hide");setTimeout(()=>{el.style.display="none";},400);}}
setTimeout(()=>closeSplashNow(),1000);
window.addEventListener("load",()=>{checkLogin();updateDateTime();});
function exitApp(){ if(confirm("Exit LARDI SI?")){ document.body.innerHTML="<div style='background:#000;color:#ffcc00;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center'><h2>Medaase SI Boss! Bye! 🧠</h2><button onclick='location.reload()' style='margin-top:20px;padding:14px 28px;background:#ffcc00;border:none;border-radius:25px;color:#000;font-weight:bold'>🔄 Re-Open SI</button></div>"; } }
function getTimeSec(){return new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true,timeZone:'Africa/Accra'});}
function getShortDate(){return new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',timeZone:'Africa/Accra'});}
function saveMemory(){try{localStorage.setItem("lardi_si_history",JSON.stringify(chatHistory.slice(-100))); localStorage.setItem("lardi_si_knowledge",JSON.stringify(knowledgeBase.slice(-200)));}catch(e){}}
function updateDateTime(){let now=new Date(); let d=now.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric',timeZone:'Africa/Accra'}); let t=now.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true,timeZone:'Africa/Accra'}); let a=document.getElementById("liveDate"); if(a) a.textContent=d; let b=document.getElementById("liveClock"); if(b) b.textContent=t; let c=document.getElementById("waTime"); if(c) c.textContent=t; let e=document.getElementById("splashTime"); if(e) e.textContent=d+" • "+t+" • "+knowledgeBase.length+" memories 🧠"; }
setInterval(updateDateTime,1000);
function addDateSeparator(txt){let ch=document.getElementById("chat"); let d=document.createElement("div"); d.className="date-sep"; d.textContent=txt; ch.appendChild(d); ch.scrollTop=ch.scrollHeight;}
function speakThis(btn){let bubble=btn.parentElement; let txt=bubble.innerText.replace(/🎤|🎙️|✓✓|🔊/g,"").trim(); try{speechSynthesis.cancel();}catch(e){} let u=new SpeechSynthesisUtterance(txt.substring(0,500)); u.rate=0.92; u.pitch=1.1; u.lang="en-US"; if(voices.length>0){let f=voices.find(v=>v.name.toLowerCase().includes("female")); u.voice=f||voices[0];} let orig=btn.innerHTML; btn.innerHTML="🔊"; u.onend=()=>{btn.innerHTML=orig;}; speechSynthesis.speak(u);}
function checkLogin(){let ch=document.getElementById("chat"); if(chatHistory.length>0){ ch.innerHTML=""; addDateSeparator("TODAY • SI Brain Active 🧠"); chatHistory.forEach(m=>{let d=document.createElement("div");d.className="msg "+(m.role==="user"?"user":"ai");d.innerHTML=m.text;ch.appendChild(d);}); ch.scrollTop=ch.scrollHeight; } else { ch.innerHTML=""; addDateSeparator("TODAY • LARDI SI v1 🧠"); ch.innerHTML+=\`<div class="msg ai"><button class="speak-btn ai-mic" onclick="speakThis(this)">🎤</button>Akwaaba \${currentUser}! I am LARDI SI v1 🧠💛<br><br>🚀 <b>SUPER INTELLIGENT FEATURES:</b><br>🧠 <b>Self-Learning:</b> If I am wrong, say "Wrong, correct is..." and I will learn FOREVER!<br>👥 <b>Swarm:</b> 3 brains (Groq + Gemini + Me) debate to give you best answer!<br>🎯 <b>Goal:</b> Tell me your goal and I will remember!<br>📚 I already have \${knowledgeBase.length} memories!<br><br>Try: "Teach me photosynthesis" or "My goal is pass WASSCE"<br><span class="time">\${getShortDate()} • \${getTimeSec()}</span></div>\`; } updateStats(); }
function updateStats(){ let s=document.getElementById("siStats"); if(!s) return; s.innerHTML=\`👤 User: \${currentUser}<br>🧠 Memories: \${knowledgeBase.length}<br>💬 Chats: \${chatHistory.length}<br>🎯 Goal: \${userGoal||"Not set"}<br>👥 Swarm: Groq + Gemini + LARDI Brain<br>⚡ Status: Learning Always!\`; let k=document.getElementById("knowledgeList"); if(k){ if(knowledgeBase.length==0) k.innerHTML="No teachings yet. Say 'Wrong, correct is...' to teach me!"; else k.innerHTML=knowledgeBase.slice(-10).reverse().map(x=>\`• \${x.q.substring(0,60)} → \${x.a.substring(0,60)}\`).join("<br>"); } }
function openSettings(){updateStats();document.getElementById("settingsModal").classList.add("show");}
function closeSettings(){document.getElementById("settingsModal").classList.remove("show");}
function saveGoal(){let g=document.getElementById("userGoal").value.trim(); if(!g){alert("Enter goal");return;} userGoal=g; localStorage.setItem("lardi_si_goal",g); closeSettings(); add("🎯 SI Goal Saved! I will remember: "+g+" 💛 I will help you achieve it every day!","ai",true);}
function clearKnowledge(){ if(confirm("Clear all "+knowledgeBase.length+" memories?")){ knowledgeBase=[]; saveMemory(); updateStats(); alert("Brain cleared!"); } }
function showSwarmInfo(){add("👥 SWARM DEBATE: How I work 🧠<br><br>When you ask, I do:<br>1️⃣ Groq Brain thinks (fast)<br>2️⃣ Gemini Brain thinks (smart)<br>3️⃣ LARDI Brain checks your memories + goal<br>4️⃣ Judge picks BEST answer!<br><br>This = 3x smarter than normal AI! 🚀","ai",true);}
function quickAsk(t){document.getElementById("q").value=t; document.getElementById("q").focus();}
function teachMode(){let t=prompt("What do you want to teach LARDI SI? Format: Question | Correct Answer\\nExample: What is capital of Ghana? | Accra"); if(!t) return; let parts=t.split("|"); if(parts.length<2){alert("Use format: Question | Answer");return;} let q=parts[0].trim(), a=parts[1].trim(); knowledgeBase.push({q:q,a:a,time:new Date().toISOString()}); saveMemory(); updateStats(); add("🧠 LEARNED! ✅<br>Q: "+q+"<br>A: "+a+"<br>I will never forget! 💛","ai",true);}
function getRelevantKnowledge(q){ if(knowledgeBase.length==0) return ""; let low=q.toLowerCase(); let matches=knowledgeBase.filter(k=> low.includes(k.q.toLowerCase().substring(0,15)) || k.q.toLowerCase().includes(low.substring(0,15)) ); if(matches.length==0) return ""; return matches.slice(-3).map(m=>"Memory: Q: "+m.q+" A: "+m.a).join("\\n"); }
function detectTeaching(q){ let low=q.toLowerCase(); if(low.includes("wrong")||low.includes("correct is")||low.includes("no, it is")||low.includes("actually")){ let correct=""; if(q.includes("correct is")) correct=q.split("correct is")[1].trim(); else if(q.includes("is")) correct=q.split("is").slice(-1)[0].trim(); if(correct.length>2){ knowledgeBase.push({q:"Correction: "+q.substring(0,80),a:correct,time:new Date().toISOString()}); saveMemory(); return correct; } } return null; }
function add(t,c,save=true){let ch=document.getElementById("chat");let d=document.createElement("div");d.className="msg "+c;let dateStr=getShortDate(); let timeStr=getTimeSec(); if(c==="user"){ d.innerHTML=\`<button class="speak-btn" onclick="speakThis(this)">🎙️</button>\${t}<span class="time">\${dateStr} • \${timeStr} ✓✓</span>\`; }else{ d.innerHTML=\`<button class="speak-btn ai-mic" onclick="speakThis(this)">🎤</button>\${t}<span class="time">\${dateStr} • \${timeStr} • SI 🧠</span>\`; } ch.appendChild(d);ch.scrollTop=ch.scrollHeight;if(save){chatHistory.push({role:c,text:d.innerHTML});saveMemory();}}
async function callGroq(q, context){ if(!GROQ_KEY||GROQ_KEY.includes("YOUR_")) throw new Error("no groq"); let res=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+GROQ_KEY},body:JSON.stringify({model:"openai/gpt-oss-20b",messages:[{role:"system",content:"You are LARDI SI Brain 1 - fast and smart. Goal: "+userGoal+" Context memories: "+context},{role:"user",content:q}],max_tokens:500})}); let data=await res.json(); if(data.error) throw new Error(data.error.message); return cleanAIAnswer(data.choices[0].message.content); }
async function callGemini(q, context){ if(!GEMINI_KEY||GEMINI_KEY.includes("YOUR_")) throw new Error("no gemini"); let url=\`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=\${GEMINI_KEY}\`; let res=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:"You are LARDI SI Brain 2 - super smart and careful. Goal: "+userGoal+" Memories: "+context+"\\nUser: "+q}]}]})}); let data=await res.json(); if(data.error) throw new Error(data.error.message); return cleanAIAnswer(data.candidates[0].content.parts[0].text); }
async function swarmReply(q){
 let context=getRelevantKnowledge(q); if(userGoal) context+=" Goal: "+userGoal;
 let results=[]; try{ let g=await callGroq(q,context); results.push({brain:"Groq ⚡",text:g}); }catch(e){}
 try{ let gm=await callGemini(q,context); results.push({brain:"Gemini 🧠",text:gm}); }catch(e){}
 if(results.length==0){ return "Akwaaba Boss! I am LARDI SI! Goal: "+(userGoal||"none yet")+" Memories: "+knowledgeBase.length+". "+q+"? I hear you! 💛"; }
 if(results.length==1) return results[0].text+"<br><br><small>🧠 Brain used: "+results[0].brain+" | Memories: "+knowledgeBase.length+"</small>";
 let combined=results.map(r=>r.brain+": "+r.text).join("\\n\\n");
 try{
   let judge=await callGroq("Pick best answer from these and combine into one perfect answer, no markdown, plain text: "+combined+"\\nOriginal Q: "+q, context);
   return judge+"<br><br><small>👥 Swarm: "+results.map(r=>r.brain).join(" + ")+" debated • Picked best! 🧠 Memories: "+knowledgeBase.length+"</small>";
 }catch(e){ return results[0].text+"<br><br><small>👥 Swarm: "+results[0].brain+"</small>"; }
}
async function ask(){
 let qInput=document.getElementById("q"); let q=qInput.value.trim(); if(!q) return;
 if(q.toLowerCase().startsWith("my goal is")){ let g=q.substring(10).trim(); userGoal=g; localStorage.setItem("lardi_si_goal",g); add(q,"user",true); qInput.value=""; add("🎯 GOAL LOCKED! 🧠 I will remember forever: "+g+"<br>I will now tailor all answers to help you achieve this! 💛🚀","ai",true); updateStats(); return; }
 let taught=detectTeaching(q); if(taught){ add(q+"<br><small>🧠 Teaching detected</small>","user",true); qInput.value=""; add("🧠 THANK YOU BOSS! Learned! ✅<br>I now know: <b>"+taught+"</b><br>I will use this forever! Memories: "+knowledgeBase.length+" 💛","ai",true); updateStats(); return; }
 if(q.toLowerCase().includes("picture of") || q.toLowerCase().includes("generate image") || q.toLowerCase().includes("picture")){
   add(q,"user",true); qInput.value=""; add("🎨 SI Generating... Thinking of best prompt... ⏳🧠","ai",false);
   let prompt=q.replace(/picture of/gi,"").trim(); let seed=Math.floor(Math.random()*9999999);
   let url="https://image.pollinations.ai/prompt/"+encodeURIComponent(prompt+", photorealistic 8k, ultra detailed, SI enhanced")+"?width=768&height=1024&nologo=true&seed="+seed+"&model=turbo&enhance=true";
   setTimeout(()=>{let ch=document.getElementById("chat");let last=ch.lastChild;if(last&&last.innerHTML.includes("Generating")) last.remove(); add("✅ SI Generated: "+prompt+" 🎨✨<br><img src='"+url+"' style='width:320px;border:3px solid #ffcc00'><br><small>🧠 SI Swarm generated • Goal: "+(userGoal||"none")+"</small>","ai",true);},1000); return;
 }
 add(q,"user",true); qInput.value=""; add("🧠 SI Swarm Thinking... 👥 Groq + Gemini debating... ⏳<br><small>Checking "+knowledgeBase.length+" memories + Goal: "+(userGoal||"none")+"</small>","ai",false);
 let reply=await swarmReply(q);
 let ch=document.getElementById("chat"); let last=ch.lastChild; if(last&&last.innerHTML.includes("Thinking")) last.remove();
 add(reply+" 💛","ai",true);
}
document.addEventListener("DOMContentLoaded",()=>{let q=document.getElementById("q");if(q)q.addEventListener("keydown",(e)=>{if(e.key==="Enter"){e.preventDefault();ask();}});});
<\/script></body></html>
`;
  return (
    <iframe 
      srcDoc={htmlCode}
      style={{ width: '100vw', height: '100dvh', border: 'none', position: 'fixed', inset: 0 }}
      allow="microphone; camera; autoplay"
      title="LARDI SI v1"
    />
  );
}