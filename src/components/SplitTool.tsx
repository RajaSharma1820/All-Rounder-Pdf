import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PDFDocument } from 'pdf-lib';
import { FileUp, Trash2, Sparkles, Check, Download, AlertCircle, FileText, CheckSquare, Plus, Minus, Layers } from 'lucide-react';
import { PDFFile } from '../types';
import { formatBytes, generateMockPDF, getPdfInfo } from '../utils/pdfHelpers';

export default function SplitTool() {
  const [file, setFile] = useState<PDFFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [successFiles, setSuccessFiles] = useState<{ url: string; name: string; size: number; pages: string }[]>([]);
  const [dragActive, setDragActive] = useState(false);

  // Split configurations
  const [splitMethod, setSplitMethod] = useState<'individual' | 'range'>('individual');
  const [selectedPages, setSelectedPages] = useState<number[]>([]); // 0-based page indices
  const [rangeStart, setRangeStart] = useState<number>(1);
  const [rangeEnd, setRangeEnd] = useState<number>(1);

  const processFile = async (f: File) => {
    setError(null);
    setSuccessFiles([]);

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
      // Default configurations
      setSelectedPages([0]); // Select first page by default
      setRangeStart(1);
      setRangeEnd(Math.min(info.pageCount, 2));
    } catch {
      setError('Fail to load uploaded PDF.');
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
    setSuccessFiles([]);
    try {
      const sampleFile = await generateMockPDF('Enterprise Standard Guidelines', 5);
      const info = await getPdfInfo(sampleFile);
      setFile({
        id: Math.random().toString(36).substring(2, 9),
        name: sampleFile.name,
        size: sampleFile.size,
        file: sampleFile,
        totalPages: info.pageCount
      });
      setSelectedPages([0, 1, 2]); // default selects first 3
      setRangeStart(1);
      setRangeEnd(3);
    } catch {
      setError('Could not generate sample file.');
    }
  };

  const togglePageSelection = (idx: number) => {
    setSelectedPages(prev =>
      prev.includes(idx) ? prev.filter(p => p !== idx) : [...prev, idx]
    );
  };

  const toggleSelectAll = () => {
    if (!file) return;
    const total = file.totalPages || 0;
    if (selectedPages.length === total) {
      setSelectedPages([]);
    } else {
      setSelectedPages([...Array(total).keys()]);
    }
  };

  const executeSplit = async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);
    setSuccessFiles([]);

    try {
      const fileBuffer = await file.file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBuffer);
      const totalDocsToCreate: { name: string; pages: number[]; desc: string }[] = [];

      if (splitMethod === 'individual') {
        if (selectedPages.length === 0) {
          setError('Please select at least one page to extract.');
          setProcessing(false);
          return;
        }
        // Extract selected pages as a single new PDF document
        const sortedPages = [...selectedPages].sort((a, b) => a - b);
        totalDocsToCreate.push({
          name: `${file.name.replace('.pdf', '')}_extracted.pdf`,
          pages: sortedPages,
          desc: `Pages: ${sortedPages.map(p => p + 1).join(', ')}`
        });
      } else {
        // Range based split
        const startIdx = rangeStart - 1;
        const endIdx = rangeEnd - 1;
        const totalPages = file.totalPages || 1;

        if (startIdx < 0 || endIdx >= totalPages || startIdx > endIdx) {
          setError(`Invalid range. Must be between 1 and ${totalPages}.`);
          setProcessing(false);
          return;
        }

        const rangePages: number[] = [];
        for (let i = startIdx; i <= endIdx; i++) {
          rangePages.push(i);
        }

        totalDocsToCreate.push({
          name: `${file.name.replace('.pdf', '')}_range_${rangeStart}_to_${rangeEnd}.pdf`,
          pages: rangePages,
          desc: `Range: Pages ${rangeStart} to ${rangeEnd}`
        });
      }

      const results = [];
      for (const spec of totalDocsToCreate) {
        const subPdf = await PDFDocument.create();
        const copiedPages = await subPdf.copyPages(pdfDoc, spec.pages);
        copiedPages.forEach(p => subPdf.addPage(p));
        const subBytes = await subPdf.save();

        const blob = new Blob([subBytes], { type: 'application/pdf' });
        results.push({
          url: URL.createObjectURL(blob),
          name: spec.name,
          size: blob.size,
          pages: spec.desc
        });
      }

      setSuccessFiles(results);
    } catch (err) {
      console.error(err);
      setError('An error occurred during splitting. Please verify that the PDF is not encrypted or damaged.');
    } finally {
      setProcessing(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
    setSuccessFiles([]);
    setSelectedPages([]);
  };

  return (
    <div id="split-tool-workspace" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-5">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight flex items-center gap-2">
            Extract & Split PDF
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Isolate physical chapters, copy unique pages, or partition your PDF files instantaneously.
          </p>
        </div>
        {!file && (
          <button
            id="btn-gen-sample-split"
            type="button"
            onClick={handleGenerateSample}
            className="text-xs font-semibold px-4 py-2 border border-blue-200 text-blue-600 bg-blue-50/50 rounded-xl hover:bg-blue-50 hover:scale-[1.02] cursor-pointer transition-all duration-200 flex items-center gap-1.5 shadow-sm mt-4 md:mt-0"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            + Load 5-Page Sandbox Document
          </button>
        )}
      </div>

      {error && (
        <div id="split-error-alert" className="p-4 bg-red-50 text-red-700 border border-red-100 rounded-2xl flex items-start gap-3">
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
              ? 'border-violet-500 bg-violet-50/20 shadow-inner' 
              : 'border-gray-300 hover:border-violet-500 bg-gray-50/50 hover:bg-violet-50/10'
          }`}
        >
          <div className="p-4 bg-white rounded-2xl shadow-md border border-gray-100 mb-4 transition-transform group-hover:scale-110">
            <Layers className={`w-10 h-10 ${dragActive ? 'text-violet-600 animate-bounce' : 'text-violet-500'}`} />
          </div>
          <span className="text-lg font-semibold text-gray-800">
            {dragActive ? 'Drop your PDF here!' : 'Select a PDF to Split'}
          </span>
          <span className="text-xs text-gray-400 mt-1 max-w-sm">
            Ready to isolate unique pages or define continuous range splits. 100% cloudless processing.
          </span>
          <div className="mt-5">
            <span className="inline-block text-sm font-medium px-5 py-2.5 bg-violet-600 text-white rounded-xl shadow-lg shadow-violet-500/20 hover:bg-violet-700 transition duration-150">
              Select Document
            </span>
          </div>
          <input
            id="split-upload-input"
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      )}

      {file && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main workspace control container */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-5 rounded-2x border border-gray-150 rounded-3xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-50 text-red-500 rounded-xl">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-800 max-w-[240px] md:max-w-md truncate">
                    {file.name}
                  </p>
                  <p className="text-xs font-medium text-gray-400 mt-0.5">
                    {formatBytes(file.size)} • {file.totalPages} pages loaded
                  </p>
                </div>
              </div>
              <button
                id="btn-remove-split-file"
                type="button"
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition duration-150 cursor-pointer"
                onClick={clearFile}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {/* Config Mode Switcher */}
            <div className="flex bg-gray-100/80 p-1 rounded-2xl gap-1">
              <button
                id="btn-tab-split-visual"
                type="button"
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition cursor-pointer ${
                  splitMethod === 'individual'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
                onClick={() => setSplitMethod('individual')}
              >
                1. Visual Page Extractor
              </button>
              <button
                id="btn-tab-split-range"
                type="button"
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition cursor-pointer ${
                  splitMethod === 'range'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-400 hover:text-gray-800'
                }`}
                onClick={() => setSplitMethod('range')}
              >
                2. Range Definer
              </button>
            </div>

            {/* Visual Grid Selector */}
            {splitMethod === 'individual' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-700">
                    Interact, Click to select pages to extract ({selectedPages.length} of {file.totalPages} selected)
                  </span>
                  <button
                    id="btn-split-toggle-all"
                    type="button"
                    onClick={toggleSelectAll}
                    style={{ contentVisibility: 'auto' }}
                    className="text-xs font-semibold px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-150 text-gray-600 rounded-xl cursor-pointer transition duration-150 flex items-center gap-1.5"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    {selectedPages.length === file.totalPages ? 'Deselct All' : 'Select All'}
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[350px] overflow-y-auto p-1.5 border border-dashed border-gray-200 rounded-2xl bg-gray-50/30">
                  {Array.from({ length: file.totalPages || 0 }).map((_, i) => {
                    const isSelected = selectedPages.includes(i);
                    return (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => togglePageSelection(i)}
                        className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col justify-between aspect-[3/4] text-center select-none relative transition duration-150 ${
                          isSelected
                            ? 'border-violet-500 bg-violet-50/20 shadow-md shadow-violet-500/5'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="absolute top-3 right-3">
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                            isSelected ? 'bg-violet-600 border-violet-600 text-white' : 'border-gray-300 bg-white'
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>

                        {/* Dummy 3D looking page layout representation */}
                        <div className="flex-1 flex flex-col justify-center space-y-2 pt-4">
                          <div className="h-2 w-12 bg-gray-100 rounded mx-auto" />
                          <div className="h-1.5 w-16 bg-gray-100 rounded mx-auto" />
                          <div className="h-1.5 w-10 bg-gray-100 rounded mx-auto" />
                        </div>

                        <div className="w-full text-center">
                          <span className={`text-xs font-bold leading-none ${isSelected ? 'text-violet-700' : 'text-gray-500'}`}>
                            Page {i + 1}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Range Split Settings */}
            {splitMethod === 'range' && (
              <div className="bg-white p-6 border border-gray-150 rounded-3xl space-y-6 text-left">
                <h4 className="text-sm font-bold text-gray-700">Set Continuous Range Details</h4>
                <p className="text-xs text-gray-400">Specify exactly which interval of pages should be exported into a single resulting PDF document.</p>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Start page slider input */}
                  <div className="flex-1 w-full space-y-2">
                    <div className="flex justify-between">
                      <label className="text-xs font-bold text-gray-500">From Page</label>
                      <span className="text-xs font-bold text-violet-600 font-mono bg-violet-50 px-2 py-0.5 rounded-lg border border-violet-100">{rangeStart}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        id="btn-start-minus"
                        type="button"
                        onClick={() => setRangeStart(prev => Math.max(1, prev - 1))}
                        disabled={rangeStart <= 1}
                        className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-20 cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        id="range-start-slider"
                        type="range"
                        min="1"
                        max={file.totalPages || 1}
                        value={rangeStart}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setRangeStart(val);
                          if (val > rangeEnd) setRangeEnd(val);
                        }}
                        className="flex-1 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-violet-600"
                      />
                      <button
                        id="btn-start-plus"
                        type="button"
                        onClick={() => {
                          const val = Math.min(file.totalPages || 1, rangeStart + 1);
                          setRangeStart(val);
                          if (val > rangeEnd) setRangeEnd(val);
                        }}
                        className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* End page slider input */}
                  <div className="flex-1 w-full space-y-2">
                    <div className="flex justify-between">
                      <label className="text-xs font-bold text-gray-500">To Page</label>
                      <span className="text-xs font-bold text-violet-600 font-mono bg-violet-50 px-2 py-0.5 rounded-lg border border-violet-100">{rangeEnd}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        id="btn-end-minus"
                        type="button"
                        onClick={() => setRangeEnd(prev => Math.max(rangeStart, prev - 1))}
                        disabled={rangeEnd <= rangeStart}
                        className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-20 cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        id="range-end-slider"
                        type="range"
                        min={rangeStart}
                        max={file.totalPages || 1}
                        value={rangeEnd}
                        onChange={(e) => setRangeEnd(Number(e.target.value))}
                        className="flex-1 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-violet-600"
                      />
                      <button
                        id="btn-end-plus"
                        type="button"
                        onClick={() => setRangeEnd(prev => Math.min(file.totalPages || 1, prev + 1))}
                        disabled={rangeEnd >= (file.totalPages || 1)}
                        className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-20 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Checkout controls Panel */}
          <div className="bg-gradient-to-br from-gray-50 to-white hover:from-white hover:to-gray-50 border border-gray-150 rounded-3xl p-6 h-fit space-y-6 shadow-sm text-left">
            <h3 className="text-base font-bold text-gray-800">Partition Engine</h3>

            <div className="space-y-4 text-sm divide-y divide-gray-100">
              <div className="flex justify-between py-1">
                <span className="text-gray-400">Type</span>
                <span className="font-bold text-gray-700">
                  {splitMethod === 'individual' ? 'Visual Page Copy' : 'Interval Extract'}
                </span>
              </div>
              <div className="flex justify-between pt-3">
                <span className="text-gray-400">Expected Documents</span>
                <span className="font-bold text-gray-700">1 compiled PDF file</span>
              </div>
              <div className="flex justify-between pt-3">
                <span className="text-gray-400">Selected Pages</span>
                <span className="font-bold text-violet-600">
                  {splitMethod === 'individual'
                    ? `${selectedPages.length} total pages`
                    : `${rangeEnd - rangeStart + 1} pages (${rangeStart}-${rangeEnd})`}
                </span>
              </div>
            </div>

            <button
              id="btn-trigger-split"
              type="button"
              disabled={processing || (splitMethod === 'individual' && selectedPages.length === 0)}
              onClick={executeSplit}
              className="w-full font-bold px-6 py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none transition duration-150 cursor-pointer shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing Extraction...
                </>
              ) : (
                <>
                  Extract Selected Pages
                  <span className="text-xs bg-violet-500 text-violet-100 rounded-lg px-2 py-0.5 font-medium ml-1">
                    Instant
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Results output list */}
      <AnimatePresence>
        {successFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-4 text-left"
          >
            <h3 className="text-base font-bold text-gray-800">Generated Assets Ready</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {successFiles.map((sf, index) => (
                <div
                  key={index}
                  id={`split-success-card-${index}`}
                  className="bg-gradient-to-r from-emerald-50 to-green-50 p-5 rounded-3xl border border-green-200 flex items-center justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-3 bg-green-500 text-white rounded-2xl">
                      <Check className="w-5 h-5 line-height-none stroke-[3]" />
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="text-sm font-bold text-green-900 truncate">
                        {sf.name}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        {sf.pages} • {formatBytes(sf.size)}
                      </p>
                    </div>
                  </div>
                  <a
                    id={`lnk-download-split-${index}`}
                    href={sf.url}
                    download={sf.name}
                    className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-sm cursor-pointer shrink-0"
                    title="Download Extracted File"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
