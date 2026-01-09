
import React, { useState, useEffect } from 'react';
import { Plus, Download, Upload, Grid, Calculator, Trash2 } from 'lucide-react';

const Spreadsheet: React.FC = () => {
  const [data, setData] = useState<string[][]>(() => {
    const saved = localStorage.getItem('zeemx_sheet');
    return saved ? JSON.parse(saved) : Array(20).fill(0).map(() => Array(10).fill(''));
  });

  const [activeCell, setActiveCell] = useState<[number, number] | null>(null);

  useEffect(() => {
    localStorage.setItem('zeemx_sheet', JSON.stringify(data));
  }, [data]);

  const evaluateFormula = (val: string): string => {
    if (!val.startsWith('=')) return val;
    try {
      const formula = val.substring(1).toUpperCase();
      // Simple SUM(A1:A5) support
      if (formula.startsWith('SUM(')) {
        const match = formula.match(/SUM\(([A-Z])(\d+):([A-Z])(\d+)\)/);
        if (match) {
          const colStart = match[1].charCodeAt(0) - 65;
          const rowStart = parseInt(match[2]) - 1;
          const rowEnd = parseInt(match[4]) - 1;
          let sum = 0;
          for (let r = rowStart; r <= rowEnd; r++) {
            const cellVal = parseFloat(data[r][colStart]);
            if (!isNaN(cellVal)) sum += cellVal;
          }
          return sum.toString();
        }
      }
      return 'Err!';
    } catch { return 'Err!'; }
  };

  const updateCell = (r: number, c: number, val: string) => {
    const newData = [...data];
    newData[r][c] = val;
    setData(newData);
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + data.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "zeemx_data.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-in slide-in-from-right duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif dark:text-white">Sheets</h2>
          <p className="text-xs text-slate-400 mt-1">Supports =SUM(A1:A5) style formulas.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 transition-colors">
            <Download size={18} />
            <span className="hidden sm:inline">CSV</span>
          </button>
          <button onClick={() => setData(Array(20).fill(0).map(() => Array(10).fill('')))} className="p-2.5 text-red-500 bg-white dark:bg-slate-800 border border-red-100 dark:border-red-900/30 rounded-xl">
            <Trash2 size={18} />
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20">
            <Calculator size={18} />
            <span className="hidden sm:inline">Calculate</span>
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col">
        <div className="overflow-auto custom-scrollbar flex-1">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 sticky top-0 z-10">
                <th className="w-12 border-b border-r border-slate-100 dark:border-slate-700 p-2 text-[10px] text-slate-400 font-normal uppercase">Idx</th>
                {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map(col => (
                  <th key={col} className="min-w-[120px] border-b border-r border-slate-100 dark:border-slate-700 p-2 text-xs text-slate-500 font-medium">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, r) => (
                <tr key={r}>
                  <td className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-r border-slate-100 dark:border-slate-700 p-2 text-[10px] text-slate-400 text-center font-mono">{r + 1}</td>
                  {row.map((cell, c) => (
                    <td key={c} className={`border-b border-r border-slate-100 dark:border-slate-700 p-0 transition-colors ${activeCell?.[0] === r && activeCell?.[1] === c ? 'bg-emerald-50/50 dark:bg-emerald-900/20' : ''}`}>
                      <input
                        value={activeCell?.[0] === r && activeCell?.[1] === c ? cell : evaluateFormula(cell)}
                        onFocus={() => setActiveCell([r, c])}
                        onBlur={() => setActiveCell(null)}
                        onChange={(e) => updateCell(r, c, e.target.value)}
                        className="w-full h-full p-3 bg-transparent text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 inset-0 text-sm font-light"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Spreadsheet;
