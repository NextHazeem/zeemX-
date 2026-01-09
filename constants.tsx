
import React from 'react';
import { 
  LayoutDashboard, 
  StickyNote, 
  FileText, 
  Presentation, 
  Table as TableIcon, 
  MessageSquare, 
  Moon, 
  Image as ImageIcon, 
  Info,
  Search,
  Bell,
  LogOut,
  User,
  Heart,
  Calendar as CalendarIcon,
  Archive
} from 'lucide-react';

export const COLORS = {
  light: {
    bg: '#faf9f6',
    card: '#ffffff',
    text: '#1e293b',
    accent: '#475569',
    muted: '#94a3b8',
    primary: '#10b981', // Emerald
  },
  dark: {
    bg: '#0f172a',
    card: '#1e293b',
    text: '#f1f5f9',
    accent: '#94a3b8',
    muted: '#64748b',
    primary: '#34d399',
  }
};

export const ACCENT_COLORS = {
  emerald: 'bg-emerald-500',
  blue: 'bg-blue-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  slate: 'bg-slate-500'
};

export const MENU_ITEMS = [
  { id: 'dashboard', label: 'Home', icon: <LayoutDashboard size={20} /> },
  { id: 'notepad', label: 'Notepad', icon: <StickyNote size={20} /> },
  { id: 'docs', label: 'Docs', icon: <FileText size={20} /> },
  { id: 'calendar', label: 'Planner', icon: <CalendarIcon size={20} /> },
  { id: 'files', label: 'Locker', icon: <Archive size={20} /> },
  { id: 'slides', label: 'Slides', icon: <Presentation size={20} /> },
  { id: 'spreadsheet', label: 'Sheets', icon: <TableIcon size={20} /> },
  { id: 'ai', label: 'Assistant', icon: <MessageSquare size={20} /> },
  { id: 'islam', label: 'Islam', icon: <Moon size={20} /> },
  { id: 'gallery', label: 'Gallery', icon: <ImageIcon size={20} /> },
  { id: 'notbot', label: 'NotBot', icon: <Info size={20} /> },
];
