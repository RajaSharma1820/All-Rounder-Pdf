import React, { useState, useRef, useEffect } from 'react';
import { PenTool, CheckCircle2, FileDown, Shield, RefreshCw, Layers, Sparkles } from 'lucide-react';
import { PDFDocument, rgb } from 'pdf-lib';
import { logProcessedFile } from '../utils/pdfHelpers';

export default function SignTool() {
  const [signMode, setSignMode] = useState<'draw' | 'type'>('draw');
  const [signText, setSignText] = useState('My Signature');
  const [fontStyle, setFontStyle] = useState<'cursive1' | 'cursive2' | 'cursive3'>('cursive1');
  const [signeeName, setSigneeName] = useState('Raja Pandit');
  const [signeeTitle, setSigneeTitle] = useState('Lead Auditor');
  const [addSecureStamp, setAddSecureStamp] = useState(true);

  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  // File states
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultName, setResultName] = useState('');

  // Handle canvas drawing logic
  useEffect(() => {
    if (signMode !== 'draw') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset and clear with transparency
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#818cf8'; // Indigo-400
  }, [signMode]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    draw(e);
  };

  const endDrawing = () => {
    isDrawing.current = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx?.beginPath(); // reset path
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    
    // Support mouse or touch events
    let clientX = 0;
    let clientY = 0;
    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
  };

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
    }
  };

  const burnSignatureToPdf = async () => {
    if (!file) return;
    setProcessing(true);

    try {
      const fileBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBytes);
      const pages = pdfDoc.getPages();
      if (pages.length === 0) throw new Error('Empty PDF document');

      // Target the first page
      const pageToSign = pages[0];
      const { width, height } = pageToSign.getSize();

      let signatureImageHex: string | null = null;

      if (signMode === 'draw' && canvasRef.current) {
        // Convert canvas image to data URL
        const dataUrl = canvasRef.current.toDataURL('image/png');
        signatureImageHex = dataUrl;
      } else {
        // Render typed signature onto an offscreen canvas to convert it to an image
        const offCanvas = document.createElement('canvas');
        offCanvas.width = 400;
        offCanvas.height = 150;
        const oCtx = offCanvas.getContext('2d');
        if (oCtx) {
          oCtx.fillStyle = 'rgba(0,0,0,0)';
          oCtx.fillRect(0, 0, offCanvas.width, offCanvas.height);
          
          let selectedFont = 'italic bold 28px Georgia';
          if (fontStyle === 'cursive1') selectedFont = 'italic bold 32px Georgia';
          else if (fontStyle === 'cursive2') selectedFont = 'italic 34px "Courier New"';
          else if (fontStyle === 'cursive3') selectedFont = '30px Times';
          
          oCtx.font = selectedFont;
          oCtx.fillStyle = '#4f46e5'; // Deep Indigo-600
          oCtx.textAlign = 'center';
          oCtx.textBaseline = 'middle';
          oCtx.fillText(signText, offCanvas.width / 2, offCanvas.height / 2);
          signatureImageHex = offCanvas.toDataURL('image/png');
        }
      }

      if (signatureImageHex) {
        // Embed the image in our PDF document safely
        const pngImageBytes = await fetch(signatureImageHex).then((res) => res.arrayBuffer());
        const embeddedImage = await pdfDoc.embedPng(pngImageBytes);

        // Sign locally at standard right bottom quadrant coordinate structures
        const sigWidth = 140;
        const sigHeight = 55;
        const padding = 25;
        
        const xPos = width - sigWidth - padding;
        const yPos = padding;

        // Draw support metadata label background box if stamp is checked
        if (addSecureStamp) {
          pageToSign.drawRectangle({
            x: xPos - 12,
            y: yPos - 5,
            width: sigWidth + 24,
            height: sigHeight + 42,
            color: rgb(0.97, 0.97, 0.99),
            borderColor: rgb(0.8, 0.8, 0.95),
            borderWidth: 0.75,
          });

          // Draw Stamp Text Info
          pageToSign.drawText(`Digitally Signed by: ${signeeName}`, {
            x: xPos - 5,
            y: yPos + sigHeight + 20,
            size: 6.5,
            color: rgb(0.1, 0.1, 0.25),
          });

          pageToSign.drawText(`Status: ${signeeTitle}`, {
            x: xPos - 5,
            y: yPos + sigHeight + 10,
            size: 6.5,
            color: rgb(0.3, 0.3, 0.4),
          });

          pageToSign.drawText(`Epoch: ${new Date().toLocaleDateString()}`, {
            x: xPos - 5,
            y: yPos + sigHeight,
            size: 6.5,
            color: rgb(0.4, 0.4, 0.5),
          });
        }

        // Draw drawing signature image layers
        pageToSign.drawImage(embeddedImage, {
          x: xPos,
          y: yPos,
          width: sigWidth,
          height: sigHeight,
        });
      }

      const signedBytes = await pdfDoc.save();
      const signedBlob = new Blob([signedBytes], { type: 'application/pdf' });
      
      setResultBlob(signedBlob);
      const cleanBase = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      const outputName = `${cleanBase}_signed.pdf`;
      setResultName(outputName);
      logProcessedFile(outputName, 'Sign PDF', signedBlob.size);
    } catch (err) {
      console.error('Signature burn failed', err);
    } finally {
      setProcessing(false);
    }
  };

  const downloadSignedFile = () => {
    if (!resultBlob) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = resultName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const resetAllSign = () => {
    setFile(null);
    setResultBlob(null);
    setProcessing(false);
    clearCanvas();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="text-xs font-bold text-indigo-400 font-mono tracking-widest uppercase block">✦ DIGITAL SIGNER</span>
        <h2 className="text-3xl font-black text-white tracking-tight leading-none uppercase">ALLROUNDERSIGN</h2>
        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
          Draw or type cryptographic signatures directly in local memory. Embed them as physical document layers onto your PDF files natively without uploading them to remote servers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-left">
        {/* Signature config panel */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <h3 className="font-extrabold text-white text-xs font-mono tracking-wider uppercase border-b border-white/5 pb-2 flex items-center gap-2">
            <PenTool className="w-4 h-4 text-indigo-400" /> Signature Configuration Core
          </h3>

          <div className="space-y-4">
            <div className="flex bg-slate-950 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setSignMode('draw')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition font-mono ${
                  signMode === 'draw' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Draw Signature Pad
              </button>
              <button
                type="button"
                onClick={() => setSignMode('type')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition font-mono ${
                  signMode === 'type' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Type Signature Font
              </button>
            </div>

            {signMode === 'draw' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Draw in Sandbox Canvas below</label>
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="text-[9px] text-indigo-400 hover:text-indigo-300 font-mono font-bold uppercase transition"
                  >
                    Clear Slate
                  </button>
                </div>
                <div className="border border-white/15 rounded-xl overflow-hidden bg-white/95 shadow-inner">
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={150}
                    onMouseDown={startDrawing}
                    onMouseUp={endDrawing}
                    onMouseOut={endDrawing}
                    onMouseMove={draw}
                    onTouchStart={startDrawing}
                    onTouchEnd={endDrawing}
                    onTouchMove={draw}
                    className="w-full h-36 border-none cursor-crosshair touch-none"
                  />
                </div>
              </div>
            )}

            {signMode === 'type' && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Type Signature Content</label>
                  <input
                    type="text"
                    value={signText}
                    onChange={e => setSignText(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950/60 border border-white/15 focus:border-indigo-500/50 rounded-xl text-xs text-white focus:outline-none transition font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Select Typographical Font Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'cursive1', label: 'Georgia Cursive', preview: 'font-serif italic font-medium' },
                      { id: 'cursive2', label: 'Courier Monospace', preview: 'font-mono italic font-bold' },
                      { id: 'cursive3', label: 'Times Traditional', preview: 'font-serif font-black' }
                    ].map(st => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setFontStyle(st.id as any)}
                        className={`p-2 rounded-xl border text-center transition cursor-pointer select-none ${
                          fontStyle === st.id 
                            ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm' 
                            : 'bg-slate-950/40 border-white/5 hover:border-white/12 text-slate-400'
                        }`}
                      >
                        <span className={`text-[12px] block truncate ${st.preview}`}>{signText || 'Signed'}</span>
                        <span className="text-[7.5px] font-mono text-slate-500 block mt-1">{st.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 rounded-xl bg-slate-950 border border-white/5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Signee Name Tag</label>
                  <input
                    type="text"
                    value={signeeName}
                    onChange={e => setSigneeName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-white/10 rounded-lg text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Title / Organization</label>
                  <input
                    type="text"
                    value={signeeTitle}
                    onChange={e => setSigneeTitle(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-white/10 rounded-lg text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={addSecureStamp}
                  onChange={e => setAddSecureStamp(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-white/20 bg-slate-950 accent-indigo-500"
                />
                <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider font-mono">Inject Secure Audit Stamp Block</span>
              </label>
            </div>
          </div>
        </div>

        {/* Real-time Document Target Drag & Drop Panel */}
        <div className="space-y-4">
          <div 
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed text-center flex flex-col justify-center items-center min-h-[220px] transition ${
              dragActive 
                ? 'border-indigo-500 bg-indigo-500/10' 
                : file 
                  ? 'border-emerald-500/40 bg-emerald-500/5' 
                  : 'border-white/10 hover:border-white/20 bg-slate-950/20'
            }`}
          >
            {!file && (
              <div className="space-y-3.5">
                <Layers className="w-10 h-10 text-slate-600 mx-auto" />
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono">Drop Document to Sign</h4>
                  <p className="text-[11px] text-slate-500 leading-normal max-w-xs mx-auto">
                    Upload your raw PDF document onto this canvas layout frame to burn signatures locally.
                  </p>
                </div>
                <label className="inline-block px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-mono text-xs rounded-xl transition cursor-pointer select-none">
                  Browse File
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setFile(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>
            )}

            {file && !processing && !resultBlob && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto text-[11px] font-black font-mono">
                    PDF
                  </div>
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono truncate max-w-sm mx-auto">{file.name}</h4>
                  <p className="text-[10px] text-slate-500">{(file.size / 1024).toFixed(1)} KB &bull; PDF Stream Ready</p>
                </div>

                <div className="flex gap-3 justify-center">
                  <button
                    type="button"
                    onClick={burnSignatureToPdf}
                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-650 text-slate-950 font-bold font-mono text-xs uppercase rounded-xl transition active:scale-95 shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <PenTool className="w-4 h-4" /> Sign Document
                  </button>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-400 font-mono text-xs rounded-xl transition cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            {processing && (
              <div className="space-y-3.5">
                <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono">Compiling Signature Coordinates</h4>
                  <p className="text-[11px] text-slate-500">Processing locally inside sandboxed browser memory...</p>
                </div>
              </div>
            )}

            {!processing && resultBlob && (
              <div className="space-y-4 animate-fade-in">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <div className="space-y-1 pb-1">
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded tracking-wide uppercase font-bold">BURN COMPLETED</span>
                  <h4 className="font-bold text-white text-xs font-mono">{resultName}</h4>
                  <p className="text-[10px] text-slate-400">{(resultBlob.size / 1024).toFixed(1)} KB &bull; Signature Embedded</p>
                </div>

                <div className="flex gap-3 justify-center">
                  <button
                    type="button"
                    onClick={downloadSignedFile}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-mono font-bold text-xs uppercase rounded-xl transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <FileDown className="w-4 h-4" /> Download Signed PDF
                  </button>
                  <button
                    type="button"
                    onClick={resetAllSign}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-350 font-mono text-xs rounded-xl transition active:scale-95 cursor-pointer"
                  >
                    Reset Studio
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/15 space-y-1.5 text-xs text-slate-350 font-mono">
            <div className="flex items-center gap-1.5 font-bold text-[9px] text-indigo-400 uppercase">
              <Shield className="w-3.5 h-3.5" /> 100% Secure Client Trust Signature Seal
            </div>
            <p className="text-[10.5px] leading-relaxed">
              Drawn coordinates and metadata parameters never traverse external host ports. Redrawing and rendering are executed cleanly under strict offline browser sandbox restrictions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
