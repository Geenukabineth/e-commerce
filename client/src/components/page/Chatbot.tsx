import React, { useEffect, useRef, useState } from "react";
import {
  Send,  
  Bot,
  X,
  MessageSquare,
  RefreshCcw,
  ChevronRight,
} from "lucide-react";

/* ---------- TYPES ---------- */
type Role = "user" | "assistant";

type Message = {
  id: string;
  role: Role;
  content: string;
};

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  link: string;
}

/* ---------- MAIN COMPONENT ---------- */
const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "assistant",
      content:
        "Hello! I'm your AI concierge 🤖 I can help you find products, track orders, or answer questions.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  /* ---------- AUTO SCROLL ---------- */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  /* ---------- SEND MESSAGE ---------- */
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      const data = await res.json();

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.reply || "Sorry, I couldn’t understand that.",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "⚠️ Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- RESET CHAT ---------- */
  const resetChat = () => {
    setMessages([
      {
        id: "init",
        role: "assistant",
        content:
          "Hello! I'm your AI concierge 🤖 How can I help you today?",
      },
    ]);
  };

  /* ---------- RENDER MESSAGE ---------- */
  const renderMessageContent = (m: Message) => {
    const isRecommendation =
      m.role === "assistant" &&
      m.content.toLowerCase().includes("recommend");

    return (
      <div className="space-y-3">
        <p className="whitespace-pre-wrap">{m.content}</p>

        {isRecommendation && (
          <div className="flex gap-3 overflow-x-auto">
            <ProductCard
              product={{
                id: "1",
                name: "Premium Cotton Tee",
                price: "$35.00",
                image:
                  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400",
                link: "#",
              }}
            />
            <ProductCard
              product={{
                id: "2",
                name: "Slim Fit Chinos",
                price: "$65.00",
                image:
                  "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400",
                link: "#",
              }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-[380px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col border overflow-hidden">
          {/* HEADER */}
          <header className="p-4 bg-slate-900 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Bot />
              <span className="font-bold">LuxeBot AI</span>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <X />
            </button>
          </header>

          {/* BODY */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-xl text-sm ${
                    m.role === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-white border"
                  }`}
                >
                  {renderMessageContent(m)}
                </div>
              </div>
            ))}
            {isLoading && <TypingIndicator />}
          </div>

          {/* FOOTER */}
          <footer className="p-4 border-t">
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something..."
                className="flex-1 border rounded-lg px-3 py-2 text-sm"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-indigo-600 text-white px-3 rounded-lg"
              >
                <Send size={16} />
              </button>
            </form>

            <button
              onClick={resetChat}
              className="mt-2 text-xs text-slate-500 flex items-center gap-1"
            >
              <RefreshCcw size={12} /> Reset Chat
            </button>
          </footer>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-xl"
        >
          <MessageSquare size={28} />
        </button>
      )}
    </div>
  );
};

/* ---------- PRODUCT CARD ---------- */
const ProductCard = ({ product }: { product: Product }) => (
  <div className="min-w-[180px] bg-white border rounded-xl overflow-hidden">
    <img src={product.image} alt={product.name} />
    <div className="p-3">
      <h4 className="text-sm font-semibold">{product.name}</h4>
      <p className="text-indigo-600 font-bold">{product.price}</p>
      <button className="mt-2 w-full bg-slate-900 text-white text-xs py-2 rounded flex items-center justify-center gap-1">
        View <ChevronRight size={12} />
      </button>
    </div>
  </div>
);

/* ---------- TYPING INDICATOR ---------- */
const TypingIndicator = () => (
  <div className="flex gap-1">
    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></span>
    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-300"></span>
  </div>
);

export default Chatbot;
