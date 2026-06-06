import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import { FileUp, Trash2, Sparkles, Check, Download, AlertCircle, FileText, Type, Sliders, Palette, LayoutGrid } from 'lucide-react';
import { PDFFile } from '../types';
import { formatBytes, generateMockPDF, getPdfInfo, logProcessedFile } from '../utils/pdfHelpers';

export default function WatermarkTool() {
  const [file, setFile] = useState<PDFFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [successFile, setSuccessFile] = useState<{ url: string; name: string; size: number } | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Watermark parameters
  const [text, setText] = useState('CONFIDENTIAL');
  const [colorPreset, setColorPreset] = useState<'red' | 'gray' | 'blue' | 'green'>('red');
  const [opacity, setOpacity] = useState(0.25);
  const [size, setSize] = useState(50);
  const [angle, setAngle] = useState(45);
  const [position, setPosition] = useState<'center' | 'top' | 'bottom' | 'tiles'>('center');

  const colorMap = {
    red: { r: 0.85, g: 0.15, b: 0.15, hex: '#dc2626' },
    gray: { r: 0.45, g: 0.45, b: 0.45, hex: '#4b5563' },
    blue: { r: 0.15, g: 0.45, b: 0.85, hex: '#2563eb' },
    green: { r: 0.15, g: 0.65, b: 0.35, hex: '#16a34a' }
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
      setError('Failed to process loaded PDF.');
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
      const sampleFile = await generateMockPDF('Confidential Audit Draft', 3);
      const info = await getPdfInfo(sampleFile);
      setFile({
        id: Math.random().toString(36).substring(2, 9),
        name: sampleFile.name,
        size: sampleFile.size,
        file: sampleFile,
        totalPages: info.pageCount
      });
    } catch {
      setError('Error generating test document.');
    }
  };

  const applyWatermarkText = async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);
    setSuccessFile(null);

    try {
      const fileBuffer = await file.file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBuffer);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();

      const activeColor = colorMap[colorPreset];

      for (const page of pages) {
        const { width, height } = page.getSize();

        if (position === 'center') {
          // Standard center diagonal placement
          page.drawText(text, {
            x: width / 2 - (text.length * size * 0.28),
            y: height / 2 - size / 4,
            size: size,
            font: helveticaFont,
            color: rgb(activeColor.r, activeColor.g, activeColor.b),
            rotate: degrees(angle),
            opacity: opacity,
          });
        } else if (position === 'top') {
          // Absolute top-center header
          page.drawText(text, {
            x: width / 2 - (text.length * (size * 0.5) * 0.28),
            y: height - 60,
            size: size * 0.5,
            font: helveticaFont,
            color: rgb(activeColor.r, activeColor.g, activeColor.b),
            rotate: degrees(0),
            opacity: opacity,
          });
        } else if (position === 'bottom') {
          // Absolute bottom-center footer
          page.drawText(text, {
            x: width / 2 - (text.length * (size * 0.5) * 0.28),
            y: 40,
            size: size * 0.5,
            font: helveticaFont,
            color: rgb(activeColor.r, activeColor.g, activeColor.b),
            rotate: degrees(0),
            opacity: opacity,
          });
        } else if (position === 'tiles') {
          // Multi-layer tiled repeats
          const cols = 3;
          const rows = 4;
          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              page.drawText(text, {
                x: (width / cols) * c + 50,
                y: (height / rows) * r + 80,
                size: size * 0.5,
                font: helveticaFont,
                color: rgb(activeColor.r, activeColor.g, activeColor.b),
                rotate: degrees(angle),
                opacity: opacity * 0.7, // softer opacity for tiles
              });
            }
          }
        }
      }

      const watermarkedPdfBytes = await pdfDoc.save();
      const blob = new Blob([watermarkedPdfBytes], { type: 'application/pdf' });
      const sizeBytes = blob.size;
      const downloadUrl = URL.createObjectURL(blob);
      const outputName = `${file.name.replace('.pdf', '')}_watermarked.pdf`;

      setSuccessFile({
        url: downloadUrl,
        name: outputName,
        size: sizeBytes
      });
      logProcessedFile(outputName, 'Watermark PDF', sizeBytes);
    } catch (err) {
      console.error(err);
      setError('An error occurred during watermarking. Ensure the file is not secured.');
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
    <div id="watermark-tool-workspace" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-5">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight flex items-center gap-2">
            Interactive PDF Watermark
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Apply copyright statements, security clearances, or draft warnings to all pages with live preview.
          </p>
        </div>
        {!file && (
          <button
            id="btn-gen-sample-wm"
            type="button"
            onClick={handleGenerateSample}
            className="text-xs font-semibold px-4 py-2 border border-blue-200 text-blue-600 bg-blue-50/50 rounded-xl hover:bg-blue-50 hover:scale-[1.02] cursor-pointer transition-all duration-200 flex items-center gap-1.5 shadow-sm mt-4 md:mt-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            + Load 3-Page Audit Draft
          </button>
        )}
      </div>

      {error && (
        <div id="watermark-error-alert" className="p-4 bg-red-50 text-red-700 border border-red-100 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Upload Box */}
      {!file && (
        <label 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center border-2 border-dashed min-h-[300px] rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 shadow-sm relative group ${
            dragActive 
              ? 'border-emerald-500 bg-emerald-50/20 shadow-inner' 
              : 'border-gray-300 hover:border-emerald-500 bg-gray-50/50 hover:bg-emerald-50/10'
          }`}
        >
          <div className="p-4 bg-white rounded-2xl shadow-md border border-gray-100 mb-4 transition-transform group-hover:scale-110">
            <Type className={`w-10 h-10 text-emerald-500 ${dragActive ? 'animate-bounce' : ''}`} />
          </div>
          <span className="text-lg font-semibold text-gray-800">
            {dragActive ? 'Drop your PDF here!' : 'Upload PDF for Watermarking'}
          </span>
          <span className="text-xs text-gray-400 mt-1 max-w-sm">
            Compatible with A4/US-letter layouts. Apply customized structural watermarks in seconds.
          </span>
          <div className="mt-5">
            <span className="inline-block text-sm font-medium px-5 py-2.5 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition duration-150">
              Browse Document
            </span>
          </div>
          <input
            id="watermark-upload-input"
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      )}

      {file && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left panel: Live design sliders (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm text-left space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <span className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-emerald-500" /> Style Parameters
                </span>
                <span className="text-xs text-gray-400 font-semibold">{file.totalPages} Pages</span>
              </div>

              {/* Text Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                  Watermark Label
                </label>
                <div className="relative">
                  <input
                    id="wm-text-input"
                    type="text"
                    maxLength={32}
                    value={text}
                    onChange={(e) => setText(e.target.value.toUpperCase())}
                    className="w-full pl-3 pr-10 py-3 bg-gray-50 hover:bg-gray-100/50 focus:bg-white text-sm font-bold border border-gray-150 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 rounded-xl transition outline-none"
                    placeholder="CONFIDENTIAL"
                  />
                  <Type className="absolute right-3 top-3.5 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Colors preset list */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5" /> Stamp Color Palette
                </label>
                <div className="flex items-center gap-4">
                  {(['red', 'gray', 'blue', 'green'] as const).map((color) => (
                    <button
                      key={color}
                      id={`btn-color-${color}`}
                      type="button"
                      onClick={() => setColorPreset(color)}
                      className={`h-9 w-9 rounded-full flex items-center justify-center border-2 transition cursor-pointer ${
                        colorPreset === color ? 'border-gray-900 scale-110 shadow-sm' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: colorMap[color].hex }}
                    >
                      {colorPreset === color && (
                        <Check className="w-4 h-4 text-white stroke-[3.5]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Position templates slider buttons */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                  <LayoutGrid className="w-3.5 h-3.5" /> Stamp Mapping Pattern
                </label>
                <div className="grid grid-cols-2 gap-2 text-left">
                  {(['center', 'top', 'bottom', 'tiles'] as const).map((pos) => (
                    <button
                      key={pos}
                      id={`btn-pos-${pos}`}
                      type="button"
                      onClick={() => {
                        setPosition(pos);
                        if (pos === 'top' || pos === 'bottom') setAngle(0);
                        else if (pos === 'center') setAngle(45);
                      }}
                      className={`text-xs p-2.5 font-bold border-2 rounded-xl transition cursor-pointer text-left ${
                        position === pos
                          ? 'border-emerald-600 bg-emerald-50/20 text-emerald-800 font-semibold'
                          : 'border-gray-150 bg-white hover:bg-gray-50 text-gray-500'
                      }`}
                    >
                      {pos === 'center' && 'Diagonal Center'}
                      {pos === 'top' && 'Top Header'}
                      {pos === 'bottom' && 'Bottom Footer'}
                      {pos === 'tiles' && 'Tiled Grid repeats'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Opacity level slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                  <span>Transparency / Opacity</span>
                  <span className="font-mono text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md">
                    {Math.round(opacity * 100)}%
                  </span>
                </div>
                <input
                  id="wm-opacity-slider"
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              {/* Font Sizing Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                  <span>Stamp Font Size</span>
                  <span className="font-mono text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md">
                    {size}pt
                  </span>
                </div>
                <input
                  id="wm-size-slider"
                  type="range"
                  min="16"
                  max="110"
                  step="2"
                  value={size}
                  onChange={(e) => setSize(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              {/* Angle rotation Slider */}
              {position !== 'top' && position !== 'bottom' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                    <span>Stamp Rotation Angle</span>
                    <span className="font-mono text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md">
                      {angle}°
                    </span>
                  </div>
                  <input
                    id="wm-angle-slider"
                    type="range"
                    min="-90"
                    max="90"
                    step="5"
                    value={angle}
                    onChange={(e) => setAngle(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                </div>
              )}

              {/* Trigger Stamp Actions */}
              <div className="pt-2">
                <button
                  id="btn-trigger-stamp"
                  type="button"
                  disabled={processing}
                  onClick={applyWatermarkText}
                  className="w-full font-bold px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none transition duration-150 cursor-pointer shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Applying Watermark...
                    </>
                  ) : (
                    'Add Watermark to All Pages'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right panel: Live Page mock preview (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-start space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500">
                Interactive Mock Simulator (Simulated Page 1 Representation)
              </span>
              <button
                id="btn-remove-wm-file"
                type="button"
                className="text-xs text-gray-400 hover:text-red-500 transition flex items-center gap-1 cursor-pointer"
                onClick={clearFile}
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove file
              </button>
            </div>

            {/* Simulated Live Sheet container */}
            <div className="border border-gray-150 rounded-3xl p-6 bg-gray-50 flex items-center justify-center min-h-[460px] relative overflow-hidden select-none">
              <div 
                id="wm-preview-sheet"
                className="w-72 h-96 bg-white border border-gray-200 rounded-xl shadow-lg relative flex flex-col justify-between p-6 overflow-hidden bg-dot-grid"
                style={{ contentVisibility: 'auto' }}
              >
                {/* Simulated Text content paragraphs */}
                <div className="space-y-4 z-0 opacity-20 text-left">
                  <div className="h-4 w-32 bg-gray-300 rounded" />
                  <div className="h-2 w-full bg-gray-200 rounded" />
                  <div className="h-2 w-full bg-gray-200 rounded" />
                  <div className="h-2 w-4/5 bg-gray-200 rounded" />

                  <div className="h-4 w-20 bg-gray-300 rounded" />
                  <div className="h-2 w-full bg-gray-200 rounded" />
                  <div className="h-2 w-11/12 bg-gray-200 rounded" />
                </div>

                {/* Live Watermark Overlay Stamping */}
                {position === 'center' && (
                  <div
                    style={{
                      transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                      opacity: opacity,
                      fontSize: `${size * 0.5}px`,
                      color: colorMap[colorPreset].hex
                    }}
                    className="absolute top-1/2 left-1/2 font-extrabold tracking-wider text-center select-none pointer-events-none whitespace-nowrap z-10"
                  >
                    {text || 'DRAFT'}
                  </div>
                )}

                {position === 'top' && (
                  <div
                    style={{
                      opacity: opacity,
                      fontSize: `${size * 0.28}px`,
                      color: colorMap[colorPreset].hex
                    }}
                    className="absolute top-4 left-0 right-0 font-extrabold tracking-wider text-center select-none pointer-events-none z-10"
                  >
                    {text || 'DRAFT'}
                  </div>
                )}

                {position === 'bottom' && (
                  <div
                    style={{
                      opacity: opacity,
                      fontSize: `${size * 0.28}px`,
                      color: colorMap[colorPreset].hex
                    }}
                    className="absolute bottom-4 left-0 right-0 font-extrabold tracking-wider text-center select-none pointer-events-none z-10"
                  >
                    {text || 'DRAFT'}
                  </div>
                )}

                {position === 'tiles' && (
                  <div className="absolute inset-0 grid grid-cols-2 grid-rows-3 p-4 pointer-events-none z-10 overflow-hidden">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        style={{
                          transform: `rotate(${angle}deg)`,
                          opacity: opacity * 0.6,
                          fontSize: `${size * 0.2}px`,
                          color: colorMap[colorPreset].hex
                        }}
                        className="flex items-center justify-center font-extrabold tracking-widest leading-none"
                      >
                        {text || 'DRAFT'}
                      </div>
                    ))}
                  </div>
                )}

                {/* Simulated footer elements */}
                <div className="flex justify-between items-center z-0 opacity-20 border-t pt-3">
                  <div className="h-2 w-24 bg-gray-200 rounded" />
                  <div className="h-2 w-8 bg-gray-200 rounded" />
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
            id="watermark-success-banner"
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
                <h4 className="text-lg font-bold text-green-800">Watermark Applied Successfully!</h4>
                <p className="text-sm text-green-600 mt-1">
                  Watermarks have been permanently stamped across every page layout (<span className="font-semibold">{successFile.name}</span>, {formatBytes(successFile.size)}).
                </p>
              </div>
            </div>
            <a
              id="lnk-download-watermarked"
              href={successFile.url}
              download={successFile.name}
              className="py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:scale-105 active:scale-[0.98] transition shadow-md shadow-green-600/10 shrink-0"
            >
              <Download className="w-4 h-4 animate-bounce" /> Download Watermarked PDF
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
