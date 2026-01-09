
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Grid, Lock, MoreVertical, Trash2, Maximize2, X, MessageSquare, Image as ImageIcon, Video as VideoIcon, Folder } from 'lucide-react';
import { GalleryItem } from '../types';

const Gallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('zeemx_gallery');
    return saved ? JSON.parse(saved) : [
      { id: '1', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', type: 'image', reflection: 'A moment of peace in the valley.', createdAt: Date.now() },
      { id: '2', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e', type: 'image', reflection: 'Sunlight filtering through the canopy.', createdAt: Date.now() - 86400000 }
    ];
  });

  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [activeAlbum, setActiveAlbum] = useState<string>('All');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('zeemx_gallery', JSON.stringify(items));
  }, [items]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Fix: Explicitly type 'file' as File to avoid 'unknown' type errors in build/lint
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newItem: GalleryItem = {
          id: Math.random().toString(36).substr(2, 9),
          url: event.target?.result as string,
          type: file.type.startsWith('video') ? 'video' : 'image',
          createdAt: Date.now()
        };
        setItems(prev => [newItem, ...prev]);
      };
      // Fix: 'file' is now correctly typed as File, which is a valid Blob for readAsDataURL
      reader.readAsDataURL(file);
    });
  };

  const deleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this memory?')) {
      setItems(prev => prev.filter(i => i.id !== id));
      if (selectedItem?.id === id) setSelectedItem(null);
    }
  };

  const updateReflection = (id: string, reflection: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, reflection } : i));
    if (selectedItem?.id === id) setSelectedItem({ ...selectedItem, reflection });
  };

  const filteredItems = activeAlbum === 'All' ? items : items.filter(i => i.album === activeAlbum);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif dark:text-white">Private Gallery</h2>
          <p className="text-slate-400 text-sm flex items-center gap-1 mt-1">
            <Lock size={12} /> Stillness, stored securely for your eyes only.
          </p>
        </div>
        <div className="flex gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            multiple 
            accept="image/*,video/*" 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
          >
            <Plus size={18} />
            <span>Upload Memory</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 overflow-x-auto py-2 no-scrollbar">
        {['All', 'Nature', 'Family', 'Travel', 'Reflections'].map(album => (
          <button 
            key={album}
            onClick={() => setActiveAlbum(album)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeAlbum === album 
                ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900 shadow-md' 
                : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {album}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            onClick={() => setSelectedItem(item)}
            className="relative aspect-square rounded-[2rem] overflow-hidden group border border-slate-100 dark:border-slate-800 shadow-sm cursor-zoom-in"
          >
            {item.type === 'image' ? (
              <img src={item.url} alt="Memory" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            ) : (
              <video src={item.url} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
              <div className="flex justify-end">
                <button onClick={(e) => deleteItem(item.id, e)} className="p-2 bg-white/10 hover:bg-red-500/40 rounded-full text-white backdrop-blur-md transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="flex items-center gap-2 text-white/90 text-xs">
                {item.type === 'video' ? <VideoIcon size={14} /> : <ImageIcon size={14} />}
                <span className="truncate flex-1">{item.reflection || 'Add a thought...'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl" onClick={() => setSelectedItem(null)}></div>
          <div className="relative w-full max-w-6xl bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-full max-h-[85vh]">
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-6 right-6 z-10 p-3 bg-black/10 hover:bg-black/20 rounded-full text-slate-500 transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="flex-[2] bg-black flex items-center justify-center overflow-hidden">
              {selectedItem.type === 'image' ? (
                <img src={selectedItem.url} className="max-w-full max-h-full object-contain animate-in zoom-in-95 duration-500" />
              ) : (
                <video src={selectedItem.url} controls className="max-w-full max-h-full" />
              )}
            </div>

            <div className="flex-1 p-8 md:p-12 flex flex-col bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800">
              <div className="mb-8">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block mb-2">Reflections</span>
                <h3 className="text-2xl font-serif dark:text-white mb-4">A Captured Moment</h3>
                <textarea 
                  value={selectedItem.reflection || ''}
                  onChange={(e) => updateReflection(selectedItem.id, e.target.value)}
                  placeholder="What does this memory feel like?"
                  className="w-full h-40 bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 resize-none leading-relaxed font-light"
                />
              </div>
              
              <div className="mt-auto pt-6 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <Lock size={12} />
                  <span>Stored on {new Date(selectedItem.createdAt).toLocaleDateString()}</span>
                </div>
                <button onClick={(e) => deleteItem(selectedItem.id, e)} className="text-red-400 hover:text-red-500 transition-colors text-xs font-medium uppercase tracking-widest">
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
