
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalIcon, Sparkles, Heart, Trash2 } from 'lucide-react';
import { CalendarEvent } from '../types';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('zeemx_calendar');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');

  useEffect(() => {
    localStorage.setItem('zeemx_calendar', JSON.stringify(events));
  }, [events]);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDay(null);
  };

  const addEvent = () => {
    if (!newEventTitle.trim() || selectedDay === null) return;
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay).toISOString();
    const newEvent: CalendarEvent = {
      id: Math.random().toString(36).substr(2, 9),
      date: dateStr,
      title: newEventTitle,
      type: 'intent'
    };
    setEvents([...events, newEvent]);
    setNewEventTitle('');
    setIsAdding(false);
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const getEventsForDay = (day: number) => {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return events.filter(e => {
      const eventDate = new Date(e.date);
      return eventDate.getDate() === d.getDate() && 
             eventDate.getMonth() === d.getMonth() && 
             eventDate.getFullYear() === d.getFullYear();
    });
  };

  const days = [];
  const totalDays = daysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const offset = firstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  // Fill empty spaces
  for (let i = 0; i < offset; i++) days.push(null);
  // Fill actual days
  for (let i = 1; i <= totalDays; i++) days.push(i);

  const isToday = (day: number) => {
    const now = new Date();
    return day === now.getDate() && 
           currentDate.getMonth() === now.getMonth() && 
           currentDate.getFullYear() === now.getFullYear();
  };

  return (
    <div className="h-full flex flex-col gap-8 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-serif dark:text-white">Quiet Planner</h2>
          <p className="text-slate-500 dark:text-slate-400">Map your stillness.</p>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-slate-800 px-6 py-2 rounded-full shadow-sm border border-slate-100 dark:border-slate-700">
          <button onClick={handlePrevMonth} className="p-1 hover:text-emerald-500 transition-colors"><ChevronLeft size={20}/></button>
          <span className="text-lg font-serif dark:text-white min-w-[140px] text-center">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
          <button onClick={handleNextMonth} className="p-1 hover:text-emerald-500 transition-colors"><ChevronRight size={20}/></button>
        </div>
      </header>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Calendar Grid */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 py-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, idx) => (
              <button
                key={idx}
                disabled={!day}
                onClick={() => setSelectedDay(day)}
                className={`aspect-square relative flex flex-col items-center justify-center rounded-2xl transition-all duration-300 ${
                  !day ? 'opacity-0 cursor-default' : 
                  selectedDay === day ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 
                  isToday(day) ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 font-bold border border-emerald-100 dark:border-emerald-800' :
                  'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span className="text-sm font-medium">{day}</span>
                {day && getEventsForDay(day).length > 0 && (
                  <div className={`absolute bottom-2 w-1.5 h-1.5 rounded-full ${selectedDay === day ? 'bg-white' : 'bg-emerald-400'}`}></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Intents Panel */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-serif dark:text-white">Day Details</h3>
            {selectedDay && (
              <button 
                onClick={() => setIsAdding(true)}
                className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-full hover:bg-emerald-100 transition-colors"
              >
                <Plus size={18} />
              </button>
            )}
          </div>

          <div className="flex-1 space-y-4">
            {!selectedDay ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <CalIcon size={48} className="mb-4" />
                <p className="text-sm font-serif">Select a day to view intents.</p>
              </div>
            ) : (
              <>
                <div className="pb-4 border-b border-slate-50 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Schedule</p>
                  <p className="text-lg font-serif dark:text-white">{monthNames[currentDate.getMonth()]} {selectedDay}</p>
                </div>
                
                {isAdding && (
                  <div className="animate-in slide-in-from-top duration-300">
                    <input 
                      autoFocus
                      type="text"
                      placeholder="Today's intent..."
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addEvent()}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 mb-2 dark:text-white"
                    />
                    <div className="flex gap-2">
                      <button onClick={addEvent} className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-xs font-medium">Add</button>
                      <button onClick={() => setIsAdding(false)} className="flex-1 py-2 bg-slate-100 text-slate-500 rounded-lg text-xs">Cancel</button>
                    </div>
                  </div>
                )}

                <div className="space-y-3 overflow-y-auto custom-scrollbar max-h-[400px] pr-2">
                  {getEventsForDay(selectedDay).length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No intents found for this day.</p>
                  ) : (
                    getEventsForDay(selectedDay).map(event => (
                      <div key={event.id} className="group flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-emerald-100 transition-all">
                        <div className="flex items-center gap-3">
                          <Sparkles size={14} className="text-emerald-500" />
                          <span className="text-sm text-slate-700 dark:text-slate-300">{event.title}</span>
                        </div>
                        <button onClick={() => deleteEvent(event.id)} className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500 transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800">
            <div className="flex items-center gap-3 text-emerald-600/70 dark:text-emerald-400/70">
              <Heart size={16} />
              <p className="text-xs font-serif italic">Live with intention, not obligation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
