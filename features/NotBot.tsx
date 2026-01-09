
import React from 'react';
import { Info, Code, Shield, Heart, Zap, Coffee } from 'lucide-react';

const NotBot: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-12 animate-in fade-in duration-1000">
      <header className="text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-3xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto transform rotate-3 hover:rotate-0 transition-transform duration-500">
          <Code size={40} />
        </div>
        <h2 className="text-5xl font-serif dark:text-white">Meet NotBot</h2>
        <p className="text-xl text-slate-500 dark:text-slate-400 font-light max-w-2xl mx-auto">
          We are a group of passionate developers dedicated to creating digital tools that serve society and nourish the soul.
        </p>
      </header>

      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-amber-600">
            <Heart size={24} />
          </div>
          <h3 className="text-2xl font-serif dark:text-white">Our Mission</h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light">
            In an era of noise and endless distractions, we believe technology should be a sanctuary. NotBot focuses on building software that respects your privacy, simplifies your workflow, and integrates spiritual well-being into your daily digital habits.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600">
            <Zap size={24} />
          </div>
          <h3 className="text-2xl font-serif dark:text-white">Our Philosophy</h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light">
            "NotBot" stands for the human touch. We aren't just algorithms; we are people crafting experiences for people. We prioritize aesthetics, usability, and the 'stillness' that comes from a clean, purposeful interface.
          </p>
        </div>
      </section>

      <section className="bg-emerald-50 dark:bg-emerald-900/10 p-12 rounded-[3.5rem] border border-emerald-100 dark:border-emerald-900/20 space-y-8">
        <h3 className="text-3xl font-serif dark:text-white text-center">How zeemX Works</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-3 text-center">
            <div className="mx-auto w-10 h-10 flex items-center justify-center text-emerald-600"><Shield size={28} /></div>
            <h4 className="font-medium dark:text-white">Private by Design</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">Your data stays on your device. We use LocalStorage to ensure your thoughts are yours alone.</p>
          </div>
          <div className="space-y-3 text-center">
            <div className="mx-auto w-10 h-10 flex items-center justify-center text-emerald-600"><Info size={28} /></div>
            <h4 className="font-medium dark:text-white">Integrated Suite</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">Notes, Docs, and Sheets all in one place, reducing the need for multiple distracting tabs.</p>
          </div>
          <div className="space-y-3 text-center">
            <div className="mx-auto w-10 h-10 flex items-center justify-center text-emerald-600"><Coffee size={28} /></div>
            <h4 className="font-medium dark:text-white">Calm Notifications</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">Notifications that guide rather than interrupt—helping you stay mindful and productive.</p>
          </div>
        </div>
      </section>

      <footer className="text-center pb-12">
        <p className="text-slate-400 text-sm italic">Crafted with intention by NotBot.</p>
        <p className="text-slate-300 dark:text-slate-700 text-xs mt-2">© 2024 zeemX | Stillness, stored.</p>
      </footer>
    </div>
  );
};

export default NotBot;
