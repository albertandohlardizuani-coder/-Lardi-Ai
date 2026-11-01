"use client";
import { useState, useRef, useEffect } from "react";

type Msg = { role: "user" | "ai"; content: string; time: string };
type Mode = "clean" | "spicy";

export default function LardiAI() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [mode, setMode] = useState<Mode>("clean");
  const [ageOk, setAgeOk] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const getTime = () => new Date().toLocaleString("en-GH", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short", hour12: true });
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  // 🎙 MIC LIKE CHATGPT
  const startMic = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert("Mic needs Chrome!"); return; }
    const rec = new SR();
    rec.lang = "en-US";
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onresult = (e: any) => { setInput(e.results[0][0].transcript); setListening(false); };
    rec.start();
  };

  // 🗣 VOICE REPLY LIKE CHATGPT
  const speak = (text: string) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = 1;
    speechSynthesis.speak(utter);
  };

  const send = async () => {
    if (!input.trim()) return;
    if (mode === "spicy" && !ageOk) {
      if (!confirm("🔞 18+ ONLY - Spicy is flirty romantic. Confirm 18+?")) return;
      setAgeOk(true);
    }
    const userMsg: Msg = { role: "user", content: input, time: getTime() };
    setMessages((m) => [...m, userMsg]);
    const textToSend = input;
    setInput("");

    try {
      const res = await fetch("/api/li", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend, mode, apiKey: "LI-sk-1wUOHWuJXCWKCDHNBMBtjXSjnirI" }),
      });
      const data = await res.json();
      const cleanAnswer = (data.answer || "Thinking...").trim().replace(/\n{3,}/g, "\n\n");
      const aiMsg: Msg = { role: "ai", content: cleanAnswer, time: getTime() };
      setMessages((m) => [...m, aiMsg]);
      if (mode === "spicy") speak(cleanAnswer.slice(0, 150)); // Voice reply in spicy mode
    } catch (e) {
      setMessages((m) => [...m, { role: "ai", content: "Error: " + String(e), time: getTime() }]);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", height: "100vh", display: "flex", flexDirection: "column", background: "#000", color: "#fff", fontFamily: "system-ui" }}>
      {/* HEADER WITH MODE */}
      <div style={{ padding: 12, borderBottom: "1px solid #222", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><b>🧬 LARDI AI</b><div style={{ fontSize: 10, color: "#aaa" }}>{mode === "spicy" ? "🔥 SPICY • 18+" : "✨ CLEAN • lardi-ai.vercel.app"}</div></div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setMode("clean")} style={{ padding: "6px 12px", borderRadius: 20, border: "none", background: mode === "clean" ? "#FFD700" : "#222", color: mode === "clean" ? "#000" : "#fff", fontSize: 12, cursor: "pointer" }}>✨ Clean</button>
          <button onClick={() => setMode("spicy")} style={{ padding: "6px 12px", borderRadius: 20, border: "none", background: mode === "spicy" ? "#ff1a75" : "#222", color: "#fff", fontSize: 12, cursor: "pointer" }}>🔥 Spicy</button>
        </div>
      </div>

      {/* CHAT BUBBLES WITH TIME */}
      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
        {messages.length === 0 && <div style={{ textAlign: "center", color: "#555", marginTop: 60 }}>👋 Hello Boss!<br />Ask me anything<br /><small>{new Date().toLocaleDateString()}</small></div>}
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%", display: "flex", flexDirection: "column" }}>
            <div style={{ background: m.role === "user" ? (mode === "spicy" ? "#ff1a75" : "#FFD700") : "#161616", color: m.role === "user" ? "#fff" : "#fff", padding: "11px 14px", borderRadius: 18, whiteSpace: "pre-wrap", lineHeight: "1.5", fontSize: 14, border: m.role === "ai" ? "1px solid #222" : "none" }}>{m.content}</div>
            <div style={{ fontSize: 10, color: "#666", marginTop: 5, display: "flex", gap: 6, justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
              <span>🕒 {m.time}</span><span>•</span><span>{m.role === "ai" ? (mode === "spicy" ? "🔥 LI" : "LI") : "You"}</span>
              {m.role === "ai" && <button onClick={() => speak(m.content)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: 10 }}>🔊</button>}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* INPUT WITH 🎙 LIKE CHATGPT */}
      <div style={{ padding: 12, borderTop: "1px solid #222", display: "flex", gap: 8, alignItems: "center", background: "#000" }}>
        <button onClick={startMic} title="Tap to speak" style={{ background: listening ? "#ff0000" : "#222", border: "none", borderRadius: "50%", width: 46, height: 46, fontSize: 20, cursor: "pointer" }}>{listening ? "🔴" : "🎙"}</button>
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder={listening ? "🎙 Listening... speak!" : mode === "spicy" ? "Flirt with LI..." : "Ask LARDI..."} style={{ flex: 1, padding: "13px 16px", borderRadius: 24, border: "1px solid #333", background: "#111", color: "#fff", outline: "none" }} />
        <button onClick={send} style={{ background: mode === "spicy" ? "#ff1a75" : "#FFD700", border: "none", borderRadius: 24, padding: "13px 20px", fontWeight: "bold", cursor: "pointer", color: mode === "spicy" ? "#fff" : "#000" }}>➤</button>
      </div>
      {listening && <div style={{ textAlign: "center", color: "#ff1a75", fontSize: 12, paddingBottom: 8, animation: "pulse 1s infinite" }}>🎙 Listening... Tap 🔴 to stop</div>}
    </div>
  );
}