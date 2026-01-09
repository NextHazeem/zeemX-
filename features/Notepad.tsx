
import React, { useState, useEffect } from 'react';
import { Save, Trash2, Clock, Type } from 'lucide-react';

const Notepad: React.FC = () => {
  const [content, setContent] = useState('');
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [showWordCount, setShowWordCount] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('zeemx_notepad');
    if (saved) setContent(saved);

    const savedSettings = localStorage.getItem('zeemx_settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setShowWordCount(settings.showWordCount !== false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('zeemx_notepad', content);
      setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearTimeout(timer);
  }, [content]);

  const getWordCount = () => {
    const words = content.trim().split(/\s+/);
    return content.trim() === '' ? 0 : words.length;
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm animate-in zoom-in duration-300">
      <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-serif dark:text-white">Notepad</h2>
          <div className="flex items-center gap-4">
            <p className="text-xs text-slate-400 flex items-center gap-1">
              {lastSaved ? <><Clock size={10} /> Auto-saved at {lastSaved}</> : 'Start typing to auto-save...'}
            </p>
            {showWordCount && (
              <p className="text-xs text-slate-400 flex items-center gap-1 border-l border-slate-100 dark:border-slate-800 pl-4">
                <Type size={10} /> {getWordCount()} words
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2 mr-10"> {/* Margin to not overlap with fixed settings button */}
          <button 
            onClick={() => {
              if (confirm('Are you sure you want to clear your note?')) setContent('');
            }}
            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
      <div className="flex-1 p-8">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Pour your thoughts here..."
          className="w-full h-full bg-transparent text-lg md:text-xl text-slate-700 dark:text-slate-300 focus:outline-none resize-none leading-relaxed font-light placeholder:text-slate-200 dark:placeholder:text-slate-700"
        />
      </div>
    </div>
  );
};

export default Notepad;
