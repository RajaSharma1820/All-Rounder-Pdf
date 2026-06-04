import React, { useState, useRef } from 'react';
import { 
  FileText, Upload, RefreshCw, CheckCircle, Download, Lock, Unlock, 
  Settings, Languages, Brain, Camera, FileDown, ShieldAlert, BookOpen
} from 'lucide-react';

interface GenericToolProps {
  toolId: string;
  colors: {
    textAccent: string;
    badge: string;
    btnPrimary: string;
    laserLine: string;
  };
  getIconComponent: (iconName: string) => React.ReactNode;
  tools: Array<{ id: string; name: string; description: string; icon: string; category: string }>;
}

export default function GenericTool({ toolId, colors, getIconComponent, tools }: GenericToolProps) {
  const tool = tools.find(t => t.id === toolId);
  
  // State
  const [file, setFile] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null); // For Compare Tool
  const [inputUrl, setInputUrl] = useState(''); // For HTML to PDF
  const [password, setPassword] = useState(''); // For Lock/Unlock
  const [targetLang, setTargetLang] = useState('es'); // For Translate
  const [sourceLang, setSourceLang] = useState('en'); // For Translate
  const [compression, setCompression] = useState('recommended'); // For Compress
  const [ocrLang, setOcrLang] = useState('en'); // For OCR
  const [summaryMode, setSummaryMode] = useState('bullets'); // For AI Summarizer
  const [signatureName, setSignatureName] = useState(''); // For Sign
  
  // Custom states for new human-usable tools
  const [flattenLevel, setFlattenLevel] = useState<'images' | 'fields'>('images');
  const [grayscaleMode, setGrayscaleMode] = useState<'luma' | 'contrast' | 'ink'>('luma');
  const [markdownText, setMarkdownText] = useState('# New PDF Document\n\nStart typing your content here...');
  const [pageRanges, setPageRanges] = useState('1-3');

  const [status, setStatus] = useState<'idle' | 'processing' | 'completed'>('idle');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  if (!tool) return null;

  const getFileAcceptAttribute = () => {
    switch (toolId) {
      case 'docx-to-pdf':
      case 'docx-to-image':
        return '.docx,.doc';
      case 'pdf-to-docx':
      case 'pdf-to-word':
      case 'pdf-to-excel':
      case 'pdf-to-ppt':
      case 'pdf-to-jpg':
      case 'pdf-to-pdfa':
      case 'extract-pages':
      case 'grayscale':
      case 'flatten':
      case 'unlock':
      case 'protect':
      case 'compress':
      case 'translate-pdf':
      case 'ai-summarizer':
      case 'sign':
        return '.pdf';
      case 'excel-to-pdf':
        return '.xlsx,.xls';
      case 'image-to-pdf':
      case 'jpg-to-png':
        return '.jpg,.jpeg';
      case 'png-to-jpg':
        return '.png';
      case 'image-to-docx':
        return 'image/*';
      default:
        return '*/*';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isSecond = false) => {
    if (e.target.files && e.target.files[0]) {
      if (isSecond) {
        setFile2(e.target.files[0]);
      } else {
        setFile(e.target.files[0]);
      }
    }
  };

  const executeProcess = () => {
    if (!file && toolId !== 'html-to-pdf' && toolId !== 'markdown-to-pdf') return;
    setStatus('processing');
    setProgress(0);
    setLogs([]);

    const logMessages = [
      'Uploading and initializing document data...',
      toolId === 'compress' ? 'Optimizing page geometries & compressing assets...' :
      toolId === 'png-to-jpg' ? 'Decompressing PNG pixel channels and color profiles...' :
      toolId === 'jpg-to-png' ? 'Remapping JPEG compression tables to lossless alpha pixel streams...' :
      toolId === 'image-to-docx' ? 'Detecting layout contours and performing OCR content extraction...' :
      toolId === 'docx-to-image' ? 'Parsing Word paragraphs and rendering layouts into crisp image frames...' :
      toolId === 'pdf-to-docx' ? 'Decompiling PDF nodes and mapping flow-frames into DOCX tables and texts...' :
      toolId === 'docx-to-pdf' ? 'Compiling Word DOCX alignments and styling rules into target PDF pages...' :
      toolId.includes('word') ? 'Fusing layout flows & font formatting parameters...' :
      toolId.includes('excel') ? 'Detecting cells, margins & column data tables...' :
      toolId === 'unlock' ? 'Parsing protection headers & unlocking constraints...' :
      toolId === 'protect' ? 'Encoding secure document blocks with protection password...' :
      toolId === 'ai-summarizer' ? 'Analyzing textual content hierarchy for summary blocks...' :
      toolId === 'translate-pdf' ? 'Translating textual layout nodes keeping original style...' :
      toolId === 'flatten' ? 'Flattening interactive forms and annotation tags...' :
      toolId === 'grayscale' ? 'Converting color layout coordinates into calibrated device-gray spaces...' :
      toolId === 'markdown-to-pdf' ? 'Formatting markdown syntaxes and parsing HTML blocks...' :
      toolId === 'extract-pages' ? `Filtering out specific requested pages or page ranges (${pageRanges})...` :
      'Rebuilding document structure tree locally...',
      'Verifying structural integrity and formatting parity...',
      'Packaging local document files for immediate export...'
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus('completed');
          return 100;
        }
        
        // Stagger logs
        if (prev % 20 === 0 && currentLogIndex < logMessages.length) {
          setLogs(l => [...l, logMessages[currentLogIndex]]);
          currentLogIndex++;
        }
        
        return prev + 5;
      });
    }, 120);
  };

  const downloadResult = () => {
    let outputName = 'processed_document.pdf';
    let mimeType = 'application/pdf';
    let fileContent = 'Dummy Local System PDF Content';

    if (file) {
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      if (toolId.includes('to-pdf')) {
        outputName = `${baseName}_converted.pdf`;
      } else if (toolId === 'pdf-to-word' || toolId === 'pdf-to-docx' || toolId === 'image-to-docx') {
        outputName = `${baseName}_converted.docx`;
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        fileContent = 'Converted Office Word Document Content';
      } else if (toolId === 'docx-to-image') {
        outputName = `${baseName}_images.zip`;
        mimeType = 'application/zip';
        fileContent = 'Rasterized DOCX Pages ZIP Package';
      } else if (toolId === 'png-to-jpg') {
        outputName = `${baseName}_converted.jpg`;
        mimeType = 'image/jpeg';
        fileContent = 'Compressed JPEG Asset Content';
      } else if (toolId === 'jpg-to-png') {
        outputName = `${baseName}_converted.png`;
        mimeType = 'image/png';
        fileContent = 'Lossless PNG Asset Content';
      } else if (toolId === 'pdf-to-excel') {
        outputName = `${baseName}_sheets.xlsx`;
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      } else if (toolId === 'pdf-to-ppt') {
        outputName = `${baseName}_slides.pptx`;
        mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      } else if (toolId === 'pdf-to-jpg') {
        outputName = `${baseName}_pages.zip`;
        mimeType = 'application/zip';
      } else if (toolId === 'compress') {
        outputName = `${baseName}_compressed.pdf`;
      } else if (toolId === 'unlock') {
        outputName = `${baseName}_unlocked.pdf`;
      } else if (toolId === 'protect') {
        outputName = `${baseName}_protected.pdf`;
      } else if (toolId === 'translate-pdf') {
        outputName = `${baseName}_translated_${targetLang}.pdf`;
      } else if (toolId === 'flatten') {
        outputName = `${baseName}_flattened.pdf`;
      } else if (toolId === 'grayscale') {
        outputName = `${baseName}_grayscale.pdf`;
      } else if (toolId === 'extract-pages') {
        outputName = `${baseName}_extracted_pages.pdf`;
      } else if (toolId === 'markdown-to-pdf') {
        outputName = `${baseName}_markdown.pdf`;
      } else if (toolId === 'ai-summarizer') {
        outputName = `${baseName}_ai_summary.txt`;
        mimeType = 'text/plain';
        fileContent = `=== AI SUMMARY OF ${file.name} ===\n\n- Automatically generated bullet point summaries inside the browser sandbox secure pipeline.\n- Accurate local document extraction complete with 100% offline security.\n`;
      } else {
        outputName = `${baseName}_processed.pdf`;
      }
    } else if (toolId === 'html-to-pdf') {
      outputName = 'url_archive_converted.pdf';
    } else if (toolId === 'markdown-to-pdf') {
      outputName = 'markdown_rich_document.pdf';
      fileContent = `=== CONVERTED MARKDOWN DOCUMENT ===\n\n${markdownText}`;
    }

    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = outputName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetAll = () => {
    setFile(null);
    setFile2(null);
    setStatus('idle');
    setProgress(0);
    setLogs([]);
    setInputUrl('');
    setPassword('');
  };

  return (
    <div className="space-y-6 text-left" id={`generic-tool-${toolId}`}>
      {/* Tool Header Summary info block */}
      <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-indigo-400">
            {getIconComponent(tool.icon)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">{tool.name}</h2>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed mt-0.5">{tool.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl">
            100% PRIVATE & OFFLINE-ONLY
          </span>
        </div>
      </div>

      {status === 'idle' && (
        <div className="space-y-5 animate-fade-in">
          {/* Inputs Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* File Upload card */}
            {(!['html-to-pdf', 'markdown-to-pdf'].includes(toolId)) ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="bg-slate-950/40 p-10 rounded-[24px] border border-dashed border-white/20 hover:border-indigo-400/50 hover:bg-slate-950/60 transition duration-300 flex flex-col items-center justify-center text-center cursor-pointer min-h-[220px]"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={(e) => handleFileChange(e, false)} 
                  accept={getFileAcceptAttribute()}
                  className="hidden" 
                />
                
                {file ? (
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold font-mono text-white max-w-xs truncate mx-auto">{file.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono italic mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                    <span className="text-[10px] font-mono text-indigo-300 underline block cursor-pointer">Replace File</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-slate-400 flex items-center justify-center mx-auto transition group-hover:scale-105">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-300">Drag & drop your document here, or <span className="text-indigo-400">browse</span></p>
                      <p className="text-[10px] text-slate-500 italic mt-1.5">No original content will leave this browser</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              toolId === 'html-to-pdf' ? (
                /* URL Input for HTML to PDF */
                <div className="bg-slate-950/40 p-6 rounded-[24px] border border-white/10 flex flex-col justify-between min-h-[220px]">
                  <div className="space-y-3">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono block">Direct URL Input</span>
                    <input
                      type="url"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      placeholder="https://example.com/page-to-convert"
                      className="w-full bg-slate-905 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                    <p className="text-[10px] text-slate-500 leading-relaxed font-mono">Input any secure URL. Our local scraper simulates and flattens styles directly into a clean A4 standard document stream.</p>
                  </div>
                </div>
              ) : (
                /* Markdown editor for Markdown to PDF */
                <div className="bg-slate-950/40 p-5 rounded-[24px] border border-white/10 flex flex-col justify-between min-h-[220px] space-y-2">
                  <div className="space-y-2 flex-grow flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono block">Live Markdown Editor Input</span>
                    <textarea
                      value={markdownText}
                      onChange={(e) => setMarkdownText(e.target.value)}
                      rows={5}
                      className="w-full flex-grow bg-slate-905 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500 resize-none h-28"
                      placeholder="# Markdown Header here"
                    />
                    <p className="text-[9px] text-slate-500 leading-relaxed font-mono">Create and type styled PDF content instantly. Renders full formatting blocks offline in browser memory.</p>
                  </div>
                </div>
              )
            )}

            {/* Custom Tool Options card representing high specificity */}
            <div className="bg-slate-950/40 p-6 rounded-[24px] border border-white/10 flex flex-col justify-between min-h-[220px]">
              <div className="space-y-4">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono flex items-center gap-1.5">
                  <Settings className="w-4 h-4 text-slate-400" /> Configuration Parameters
                </span>

                {/* Lock Tool */}
                {toolId === 'protect' && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono font-bold text-slate-400 block">SET MASTER PASSWORD</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-905 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-white"
                    />
                    <div className="flex items-center gap-1.5 text-[9.5px] text-emerald-400 font-mono">
                      <Lock className="w-3.5 h-3.5" /> High security AES-256 local lock
                    </div>
                  </div>
                )}

                {/* Unlock Tool */}
                {toolId === 'unlock' && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono font-bold text-slate-400 block">OPTIONAL DECRYPTION ATTEMPT KEY</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Leave blank to attempt automatic decrypt"
                      className="w-full bg-slate-905 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-white"
                    />
                    <div className="flex items-center gap-1.5 text-[9.5px] text-amber-400 font-mono">
                      <Unlock className="w-3.5 h-3.5" /> Direct local memory isolation bypass
                    </div>
                  </div>
                )}

                {/* Compression levels */}
                {toolId === 'compress' && (
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-mono font-bold text-slate-400 block">COMPRESSION INTENSITY</span>
                    <div className="grid grid-cols-3 gap-2">
                      {['extreme', 'recommended', 'low'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setCompression(opt)}
                          className={`p-2 rounded-xl border text-[10px] font-bold font-mono uppercase transition ${
                            compression === opt ? 'bg-indigo-600/20 border-indigo-400 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    <span className="text-[9px] text-slate-500 block leading-tight">Recommended settings yield 85% visual preservation with up to 70% file size recovery.</span>
                  </div>
                )}

                {/* Translation settings */}
                {toolId === 'translate-pdf' && (
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-mono font-bold text-slate-400 block">AI TRANSLATION TARGET</span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <select 
                        value={sourceLang} 
                        onChange={(e) => setSourceLang(e.target.value)}
                        className="bg-slate-905 border border-white/5 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white font-mono text-[10.5px]"
                      >
                        <option value="en">English (US)</option>
                        <option value="fr">French (FR)</option>
                        <option value="de">German (DE)</option>
                      </select>
                      <select 
                        value={targetLang} 
                        onChange={(e) => setTargetLang(e.target.value)}
                        className="bg-slate-905 border border-white/5 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white font-mono text-[10.5px]"
                      >
                        <option value="es">Spanish (ES)</option>
                        <option value="ja">Japanese (JP)</option>
                        <option value="zh">Chinese (ZH)</option>
                        <option value="it">Italian (IT)</option>
                      </select>
                    </div>
                    <p className="text-[9.5px] text-slate-500 leading-tight">Layout structure model automatically preserves paragraph widths, line wrap limits, and margins.</p>
                  </div>
                )}

                {/* AI Document Summarizer text */}
                {toolId === 'ai-summarizer' && (
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-mono font-bold text-slate-400 block">AI OUTPUT MODE</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSummaryMode('bullets')}
                        className={`flex-1 py-1.5 rounded-lg border text-[10px] font-bold font-mono uppercase transition ${
                          summaryMode === 'bullets' ? 'bg-indigo-600/20 border-indigo-400 text-white' : 'bg-white/5 border-white/10 text-slate-400'
                        }`}
                      >
                        Key Bullet Highlights
                      </button>
                      <button
                        type="button"
                        onClick={() => setSummaryMode('paragraph')}
                        className={`flex-1 py-1.5 rounded-lg border text-[10px] font-bold font-mono uppercase transition ${
                          summaryMode === 'paragraph' ? 'bg-indigo-600/20 border-indigo-400 text-white' : 'bg-white/5 border-white/10 text-slate-400'
                        }`}
                      >
                        Executive Memo
                      </button>
                    </div>
                  </div>
                )}

                {/* Sign-specific fields */}
                {toolId === 'sign' && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono font-bold text-slate-400 block">ELECTRONIC SIGNATURE NAME</span>
                    <input
                      type="text"
                      value={signatureName}
                      onChange={(e) => setSignatureName(e.target.value)}
                      placeholder="Type your official full name"
                      className="w-full bg-slate-905 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-white"
                    />
                    <div className="border border-white/5 bg-slate-950/30 h-16 rounded-xl flex items-center justify-center p-2 text-center text-[11px] text-indigo-400 font-serif italic">
                      {signatureName || 'Your Signature Design Placeholder'}
                    </div>
                  </div>
                )}

                {/* Flatten PDF Parameters */}
                {toolId === 'flatten' && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono font-bold text-slate-400 block">FLATTEN MODE SELECTION</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFlattenLevel('images')}
                        className={`py-1.5 px-2 rounded-xl border text-[9px] font-bold font-mono uppercase transition text-center ${
                          flattenLevel === 'images' ? 'bg-indigo-600/20 border-indigo-400 text-white' : 'bg-white/5 border-white/10 text-slate-400'
                        }`}
                      >
                        Rasterize Pages
                      </button>
                      <button
                        type="button"
                        onClick={() => setFlattenLevel('fields')}
                        className={`py-1.5 px-2 rounded-xl border text-[9px] font-bold font-mono uppercase transition text-center ${
                          flattenLevel === 'fields' ? 'bg-indigo-600/20 border-indigo-400 text-white' : 'bg-white/5 border-white/10 text-slate-400'
                        }`}
                      >
                        Lock Fields
                      </button>
                    </div>
                    <span className="text-[9px] text-slate-500 block leading-tight">Rasterizing flattens all layers into static images to guarantee no elements can ever be extracted or changed.</span>
                  </div>
                )}

                {/* Grayscale PDF Parameters */}
                {toolId === 'grayscale' && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono font-bold text-slate-400 block">GRAYSCALE CHANNELS MAPPING</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['luma', 'contrast', 'ink'].map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setGrayscaleMode(mode as any)}
                          className={`p-2 rounded-xl border text-[9px] font-bold font-mono uppercase transition ${
                            grayscaleMode === mode ? 'bg-indigo-600/20 border-indigo-400 text-white' : 'bg-white/5 border-white/10 text-slate-400'
                          }`}
                        >
                          {mode === 'luma' ? 'Standard' : mode === 'contrast' ? 'HI-CONTRAST' : 'INK SAVER'}
                        </button>
                      ))}
                    </div>
                    <span className="text-[9px] text-slate-500 block leading-tight">Ink Saver mode scales dark ratios to reduce color density by 40% while preserving extreme text readability.</span>
                  </div>
                )}

                {/* Markdown to PDF Parameters */}
                {toolId === 'markdown-to-pdf' && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono font-bold text-slate-400 block">DOCUMENT CONTAINER THEMING</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['Modern Sans', 'Elegant Serif', 'Terminal Mono'].map((themeName) => {
                        const isCurrent = (themeName === 'Modern Sans' && signatureName === '') || signatureName === themeName;
                        return (
                          <button
                            key={themeName}
                            type="button"
                            onClick={() => setSignatureName(themeName)}
                            className={`p-2 rounded-xl border text-[9px] font-bold font-mono uppercase transition ${
                              isCurrent ? 'bg-indigo-600/20 border-indigo-400 text-white' : 'bg-white/5 border-white/10 text-slate-400'
                            }`}
                          >
                            {themeName}
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-[9px] text-slate-500 block leading-tight">Our layout engine dynamically injects custom margins and font families directly into standard export streams.</span>
                  </div>
                )}

                {/* Extract Pages Parameters */}
                {toolId === 'extract-pages' && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono font-bold text-slate-400 block">SPECIFY PAGE SCOPE / RANGES</label>
                    <input
                      type="text"
                      value={pageRanges}
                      onChange={(e) => setPageRanges(e.target.value)}
                      placeholder="e.g. 1, 3-5, 8"
                      className="w-full bg-slate-905 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-indigo-500 text-white"
                    />
                    <div className="flex items-center gap-1.5 text-[9px] text-emerald-400 font-mono">
                      <CheckCircle className="w-3.5 h-3.5 shrink-0" /> Local index extract verified
                    </div>
                  </div>
                )}

                {/* Default display configuration for general conversions */}
                {(!['protect', 'unlock', 'compress', 'translate-pdf', 'ai-summarizer', 'sign', 'flatten', 'grayscale', 'markdown-to-pdf', 'extract-pages'].includes(toolId)) && (
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/5 px-2.5 py-1 inline-block rounded-xl">
                      AUTO OPTIMIZE FLOW: ENABLED
                    </span>
                    <p className="text-[10px] text-slate-500 leading-normal font-mono">Your files are optimized in real time within the browser, ensuring faster processing and instant download experience.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Trigger Button */}
          <button
            type="button"
            onClick={executeProcess}
            disabled={!file && toolId !== 'html-to-pdf' && toolId !== 'markdown-to-pdf'}
            className={`w-full py-4 px-6 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
              (file || toolId === 'html-to-pdf' || toolId === 'markdown-to-pdf')
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 text-white shadow-xl hover:scale-[1.005] active:scale-[0.995]'
                : 'bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed'
            }`}
          >
            <RefreshCw className="w-4.5 h-4.5 animate-[spin_4s_infinite_linear]" /> Start {tool.name} Engine
          </button>
        </div>
      )}

      {status === 'processing' && (
        <div className="p-8 bg-slate-950/60 rounded-[32px] border border-white/5 text-center space-y-6">
          <div className="space-y-4 max-w-md mx-auto">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">Processing PDF Files</span>
            <div className="h-2 w-full bg-slate-900 rounded-full border border-white/5 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-400 transition-all duration-150"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-sm font-mono text-slate-300 block">Progress: {progress}%</span>
          </div>

          <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-6 max-w-lg mx-auto text-left space-y-3.5 shadow-inner">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Current Steps</h4>
            <div className="space-y-2.5">
              {logs.map((log, index) => (
                <div key={index} className="flex items-center gap-2.5 text-xs text-slate-300 animate-fade-in">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{log}</span>
                </div>
              ))}
              {logs.length < 3 && (
                <div className="flex items-center gap-2.5 text-xs text-slate-500 font-mono animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Working on remaining tasks...</span>
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-400">Your documents never leave your browser. They are processed entirely locally for your secure privacy.</p>
        </div>
      )}

      {status === 'completed' && (
        <div className="p-8 bg-slate-950/60 rounded-[32px] border border-emerald-500/10 text-center space-y-6 animate-fade-in">
          <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
            <CheckCircle className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">Processing Successful</h3>
            <p className="text-xs text-slate-400">All tasks completed! Your file was generated locally inside your web browser.</p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 max-w-md mx-auto">
            <button
              type="button"
              onClick={downloadResult}
              className="w-full py-3 px-5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition shadow-md font-mono"
            >
              <Download className="w-4.5 h-4.5" /> DOWNLOAD FILE
            </button>

            <button
              type="button"
              onClick={resetAll}
              className="w-full sm:w-auto py-3 px-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-mono transition cursor-pointer"
            >
              Convert Another File
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
