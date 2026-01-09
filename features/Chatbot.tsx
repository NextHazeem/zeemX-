
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, Trash2, FileText, Zap } from 'lucide-react';
import { askGemini } from '../services/gemini';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Salam. I am your zeemX companion. I can help you write, plan, or summarize your documents. How can I assist your focus today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (customPrompt?: string) => {
    const text = customPrompt || input;
    if (!text.trim() || isTyping) return;

    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const response = await askGemini(text);
    const assistantMsg: Message = { role: 'assistant', content: response || "I'm lost in thought. Please try again." };
    
    setMessages(prev => [...prev, assistantMsg]);
    setIsTyping(false);
  };

  const summarizeDocs = () => {
    const docs = JSON.parse(localStorage.getItem('zeemx_docs') || '[]');
    if (docs.length === 0) {
      handleSend("Could you give me some ideas for what I should write about in my first document?");
      return;
    }
    const docTitles = docs.map((d: any) => d.title).join(', ');
    handleSend(`Can you summarize my current active documents for me? I have these titles: ${docTitles}. (Simulating document awareness)`);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm animate-in fade-in zoom-in duration-500">
      <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-xl font-serif dark:text-white">Assistant</h2>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <Zap size={10} /> Context-Aware
            </p>
          </div>
        </div>
        <div className="flex gap-2">
           <button 
            onClick={summarizeDocs}
            className="flex items-center gap-2 px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-500 hover:text-emerald-500 transition-colors"
          >
            <FileText size={14} /> Summarize Docs
          </button>
          <button 
            onClick={() => setMessages([{ role: 'assistant', content: 'Salam. How can I help you find clarity today?' }])}
            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto custom-scrollbar space-y-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              m.role === 'assistant' 
                ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-600' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
            }`}>
              {m.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${
              m.role === 'assistant' 
                ? 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-700/50' 
                : 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/10'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600">
              <Bot size={16} />
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 px-5 py-3 rounded-2xl flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Summarize my notes or ask a question..."
            className="w-full pl-6 pr-14 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[1.5rem] shadow-sm focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 dark:text-white transition-all"
          />
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-emerald-600 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
