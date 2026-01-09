
import React, { useState, useEffect } from 'react';
import { Presentation, Plus, Play, ChevronLeft, ChevronRight, Image as ImageIcon, Trash2, ArrowUp, ArrowDown, X } from 'lucide-react';

const Slides: React.FC = () => {
  const [decks, setDecks] = useState<any[]>(() => {
    const saved = localStorage.getItem('zeemx_slides');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Philosophy of zeemX', pages: [
        { id: 'p1', title: 'The Quiet Space', content: 'A sanctuary for the digital soul.', image: 'https://picsum.photos/seed/slide1/800/450' },
        { id: 'p2', title: 'Minimalism', content: 'Focus on what truly matters. Remove the rest.' }
      ], updatedAt: Date.now() }
    ];
  });

  const [activeDeckId, setActiveDeckId] = useState<string | null>(decks.length > 0 ? decks[0].id : null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPresenting, setIsPresenting] = useState(false);

  useEffect(() => {
    localStorage.setItem('zeemx_slides', JSON.stringify(decks));
  }, [decks]);

  const activeDeck = decks.find(d => d.id === activeDeckId);

  const addSlide = () => {
    if (!activeDeckId) return;
    const newPage = { id: Math.random().toString(), title: 'New Slide', content: 'Add details here...' };
    setDecks(prev => prev.map(d => d.id === activeDeckId ? { ...d, pages: [...d.pages, newPage] } : d));
  };

  const updateSlide = (field: string, val: string) => {
    setDecks(prev => prev.map(d => d.id === activeDeckId ? {
      ...d, pages: d.pages.map((p: any, idx: number) => idx === currentSlideIndex ? { ...p, [field]: val } : p)
    } : d));
  };

  const moveSlide = (dir: 'up' | 'down') => {
    if (!activeDeck) return;
    const newPages = [...activeDeck.pages];
    const targetIdx = dir === 'up' ? currentSlideIndex - 1 : currentSlideIndex + 1;
    if (targetIdx < 0 || targetIdx >= newPages.length) return;
    [newPages[currentSlideIndex], newPages[targetIdx]] = [newPages[targetIdx], newPages[currentSlideIndex]];
    setDecks(prev => prev.map(d => d.id === activeDeckId ? { ...d, pages: newPages } : d));
    setCurrentSlideIndex(targetIdx);
  };

  if (isPresenting && activeDeck) {
    return (
      <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col items-center justify-center p-12">
        <button onClick={() => setIsPresenting(false)} className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full transition-colors">
          <X size={32} />
        </button>
        <div className="max-w-6xl w-full text-center animate-in zoom-in duration-500">
          <h1 className="text-7xl font-serif mb-12">{activeDeck.pages[currentSlideIndex].title}</h1>
          <p className="text-3xl font-light opacity-80 leading-relaxed">{activeDeck.pages[currentSlideIndex].content}</p>
          {activeDeck.pages[currentSlideIndex].image && (
            <img src={activeDeck.pages[currentSlideIndex].image} className="mt-12 rounded-2xl mx-auto shadow-2xl max-h-[40vh]" />
          )}
        </div>
        <div className="absolute bottom-12 flex gap-8">
          <button onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))} className="p-4 bg-white/10 hover:bg-white/20 rounded-full">
            <ChevronLeft size={32} />
          </button>
          <button onClick={() => setCurrentSlideIndex(prev => Math.min(activeDeck.pages.length - 1, prev + 1))} className="p-4 bg-white/10 hover:bg-white/20 rounded-full">
            <ChevronRight size={32} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6 animate-in slide-in-from-left duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-serif dark:text-white">Slide Decks</h2>
        <div className="flex gap-2">
          <button onClick={() => setIsPresenting(true)} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors shadow-lg">
            <Play size={18} />
            <span>Present</span>
          </button>
          <button onClick={() => {
            const name = prompt("Deck Name:");
            if(name) setDecks([{ id: Math.random().toString(), title: name, pages: [{ id: '1', title: 'Welcome', content: 'Presentation starts here.' }], updatedAt: Date.now() }, ...decks]);
          }} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-500">
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 grid md:grid-cols-4 gap-8">
        <div className="md:col-span-1 space-y-4 overflow-y-auto custom-scrollbar pb-12">
          {activeDeck?.pages.map((s: any, i: number) => (
            <div key={s.id} className="relative group">
              <button
                onClick={() => setCurrentSlideIndex(i)}
                className={`w-full aspect-video bg-white dark:bg-slate-900 rounded-2xl border-2 transition-all p-4 text-left flex flex-col justify-between overflow-hidden ${
                  currentSlideIndex === i ? 'border-emerald-500 scale-105 shadow-md' : 'border-slate-100 dark:border-slate-800'
                }`}
              >
                <span className="text-[10px] text-slate-400 uppercase tracking-tighter">Slide {i + 1}</span>
                <span className="text-xs font-medium dark:text-white truncate">{s.title}</span>
                {s.image && <div className="absolute inset-0 opacity-10 pointer-events-none bg-center bg-cover" style={{ backgroundImage: `url(${s.image})` }} />}
              </button>
              <div className="absolute right-[-2.5rem] top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => moveSlide('up')} className="p-1 hover:text-emerald-500"><ArrowUp size={14} /></button>
                <button onClick={() => moveSlide('down')} className="p-1 hover:text-emerald-500"><ArrowDown size={14} /></button>
                <button onClick={() => {
                   setDecks(prev => prev.map(d => d.id === activeDeckId ? { ...d, pages: d.pages.filter((_: any, idx: number) => idx !== i) } : d));
                   setCurrentSlideIndex(0);
                }} className="p-1 hover:text-red-500"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
          <button onClick={addSlide} className="w-full aspect-video bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-500 transition-all">
            <Plus size={24} />
            <span className="text-xs mt-2 font-medium">Add Slide</span>
          </button>
        </div>

        <div className="md:col-span-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] shadow-xl flex flex-col relative overflow-hidden p-12">
          <div className="flex-1 flex flex-col gap-8 max-w-2xl mx-auto w-full">
            <input 
              value={activeDeck?.pages[currentSlideIndex]?.title || ''}
              onChange={(e) => updateSlide('title', e.target.value)}
              className="text-5xl font-serif bg-transparent focus:outline-none dark:text-white w-full border-b border-transparent focus:border-emerald-500/20 py-2"
              placeholder="Slide Title"
            />
            <textarea
              value={activeDeck?.pages[currentSlideIndex]?.content || ''}
              onChange={(e) => updateSlide('content', e.target.value)}
              className="text-xl text-slate-500 dark:text-slate-400 bg-transparent focus:outline-none w-full h-40 resize-none font-light leading-relaxed"
              placeholder="Add your story here..."
            />
            <div className="flex items-center gap-4">
               <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800"></div>
               <button onClick={() => {
                 const url = prompt("Image URL:");
                 if(url) updateSlide('image', url);
               }} className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-400 hover:text-emerald-500 transition-colors uppercase tracking-widest">
                 <ImageIcon size={14} /> {activeDeck?.pages[currentSlideIndex]?.image ? 'Change Image' : 'Attach Image'}
               </button>
               <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800"></div>
            </div>
            {activeDeck?.pages[currentSlideIndex]?.image && (
              <img src={activeDeck.pages[currentSlideIndex].image} className="rounded-2xl max-h-48 object-cover shadow-lg border border-slate-100 dark:border-slate-800" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slides;
