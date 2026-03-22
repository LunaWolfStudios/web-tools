import React, { useCallback, useState, useRef } from 'react';
import { UploadCloud, FileJson, HelpCircle, X } from 'lucide-react';
import { ProcessedEntry } from '../types';
import { parseLeaderboardFile } from '../utils/dataProcessor';

interface FileUploadProps {
  onDataLoaded: (data: ProcessedEntry[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setError(null);

    const files = Array.from(e.dataTransfer.files) as File[];
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const handleChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      await processFile(e.target.files[0]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const processFile = async (file: File) => {
    if (!file.name.endsWith('.json') && !file.name.endsWith('.txt')) {
      setError('Please upload a .json or .txt file');
      return;
    }

    try {
      const data = await parseLeaderboardFile(file);
      onDataLoaded(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    }
  };

  const loadSampleData = () => {
    const sampleData: ProcessedEntry[] = [];
    const categories = ['Endless', 'Challenge', 'Time Attack', 'Survival'];
    const now = new Date();
    
    for (let i = 0; i < 500; i++) {
      // Generate random dates within the last 7 days
      const date = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
      const category = categories[Math.floor(Math.random() * categories.length)];
      // Different score ranges based on category
      const maxScore = category === 'Endless' ? 10000 : category === 'Survival' ? 5000 : 1000;
      const score = Math.floor(Math.random() * maxScore);
      
      sampleData.push({
        id: `sample-${i}`,
        timestamp: date.toISOString(),
        category,
        score,
        date: date.toISOString().split('T')[0],
        hour: date.getHours(),
        dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()],
        timestampMs: date.getTime(),
      });
    }
    
    onDataLoaded(sampleData);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px] p-8">
      <div
        className={`w-full max-w-2xl p-12 text-center border-2 border-dashed rounded-2xl transition-all duration-300 ease-in-out
          ${isDragging 
            ? 'border-cyan-400 bg-cyan-900/20 shadow-[0_0_30px_rgba(0,212,255,0.2)]' 
            : 'border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800/80'
          }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="p-4 rounded-full bg-slate-900/50 shadow-inner">
            <UploadCloud className={`w-16 h-16 ${isDragging ? 'text-cyan-400' : 'text-slate-400'}`} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-slate-200">
              Upload Leaderboard Data
            </h3>
            <p className="text-slate-400">
              Drag and drop your .json or .txt file here, or click to browse
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <label className="relative cursor-pointer">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".json,.txt"
                onChange={handleChange}
              />
              <span className="inline-flex items-center px-6 py-3 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg shadow-lg hover:bg-blue-500 hover:shadow-cyan-500/25">
                <FileJson className="w-5 h-5 mr-2" />
                Select File
              </span>
            </label>
            
            <button
              onClick={loadSampleData}
              className="inline-flex items-center px-6 py-3 text-sm font-medium transition-colors border rounded-lg text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-white"
            >
              Load Sample Data
            </button>

            <button
              onClick={() => setShowHelp(true)}
              className="p-3 transition-colors border rounded-lg text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-cyan-400"
              title="Show expected format"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="p-4 mt-4 text-sm text-red-400 border border-red-900/50 rounded-lg bg-red-900/20">
              {error}
            </div>
          )}
        </div>
      </div>

      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 border shadow-2xl bg-slate-900 border-slate-700 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-slate-200">Expected JSON Format</h3>
              <button onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="mb-4 text-sm text-slate-400">
              The parser is lenient. It looks for any array containing objects with a <code>timestamp</code> and <code>score</code>. The <code>category</code> is optional.
            </p>
            <div className="relative">
              <pre className="p-4 overflow-x-auto text-sm font-mono border rounded-lg bg-slate-950 border-slate-800 text-cyan-300">
{`[
  {
    "timestamp": "2026-03-13T11:22:14Z",
    "category": "Endless",
    "score": 250
  },
  {
    "timestamp": "2026-03-15T16:34:52Z",
    "score": 100
  }
]`}
              </pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`[\n  {\n    "timestamp": "2026-03-13T11:22:14Z",\n    "category": "Endless",\n    "score": 250\n  },\n  {\n    "timestamp": "2026-03-15T16:34:52Z",\n    "score": 100\n  }\n]`);
                }}
                className="absolute px-3 py-1 text-xs transition-colors border rounded top-2 right-2 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
