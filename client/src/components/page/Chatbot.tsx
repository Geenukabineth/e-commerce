import React, { useState, useEffect, useRef } from 'react';
import { useChat, Message } from 'ai/react';
import { 
  Send, User, Bot, X, 
  MessageSquare, RefreshCcw, ChevronRight 
} from 'lucide-react';

// --- Types ---
interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  link: string;
}

// --- Main Component ---
const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, reload } = useChat({
    api: '/api/chat',
    initialMessages: [
      { 
        id: 'init', 
        role: 'assistant', 
        content: "Hello! I'm your AI concierge. I can help you find products, track orders, or answer style questions. What's on your mind?" 
      }
    ],
  });

  // Smooth scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  const renderMessageContent = (m: Message) => {
    const isRecommendation = m.role === 'assistant' && m.content.toLowerCase().includes('recommend');
    
    return (
      <div className="space-y-3">
        <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>
        
        {isRecommendation && (
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar">
            {/* Map through products here in a real app */}
            <ProductCard 
              product={{
                id: '1',
                name: 'Premium Cotton Tee',
                price: '$35.00',
                image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400',
                link: '#'
              }} 
            />
            <ProductCard 
              product={{
                id: '2',
                name: 'Slim Fit Chinos',
                price: '$65.00',
                image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400',
                link: '#'
              }} 
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans text-slate-900">
      {isOpen ? (
        <div className="w-[90vw] sm:w-[400px] h-[600px] max-h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden transition-all duration-300 animate-in slide-in-from-bottom-5">
          
          {/* Header */}
          <header className="p-4 bg-slate-900 text-white flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center shadow-inner">
                  <Bot size={22} className="text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></span>
              </div>
              <div>
                <h3 className="font-bold text-sm">LuxeBot AI</h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Personal Stylist</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="hover:bg-slate-800 p-2 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </header>

          {/* Chat Body */}
          <div 
            ref={scrollRef} 
            className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50 scroll-smooth"
          >
            {messages.map((m) => (
              <div 
                key={m.id} 
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}
              >
                <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm border ${
                    m.role === 'user' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white border-slate-200 text-slate-600'
                  }`}>
                    {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={`p-3.5 rounded-2xl text-[14px] shadow-sm leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
                  }`}>
                    {renderMessageContent(m)}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && <TypingIndicator />}
          </div>

          {/* Footer */}
          <footer className="p-4 bg-white border-t border-slate-100">
            <form onSubmit={handleSubmit} className="relative flex items-center">
              <input
                className="w-full pl-4 pr-12 py-3 bg-slate-100 border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                value={input}
                placeholder="Ask me anything..."
                onChange={handleInputChange}
              />
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-1.5 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all"
              >
                <Send size={18} />
              </button>
            </form>
            <div className="flex justify-between mt-3 px-1 text-[11px] text-slate-400 font-medium">
              <button 
                onClick={() => reload()} 
                className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
              >
                <RefreshCcw size={12} /> Reset Chat
              </button>
              <span className="italic">AI-powered support</span>
            </div>
          </footer>
        </div>
      ) : (
        /* Launcher */
        <button
          onClick={() => setIsOpen(true)}
          className="group relative w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-300"
        >
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold">
            1
          </div>
          <MessageSquare size={28} className="group-hover:rotate-12 transition-transform" />
        </button>
      )}
    </div>
  );
};

// --- Helper Components ---

const ProductCard = ({ product }: { product: Product }) => (
  <div className="min-w-[190px] bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer">
    <div className="relative aspect-square overflow-hidden">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
      />
    </div>
    <div className="p-3">
      <h4 className="text-[13px] font-semibold text-slate-800 line-clamp-1">{product.name}</h4>
      <p className="text-[13px] text-indigo-600 font-bold mb-2">{product.price}</p>
      <button className="w-full py-2 bg-slate-900 text-white text-[11px] font-medium rounded-lg flex items-center justify-center gap-1.5 hover:bg-indigo-600 transition-colors">
        View Item <ChevronRight size={12} />
      </button>
    </div>
  </div>
);

const TypingIndicator = () => (
  <div className="flex justify-start">
    <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1.5 items-center">
      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-duration:0.8s]"></span>
      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]"></span>
      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]"></span>
    </div>
  </div>
);

export default Chatbot;