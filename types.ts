
export type ViewType = 'dashboard' | 'notepad' | 'docs' | 'slides' | 'spreadsheet' | 'ai' | 'islam' | 'gallery' | 'notbot' | 'settings' | 'calendar' | 'files';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string; // base64 or blob url
  createdAt: number;
}

export interface CalendarEvent {
  id: string;
  date: string; // ISO string
  title: string;
  type: 'intent' | 'reflection' | 'task';
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  fontFamily: 'serif' | 'sans' | 'mono';
  accentColor: 'emerald' | 'blue' | 'amber' | 'rose' | 'slate';
  uiTransparency: number;
  sidebarCompact: boolean;
  autoSaveInterval: number;
  defaultView: ViewType;
  showWordCount: boolean;
  hijriDateEnabled: boolean;
  notificationSound: 'none' | 'zen' | 'chime';
  quoteCategory: 'wisdom' | 'spiritual' | 'poetry';
  contentWidth: 'standard' | 'wide' | 'full';
  motionEnabled: boolean;
  soundEffects: boolean;
  privacyBlur: boolean;
  prayerOffsets: PrayerOffsets;
  typewriterMode: boolean;
}

export interface Note {
  id: string;
  content: string;
  updatedAt: number;
}

export interface Doc {
  id: string;
  title: string;
  content: string;
  history: { content: string; timestamp: number }[];
  updatedAt: number;
}

export interface SlidePage {
  id: string;
  title: string;
  content: string;
  image?: string;
}

export interface SlideDeck {
  id: string;
  title: string;
  pages: SlidePage[];
  updatedAt: number;
}

export interface GalleryItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  reflection?: string;
  album?: string;
  createdAt: number;
}

export interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface PrayerOffsets {
  Fajr: number;
  Dhuhr: number;
  Asr: number;
  Maghrib: number;
  Isha: number;
}
