"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { SunIcon } from "@/components/ui/SunIcon";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_TOPICS = [
  "Como dar feedback pra um liderado que entrega, mas reclama de tudo?",
  "Minha 1:1 tá virando uma sessão de desabafo. O que faço?",
  "Preciso cobrar um combinado que não foi cumprido.",
  "Como conversar com quem está com baixa performance?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSuggestedTopic(topic: string) {
    setInput(topic);
    inputRef.current?.focus();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (!res.ok) throw new Error("Erro na resposta");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      const assistantId = crypto.randomUUID();
      let assistantText = "";

      setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          assistantText += decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: assistantText } : m))
          );
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Tive um problema técnico aqui. Tenta de novo em instantes.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-creme">
      {/* Header */}
      <header className="shrink-0 bg-creme/90 backdrop-blur-sm border-b border-[var(--linha-soft)] px-4 md:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-serif italic text-base md:text-lg text-cafe leading-none">
          <SunIcon size={20} className="text-sol md:w-[22px] md:h-[22px]" />
          acordei, virei líder.
        </Link>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cafe-3">Mentor · Beta</span>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-5 md:py-6">
        <div className="max-w-2xl mx-auto space-y-5 md:space-y-6">

          {messages.length === 0 && (
            <div className="pt-6 pb-3 md:pt-8 md:pb-4">
              <div className="text-center mb-8 md:mb-10">
                <SunIcon size={40} className="text-sol mx-auto mb-3 md:w-12 md:h-12 md:mb-4" />
                <h1 className="font-serif italic text-[clamp(28px,6vw,56px)] leading-[1] text-cafe mb-2 md:mb-3">
                  Qual é o seu<br />problema agora?
                </h1>
                <p className="text-[14px] md:text-[16px] text-cafe-2 font-light max-w-sm mx-auto leading-relaxed">
                  Descreve a situação como você falaria pra um amigo. O mentor traz o roteiro.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                {SUGGESTED_TOPICS.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => handleSuggestedTopic(topic)}
                    className="text-left p-3.5 md:p-4 rounded-2xl border border-[var(--linha)] hover:border-sol/40 hover:bg-sol/5 active:bg-sol/10 transition-all text-[13px] md:text-[14px] text-cafe-2 leading-relaxed cursor-pointer min-h-[56px]"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 md:gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-sol flex items-center justify-center mt-0.5">
                  <SunIcon size={15} className="text-creme md:w-[18px] md:h-[18px]" />
                </div>
              )}

              <div
                className={`max-w-[90%] md:max-w-[85%] rounded-2xl px-4 py-3.5 md:px-5 md:py-4 ${
                  msg.role === "user"
                    ? "bg-cafe text-creme rounded-tr-sm"
                    : "bg-white border border-[var(--linha-soft)] text-cafe rounded-tl-sm"
                }`}
              >
                {msg.role === "assistant" ? (
                  <AssistantMessage content={msg.content} />
                ) : (
                  <p className="text-[14px] md:text-[15px] leading-relaxed">{msg.content}</p>
                )}
              </div>
            </div>
          ))}

          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex gap-2.5 md:gap-3 justify-start">
              <div className="shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-sol flex items-center justify-center">
                <SunIcon size={15} className="text-creme md:w-[18px] md:h-[18px]" />
              </div>
              <div className="bg-white border border-[var(--linha-soft)] rounded-2xl rounded-tl-sm px-4 py-3.5 md:px-5 md:py-4">
                <div className="flex gap-1.5 items-center h-5">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-cafe-3 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-cafe-3 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-cafe-3 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-[var(--linha-soft)] bg-creme px-4 md:px-8 pt-3 pb-[max(16px,env(safe-area-inset-bottom))]">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-2.5 md:gap-3 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Descreve a situação..."
              rows={1}
              className="flex-1 resize-none bg-white border border-[var(--linha)] rounded-2xl px-4 py-3 text-[14px] md:text-[15px] text-cafe placeholder:text-cafe-3 focus:outline-none focus:border-sol/50 transition-colors leading-relaxed min-h-[44px]"
              style={{ maxHeight: "120px", overflowY: "auto" }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="shrink-0 w-11 h-11 rounded-full bg-sol text-creme flex items-center justify-center hover:bg-sol-soft active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="md:w-[18px] md:h-[18px]">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>
          <p className="text-center font-mono text-[9px] md:text-[10px] uppercase tracking-[0.14em] text-cafe-3/60 mt-2 md:mt-3 hidden sm:block">
            Enter para enviar · Shift+Enter para nova linha
          </p>
        </div>
      </div>
    </div>
  );
}

function AssistantMessage({ content }: { content: string }) {
  if (!content) return <p className="text-[14px] leading-relaxed text-cafe-3 italic">Digitando...</p>;

  const lines = content.split("\n");

  return (
    <div className="space-y-2.5 md:space-y-3 text-[14px] md:text-[15px] leading-relaxed">
      {lines.map((line, i) => {
        if (line.startsWith("**") && line.endsWith("**")) {
          return (
            <p key={i} className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.16em] text-brasa pt-0.5">
              {line.slice(2, -2)}
            </p>
          );
        }
        if (line.startsWith("*") && line.endsWith("*") && line.length > 2) {
          return (
            <p key={i} className="font-serif italic text-[15px] md:text-[16px] text-cafe bg-pessego/40 px-3.5 py-2.5 md:px-4 md:py-3 rounded-xl border-l-2 border-sol">
              {line.slice(1, -1)}
            </p>
          );
        }
        if (line.trim() === "") return <div key={i} className="h-0.5 md:h-1" />;
        return <p key={i}>{line}</p>;
      })}
    </div>
  );
}
