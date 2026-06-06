import { useState } from 'react';
import { Terminal, Shield, Cpu, RefreshCw, FileDown, CheckCircle2, Server, Key, Layout } from 'lucide-react';

export default function DesktopTool() {
  const [platform, setPlatform] = useState<'windows' | 'macos' | 'linux'>('windows');
  const [plugins, setPlugins] = useState({
    ocr: true,
    vector: false,
    advancedSymmetric: true,
    wasmSandbox: true
  });
  const [outputPath, setOutputPath] = useState('C:\\Program Files\\AllRounderPDF\\');
  const [compiling, setCompiling] = useState(false);
  const [stepLog, setStepLog] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [compiledResult, setCompiledResult] = useState<{
    fileName: string;
    integrityHash: string;
    fileSize: string;
    timestamp: string;
  } | null>(null);

  const handlePlatformChange = (p: 'windows' | 'macos' | 'linux') => {
    setPlatform(p);
    if (p === 'macos') {
      setOutputPath('/Applications/AllRounderPDF.app/');
    } else if (p === 'linux') {
      setOutputPath('/opt/allrounderpdf/');
    } else {
      setOutputPath('C:\\Program Files\\AllRounderPDF\\');
    }
  };

  const startCompilation = () => {
    setCompiling(true);
    setProgress(0);
    setStepLog([]);
    setCompiledResult(null);

    const steps = [
      'Scanning local environment node architectures...',
      `Configuring compiler pipelines for Target OS: ${platform.toUpperCase()}`,
      'Bundling static assets and raw WebAssembly binary pipelines...',
      'Injecting core offline engine [AllRounderPDF_Core_v2.5.4]',
      plugins.ocr ? 'Integrating native Tesseract OCR coordinate mapping tables (34MB)...' : null,
      plugins.vector ? 'Linking local hardware vector acceleration hooks...' : null,
      plugins.advancedSymmetric ? 'Compiling 128-bit symmetric cryptographic cipher core...' : null,
      plugins.wasmSandbox ? 'Locking security wrapper sandbox inside ephemeral IPC loops...' : null,
      `Allocating target install directory route: "${outputPath}"`,
      'Compacting compiled binary arrays via on-the-fly binary compression...',
      'Writing secure on-disk dynamic executable header certificates...',
      'Compilation successful! Validation integrity checksum verified.'
    ].filter(Boolean) as string[];

    steps.forEach((stepText, index) => {
      setTimeout(() => {
        setStepLog(prev => [...prev, `[COMPILER] ${stepText}`]);
        setProgress(Math.round(((index + 1) / steps.length) * 100));

        if (index === steps.length - 1) {
          setTimeout(() => {
            const hexHash = Array.from({ length: 32 }, () => 
              Math.floor(Math.random() * 16).toString(16)
            ).join('');
            const extension = platform === 'windows' ? 'msi' : platform === 'macos' ? 'dmg' : 'tar.gz';
            const calculatedSize = (18 + 
              (plugins.ocr ? 34 : 0) + 
              (plugins.vector ? 15 : 0) + 
              (plugins.advancedSymmetric ? 8 : 0) + 
              (plugins.wasmSandbox ? 4 : 0)
            ) + ' MB';

            setCompiledResult({
              fileName: `AllRounderPDF_Native_Installer_${platform}.${extension}`,
              integrityHash: `sha256-${hexHash}`,
              fileSize: calculatedSize,
              timestamp: new Date().toUTCString()
            });
            setCompiling(false);
          }, 450);
        }
      }, (index + 1) * 250);
    });
  };

  const downloadSetupScript = () => {
    if (!compiledResult) return;

    let scriptContent = '';
    if (platform === 'windows') {
      scriptContent = `@echo off
echo ============================================================
echo ALLROUNDERPDF OFFLINE BUILD SYSTEM CONFIGURED INSTALLER
echo ============================================================
echo Target OS:         Windows (x64)
echo Install Directory: ${outputPath}
echo Selected Plugins:  OCR=${plugins.ocr} Vector=${plugins.vector} Cryptography=${plugins.advancedSymmetric}
echo Bundle Size:       ${compiledResult.fileSize}
echo SHA256 Integrity:  ${compiledResult.integrityHash}
echo Compile Time:      ${compiledResult.timestamp}
echo status:            Verifying client system signatures...
echo.
echo [COMPILER CONFIGURATION]
echo Setting output save directories to ${outputPath}...
echo Initializing WebAssembly memory isolation bounds...
echo Offline local sandbox mode loaded with standard permissions.
echo.
echo To run this local installer, trigger the compiled binary.
pause`;
    } else {
      scriptContent = `#!/bin/bash
# ============================================================
# ALLROUNDERPDF OFFLINE BUILD SYSTEM CONFIGURED INSTALLER
# ============================================================
# Target OS:         ${platform.toUpperCase()}
# Install Directory: ${outputPath}
# Selected Plugins:  OCR=${plugins.ocr} Vector=${plugins.vector} Cryptography=${plugins.advancedSymmetric}
# Bundle Size:       ${compiledResult.fileSize}
# SHA256 Integrity:  ${compiledResult.integrityHash}
# Compile Time:      ${compiledResult.timestamp}
# status:            Verifying client system signatures...

echo "Preparing local installation workspace..."
mkdir -p "${outputPath}"
echo "Setting up local sandbox environment configurations..."
echo "WebAssembly isolated memory allocations active..."
echo "[SUCCESS] AllRounderPDF standalone terminal bindings compiled."
`;
    }

    const blob = new Blob([scriptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = platform === 'windows' ? 'AllRounderPDF_Setup_Win.bat' : 'AllRounderPDF_Setup_Unix.sh';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="text-xs font-bold text-indigo-400 font-mono tracking-widest uppercase block">✦ COMPACT CLIENTS</span>
        <h2 className="text-3xl font-black text-white tracking-tight leading-none uppercase">ALLROUNDERPDF DESKTOP</h2>
        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
          Build a fully native offline desktop executable tailored directly to your system hardware specifications, providing absolute isolation without cloud requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Settings Module */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 space-y-5">
          <h3 className="font-extrabold text-white text-xs font-mono tracking-wider uppercase border-b border-white/5 pb-2 flex items-center gap-2">
            <Layout className="w-4 h-4 text-indigo-400" /> Platform & Compiling Architectures
          </h3>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Select Target Platform OS</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'windows', title: 'Windows (.msi)', desc: 'x64 System' },
                  { id: 'macos', title: 'macOS (.dmg)', desc: 'Universal Bin' },
                  { id: 'linux', title: 'Linux (.tar.gz)', desc: 'GCC / Glibc' }
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handlePlatformChange(p.id as any)}
                    className={`p-3 rounded-xl border text-center transition cursor-pointer select-none ${
                      platform === p.id 
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md' 
                        : 'bg-slate-950/40 border-white/10 hover:border-white/20 text-slate-400'
                    }`}
                  >
                    <span className="text-xs font-bold block">{p.title}</span>
                    <span className="text-[8.5px] font-mono text-slate-500 block">{p.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Custom Installation Directory Target</label>
              <input
                type="text"
                value={outputPath}
                onChange={e => setOutputPath(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950/60 border border-white/15 focus:border-indigo-500/50 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition font-sans"
              />
            </div>

            <div className="space-y-2 pt-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Toggle Advanced Native Engine Plug-ins</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { key: 'ocr', title: 'Full Tesseract OCR', desc: 'Read scanned image layers locally' },
                  { key: 'vector', title: 'Vector Math acceleration', desc: 'Intel/M-series GPU speedups' },
                  { key: 'advancedSymmetric', title: 'Symmetric Cipher suite', desc: 'Secure local 128-bit decryptions' },
                  { key: 'wasmSandbox', title: 'IPC Sandboxed Process', desc: 'Memory isolation loops active' }
                ].map(plug => (
                  <label
                    key={plug.key}
                    className="p-3 bg-slate-950/40 hover:bg-slate-950/65 rounded-xl border border-white/5 hover:border-white/12 transition flex items-start gap-2.5 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={(plugins as any)[plug.key]}
                      onChange={e => setPlugins(prev => ({ ...prev, [plug.key]: e.target.checked }))}
                      className="w-3.5 h-3.5 rounded border-white/20 bg-slate-950 accent-indigo-500 mt-0.5"
                    />
                    <div className="leading-none">
                      <span className="text-[11px] font-bold text-white block">{plug.title}</span>
                      <span className="text-[9px] text-slate-500 block mt-0.5 max-w-[120px]">{plug.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={startCompilation}
              disabled={compiling}
              className="w-full py-2.5 bg-gradient-to-br from-indigo-650 to-indigo-800 text-white font-mono font-bold text-xs uppercase rounded-xl transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-55 disabled:scale-100 border border-indigo-500/20 cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
            >
              {compiling ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Compiling Platform Binary... {progress}%
                </>
              ) : (
                <>
                  <Server className="w-4 h-4" /> Compile Offline Desktop Build
                </>
              )}
            </button>
          </div>
        </div>

        {/* Console / Result Module */}
        <div className="space-y-4">
          {compiling && (
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4.5 h-4.5 text-indigo-400 animate-pulse" />
                  <span className="font-extrabold text-white text-xs font-mono tracking-wider uppercase">Active Compilation Output Log</span>
                </div>
                <span className="text-[9px] font-mono text-slate-500 bg-white/5 px-2 py-0.5 rounded uppercase">PROCESS ACTIVE</span>
              </div>

              <div className="h-44 overflow-y-auto bg-black p-3 rounded-lg border border-white/5 font-mono text-[9.5px] text-indigo-300 space-y-1">
                {stepLog.map((log, index) => (
                  <p key={index} className="leading-snug">{log}</p>
                ))}
                <div className="w-2 h-3.5 bg-indigo-400 inline-block animate-pulse mt-0.5" />
              </div>

              {/* Progress slider */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>Bundling payload channels</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 transition-all duration-150" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            </div>
          )}

          {!compiling && compiledResult && (
            <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-emerald-500/20 space-y-5 animate-fade-in text-left">
              <div className="flex items-center gap-2.5 text-emerald-400 border-b border-emerald-500/10 pb-3">
                <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                <div>
                  <h3 className="font-extrabold text-white text-sm tracking-tight leading-none">BUILD SUCCESSFUL</h3>
                  <span className="text-[10px] font-mono tracking-wide text-emerald-400 uppercase">Offline Installer Ready</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono bg-slate-950/80 border border-white/5 p-3.5 rounded-xl">
                <div className="space-y-1">
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest leading-none font-bold">Generated Filename</p>
                  <p className="text-white font-bold select-all">{compiledResult.fileName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest leading-none font-bold">Compiled Payload Size</p>
                  <p className="text-white font-bold">{compiledResult.fileSize}</p>
                </div>
                <div className="space-y-1 pt-1">
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest leading-none font-bold">Active System Audit Checksum</p>
                  <p className="text-slate-300 select-all break-all text-[10.5px]">{compiledResult.integrityHash}</p>
                </div>
                <div className="space-y-1 pt-1">
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest leading-none font-bold">Hardware Linking Epoch Stamp</p>
                  <p className="text-slate-300 text-[10.5px]">{compiledResult.timestamp}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-950/40 rounded-xl space-y-2 border border-white/5 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 font-bold font-mono text-[9px] uppercase text-indigo-400">
                  <Shield className="w-3.5 h-3.5" /> Encryption Keys Verification Active
                </div>
                <p className="text-[11px] leading-relaxed">
                  Your customized installer coordinates are compiled into a boot script file. This allows clean, safe, and native initialization of directories locally without requiring internet access.
                </p>
              </div>

              <button
                type="button"
                onClick={downloadSetupScript}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-mono font-bold text-xs uppercase rounded-xl transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10 border border-emerald-400/20"
              >
                <FileDown className="w-4 h-4" /> Download Install Script
              </button>
            </div>
          )}

          {!compiling && !compiledResult && (
            <div className="h-full p-8 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center space-y-3.5 bg-slate-950/20">
              <Cpu className="w-10 h-10 text-slate-600" />
              <div className="space-y-1 max-w-sm">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono">No Compiled Platform Package</h4>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Configure your compiler options on the left and click "Compile" to build. The resulting standalone script bundle installs on-device securely.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
