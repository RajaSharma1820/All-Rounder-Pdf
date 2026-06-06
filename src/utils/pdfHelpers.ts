import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * Formats a byte number to human-readable size
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Generates a real, valid PDF file containing custom pages and colors
 * for instant user testing.
 */
export async function generateMockPDF(title: string, pageCount: number = 3): Promise<File> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const colors = [
    { bg: rgb(0.06, 0.09, 0.16), text: rgb(0.9, 0.95, 1.0), accent: rgb(0.2, 0.6, 1.0) }, // Dark navy
    { bg: rgb(0.96, 0.96, 0.98), text: rgb(0.1, 0.1, 0.15), accent: rgb(0.5, 0.2, 0.9) }, // Warm light
    { bg: rgb(0.05, 0.15, 0.1), text: rgb(0.9, 1.0, 0.9), accent: rgb(0.1, 0.8, 0.4) }    // Emerald theme
  ];

  for (let i = 1; i <= pageCount; i++) {
    const page = pdfDoc.addPage([600, 800]);
    const theme = colors[(i - 1) % colors.length];

    // Background fill
    page.drawRectangle({
      x: 0,
      y: 0,
      width: 600,
      height: 800,
      color: theme.bg,
    });

    // Decorative Accent Banner
    page.drawRectangle({
      x: 40,
      y: 720,
      width: 520,
      height: 40,
      color: theme.accent,
    });

    // Banner Text
    page.drawText(`${title.toUpperCase()} — SANDBOX PREVIEW`, {
      x: 60,
      y: 733,
      size: 14,
      font: boldFont,
      color: rgb(1, 1, 1),
    });

    // Header Title
    page.drawText(`Interactive Sample Page #${i}`, {
      x: 50,
      y: 650,
      size: 24,
      font: boldFont,
      color: theme.text,
    });

    // Page Purpose / Guide
    const guidelines = [
      `This PDF page was dynamically generated in your browser sandbox!`,
      `You can use this generated document to test:`,
      `  • PDF Merging: Combine this file with other sample PDFs`,
      `  • PDF Splitting: Extract this specific page (${i} of ${pageCount}) as a standalone PDF`,
      `  • 3D Rotation: Test custom page reorientation or rotate individual sheets`,
      `  • Interactive Watermarking: Adjust watermarks with live canvas overlays`,
      `  • Automated Page Numbering: Apply beautiful page counts in real time`
    ];

    let currentY = 580;
    guidelines.forEach(line => {
      page.drawText(line, {
        x: 50,
        y: currentY,
        size: 13,
        font: font,
        color: theme.text,
      });
      currentY -= 32;
    });

    // Standard footer
    page.drawText(`Created with love by Interactive PDF Suite (2026)  |  Page ${i} of ${pageCount}`, {
      x: 50,
      y: 40,
      size: 10,
      font: font,
      color: theme.text,
    });

    // Visual grid markings to see rotation clearly
    page.drawRectangle({
      x: 520,
      y: 50,
      width: 30,
      height: 30,
      color: theme.accent,
    });
    page.drawText("TOP", {
      x: 522,
      y: 70,
      size: 8,
      font: boldFont,
      color: rgb(1, 1, 1),
    });
  }

  const pdfBytes = await pdfDoc.save();
  const cleanName = title.toLowerCase().replace(/[^a-z0-9]/g, '_');
  return new File([pdfBytes], `${cleanName}_sample_${pageCount}p.pdf`, {
    type: 'application/pdf',
  });
}

/**
 * Extracts raw metadata and pagecount of an uploaded PDF file
 */
export async function getPdfInfo(file: File): Promise<{ pageCount: number; title: string; author: string }> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    return {
      pageCount: pdfDoc.getPageCount(),
      title: pdfDoc.getTitle() || '',
      author: pdfDoc.getAuthor() || '',
    };
  } catch (err) {
    console.error('Error reading PDF:', err);
    return { pageCount: 1, title: '', author: '' };
  }
}

/**
 * Dispatches a global event when a PDF is processed, so the Recent Files tracker updates dynamically.
 */
export function logProcessedFile(name: string, toolName: string, size?: number) {
  window.dispatchEvent(
    new CustomEvent('allrounder-pdf-processed', {
      detail: { name, toolName, size },
    })
  );
}
