
import React, { useState, useEffect } from 'react';
import { ViewType, User } from '../types';
import { ArrowRight, Clock, Star, Quote, Sparkles, Feather, ShieldCheck } from 'lucide-react';

interface DashboardProps {
  user: User | null;
  onNavigate: (view: ViewType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const [greeting, setGreeting] = useState('');
  const [quote] = useState({ 
    text: 'Stillness is not the absence of sound, but the presence of self.', 
    author: 'Unknown' 
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const features = [
    { id: 'notepad', title: 'A Quick Thought', desc: 'Simple text notes for fleeting ideas.', color: 'bg-amber-50 dark:bg-amber-900/20', icon: <Feather className="text-amber-500" size={24} /> },
    { id: 'docs', title: 'Deep Writing', desc: 'Structured documents with rich formatting.', color: 'bg-blue-50 dark:bg-blue-900/20', icon: <Feather className="text-blue-500" size={24} /> },
    { id: 'islam', title: 'Soul Connection', desc: 'Find peace in daily dhikr and prayer.', color: 'bg-emerald-50 dark:bg-emerald-900/20', icon: <Sparkles className="text-emerald-500" size={24} /> },
  ];

  return (
    <div className="space-y-12 py-4 animate-in fade-in duration-1000 pb-20">
      {/* Cinematic Hero Section */}
      <section className="relative h-[400px] md:h-[450px] w-full rounded-[3.5rem] overflow-hidden animate-aurora border border-slate-100 dark:border-white/5 shadow-2xl shadow-emerald-900/5 group">
        {/* Floating Decorative Elements */}
        <div className="absolute top-10 right-20 w-32 h-32 bg-emerald-400/20 dark:bg-emerald-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 left-20 w-48 h-48 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/40 dark:border-white/5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 tracking-wider uppercase slide-enter">
            <ShieldCheck size={14} /> Encrypted & Private
          </div>
          
          <h2 className="text-5xl md:text-7xl font-serif text-slate-900 dark:text-white mb-4 slide-enter [animation-delay:0.2s]">
            {user ? `${greeting}, ${user.name.split(' ')[0]}.` : "Find your focus."}
          </h2>
          
          <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-300 font-light max-w-2xl leading-relaxed slide-enter [animation-delay:0.4s]">
            Your sanctuary to think, create, and remember. 
            <span className="italic opacity-60"> Stillness, stored.</span>
          </p>

          <div className="mt-10 flex gap-4 slide-enter [animation-delay:0.6s]">
            <button 
              onClick={() => onNavigate('notepad')}
              className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-medium hover:scale-105 transition-all shadow-xl shadow-black/10 flex items-center gap-2"
            >
              Start Writing <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => onNavigate('islam')}
              className="px-8 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/40 dark:border-white/5 rounded-2xl font-medium hover:bg-white dark:hover:bg-slate-700 transition-all text-slate-700 dark:text-slate-200"
            >
              The Sanctuary
            </button>
          </div>
        </div>

        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </section>

      {/* Quote Section */}
      <section className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700/50 shadow-sm relative overflow-hidden group/quote">
        <div className="absolute -top-10 -right-10 p-8 opacity-[0.02] dark:opacity-[0.05] group-hover/quote:scale-110 transition-transform duration-1000">
          <Quote size={180} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900/50 rounded-2xl flex items-center justify-center text-slate-400">
             <Quote size={32} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <p className="text-2xl font-serif italic mb-2 text-slate-700 dark:text-slate-200 leading-relaxed">"{quote.text}"</p>
            <p className="text-slate-400 dark:text-slate-500 font-medium tracking-widest uppercase text-[10px]">— {quote.author}</p>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((f, idx) => (
          <button 
            key={f.id}
            onClick={() => onNavigate(f.id as ViewType)}
            className={`${f.color} p-8 rounded-[2.5rem] text-left hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 group flex flex-col justify-between h-64 border border-transparent hover:border-white/50 dark:hover:border-white/5 shadow-lg shadow-black/[0.02]`}
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-sm">
                {f.icon}
              </div>
              <div>
                <h3 className="text-2xl font-serif mb-2 dark:text-white">{f.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
              Open <ArrowRight size={14} />
            </div>
          </button>
        ))}
      </div>

      {/* Recent Reflections */}
      <section className="pt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-serif dark:text-white">Recent Reflections</h3>
            <p className="text-slate-400 text-xs">Your latest thoughts and creations.</p>
          </div>
          <button onClick={() => onNavigate('notepad')} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">View all</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 h-36 flex flex-col justify-between hover:shadow-md transition-shadow group">
              <div className="space-y-3">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5"><Clock size={12} /> {i} day{i > 1 ? 's' : ''} ago</p>
                <div className="h-3 w-full bg-slate-100 dark:bg-slate-700 rounded-full group-hover:bg-emerald-100/50 dark:group-hover:bg-emerald-900/20 transition-colors"></div>
                <div className="h-3 w-2/3 bg-slate-50 dark:bg-slate-700/50 rounded-full group-hover:bg-emerald-50/50 dark:group-hover:bg-emerald-900/10 transition-colors"></div>
              </div>
              <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight size={14} className="text-slate-300" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
