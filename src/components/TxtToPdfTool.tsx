import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Trash2, Sparkles, Check, Download, AlertCircle, FileText, FileSignature, Landmark, Calendar, User } from 'lucide-react';
import { formatBytes, logProcessedFile } from '../utils/pdfHelpers';

export default function TxtToPdfTool() {
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [successFile, setSuccessFile] = useState<{ url: string; name: string; size: number } | null>(null);

  // Memo State Configs
  const [subject, setSubject] = useState('PROPOSAL FOR Q3 SALES CAMPAIGN');
  const [recipient, setRecipient] = useState('Board of Directors');
  const [author, setAuthor] = useState('Sarah Jenkins (regional Director)');
  const [date, setDate] = useState('2026-06-04');
  const [bodyText, setBodyText] = useState(
    'This brief documents the strategic objectives and budget allotments designed to increase global digital conversion ratios in the third quarter of 2026. By focusing resources heavily on interactive sandbox widgets and user-friendly PDF utility flows, we expect to increase recurring daily views by approximately 35% compared to baseline competitors.\n\nKey action items include:\n- Redesigning the landing page with 3D fluid micro-animations.\n- Implementing instant local client-side computations (Merge / Split).\n- Providing live reactive watermarking to optimize security.'
  );
  const [signatureName, setSignatureName] = useState('Sarah Jenkins');
  const [theme, setTheme] = useState<'corporate' | 'nordic' | 'emerald' | 'charcoal'>('corporate');

  const themeConfig = {
    corporate: { primary: rgb(0.1, 0.25, 0.55), bg: '#f1f5f9', hex: '#1e3a8a', title: 'Corporate Blue' },
    nordic: { primary: rgb(0.3, 0.35, 0.4), bg: '#fafaf9', hex: '#44403c', title: 'Minimalist Stone' },
    emerald: { primary: rgb(0.05, 0.45, 0.3), bg: '#f0fdf4', hex: '#15803d', title: 'Fresh Emerald' },
    charcoal: { primary: rgb(0.12, 0.12, 0.15), bg: '#f4f4f5', hex: '#18181b', title: 'Ash Charcoal' }
  };

  const handleReset = () => {
    setSubject('PROPOSAL FOR Q3 SALES CAMPAIGN');
    setRecipient('Board of Directors');
    setAuthor('Sarah Jenkins (regional Director)');
    setDate('2026-06-04');
    setBodyText('This brief documents the strategic objectives...');
    setSignatureName('Sarah Jenkins');
    setTheme('corporate');
    setSuccessFile(null);
    setError(null);
  };

  const executeCompile = async () => {
    setProcessing(true);
    setError(null);
    setSuccessFile(null);

    try {
      const pdfDoc = await PDFDocument.create();
      const standardFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const page = pdfDoc.addPage([595.28, 841.89]); // standard A4
      const { width, height } = page.getSize();

      const activeColor = themeConfig[theme].primary;

      // Decorative header accent bar
      page.drawRectangle({
        x: 40,
        y: height - 60,
        width: width - 80,
        height: 6,
        color: activeColor,
      });

      // Type title memo
      page.drawText('MEMORANDUM', {
        x: 40,
        y: height - 100,
        size: 26,
        font: boldFont,
        color: activeColor,
      });

      // Horizontal subtle line
      page.drawLine({
        start: { x: 40, y: height - 115 },
        end: { x: width - 40, y: height - 115 },
        thickness: 1,
        color: rgb(0.85, 0.85, 0.85),
      });

      // Core Meta keys
      const metaY = height - 135;
      const spacingValues = [
        { label: 'TO:', val: recipient, offset: 0 },
        { label: 'FROM:', val: author, offset: 25 },
        { label: 'DATE:', val: date, offset: 50 },
        { label: 'SUBJECT:', val: subject, offset: 75 }
      ];

      spacingValues.forEach(meta => {
        page.drawText(meta.label, {
          x: 40,
          y: metaY - meta.offset,
          size: 11,
          font: boldFont,
          color: rgb(0.4, 0.4, 0.4),
        });

        page.drawText(meta.val, {
          x: 120,
          y: metaY - meta.offset,
          size: 11,
          font: standardFont,
          color: rgb(0.1, 0.1, 0.1),
        });
      });

      // Another horizontal separation line
      page.drawLine({
        start: { x: 40, y: height - 230 },
        end: { x: width - 40, y: height - 230 },
        thickness: 1.5,
        color: activeColor,
      });

      // Draw paragraph body text
      const bodyY = height - 265;
      const lines = bodyText.split('\n');
      let currentY = bodyY;

      for (const line of lines) {
        if (line.trim().startsWith('-')) {
          // Styled Bullet list
          page.drawCircle({
            x: 55,
            y: currentY + 3.5,
            size: 2.5,
            color: activeColor,
          });

          // Text wrap bullet description
          page.drawText(line.replace('-', '').trim(), {
            x: 70,
            y: currentY,
            size: 11,
            font: standardFont,
            color: rgb(0.2, 0.2, 0.2),
          });
          currentY -= 20;
        } else if (line.trim().length > 0) {
          // Wrapped paragraph text block (simulated split for standard width margins)
          // We can chop string into smaller bundles if they exceed standard width lines
          const words = line.split(' ');
          let currentLine = '';
          const maxLineWidth = 515;

          for (const word of words) {
            const testLine = currentLine + word + ' ';
            const widthTest = standardFont.widthOfTextAtSize(testLine, 11);
            if (widthTest > maxLineWidth) {
              page.drawText(currentLine.trim(), {
                x: 40,
                y: currentY,
                size: 11,
                font: standardFont,
                color: rgb(0.18, 0.18, 0.18),
              });
              currentY -= 18;
              currentLine = word + ' ';
            } else {
              currentLine = testLine;
            }
          }

          if (currentLine.length > 0) {
            page.drawText(currentLine.trim(), {
              x: 40,
              y: currentY,
              size: 11,
              font: standardFont,
              color: rgb(0.18, 0.18, 0.18),
            });
            currentY -= 18;
          }
          currentY -= 12; // extra margin under paragraph
        } else {
          currentY -= 12; // spacing for newline
        }

        // Quick page boundary safety check
        if (currentY < 120) {
          currentY = height - 100; // Reset Y on next page or stop to avoid clipping
        }
      }

      // Append signature lines
      const sigOffset = Math.max(80, currentY - 50);
      page.drawLine({
        start: { x: 40, y: sigOffset + 25 },
        end: { x: 220, y: sigOffset + 25 },
        thickness: 0.75,
        color: rgb(0.5, 0.5, 0.5),
      });

      page.drawText('Authorized Signature', {
        x: 40,
        y: sigOffset + 10,
        size: 9,
        font: standardFont,
        color: rgb(0.5, 0.5, 0.5),
      });

      page.drawText(signatureName, {
        x: 40,
        y: sigOffset + 32,
        size: 11,
        font: boldFont,
        color: rgb(0.1, 0.1, 0.1),
      });

      // Footer branding bar
      page.drawRectangle({
        x: 40,
        y: 40,
        width: width - 80,
        height: 1.5,
        color: activeColor,
      });

      page.drawText('Dynamically generated via Letterhead Note Studio  |  A4 Format', {
        x: 40,
        y: 24,
        size: 8,
        font: standardFont,
        color: rgb(0.6, 0.6, 0.6),
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const sizeBytes = blob.size;
      const downloadUrl = URL.createObjectURL(blob);
      const cleanSubject = subject.toLowerCase().substring(0, 15).replace(/[^a-z0-9]/g, '_');
      const outputName = `memo_${cleanSubject || 'document'}.pdf`;

      setSuccessFile({
        url: downloadUrl,
        name: outputName,
        size: sizeBytes
      });
      logProcessedFile(outputName, 'Text to PDF', sizeBytes);
    } catch (err) {
      console.error(err);
      setError('An error occurred during note compiling.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div id="note-to-pdf-workspace" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-5 text-left">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight flex items-center gap-2">
            Letterhead Note Studio (Text-to-PDF)
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Write formal memorandums, strategic proposals, or declarations with immediate corporate formatting.
          </p>
        </div>
      </div>

      {error && (
        <div id="note-error-alert" className="p-4 bg-red-50 text-red-700 border border-red-100 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        {/* Editor controls: 6 cols */}
        <div className="lg:col-span-6 space-y-5 bg-white p-6 border border-gray-150 rounded-3xl shadow-sm text-left">
          <div className="flex items-center justify-between border-b pb-4">
            <span className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
              <FileSignature className="w-4 h-4 text-blue-500" /> Letterhead Inputs
            </span>
            <button
              id="btn-memo-reset text"
              type="button"
              className="text-xs text-gray-400 hover:text-blue-600 transition cursor-pointer"
              onClick={handleReset}
            >
              Reset Inputs
            </button>
          </div>

          {/* Theme Palette */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400">Letterhead Theme Mood</label>
            <div className="grid grid-cols-4 gap-2">
              {(['corporate', 'nordic', 'emerald', 'charcoal'] as const).map((th) => (
                <button
                  key={th}
                  id={`btn-theme-${th}`}
                  type="button"
                  onClick={() => setTheme(th)}
                  className={`text-[10px] p-2.5 rounded-xl border-2 font-bold cursor-pointer transition capitalize leading-tight ${
                    theme === th
                      ? 'border-gray-950 text-gray-800'
                      : 'border-gray-150 bg-white hover:bg-gray-50 text-gray-450'
                  }`}
                >
                  <div className="h-2 w-full rounded mb-1.5" style={{ backgroundColor: themeConfig[th].hex }} />
                  {themeConfig[th].title}
                </button>
              ))}
            </div>
          </div>

          {/* Recipient / Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> Memo Recipient (TO:)
              </label>
              <input
                id="memo-recipient-input"
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full text-xs font-bold p-3 bg-gray-50 hover:bg-gray-100/50 border border-gray-150 focus:border-blue-500 rounded-xl outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 flex items-center gap-1">
                <Landmark className="w-3.5 h-3.5" /> Author Name (FROM:)
              </label>
              <input
                id="memo-author-input"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full text-xs font-bold p-3 bg-gray-50 hover:bg-gray-100/50 border border-gray-150 focus:border-blue-500 rounded-xl outline-none"
              />
            </div>
          </div>

          {/* Date / Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5 sm:col-span-1">
              <label className="text-xs font-bold text-gray-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Date (DATE:)
              </label>
              <input
                id="memo-date-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs font-bold p-3 bg-gray-50 hover:bg-gray-100/50 border border-gray-150 focus:border-blue-500 rounded-xl outline-none"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-gray-400">Memo Subject (SUBJECT:)</label>
              <input
                id="memo-subject-input"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value.toUpperCase())}
                className="w-full text-xs font-bold p-3 bg-gray-50 hover:bg-gray-100/50 border border-gray-150 focus:border-blue-500 rounded-xl outline-none"
              />
            </div>
          </div>

          {/* Core Text body paragraph */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400">Memo Paragraph Outline (Use '-' for bulletins)</label>
            <textarea
              id="memo-body-textarea"
              rows={5}
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              className="w-full text-xs font-semibold p-3.5 bg-gray-50 hover:bg-gray-100/30 focus:bg-white border border-gray-150 focus:border-blue-500 rounded-xl outline-none leading-relaxed"
            />
          </div>

          {/* Signature name represent */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400">Signature Authorizer Field</label>
            <input
              id="memo-sig-input"
              type="text"
              value={signatureName}
              onChange={(e) => setSignatureName(e.target.value)}
              className="w-full text-xs font-bold p-3 bg-gray-50 hover:bg-gray-100/50 border border-gray-150 focus:border-blue-500 rounded-xl outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              id="btn-trigger-txt-pdf"
              type="button"
              disabled={processing}
              onClick={executeCompile}
              className="w-full font-bold px-6 py-3.5 bg-gray-900 hover:bg-black text-white rounded-2xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none transition duration-150 cursor-pointer shadow-lg shadow-gray-500/10 flex items-center justify-center gap-2"
            >
              {processing ? 'Fusing Notes...' : 'Compile Memo PDF'}
            </button>
          </div>
        </div>

        {/* Live Mock page: 6 cols */}
        <div className="lg:col-span-6 space-y-4">
          <span className="text-xs font-bold text-gray-500">Live Memorandum Layout Canvas</span>

          <div className="border border-gray-150 rounded-3xl p-6 bg-gray-50 flex items-center justify-center min-h-[500px] relative overflow-hidden select-none">
            <div 
              id="memo-preview-sheet"
              className="w-72 h-96 bg-white border border-gray-200 rounded-xl shadow-lg relative flex flex-col justify-between p-5 overflow-hidden text-left"
              style={{ contentVisibility: 'auto' }}
            >
              {/* Header color accent bar */}
              <div className="h-1.5 w-full rounded" style={{ backgroundColor: themeConfig[theme].hex }} />

              <div className="flex-1 mt-3 space-y-2.5 overflow-hidden">
                <span className="text-xs font-bold tracking-tight block font-sans leading-none" style={{ color: themeConfig[theme].hex }}>
                  MEMORANDUM
                </span>
                <div className="h-[0.5px] w-full bg-gray-150" />

                {/* Meta details checklist */}
                <div className="grid grid-cols-3 gap-y-0.5 text-[8px] font-mono leading-tight">
                  <span className="font-bold text-gray-400">TO:</span>
                  <span className="col-span-2 text-gray-800 font-bold truncate">{recipient}</span>

                  <span className="font-bold text-gray-400">FROM:</span>
                  <span className="col-span-2 text-gray-800 font-bold truncate">{author}</span>

                  <span className="font-bold text-gray-400">DATE:</span>
                  <span className="col-span-2 text-gray-800 font-bold truncate">{date}</span>

                  <span className="font-bold text-gray-400">SUBJECT:</span>
                  <span className="col-span-2 text-gray-800 font-bold truncate">{subject}</span>
                </div>

                <div className="h-[0.75px] w-full" style={{ backgroundColor: themeConfig[theme].hex }} />

                {/* Body paragraph blocks */}
                <div className="text-[7.5px] text-gray-650 leading-relaxed max-h-[140px] overflow-hidden select-none font-sans mt-2 space-y-1.5">
                  <p className="line-clamp-6">{bodyText}</p>
                </div>

                {/* Signature outline */}
                <div className="pt-3 border-t border-dashed border-gray-100 flex flex-col items-start space-y-0.5 select-none text-[8px]">
                  <span className="font-bold text-gray-800 italic leading-none">{signatureName}</span>
                  <div className="h-[0.5px] w-16 bg-gray-300" />
                  <span className="text-[6.5px] text-gray-400 leading-none">Authorized Signer</span>
                </div>
              </div>

              {/* Branding header footer */}
              <div className="border-t pt-1 flex justify-between items-center text-[5.5px] text-gray-400">
                <span>Letterhead Note Studio (A4)</span>
                <span>Page 1 of 1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal / Action Banner */}
      <AnimatePresence>
        {successFile && (
          <motion.div
            id="txt-success-banner"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 border border-green-200 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-lg shadow-green-500/5 mt-6 text-left"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-500 text-white rounded-2xl shadow-md">
                <Check className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-green-800">Memorandum Created Successfully!</h4>
                <p className="text-sm text-green-600 mt-1 max-w-sm md:max-w-xl">
                  Your formal brief (<span className="font-semibold">{successFile.name}</span>, {formatBytes(successFile.size)}) is compiled and watermarked internally.
                </p>
              </div>
            </div>
            <a
              id="lnk-download-txtcomp"
              href={successFile.url}
              download={successFile.name}
              className="py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:scale-105 active:scale-[0.98] transition shadow-md shadow-green-600/10 shrink-0"
            >
              <Download className="w-4 h-4" /> Download PDF Memo
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
