import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PDFDocument, degrees } from 'pdf-lib';
import { FileUp, Trash2, Sparkles, Check, Download, AlertCircle, FileText, RotateCw, RefreshCw, Layers } from 'lucide-react';
import { PDFFile } from '../types';
import { formatBytes, generateMockPDF, getPdfInfo } from '../utils/pdfHelpers';

interface PageRotateConfig {
  pageIndex: number;
  angle: number; // 0, 90, 180, 270
}

export default function RotateTool() {
  const [file, setFile] = useState<PDFFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [successFile, setSuccessFile] = useState<{ url: string; name: string; size: number } | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Tracks custom rotation angles for each individual page
  const [rotations, setRotations] = useState<PageRotateConfig[]>([]);

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

      // Initialize all page rotations with 0 degrees
      const pageConfigs: PageRotateConfig[] = Array.from({ length: info.pageCount }).map((_, i) => ({
        pageIndex: i,
        angle: 0
      }));
      setRotations(pageConfigs);
    } catch {
      setError('Failed to process custom PDF file.');
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
      const sampleFile = await generateMockPDF('Monthly Board Review Memo', 4);
      const info = await getPdfInfo(sampleFile);
      setFile({
        id: Math.random().toString(36).substring(2, 9),
        name: sampleFile.name,
        size: sampleFile.size,
        file: sampleFile,
        totalPages: info.pageCount
      });

      const pageConfigs: PageRotateConfig[] = Array.from({ length: info.pageCount }).map((_, i) => ({
        pageIndex: i,
        angle: 0
      }));
      setRotations(pageConfigs);
    } catch {
      setError('Error generating sandbox test file.');
    }
  };

  const rotatePage = (pageIdx: number) => {
    setRotations(prev =>
      prev.map(item =>
        item.pageIndex === pageIdx
          ? { ...item, angle: (item.angle + 90) % 360 }
          : item
      )
    );
  };

  const rotateAllPages = (delta: number = 90) => {
    setRotations(prev =>
      prev.map(item => ({
        ...item,
        angle: (item.angle + delta) % 360
      }))
    );
  };

  const resetAllRotations = () => {
    setRotations(prev => prev.map(item => ({ ...item, angle: 0 })));
  };

  const executeRotation = async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);
    setSuccessFile(null);

    try {
      const fileBuffer = await file.file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBuffer);
      const pages = pdfDoc.getPages();

      rotations.forEach(item => {
        if (item.pageIndex < pages.length && item.angle !== 0) {
          const page = pages[item.pageIndex];
          const existingRotation = page.getRotation().angle;
          // Set cumulative rotation
          page.setRotation(degrees((existingRotation + item.angle) % 360));
        }
      });

      const rotatedPdfBytes = await pdfDoc.save();
      const blob = new Blob([rotatedPdfBytes], { type: 'application/pdf' });
      const size = blob.size;
      const downloadUrl = URL.createObjectURL(blob);
      const outputName = `${file.name.replace('.pdf', '')}_rotated.pdf`;

      setSuccessFile({
        url: downloadUrl,
        name: outputName,
        size
      });
    } catch (err) {
      console.error(err);
      setError('Failed to apply rotation. Make sure the document permits editing.');
    } finally {
      setProcessing(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
    setSuccessFile(null);
    setRotations([]);
  };

  return (
    <div id="rotate-tool-workspace" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-5">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight flex items-center gap-2">
            Rotate PDF Pages
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Perform 3D virtual page reorientations and save clockwise alignment states instantly.
          </p>
        </div>
        {!file && (
          <button
            id="btn-gen-sample-rotate"
            type="button"
            onClick={handleGenerateSample}
            className="text-xs font-semibold px-4 py-2 border border-blue-200 text-blue-600 bg-blue-50/50 rounded-xl hover:bg-blue-50 hover:scale-[1.02] cursor-pointer transition-all duration-200 flex items-center gap-1.5 shadow-sm mt-4 md:mt-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            + Load 4-Page Board Deck
          </button>
        )}
      </div>

      {error && (
        <div id="rotate-error-alert" className="p-4 bg-red-50 text-red-700 border border-red-100 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Upload zone */}
      {!file && (
        <label 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center border-2 border-dashed min-h-[300px] rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 shadow-sm relative group ${
            dragActive 
              ? 'border-amber-500 bg-amber-50/20 shadow-inner' 
              : 'border-gray-300 hover:border-amber-500 bg-gray-50/50 hover:bg-amber-50/10'
          }`}
        >
          <div className="p-4 bg-white rounded-2xl shadow-md border border-gray-100 mb-4 transition-transform group-hover:scale-110">
            <RefreshCw className={`w-10 h-10 text-amber-500 ${dragActive ? 'animate-bounce' : 'animate-spin'}`} style={{ animationDuration: '6s' }} />
          </div>
          <span className="text-lg font-semibold text-gray-800">
            {dragActive ? 'Drop your PDF here!' : 'Select PDF to Rotate'}
          </span>
          <span className="text-xs text-gray-400 mt-1 max-w-sm">
            Drag & drop files to rotate specific pages, individual indices, or align the whole PDF.
          </span>
          <div className="mt-5">
            <span className="inline-block text-sm font-medium px-5 py-2.5 bg-amber-600 text-white rounded-xl shadow-lg shadow-amber-500/20 hover:bg-amber-700 transition duration-150">
              Browse Files
            </span>
          </div>
          <input
            id="rotate-upload-input"
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      )}

      {file && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main workspace control container */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-5 border border-gray-150 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-50 text-red-500 rounded-xl">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-800 max-w-[200px] sm:max-w-xs truncation">
                    {file.name}
                  </p>
                  <p className="text-xs font-semibold text-gray-400 mt-0.5">
                    {formatBytes(file.size)} • {file.totalPages} Pages
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="btn-rotate-all-cw"
                  type="button"
                  onClick={() => rotateAllPages(90)}
                  className="text-xs font-bold px-3 py-2 bg-gray-50 border border-gray-150 hover:bg-gray-100 text-gray-700 rounded-xl transition cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  Rotate All (+90°)
                </button>
                <button
                  id="btn-rotate-reset"
                  type="button"
                  onClick={resetAllRotations}
                  className="text-xs font-bold px-3 py-2 bg-gray-50 border border-gray-150 hover:text-red-600 text-gray-500 rounded-xl transition cursor-pointer"
                >
                  Reset All
                </button>
                <button
                  id="btn-remove-rotate-file"
                  type="button"
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition duration-150 cursor-pointer"
                  onClick={clearFile}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Interactive Grid of Page Cards with 3D Rotate Animation */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-h-[420px] overflow-y-auto p-2 bg-gray-50/40 rounded-3xl border border-dashed border-gray-200">
              {rotations.map((item, idx) => (
                <div
                  key={idx}
                  id={`rotate-card-${idx}`}
                  className="bg-white p-4 border border-gray-150 hover:border-amber-400 rounded-2xl flex flex-col justify-between hover:shadow-lg transition-all duration-300 select-none cursor-pointer"
                >
                  <div className="flex items-center justify-between pb-3">
                    <span className="text-xs font-bold font-mono text-gray-400 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded-lg">
                      Page #{idx + 1}
                    </span>
                    <button
                      id={`btn-rotate-single-${idx}`}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        rotatePage(idx);
                      }}
                      className="p-1.5 bg-amber-50 hover:bg-amber-100/80 text-amber-600 rounded-lg cursor-pointer transition duration-150"
                      title="Rotate Page"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Curving 3D visual page representation */}
                  <div className="flex-1 py-8 flex items-center justify-center min-h-[140px]">
                    <div
                      style={{ transform: `rotate(${item.angle}deg)` }}
                      className="w-18 h-24 border border-gray-200 bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-md hover:shadow-lg flex flex-col items-center justify-center relative transition-transform duration-300"
                    >
                      {/* Compass/Top indicator */}
                      <span className="absolute top-1 text-[8px] tracking-widest text-amber-500 font-bold opacity-60">
                        TOP
                      </span>
                      {/* Lines mimicking physical PDF page layout */}
                      <div className="w-12 h-1.5 bg-gray-100 rounded-full mt-2" />
                      <div className="w-10 h-1 bg-gray-150 rounded-full mt-1.5" />
                      <div className="w-8 h-1 bg-gray-150 rounded-full mt-1.2" />

                      {/* Rotation badge angle representation inside */}
                      {item.angle > 0 && (
                        <span className="absolute bottom-1 bg-amber-600 text-white font-mono text-[8px] font-bold px-1 rounded">
                          +{item.angle}°
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 text-center">
                    <p className="text-xs font-bold text-gray-500">
                      Normal Mode
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Processor configuration panel */}
          <div className="bg-gradient-to-br from-gray-50 to-white hover:from-white hover:to-gray-50 border border-gray-150 rounded-3xl p-6 h-fit space-y-6 shadow-sm text-left">
            <h3 className="text-base font-bold text-gray-800">Rotation Engine</h3>

            <div className="space-y-4 text-sm divide-y divide-gray-100">
              <div className="flex justify-between py-1">
                <span className="text-gray-400">Total Pages</span>
                <span className="font-bold text-gray-700">{file.totalPages}</span>
              </div>
              <div className="flex justify-between pt-3">
                <span className="text-gray-400">Rotated Page Index</span>
                <span className="font-bold text-amber-600">
                  {rotations.filter(r => r.angle !== 0).length} Pages changed
                </span>
              </div>
              <div className="flex justify-between pt-3">
                <span className="text-gray-400">Saving Status</span>
                <span className="font-bold text-green-600 px-1.5 py-0.5 bg-green-50 border border-green-100 text-xs rounded-lg">
                  Local Vector
                </span>
              </div>
            </div>

            <button
              id="btn-trigger-rotate"
              type="button"
              disabled={processing}
              onClick={executeRotation}
              className="w-full font-bold px-6 py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none transition duration-150 cursor-pointer shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Aligning Layouts...
                </>
              ) : (
                <>
                  Apply Rotations
                  <span className="text-xs bg-amber-505 text-amber-100 rounded-lg px-2 py-0.5 font-medium ml-1">
                    Instant
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Success Modal / Action Banner */}
      <AnimatePresence>
        {successFile && (
          <motion.div
            id="rotate-success-banner"
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
                <h4 className="text-lg font-bold text-green-800">Rotated PDF Exported!</h4>
                <p className="text-sm text-green-600 mt-1">
                  All cumulative rotations have been saved directly to a new file (<span className="font-semibold">{successFile.name}</span>, {formatBytes(successFile.size)}).
                </p>
              </div>
            </div>
            <a
              id="lnk-download-rotated"
              href={successFile.url}
              download={successFile.name}
              className="py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:scale-105 active:scale-[0.98] transition shadow-md shadow-green-600/10 shrink-0"
            >
              <Download className="w-4 h-4 animate-bounce" /> Download Rotated PDF
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
