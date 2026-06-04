import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Layers,
  RefreshCw,
  Type,
  Hash,
  Image as ImageIcon,
  FileSignature,
  ArrowLeft,
  Lock,
  Sparkles,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Menu,
  X,
  SlidersHorizontal,
  MonitorCheck,
  Instagram,
  Mail,
  Calendar,
  Building,
  Globe,
  ExternalLink,
  Scissors,
  Minimize2,
  Presentation,
  Table,
  FileEdit,
  PenTool,
  Image,
  Unlock,
  FolderTree,
  Archive,
  Wrench,
  ScanLine,
  Binary,
  GitCompare,
  Eraser,
  Crop,
  Database,
  Brain,
  Languages,
  CheckCircle,
  HelpCircle,
  Sparkle,
  ArrowUpRight,
  Workflow,
  FileDown,
  Palette,
  ClipboardList,
  BookOpen
} from 'lucide-react';

// Import our modular tool workflows
import MergeTool from './components/MergeTool';
import SplitTool from './components/SplitTool';
import RotateTool from './components/RotateTool';
import WatermarkTool from './components/WatermarkTool';
import NumberingTool from './components/NumberingTool';
import ImageToPdfTool from './components/ImageToPdfTool';
import TxtToPdfTool from './components/TxtToPdfTool';
import GenericTool from './components/GenericTool';

import { PDFTool, ToolCategory } from './types';

// Custom Serpent Coiled Logo to match the PixlVirex brand design
const SerpentLogo = ({ className = "w-10 h-10" }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    id="svg-serpent-virex-logo"
  >
    <defs>
      <linearGradient id="snakeNeonRed" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ff0000" />
        <stop offset="40%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#991b1b" />
      </linearGradient>
      <linearGradient id="blackScaleGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#334155" />
        <stop offset="100%" stopColor="#090d16" />
      </linearGradient>
      <filter id="virexNeonGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Clean document backing layout */}
    <rect x="22" y="16" width="56" height="72" rx="8" fill="#030712" stroke="url(#snakeNeonRed)" strokeWidth="2.5" />
    <path d="M38 34 H62 M38 46 H54 M38 58 H62" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="2.5" strokeLinecap="round" />
    
    {/* Coiled serpent weaving in-and-out of document mimicking the snake in PixlVirex */}
    <path 
      d="M50 8 C62 8 72 18 70 30 C68 40 56 46 48 50 C38 54 28 60 30 72 C32 84 46 92 56 90 C66 88 70 78 68 70" 
      stroke="url(#snakeNeonRed)" 
      strokeWidth="7.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      filter="url(#virexNeonGlow)"
    />
    
    {/* Inner metallic dark scale center line */}
    <path 
      d="M50 8 C62 8 72 18 70 30 C68 40 56 46 48 50 C38 54 28 60 30 72 C32 84 46 92 56 90" 
      stroke="url(#blackScaleGrad)" 
      strokeWidth="2.8" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    
    {/* Glowing Eye */}
    <circle cx="65" cy="74" r="1.5" fill="#fca5a5" />
  </svg>
);

const ACCENT_PRESETS = {
  indigo: {
    name: 'Hyper Indigo',
    textAccent: 'text-indigo-400',
    textAccentHover: 'group-hover:text-indigo-400',
    textLogo: 'ARP<span class="text-indigo-400">PDF</span>',
    btnPrimary: 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_20px_rgba(99,102,241,0.5)]',
    activeTab: 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]',
    cardBorder: 'hover:border-indigo-500/40',
    sidebarActive: 'bg-indigo-500/15 border-indigo-500/30 text-white',
    badge: 'text-indigo-300 bg-indigo-500/10 border-indigo-500/20',
    laserLine: 'bg-gradient-to-r from-transparent via-indigo-500 to-transparent',
    btnBackIcon: 'text-indigo-400',
    statsBadge: 'text-indigo-400',
    footerBg: 'bg-indigo-600/95',
    footerBtn: 'bg-indigo-950/40',
    accentText: 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400',
    orbClass1: 'bg-indigo-600/10',
    orbClass2: 'bg-purple-600/5',
  },
  emerald: {
    name: 'Cyber Emerald',
    textAccent: 'text-emerald-400',
    textAccentHover: 'group-hover:text-emerald-400',
    textLogo: 'ARP<span class="text-emerald-400">PDF</span>',
    btnPrimary: 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-[0_0_20px_rgba(16,185,129,0.5)]',
    activeTab: 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]',
    cardBorder: 'hover:border-emerald-500/40',
    sidebarActive: 'bg-emerald-500/15 border-emerald-500/30 text-white',
    badge: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
    laserLine: 'bg-gradient-to-r from-transparent via-emerald-500 to-transparent',
    btnBackIcon: 'text-emerald-400',
    statsBadge: 'text-emerald-400',
    footerBg: 'bg-emerald-600/90',
    footerBtn: 'bg-emerald-950/40',
    accentText: 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400',
    orbClass1: 'bg-emerald-600/10',
    orbClass2: 'bg-teal-600/5',
  },
  amber: {
    name: 'Solar Amber',
    textAccent: 'text-amber-400',
    textAccentHover: 'group-hover:text-amber-400',
    textLogo: 'ARP<span class="text-amber-400">PDF</span>',
    btnPrimary: 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-[0_0_20px_rgba(245,158,11,0.5)]',
    activeTab: 'bg-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]',
    cardBorder: 'hover:border-amber-500/40',
    sidebarActive: 'bg-amber-500/15 border-amber-500/30 text-white',
    badge: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
    laserLine: 'bg-gradient-to-r from-transparent via-amber-500 to-transparent',
    btnBackIcon: 'text-amber-400',
    statsBadge: 'text-amber-400',
    footerBg: 'bg-amber-600/90',
    footerBtn: 'bg-amber-950/40',
    accentText: 'text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400',
    orbClass1: 'bg-amber-600/10',
    orbClass2: 'bg-orange-600/5',
  },
  crimson: {
    name: 'Virex Red',
    textAccent: 'text-red-500',
    textAccentHover: 'group-hover:text-red-500',
    textLogo: 'AllRounder<span class="text-red-500">PDF</span>',
    btnPrimary: 'bg-gradient-to-br from-red-650 to-red-800 shadow-[0_0_25px_rgba(239,68,68,0.55)] border border-red-500/15',
    activeTab: 'bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]',
    cardBorder: 'hover:border-red-500/45',
    sidebarActive: 'bg-red-500/15 border-red-500/30 text-white',
    badge: 'text-red-300 bg-red-500/10 border-red-500/20',
    laserLine: 'bg-gradient-to-r from-transparent via-red-500 to-transparent',
    btnBackIcon: 'text-red-400',
    statsBadge: 'text-red-400',
    footerBg: 'bg-red-800/90',
    footerBtn: 'bg-red-950/40',
    accentText: 'text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-red-650',
    orbClass1: 'bg-red-600/10',
    orbClass2: 'bg-red-950/5',
  },
};

export default function App() {
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'All'>('All');
  const [accentColor, setAccentColor] = useState<keyof typeof ACCENT_PRESETS>('crimson');
  const [latticeGrid, setLatticeGrid] = useState(true);
  const laserScanActive = true;
  const [isSidebarOpenOnMobile, setIsSidebarOpenOnMobile] = useState(false);

  // Stateful interactive footer controls
  const [activeInfoPage, setActiveInfoPage] = useState<'features' | 'pricing' | 'faq' | 'about' | 'contact' | 'terms' | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditStatus, setAuditStatus] = useState<'idle' | 'scanning' | 'success'>('idle');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const colors = ACCENT_PRESETS[accentColor];

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText('raja.pandit1820@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const triggerSandboxAudit = () => {
    if (isAuditing) return;
    setIsAuditing(true);
    setAuditStatus('scanning');
    setTimeout(() => {
      setIsAuditing(false);
      setAuditStatus('success');
    }, 1800);
  };

  const tools: PDFTool[] = [
    {
      id: 'merge',
      name: 'Merge PDF',
      description: 'Combine PDFs in the order you want with the easiest PDF merger available.',
      icon: 'Layers',
      category: 'Organize',
      accentClass: 'from-blue-500/10 to-blue-600/5 hover:border-blue-400 border-blue-100/5 text-blue-400'
    },
    {
      id: 'split',
      name: 'Split PDF',
      description: 'Separate one page or a whole set for easy conversion into independent PDF files.',
      icon: 'Scissors',
      category: 'Organize',
      accentClass: 'from-orange-500/10 to-orange-600/5 hover:border-orange-400 border-orange-100/5 text-orange-400'
    },
    {
      id: 'compress',
      name: 'Compress PDF',
      description: 'Reduce file size while optimizing for maximal PDF quality.',
      icon: 'Minimize2',
      category: 'Organize',
      accentClass: 'from-amber-600/10 to-amber-700/5 hover:border-amber-450 border-amber-100/5 text-amber-400'
    },
    {
      id: 'pdf-to-word',
      name: 'PDF to Word',
      description: 'Easily convert your PDF files into easy to edit DOC and DOCX documents. The converted WORD document is almost 100% accurate.',
      icon: 'FileText',
      category: 'Convert From',
      accentClass: 'from-blue-500/10 to-blue-600/5 hover:border-blue-400 border-blue-100/5 text-blue-400'
    },
    {
      id: 'pdf-to-ppt',
      name: 'PDF to PowerPoint',
      description: 'Turn your PDF files into easy to edit PPT and PPTX slideshows.',
      icon: 'Presentation',
      category: 'Convert From',
      accentClass: 'from-red-500/10 to-red-600/5 hover:border-red-450 border-red-100/5 text-red-400'
    },
    {
      id: 'pdf-to-excel',
      name: 'PDF to Excel',
      description: 'Pull data straight from PDFs into Excel spreadsheets in a few short seconds.',
      icon: 'Table',
      category: 'Convert From',
      accentClass: 'from-emerald-500/10 to-emerald-600/5 hover:border-emerald-450 border-emerald-100/5 text-emerald-400'
    },
    {
      id: 'word-to-pdf',
      name: 'Word to PDF',
      description: 'Make DOC and DOCX files easy to read by converting them to PDF.',
      icon: 'FileText',
      category: 'Convert To',
      accentClass: 'from-blue-600/10 to-blue-700/5 hover:border-blue-500 border-blue-100/5 text-blue-400'
    },
    {
      id: 'ppt-to-pdf',
      name: 'PowerPoint to PDF',
      description: 'Make PPT and PPTX slideshows easy to view by converting them to PDF.',
      icon: 'Presentation',
      category: 'Convert To',
      accentClass: 'from-red-600/10 to-red-700/5 hover:border-red-500 border-red-100/5 text-red-400'
    },
    {
      id: 'excel-to-pdf',
      name: 'Excel to PDF',
      description: 'Make EXCEL spreadsheets easy to read by converting them to PDF.',
      icon: 'Table',
      category: 'Convert To',
      accentClass: 'from-emerald-600/10 to-emerald-700/5 hover:border-emerald-500 border-emerald-100/5 text-emerald-400'
    },
    {
      id: 'edit',
      name: 'Edit PDF',
      description: 'Add text, images, shapes or freehand annotations to a PDF document. Edit the size, font, and color of the added content.',
      icon: 'FileEdit',
      category: 'Content Edit',
      accentClass: 'from-indigo-500/10 to-indigo-600/5 hover:border-indigo-400 border-indigo-100/5 text-indigo-400'
    },
    {
      id: 'pdf-to-jpg',
      name: 'PDF to JPG',
      description: 'Convert each PDF page into a JPG or extract all images contained in a PDF.',
      icon: 'Image',
      category: 'Convert From',
      accentClass: 'from-rose-500/10 to-rose-600/5 hover:border-rose-450 border-rose-100/5 text-rose-400'
    },
    {
      id: 'image-to-pdf',
      name: 'JPG to PDF',
      description: 'Convert JPG images to PDF in seconds. Easily adjust orientation and margins.',
      icon: 'ImageIcon',
      category: 'Convert To',
      accentClass: 'from-teal-500/10 to-teal-600/5 hover:border-teal-400 border-teal-100/5 text-teal-400'
    },
    {
      id: 'sign',
      name: 'Sign PDF',
      description: 'Sign yourself or request electronic signatures from others.',
      icon: 'FileSignature',
      category: 'Security',
      accentClass: 'from-cyan-500/10 to-cyan-600/5 hover:border-cyan-400 border-cyan-100/5 text-cyan-400'
    },
    {
      id: 'watermark',
      name: 'Watermark',
      description: 'Stamp an image or text over your PDF in seconds. Choose the typography, transparency and position.',
      icon: 'Type',
      category: 'Content Edit',
      accentClass: 'from-amber-500/10 to-amber-600/5 hover:border-amber-400 border-amber-100/5 text-amber-400'
    },
    {
      id: 'rotate',
      name: 'Rotate PDF',
      description: 'Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!',
      icon: 'RefreshCw',
      category: 'Page Options',
      accentClass: 'from-yellow-500/10 to-yellow-600/5 hover:border-yellow-400 border-yellow-105/5 text-yellow-400'
    },
    {
      id: 'html-to-pdf',
      name: 'HTML to PDF',
      description: 'Convert webpages in HTML to PDF. Copy and paste the URL of the page you want and convert it to PDF with a click.',
      icon: 'Globe',
      category: 'Convert To',
      accentClass: 'from-violet-500/10 to-violet-600/5 hover:border-violet-400 border-violet-100/5 text-violet-400'
    },
    {
      id: 'unlock',
      name: 'Unlock PDF',
      description: 'Remove PDF password security, giving you the freedom to use your PDFs as you want.',
      icon: 'Unlock',
      category: 'Security',
      accentClass: 'from-rose-500/10 to-rose-600/5 hover:border-rose-450 border-rose-100/5 text-rose-400'
    },
    {
      id: 'protect',
      name: 'Protect PDF',
      description: 'Protect PDF files with a password. Encrypt PDF documents to prevent unauthorized access.',
      icon: 'Lock',
      category: 'Security',
      accentClass: 'from-emerald-500/10 to-emerald-600/5 hover:border-emerald-400 border-emerald-100/5 text-emerald-400'
    },
    {
      id: 'organize',
      name: 'Organize PDF',
      description: 'Sort pages of your PDF file however you like. Delete PDF pages or add PDF pages to your document at your convenience.',
      icon: 'FolderTree',
      category: 'Organize',
      accentClass: 'from-sky-500/10 to-sky-600/5 hover:border-sky-400 border-sky-100/5 text-sky-400'
    },
    {
      id: 'pdf-to-pdfa',
      name: 'PDF to PDF/A',
      description: 'Transform your PDF to PDF/A, the ISO-standardized version of PDF for long-term archiving. Your PDF will preserve formatting when accessed in the future.',
      icon: 'Archive',
      category: 'Convert From',
      accentClass: 'from-violet-500/10 to-violet-600/5 hover:border-violet-400 border-violet-100/5 text-violet-400'
    },
    {
      id: 'repair',
      name: 'Repair PDF',
      description: 'Repair a damaged PDF and recover data from corrupt PDF. Fix PDF files with our Repair tool.',
      icon: 'Wrench',
      category: 'Organize',
      accentClass: 'from-red-500/10 to-red-650/5 hover:border-red-400 border-red-100/5 text-red-500'
    },
    {
      id: 'numbering',
      name: 'Page numbers',
      description: 'Add page numbers into PDFs with ease. Choose your positions, dimensions, typography.',
      icon: 'Hash',
      category: 'Page Options',
      accentClass: 'from-purple-500/10 to-purple-650/5 hover:border-purple-400 border-purple-100/5 text-purple-400'
    },
    {
      id: 'scan-to-pdf',
      name: 'Scan to PDF',
      description: 'Capture document scans from your mobile device and send them instantly to your browser.',
      icon: 'ScanLine',
      category: 'Creation',
      accentClass: 'from-pink-500/10 to-pink-600/5 hover:border-pink-400 border-pink-100/5 text-pink-400'
    },
    {
      id: 'ocr-pdf',
      name: 'OCR PDF',
      description: 'Easily convert scanned PDF into searchable and selectable documents.',
      icon: 'Binary',
      category: 'Content Edit',
      accentClass: 'from-sky-500/10 to-sky-605/5 hover:border-sky-400 border-sky-100/5 text-sky-450'
    },
    {
      id: 'compare-pdf',
      name: 'Compare PDF',
      description: 'Show a side-by-side document comparison and easily spot changes between different file versions.',
      icon: 'GitCompare',
      category: 'Content Edit',
      accentClass: 'from-fuchsia-500/10 to-fuchsia-605/5 hover:border-fuchsia-400 border-fuchsia-100/5 text-fuchsia-450'
    },
    {
      id: 'redact-pdf',
      name: 'Redact PDF',
      description: 'Redact text and graphics to permanently remove sensitive information from a PDF.',
      icon: 'Eraser',
      category: 'Security',
      accentClass: 'from-indigo-500/10 to-indigo-605/5 hover:border-indigo-400 border-indigo-100/5 text-indigo-450'
    },
    {
      id: 'crop-pdf',
      name: 'Crop PDF',
      description: 'Crop margins of PDF documents or select specific areas, then apply the changes to one page or the whole document.',
      icon: 'Crop',
      category: 'Page Options',
      accentClass: 'from-teal-500/10 to-teal-605/5 hover:border-teal-400 border-teal-100/5 text-teal-450'
    },
    {
      id: 'pdf-forms',
      name: 'PDF Forms',
      description: 'Detect form fields automatically, create interactive fillable PDFs, or fill PDF forms yourself. Add text fields, checkboxes, multiple choice fields, and lists.',
      icon: 'Database',
      category: 'Content Edit',
      accentClass: 'from-orange-500/10 to-orange-605/5 hover:border-orange-400 border-orange-100/5 text-orange-450',
      badge: 'New!'
    },
    {
      id: 'ai-summarizer',
      name: 'AI Summarizer',
      description: 'Quickly generate concise summaries from articles, paragraphs, and essays, providing clear and precise key points in seconds.',
      icon: 'Brain',
      category: 'Content Edit',
      accentClass: 'from-violet-500/10 to-violet-605/5 hover:border-violet-400 border-violet-100/5 text-violet-450',
      badge: 'New!'
    },
    {
      id: 'translate-pdf',
      name: 'Translate PDF',
      description: 'Easily translate PDF files powered by AI. Keep fonts, layout, and formatting perfectly intact.',
      icon: 'Languages',
      category: 'Convert From',
      accentClass: 'from-indigo-500/10 to-indigo-605/5 hover:border-indigo-400 border-indigo-100/5 text-indigo-450',
      badge: 'New!'
    },
    {
      id: 'txt-to-pdf',
      name: 'TXT to PDF',
      description: 'Create clean PDF documents from plain text files or directly type your content.',
      icon: 'FileSignature',
      category: 'Creation',
      accentClass: 'from-zinc-500/10 to-zinc-650/5 hover:border-zinc-400 border-zinc-150/5 text-zinc-300'
    },
    {
      id: 'flatten',
      name: 'Flatten PDF',
      description: 'Convert interactive form fields, checkboxes, and annotations into flattened visual shapes to prevent further editing.',
      icon: 'FileDown',
      category: 'Security',
      accentClass: 'from-blue-600/10 to-blue-700/5 hover:border-blue-400 border-blue-100/5 text-blue-400',
      badge: 'PRO'
    },
    {
      id: 'grayscale',
      name: 'Grayscale PDF',
      description: 'Transform colored vector graphics, plain text, and high quality photos to monochrome grayscale to save printer ink.',
      icon: 'Palette',
      category: 'Page Options',
      accentClass: 'from-neutral-500/10 to-neutral-600/5 hover:border-neutral-400 border-neutral-100/5 text-neutral-300'
    },
    {
      id: 'markdown-to-pdf',
      name: 'Markdown to PDF',
      description: 'Directly render pure Markdown code blocks or plain text sheets into fully formatted PDF sheets.',
      icon: 'BookOpen',
      category: 'Creation',
      accentClass: 'from-emerald-500/10 to-emerald-600/5 hover:border-emerald-400 border-emerald-100/5 text-emerald-400',
      badge: 'New!'
    },
    {
      id: 'extract-pages',
      name: 'Extract Pages',
      description: 'Surgically select and partition out customized page index sets or sequences of your PDF into an independent file.',
      icon: 'ClipboardList',
      category: 'Page Options',
      accentClass: 'from-orange-500/10 to-orange-650/5 hover:border-orange-400 border-orange-100/5 text-orange-400'
    },
    {
      id: 'docx-to-pdf',
      name: 'DOCX to PDF',
      description: 'Convert DOCX Word documents into standard portable PDF files locally.',
      icon: 'FileDown',
      category: 'Convert To',
      accentClass: 'from-sky-500/10 to-sky-600/5 hover:border-sky-400 border-sky-100/5 text-sky-400',
      badge: 'Free'
    },
    {
      id: 'pdf-to-docx',
      name: 'PDF to DOCX',
      description: 'Convert your PDF files into easy to edit DOCX office files without losing alignment.',
      icon: 'FileText',
      category: 'Convert From',
      accentClass: 'from-blue-500/10 to-blue-600/5 hover:border-blue-400 border-blue-100/5 text-blue-400',
      badge: 'Free'
    },
    {
      id: 'image-to-docx',
      name: 'Image to DOCX',
      description: 'Extract text layout properties from pictures directly into customizable DOCX sheets.',
      icon: 'Binary',
      category: 'Convert From',
      accentClass: 'from-violet-500/10 to-violet-600/5 hover:border-violet-400 border-violet-100/5 text-violet-400',
      badge: 'Free'
    },
    {
      id: 'docx-to-image',
      name: 'DOCX to Image',
      description: 'Transform Microsoft Word DOCX pages into crisp, high-resolution graphic assets.',
      icon: 'Image',
      category: 'Convert From',
      accentClass: 'from-amber-500/10 to-amber-600/5 hover:border-amber-400 border-amber-100/5 text-amber-400',
      badge: 'Free'
    },
    {
      id: 'png-to-jpg',
      name: 'PNG to JPG',
      description: 'Transform PNG file channels with transparent values into optimized JPG format.',
      icon: 'Image',
      category: 'Convert From',
      accentClass: 'from-rose-500/10 to-rose-600/5 hover:border-rose-400 border-rose-100/5 text-rose-400',
      badge: 'Free'
    },
    {
      id: 'jpg-to-png',
      name: 'JPG to PNG',
      description: 'Convert compressed JPG assets into transparent portable PNG structures.',
      icon: 'Image',
      category: 'Convert From',
      accentClass: 'from-teal-500/10 to-teal-605/5 hover:border-teal-400 border-teal-100/5 text-teal-400',
      badge: 'Free'
    }
  ];

  const getIconComponent = (iconName: string) => {
    const cls = "w-6 h-6 shrink-0 transition-transform duration-300 group-hover:scale-110";
    switch (iconName) {
      case 'Layers': return <Layers className={cls} />;
      case 'Scissors': return <Scissors className={cls} />;
      case 'Minimize2': return <Minimize2 className={cls} />;
      case 'FileText': return <FileText className={cls} />;
      case 'Presentation': return <Presentation className={cls} />;
      case 'Table': return <Table className={cls} />;
      case 'FileEdit': return <FileEdit className={cls} />;
      case 'Image': return <Image className={cls} />;
      case 'ImageIcon': return <ImageIcon className={cls} />;
      case 'FileSignature': return <FileSignature className={cls} />;
      case 'Type': return <Type className={cls} />;
      case 'RefreshCw': return <RefreshCw className={cls} />;
      case 'Globe': return <Globe className={cls} />;
      case 'Unlock': return <Unlock className={cls} />;
      case 'Lock': return <Lock className={cls} />;
      case 'FolderTree': return <FolderTree className={cls} />;
      case 'Archive': return <Archive className={cls} />;
      case 'Wrench': return <Wrench className={cls} />;
      case 'Hash': return <Hash className={cls} />;
      case 'ScanLine': return <ScanLine className={cls} />;
      case 'Binary': return <Binary className={cls} />;
      case 'GitCompare': return <GitCompare className={cls} />;
      case 'Eraser': return <Eraser className={cls} />;
      case 'Crop': return <Crop className={cls} />;
      case 'Database': return <Database className={cls} />;
      case 'Brain': return <Brain className={cls} />;
      case 'Languages': return <Languages className={cls} />;
      case 'FileDown': return <FileDown className={cls} />;
      case 'Palette': return <Palette className={cls} />;
      case 'BookOpen': return <BookOpen className={cls} />;
      case 'ClipboardList': return <ClipboardList className={cls} />;
      default: return <FileText className={cls} />;
    }
  };

  const filteredTools = activeCategory === 'All'
    ? tools
    : tools.filter(t => t.category === activeCategory);

  const selectedTool = tools.find(t => t.id === selectedToolId);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-white flex flex-col relative overflow-x-hidden theme-immersive-dark">
      
      {/* Background radial atmosphere glow orbs */}
      <div className={`absolute top-1/4 left-1/4 w-96 h-96 ${colors.orbClass1} rounded-full blur-[130px] pointer-events-none transition-all duration-700`} />
      <div className={`absolute bottom-1/4 right-1/4 w-80 h-80 ${colors.orbClass2} rounded-full blur-[110px] pointer-events-none transition-all duration-700`} />

      {/* Premium Header Rail */}
      <header className="bg-slate-950/60 backdrop-blur-md sticky top-0 z-50 border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center relative cursor-pointer" onClick={() => { setSelectedToolId(null); setActiveInfoPage(null); }}>
              <SerpentLogo className="w-11 h-11 transition-transform duration-500 hover:scale-105" />
            </div>
            <div className="text-left" onClick={() => { setSelectedToolId(null); setActiveInfoPage(null); }}>
              <span className="font-display font-black text-2xl tracking-tighter text-white leading-none block cursor-pointer uppercase flex items-center gap-1.5">
                {selectedToolId ? 'ARP ' : 'ALL ROUNDER '}<span className={`${colors.textAccent} transition-colors duration-500`}>{selectedToolId ? selectedToolId.toUpperCase() : 'PDF'}</span>
              </span>
              <span className={`text-[9px] font-mono font-bold ${colors.badge} px-2 py-0.5 rounded mt-1 inline-block uppercase tracking-wider transition-all duration-500`}>
                ✦ SECURE OFFLINE EDITOR
              </span>
            </div>
          </div>

          {/* Premium Status HUD - Format Header Controls Properly */}
          <div className="hidden md:flex items-center gap-3 bg-slate-950/60 p-1 rounded-2xl border border-white/5 shadow-inner">
            <button
              onClick={() => { setSelectedToolId(null); setActiveInfoPage(null); }}
              className="text-[10px] font-mono tracking-wider font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 px-3.5 py-2 rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              DASHBOARD CONTROL
            </button>
            
            <div className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/10 rounded-xl px-3.5 py-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-mono font-bold text-emerald-400 tracking-wider">FULL LOCAL ISOLATION</span>
            </div>
            
            <div className="flex items-center gap-2 bg-red-500/15 border border-red-500/25 rounded-xl px-3.5 py-2 text-red-400">
              <CheckCircle2 className="w-3.5 h-3.5 animate-pulse text-red-500" />
              <span className="text-[10px] font-mono font-bold tracking-wider">
                SCANNER: ALWAYS ACTIVE
              </span>
            </div>
          </div>

          {/* Mobile Burger Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setIsSidebarOpenOnMobile(!isSidebarOpenOnMobile)}
              type="button"
              className="p-2 bg-slate-900/60 border border-white/10 text-slate-300 hover:text-white rounded-lg transition-all duration-200 cursor-pointer"
            >
              {isSidebarOpenOnMobile ? <X className="w-5 h-5 text-rose-400" /> : <Menu className={`w-5 h-5 ${colors.textAccent}`} />}
            </button>
          </div>
        </div>
      </header>

      {/* Double Column Core Workspace Layout */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto relative z-10">
        
        {/* Navigation Left Sidebar Panel (Desktop: Sidebar, Mobile: Sliding Drawer) */}
        <aside className={`${isSidebarOpenOnMobile ? 'fixed inset-y-0 left-0 z-40 w-72 bg-slate-950/95 border-r border-white/10 p-6 flex flex-col gap-6 pt-24 backdrop-blur-lg shadow-2xl' : 'hidden lg:flex w-72 shrink-0 border-r border-white/5 bg-slate-950/20 p-6 flex-col gap-6 relative'} transition-all duration-350`}>
          
          {/* Mobile-Visible and Elegant Unified Controls Console */}
          <div className="border border-white/10 p-4 rounded-2xl bg-slate-900/60 backdrop-blur shadow-inner space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
                <SlidersHorizontal className={`w-3.5 h-3.5 ${colors.textAccent}`} /> ENGINE STATUS
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>

            <div className="space-y-2 text-xs">
              {/* Dashboard Control Toggle */}
              <button
                type="button"
                onClick={() => { setSelectedToolId(null); setIsSidebarOpenOnMobile(false); setActiveInfoPage(null); }}
                className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 flex items-center justify-between text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  <span className="font-semibold font-mono text-[10px]">DASHBOARD CONTROL</span>
                </div>
                <span className="text-[8px] font-mono text-slate-400 border border-white/10 px-1.5 py-0.5 rounded uppercase">HOME</span>
              </button>

              {/* Full Local Isolation Display */}
              <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between text-emerald-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span className="font-semibold font-mono text-[10px]">LOCAL ISOLATION</span>
                </div>
                <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase font-bold">SECURE</span>
              </div>

              {/* Scanner Status Display */}
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-between text-red-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 animate-pulse text-red-500" />
                  <span className="font-semibold font-mono text-[10px]">SCANNER STATUS</span>
                </div>
                <span className="text-[8px] font-mono font-bold px-2 py-0.5 bg-red-500/15 border border-red-500/30 text-red-400 rounded uppercase">
                  ALWAYS ACTIVE
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-mono">
              PDF Toolbox
            </div>
            <div className="space-y-1.5">
              {/* Dashboard Toggle Link */}
              <button
                type="button"
                onClick={() => { setSelectedToolId(null); setIsSidebarOpenOnMobile(false); setActiveInfoPage(null); }}
                className={`w-full p-3.5 rounded-xl border flex items-center gap-3 text-left transition-all cursor-pointer ${
                  selectedToolId === null && activeInfoPage === null
                    ? `${colors.sidebarActive} font-semibold shadow-lg`
                    : 'border-transparent bg-white/5 hover:bg-white/10 hover:text-white text-slate-300'
                }`}
              >
                <Sparkles className={`w-4 h-4 shrink-0 ${selectedToolId === null ? `${colors.textAccent} animate-pulse` : 'text-slate-400'}`} />
                <span className="text-xs font-mono font-bold tracking-wide">Workspace Control</span>
              </button>

              {/* Map actual tools */}
              {tools.map((t) => {
                const isActive = selectedToolId === t.id && activeInfoPage === null;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => { setSelectedToolId(t.id); setIsSidebarOpenOnMobile(false); setActiveInfoPage(null); }}
                    className={`w-full p-3.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                      isActive
                        ? `${colors.sidebarActive} font-semibold shadow-lg`
                        : 'border-transparent bg-white/5 hover:bg-white/10 hover:text-white text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {isActive ? (
                        <div className={`w-1.5 h-1.5 ${colors.textAccent.replace('text', 'bg')} rounded-full animate-pulse shrink-0`} />
                      ) : (
                        <div className="w-1.5 h-1.5 bg-slate-700 rounded-full shrink-0" />
                      )}
                      <span className="text-xs truncate">{t.name}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-auto">
            <div className="p-4 rounded-xl bg-gradient-to-tr from-slate-950/85 to-slate-900/40 border border-white/5 shadow-lg relative overflow-hidden">
              {/* Privacy Shield */}
              <div className={`absolute top-0 left-0 w-full h-[1px] ${colors.laserLine}`}></div>
              <p className="text-[9px] font-mono text-slate-500 font-bold mb-1 tracking-widest uppercase">Privacy Guarantee</p>
              <div className="flex justify-between items-end">
                <span className="text-[10.5px] font-bold text-white font-mono uppercase">Offline Mode</span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">Safe & Private</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile drawer click away mask */}
        {isSidebarOpenOnMobile && (
          <div
            onClick={() => setIsSidebarOpenOnMobile(false)}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity cursor-pointer animate-fade-in"
          />
        )}

        {/* Central Action Zone (Self-adaptive Workspace Container) */}
        <main className="flex-1 min-w-0 px-4 py-8 sm:p-6 lg:p-10 flex flex-col justify-start relative">
          <AnimatePresence mode="wait">
            {activeInfoPage ? (
              /* Immersive Sub-Page Workspace */
              <motion.div
                key={`infopage-${activeInfoPage}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Back Button Panel */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/50 backdrop-blur-md p-5 border border-white/10 rounded-3xl shadow-lg relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-full h-[1px] ${colors.laserLine} opacity-60`}></div>
                  <button
                    type="button"
                    onClick={() => setActiveInfoPage(null)}
                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] shadow-md shrink-0"
                  >
                    <ArrowLeft className={`w-4 h-4 ${colors.btnBackIcon}`} /> Back to Dashboard
                  </button>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block font-mono">
                      INFO REGISTRY MODULE
                    </span>
                    <span className="h-4 w-[1px] bg-white/10" />
                    <span className={`text-xs font-semibold px-3 py-1 ${colors.badge} rounded-full flex items-center gap-1 shadow-sm uppercase font-mono`}>
                      {activeInfoPage}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 sm:p-10 shadow-2xl relative overflow-hidden space-y-8 text-left">
                  <div className={`absolute top-0 left-0 w-full h-[1.5px] ${colors.laserLine}`}></div>

                  {activeInfoPage === 'about' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-indigo-400 font-mono tracking-widest uppercase block">✦ GLOBAL MISSION</span>
                        <h2 className="text-3xl font-black text-white tracking-tight leading-none uppercase">ABOUT ALLROUNDERPDF</h2>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-3xl">
                          AllRounderPDF is built with a singular design vision: to deliver a comprehensive, hyper-optimized, sandboxed environment for your documents. We believe formatting, security, and editing should not mean sacrificing custody of your confidential files.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                          <h3 className="font-bold text-white text-sm">100% Client-Side Integrity</h3>
                          <p className="text-slate-400 text-xs leading-relaxed">
                            Unlike traditional cloud editors that upload files to insecure databases, AllRounderPDF works directly on browser memory buffer pipelines. Your data never leaves your computer, ensuring total isolation.
                          </p>
                        </div>
                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                          <h3 className="font-bold text-white text-sm">Engineered for Latency-Free Downloads</h3>
                          <p className="text-slate-400 text-xs leading-relaxed">
                            WebAssembly and modern hardware memory APIs compile formats on-device instantly. This results in immediate download speeds and secure operations.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeInfoPage === 'contact' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-indigo-400 font-mono tracking-widest uppercase block">✦ SECURE GATEWAY</span>
                        <h2 className="text-3xl font-black text-white tracking-tight leading-none uppercase">CONTACT CHANNELS</h2>
                        <p className="text-slate-400 text-sm leading-relaxed">
                          For security inquiries, code audits, commercial partnerships, or custom integrations, feel free to contact us through any of the channels below.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                        {/* Email Card */}
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition duration-300 space-y-3 flex flex-col justify-between">
                          <div className="space-y-3">
                            <Mail className="w-6 h-6 text-indigo-400" />
                            <div className="space-y-1">
                              <h4 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Email Address</h4>
                              <p className="text-xs font-bold text-white select-all break-all">raja.pandit1820@gmail.com</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText('raja.pandit1820@gmail.com');
                              setCopiedEmail(true);
                              setTimeout(() => setCopiedEmail(false), 2000);
                            }}
                            className="text-[10px] bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg text-slate-300 font-mono hover:text-white transition cursor-pointer self-start animate-fade-in"
                          >
                            {copiedEmail ? 'Copied!' : 'Copy Email'}
                          </button>
                        </div>

                        {/* Phone Card */}
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition duration-300 space-y-3 flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="w-6 h-6 flex items-center justify-center text-indigo-400">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Phone Support</h4>
                              <p className="text-xs font-bold text-white select-all">9675479825</p>
                            </div>
                          </div>
                          <a
                            href="tel:9675479825"
                            className="inline-block text-[10px] bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg text-slate-300 font-mono hover:text-white transition text-center self-start"
                          >
                            Call Support
                          </a>
                        </div>

                        {/* Instagram Card */}
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition duration-300 space-y-3 flex flex-col justify-between">
                          <div className="space-y-3">
                            <Instagram className="w-6 h-6 text-indigo-400" />
                            <div className="space-y-1">
                              <h4 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Instagram ID</h4>
                              <p className="text-xs font-bold text-white">@rajapandiitt</p>
                            </div>
                          </div>
                          <a
                            href="https://instagram.com/rajapandiitt"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-[10px] bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg text-slate-300 font-mono text-center hover:text-white transition self-start"
                          >
                            Open Instagram
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeInfoPage === 'pricing' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-indigo-400 font-mono tracking-widest uppercase block">✦ ALLROUNDER FREEMIUM</span>
                        <h2 className="text-3xl font-black text-white tracking-tight leading-none uppercase">PRICING POLICY: 100% FREE</h2>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-3xl">
                          AllRounderPDF is built on the principle of open-access software. There are absolutely no subscriptions, hidden limits, processing queue delays, or premium features. Every single tool in our arsenal is 100% free forever.
                        </p>
                      </div>

                      <div className="p-8 rounded-3xl bg-indigo-500/5 border border-indigo-500/25 max-w-xl space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h3 className="text-lg font-bold text-white">Unlimited Secure License</h3>
                            <span className="text-[9px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded tracking-wide uppercase">ACTIVE COMPLEMENTARY PASS</span>
                          </div>
                          <div className="text-right">
                            <span className="text-3xl font-black text-white">$0.00</span>
                            <span className="text-[10px] text-slate-400 font-mono block">FOREVER FREE</span>
                          </div>
                        </div>

                        <div className="space-y-2.5 pt-4 border-t border-white/5 text-xs text-slate-300">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            <span>Unlimited conversions, merges, and splits</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            <span>Full offline client-side safety integration</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            <span>Access to all conversion types (Word, Markdown, HTML, PPT, etc.)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            <span>No registration or credit card information required</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeInfoPage === 'faq' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-indigo-400 font-mono tracking-widest uppercase block">✦ FREQUENTLY ASKED QUESTIONS</span>
                        <h2 className="text-3xl font-black text-white tracking-tight leading-none uppercase">KNOWLEDGE BASE</h2>
                      </div>

                      <div className="space-y-4 pt-2">
                        {[
                          {
                            q: 'Is AllRounderPDF completely free to use?',
                            a: 'Yes, AllRounderPDF is 100% free with absolutely no hidden subscription costs, limits, premium tiers, or registration requests.'
                          },
                          {
                            q: 'How are my uploaded PDF files processed?',
                            a: 'Your files are processed directly inside your browser memory buffer context. They are never transmitted over the internet or uploaded to any third-party server. This is AllRounderPDF\'s offline local-first privacy standard.'
                          },
                          {
                            q: 'What is the role of the security scanner?',
                            a: 'Our local browser static scanner is always active to automatically check document structure headers, scanning for malicious payloads or exploits. This ensures that parsing files inside your local machine occurs under tight, secure isolation parameters.'
                          },
                          {
                            q: 'Are there file size or count limits?',
                            a: 'No! There are no artificial limits placed on files. Your browser\'s hardware memory capacity (RAM) is the only limiting factor. This is why our engine is designed for efficient zero-latency compression.'
                          }
                        ].map((faqItem, i) => (
                          <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                            <h3 className="font-semibold text-white text-sm flex items-center gap-2 font-mono">
                              <HelpCircle className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                              {faqItem.q}
                            </h3>
                            <p className="text-slate-400 text-xs leading-relaxed pl-6">{faqItem.a}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeInfoPage === 'terms' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-indigo-400 font-mono tracking-widest uppercase block">✦ SYSTEM LEGAL AGREEMENT</span>
                        <h2 className="text-3xl font-black text-white tracking-tight leading-none uppercase">TERMS AND CONDITIONS & PRIVACY POLICY</h2>
                        <span className="text-[10px] text-slate-500 font-mono block">LAST MODIFIED: JUNE 2026</span>
                      </div>

                      <div className="space-y-5 text-xs text-slate-400 leading-relaxed font-mono">
                        <p className="font-sans text-sm text-slate-350">
                          By accessing AllRounderPDF, you agree to the following system-level conditions and secure client-side computing policy:
                        </p>

                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3.5">
                          <div>
                            <h4 className="font-bold text-white text-xs uppercase mb-1">1. Full Local Custody Policy</h4>
                            <p className="leading-normal text-slate-400 font-sans">
                              All conversion, security filtering, splitting, and merging steps are completed inside your browser sandbox. We do not transmit or cache any documents onto web databases. Files are entirely yours.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-xs uppercase mb-1">2. No-Liability Sandbox Constraint</h4>
                            <p className="leading-normal text-slate-400 font-sans">
                              The processing systems are delivered "as-is" without representations or warranties. Since all operations run entirely in local client memory, we do not accept responsibility for browser timeouts or hardware limitations during highly complex compilations.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-xs uppercase mb-1">3. Permitted Sandbox Operations</h4>
                            <p className="leading-normal text-slate-400 font-sans">
                              Users may process documents for personal, commercial, or academic activities with zero restriction, completely free. No automation or scrapers are allowed with our local frontend elements.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-xs uppercase mb-1">4. Cookies and Telemetry</h4>
                            <p className="leading-normal text-slate-400 font-sans">
                              AllRounderPDF does not employ tracking cookies or telemetry beacons. All states are stored cleanly inside ephemeral local memory and are destroyed when the browser window is closed.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeInfoPage === 'features' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-indigo-400 font-mono tracking-widest uppercase block">✦ TOOL REGISTRY INDEX</span>
                        <h2 className="text-3xl font-black text-white tracking-tight leading-none uppercase">ALL PAGES & FUNCTIONAL MODULES</h2>
                        <p className="text-slate-400 text-sm leading-relaxed">
                          Click directly on any tool below to launch its workspace container and start editing securely.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                        {tools.map((t) => (
                          <div
                            key={t.id}
                            onClick={() => {
                              setSelectedToolId(t.id);
                              setActiveInfoPage(null);
                            }}
                            className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/30 hover:bg-white/10 transition-all duration-300 cursor-pointer space-y-2 text-left"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white">{t.name}</span>
                              <span className="text-[9px] font-mono font-bold text-slate-500 bg-white/5 px-2 py-0.5 rounded uppercase">
                                {t.category}
                              </span>
                            </div>
                            <p className="text-[10.5px] text-slate-400 leading-snug line-clamp-2">{t.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </motion.div>
            ) : !selectedToolId ? (
              /* Dashboard View */
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-10"
              >
                {/* Massive Hero Section */}
                <div 
                  id="hero-container"
                  className={`relative bg-gradient-to-b from-slate-900/50 to-slate-950/10 border border-white/10 rounded-[32px] p-6 sm:p-10 text-center shadow-2xl overflow-hidden ${latticeGrid ? 'bg-dot-grid transition-all duration-500' : 'transition-all duration-500'}`}
                  style={{ contentVisibility: 'auto' }}
                >
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 ${colors.orbClass1.replace('/10', '/15')} blur-3xl rounded-full pointer-events-none transition-all duration-750`} />

                  {/* Decorative background Serpent Logo wrapping overlay behind text */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.07] pointer-events-none select-none scale-150 rotate-12 transition-all duration-700">
                    <SerpentLogo className="w-96 h-96" />
                  </div>

                  {/* Animated HUD Laser line */}
                  {laserScanActive && (
                    <div className={`absolute left-0 right-0 top-0 h-[2px] ${colors.laserLine} opacity-80 animate-[laserScan_7s_infinite_linear] pointer-events-none`} />
                  )}

                  <div className="relative space-y-5 max-w-3xl mx-auto">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-widest ${colors.badge} px-3 py-1 rounded-full uppercase transition-all duration-500`}>
                      <Sparkles className={`w-3 h-3 ${colors.textAccent} animate-pulse`} /> Private & Offline-First PDF Suite
                    </span>
                    
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-[1.05] italic max-w-3xl mx-auto">
                      All-in-one solution for <span className={`${colors.accentText} transition-all duration-500`}>editing, converting, and managing PDFs</span>
                    </h1>

                    <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
                      Free and easy PDF tools, all in one place. Do it all—merge, split, compress, convert, rotate, unlock, and watermark PDFs in just a few clicks.
                    </p>
                  </div>
                </div>

                {/* Grid Filter Options */}
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-4 border-b border-white/10 pb-4">
                    
                    <div className="flex flex-wrap gap-1 bg-white/5 p-1 rounded-xl border border-white/10 justify-center">
                      {(['All', 'Organize', 'Convert From', 'Convert To', 'Content Edit', 'Page Options', 'Security', 'Creation'] as const).map((cat) => (
                        <button
                          key={cat}
                          id={`btn-tab-category-${cat.replace(/\s+/g, '-')}`}
                          type="button"
                          onClick={() => setActiveCategory(cat as any)}
                          className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                            activeCategory === cat
                              ? `${colors.activeTab} transition-all duration-350`
                              : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* AllRounderPDF Simple Tool Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredTools.map((tool) => (
                      <motion.div
                        key={tool.id}
                        id={`bento-card-${tool.id}`}
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedToolId(tool.id)}
                        className={`group bg-slate-900/50 hover:bg-slate-900/90 border border-white/5 hover:border-white/25 rounded-2xl p-5 text-left cursor-pointer transition-all duration-200 flex flex-col justify-between min-h-[145px] relative overflow-hidden shadow-md`}
                      >
                        <div className="space-y-3.5 relative z-10">
                          {/* Header layout: simple left icon & eventual clean small corner badge */}
                          <div className="flex items-start justify-between">
                            <div className={`p-2 bg-white/5 border border-white/10 rounded-xl transition duration-300 ${tool.accentClass.split(' ').pop() || 'text-indigo-400'}`}>
                              {getIconComponent(tool.icon)}
                            </div>
                            
                            {tool.badge && (
                              <span className="text-[8px] font-bold px-2 py-0.5 bg-gradient-to-r from-pink-500 to-rose-650 text-white rounded-md uppercase tracking-wider animate-pulse">
                                {tool.badge}
                              </span>
                            )}
                          </div>

                          <div>
                            <h3 className="font-display font-extrabold text-white text-sm tracking-tight leading-snug group-hover:text-white transition-colors">
                              {tool.name}
                            </h3>
                            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed line-clamp-3">
                              {tool.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                </div>
              </motion.div>
            ) : (
              /* Immersive Tool Workspace Panel */
              <motion.div
                key="workspace"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Back Button Panel */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/50 backdrop-blur-md p-5 border border-white/10 rounded-3xl shadow-lg relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-full h-[1px] ${colors.laserLine} opacity-60`}></div>
                  <button
                    id="btn-back-to-workspace"
                    type="button"
                    onClick={() => setSelectedToolId(null)}
                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] shadow-md shrink-0 animate-fade-in"
                  >
                    <ArrowLeft className={`w-4 h-4 ${colors.btnBackIcon}`} /> Back to Dashboard
                  </button>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block font-mono">
                      Active Engine: {selectedTool?.name}
                    </span>
                    <span className="h-4 w-[1px] bg-white/10" />
                    <span className={`text-xs font-semibold px-3 py-1 ${colors.badge} rounded-full flex items-center gap-1 shadow-sm transition-all duration-500`}>
                      <Lock className={`w-3.5 h-3.5 ${colors.textAccent}`} /> Sandbox Secure
                    </span>
                  </div>
                </div>

                {/* Embed Selected Workflow with Dark Overrides applied */}
                <div 
                  id="tool-panel-frame"
                  className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 md:p-8 shadow-2xl relative overflow-hidden theme-immersive-dark"
                  style={{ contentVisibility: 'auto' }}
                >
                  {/* Glowing Laser Scan overlay line at the top border */}
                  <div className={`absolute top-0 left-0 w-full h-[1.5px] ${colors.laserLine} transition-all duration-500`}></div>
                  
                  {selectedToolId === 'merge' && <MergeTool />}
                  {selectedToolId === 'split' && <SplitTool />}
                  {selectedToolId === 'rotate' && <RotateTool />}
                  {selectedToolId === 'watermark' && <WatermarkTool />}
                  {selectedToolId === 'numbering' && <NumberingTool />}
                  {selectedToolId === 'image-to-pdf' && <ImageToPdfTool />}
                  {selectedToolId === 'txt-to-pdf' && <TxtToPdfTool />}
                  {!['merge', 'split', 'rotate', 'watermark', 'numbering', 'image-to-pdf', 'txt-to-pdf'].includes(selectedToolId || '') && (
                    <GenericTool 
                      toolId={selectedToolId || ''} 
                      colors={colors} 
                      getIconComponent={getIconComponent} 
                      tools={tools} 
                    />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* High-Tech Interactive Cockpit Footer Suite - Sleek Boxed Layout */}
      <footer id="main-app-footer" className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 pt-4 relative z-20 transition-all duration-300">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 sm:p-10 shadow-2xl space-y-8">
          
          {/* Main 5-Column Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 border-b border-white/5 pb-8">
            
            {/* Column 1: Product */}
            <div className="space-y-3.5 text-left">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Product</h4>
              <ul className="space-y-2 text-[11px] text-slate-400 font-medium">
                <li><button onClick={() => { setSelectedToolId(null); setActiveInfoPage(null); }} className="hover:text-white transition-colors cursor-pointer text-left block">Home</button></li>
                <li><button onClick={() => setActiveInfoPage('features')} className="hover:text-white transition-colors cursor-pointer text-left block">Features</button></li>
                <li><button onClick={() => setActiveInfoPage('pricing')} className="hover:text-white transition-colors cursor-pointer text-left block">Pricing</button></li>
                <li><button onClick={() => { setSelectedToolId(null); setActiveInfoPage(null); }} className="hover:text-white transition-colors cursor-pointer font-bold text-indigo-400 text-left block">Tools</button></li>
                <li><button onClick={() => setActiveInfoPage('faq')} className="hover:text-white transition-colors cursor-pointer text-left block">FAQ</button></li>
              </ul>
            </div>

            {/* Column 2: Solutions */}
            <div className="space-y-3.5 text-left">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Solutions</h4>
              <ul className="space-y-2 text-[11px] text-slate-400 font-medium">
                <li><button onClick={() => setActiveInfoPage('features')} className="hover:text-white transition-colors cursor-pointer text-left block">Business</button></li>
                <li><button onClick={() => setActiveInfoPage('features')} className="hover:text-white transition-colors cursor-pointer text-left block">Education</button></li>
                <li><button onClick={() => setActiveInfoPage('features')} className="hover:text-white transition-colors cursor-pointer text-left block">Legal</button></li>
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div className="space-y-3.5 text-left">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Resources</h4>
              <ul className="space-y-2 text-[11px] text-slate-400 font-medium">
                <li><button onClick={() => setActiveInfoPage('features')} className="hover:text-white transition-colors cursor-pointer text-left block">AllRounderPDF Desktop</button></li>
                <li><button onClick={() => setActiveInfoPage('features')} className="hover:text-white transition-colors cursor-pointer text-left block">AllRounderPDF Mobile</button></li>
                <li><button onClick={() => setActiveInfoPage('features')} className="hover:text-white transition-colors cursor-pointer text-left block">AllRounderSign</button></li>
                <li><button onClick={() => setActiveInfoPage('features')} className="hover:text-white transition-colors cursor-pointer text-left block">AllRounderAPI</button></li>
                <li><button onClick={() => setActiveInfoPage('features')} className="hover:text-white transition-colors cursor-pointer text-left block">AllRounderIMG</button></li>
              </ul>
            </div>

            {/* Column 4: Security & Policies */}
            <div className="space-y-3.5 text-left">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Security</h4>
              <ul className="space-y-2 text-[11px] text-slate-400 font-medium">
                <li><button onClick={() => setActiveInfoPage('terms')} className="hover:text-white transition-colors cursor-pointer text-left block">Security</button></li>
                <li><button onClick={() => setActiveInfoPage('terms')} className="hover:text-white transition-colors cursor-pointer text-left block">Privacy policy</button></li>
                <li><button onClick={() => setActiveInfoPage('terms')} className="hover:text-white transition-colors cursor-pointer text-left block font-bold text-indigo-400">Terms & conditions</button></li>
                <li><button onClick={() => setActiveInfoPage('terms')} className="hover:text-white transition-colors cursor-pointer text-left block">Cookies</button></li>
              </ul>
            </div>

            {/* Column 5: Company */}
            <div className="space-y-3.5 text-left">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Company</h4>
              <ul className="space-y-2 text-[11px] text-slate-400 font-medium">
                <li><button onClick={() => setActiveInfoPage('about')} className="hover:text-white transition-colors cursor-pointer text-left block">About us</button></li>
                <li><button onClick={() => setActiveInfoPage('contact')} className="hover:text-white transition-colors cursor-pointer text-left block font-bold text-indigo-400">Contact us</button></li>
                <li><button onClick={() => { setSelectedToolId(null); setActiveInfoPage(null); }} className="hover:text-white transition-colors cursor-pointer text-left block">Blog</button></li>
                <li><button onClick={() => { setSelectedToolId(null); setActiveInfoPage(null); }} className="hover:text-white transition-colors cursor-pointer text-left block">Press</button></li>
              </ul>
            </div>

          </div>

          {/* Stores, Integrations & Language Area */}
          <div className="py-2 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* App Store Links */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-500 tracking-wider">Download App:</span>
              <div className="flex flex-wrap gap-2">
                {['Google Play', 'App Store', 'Mac Store', 'Microsoft Store'].map((store) => (
                  <a
                    key={store}
                    href="#"
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[10px] text-slate-300 hover:text-white font-mono rounded-lg border border-white/5 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                    {store}
                  </a>
                ))}
              </div>
            </div>

            {/* Language & Local Compliance Status */}
            <div className="flex items-center gap-4">
              {/* Language Selector Selector */}
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-slate-300 font-mono text-[10px]">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                <span>English</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                OFFLINE VERIFIED
              </span>
            </div>

          </div>

          {/* Bottom Copyright disclaimer panel */}
          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-[11px] text-slate-500 font-medium font-mono">
            <p>
              &copy; AllRounderPDF 2026 &reg; - Your PDF Editor &bull; ESTABLISHED 2025
            </p>
            <p className="text-[10px] uppercase tracking-widest text-slate-600">
              Confidential Client-Side Sandbox Processing Engine
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
