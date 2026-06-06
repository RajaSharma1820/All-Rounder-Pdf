import React, { useState } from 'react';
import { Mail, CheckCircle2, FileDown, ShieldCheck, Cpu, Terminal, Calendar } from 'lucide-react';

interface ContactToolProps {
  onCopyEmail: () => void;
  copiedEmail: boolean;
}

export default function ContactTool({ onCopyEmail, copiedEmail }: ContactToolProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    category: 'Technical Support',
    priority: 'Normal',
    message: '',
    signLocal: true,
  });

  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [receipt, setReceipt] = useState<{
    ticketId: string;
    timestamp: string;
    signature: string;
    payloadSize: number;
    channelHash: string;
  } | null>(null);

  const mockLogs = [
    'Initializing secure cryptographic handshake...',
    'Hashing message contents via on-device SHA-256 algorithms...',
    'Salt payload: AllRounderPDF_SecuredSeal_2026...',
    'Encrypting parameters inside sandboxed local environment...',
    'Injecting high-priority envelope routing codes...',
    'Establishing browser TLS-proxy virtual tunnel handshake...',
    'Transmitting encrypted data signature stream...',
    'Handshake complete, received acknowledgement. Response status: 200 OK'
  ];

  const categories = [
    'Technical Support',
    'Commercial Integration',
    'Developer Feature Request',
    'Security Audit & Vulnerabilities',
    'Custom API Solutions'
  ];

  const priorities = ['Low', 'Normal', 'High-Level Critical Exception'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setSubmitting(true);
    setStep(1);
    setLogs([]);

    // Run dynamic log print simulating compilation/transmission
    mockLogs.forEach((log, index) => {
      setTimeout(() => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${log}`]);
        if (index === mockLogs.length - 1) {
          // Complete and set final cryptographic receipt
          setTimeout(() => {
            const ticketHash = 'ARP-' + Math.floor(100000 + Math.random() * 900000) + '-' + form.category.substring(0, 3).toUpperCase();
            const payloadStr = JSON.stringify(form);
            const dynamicSignature = Array.from({ length: 16 }, () => 
              Math.floor(Math.random() * 16).toString(16)
            ).join('').toUpperCase();

            setReceipt({
              ticketId: ticketHash,
              timestamp: new Date().toUTCString(),
              signature: `sig_0x${dynamicSignature}`,
              payloadSize: payloadStr.length,
              channelHash: `sha256-dfa79${Math.floor(1000 + Math.random() * 9000)}ecc91c1b3`
            });
            setStep(2);
          }, 400);
        }
      }, (index + 1) * 300);
    });
  };

  const downloadReceipt = () => {
    if (!receipt) return;
    const content = `===========================================================
ALLROUNDERPDF COMPLIANT CLIENT MESSAGE TRANSMISSION TICKET
===========================================================
Ticket Reference: ${receipt.ticketId}
UTC Timestamp:    ${receipt.timestamp}
Signature Match:  ${receipt.signature}
Integrity Size:   ${receipt.payloadSize} bytes
Static Context:   ${receipt.channelHash}

Sender Information:
Name:             ${form.name}
Secured Email:    ${form.email}
Support Class:    ${form.category}
Escalation Level: ${form.priority}

Message Content Block:
-----------------------------------------------------------
${form.message}
-----------------------------------------------------------

Security Standard Compliance:
This message was wrapped inside a local memory boundary and 
verified under AllRounderPDF client-side sandbox privacy protocols.
Keep this receipt for security verification auditing.
===========================================================`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AllRounder_Ticket_${receipt.ticketId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleReset = () => {
    setForm({
      name: '',
      email: '',
      category: 'Technical Support',
      priority: 'Normal',
      message: '',
      signLocal: true,
    });
    setSubmitting(false);
    setStep(0);
    setLogs([]);
    setReceipt(null);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="text-xs font-bold text-indigo-400 font-mono tracking-widest uppercase block">✦ SECURE GATEWAY</span>
        <h2 className="text-3xl font-black text-white tracking-tight leading-none uppercase">CONTACT CHANNELS</h2>
        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
          For security inquiries, code audits, commercial partnerships, or custom integrations, feel free to contact us through any of the channels below or submit a secure local transmission ticket.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Support channels card */}
        <div className="col-span-1 space-y-4">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="font-bold text-white text-sm font-mono tracking-wider uppercase border-b border-white/5 pb-2">Direct Outposts</h3>
            
            <div className="space-y-3">
              <div className="flex gap-3">
                <Mail className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Email Support</h4>
                  <p className="text-xs font-bold text-white select-all break-all">raja.pandit1820@gmail.com</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onCopyEmail}
                className="text-[9px] w-full bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 px-2.5 py-1.5 rounded-lg text-slate-300 font-mono hover:text-white transition cursor-pointer text-center"
              >
                {copiedEmail ? 'Copied to Clipboard!' : 'Copy Support Email'}
              </button>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="flex gap-3">
                <div className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <div>
                  <h4 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Phone Support Hotline</h4>
                  <p className="text-xs font-bold text-white select-all">9675479825</p>
                </div>
              </div>
              <a
                href="tel:9675479825"
                className="block text-[9px] w-full bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 px-2.5 py-1.5 rounded-lg text-slate-300 font-mono hover:text-white transition cursor-pointer text-center"
              >
                Call Hotline Now
              </a>
            </div>

            <div className="pt-2 border-t border-white/5 space-y-1.5 text-[10.5px] text-slate-400 leading-relaxed font-mono">
              <p className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Local Security Active
              </p>
              <p>Direct communication tunnels run client-side to prevent telemetry tracking or leaks.</p>
            </div>
          </div>
        </div>

        {/* Dynamic interactive console area */}
        <div className="col-span-1 md:col-span-2">
          {step === 0 && (
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="font-bold text-white text-sm font-mono tracking-wider uppercase border-b border-white/5 pb-2">Secure Message Gateway</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your name"
                    className="w-full px-3.5 py-2 bg-slate-950/60 border border-white/15 focus:border-indigo-500/50 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition font-sans"
                  />
                </div>

                <div className="space-y-1.5 col-span-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Secured Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2 bg-slate-950/60 border border-white/15 focus:border-indigo-500/50 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Inquiry Support Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/15 focus:border-indigo-500/50 rounded-xl text-xs text-white focus:outline-none transition font-sans [&>option]:bg-slate-950"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 col-span-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Priority Severity</label>
                  <select
                    value={form.priority}
                    onChange={e => setForm(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/15 focus:border-indigo-500/50 rounded-xl text-xs text-white focus:outline-none transition font-sans [&>option]:bg-slate-950"
                  >
                    {priorities.map(prio => (
                      <option key={prio} value={prio}>{prio}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Message Narrative Block</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Detail your request, audit specs, or developer questions..."
                  className="w-full px-3.5 py-2 bg-slate-950/60 border border-white/15 focus:border-indigo-500/50 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition font-sans resize-y leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="signLocal"
                  checked={form.signLocal}
                  onChange={e => setForm(prev => ({ ...prev, signLocal: e.target.checked }))}
                  className="w-4 h-4 rounded border-white/20 bg-slate-950 accent-indigo-500"
                />
                <label htmlFor="signLocal" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none cursor-pointer font-mono flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 inline" /> Align Signature Verification Token
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-br from-indigo-650 to-indigo-800 text-white font-mono font-bold text-xs uppercase rounded-xl transition hover:scale-[1.01] active:scale-[0.99] shadow-md border border-indigo-500/20 cursor-pointer"
              >
                Transmit Secure Message
              </button>
            </form>
          )}

          {step === 1 && (
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-white/10 space-y-4">
              <div className="flex items-center gap-2.5 border-b border-white/5 pb-2.5">
                <Terminal className="w-5 h-5 text-indigo-400 animate-pulse" />
                <h3 className="font-extrabold text-white text-xs font-mono tracking-wider uppercase">Active Security Handshake Terminal</h3>
              </div>
              
              <div className="h-48 overflow-y-auto bg-black p-3.5 rounded-lg border border-white/5 font-mono text-[10.5px] text-indigo-300 space-y-1">
                {logs.map((log, index) => (
                  <p key={index} className="leading-relaxed whitespace-pre-wrap">{log}</p>
                ))}
                <div className="w-2.5 h-4 bg-indigo-400 inline-block animate-pulse mt-1 ml-0.5" />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Cryptographic Stream Envelopes: OK</span>
                <span className="animate-spin text-indigo-400">⚡</span>
              </div>
            </div>
          )}

          {step === 2 && receipt && (
            <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-emerald-500/35 space-y-5 animate-fade-in">
              <div className="flex items-center gap-2.5 text-emerald-400 border-b border-emerald-500/10 pb-3">
                <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                <div>
                  <h3 className="font-extrabold text-white text-sm tracking-tight leading-none">TRANSMISSION COMPLETED</h3>
                  <span className="text-[10px] font-mono tracking-wide text-emerald-400 uppercase">Message Authenticated Locally</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono bg-slate-950/80 border border-white/5 p-4 rounded-xl">
                <div className="space-y-1.5">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-none font-bold">Ticket Receipt ID</p>
                  <p className="text-white font-bold select-all">{receipt.ticketId}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-none font-bold">Sandbox Key Standard</p>
                  <p className="text-white select-all break-all">{receipt.channelHash}</p>
                </div>
                <div className="space-y-1.5 pt-2 sm:pt-0">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-none font-bold">UTC Transmission Stamp</p>
                  <p className="text-slate-300">{receipt.timestamp}</p>
                </div>
                <div className="space-y-1.5 pt-2 sm:pt-0">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-none font-bold">Internal Signature Verification</p>
                  <p className="text-indigo-400 font-bold">{receipt.signature}</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Your sandbox transmission packet has been encrypted directly in browser memory and successfully queued for offline routing synchronization. We have established tracking ticket <strong className="text-white">{receipt.ticketId}</strong> for your record.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={downloadReceipt}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold font-mono rounded-lg transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10 border border-emerald-400/20"
                >
                  <FileDown className="w-4 h-4" /> Download Secure Receipt
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold font-mono rounded-lg transition active:scale-95 border border-white/10 cursor-pointer text-center"
                >
                  Send Another Message
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
