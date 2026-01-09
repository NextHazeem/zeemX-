
import React from 'react';
import { MENU_ITEMS } from '../constants';
import { ViewType, User as UserType } from '../types';
import { Sun, Moon, LogOut, LogIn, Heart } from 'lucide-react';

interface SidebarProps {
  activeView: ViewType;
  onNavigate: (view: ViewType) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  user: UserType | null;
  onLogout: () => void;
  onLogin: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  onNavigate, 
  isDarkMode, 
  toggleTheme, 
  user,
  onLogout,
  onLogin
}) => {
  return (
    <aside className="w-full md:w-64 md:h-screen bg-white dark:bg-slate-900 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 flex flex-col transition-colors duration-300">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
          <Heart size={18} />
        </div>
        <h1 className="text-2xl font-serif font-bold tracking-tight dark:text-white">zeemX</h1>
      </div>

      <nav className="flex-1 px-4 overflow-x-auto md:overflow-x-visible whitespace-nowrap md:whitespace-normal custom-scrollbar flex md:flex-col gap-1 pb-4 md:pb-0">
        {MENU_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as ViewType)}
            className={`sidebar-item flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeView === item.id 
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            <span className="sidebar-icon flex items-center justify-center">
              {item.icon}
            </span>
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-100 dark:border-slate-800 space-y-2">
        <button 
          onClick={toggleTheme}
          className="sidebar-item w-full flex items-center justify-between px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          <span className="sidebar-icon">
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </span>
        </button>

        {user ? (
          <div className="pt-2">
            <div className="px-4 py-2 mb-2 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                {user.name[0].toUpperCase()}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium dark:text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="sidebar-item w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
            >
              <span className="sidebar-icon">
                <LogOut size={18} />
              </span>
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <button 
            onClick={onLogin}
            className="sidebar-item w-full flex items-center gap-3 px-4 py-2 text-sm text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 rounded-lg transition-colors font-medium"
          >
            <span className="sidebar-icon">
              <LogIn size={18} />
            </span>
            <span>Sign In</span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
