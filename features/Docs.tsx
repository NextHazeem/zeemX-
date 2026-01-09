
import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Search, FileText, Download, History, Trash2, Bold, Italic, 
  List, Type, Image as ImageIcon, Table as TableIcon, Underline, 
  ChevronDown, ChevronUp, Palette, Highlighter, Heading1, Heading2, 
  AlignLeft, AlignCenter, AlignRight, ListOrdered
} from 'lucide-react';

const Docs: React.FC = () => {
  const [docs, setDocs] = useState<any[]>(() => {
    const saved = localStorage.getItem('zeemx_docs');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'The Art of Stillness', content: '<h1>The Art of Stillness</h1><p>Silence is not the absence of sound, but the presence of self.</p>', history: [], updatedAt: Date.now() }
    ];
  });
  
  const [selectedDocId, setSelectedDocId] = useState<string | null>(docs.length > 0 ? docs[0].id : null);
  const [openSections, setOpenSections] = useState({ styling: true, paragraph: true, insert: true });
  const [wordCount, setWordCount] = useState(0);
  const [showWordCount, setShowWordCount] = useState(true);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('zeemx_docs', JSON.stringify(docs));
    
    const savedSettings = localStorage.getItem('zeemx_settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setShowWordCount(settings.showWordCount !== false);
    }
  }, [docs]);

  useEffect(() => {
    updateWordCount();
  }, [selectedDocId]);

  const activeDoc = docs.find(d => d.id === selectedDocId);

  const updateWordCount = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || "";
    const words = text.trim().split(/\s+/);
    setWordCount(text.trim() === '' ? 0 : words.length);
  };

  const createDoc = () => {
    const newDoc = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Untitled Document',
      content: '<h1>New Document</h1><p>Start writing here...</p>',
      history: [],
      updatedAt: Date.now()
    };
    setDocs([newDoc, ...docs]);
    setSelectedDocId(newDoc.id);
  };

  const updateActiveContent = () => {
    if (!editorRef.current || !selectedDocId) return;
    const newContent = editorRef.current.innerHTML;
    setDocs(prev => prev.map(d => 
      d.id === selectedDocId 
        ? { ...d, content: newContent, updatedAt: Date.now() } 
        : d
    ));
    updateWordCount();
  };

  const saveHistory = () => {
    if (!activeDoc) return;
    setDocs(prev => prev.map(d => 
      d.id === selectedDocId 
        ? { ...d, history: [{ content: d.content, timestamp: Date.now() }, ...d.history].slice(0, 5) } 
        : d
    ));
    alert("Version saved to history.");
  };

  const execCommand = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    updateActiveContent();
  };

  const exportPDF = () => {
    window.print();
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const ToolbarSection = ({ title, section, children }: { title: string, section: 'styling' | 'paragraph' | 'insert', children?: React.ReactNode }) => (
    <div className="border-b border-slate-50 dark:border-slate-800 last:border-b-0">
      <button 
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
      >
        {title}
        {openSections[section] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>
      {openSections[section] && (
        <div className="px-2 pb-3 flex flex-wrap gap-1">
          {children}
        </div>
      )}
    </div>
  );

  const ToolbarButton = ({ onClick, icon: Icon, title, active = false }: any) => (
    <button 
      onClick={onClick} 
      className={`p-2 rounded-lg transition-all ${
        active 
          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' 
          : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'
      }`}
      title={title}
    >
      <Icon size={16} />
    </button>
  );

  return (
    <div className="h-full flex flex-col gap-6 animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center justify-between no-print pr-16">
        <div className="flex flex-col">
          <h2 className="text-3xl font-serif dark:text-white">Documents</h2>
          {showWordCount && activeDoc && (
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              {wordCount} Words
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={saveHistory} className="p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors" title="Save Version">
            <History size={20} />
          </button>
          <button onClick={exportPDF} className="p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors" title="Export as PDF">
            <Download size={20} />
          </button>
          <button onClick={createDoc} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20">
            <Plus size={18} />
            <span className="hidden sm:inline">New Document</span>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6 h-full min-h-[600px]">
        <div className="md:col-span-1 flex flex-col gap-6 no-print">
          {/* Document List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search docs..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-1 focus:ring-emerald-500 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              {docs.map((doc) => (
                <div key={doc.id} className="group relative">
                  <button 
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all ${
                      selectedDocId === doc.id 
                        ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FileText size={16} />
                      <span className="font-medium text-sm truncate">{doc.title}</span>
                    </div>
                  </button>
                  <button 
                    onClick={() => setDocs(prev => prev.filter(d => d.id !== doc.id))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Collapsible Toolbar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <ToolbarSection title="Text Styling" section="styling">
              <ToolbarButton onClick={() => execCommand('bold')} icon={Bold} title="Bold" />
              <ToolbarButton onClick={() => execCommand('italic')} icon={Italic} title="Italic" />
              <ToolbarButton onClick={() => execCommand('underline')} icon={Underline} title="Underline" />
              <div className="w-full mt-2 flex gap-1">
                <div className="relative group/color p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2 cursor-pointer text-slate-500">
                  <Palette size={16} />
                  <input 
                    type="color" 
                    onChange={(e) => execCommand('foreColor', e.target.value)} 
                    className="w-4 h-4 rounded-full border-none p-0 bg-transparent cursor-pointer"
                    title="Text Color"
                  />
                </div>
                <div className="relative group/highlight p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2 cursor-pointer text-slate-500">
                  <Highlighter size={16} />
                  <input 
                    type="color" 
                    onChange={(e) => execCommand('hiliteColor', e.target.value)} 
                    className="w-4 h-4 rounded-full border-none p-0 bg-transparent cursor-pointer"
                    title="Highlight Color"
                  />
                </div>
              </div>
            </ToolbarSection>

            <ToolbarSection title="Paragraph" section="paragraph">
              <ToolbarButton onClick={() => execCommand('formatBlock', 'H1')} icon={Heading1} title="Heading 1" />
              <ToolbarButton onClick={() => execCommand('formatBlock', 'H2')} icon={Heading2} title="Heading 2" />
              <ToolbarButton onClick={() => execCommand('formatBlock', 'P')} icon={Type} title="Paragraph" />
              <div className="w-full h-px bg-slate-50 dark:bg-slate-800 my-1"></div>
              <ToolbarButton onClick={() => execCommand('justifyLeft')} icon={AlignLeft} title="Align Left" />
              <ToolbarButton onClick={() => execCommand('justifyCenter')} icon={AlignCenter} title="Center" />
              <ToolbarButton onClick={() => execCommand('justifyRight')} icon={AlignRight} title="Align Right" />
            </ToolbarSection>

            <ToolbarSection title="Insert" section="insert">
              <ToolbarButton onClick={() => execCommand('insertUnorderedList')} icon={List} title="Bullet List" />
              <ToolbarButton onClick={() => execCommand('insertOrderedList')} icon={ListOrdered} title="Numbered List" />
              <ToolbarButton onClick={() => {
                const url = prompt("Image URL:");
                if(url) execCommand('insertImage', url);
              }} icon={ImageIcon} title="Insert Image" />
              <ToolbarButton onClick={() => {
                const rows = prompt("Rows:", "3");
                const cols = prompt("Cols:", "3");
                if (rows && cols) {
                  let tableHtml = `<table style="width:100%; border-collapse: collapse; border: 1px solid #e2e8f0; margin: 10px 0;">`;
                  for(let r=0; r<parseInt(rows); r++) {
                    tableHtml += `<tr>`;
                    for(let c=0; c<parseInt(cols); c++) {
                      tableHtml += `<td style="border: 1px solid #e2e8f0; padding: 8px;">Cell</td>`;
                    }
                    tableHtml += `</tr>`;
                  }
                  tableHtml += `</table><p><br></p>`;
                  execCommand('insertHTML', tableHtml);
                }
              }} icon={TableIcon} title="Insert Table" />
            </ToolbarSection>
          </div>
        </div>

        <div className="md:col-span-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl flex flex-col overflow-hidden shadow-sm">
          {activeDoc ? (
            <div 
              ref={editorRef}
              contentEditable 
              onInput={updateActiveContent}
              className="flex-1 p-12 overflow-y-auto custom-scrollbar prose prose-slate dark:prose-invert max-w-none focus:outline-none text-slate-700 dark:text-slate-300 min-h-[500px]"
              dangerouslySetInnerHTML={{ __html: activeDoc.content }}
              placeholder="Pour your words here..."
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-40">
              <FileText size={64} className="mb-4 text-slate-300" />
              <p className="font-serif text-xl">Select or create a document to begin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Docs;
