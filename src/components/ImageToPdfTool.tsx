import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PDFDocument } from 'pdf-lib';
import { FileUp, Trash2, ArrowUp, ArrowDown, Sparkles, Check, Download, AlertCircle, Image as ImageIcon, Layers } from 'lucide-react';
import { ImageFile } from '../types';
import { formatBytes } from '../utils/pdfHelpers';

export default function ImageToPdfTool() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [successFile, setSuccessFile] = useState<{ url: string; name: string; size: number } | null>(null);

  // Settings
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'original'>('original');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [margin, setMargin] = useState<0 | 15 | 40>(0);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setError(null);
    setSuccessFile(null);

    const uploaded = Array.from(e.target.files) as File[];
    const newImages: ImageFile[] = [];

    // Filter image types
    const validImages = uploaded.filter(f => f.type === 'image/jpeg' || f.type === 'image/png');
    if (validImages.length < uploaded.length) {
      setError('Only standard PNG and JPG/JPEG files are currently supported for PDF compiling.');
    }

    validImages.forEach(f => {
      newImages.push({
        id: Math.random().toString(36).substring(2, 9),
        name: f.name,
        size: f.size,
        file: f,
        previewUrl: URL.createObjectURL(f)
      });
    });

    setImages(prev => [...prev, ...newImages]);
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === images.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    setImages(prev => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated;
    });
  };

  const removeImage = (id: string, previewUrl: string) => {
    URL.revokeObjectURL(previewUrl);
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const clearAll = () => {
    images.forEach(img => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
    setError(null);
    setSuccessFile(null);
  };

  const compilePdf = async () => {
    if (images.length === 0) {
      setError('Please add at least one image file.');
      return;
    }

    setProcessing(true);
    setError(null);
    setSuccessFile(null);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const item of images) {
        const imageBuffer = await item.file.arrayBuffer();
        let embeddedImage;

        // Embed png versus jpeg dynamically
        if (item.file.type === 'image/png') {
          embeddedImage = await pdfDoc.embedPng(imageBuffer);
        } else {
          embeddedImage = await pdfDoc.embedJpg(imageBuffer);
        }

        const imgWidth = embeddedImage.width;
        const imgHeight = embeddedImage.height;

        // Set dimensions of the new PDF page
        let pageWidth = imgWidth;
        let pageHeight = imgHeight;

        if (pageSize === 'a4') {
          pageWidth = orientation === 'portrait' ? 595.28 : 841.89;
          pageHeight = orientation === 'portrait' ? 841.89 : 595.28;
        } else if (pageSize === 'letter') {
          pageWidth = orientation === 'portrait' ? 612 : 792;
          pageHeight = orientation === 'portrait' ? 792 : 612;
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        // Calculate responsive scaling and centering layout
        const usableWidth = pageWidth - (margin * 2);
        const usableHeight = pageHeight - (margin * 2);

        const widthRatio = usableWidth / imgWidth;
        const heightRatio = usableHeight / imgHeight;
        const scaleFactor = Math.min(widthRatio, heightRatio, 1); // shrink if too big, maintain aspect

        const drawWidth = imgWidth * scaleFactor;
        const drawHeight = imgHeight * scaleFactor;

        // Centering math
        const drawX = margin + (usableWidth - drawWidth) / 2;
        const drawY = margin + (usableHeight - drawHeight) / 2;

        page.drawImage(embeddedImage, {
          x: drawX,
          y: drawY,
          width: drawWidth,
          height: drawHeight,
        });
      }

      const compiledBytes = await pdfDoc.save();
      const blob = new Blob([compiledBytes], { type: 'application/pdf' });
      const size = blob.size;
      const downloadUrl = URL.createObjectURL(blob);
      const outputName = `images_converted_${new Date().getTime()}.pdf`;

      setSuccessFile({
        url: downloadUrl,
        name: outputName,
        size
      });
    } catch (err) {
      console.error(err);
      setError('Internal compiling error. Ensure your image formats are not damaged.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div id="image-to-pdf-workspace" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-5 text-left">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight flex items-center gap-2">
            Convert Images to PDF
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Reorder and compile multiple PNG or JPG photos into a single sleek booklet instantly.
          </p>
        </div>
      </div>

      {error && (
        <div id="image-error-alert" className="p-4 bg-red-50 text-red-700 border border-red-100 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Upload Zone */}
      {images.length === 0 && (
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-indigo-500 bg-gray-50/50 hover:bg-indigo-50/10 min-h-[300px] rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 shadow-sm relative group">
          <div className="p-4 bg-white rounded-2xl shadow-md border border-gray-100 mb-4 transition-transform group-hover:scale-110">
            <ImageIcon className="w-10 h-10 text-indigo-500" />
          </div>
          <span className="text-lg font-semibold text-gray-800">
            Select Images to Compile (PNG/JPG)
          </span>
          <span className="text-xs text-gray-400 mt-1 max-w-sm">
            Drag photo assets, diagrams, or scans here. We construct individual high-definition document sheets in chronological sequence.
          </span>
          <div className="mt-5">
            <span className="inline-block text-sm font-medium px-5 py-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition duration-150">
              Browse Photos
            </span>
          </div>
          <input
            id="image-upload-input"
            type="file"
            multiple
            accept="image/png,image/jpeg,image/jpg"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* List panel */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-700">
                Chronology Queue ({images.length} {images.length === 1 ? 'photo' : 'photos'})
              </span>
              <button
                id="btn-clear-images"
                type="button"
                className="text-xs text-gray-400 hover:text-red-500 transition flex items-center gap-1 cursor-pointer font-semibold"
                onClick={clearAll}
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All Items
              </button>
            </div>

            {/* Thumbnail grids */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[440px] overflow-y-auto pr-1">
              <AnimatePresence>
                {images.map((img, idx) => (
                  <motion.div
                    key={img.id}
                    layoutId={img.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-3 bg-white border border-gray-150 hover:border-indigo-400 rounded-2xl flex items-center justify-between gap-3 shadow-sm group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Interactive hover preview */}
                      <img
                        src={img.previewUrl}
                        alt="Scanned Preview"
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 object-cover rounded-xl border border-gray-100 bg-gray-50"
                      />
                      <div className="min-w-0 text-left">
                        <p className="text-xs font-bold text-gray-800 truncate max-w-[120px] sm:max-w-[150px]">
                          {img.name}
                        </p>
                        <p className="text-[10px] font-semibold text-gray-400 mt-1">
                          {formatBytes(img.size)} • Sheet #{idx + 1}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5">
                      <button
                        title="Move Up"
                        onClick={() => moveImage(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-gray-400 hover:text-gray-800 disabled:opacity-20 transition"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        title="Move Down"
                        onClick={() => moveImage(idx, 'down')}
                        disabled={idx === images.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-800 disabled:opacity-20 transition"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        title="Remove Image"
                        onClick={() => removeImage(img.id, img.previewUrl)}
                        className="p-1 text-gray-400 hover:text-red-500 rounded transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Quick append photobtn */}
            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-indigo-455 bg-gray-50/20 hover:bg-indigo-50/10 p-4 rounded-2xl text-sm font-semibold text-gray-600 hover:text-indigo-600 cursor-pointer transition duration-150">
              <FileUp className="w-4 h-4 text-indigo-500" /> Upload More Photos
              <input
                id="image-upload-more"
                type="file"
                multiple
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          {/* Settings panel (1 col) */}
          <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-150 rounded-3xl p-6 h-fit text-left space-y-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-800 border-b pb-3">Layout Format Engine</h3>

            {/* Scale sizing */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500">Page Sizing Dimensions</label>
              <div className="grid grid-cols-1 gap-1.5">
                {(['original', 'a4', 'letter'] as const).map((sz) => (
                  <button
                    key={sz}
                    id={`btn-sz-${sz}`}
                    type="button"
                    onClick={() => setPageSize(sz)}
                    className={`text-xs p-2.5 border rounded-xl font-bold transition text-left cursor-pointer ${
                      pageSize === sz
                        ? 'border-indigo-600 bg-indigo-50/25 text-indigo-800'
                        : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-500'
                    }`}
                  >
                    {sz === 'original' && 'Native Picture Resolution'}
                    {sz === 'a4' && 'A4 European ISO Standard (595 x 842 pt)'}
                    {sz === 'letter' && 'US Letter Executive Standard (612 x 792 pt)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Orientation */}
            {pageSize !== 'original' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500">Document Direction</label>
                <div className="flex items-center gap-2">
                  <button
                    id="btn-or-portrait"
                    type="button"
                    onClick={() => setOrientation('portrait')}
                    className={`text-xs px-4 py-2 border rounded-xl font-bold flex-1 cursor-pointer transition ${
                      orientation === 'portrait' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-500'
                    }`}
                  >
                    Vertical Portrait
                  </button>
                  <button
                    id="btn-or-landscape"
                    type="button"
                    onClick={() => setOrientation('landscape')}
                    className={`text-xs px-4 py-2 border rounded-xl font-bold flex-1 cursor-pointer transition ${
                      orientation === 'landscape' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-500'
                    }`}
                  >
                    Horizontal Landscape
                  </button>
                </div>
              </div>
            )}

            {/* Margin padding selections */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500">Framing Margin Width</label>
              <div className="flex gap-2">
                {([0, 15, 40] as const).map((m) => (
                  <button
                    key={m}
                    id={`btn-margin-${m}`}
                    type="button"
                    onClick={() => setMargin(m)}
                    className={`text-xs p-2.5 font-bold border rounded-xl flex-1 cursor-pointer transition ${
                      margin === m ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold' : 'border-gray-200 text-gray-400'
                    }`}
                  >
                    {m === 0 ? 'Fullbleed (0px)' : m === 15 ? 'Slim (15px)' : 'Wide (40px)'}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                id="btn-trigger-image-pdf"
                type="button"
                disabled={processing || images.length === 0}
                onClick={compilePdf}
                className="w-full font-bold px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none transition duration-150 cursor-pointer shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
              >
                {processing ? 'Fusing Raster Pixels...' : 'Compile PDF Document'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal / Action Banner */}
      <AnimatePresence>
        {successFile && (
          <motion.div
            id="image-success-banner"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 border border-green-200 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-lg shadow-green-500/5 mt-6 text-left"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-500 text-white rounded-2xl shadow-md">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-green-800 font-sans">Compiling Complete!</h4>
                <p className="text-sm text-green-600 mt-1 max-w-sm md:max-w-xl">
                  Your image array has been packaged into an elegant document layout (<span className="font-semibold">{successFile.name}</span>, {formatBytes(successFile.size)}).
                </p>
              </div>
            </div>
            <a
              id="lnk-download-imagecomp"
              href={successFile.url}
              download={successFile.name}
              className="py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:scale-105 active:scale-[0.98] transition shadow-md shadow-green-600/10 shrink-0"
            >
              <Download className="w-4 h-4 animate-bounce" /> Get Converted PDF
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
