"use client";
import { useState, useRef, useEffect } from "react";

type Msg = { role: "user" | "ai"; content: string; time: string };

export default function LardiAI() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", content: "Hello Boss! 🇬🇭 I am Mama Lardi! Ask me anything - Natural Resources, pictures, anything!", time: "23:27" }
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const getTime = () => new Date().toLocaleTimeString("en-GH", { hour: "2-digit", minute: "2-digit", hour12: false });
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  // 🎙 MIC LIKE CHATGPT - When tap, ready to talk
  const startMic = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert("Use Chrome for mic!"); return; }
    const rec = new SR();
    rec.lang = "en-US";
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onresult = (e: any) => { setInput(e.results[0][0].transcript); setListening(false); };
    rec.start();
  };

  // 🧹 CLEANER ANSWER RENDERER - Fixes ** and | tables
  const renderClean = (text: string) => {
    // Remove ** and make bold
    let clean = text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
    
    // If it's a markdown table with |, convert to clean list
    if (clean.includes("|") && clean.includes("---")) {
      const rows = clean.split("\n").filter(r => r.includes("|") && !r.includes("---") && r.trim() !== "");
      let html = `<div style="display:flex; flex-direction:column; gap:8px; margin-top:8px">`;
      rows.forEach((row, idx) => {
        if (idx === 0) return; // skip header
        const cols = row.split("|").map(c => c.trim()).filter(Boolean);
        if (cols.length >= 2) {
          html += `<div style="background:#222; padding:8px 10px; border-radius:8px; border-left:3px solid #FFD700"><b>${cols[0].replace(/<[^>]*>/g, "")}</b><br/><small style="color:#aaa">${cols.slice(1).join(" • ")}</small></div>`;
        }
      });
      html += `</div>`;
      // Get title before table
      const title = clean.split("|")[0].replace(/<[^>]*>/g, "");
      return `<div>${title}</div>${html}`;
    }
    
    // Clean normal text - convert \n to <br>
    clean = clean.replace(/\n/g, "<br/>");
    return clean;
  };

  const send = async () => {
    if (!input.trim()) return;
    const userMsg: Msg = { role: "user", content: input, time: getTime() };
    setMessages(m => [...m, userMsg]);
    const txt = input;
    setInput("");
    try {
      const res = await fetch("/api/li", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: txt, mode: "clean", apiKey: "LI-sk-1wUOHWuJXCWKCDHNBMBtjXSjnirI" }),
      });
      const data = await res.json();
      const aiMsg: Msg = { role: "ai", content: data.answer || "Thinking...", time: getTime() };
      setMessages(m => [...m, aiMsg]);
    } catch (e) {
      setMessages(m => [...m, { role: "ai", content: "Error: " + String(e), time: getTime() }]);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", height: "100vh", display: "flex", flexDirection: "column", background: "#000", color: "#fff", fontFamily: "system-ui" }}>
      
      {/* TOP BAR - Like your screenshot */}
      <div style={{ padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#000" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button style={{ background: "#1a1a1a", border: "none", borderRadius: "50%", width: 44, height: 44, color: "#FFD700", fontSize: 20 }}>☰</button>
          <button onClick={startMic} style={{ background: listening ? "#ff0000" : "#FFD700", border: "none", borderRadius: "50%", width: 44, height: 44, fontSize: 18 }}>{listening ? "🔴" : "🎙️"}</button>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button style={{ background: "#00c950", border: "none", borderRadius: "50%", width: 44, height: 44, fontSize: 18 }}>📞</button>
          <button style={{ background: "#ff0000", border: "none", borderRadius: 20, padding: "8px 14px", color: "#fff", fontWeight: "bold", fontSize: 12 }}>EXIT X</button>
        </div>
      </div>

      {/* TITLE */}
      <div style={{ textAlign: "center", padding: "6px 0 10px 0" }}>
        <div style={{ fontSize: 22, fontWeight: "900", color: "#FFD700" }}>🇬🇭 LARDI AI</div>
        <div style={{ fontSize: 13, color: "#FFD700" }}>Mama Lardi 💙 |Built by Albert 🔥</div>
        <img src="https://i.imgur.com/8Km9tLL.png" alt="Mama Lardi" onError={(e:any)=>e.target.style.display='none'} style={{ width: 90, height: 90, borderRadius: "50%", border: "3px solid #FFD700", marginTop: 8, objectFit: "cover", background: "#222" }} />
        {/* If image fails, show emoji */}
      </div>

      {/* CHAT AREA - With time in bubble like your 23:27 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px", display: "flex", flexDirection: "column", gap: 12, background: "#000" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "92%", position: "relative" }}>
            {m.role === "user" ? (
              <div style={{ background: "#FFD700", color: "#000", padding: "10px 12px", borderRadius: 18, borderBottomRightRadius: 4, fontSize: 14 }}>{m.content}
                <div style={{ fontSize: 10, color: "#333", textAlign: "right", marginTop: 4 }}>🕒 {m.time} • You</div>
              </div>
            ) : (
              <div style={{ background: "#1a1a0a", borderLeft: "3px solid #FFD700", padding: "10px 12px", borderRadius: 12, fontSize: 13.5, lineHeight: "1.5" }}>
                <div dangerouslySetInnerHTML={{ __html: renderClean(m.content) }} />
                <div style={{ fontSize: 10, color: "#666", textAlign: "right", marginTop: 8, borderTop: "1px solid #222", paddingTop: 4 }}>🕒 {m.time} • LI • {new Date().toLocaleDateString("en-GH")}</div>
              </div>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* BOTTOM INPUT - Like your screenshot + 🎙 */}
      <div style={{ padding: "10px 10px 16px 10px", background: "#000", borderTop: "1px solid #111", display: "flex", gap: 8, alignItems: "center" }}>
        <button style={{ background: "#1a1a1a", border: "none", borderRadius: "50%", width: 44, height: 44, color: "#888", fontSize: 18 }}>📎</button>
        
        {/* 🎙 MIC BUTTON - ChatGPT style when tap ready */}
        <button onClick={startMic} style={{ background: listening ? "#ff0000" : "#1a1a1a", border: "none", borderRadius: "50%", width: 44, height: 44, fontSize: 16 }}>{listening ? "🔴" : "🎙"}</button>
        
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder={listening ? "🎙 Listening..." : "Ask or type: Picture of anythi"} style={{ flex: 1, padding: "12px 16px", borderRadius: 24, border: "1px solid #222", background: "#111", color: "#fff", outline: "none", fontSize: 14 }} />
        
        <button onClick={send} style={{ background: "#FFD700", border: "none", borderRadius: "50%", width: 46, height: 46, fontSize: 18, fontWeight: "bold", cursor: "pointer" }}>↑</button>
      </div>

      {listening && <div style={{ textAlign: "center", color: "#FFD700", fontSize: 12, paddingBottom: 10 }}>🎙 Ready like ChatGPT... Speak now Boss!</div>}
    </div>
  );
}