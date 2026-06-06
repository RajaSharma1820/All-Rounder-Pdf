import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { FileUp, Trash2, Sparkles, Check, Download, AlertCircle, FileText, Hash, Layers } from 'lucide-react';
import { PDFFile } from '../types';
import { formatBytes, generateMockPDF, getPdfInfo, logProcessedFile } from '../utils/pdfHelpers';

export default function NumberingTool() {
  const [file, setFile] = useState<PDFFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [successFile, setSuccessFile] = useState<{ url: string; name: string; size: number } | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Styling Configs
  const [format, setFormat] = useState<'standard' | 'simple' | 'bracket'>('standard');
  const [position, setPosition] = useState<'bottom-right' | 'bottom-center' | 'top-center'>('bottom-right');
  const [startOffset, setStartOffset] = useState(1);
  const [fontSize, setFontSize] = useState(11);
  const [textColor, setTextColor] = useState<'black' | 'gray' | 'blue'>('gray');

  const colorMap = {
    black: rgb(0.1, 0.1, 0.1),
    gray: rgb(0.45, 0.45, 0.45),
    blue: rgb(0.15, 0.45, 0.85)
  };

  const processFile = async (f: File) => {
    setError(null);
    setSuccessFile(null);

    const isPdfValue = f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf');
    if (!isPdfValue) {
      setError(`"${f.name}" is not a valid PDF file. Only PDF files are supported.`);
      return;
    }

    try {
      const info = await getPdfInfo(f);
      setFile({
        id: Math.random().toString(36).substring(2, 9),
        name: f.name,
        size: f.size,
        file: f,
        totalPages: info.pageCount
      });
    } catch {
      setError('Failed to process uploaded file.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    await processFile(e.target.files[0]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleGenerateSample = async () => {
    setError(null);
    setSuccessFile(null);
    try {
      const sampleFile = await generateMockPDF('Technical Specification Draft', 6);
      const info = await getPdfInfo(sampleFile);
      setFile({
        id: Math.random().toString(36).substring(2, 9),
        name: sampleFile.name,
        size: sampleFile.size,
        file: sampleFile,
        totalPages: info.pageCount
      });
    } catch {
      setError('Failed to load sandbox document.');
    }
  };

  const stampPageNumbers = async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);
    setSuccessFile(null);

    try {
      const fileBuffer = await file.file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBuffer);
      const standardFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();
      const totalPages = pages.length;

      const activeColor = colorMap[textColor];

      pages.forEach((page, idx) => {
        const { width, height } = page.getSize();
        const displayPageNum = idx + startOffset;

        // Generate stylized text depending on the configuration format
        let textPhrase = '';
        if (format === 'standard') {
          textPhrase = `Page ${displayPageNum} of ${totalPages}`;
        } else if (format === 'simple') {
          textPhrase = `${displayPageNum} / ${totalPages}`;
        } else {
          textPhrase = `—  ${displayPageNum}  —`;
        }

        // Compute coordinate mapping depending on position presets
        let textX = 40;
        let textY = 40;

        const textWidth = textPhrase.length * fontSize * 0.55;

        if (position === 'bottom-right') {
          textX = width - textWidth - 45;
          textY = 40;
        } else if (position === 'bottom-center') {
          textX = (width / 2) - (textWidth / 2);
          textY = 40;
        } else if (position === 'top-center') {
          textX = (width / 2) - (textWidth / 2);
          textY = height - 45;
        }

        page.drawText(textPhrase, {
          x: textX,
          y: textY,
          size: fontSize,
          font: standardFont,
          color: activeColor,
        });
      });

      const numberedBytes = await pdfDoc.save();
      const blob = new Blob([numberedBytes], { type: 'application/pdf' });
      const sizeBytes = blob.size;
      const downloadUrl = URL.createObjectURL(blob);
      const outputName = `${file.name.replace('.pdf', '')}_numbered.pdf`;

      setSuccessFile({
        url: downloadUrl,
        name: outputName,
        size: sizeBytes
      });
      logProcessedFile(outputName, 'Page Number PDF', sizeBytes);
    } catch (err) {
      console.error(err);
      setError('Internal error applying page numbers. Ensure the PDF is not encrypted.');
    } finally {
      setProcessing(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
    setSuccessFile(null);
  };

  return (
    <div id="numbering-tool-workspace" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-5">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight flex items-center gap-2">
            Automated Page Numbering
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Instantly format document margins and append clean sequential indices on load.
          </p>
        </div>
        {!file && (
          <button
            id="btn-gen-sample-num"
            type="button"
            onClick={handleGenerateSample}
            className="text-xs font-semibold px-4 py-2 border border-blue-200 text-blue-600 bg-blue-50/50 rounded-xl hover:bg-blue-50 hover:scale-[1.02] cursor-pointer transition-all duration-200 flex items-center gap-1.5 shadow-sm mt-4 md:mt-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            + Load 6-Page Specification
          </button>
        )}
      </div>

      {error && (
        <div id="numbering-error-alert" className="p-4 bg-red-50 text-red-700 border border-red-100 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Upload Zone */}
      {!file && (
        <label 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center border-2 border-dashed min-h-[300px] rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 shadow-sm relative group ${
            dragActive 
              ? 'border-sky-500 bg-sky-50/20 shadow-inner' 
              : 'border-gray-300 hover:border-sky-500 bg-gray-50/50 hover:bg-sky-50/10'
          }`}
        >
          <div className="p-4 bg-white rounded-2xl shadow-md border border-gray-100 mb-4 transition-transform group-hover:scale-110">
            <Hash className={`w-10 h-10 text-sky-500 ${dragActive ? 'animate-bounce' : ''}`} />
          </div>
          <span className="text-lg font-semibold text-gray-800">
            {dragActive ? 'Drop your PDF here!' : 'Upload PDF for Numbering'}
          </span>
          <span className="text-xs text-gray-400 mt-1 max-w-sm">
            Quickly append standardized header/footer counters. Local computation guarantees 100% security.
          </span>
          <div className="mt-5">
            <span className="inline-block text-sm font-medium px-5 py-2.5 bg-sky-600 text-white rounded-xl shadow-lg shadow-sky-500/20 hover:bg-sky-700 transition duration-150">
              Browse Files
            </span>
          </div>
          <input
            id="numbering-upload-input"
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      )}

      {file && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Setup controllers (1 col) */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm text-left space-y-6">
              <h3 className="text-sm font-bold text-gray-800 border-b pb-3 flex items-center gap-1.5">
                <Hash className="w-4 h-4 text-sky-500" /> Index Formatter Settings
              </h3>

              {/* Number format selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500">Phrase Format Style</label>
                <div className="grid grid-cols-1 gap-2">
                  {(['standard', 'simple', 'bracket'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      id={`btn-fmt-${fmt}`}
                      type="button"
                      onClick={() => setFormat(fmt)}
                      className={`text-xs p-3 font-semibold border-2 rounded-xl transition cursor-pointer text-left ${
                        format === fmt
                          ? 'border-sky-600 bg-sky-50/20 text-sky-800 font-semibold'
                          : 'border-gray-150 bg-white hover:bg-gray-50 text-gray-500'
                      }`}
                    >
                      {fmt === 'standard' && 'Standard Summary — Page X of Y'}
                      {fmt === 'simple' && 'Simple Slit — X / Y'}
                      {fmt === 'bracket' && 'Executive Brackets — — X —'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Position alignment select option */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500">Alignment Margin Placement</label>
                <select
                  id="num-pos-select"
                  value={position}
                  onChange={(e) => setPosition(e.target.value as any)}
                  className="w-full text-xs font-bold p-3 bg-gray-50 hover:bg-gray-100/50 border border-gray-150 rounded-xl outline-none select-none"
                >
                  <option value="bottom-right">Bottom Footer Right</option>
                  <option value="bottom-center">Bottom Footer Center</option>
                  <option value="top-center">Top Header Center</option>
                </select>
              </div>

              {/* Incremental Offset */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 flex justify-between">
                  <span>Numeric Start Offset</span>
                  <span className="font-mono text-sky-600 font-bold bg-sky-50 px-1.5 py-0.5 rounded-md border border-sky-100">{startOffset}</span>
                </label>
                <input
                  id="num-offset-slider"
                  type="range"
                  min="1"
                  max="50"
                  value={startOffset}
                  onChange={(e) => setStartOffset(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
              </div>

              {/* FontSize */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 flex justify-between">
                  <span>Font Size</span>
                  <span className="font-mono text-sky-600 font-bold bg-sky-50 px-1.5 py-0.5 rounded-md border border-sky-100">{fontSize}pt</span>
                </label>
                <input
                  id="num-size-slider"
                  type="range"
                  min="8"
                  max="18"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
              </div>

              {/* Color preset selector options */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500">Font Contrast Color</label>
                <div className="flex items-center gap-3">
                  {(['black', 'gray', 'blue'] as const).map((color) => (
                    <button
                      key={color}
                      id={`btn-numcolor-${color}`}
                      type="button"
                      onClick={() => setTextColor(color)}
                      className={`text-xs px-3 py-2 border-2 rounded-xl font-bold cursor-pointer transition ${
                        textColor === color
                          ? 'border-sky-600 bg-sky-50 text-sky-700'
                          : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-500'
                      }`}
                    >
                      {color === 'black' && 'Deep Ink'}
                      {color === 'gray' && 'Slate Dust'}
                      {color === 'blue' && 'Prussian Blue'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="btn-trigger-numbering"
                  type="button"
                  disabled={processing}
                  onClick={stampPageNumbers}
                  className="w-full font-bold px-6 py-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none transition duration-150 cursor-pointer shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2"
                >
                  {processing ? (
                    'Processing Document...'
                  ) : (
                    'Add Page Numbers'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Simulated Page Card (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500">Live Placement Preview Simulation</span>
              <button
                id="btn-remove-num-file"
                type="button"
                className="text-xs text-gray-400 hover:text-red-500 transition flex items-center gap-1 cursor-pointer"
                onClick={clearFile}
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear File
              </button>
            </div>

            <div className="border border-gray-150 rounded-3xl p-6 bg-gray-50 flex items-center justify-center min-h-[440px] relative overflow-hidden select-none">
              <div 
                id="num-preview-sheet"
                className="w-72 h-96 bg-white border border-gray-200 rounded-xl shadow-lg relative flex flex-col justify-between p-6 overflow-hidden text-left bg-dot-grid"
                style={{ contentVisibility: 'auto' }}
              >
                {/* Header preview container */}
                <div className="min-h-5 flex justify-center items-center">
                  {position === 'top-center' && (
                    <span
                      style={{ fontSize: `${fontSize}px` }}
                      className={`font-semibold tracking-wider ${
                        textColor === 'black' ? 'text-gray-900' : textColor === 'blue' ? 'text-blue-600' : 'text-gray-400'
                      }`}
                    >
                      {format === 'standard' && `Page ${startOffset} of ${file.totalPages}`}
                      {format === 'simple' && `${startOffset} / ${file.totalPages}`}
                      {format === 'bracket' && `—  ${startOffset}  —`}
                    </span>
                  )}
                </div>

                {/* Dummy lines */}
                <div className="space-y-3 opacity-20">
                  <div className="h-4 w-40 bg-gray-300 rounded" />
                  <div className="h-2 w-full bg-gray-200 rounded" />
                  <div className="h-2 w-full bg-gray-200 rounded" />
                  <div className="h-2 w-full bg-gray-200 rounded" />
                  <div className="h-2 w-4/5 bg-gray-200 rounded" />
                </div>

                {/* Footer preview container */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="h-2 w-28 bg-gray-100 rounded" />

                  {position === 'bottom-center' && (
                    <span
                      style={{ fontSize: `${fontSize}px` }}
                      className={`font-semibold tracking-wider font-mono select-none pointer-events-none absolute bottom-4 left-0 right-0 text-center`}
                    >
                      {format === 'standard' && `Page ${startOffset} of ${file.totalPages}`}
                      {format === 'simple' && `${startOffset} / ${file.totalPages}`}
                      {format === 'bracket' && `—  ${startOffset}  —`}
                    </span>
                  )}

                  {position === 'bottom-right' && (
                    <span
                      style={{ fontSize: `${fontSize}px` }}
                      className={`font-semibold tracking-wider font-mono select-none pointer-events-none text-right`}
                    >
                      {format === 'standard' && `Page ${startOffset} of ${file.totalPages}`}
                      {format === 'simple' && `${startOffset} / ${file.totalPages}`}
                      {format === 'bracket' && `—  ${startOffset}  —`}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal / Action Banner */}
      <AnimatePresence>
        {successFile && (
          <motion.div
            id="numbering-success-banner"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 border border-green-200 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-lg shadow-green-500/5 mt-6"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-500 text-white rounded-2xl shadow-md">
                <Check className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="text-lg font-bold text-green-800">Page Numbers Stamped!</h4>
                <p className="text-sm text-green-600 mt-1">
                  Sequential dynamic numbering has been processed across all pages (<span className="font-semibold">{successFile.name}</span>, {formatBytes(successFile.size)}).
                </p>
              </div>
            </div>
            <a
              id="lnk-download-numbered"
              href={successFile.url}
              download={successFile.name}
              className="py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:scale-105 active:scale-[0.98] transition shadow-md shadow-green-600/10 shrink-0"
            >
              <Download className="w-4 h-4 animate-bounce" /> Download Document
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
