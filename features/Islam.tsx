
import React, { useState, useEffect } from 'react';
import { Moon, Sun, Heart, MapPin, List, RefreshCw, Bell, BellOff, Settings2, Plus, Minus } from 'lucide-react';
import { PrayerOffsets, AppSettings } from '../types';

const Islam: React.FC = () => {
  const [tasbih, setTasbih] = useState(0);
  const [haptic, setHaptic] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const [offsets, setOffsets] = useState<PrayerOffsets>(() => {
    const savedSettings = localStorage.getItem('zeemx_settings');
    if (savedSettings) {
      const settings: AppSettings = JSON.parse(savedSettings);
      return settings.prayerOffsets;
    }
    const saved = localStorage.getItem('zeemx_prayer_offsets');
    return saved ? JSON.parse(saved) : { Fajr: 0, Dhuhr: 0, Asr: 0, Maghrib: 0, Isha: 0 };
  });

  const baseTimes: Record<keyof PrayerOffsets, string> = {
    Fajr: '05:42',
    Dhuhr: '12:28',
    Asr: '15:45',
    Maghrib: '18:12',
    Isha: '19:30'
  };

  const adjustTime = (timeStr: string, offsetMinutes: number) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes + offsetMinutes);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  useEffect(() => {
    localStorage.setItem('zeemx_prayer_offsets', JSON.stringify(offsets));
    const savedSettings = localStorage.getItem('zeemx_settings');
    if (savedSettings) {
      const settings: AppSettings = JSON.parse(savedSettings);
      settings.prayerOffsets = offsets;
      localStorage.setItem('zeemx_settings', JSON.stringify(settings));
    }
  }, [offsets]);

  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        new Notification("zeemX", { body: "Prayer notifications are now active." });
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  const incrementTasbih = () => {
    setTasbih(t => t + 1);
    setHaptic(true);
    setTimeout(() => setHaptic(false), 100);
    if (window.navigator.vibrate) window.navigator.vibrate(50);
  };

  const prayerNames: (keyof PrayerOffsets)[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 pb-20">
      <header className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-serif dark:text-white">The Sanctuary</h2>
          <p className="text-slate-500 dark:text-slate-400">Stillness for the soul.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={toggleNotifications}
            className={`p-3 rounded-full transition-all ${notificationsEnabled ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}
            title="Toggle Notifications"
          >
            {notificationsEnabled ? <Bell size={20} /> : <BellOff size={20} />}
          </button>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-3 rounded-full transition-all ${showSettings ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}
          >
            <Settings2 size={20} />
          </button>
        </div>
      </header>

      {showSettings && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-900/30 animate-in slide-in-from-top duration-300">
          <h3 className="text-lg font-serif mb-4 dark:text-white">Adjust Prayer Timings (Minutes)</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {prayerNames.map(key => (
              <div key={key} className="flex flex-col items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                <span className="text-xs font-medium text-slate-500">{key}</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setOffsets({...offsets, [key]: offsets[key] - 1})} className="p-1 hover:text-emerald-500 transition-colors"><Minus size={14} /></button>
                  <span className="text-sm font-bold dark:text-white w-8 text-center">{offsets[key] > 0 ? `+${offsets[key]}` : offsets[key]}</span>
                  <button onClick={() => setOffsets({...offsets, [key]: offsets[key] + 1})} className="p-1 hover:text-emerald-500 transition-colors"><Plus size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-emerald-50 dark:bg-emerald-950/20 p-8 rounded-3xl border border-emerald-100 dark:border-emerald-900/30 flex flex-col justify-between h-80">
          <div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tracking-widest uppercase mb-4 block">Ayah of the Day</span>
            <div className="space-y-4">
              <p className="text-2xl font-serif text-right text-emerald-900 dark:text-emerald-100 leading-relaxed" dir="rtl">
                فَإِنَّ مَعَ الْعُسْرِ يُسْرًا
              </p>
              <p className="text-lg font-serif italic text-emerald-800 dark:text-emerald-200 leading-snug">
                "So verily, with the hardship, there is relief."
              </p>
            </div>
          </div>
          <p className="text-emerald-600/70 dark:text-emerald-400/70 font-medium">— Ash-Sharh 94:5</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-serif dark:text-white">Prayer Times</h3>
            <div className="flex items-center gap-1 text-slate-400 text-xs">
              <MapPin size={12} /> Local Adjustments
            </div>
          </div>
          <div className="space-y-2">
            {prayerNames.map(name => (
              <div key={name} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:bg-emerald-50 transition-colors">
                <span className="text-slate-600 dark:text-slate-300 font-medium">{name}</span>
                <span className="text-slate-900 dark:text-white font-serif">{adjustTime(baseTimes[name], offsets[name])}</span>
              </div>
            ))}
          </div>
        </div>

        <div 
          onClick={incrementTasbih}
          className={`cursor-pointer select-none bg-slate-900 text-white p-8 rounded-3xl flex flex-col items-center justify-center space-y-6 relative overflow-hidden transition-all duration-150 ${haptic ? 'scale-95 bg-slate-800' : 'scale-100'}`}
        >
          <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none"></div>
          <h3 className="text-xl font-serif opacity-60">Tasbih</h3>
          <div className="text-8xl font-light font-serif tabular-nums">{tasbih}</div>
          <div className="flex gap-4 z-10">
            <button 
              onClick={(e) => { e.stopPropagation(); setTasbih(0); }}
              className="p-3 bg-white/5 hover:bg-red-500/20 rounded-full flex items-center justify-center transition-all border border-white/5"
            >
              <RefreshCw size={20} />
            </button>
          </div>
          <p className="text-white/40 text-xs text-center uppercase tracking-widest mt-4">Tap anywhere to count</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800">
          <h3 className="text-xl font-serif mb-6 flex items-center gap-2 dark:text-white">
            <Heart size={18} className="text-red-400" /> Morning Adhkar
          </h3>
          <div className="space-y-4">
            <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border-l-4 border-emerald-500">
              <p className="text-right text-lg mb-3 font-serif dark:text-slate-200" dir="rtl">حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">"Allah is sufficient for me; there is no deity except Him. On Him I have relied, and He is the Lord of the Great Throne."</p>
              <span className="block mt-3 text-xs font-bold text-emerald-600">— Recite 7 times</span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800">
          <h3 className="text-xl font-serif mb-6 flex items-center gap-2 dark:text-white">
            <List size={18} className="text-emerald-500" /> Daily Hadith
          </h3>
          <div className="p-6 bg-emerald-50/30 dark:bg-emerald-900/10 rounded-2xl">
            <p className="text-lg text-slate-700 dark:text-slate-300 italic leading-relaxed font-serif">
              "The best of people are those that bring most benefit to the rest of mankind." 
            </p>
            <p className="text-sm text-slate-400 mt-4">— Prophet Muhammad (ﷺ)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Islam;
