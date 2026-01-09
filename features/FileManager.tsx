
import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Search, Archive, File, FileText, 
  Image as ImageIcon, MoreVertical, Trash2, 
  Download, Grid, List as ListIcon, Folder, 
  HardDrive, ShieldCheck, X 
} from 'lucide-react';
import { FileItem } from '../types';

const FileManager: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>(() => {
    const saved = localStorage.getItem('zeemx_locker');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('zeemx_locker', JSON.stringify(files));
  }, [files]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;

    Array.from(uploadedFiles).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newItem: FileItem = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          url: event.target?.result as string,
          createdAt: Date.now()
        };
        setFiles(prev => [newItem, ...prev]);
      };
      reader.readAsDataURL(file);
    });
  };

  const deleteFile = (id: string) => {
    if (confirm('Permanently remove this file from your locker?')) {
      setFiles(prev => prev.filter(f => f.id !== id));
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon size={24} className="text-blue-500" />;
    if (type.startsWith('video/')) return <File size={24} className="text-purple-500" />;
    if (type.includes('pdf')) return <FileText size={24} className="text-rose-500" />;
    if (type.includes('text') || type.includes('doc')) return <FileText size={24} className="text-emerald-500" />;
    return <Archive size={24} className="text-slate-500" />;
  };

  return (
    <div className="h-full flex flex-col gap-8 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 pr-16">
        <div>
          <h2 className="text-4xl font-serif dark:text-white">Personal Locker</h2>
          <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
            <ShieldCheck size={14} /> End-to-end local storage.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-slate-100 dark:bg-slate-700 text-emerald-600' : 'text-slate-400'}`}
            >
              <Grid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-slate-100 dark:bg-slate-700 text-emerald-600' : 'text-slate-400'}`}
            >
              <ListIcon size={18} />
            </button>
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-medium hover:scale-105 transition-all shadow-xl shadow-black/10"
          >
            <Plus size={18} />
            <span>Store File</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleUpload} 
            className="hidden" 
            multiple 
          />
        </div>
      </header>

      <div className="flex-1 flex flex-col gap-6">
        {/* Search & Filter */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search your locker..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-3.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-emerald-500/5 dark:text-white transition-all shadow-sm"
          />
        </div>

        {/* File Display */}
        {filteredFiles.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 mt-12">
            <HardDrive size={64} className="mb-4" />
            <h3 className="text-2xl font-serif">Locker is Empty</h3>
            <p className="max-w-xs mx-auto mt-2">Store your important documents, images, and reflections securely.</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6' : 'space-y-2'}>
            {filteredFiles.map(file => (
              viewMode === 'grid' ? (
                <div key={file.id} className="group relative bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-500 flex flex-col items-center text-center gap-4">
                   <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-3xl flex items-center justify-center mb-2">
                     {getFileIcon(file.type)}
                   </div>
                   <div className="w-full">
                     <p className="text-sm font-medium dark:text-white truncate px-2" title={file.name}>{file.name}</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{formatSize(file.size)}</p>
                   </div>
                   <div className="absolute inset-0 bg-white/90 dark:bg-slate-900/90 rounded-[2.5rem] opacity-0 group-hover:opacity-100 backdrop-blur-sm transition-all flex items-center justify-center gap-3">
                      <a href={file.url} download={file.name} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition-colors">
                        <Download size={18} />
                      </a>
                      <button onClick={() => deleteFile(file.id)} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                   </div>
                </div>
              ) : (
                <div key={file.id} className="group flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-50 dark:border-slate-800 hover:shadow-md transition-all">
                  <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-center">
                    {getFileIcon(file.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium dark:text-white truncate">{file.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{formatSize(file.size)} • {new Date(file.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={file.url} download={file.name} className="p-2 text-slate-400 hover:text-emerald-500 transition-colors">
                      <Download size={18} />
                    </a>
                    <button onClick={() => deleteFile(file.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileManager;
