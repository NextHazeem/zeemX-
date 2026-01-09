
import React, { useState, useEffect } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { User, ViewType, AppSettings } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Notepad from './features/Notepad';
import Docs from './features/Docs';
import Slides from './features/Slides';
import Spreadsheet from './features/Spreadsheet';
import Chatbot from './features/Chatbot';
import Islam from './features/Islam';
import Gallery from './features/Gallery';
import NotBot from './features/NotBot';
import Settings from './features/Settings';
import Calendar from './features/Calendar';
import FileManager from './features/FileManager';
import AuthModal from './components/AuthModal';
import { Settings as SettingsIcon } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isTabActive, setIsTabActive] = useState(true);

  // Initialize theme and user
  useEffect(() => {
    const savedUser = localStorage.getItem('zeemx_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedSettings = localStorage.getItem('zeemx_settings');
    if (savedSettings) {
      const settings: AppSettings = JSON.parse(savedSettings);
      if (settings.theme === 'dark') {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      } else if (settings.theme === 'light') {
        setIsDarkMode(false);
        document.documentElement.classList.remove('dark');
      }
      setActiveView(settings.defaultView || 'dashboard');
    } else {
      const savedTheme = localStorage.getItem('zeemx_theme');
      if (savedTheme === 'dark') {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      }
    }

    // Privacy Blur handlers
    const handleFocus = () => setIsTabActive(true);
    const handleBlur = () => setIsTabActive(false);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('zeemx_theme', !isDarkMode ? 'dark' : 'light');
    
    // Update settings object as well if it exists
    const savedSettings = localStorage.getItem('zeemx_settings');
    if (savedSettings) {
      const settings: AppSettings = JSON.parse(savedSettings);
      settings.theme = !isDarkMode ? 'dark' : 'light';
      localStorage.setItem('zeemx_settings', JSON.stringify(settings));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('zeemx_user');
    setUser(null);
    setActiveView('dashboard');
  };

  const renderActiveView = () => {
    if (!user && activeView !== 'dashboard' && activeView !== 'notbot' && activeView !== 'settings') {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <h2 className="text-3xl font-serif mb-4 text-slate-900 dark:text-white">Please sign in to access this feature.</h2>
          <p className="text-slate-500 mb-8 max-w-md">zeemX is a private space. Your data is stored securely and only accessible to you.</p>
          <button 
            onClick={() => setShowAuth(true)}
            className="px-6 py-2 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition-colors"
          >
            Join zeemX
          </button>
        </div>
      );
    }

    switch (activeView) {
      case 'dashboard': return <Dashboard user={user} onNavigate={setActiveView} />;
      case 'notepad': return <Notepad />;
      case 'docs': return <Docs />;
      case 'calendar': return <Calendar />;
      case 'files': return <FileManager />;
      case 'slides': return <Slides />;
      case 'spreadsheet': return <Spreadsheet />;
      case 'ai': return <Chatbot />;
      case 'islam': return <Islam />;
      case 'gallery': return <Gallery />;
      case 'notbot': return <NotBot />;
      case 'settings': return <Settings />;
      default: return <Dashboard user={user} onNavigate={setActiveView} />;
    }
  };

  // Check for Privacy Blur
  const getAppStyle = () => {
    const savedSettings = localStorage.getItem('zeemx_settings');
    if (savedSettings) {
      const settings: AppSettings = JSON.parse(savedSettings);
      if (settings.privacyBlur && !isTabActive) {
        return { filter: 'blur(20px)', transition: 'filter 0.3s ease' };
      }
    }
    return {};
  };

  return (
    <div 
      className={`min-h-screen flex flex-col md:flex-row ${isDarkMode ? 'dark bg-[#0f172a]' : 'bg-[#faf9f6]'}`}
      style={getAppStyle()}
    >
      <Sidebar 
        activeView={activeView} 
        onNavigate={setActiveView} 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme}
        user={user}
        onLogout={handleLogout}
        onLogin={() => setShowAuth(true)}
      />
      
      <main className="flex-1 h-screen overflow-y-auto custom-scrollbar p-4 md:p-8 relative">
        {/* Global Settings Trigger */}
        <div className="absolute top-6 right-6 md:top-10 md:right-12 z-20">
          <button 
            onClick={() => setActiveView('settings')}
            className="p-3 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-full text-slate-400 hover:text-emerald-500 hover:rotate-45 transition-all duration-500 shadow-sm no-print"
            title="Application Settings"
          >
            <SettingsIcon size={20} />
          </button>
        </div>

        <div className="max-w-6xl mx-auto h-full">
          {renderActiveView()}
        </div>
      </main>

      {showAuth && (
        <AuthModal 
          onClose={() => setShowAuth(false)} 
          onSuccess={(userData) => {
            setUser(userData);
            setShowAuth(false);
          }} 
        />
      )}
    </div>
  );
};

export default App;
