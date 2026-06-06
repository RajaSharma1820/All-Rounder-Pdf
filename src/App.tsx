import { useState, useEffect } from 'react';
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
  BookOpen,
  Search,
  History
} from 'lucide-react';

import { formatBytes } from './utils/pdfHelpers';

// Import our modular tool workflows
import MergeTool from './components/MergeTool';
import SplitTool from './components/SplitTool';
import RotateTool from './components/RotateTool';
import WatermarkTool from './components/WatermarkTool';
import NumberingTool from './components/NumberingTool';
import ImageToPdfTool from './components/ImageToPdfTool';
import TxtToPdfTool from './components/TxtToPdfTool';
import GenericTool from './components/GenericTool';

// New dynamic resource tools
import ContactTool from './components/ContactTool';
import DesktopTool from './components/DesktopTool';
import MobileTool from './components/MobileTool';
import SignTool from './components/SignTool';
import ApiTool from './components/ApiTool';
import ImgTool from './components/ImgTool';

import { PDFTool, ToolCategory } from './types';

// Firebase Auth & Database Sync Config
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import AuthModal from './components/AuthModal';
import LoginPage from './components/LoginPage';

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

const getToolColorStyles = (isDarkMode: boolean) => {
  if (isDarkMode) {
    return {
      cardBg: 'bg-slate-900/50 hover:bg-slate-900/85 hover:border-red-500/30 border-white/5 text-slate-200',
      title: 'text-white',
      desc: 'text-slate-400',
      iconContainer: 'bg-white/5 border border-white/10 text-red-400 group-hover:bg-red-500/10 group-hover:border-red-500/20',
      badge: 'bg-red-950/40 text-red-400 border border-red-500/20'
    };
  } else {
    return {
      cardBg: 'bg-white hover:bg-white border-slate-200 hover:border-red-400/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] text-slate-800 hover:scale-[1.01] shadow-[0_1px_3px_rgba(0,0,0,0.02)]',
      title: 'text-slate-900 font-extrabold group-hover:text-[#e22828] transition-colors',
      desc: 'text-slate-600 group-hover:text-slate-700',
      iconContainer: 'bg-red-50 border border-red-100/60 text-[#e22828] group-hover:bg-[#e22828] group-hover:border-[#e22828] group-hover:text-white transition-all',
      badge: 'bg-red-50 text-[#e22828] border border-red-200'
    };
  }
};

export default function App() {
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'All'>('All');
  const [accentColor, setAccentColor] = useState<keyof typeof ACCENT_PRESETS>('crimson');
  const [latticeGrid, setLatticeGrid] = useState(true);
  const laserScanActive = true;
  const [isSidebarOpenOnMobile, setIsSidebarOpenOnMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // DEFAULT TO LIGHT MODE like ilovepdf.com

  // Authentication states
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Recent files state & listener
  interface RecentFile {
    id: string;
    name: string;
    toolName: string;
    timestamp: string;
    size?: number;
  }

  const [recentFiles, setRecentFiles] = useState<RecentFile[]>(() => {
    try {
      const saved = localStorage.getItem('allrounder-recent-files');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Load from firestore if logged in, otherwise default to localStorage
  useEffect(() => {
    if (!currentUser) {
      try {
        const saved = localStorage.getItem('allrounder-recent-files');
        setRecentFiles(saved ? JSON.parse(saved) : []);
      } catch {
        setRecentFiles([]);
      }
      return;
    }

    const fetchHistory = async () => {
      try {
        const q = query(
          collection(db, 'users', currentUser.uid, 'history'),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const querySnapshot = await getDocs(q);
        const docs: RecentFile[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          let formattedTime = '';
          if (data.createdAt && typeof data.createdAt.toDate === 'function') {
            formattedTime = data.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          } else {
            formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
          docs.push({
            id: docSnap.id,
            name: data.fileName,
            toolName: data.toolName,
            size: data.size,
            timestamp: formattedTime,
          });
        });
        if (docs.length > 0) {
          setRecentFiles(docs);
        }
      } catch (err) {
        console.error('Failed to retrieve user history from Firestore:', err);
      }
    };

    fetchHistory();
  }, [currentUser]);

  // Sync handler for logged events
  useEffect(() => {
    const handleProcessed = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail || !detail.name) return;
      
      const newId = Math.random().toString(36).substring(2, 9);
      const newRecord = {
        id: newId,
        name: detail.name,
        toolName: detail.toolName || 'PDF Operations',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        size: detail.size,
      };

      // Push to Firestore if logged in
      if (currentUser) {
        addDoc(collection(db, 'users', currentUser.uid, 'history'), {
          userId: currentUser.uid,
          fileName: detail.name,
          toolName: detail.toolName || 'PDF Operations',
          size: detail.size || 0,
          createdAt: serverTimestamp(),
        }).catch((e) => console.error('Error writing history block to Firestore:', e));
      }

      setRecentFiles((prev) => {
        const next = [
          newRecord,
          ...prev.filter((f) => f.name !== detail.name),
        ].slice(0, 5);
        
        // Keep fallback in local storage
        localStorage.setItem('allrounder-recent-files', JSON.stringify(next));
        return next;
      });
    };

    window.addEventListener('allrounder-pdf-processed', handleProcessed);
    return () => window.removeEventListener('allrounder-pdf-processed', handleProcessed);
  }, [currentUser]);

  const clearRecentFiles = () => {
    setRecentFiles([]);
    localStorage.removeItem('allrounder-recent-files');
  };

  // Stateful interactive footer controls
  const [activeInfoPage, setActiveInfoPage] = useState<'features' | 'pricing' | 'faq' | 'about' | 'contact' | 'terms' | 'desktop' | 'mobile' | 'sign' | 'api' | 'img' | 'login' | null>(null);
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

  const filteredTools = tools.filter(t => {
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
    const matchesSearch = searchQuery.trim() === '' ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedTool = tools.find(t => t.id === selectedToolId);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#030712] text-slate-200 theme-immersive-dark' : 'bg-[#f3f4f6] text-slate-800'} font-sans selection:bg-red-500/20 selection:text-white flex flex-col relative overflow-x-hidden transition-colors duration-300`}>
      
      {/* Background radial atmosphere glow orbs */}
      {isDarkMode && (
        <>
          <div className={`absolute top-1/4 left-1/4 w-96 h-96 ${colors.orbClass1} rounded-full blur-[130px] pointer-events-none transition-all duration-700`} />
          <div className={`absolute bottom-1/4 right-1/4 w-80 h-80 ${colors.orbClass2} rounded-full blur-[110px] pointer-events-none transition-all duration-700`} />
        </>
      )}

      {/* Premium Header Rail */}
      <header className={`sticky top-0 z-50 px-6 py-3.5 border-b backdrop-blur-sm transition-all duration-300 ${
        isDarkMode 
          ? 'bg-slate-950/75 border-white/10 text-slate-200' 
          : 'bg-white/95 border-slate-250/65 text-slate-800 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-left">
            <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={() => { setSelectedToolId(null); setActiveInfoPage(null); setSearchQuery(''); }}>
              {/* iLovePDF signature brand logo clone representation: bold red rounded square with document icon */}
              <div className="w-9 h-9 rounded-lg bg-[#860039] hover:bg-[#730030] transition-colors duration-200 flex flex-col items-center justify-center text-white font-extrabold shadow-sm transform hover:scale-105 shrink-0">
                <span className="text-[10px] uppercase font-sans font-black tracking-tighter leading-none">PDF</span>
                <span className="text-[8px] font-bold leading-none">&#9733;</span>
              </div>
              <div className="text-left">
                <span className={`font-sans font-black text-xl tracking-tight leading-none block`}>
                  <span className={isDarkMode ? 'text-white' : 'text-slate-900'}>AllRounder</span>
                  <span className="text-[#e22828] font-black uppercase">PDF</span>
                </span>
                <span className={`text-[8.5px] font-mono font-extrabold mt-0.5 inline-block uppercase tracking-wider ${isDarkMode ? 'text-red-400 bg-red-950/40 px-1.5 py-0.5 rounded' : 'text-[#e22828] bg-red-50 px-1.5 py-0.5 rounded'}`}>
                  ✦ SECURE OFFLINE EDITOR
                </span>
              </div>
            </div>

            {/* Quick desktop shortcuts just like iLovePDF's top toolbar! */}
            <div className="hidden xl:flex items-center gap-4.5 border-l border-slate-200 dark:border-white/10 pl-5">
              <button
                type="button"
                onClick={() => { setSelectedToolId('merge'); setActiveInfoPage(null); }}
                className={`text-[11px] font-extrabold uppercase font-sans tracking-wide transition-colors cursor-pointer ${
                  selectedToolId === 'merge' ? 'text-[#e22828]' : isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-650 hover:text-[#e22828]'
                }`}
              >
                Merge
              </button>
              <button
                type="button"
                onClick={() => { setSelectedToolId('split'); setActiveInfoPage(null); }}
                className={`text-[11px] font-extrabold uppercase font-sans tracking-wide transition-colors cursor-pointer ${
                  selectedToolId === 'split' ? 'text-[#e22828]' : isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-650 hover:text-[#e22828]'
                }`}
              >
                Split
              </button>
              <button
                type="button"
                onClick={() => { setSelectedToolId('watermark'); setActiveInfoPage(null); }}
                className={`text-[11px] font-extrabold uppercase font-sans tracking-wide transition-colors cursor-pointer ${
                  selectedToolId === 'watermark' ? 'text-[#e22828]' : isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-650 hover:text-[#e22828]'
                }`}
              >
                Watermark
              </button>
              <button
                type="button"
                onClick={() => { setSelectedToolId('numbering'); setActiveInfoPage(null); }}
                className={`text-[11px] font-extrabold uppercase font-sans tracking-wide transition-colors cursor-pointer ${
                  selectedToolId === 'numbering' ? 'text-[#e22828]' : isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-650 hover:text-[#e22828]'
                }`}
              >
                Numbers
              </button>
              <button
                type="button"
                onClick={() => { setSelectedToolId('image-to-pdf'); setActiveInfoPage(null); }}
                className={`text-[11px] font-extrabold uppercase font-sans tracking-wide transition-colors cursor-pointer ${
                  selectedToolId === 'image-to-pdf' ? 'text-[#e22828]' : isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-650 hover:text-[#e22828]'
                }`}
              >
                JPG to PDF
              </button>
            </div>
          </div>

          {/* Universal Global Google-style PDF tool Search Console inside Header */}
          <div className="flex-grow max-w-xs md:max-w-sm relative">
            <div className="relative">
              <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
              <input
                id="global-search-input"
                type="text"
                placeholder="Search PDF tools (e.g. Merge, Sign, Rotate...)"
                value={searchQuery}
                aria-label="Search all PDF tools"
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (selectedToolId) setSelectedToolId(null);
                  if (activeInfoPage) setActiveInfoPage(null);
                }}
                className={`w-full border rounded-xl py-2 pl-10 pr-8 text-xs font-sans transition-all focus:outline-none focus:ring-1 ${
                  isDarkMode 
                    ? 'bg-slate-900/40 hover:bg-slate-900/70 focus:bg-slate-900/90 border-white/10 focus:border-red-500/50 hover:border-white/20 text-white placeholder-slate-500 focus:ring-red-500/30' 
                    : 'bg-slate-100 hover:bg-slate-200/60 focus:bg-white border-slate-200 focus:border-[#e22828] text-slate-800 placeholder-slate-500 focus:ring-[#e22828]/25 font-semibold'
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  id="btn-clear-search"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition duration-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Premium Status HUD - Combined with User session toggle, Toggled Styles */}
          <div className="hidden lg:flex items-center gap-2.5 bg-transparent p-0.5 rounded-2xl">
            {/* Elegant Sun/Moon visual style switcher */}
            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? "Switch to iLovePDF Light theme" : "Switch to Cyber Dark theme"}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                isDarkMode 
                  ? 'bg-white/5 border-white/10 hover:bg-white/10 text-amber-400' 
                  : 'bg-slate-100 border-slate-250 text-slate-600 hover:bg-slate-200/80 text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] font-mono lg:block hidden font-extrabold tracking-wider ml-1">{isDarkMode ? 'DARK' : 'LIGHT'}</span>
            </button>

            {/* Home Link */}
            <button
              onClick={() => { setSelectedToolId(null); setActiveInfoPage(null); }}
              className={`text-[10px] font-mono tracking-wider font-extrabold border px-3 py-2 rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                isDarkMode 
                  ? 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border-white/5 hover:border-white/10' 
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100 border-slate-250 hover:bg-slate-200/80'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-red-500 animate-pulse' : 'bg-[#e22828] animate-pulse'}`}></span>
              HOME
            </button>
            
            <div className={`flex items-center gap-1 bg-emerald-500/5 border border-emerald-500/10 rounded-xl px-2.5 py-2 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600 bg-emerald-50 border-emerald-100'}`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-[9px] font-mono font-bold tracking-wider">SECURE</span>
            </div>

            {/* Auth Action Section */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2">
                <div className="flex flex-col text-right">
                  <span className={`text-[10px] font-bold font-sans truncate max-w-[80px] ${isDarkMode ? 'text-slate-200' : 'text-slate-850'}`}>
                    {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
                  </span>
                  <span className={`text-[8px] font-mono font-extrabold uppercase tracking-wider ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>ACTIVE</span>
                </div>
                <button
                  type="button"
                  id="btn-header-signout"
                  onClick={() => signOut(auth)}
                  className={`text-[9px] font-mono font-bold border px-2.5 py-2 rounded-xl transition cursor-pointer uppercase ${
                    isDarkMode 
                      ? 'bg-white/5 border-white/10 hover:border-red-500/20 hover:text-red-400 text-slate-400' 
                      : 'bg-slate-100 border-slate-250 hover:bg-red-50 hover:border-red-100 hover:text-[#e22828] text-slate-500'
                  }`}
                >
                  Exit
                </button>
              </div>
            ) : (
              <button
                type="button"
                id="btn-header-login"
                onClick={() => { setSelectedToolId(null); setActiveInfoPage('login'); }}
                className={`text-[9px] font-mono font-bold px-3 py-2 rounded-xl text-white transition-all cursor-pointer shadow-sm hover:scale-[1.02] flex items-center gap-1 uppercase bg-[#e22828] hover:bg-[#c91e1e]`}
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Burger & Theme Toggles */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              type="button"
              className={`p-2 rounded-lg border transition duration-250 cursor-pointer ${
                isDarkMode ? 'bg-slate-900 border-white/10 text-amber-450' : 'bg-slate-100 border-slate-250 text-slate-700'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
            </button>
            <button
              onClick={() => setIsSidebarOpenOnMobile(!isSidebarOpenOnMobile)}
              type="button"
              className={`p-2 rounded-lg border transition duration-200 cursor-pointer ${
                isDarkMode ? 'bg-slate-900 border-white/10 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              {isSidebarOpenOnMobile ? <X className="w-5 h-5 text-rose-500" /> : <Menu className={`w-5 h-5 ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`} />}
            </button>
          </div>
        </div>
      </header>

      {/* Double Column Core Workspace Layout */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto relative z-10">
        
        {/* Navigation Left Sidebar Panel (Desktop: Sidebar, Mobile: Sliding Drawer) */}
        <aside className={`${
          isSidebarOpenOnMobile 
            ? `fixed inset-y-0 left-0 z-40 w-72 p-6 flex flex-col gap-6 pt-24 backdrop-blur-lg shadow-2xl overflow-y-auto select-none transition-all duration-300 ${
                isDarkMode ? 'bg-slate-900/98 border-r border-white/10' : 'bg-white/98 border-r border-slate-200 text-slate-850'
              }` 
            : `hidden lg:flex w-72 shrink-0 p-6 flex-col gap-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto select-none transition-all duration-300 ${
                isDarkMode ? 'border-r border-white/5 bg-slate-950/20' : 'border-r border-slate-200/80 bg-white/30'
              }`
        } transition-all duration-350`}>
          
          {/* User Session Profile Module */}
          <div className={`p-4 rounded-2xl space-y-3 shadow-sm border ${
            isDarkMode ? 'border-white/10 bg-slate-900/60' : 'border-slate-200 bg-slate-50'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[9px] font-mono uppercase tracking-widest font-bold flex items-center gap-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                <ShieldCheck className={`w-3.5 h-3.5 ${isDarkMode ? colors.textAccent : 'text-red-500'}`} /> USER SESSION
              </span>
              <span className={`w-1.5 h-1.5 rounded-full ${currentUser ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`}></span>
            </div>
            {currentUser ? (
              <div className="space-y-2">
                <div className={`p-3 rounded-xl border text-left ${isDarkMode ? 'bg-slate-950/50 border-white/5' : 'bg-white border-slate-200'}`}>
                  <p className={`text-xs font-bold truncate ${isDarkMode ? 'text-white' : 'text-slate-850'}`}>{currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}</p>
                  <p className="text-[9px] font-mono text-slate-500 truncate mt-0.5">{currentUser.email}</p>
                </div>
                <button
                  type="button"
                  id="btn-sidebar-signout"
                  onClick={() => signOut(auth)}
                  className={`w-full py-2 rounded-xl font-mono text-[9px] font-bold uppercase transition cursor-pointer border ${
                    isDarkMode 
                      ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20' 
                      : 'bg-red-50 hover:bg-red-100 text-[#e22828] border-red-200'
                  }`}
                >
                  Sign Out of Sandbox
                </button>
              </div>
            ) : (
              <div className="space-y-2 text-center py-1">
                <p className="text-[10px] text-slate-500 font-sans mx-1">
                  no session found
                </p>
                <button
                  type="button"
                  id="btn-sidebar-login"
                  onClick={() => { setSelectedToolId(null); setActiveInfoPage('login'); setIsSidebarOpenOnMobile(false); }}
                  className={`w-full py-2 rounded-xl text-[10px] font-mono font-bold uppercase text-white transition cursor-pointer shadow-sm ${
                    isDarkMode ? colors.btnPrimary : 'bg-[#e22828] hover:bg-[#c91e1e]'
                  }`}
                >
                  Authenticate
                </button>
              </div>
            )}
          </div>

          {/* Mobile-Visible and Elegant Unified Controls Console */}
          <div className={`p-4 rounded-2xl shadow-sm space-y-3 border ${
            isDarkMode ? 'border-white/10 bg-slate-900/60' : 'border-slate-200 bg-slate-50'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[9px] font-mono uppercase tracking-widest font-bold flex items-center gap-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                <SlidersHorizontal className={`w-3.5 h-3.5 ${isDarkMode ? colors.textAccent : 'text-[#e22828]'}`} /> ENGINE STATUS
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>

            <div className="space-y-2 text-xs">
              {/* Dashboard Control Toggle */}
              <button
                type="button"
                onClick={() => { setSelectedToolId(null); setIsSidebarOpenOnMobile(false); setActiveInfoPage(null); }}
                className={`w-full text-left p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                  isDarkMode 
                    ? 'bg-white/5 hover:bg-white/10 border-white/5 hover:border-white/10 text-slate-300 hover:text-white' 
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                  <span className="font-bold text-[10px]">DASHBOARD CONTROL</span>
                </div>
                <span className={`text-[8px] font-mono border px-1.5 py-0.5 rounded uppercase ${isDarkMode ? 'text-slate-400 border-white/10' : 'text-slate-500 border-slate-200 bg-slate-50'}`}>HOME</span>
              </button>

              {/* Full Local Isolation Display */}
              <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                isDarkMode 
                  ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400' 
                  : 'bg-emerald-55 border border-emerald-250 text-emerald-700 shadow-sm bg-white'
              }`}>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span className="font-bold text-[10px]">Privacy 100%</span>
                </div>
                <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded uppercase font-bold ${isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-100'}`}>SECURE</span>
              </div>

              {/* Scanner Status Display */}
              <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                isDarkMode 
                  ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                  : 'bg-red-55 border-red-200 text-red-700 shadow-sm bg-white'
              }`}>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${isDarkMode ? 'text-red-550' : 'text-[#e22828]'} animate-pulse`} />
                  <span className="font-bold text-[10px]">SCANNER STATUS</span>
                </div>
                <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 text-red-600 rounded uppercase ${isDarkMode ? 'bg-red-500/15 border border-red-500/30' : 'bg-red-100'}`}>
                  ALWAYS ACTIVE
                </span>
              </div>
            </div>
          </div>

          {/* Recent Operations Sidebar Module */}
          <div className={`p-4 rounded-2xl space-y-3 shadow-sm border ${
            isDarkMode ? 'border-white/10 bg-slate-900/60' : 'border-slate-200 bg-slate-50'
          }`}>
            <div className="flex items-center justify-between border-b pb-2 border-slate-200/50 dark:border-white/5">
              <span className={`text-[9px] font-mono uppercase tracking-widest font-bold flex items-center gap-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                <History className={`w-3.5 h-3.5 ${isDarkMode ? colors.textAccent : 'text-slate-600'}`} /> RECENT OPERATIONS
              </span>
              {recentFiles.length > 0 && (
                <button
                  type="button"
                  onClick={clearRecentFiles}
                  className={`text-[9px] font-mono transition cursor-pointer font-bold uppercase hover:underline ${isDarkMode ? 'text-slate-400 hover:text-red-400' : 'text-slate-650 hover:text-[#e22828]'}`}
                >
                  Clear
                </button>
              )}
            </div>

            {recentFiles.length > 0 ? (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {recentFiles.map((f) => (
                  <div
                    key={f.id}
                    title={f.name}
                    className={`p-2.5 rounded-xl text-left flex flex-col gap-1 shadow-sm border ${
                      isDarkMode 
                        ? 'bg-slate-950/45 border-white/5 hover:border-white/15 hover:bg-slate-950/70' 
                        : 'bg-white border-slate-200 hover:border-slate-350 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 w-full text-[11px] font-medium min-w-0">
                      <span className={`truncate font-sans font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-850'}`}>{f.name}</span>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 uppercase ${isDarkMode ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                        {f.size ? formatBytes(f.size, 1) : 'PDF'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono">
                      <span className={`text-[9px] font-bold tracking-wide uppercase ${isDarkMode ? colors.textAccent : 'text-[#e22828]'}`}>{f.toolName}</span>
                      <span className="text-slate-550">{f.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center">
                <p className="text-[10px] text-slate-500 font-mono leading-relaxed px-2">
                  no activity found
                </p>
              </div>
            )}
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
                    ? `${isDarkMode ? colors.sidebarActive : 'bg-red-50 border-red-200/60 text-[#e22828]'} font-semibold shadow-sm`
                    : isDarkMode 
                    ? 'border-transparent bg-white/5 hover:bg-white/10 hover:text-white text-slate-300' 
                    : 'border-transparent bg-slate-100/60 hover:bg-slate-100 hover:text-slate-900 border-slate-200/40 text-slate-700'
                }`}
              >
                <Sparkles className={`w-4 h-4 shrink-0 ${selectedToolId === null ? `text-amber-500 animate-pulse` : 'text-slate-450'}`} />
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
                    className={`w-full p-3 py-3.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                      isActive
                        ? `${isDarkMode ? colors.sidebarActive : 'bg-red-50 border-red-300 text-[#e22828]'} font-semibold shadow-sm`
                        : isDarkMode 
                        ? 'border-transparent bg-white/5 hover:bg-white/10 hover:text-white text-slate-300' 
                        : 'border-transparent bg-transparent hover:bg-slate-100 hover:text-slate-900 text-slate-700 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {isActive ? (
                        <div className={`w-1.5 h-1.5 ${isDarkMode ? colors.textAccent.replace('text', 'bg') : 'bg-[#e22828]'} rounded-full animate-pulse shrink-0`} />
                      ) : (
                        <div className="w-1.5 h-1.5 bg-slate-450 rounded-full shrink-0" />
                      )}
                      <span className="text-xs truncate">{t.name}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-auto">
            <div className={`p-4 rounded-xl border relative overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-slate-950/85 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
              <p className="text-[9px] font-mono text-slate-500 font-bold mb-1 tracking-widest uppercase">Privacy Guarantee</p>
              <div className="flex justify-between items-end">
                <span className={`text-[10.5px] font-bold font-mono uppercase ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Offline Mode</span>
                <span className="text-[10px] text-emerald-600 font-mono font-bold">Safe & Private</span>
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
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md p-5 border rounded-3xl shadow-sm relative overflow-hidden transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-slate-900/50 border-white/10 text-slate-200 shadow-md' 
                    : 'bg-white border-slate-200 text-slate-800'
                }`}>
                  {isDarkMode && <div className={`absolute top-0 left-0 w-full h-[1px] ${colors.laserLine} opacity-60`}></div>}
                  <button
                    type="button"
                    onClick={() => setActiveInfoPage(null)}
                    className={`px-5 py-2.5 border text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 hover:scale-[1.01] active:scale-[0.99] shadow-sm shrink-0 ${
                      isDarkMode 
                        ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white' 
                        : 'bg-slate-100 hover:bg-[#e22828] hover:text-white border-slate-250 text-slate-750 hover:border-[#e22828]'
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                  </button>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold uppercase tracking-widest block font-sans ${isDarkMode ? 'text-slate-400 font-mono' : 'text-slate-600'}`}>
                      INFO REGISTRY MODULE
                    </span>
                    <span className={`h-4 w-[1px] ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`} />
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm uppercase font-mono ${
                      isDarkMode ? colors.badge : 'bg-red-55 text-red-650 border border-red-200'
                    }`}>
                      {activeInfoPage}
                    </span>
                  </div>
                </div>

                <div className={`border rounded-[32px] p-6 sm:p-10 shadow-sm relative overflow-hidden space-y-8 text-left transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-slate-900/60 backdrop-blur-xl border-white/10 text-slate-200' 
                    : 'bg-white border-slate-200/90 text-slate-850 shadow-md'
                }`}>
                  {isDarkMode && <div className={`absolute top-0 left-0 w-full h-[1.5px] ${colors.laserLine}`}></div>}

                  {activeInfoPage === 'about' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className={`text-xs font-bold font-sans tracking-widest uppercase block ${isDarkMode ? 'text-indigo-400 font-mono' : 'text-indigo-650'}`}>✦ GLOBAL MISSION</span>
                        <h2 className={`text-3xl font-black tracking-tight leading-none uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>ABOUT ALLROUNDERPDF</h2>
                        <p className={`text-sm leading-relaxed max-w-3xl ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          AllRounderPDF is built with a singular design vision: to deliver a comprehensive, hyper-optimized, sandboxed environment for your documents. We believe formatting, security, and editing should not mean sacrificing custody of your confidential files.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
                        <div className={`p-5 rounded-2xl border space-y-2 transition-all ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                          <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>100% Client-Side Integrity</h3>
                          <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            Unlike traditional cloud editors that upload files to insecure databases, AllRounderPDF works directly on browser memory buffer pipelines. Your data never leaves your computer, ensuring total isolation.
                          </p>
                        </div>
                        <div className={`p-5 rounded-2xl border space-y-2 transition-all ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                          <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Engineered for Latency-Free Downloads</h3>
                          <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            WebAssembly and modern hardware memory APIs compile formats on-device instantly. This results in immediate download speeds and secure operations.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeInfoPage === 'contact' && (
                    <ContactTool onCopyEmail={copyEmailToClipboard} copiedEmail={copiedEmail} />
                  )}

                  {activeInfoPage === 'desktop' && (
                    <DesktopTool />
                  )}

                  {activeInfoPage === 'mobile' && (
                    <MobileTool />
                  )}

                  {activeInfoPage === 'sign' && (
                    <SignTool />
                  )}

                  {activeInfoPage === 'api' && (
                    <ApiTool />
                  )}

                  {activeInfoPage === 'img' && (
                    <ImgTool />
                  )}

                  {activeInfoPage === 'login' && (
                    <LoginPage
                      colors={colors}
                      onAuthSuccess={(user) => setCurrentUser(user)}
                      onBackToDashboard={() => setActiveInfoPage(null)}
                    />
                  )}

                  {activeInfoPage === 'pricing' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className={`text-xs font-bold font-sans tracking-widest uppercase block ${isDarkMode ? 'text-indigo-400 font-mono' : 'text-indigo-650'}`}>✦ ALLROUNDER FREEMIUM</span>
                        <h2 className={`text-3xl font-black tracking-tight leading-none uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>PRICING POLICY: 100% FREE</h2>
                        <p className={`text-sm leading-relaxed max-w-3xl ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          AllRounderPDF is built on the principle of open-access software. There are absolutely no subscriptions, hidden limits, processing queue delays, or premium features. Every single tool in our arsenal is 100% free forever.
                        </p>
                      </div>

                      <div className={`p-8 rounded-3xl border max-w-xl space-y-6 transition-all ${
                        isDarkMode ? 'bg-indigo-500/5 border-indigo-500/25' : 'bg-indigo-50/30 border-indigo-100'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Unlimited Secure License</h3>
                            <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded tracking-wide uppercase ${
                              isDarkMode ? 'text-indigo-400 bg-indigo-500/10' : 'text-indigo-600 bg-indigo-100'
                            }`}>ACTIVE COMPLEMENTARY PASS</span>
                          </div>
                          <div className="text-right">
                            <span className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>$0.00</span>
                            <span className={`text-[10px] font-mono block ${isDarkMode ? 'text-slate-400' : 'text-slate-550'}`}>FOREVER FREE</span>
                          </div>
                        </div>

                        <div className={`space-y-2.5 pt-4 border-t text-xs ${
                          isDarkMode ? 'border-white/5 text-slate-300' : 'border-slate-205 text-slate-650'
                        }`}>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            <span>Unlimited conversions, merges, and splits</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            <span>Full offline client-side safety integration</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            <span>Access to all conversion types (Word, Markdown, HTML, PPT, etc.)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            <span>No registration or credit card information required</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeInfoPage === 'faq' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className={`text-xs font-bold font-sans tracking-widest uppercase block ${isDarkMode ? 'text-indigo-400 font-mono' : 'text-indigo-650'}`}>✦ FREQUENTLY ASKED QUESTIONS</span>
                        <h2 className={`text-3xl font-black tracking-tight leading-none uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>KNOWLEDGE BASE</h2>
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
                          <div key={i} className={`p-5 rounded-2xl border space-y-2 transition-all ${
                            isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200 hover:bg-slate-100/50'
                          }`}>
                            <h3 className={`font-semibold text-sm flex items-center gap-2 font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                              <HelpCircle className={`w-4 h-4 flex-shrink-0 ${isDarkMode ? 'text-[#e22828]' : 'text-[#e22828]'}`} />
                              {faqItem.q}
                            </h3>
                            <p className={`text-xs leading-relaxed pl-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{faqItem.a}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeInfoPage === 'terms' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className={`text-xs font-bold font-sans tracking-widest uppercase block ${isDarkMode ? 'text-indigo-400 font-mono' : 'text-indigo-650'}`}>✦ SYSTEM LEGAL AGREEMENT</span>
                        <h2 className={`text-3xl font-black tracking-tight leading-none uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>TERMS AND CONDITIONS & PRIVACY POLICY</h2>
                        <span className={`text-[10px] font-mono block ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>LAST MODIFIED: JUNE 2026</span>
                      </div>

                      <div className={`space-y-5 text-xs leading-relaxed font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        <p className={`font-sans text-sm ${isDarkMode ? 'text-slate-350' : 'text-slate-700'}`}>
                          By accessing AllRounderPDF, you agree to the following system-level conditions and secure client-side computing policy:
                        </p>

                        <div className={`p-5 rounded-2xl border space-y-3.5 transition-all ${
                          isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                        }`}>
                          <div>
                            <h4 className={`font-bold text-xs uppercase mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>1. Full Local Custody Policy</h4>
                            <p className={`leading-normal font-sans ${isDarkMode ? 'text-slate-400' : 'text-slate-650'}`}>
                              All conversion, security filtering, splitting, and merging steps are completed inside your browser sandbox. We do not transmit or cache any documents onto web databases. Files are entirely yours.
                            </p>
                          </div>
                          <div>
                            <h4 className={`font-bold text-xs uppercase mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>2. No-Liability Sandbox Constraint</h4>
                            <p className={`leading-normal font-sans ${isDarkMode ? 'text-slate-400' : 'text-slate-650'}`}>
                              The processing systems are delivered "as-is" without representations or warranties. Since all operations run entirely in local client memory, we do not accept responsibility for browser timeouts or hardware limitations during highly complex compilations.
                            </p>
                          </div>
                          <div>
                            <h4 className={`font-bold text-xs uppercase mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>3. Permitted Sandbox Operations</h4>
                            <p className={`leading-normal font-sans ${isDarkMode ? 'text-slate-400' : 'text-slate-650'}`}>
                              Users may process documents for personal, commercial, or academic activities with zero restriction, completely free. No automation or scrapers are allowed with our local frontend elements.
                            </p>
                          </div>
                          <div>
                            <h4 className={`font-bold text-xs uppercase mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>4. Cookies and Telemetry</h4>
                            <p className={`leading-normal font-sans ${isDarkMode ? 'text-slate-400' : 'text-slate-650'}`}>
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
                        <span className={`text-xs font-bold font-sans tracking-widest uppercase block ${isDarkMode ? 'text-indigo-400 font-mono' : 'text-indigo-650'}`}>✦ TOOL REGISTRY INDEX</span>
                        <h2 className={`text-3xl font-black tracking-tight leading-none uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>ALL PAGES & FUNCTIONAL MODULES</h2>
                        <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
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
                            className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer space-y-2 text-left ${
                              isDarkMode 
                                ? 'bg-white/5 border-white/10 hover:border-[#e22828]/40 hover:bg-white/10' 
                                : 'bg-slate-50 hover:bg-white border-slate-200 hover:border-[#e22828]/50 hover:shadow-md'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-black ${isDarkMode ? 'text-white' : 'text-slate-900 group-hover:text-[#e22828]'}`}>{t.name}</span>
                              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                                isDarkMode ? 'text-slate-500 bg-white/5' : 'text-[#e22828] bg-red-50'
                              }`}>
                                {t.category}
                              </span>
                            </div>
                            <p className={`text-[10.5px] leading-snug line-clamp-2 ${
                              isDarkMode ? 'text-slate-400' : 'text-slate-550'
                            }`}>{t.description}</p>
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
                className="space-y-6"
              >
                {/* Grid Filter Options */}
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-4 border-b border-slate-250/60 dark:border-white/10 pb-4">
                    
                    <div className={`flex flex-wrap gap-1 p-1 rounded-xl border justify-center ${
                      isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'
                    }`}>
                      {(['All', 'Organize', 'Convert From', 'Convert To', 'Content Edit', 'Page Options', 'Security', 'Creation'] as const).map((cat) => (
                        <button
                          key={cat}
                          id={`btn-tab-category-${cat.replace(/\s+/g, '-')}`}
                          type="button"
                          onClick={() => setActiveCategory(cat as any)}
                          className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                            activeCategory === cat
                              ? isDarkMode 
                                ? `${colors.activeTab} animate-fade-in` 
                                : 'bg-[#e22828] text-white shadow-sm font-black'
                              : isDarkMode 
                                ? 'text-slate-405 hover:text-white hover:bg-white/5' 
                                : 'text-slate-600 hover:text-[#e22828] hover:bg-white'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* AllRounderPDF Simple Tool Grid */}
                  {filteredTools.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {filteredTools.map((tool) => {
                        const style = getToolColorStyles(isDarkMode);
                        return (
                          <motion.div
                            key={tool.id}
                            id={`bento-card-${tool.id}`}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            whileHover={{ y: -3 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedToolId(tool.id)}
                            className={`group rounded-2xl p-5 text-left cursor-pointer transition-all duration-200 flex flex-col justify-between min-h-[145px] relative overflow-hidden border ${style.cardBg}`}
                          >
                            <div className="space-y-3.5 relative z-10 w-full">
                              {/* Header layout: simple left icon & eventual clean small corner badge */}
                              <div className="flex items-start justify-between">
                                <div className={`p-2 rounded-xl transition duration-300 ${style.iconContainer}`}>
                                  {getIconComponent(tool.icon)}
                                </div>
                                
                                {tool.badge && (
                                  <span className={`text-[8.5px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                                    isDarkMode ? 'bg-red-950/40 text-red-400 border border-red-500/20' : style.badge
                                  }`}>
                                    {tool.badge}
                                  </span>
                                )}
                              </div>

                              <div>
                                <h3 className={`font-sans font-black text-sm tracking-tight leading-snug ${style.title}`}>
                                  {tool.name}
                                </h3>
                                <p className={`text-[11px] mt-1.5 leading-relaxed line-clamp-3 ${style.desc}`}>
                                  {tool.description}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className={`text-center py-12 px-4 rounded-3xl border border-dashed max-w-sm mx-auto space-y-4 ${
                      isDarkMode ? 'border-white/10 bg-slate-900/10' : 'border-slate-300 bg-white shadow-sm'
                    }`}>
                      <div className="p-3 bg-red-500/15 border border-red-500/20 rounded-2xl w-12 h-12 flex items-center justify-center mx-auto">
                        <Search className="w-5 h-5 text-red-500 animate-pulse" />
                      </div>
                      <div className="space-y-1">
                        <h4 className={`text-sm font-bold tracking-tight font-sans ${isDarkMode ? 'text-white' : 'text-slate-905'}`}>No tools matched</h4>
                        <p className="text-[11px] text-slate-500 max-w-[260px] mx-auto leading-relaxed">
                          We couldn't find any PDF tools matching <span className="text-red-500 font-mono font-bold">"{searchQuery}"</span>. Try adjusting your query or category.
                        </p>
                      </div>
                      <button
                        type="button"
                        id="btn-clear-search-fallback"
                        onClick={() => {
                          setSearchQuery('');
                          setActiveCategory('All');
                        }}
                        className={`px-3.5 py-1.5 border text-[10px] font-mono font-bold rounded-lg transition cursor-pointer ${
                          isDarkMode 
                            ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white' 
                            : 'bg-slate-100 hover:bg-slate-200 border-slate-250 text-slate-700'
                        }`}
                      >
                        RESET FILTERS
                      </button>
                    </div>
                  )}

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
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md p-5 border rounded-3xl shadow-sm relative overflow-hidden ${
                  isDarkMode 
                    ? 'bg-slate-900/50 border-white/10 text-slate-200' 
                    : 'bg-white border-slate-200 text-slate-800'
                }`}>
                  {isDarkMode && <div className={`absolute top-0 left-0 w-full h-[1px] ${colors.laserLine} opacity-60`}></div>}
                  <button
                    id="btn-back-to-workspace"
                    type="button"
                    onClick={() => setSelectedToolId(null)}
                    className={`px-5 py-2.5 border text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 hover:scale-[1.01] active:scale-[0.99] shadow-sm shrink-0 animate-fade-in ${
                      isDarkMode 
                        ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white' 
                        : 'bg-slate-100 hover:bg-[#e22828] hover:text-white border-slate-250 text-slate-750 hover:border-[#e22828]'
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4 text-xs" /> Back to Dashboard
                  </button>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className={`text-xs font-bold uppercase tracking-widest block ${isDarkMode ? 'text-slate-400 font-mono' : 'text-slate-600 font-sans'}`}>
                      Active Engine: {selectedTool?.name}
                    </span>
                    <span className={`h-4 w-[1px] ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`} />
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm transition-all duration-300 ${
                      isDarkMode ? colors.badge : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    }`}>
                      <Lock className="w-3.5 h-3.5 text-emerald-500" /> Sandbox Secure
                    </span>
                  </div>
                </div>

                {/* Embed Selected Workflow with Dark Overrides applied */}
                <div 
                  id="tool-panel-frame"
                  className={`border rounded-[32px] p-6 md:p-8 shadow-sm relative overflow-hidden transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-slate-900/60 backdrop-blur-xl border-white/10 theme-immersive-dark' 
                      : 'bg-white border-slate-200/90 text-slate-800'
                  }`}
                  style={{ contentVisibility: 'auto' }}
                >
                  {isDarkMode && <div className={`absolute top-0 left-0 w-full h-[1.5px] ${colors.laserLine} transition-all duration-500`}></div>}
                  
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

      {/* High-Tech Interactive Cockpit Footer Suite - Sleek Red & Charcoal Split Layout */}
      <footer id="main-app-footer" className="w-full relative z-20 transition-all duration-300 mt-16">
        
        {/* TOP SECTION: VIBRANT SECURE RED PANEL */}
        <div className="bg-[#2c0e0e] text-white py-10 px-4 sm:px-6 md:px-12 border-t border-red-700/30 shadow-inner relative overflow-hidden">
          {/* Subtle logo vector overlay */}
          <div className="absolute inset-0 flex items-center justify-end opacity-[0.05] pointer-events-none select-none scale-125 translate-x-20">
            <SerpentLogo className="w-96 h-96" />
          </div>
          
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            <div className="space-y-3.5 text-center lg:text-left max-w-2xl">
              <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-widest bg-white/15 px-3 py-1 rounded-full text-red-100 border border-white/10 animate-pulse">
                <Sparkles className="w-3 h-3 text-red-200" /> Private & Offline-First Core
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight uppercase font-sans italic">
                100% data secure
              </h3>
              <p className="text-xs sm:text-sm text-red-100 leading-relaxed font-sans max-w-xl">
                Your files are processed directly inside your browser memory buffer context. They are never transmitted over the internet or uploaded to any third-party server.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto shrink-0 justify-center">
              {/* Interactive Security Scan Button */}
              <button
                type="button"
                onClick={triggerSandboxAudit}
                disabled={isAuditing}
                className={`w-full sm:w-auto px-6 py-3 rounded-2xl border text-xs font-bold font-mono tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-[0.98] ${
                  auditStatus === 'success'
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : isAuditing
                    ? 'bg-white/10 border-white/20 text-white animate-pulse'
                    : 'bg-white text-[#dd1f26] border-white hover:bg-red-50 hover:text-red-700'
                }`}
              >
                {isAuditing ? (
                  <>
                    <Cpu className="w-4 h-4 animate-spin text-white" />
                    AUDITING SANDBOX FRAME...
                  </>
                ) : auditStatus === 'success' ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-white" />
                    AUDIT COMPLETED: 100% SECURE
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    RUN LOCAL SECURITY AUDIT
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={copyEmailToClipboard}
                className="w-full sm:w-auto px-6 py-3 bg-red-800/40 hover:bg-red-800/60 text-white border border-white/15 hover:border-white/30 text-xs font-mono font-bold rounded-2xl transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                {copiedEmail ? 'ADDRESS COPIED!' : 'CONTACT SECURITY OFFICER'}
              </button>
            </div>
          </div>
        </div>

         {/* BOTTOM SECTION: SECURE HIGH-CONTRAST WHITE LINK GRID */}
        <div className={`py-12 px-4 sm:px-6 md:px-12 border-t relative overflow-hidden transition-all duration-300 ${
          isDarkMode 
            ? 'bg-slate-950 border-white/5 text-slate-400' 
            : 'bg-white border-slate-200 text-slate-600 shadow-sm'
        }`}>
          <div className="max-w-7xl mx-auto space-y-10">
            
            {/* Main 5-Column Grid */}
            <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 pb-8 border-b ${
              isDarkMode ? 'border-white/5' : 'border-slate-100'
            }`}>
              
              {/* Column 1: Product */}
              <div className="space-y-4 text-left">
                <h4 className={`text-xs font-bold uppercase tracking-wider font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Product</h4>
                <ul className="space-y-2.5 text-[11px] font-semibold transition-all">
                  <li><button onClick={() => { setSelectedToolId(null); setActiveInfoPage(null); }} className={`transition-colors cursor-pointer text-left block ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-red-650'}`}>Home</button></li>
                  <li><button onClick={() => setActiveInfoPage('features')} className={`transition-colors cursor-pointer text-left block ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-red-650'}`}>Features</button></li>
                  <li><button onClick={() => setActiveInfoPage('pricing')} className={`transition-colors cursor-pointer text-left block ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-red-650'}`}>Pricing</button></li>
                  <li><button onClick={() => { setSelectedToolId(null); setActiveInfoPage(null); }} className="hover:text-red-600 transition-colors cursor-pointer font-bold text-[#e22828] text-left block">Tools</button></li>
                  <li><button onClick={() => setActiveInfoPage('faq')} className={`transition-colors cursor-pointer text-left block ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-red-650'}`}>FAQ</button></li>
                </ul>
              </div>

              {/* Column 2: Solutions */}
              <div className="space-y-4 text-left">
                <h4 className={`text-xs font-bold uppercase tracking-wider font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Solutions</h4>
                <ul className="space-y-2.5 text-[11px] font-semibold">
                  <li><button onClick={() => setActiveInfoPage('features')} className={`transition-colors cursor-pointer text-left block ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-red-650'}`}>Business</button></li>
                  <li><button onClick={() => setActiveInfoPage('features')} className={`transition-colors cursor-pointer text-left block ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-red-650'}`}>Education</button></li>
                  <li><button onClick={() => setActiveInfoPage('features')} className={`transition-colors cursor-pointer text-left block ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-red-650'}`}>Legal</button></li>
                </ul>
              </div>

              {/* Column 3: Resources */}
              <div className="space-y-4 text-left font-sans">
                <h4 className={`text-xs font-bold uppercase tracking-wider font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Resources</h4>
                <ul className="space-y-2.5 text-[11px] font-semibold">
                  <li><button onClick={() => setActiveInfoPage('desktop')} className={`transition-colors cursor-pointer text-left block ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-red-650'}`}>AllRounderPDF Desktop</button></li>
                  <li><button onClick={() => setActiveInfoPage('mobile')} className={`transition-colors cursor-pointer text-left block ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-red-650'}`}>AllRounderPDF Mobile</button></li>
                  <li><button onClick={() => setActiveInfoPage('sign')} className={`transition-colors cursor-pointer text-left block ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-red-650'}`}>AllRounderSign</button></li>
                  <li><button onClick={() => setActiveInfoPage('api')} className={`transition-colors cursor-pointer text-left block ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-red-650'}`}>AllRounderAPI</button></li>
                  <li><button onClick={() => setActiveInfoPage('img')} className={`transition-colors cursor-pointer text-left block ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-red-650'}`}>AllRounderIMG</button></li>
                </ul>
              </div>

              {/* Column 4: Security & Policies */}
              <div className="space-y-4 text-left">
                <h4 className={`text-xs font-bold uppercase tracking-wider font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Security</h4>
                <ul className="space-y-2.5 text-[11px] font-semibold">
                  <li><button onClick={() => setActiveInfoPage('terms')} className={`transition-colors cursor-pointer text-left block ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-red-650'}`}>Security</button></li>
                  <li><button onClick={() => setActiveInfoPage('terms')} className={`transition-colors cursor-pointer text-left block ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-red-650'}`}>Privacy policy</button></li>
                  <li><button onClick={() => setActiveInfoPage('terms')} className="hover:text-red-600 transition-colors cursor-pointer text-left block font-bold text-[#e22828]">Terms & conditions</button></li>
                  <li><button onClick={() => setActiveInfoPage('terms')} className={`transition-colors cursor-pointer text-left block ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-red-650'}`}>Cookies</button></li>
                </ul>
              </div>

              {/* Column 5: Company */}
              <div className="space-y-4 text-left">
                <h4 className={`text-xs font-bold uppercase tracking-wider font-mono ${isDarkMode ? 'text-[#e22828]' : 'text-slate-900'}`}>Company</h4>
                <ul className="space-y-2.5 text-[11px] font-semibold">
                  <li><button onClick={() => setActiveInfoPage('about')} className={`transition-colors cursor-pointer text-left block ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-red-650'}`}>About us</button></li>
                  <li><button onClick={() => setActiveInfoPage('contact')} className="hover:text-red-600 transition-colors cursor-pointer text-left block font-bold text-[#e22828]">Contact us</button></li>
                  <li><button onClick={() => { setSelectedToolId(null); setActiveInfoPage(null); }} className={`transition-colors cursor-pointer text-left block ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-red-650'}`}>Blog</button></li>
                  <li><button onClick={() => { setSelectedToolId(null); setActiveInfoPage(null); }} className={`transition-colors cursor-pointer text-left block ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-red-650'}`}>Press</button></li>
                </ul>
              </div>

            </div>

            {/* Downloader & Language Section */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pt-2 font-mono text-[10px]">
              {/* App store tags */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <span className="uppercase font-bold text-slate-400 tracking-wider">Download App:</span>
                <div className="flex flex-wrap gap-2">
                  {['Google Play', 'App Store', 'Mac Store', 'Microsoft Store'].map((store) => (
                    <a
                      key={store}
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className={`px-3 py-1.5 font-sans font-bold rounded-lg border transition flex items-center gap-1.5 cursor-pointer ${
                        isDarkMode 
                          ? 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:text-white' 
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 bg-[#e22828] rounded-full animate-pulse"></span>
                      {store}
                    </a>
                  ))}
                </div>
              </div>

              {/* Lang and Offline status */}
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-1.5 border rounded-lg px-2.5 py-1 ${
                  isDarkMode ? 'bg-white/5 border-white/5 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}>
                  <Globe className="w-3.5 h-3.5 text-[#e22828]" />
                  <span>English</span>
                </div>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 tracking-wider">
                  OFFLINE SECURED
                </span>
              </div>
            </div>

            {/* Footer Bottom copyright info */}
            <div className={`border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-[11px] font-semibold font-mono ${
              isDarkMode ? 'border-white/5 text-slate-500' : 'border-slate-200 text-slate-400'
            }`}>
              <p>
                &copy; AllRounderPDF 2026 &reg; - Offline-First Client Suite &bull; ESTABLISHED 2025
              </p>
              <p className="text-[10px] uppercase tracking-widest text-[#e22828] font-bold">
                Private Sandbox Computing Framework
              </p>
            </div>

          </div>
        </div>
      </footer>

      {/* Auth Modal Portal/Section */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        colors={colors}
        onAuthSuccess={(user) => setCurrentUser(user)}
      />

    </div>
  );
}
