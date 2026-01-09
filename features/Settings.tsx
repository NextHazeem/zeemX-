
import React, { useState, useEffect } from 'react';
import { 
  User, Palette, Layout, Zap, Shield, Moon, 
  Type, Save, Trash2, Bell, Volume2, Maximize, 
  Eye, Monitor, Clock, Check, Coffee, Sparkles
} from 'lucide-react';
import { AppSettings, ViewType, PrayerOffsets } from '../types';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('zeemx_settings');
    const savedOffsets = localStorage.getItem('zeemx_prayer_offsets');
    const defaultPrayerOffsets: PrayerOffsets = savedOffsets 
      ? JSON.parse(savedOffsets) 
      : { Fajr: 0, Dhuhr: 0, Asr: 0, Maghrib: 0, Isha: 0 };
    
    if (saved) {
      const parsed = JSON.parse(saved);
      return { 
        ...parsed, 
        prayerOffsets: defaultPrayerOffsets,
        typewriterMode: parsed.typewriterMode ?? false
      };
    }

    return {
      theme: 'system',
      fontFamily: 'serif',
      accentColor: 'emerald',
      uiTransparency: 80,
      sidebarCompact: false,
      autoSaveInterval: 5,
      defaultView: 'dashboard',
      showWordCount: true,
      hijriDateEnabled: true,
      notificationSound: 'zen',
      quoteCategory: 'spiritual',
      contentWidth: 'standard',
      motionEnabled: true,
      soundEffects: true,
      privacyBlur: false,
      prayerOffsets: defaultPrayerOffsets,
      typewriterMode: false
    };
  });

  const [savedStatus, setSavedStatus] = useState(false);

  useEffect(() => {
    localStorage.setItem('zeemx_settings', JSON.stringify(settings));
    localStorage.setItem('zeemx_prayer_offsets', JSON.stringify(settings.prayerOffsets));
    
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (settings.theme === 'light') {
      document.documentElement.classList.remove('dark');
    }
    
    const bodyClass = document.body.classList;
    bodyClass.remove('font-serif', 'font-sans', 'font-mono');
    if (settings.fontFamily === 'serif') bodyClass.add('font-serif');
    else if (settings.fontFamily === 'sans') bodyClass.add('font-sans');
    else if (settings.fontFamily === 'mono') bodyClass.add('font-mono');

  }, [settings]);

  const updateSetting = (key: keyof AppSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  const updatePrayerOffset = (key: keyof PrayerOffsets, value: number) => {
    setSettings(prev => ({
      ...prev,
      prayerOffsets: { ...prev.prayerOffsets, [key]: value }
    }));
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  const Section = ({ title, icon: Icon, children }: { title: string, icon: any, children?: React.ReactNode }) => (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-4">
        <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500">
          <Icon size={20} />
        </div>
        <h3 className="text-xl font-serif dark:text-white">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
        {children}
      </div>
    </div>
  );

  const Control = ({ label, description, children }: { label: string, description?: string, children?: React.ReactNode }) => (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col">
        <label className="text-sm font-medium dark:text-slate-200">{label}</label>
        {description && <span className="text-xs text-slate-400 font-light">{description}</span>}
      </div>
      <div className="mt-1">
        {children}
      </div>
    </div>
  );

  const prayerNames: (keyof PrayerOffsets)[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8 animate-in fade-in slide-in-from-bottom duration-700 pb-32">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-serif dark:text-white">Settings</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Customise zeemX to fit your rhythm.</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${savedStatus ? 'bg-emerald-50 text-emerald-600 opacity-100' : 'opacity-0'}`}>
          <Check size={14} /> Settings Saved
        </div>
      </header>

      <Section title="Aesthetics & Theme" icon={Palette}>
        <Control label="Application Theme" description="Choose your preferred visual mode.">
          <div className="flex p-1 bg-slate-50 dark:bg-slate-800 rounded-xl gap-1">
            {['light', 'dark', 'system'].map(t => (
              <button
                key={t}
                onClick={() => updateSetting('theme', t)}
                className={`flex-1 py-2 text-xs rounded-lg capitalize transition-all ${settings.theme === t ? 'bg-white dark:bg-slate-700 shadow-sm dark:text-white font-medium' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </Control>
        <Control label="Font Family" description="The typography of your quiet space.">
          <div className="flex p-1 bg-slate-50 dark:bg-slate-800 rounded-xl gap-1">
            {['serif', 'sans', 'mono'].map(f => (
              <button
                key={f}
                onClick={() => updateSetting('fontFamily', f)}
                className={`flex-1 py-2 text-xs rounded-lg capitalize transition-all ${settings.fontFamily === f ? 'bg-white dark:bg-slate-700 shadow-sm dark:text-white font-medium' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </Control>
        <Control label="Accent Color" description="The primary highlight across the app.">
          <div className="flex gap-3">
            {(['emerald', 'blue', 'amber', 'rose', 'slate'] as const).map(c => (
              <button
                key={c}
                onClick={() => updateSetting('accentColor', c)}
                className={`w-6 h-6 rounded-full ring-offset-2 dark:ring-offset-slate-900 transition-all ${settings.accentColor === c ? 'ring-2 ring-emerald-500' : ''} ${
                  c === 'emerald' ? 'bg-emerald-500' : 
                  c === 'blue' ? 'bg-blue-500' : 
                  c === 'amber' ? 'bg-amber-500' : 
                  c === 'rose' ? 'bg-rose-500' : 'bg-slate-500'
                }`}
              />
            ))}
          </div>
        </Control>
        <Control label="UI Transparency" description="Intensity of the frosted glass effect.">
          <input 
            type="range" min="0" max="100" 
            value={settings.uiTransparency} 
            onChange={(e) => updateSetting('uiTransparency', parseInt(e.target.value))}
            className="w-full accent-emerald-500"
          />
        </Control>
      </Section>

      <Section title="Focus & Productivity" icon={Zap}>
        <Control label="Auto-save Interval" description="Frequency of background saving (seconds).">
          <select 
            value={settings.autoSaveInterval}
            onChange={(e) => updateSetting('autoSaveInterval', parseInt(e.target.value))}
            className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm dark:text-white focus:outline-none"
          >
            {[1, 5, 10, 30].map(s => <option key={s} value={s}>{s} Seconds</option>)}
          </select>
        </Control>
        <Control label="Startup View" description="Which page opens when you launch zeemX.">
          <select 
            value={settings.defaultView}
            onChange={(e) => updateSetting('defaultView', e.target.value)}
            className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm dark:text-white focus:outline-none"
          >
            {['dashboard', 'notepad', 'docs', 'calendar', 'islam', 'ai'].map(v => <option key={v} value={v} className="capitalize">{v}</option>)}
          </select>
        </Control>
        <Control label="Sidebar Layout" description="Collapse sidebar into a compact icons-only view.">
           <div className="flex items-center gap-3">
              <input 
                type="checkbox" checked={settings.sidebarCompact} 
                onChange={(e) => updateSetting('sidebarCompact', e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500"
              />
              <span className="text-xs text-slate-500">Compact Navigation</span>
           </div>
        </Control>
      </Section>

      <Section title="Minimalism & Writing" icon={Coffee}>
        <Control label="Word Count" description="Show live word statistics in document editors.">
           <div className="flex items-center gap-3">
              <input 
                type="checkbox" checked={settings.showWordCount} 
                onChange={(e) => updateSetting('showWordCount', e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500"
              />
              <span className="text-xs text-slate-500">Enable in Docs & Notepad</span>
           </div>
        </Control>
        <Control label="Typewriter Mode" description="Subtle sound effects for keypresses (Aesthetic).">
           <div className="flex items-center gap-3">
              <input 
                type="checkbox" checked={settings.soundEffects} 
                onChange={(e) => updateSetting('soundEffects', e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500"
              />
              <span className="text-xs text-slate-500">Enable UI Audio feedback</span>
           </div>
        </Control>
        <Control label="Zen Writing" description="Hide all distractions while typing in Notepad.">
           <div className="flex items-center gap-3">
              <input 
                type="checkbox" checked={settings.typewriterMode} 
                onChange={(e) => updateSetting('typewriterMode', e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500"
              />
              <span className="text-xs text-slate-500">Focus Mode on</span>
           </div>
        </Control>
      </Section>

      <Section title="The Sanctuary (Islam)" icon={Moon}>
        <Control label="Prayer Time Adjustments" description="Fine-tune prayer times manually (minutes).">
          <div className="grid grid-cols-1 gap-2 mt-2">
            {prayerNames.map(p => (
              <div key={p} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-xs dark:text-slate-400">{p}</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => updatePrayerOffset(p, settings.prayerOffsets[p] - 1)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded">-</button>
                  <span className="text-xs font-bold dark:text-white w-6 text-center">{settings.prayerOffsets[p]}</span>
                  <button onClick={() => updatePrayerOffset(p, settings.prayerOffsets[p] + 1)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded">+</button>
                </div>
              </div>
            ))}
          </div>
        </Control>
        <Control label="Hijri Calendar" description="Show the Islamic date on your dashboard.">
           <div className="flex items-center gap-3 mt-1">
              <input 
                type="checkbox" checked={settings.hijriDateEnabled} 
                onChange={(e) => updateSetting('hijriDateEnabled', e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500"
              />
              <span className="text-xs text-slate-500">Show Hijri Date</span>
           </div>
        </Control>
        <Control label="Notification Tone" description="Sound played during prayer reminders.">
           <select 
            value={settings.notificationSound}
            onChange={(e) => updateSetting('notificationSound', e.target.value)}
            className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm dark:text-white focus:outline-none"
          >
            <option value="none">Silent</option>
            <option value="zen">Zen Gong</option>
            <option value="chime">Chime</option>
          </select>
        </Control>
      </Section>

      <Section title="Privacy & Security" icon={Shield}>
        <Control label="Privacy Mode" description="Blur app content when the browser tab is inactive.">
           <div className="flex items-center gap-3">
              <input 
                type="checkbox" checked={settings.privacyBlur} 
                onChange={(e) => updateSetting('privacyBlur', e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500"
              />
              <span className="text-xs text-slate-500">Blur on Inactive</span>
           </div>
        </Control>
        <Control label="Visual Motion" description="Enable smooth transitions and subtle animations.">
           <div className="flex items-center gap-3">
              <input 
                type="checkbox" checked={settings.motionEnabled} 
                onChange={(e) => updateSetting('motionEnabled', e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500"
              />
              <span className="text-xs text-slate-500">Enable Animations</span>
           </div>
        </Control>
        <Control label="Data Management" description="Permanently delete all locally stored data.">
           <button 
            onClick={() => {
              if (confirm("THIS WILL DELETE ALL YOUR WORK. Are you absolutely sure?")) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="px-4 py-2 border border-red-100 dark:border-red-900/30 text-red-500 text-xs font-medium rounded-xl hover:bg-red-50 transition-colors"
           >
             Factory Reset App
           </button>
        </Control>
      </Section>

      <footer className="text-center text-slate-300 dark:text-slate-700 text-xs pt-12">
        zeemX Version 1.3.0 • Build c28a1d
      </footer>
    </div>
  );
};

export default Settings;
