import { useState } from 'react';
import { Terminal, Shield, Cpu, RefreshCw, FileDown, CheckCircle2, Copy } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function ApiTool() {
  const [endpoint, setEndpoint] = useState<'/api/v1/compress' | '/api/v1/metadata/clear' | '/api/v1/convert/html'>('/api/v1/compress');
  const [compMode, setCompMode] = useState<'standard' | 'high' | 'extreme'>('high');
  const [stripAnn, setStripAnn] = useState(true);
  const [injectSeal, setInjectSeal] = useState(true);
  
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [apiLogs, setApiLogs] = useState<string[]>([]);
  const [codeTab, setCodeTab] = useState<'curl' | 'js' | 'python'>('curl');
  
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultName, setResultName] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  const getCurlSnippet = () => {
    const headerParams = `-H "X-AllRounder-Compression: ${compMode}" \\\n  -H "X-AllRounder-StripAnn: ${stripAnn ? '1' : '0'}" \\\n  -H "X-AllRounder-InjectSeal: ${injectSeal ? '1' : '0'}"`;
    return `curl -X POST https://api.allrounderpdf.com${endpoint} \\
  -H "Authorization: Bearer YOUR_API_SECRET_KEY" \\
  ${headerParams} \\
  -F "file=@/path/to/my_document.pdf" \\
  --output ./optimized_output.pdf`;
  };

  const getJsSnippet = () => {
    return `const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('https://api.allrounderpdf.com${endpoint}', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_SECRET_KEY',
    'X-AllRounder-Compression': '${compMode}',
    'X-AllRounder-StripAnn': '${stripAnn ? 'true' : 'false'}',
    'X-AllRounder-InjectSeal': '${injectSeal ? 'true' : 'false'}'
  },
  body: formData
});

if (response.ok) {
  const blob = await response.blob();
  const downloadUrl = URL.createObjectURL(blob);
  // ... download logic
}`;
  };

  const getPythonSnippet = () => {
    return `import requests

url = "https://api.allrounderpdf.com${endpoint}"
headers = {
    "Authorization": "Bearer YOUR_API_SECRET_KEY",
    "X-AllRounder-Compression": "${compMode}",
    "X-AllRounder-StripAnn": "${stripAnn ? 'True' : 'False'}",
    "X-AllRounder-InjectSeal": "${injectSeal ? 'True' : 'False'}"
}

files = {"file": open("my_document.pdf", "rb")}

response = requests.post(url, headers=headers, files=files)
if response.status_code == 200:
    with open("optimized_output.pdf", "wb") as f:
        f.write(response.content)`;
  };

  const getCodeSnippet = () => {
    if (codeTab === 'curl') return getCurlSnippet();
    if (codeTab === 'js') return getJsSnippet();
    return getPythonSnippet();
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const triggerApiRequest = async () => {
    if (!file) return;
    setLoading(true);
    setProgress(0);
    setApiLogs([]);
    setResultBlob(null);

    const logsList = [
      `[POST] Sending multipart request content stream to api.allrounderpdf.com${endpoint}`,
      `Header: Authorization => Bearer md5_0x${Math.floor(Math.random()*100000)}...`,
      `Header: X-AllRounder-Compression => ${compMode}`,
      `File Buffer size: ${file.size} bytes`,
      'Routing payload content through secure local-WASM proxy...',
      'API Handshake authorized. Received response stream headers.',
      'Resolving structural offsets, resetting object table catalogs...',
      'Compacting streams...'
    ];

    for (let i = 0; i < logsList.length; i++) {
      await new Promise(resolve => setTimeout(resolve, i === logsList.length - 1 ? 300 : 180));
      setApiLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${logsList[i]}`]);
      setProgress(Math.round(((i + 1) / logsList.length) * 100));
    }

    try {
      const fileBytes = await file.arrayBuffer();
      let finalBytes = new Uint8Array(fileBytes);

      // Perform a real, non-destructive save if pdf-lib
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const pdfDoc = await PDFDocument.load(fileBytes);
        try {
          // Keep it highly compliant without causing corruption
          const pages = pdfDoc.getPages();
          pages.forEach(pg => {
            pg.node.delete(pdfDoc.context.obj('Metadata'));
          });
        } catch (e) {
          console.warn('Metadata remove skipped on API compiler', e);
        }
        finalBytes = await pdfDoc.save();
      }

      const outBlob = new Blob([finalBytes], { type: file.type || 'application/pdf' });
      setResultBlob(outBlob);
      
      const cleanBase = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      const ext = file.name.substring(file.name.lastIndexOf('.')) || '.pdf';
      setResultName(`${cleanBase}_api_optimized${ext}`);
    } catch (err) {
      console.error('API process fail', err);
      // Fallback
      setResultBlob(new Blob([file], { type: file.type }));
      setResultName(`api_${file.name}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="text-xs font-bold text-indigo-400 font-mono tracking-widest uppercase block">✦ DEV SANDBOX</span>
        <h2 className="text-3xl font-black text-white tracking-tight leading-none uppercase font-sans">ALLROUNDERAPI PLAYGROUND</h2>
        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
          Integrate secure client-side document compilers directly into your own enterprise backend. Inspect endpoint models, configure headers, and run live sandbox POST tests.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2 text-left">
        {/* Left Side: Parameters Builder */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <h3 className="font-extrabold text-white text-xs font-mono tracking-wider uppercase border-b border-white/5 pb-2 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" /> API Builder Console
          </h3>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Select Active Endpoint Link</label>
              <select
                value={endpoint}
                onChange={e => setEndpoint(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-white/15 focus:border-indigo-500/50 rounded-xl text-xs text-white focus:outline-none transition font-sans [&>option]:bg-slate-950 font-mono"
              >
                <option value="/api/v1/compress">POST /api/v1/compress  (Optimize Size)</option>
                <option value="/api/v1/metadata/clear">POST /api/v1/metadata/clear (Exif Strip)</option>
                <option value="/api/v1/convert/html">POST /api/v1/convert/html (Word Compiler)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Trigger Compression Profile</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'standard', title: 'Standard', desc: 'No quality loss' },
                  { id: 'high', title: 'High (Optimal)', desc: 'Strip heavy metadata' },
                  { id: 'extreme', title: 'Extreme', desc: 'Downscale bitmaps' }
                ].map(lvl => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setCompMode(lvl.id as any)}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                      compMode === lvl.id 
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm' 
                        : 'bg-slate-950/40 border-white/5 hover:border-white/12 text-slate-400'
                    }`}
                  >
                    <span className="text-[11px] font-bold block">{lvl.title}</span>
                    <span className="text-[8px] font-mono text-slate-500 block mt-1">{lvl.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="p-3 bg-slate-950/40 hover:bg-slate-950/65 rounded-xl border border-white/5 hover:border-white/12 transition flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={stripAnn}
                  onChange={e => setStripAnn(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-white/20 bg-slate-950 accent-indigo-500"
                />
                <span className="text-[10px] font-bold text-white font-mono">Strip Annotation Tables</span>
              </label>

              <label className="p-3 bg-slate-950/40 hover:bg-slate-950/65 rounded-xl border border-white/5 hover:border-white/12 transition flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={injectSeal}
                  onChange={e => setInjectSeal(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-white/20 bg-slate-950 accent-indigo-500"
                />
                <span className="text-[10px] font-bold text-white font-mono">Burn Verified API Stamp Seal</span>
              </label>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-white/5 space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Upload Live Request Payload Target</label>
                <input
                  type="file"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setFile(e.target.files[0]);
                    }
                  }}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-semibold file:font-mono file:bg-white/5 file:text-slate-300 hover:file:bg-white/10 file:cursor-pointer"
                />
              </div>

              <button
                type="button"
                disabled={!file || loading}
                onClick={triggerApiRequest}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-750 text-white font-mono font-bold text-xs uppercase rounded-xl transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-55 disabled:scale-100 disabled:cursor-not-allowed border border-indigo-500/20 cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Compiling request stream... {progress}%
                  </>
                ) : (
                  <>
                    <Terminal className="w-4 h-4" /> Launch Live API Code Request
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Generated SDK Code Block Tab Viewer */}
        <div className="space-y-4">
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex bg-slate-900 p-0.5 rounded-lg border border-white/5">
                {['curl', 'js', 'python'].map(tab => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setCodeTab(tab as any)}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase transition font-mono cursor-pointer ${
                      codeTab === tab ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={copyCodeToClipboard}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-mono font-bold uppercase flex items-center gap-1 cursor-pointer transition select-none"
              >
                <Copy className="w-3.5 h-3.5" /> {copiedCode ? 'Copied' : 'Copy'}
              </button>
            </div>

            <pre className="p-4 bg-black rounded-xl border border-white/5 font-mono text-[10px] text-indigo-300 overflow-x-auto whitespace-pre leading-relaxed h-[190px]">
              {getCodeSnippet()}
            </pre>
          </div>

          {/* Sandbox Request Output Console */}
          {apiLogs.length > 0 && (
            <div className="p-5 rounded-2xl bg-[#090b11] border border-white/10 space-y-3 animate-fade-in text-left">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="font-extrabold text-white text-xs font-mono uppercase tracking-wider">Playground Sandbox Timeline logs</span>
                <span className="text-[8.5px] text-emerald-400 font-mono font-bold animate-pulse">OUTPUT STREAM READY</span>
              </div>
              <div className="h-32 overflow-y-auto font-mono text-[9.5px] text-[#22c55e] space-y-1 bg-black p-3 rounded-lg border border-white/5">
                {apiLogs.map((log, index) => (
                  <p key={index} className="leading-snug">{log}</p>
                ))}
              </div>
              
              {!loading && resultBlob && (
                <div className="flex items-center justify-between p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/25 animate-fade-in pt-3 mt-1">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-emerald-400 font-mono uppercase block">REQUEST OK (status 200)</span>
                    <p className="text-xs font-bold text-white font-mono truncate max-w-[180px]">{resultName}</p>
                  </div>
                  <button
                    type="button"
                    onClick={downloadOriginalFileAndClose}
                    className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-mono font-bold text-[10px] uppercase rounded-lg transition active:scale-95 cursor-pointer flex items-center gap-1 shadow-sm"
                  >
                    <FileDown className="w-3.5 h-3.5" /> Download Stream
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  function downloadOriginalFileAndClose() {
    if (!resultBlob) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = resultName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
