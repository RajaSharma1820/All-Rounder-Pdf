import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PDFDocument } from 'pdf-lib';
import { FileUp, Trash2, ArrowUp, ArrowDown, Sparkles, Check, Download, AlertCircle, FileText } from 'lucide-react';
import { PDFFile } from '../types';
import { formatBytes, generateMockPDF, getPdfInfo } from '../utils/pdfHelpers';

export default function MergeTool() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [successFile, setSuccessFile] = useState<{ url: string; name: string; size: number } | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setError(null);
    setSuccessFile(null);

    const uploaded = Array.from(e.target.files) as File[];
    const newFiles: PDFFile[] = [];

    for (const f of uploaded) {
      if (f.type !== 'application/pdf') {
        setError('Only PDF files are supported.');
        continue;
      }

      const info = await getPdfInfo(f);
      newFiles.push({
        id: Math.random().toString(36).substring(2, 9),
        name: f.name,
        size: f.size,
        file: f,
        totalPages: info.pageCount
      });
    }

    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleGenerateSample = async (title: string, pages: number) => {
    setError(null);
    setSuccessFile(null);
    try {
      const sampleFile = await generateMockPDF(title, pages);
      const info = await getPdfInfo(sampleFile);
      setFiles(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          name: sampleFile.name,
          size: sampleFile.size,
          file: sampleFile,
          totalPages: info.pageCount
        }
      ]);
    } catch (err) {
      setError('Could not generate sample file.');
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === files.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    setFiles(prev => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated;
    });
  };

  const removeItem = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const clearAll = () => {
    setFiles([]);
    setError(null);
    setSuccessFile(null);
  };

  const runMerge = async () => {
    if (files.length < 2) {
      setError('You must add at least 2 PDF files to merge.');
      return;
    }

    setProcessing(true);
    setError(null);
    setSuccessFile(null);

    try {
      // Create a master PDF document
      const mergedPdf = await PDFDocument.create();

      for (const item of files) {
        const fileBuffer = await item.file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(fileBuffer);
        const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const size = blob.size;
      const downloadUrl = URL.createObjectURL(blob);
      const outputName = `merged_${new Date().getTime()}.pdf`;

      setSuccessFile({
        url: downloadUrl,
        name: outputName,
        size
      });
    } catch (err) {
      console.error(err);
      setError('Internal error merging the PDF files. Please verify that files are valid PDFs.');
    } finally {
      setProcessing(false);
    }
  };

  const totalPages = files.reduce((sum, f) => sum + (f.totalPages || 0), 0);
  const totalSizeBytes = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <div id="merge-tool-workspace" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-5">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight flex items-center gap-2">
            Merge PDF Documents
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Reorder and fuse multiple PDF files into one high-performance document instantly.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          <button
            id="btn-gen-sample-1"
            type="button"
            onClick={() => handleGenerateSample('Project Report', 3)}
            className="text-xs font-semibold px-4 py-2 border border-blue-200 text-blue-600 bg-blue-50/50 rounded-xl hover:bg-blue-50 hover:scale-[1.02] cursor-pointer transition-all duration-200 flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            + Sample Document (3 Pages)
          </button>
          <button
            id="btn-gen-sample-2"
            type="button"
            onClick={() => handleGenerateSample('Invoice Summary', 1)}
            className="text-xs font-semibold px-4 py-2 border border-purple-200 text-purple-600 bg-purple-50/50 rounded-xl hover:bg-purple-50 hover:scale-[1.02] cursor-pointer transition-all duration-200 flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            + Sample Receipt (1 Page)
          </button>
        </div>
      </div>

      {error && (
        <div id="merge-error-alert" className="p-4 bg-red-50 text-red-700 border border-red-100 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Main Drag-Drop Upload Area */}
      {files.length === 0 && (
        <div className="relative group">
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 group-hover:border-blue-500 bg-gray-50/50 group-hover:bg-blue-50/10 min-h-[300px] rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 shadow-sm">
            <div className="p-4 bg-white rounded-2xl shadow-md border border-gray-100 mb-4 transition-transform group-hover:scale-110">
              <FileUp className="w-10 h-10 text-blue-500" />
            </div>
            <span className="text-lg font-semibold text-gray-800">
              Drag & drop PDF files here
            </span>
            <span className="text-xs text-gray-400 mt-1 max-w-sm">
              Supporting multiple PDF documents. Your files are processed 100% locally in your browser for absolute privacy.
            </span>
            <div className="mt-5">
              <span className="inline-block text-sm font-medium px-5 py-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition duration-150">
                Browse Files
              </span>
            </div>
            <input
              id="merge-upload-input"
              type="file"
              multiple
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      )}

      {files.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* File Organizer list */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-700">
                Merge List ({files.length} {files.length === 1 ? 'file' : 'files'})
              </span>
              <button
                id="btn-clear-merge"
                type="button"
                className="text-xs text-gray-400 hover:text-red-500 transition duration-150 flex items-center gap-1 cursor-pointer"
                onClick={clearAll}
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              <AnimatePresence>
                {files.map((file, idx) => (
                  <motion.div
                    key={file.id}
                    layoutId={file.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group bg-white p-4 rounded-2xl border border-gray-150 hover:border-blue-400 hover:shadow-md transition-all duration-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 bg-red-50 text-red-500 rounded-xl">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-800 max-w-[200px] sm:max-w-xs md:max-w-md truncate">
                          {file.name}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs font-medium text-gray-400">
                            {formatBytes(file.size)}
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                          <span className="text-xs font-semibold px-2 py-0.5 bg-gray-50 text-gray-500 border border-gray-100 rounded-lg">
                            {file.totalPages || '?'} Pages
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        title="Move Up"
                        onClick={() => moveItem(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 text-gray-400 hover:text-gray-800 hover:bg-gray-50 rounded-xl disabled:opacity-20 disabled:pointer-events-none transition duration-150"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        title="Move Down"
                        onClick={() => moveItem(idx, 'down')}
                        disabled={idx === files.length - 1}
                        className="p-1.5 text-gray-400 hover:text-gray-800 hover:bg-gray-50 rounded-xl disabled:opacity-20 disabled:pointer-events-none transition duration-150"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        title="Remove file"
                        onClick={() => removeItem(file.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition duration-150"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Quick Upload Add-More box */}
            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-blue-400 bg-gray-50/30 hover:bg-blue-50/10 p-4 rounded-2xl text-sm font-medium text-gray-600 hover:text-blue-600 cursor-pointer transition duration-150">
              <FileUp className="w-4 h-4 text-blue-500" /> Add More Documents
              <input
                id="merge-upload-more"
                type="file"
                multiple
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          {/* Quick Merge Stats Panel */}
          <div className="bg-gradient-to-br from-gray-50 to-white hover:from-white hover:to-gray-50 border border-gray-150 rounded-3xl p-6 h-fit space-y-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-800">Merge Workspace Summary</h3>

            <div className="space-y-4 text-sm divide-y divide-gray-100">
              <div className="flex justify-between py-1">
                <span className="text-gray-400">Total PDF Documents</span>
                <span className="font-semibold text-gray-700">{files.length}</span>
              </div>
              <div className="flex justify-between pt-3">
                <span className="text-gray-400">Resulting Total Pages</span>
                <span className="font-semibold text-gray-700">{totalPages} Pages</span>
              </div>
              <div className="flex justify-between pt-3">
                <span className="text-gray-400">Total File Weight</span>
                <span className="font-semibold text-gray-700">{formatBytes(totalSizeBytes)}</span>
              </div>
              <div className="flex justify-between pt-3">
                <span className="text-gray-400">Privacy Status</span>
                <span className="font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-lg border border-green-100 text-xs flex items-center gap-1">
                  <Check className="w-3 h-3" /> 100% Secure Local
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                id="btn-trigger-merge"
                type="button"
                disabled={files.length < 2 || processing}
                onClick={runMerge}
                className="w-full font-bold px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none transition duration-150 cursor-pointer shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Fusing PDF Pages...
                  </>
                ) : (
                  <>
                    Merge PDFs
                    <span className="text-xs bg-blue-500 text-blue-100 rounded-lg px-1.5 py-0.5 font-medium ml-1">
                      Instant Local
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal / Action Banner */}
      <AnimatePresence>
        {successFile && (
          <motion.div
            id="merge-success-banner"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 hover:from-green-50 hover:to-emerald-50 border border-green-200 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-lg shadow-green-500/5 mt-6"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-500 text-white rounded-2xl shadow-md">
                <Check className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="text-lg font-bold text-green-800">PDFs Merged Successfully!</h4>
                <p className="text-sm text-green-600 mt-1">
                  Your new unified document (<span className="font-semibold">{successFile.name}</span>, {formatBytes(successFile.size)}) has been compiled directly in-browser.
                </p>
              </div>
            </div>
            <a
              id="lnk-download-merged"
              href={successFile.url}
              download={successFile.name}
              className="py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:scale-105 active:scale-[0.98] transition shadow-md shadow-green-600/10 shrink-0"
            >
              <Download className="w-4 h-4 animate-bounce" /> Download Merge File
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
