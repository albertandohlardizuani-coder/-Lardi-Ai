"use client";
import { useState } from "react";

function cleanText(text: string) {
  if (!text) return "";
  return text
    .replaceAll("**", "")
    .replaceAll("__", "")
    .replaceAll("##", "")
    .replaceAll(":::", "")
    .replaceAll('"""', "")
    .replaceAll("****", "")
    .replaceAll("___", "")
    .replaceAll("++++", "")
    .replaceAll("#@@", "")
    .replaceAll("🌸", "")
    .replaceAll(";;", "")
    .replaceAll("::", "")
    .trim();
}

export default function LardiAI() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello from Mama Lardi! Akwaaba Boss Albert! I be Ghana's Own AI, built by you in Kumasi. How for help you today? 💙🇬🇭" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [speakingId, setSpeakingId] = useState<number | null>(null);

  // TAP TO READ - PER CHAT - WITH STOP
  const toggleSpeak = (text: string, id: number) => {
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText(text));
    utterance.lang = "en-GH";
    utterance.rate = 0.95;
    utterance.pitch = 1.1;
    setSpeakingId(id);
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: cleanText(data.reply) }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: "Chale, network small. Try again Boss! 💙" }]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="p-4 text-center border-b border-yellow-500/20">
        <h1 className="text-2xl font-bold text-yellow-400">🇬🇭 LARDI AI</h1>
        <p className="text-yellow-300 text-sm">Mama Lardi 💙 | Built by Albert 🔥</p>
        <div className="w-20 h-20 mx-auto mt-3 rounded-full border-2 border-yellow-400 overflow-hidden bg-yellow-900">
          <img src="/mama.jpg" alt="Mama Lardi" className="w-full h-full object-cover" />
        </div>
        <p className="mt-2 text-xs text-gray-400">lardi-ai.vercel.app • Ghana&apos;s Own AI</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div className={`max-w-[85%] p-3 rounded-2xl ${m.role === "user" ? "bg-gray-800" : "bg-[#1a1a00] border border-yellow-500/20"}`}>
              <p className="text-[15px] whitespace-pre-wrap">{cleanText(m.content)}</p>
              {m.role === "assistant" && (
                <div className="flex gap-3 mt-3 text-xs">
                  <button onClick={() => navigator.clipboard.writeText(cleanText(m.content))} className="text-gray-400 hover:text-white">📋 Copy</button>
                  <button
                    onClick={() => toggleSpeak(m.content, i)}
                    className={`font-bold ${speakingId === i ? "text-yellow-400 animate-pulse" : "text-gray-400 hover:text-yellow-400"}`}
                  >
                    {speakingId === i ? "⏹️ Stop Reading" : "🔊 Tap to Read"}
                  </button>
                  <button className="text-gray-400">👍</button>
                  <button className="text-gray-400">👎</button>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && <p className="text-yellow-400 text-sm">Mama Lardi dey type... 💙</p>}
      </div>

      <div className="p-3 flex gap-2 border-t border-gray-800">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask Lardi AI anything..."
          className="flex-1 bg-gray-900 rounded-full px-4 py-3 text-sm outline-none"
        />
        <button onClick={sendMessage} className="bg-yellow-500 text-black w-12 h-12 rounded-full font-bold">↑</button>
      </div>
    </div>
  );
}