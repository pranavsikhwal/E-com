"use client";

import { useState } from "react";
import { sendChatMessage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send } from "lucide-react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your shopping assistant. Ask me anything about our products!",
    },
  ]);

  async function handleSend() {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const data = await sendChatMessage(input, updatedMessages);
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "Sorry, I couldn't process that. Try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSend();
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        zIndex: 1000,
      }}
    >
      {/* Chat window */}
      {isOpen && (
        <div
          style={{
            width: "320px",
            height: "420px",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            marginBottom: "1rem",
            border: "1px solid #e5e5e5",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem",
              borderBottom: "1px solid #e5e5e5",
              background: "#111",
              borderRadius: "12px 12px 0 0",
            }}
          >
            <p
              style={{
                color: "white",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              🛍️ Shop Assistant
            </p>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                color: "white",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "75%",
                    padding: "0.5rem 0.75rem",
                    borderRadius:
                      msg.role === "user"
                        ? "12px 12px 0 12px"
                        : "12px 12px 12px 0",
                    background: msg.role === "user" ? "#111" : "#f3f4f6",
                    color: msg.role === "user" ? "white" : "#111",
                    fontSize: "13px",
                    lineHeight: "1.5",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    padding: "0.5rem 0.75rem",
                    borderRadius: "12px 12px 12px 0",
                    background: "#f3f4f6",
                    fontSize: "13px",
                    color: "#666",
                  }}
                >
                  Thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div
            style={{
              padding: "0.75rem",
              borderTop: "1px solid #e5e5e5",
              display: "flex",
              gap: "0.5rem",
            }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about our products..."
              disabled={loading}
              style={{ fontSize: "13px" }}
            />
            <Button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              size="icon"
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Bubble button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: "#111",
          color: "white",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          float: "right",
        }}
      >
        <MessageCircle size={22} />
      </button>
    </div>
  );
}
