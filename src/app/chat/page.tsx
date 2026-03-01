"use client";

import { FormEvent, useMemo, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const canSend = useMemo(() => prompt.trim().length > 0 && !isLoading, [prompt, isLoading]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSend) return;

    const userMessage: ChatMessage = { role: "user", content: prompt.trim() };
    setPrompt("");
    setMessages((prev) => [...prev, userMessage, { role: "assistant", content: "" }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Chat request failed.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const next = [...prev];
          const lastIndex = next.length - 1;
          if (lastIndex >= 0 && next[lastIndex].role === "assistant") {
            next[lastIndex] = {
              ...next[lastIndex],
              content: next[lastIndex].content + text,
            };
          }
          return next;
        });
      }
    } catch {
      setMessages((prev) => {
        const next = [...prev];
        const lastIndex = next.length - 1;
        if (lastIndex >= 0 && next[lastIndex].role === "assistant") {
          next[lastIndex] = {
            role: "assistant",
            content: "Sorry, something went wrong.",
          };
        }
        return next;
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <h1>AI Chat MVP</h1>
      <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, minHeight: 360, marginTop: 16 }}>
        {messages.length === 0 ? (
          <p>Start by sending your first message.</p>
        ) : (
          messages.map((message, index) => (
            <p key={index} style={{ whiteSpace: "pre-wrap" }}>
              <strong>{message.role === "user" ? "You" : "Assistant"}:</strong> {message.content}
            </p>
          ))
        )}
      </div>

      <form onSubmit={onSubmit} style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask anything..."
          style={{ flex: 1, padding: 12 }}
        />
        <button type="submit" disabled={!canSend} style={{ padding: "12px 16px" }}>
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
    </main>
  );
}
