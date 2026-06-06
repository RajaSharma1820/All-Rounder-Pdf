import React, { useState } from 'react';
import { Target, HelpCircle, FileDown, CheckCircle2, RotateCw, Image as ImageIcon, Sliders, LayoutGrid } from 'lucide-react';

export default function ImgTool() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<'keep' | 'jpeg' | 'png' | 'webp'>('keep');
  const [sizePreset, setSizePreset] = useState<'original' | '1920' | '1280' | '800'>('original');
  const [filter, setFilter] = useState<'none' | 'grayscale' | 'contrast' | 'invert'>('none');

  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultName, setResultName] = useState('');
  const [resultSize, setResultSize] = useState(0);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      resetResult();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      resetResult();
    }
  };

  const resetResult = () => {
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
    }
    setResultUrl(null);
    setResultSize(0);
  };

  const processImageFile = () => {
    if (!file) return;
    setProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create offscreen canvas for rendering
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setProcessing(false);
          return;
        }

        // Calculate target dimensions
        let targetWidth = img.width;
        let targetHeight = img.height;

        if (sizePreset !== 'original') {
          const numWidth = parseInt(sizePreset, 10);
          if (img.width > numWidth) {
            const scale = numWidth / img.width;
            targetWidth = numWidth;
            targetHeight = Math.round(img.height * scale);
          }
        }

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Apply filters
        if (filter === 'grayscale') {
          ctx.filter = 'grayscale(100%)';
        } else if (filter === 'contrast') {
          ctx.filter = 'contrast(150%) brightness(105%)';
        } else if (filter === 'invert') {
          ctx.filter = 'invert(100%)';
        } else {
          ctx.filter = 'none';
        }

        // Redraw image onto canvas bounds
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Map format types
        let mimeType = file.type;
        let fileExtension = file.name.substring(file.name.lastIndexOf('.')) || '.png';

        if (format === 'jpeg') {
          mimeType = 'image/jpeg';
          fileExtension = '.jpg';
        } else if (format === 'png') {
          mimeType = 'image/png';
          fileExtension = '.png';
        } else if (format === 'webp') {
          mimeType = 'image/webp';
          fileExtension = '.webp';
        }

        const outQuality = quality / 100;

        canvas.toBlob((blob) => {
          if (blob) {
            const downloadUrl = URL.createObjectURL(blob);
            setResultUrl(downloadUrl);
            setResultSize(blob.size);
            
            const cleanBaseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            setResultName(`${cleanBaseName}_optimized${fileExtension}`);
          }
          setProcessing(false);
        }, mimeType, outQuality);
      };
      
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const downloadImageResult = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = resultName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="text-xs font-bold text-indigo-400 font-mono tracking-widest uppercase block">✦ HIGH DENSITY EXPORT</span>
        <h2 className="text-3xl font-black text-white tracking-tight leading-none uppercase">ALLROUNDERIMG OPTIMIZER</h2>
        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
          Instantly compress, scale, format, and filter images locally. Reduces file space sizes securely inside your sandbox environment before distribution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-left">
        {/* Parameters console */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <h3 className="font-extrabold text-white text-xs font-mono tracking-wider uppercase border-b border-white/5 pb-2 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" /> Image Parameter Controls
          </h3>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Export Quality Target</label>
                <span className="font-mono text-indigo-400 font-bold">{quality}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={e => {
                  setQuality(parseInt(e.target.value, 10));
                  resetResult();
                }}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 font-mono">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Format Target</label>
                <select
                  value={format}
                  onChange={e => {
                    setFormat(e.target.value as any);
                    resetResult();
                  }}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-white/15 rounded-lg text-xs text-white focus:outline-none"
                >
                  <option value="keep">Keep Original Format</option>
                  <option value="jpeg">Convert to JPG/JPEG</option>
                  <option value="png">Convert to PNG</option>
                  <option value="webp">Convert to WEBP </option>
                </select>
              </div>

              <div className="space-y-1.5 font-mono">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Resize Width Target</label>
                <select
                  value={sizePreset}
                  onChange={e => {
                    setSizePreset(e.target.value as any);
                    resetResult();
                  }}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-white/15 rounded-lg text-xs text-white focus:outline-none"
                >
                  <option value="original">Original Dimensions (100%)</option>
                  <option value="1920">Full HD (Width 1920px max)</option>
                  <option value="1280">HD (Width 1280px max)</option>
                  <option value="800">Standard Web (Width 800px max)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Apply Dynamic Visual Filter Layer</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'none', label: 'No Filter' },
                  { id: 'grayscale', label: 'Grayscale' },
                  { id: 'contrast', label: 'Contrast' },
                  { id: 'invert', label: 'Invert' }
                ].map(flt => (
                  <button
                    key={flt.id}
                    type="button"
                    onClick={() => {
                      setFilter(flt.id as any);
                      resetResult();
                    }}
                    className={`p-2 rounded-xl border text-center transition cursor-pointer select-none text-[10px] font-mono font-bold leading-tight ${
                      filter === flt.id 
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm' 
                        : 'bg-slate-950/40 border-white/5 hover:border-white/12 text-slate-400'
                    }`}
                  >
                    {flt.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={processImageFile}
              disabled={!file || processing}
              className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-800 text-white font-mono font-bold text-xs uppercase rounded-xl transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-55 border border-indigo-500/20 cursor-pointer text-center flex items-center justify-center gap-1.5"
            >
              {processing ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" /> Aligning parameters...
                </>
              ) : (
                <>
                  <Target className="w-4 h-4" /> Compress & Process Image
                </>
              )}
            </button>
          </div>
        </div>

        {/* Action Panel / Drops */}
        <div className="space-y-4">
          <div 
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`p-6 rounded-2xl border-2 border-dashed flex flex-col justify-center items-center min-h-[220px] transition text-center ${
              dragActive 
                ? 'border-indigo-500 bg-indigo-500/10' 
                : file 
                  ? 'border-emerald-500/40 bg-emerald-500/5' 
                  : 'border-white/10 hover:border-white/20 bg-slate-950/20'
            }`}
          >
            {!file && (
              <div className="space-y-4">
                <ImageIcon className="w-10 h-10 text-slate-600 mx-auto" />
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono">Load Target Pixel Source</h4>
                  <p className="text-[11px] text-slate-500 leading-normal max-w-xs mx-auto">
                    Drag and drop your image file here to begin real-time compilation modifications locally.
                  </p>
                </div>
                <label className="inline-block px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-mono text-xs rounded-xl transition cursor-pointer select-none">
                  Select Image
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            )}

            {file && !processing && !resultUrl && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto text-xs font-black">
                    IMG
                  </div>
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono truncate max-w-sm mx-auto">{file.name}</h4>
                  <p className="text-[10px] text-slate-500">{(file.size / 1024).toFixed(1)} KB &bull; Image Stream Buffered</p>
                </div>

                <div className="flex gap-3 justify-center">
                  <button
                    type="button"
                    onClick={processImageFile}
                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-650 text-slate-950 font-bold font-mono text-xs uppercase rounded-xl transition active:scale-95 shadow-md flex items-center gap-1 cursor-pointer"
                  >
                    Process Pixels
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      resetResult();
                    }}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-400 font-mono text-xs rounded-xl transition cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            {processing && (
              <div className="space-y-3.5">
                <RotateCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono">Draining Pixel Buffer Matrices</h4>
                  <p className="text-[11px] text-slate-500 font-mono">Compiling filters in HTML Canvas local memory...</p>
                </div>
              </div>
            )}

            {!processing && resultUrl && (
              <div className="space-y-4 animate-fade-in">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <div className="space-y-1 pb-1">
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded tracking-wide uppercase font-bold">OPTIMIZATION OK</span>
                  <h4 className="font-bold text-white text-xs font-mono">{resultName}</h4>
                  <p className="text-[10px] text-slate-400">
                    File: {(resultSize / 1024).toFixed(1)} KB 
                    {resultSize < file!.size ? (
                      <span className="text-emerald-400 font-bold ml-1.5">
                        Saved: {(((file!.size - resultSize) / file!.size) * 100).toFixed(0)}%
                      </span>
                    ) : (
                      <span className="text-slate-500 ml-1.5">Filtered parameters loaded</span>
                    )}
                  </p>
                </div>

                <div className="flex gap-3 justify-center">
                  <button
                    type="button"
                    onClick={downloadImageResult}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-mono font-bold text-xs uppercase rounded-xl transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <FileDown className="w-4 h-4" /> Download Image file
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      resetResult();
                    }}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-350 font-mono text-xs rounded-xl transition active:scale-95 cursor-pointer"
                  >
                    Optimize Another
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/15 space-y-1.5 text-xs text-slate-350 font-mono">
            <div className="flex items-center gap-1.5 font-bold text-[9px] text-indigo-400 uppercase">
              <LayoutGrid className="w-3.5 h-3.5" /> High-DPI Downstream Rasterizing
            </div>
            <p className="text-[10.5px] leading-relaxed">
              Export systems match exact high-DPI width metrics on modern layouts. Processing canvas sizes is memory-throttled natively, protecting your client runtime against hardware thread lock.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
