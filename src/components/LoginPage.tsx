import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, Lock, User, Chrome, Sparkles, AlertCircle, CheckCircle2, ArrowRight, ShieldCheck, LogIn, UserPlus, FileText, Database, ShieldAlert, ArrowLeft
} from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

interface LoginPageProps {
  colors: any;
  onAuthSuccess: (user: any) => void;
  onBackToDashboard: () => void;
}

export default function LoginPage({ colors, onAuthSuccess, onBackToDashboard }: LoginPageProps) {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSyncUser = async (user: any, nameToUse?: string) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email || '',
          displayName: nameToUse || user.displayName || user.email?.split('@')[0] || 'User',
          createdAt: serverTimestamp(),
        });
      }
    } catch (e) {
      console.error('Error syncing user info to firestore:', e);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!email || !password || !displayName) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      await handleSyncUser(userCredential.user, displayName);
      
      setSuccess('Account successfully initialized! Opening secure sandbox lobby...');
      setTimeout(() => {
        onAuthSuccess(userCredential.user);
        onBackToDashboard();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(err.message || 'An error occurred during registration.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await handleSyncUser(userCredential.user);
      
      setSuccess('Authorization complete! Welcome back.');
      setTimeout(() => {
        onAuthSuccess(userCredential.user);
        onBackToDashboard();
      }, 1200);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid credentials. Please verify your email and password.');
      } else {
        setError(err.message || 'Failed to sign in.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      await handleSyncUser(result.user);
      
      setSuccess('Google credentials authorized!');
      setTimeout(() => {
        onAuthSuccess(result.user);
        onBackToDashboard();
      }, 1200);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-blocked') {
        setError('The Google sign-in window was blocked. Please enable popups.');
      } else {
        setError(err.message || 'Google Authentication failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8" id="sandbox-login-page">
      {/* Visual Back Command Row */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="text-xs font-mono font-bold text-slate-400 hover:text-white transition cursor-pointer flex items-center gap-2"
        >
          {/* Custom Back Chevron icon directly in React inline to keep it self-contained */}
          <span className="w-5 h-5 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-white transition transform hover:scale-105 select-none">
            &larr;
          </span>
          BACK TO WORKSPACE
        </button>
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
          SECURITY PROTOCOL CONTROL
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Interactive Panel: Feature Pitch Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-white/10 p-6 rounded-2xl bg-slate-950/40 relative overflow-hidden space-y-4">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-2xl"></div>
            
            <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[9px] font-mono text-slate-300 font-bold uppercase tracking-wider">PERSISTENT SANDBOX CLOUD</span>
            </div>
            
            <h3 className="text-xl font-bold text-white tracking-tight leading-snug">
              WHY CONNECT YOUR WORKSPACE PROFILE?
            </h3>
            
            <p className="text-slate-400 text-xs leading-relaxed">
              Unlock cross-device record management and advanced persistent logging securely on our Firestore-backed database vault.
            </p>

            <div className="space-y-4 pt-3 border-t border-white/5">
              {/* Point 1 */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
                  {/* Inline Document Icon */}
                  <span className="font-bold font-mono text-xs select-none">DOC</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Operations Tracker</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5">
                    No more losing processed PDFs. Your complete sandboxed operations history syncs dynamically to your profile.
                  </p>
                </div>
              </div>

              {/* Point 2 */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 shrink-0">
                  {/* Inline Database Icon */}
                  <span className="font-bold font-mono text-xs select-none">DB</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Durable Cloud Storage</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5">
                    Metadata and stats are securely retained across multiple sessions, devices, and physical workspace systems.
                  </p>
                </div>
              </div>

              {/* Point 3 */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                  {/* Inline Security Icon */}
                  <span className="font-bold font-mono text-xs select-none">SEC</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Strict User Partitioning</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5">
                    Durable Firestore rules restrict metadata writes explicitly to verified owners, matching active session tokens.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-slate-500 font-mono text-[10px] space-y-1.5 leading-relaxed text-left px-2">
            <p>✦ All computations inside the processing pipelines (Merge, Split, Rotates, Watermarks etc.) continue to run offline on webassembly buffers within your local browser context.</p>
            <p>✦ Creating a user session only stores high-level statistics and processed download logs to assist in dashboard operations tracking.</p>
          </div>
        </div>

        {/* Right Active Panel: Login / Sign Up Panel Form */}
        <div className="lg:col-span-7 bg-slate-950/60 border border-white/5 hover:border-white/10 rounded-2xl p-6 md:p-8 space-y-6 text-left transition-all">
          
          {/* Header Title Switcher Indicator */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-black text-white tracking-tight uppercase">
              {tab === 'signin' ? 'Verify Personal Key' : 'Establish Member Slot'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {tab === 'signin' 
                ? 'Sign in to sync offline downloads with your persistent history profile.' 
                : 'Create an account to begin logging and retrieving processed items across environments.'}
            </p>
          </div>

          {/* Tab Button Toggles */}
          <div className="grid grid-cols-2 bg-slate-950 p-1 rounded-xl border border-white/5">
            <button
              type="button"
              id="page-tab-signin"
              onClick={() => { setTab('signin'); setError(null); }}
              className={`py-2 text-xs font-mono font-medium rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                tab === 'signin' 
                  ? `${colors.sidebarActive.replace('bg-opacity', '')} text-white font-bold border border-white/10` 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              SIGN IN
            </button>
            <button
              type="button"
              id="page-tab-signup"
              onClick={() => { setTab('signup'); setError(null); }}
              className={`py-2 text-xs font-mono font-medium rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                tab === 'signup' 
                  ? `${colors.sidebarActive.replace('bg-opacity', '')} text-white font-bold border border-white/10` 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              REGISTER ACCOUNT
            </button>
          </div>

          {/* Success / Error Alerts with Micro-Animations */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                id="page-auth-error"
                className="p-3.5 bg-red-500/15 border border-red-500/20 rounded-xl flex items-start gap-2.5 text-xs text-red-300"
              >
                <div className="w-5 h-5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 font-bold shrink-0">!</div>
                <div className="flex-1">
                  <p className="font-semibold">Security Error</p>
                  <p className="text-[11px] opacity-90">{error}</p>
                </div>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                id="page-auth-success"
                className="p-3.5 bg-emerald-500/15 border border-emerald-500/20 rounded-xl flex items-start gap-2.5 text-xs text-emerald-300"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold shrink-0">✓</div>
                <div className="flex-1">
                  <p className="font-semibold">Authorization Approved</p>
                  <p className="text-[11px] opacity-90">{success}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Credential Submit Input fields */}
          <form onSubmit={tab === 'signin' ? handleEmailSignIn : handleEmailSignUp} className="space-y-4" id="page-credential-form">
            {tab === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">Display Identity (Username)</label>
                <input
                  type="text"
                  className="w-full bg-slate-950 border border-white/10 hover:border-white/20 focus:border-indigo-500/50 rounded-xl py-2 px-3.5 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all font-mono"
                  placeholder="e.g. Neo Cloudsworth"
                  value={displayName}
                  disabled={loading}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">Electronic Mail Address</label>
              <input
                type="email"
                className="w-full bg-slate-950 border border-white/10 hover:border-white/20 focus:border-indigo-500/50 rounded-xl py-2 px-3.5 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all font-mono"
                placeholder="name@organization.com"
                value={email}
                disabled={loading}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">Authentication Password</label>
              <input
                type="password"
                className="w-full bg-slate-950 border border-white/10 hover:border-white/20 focus:border-indigo-500/50 rounded-xl py-2 px-3.5 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all font-mono"
                placeholder="Min. 6 alphanumeric character keys"
                value={password}
                disabled={loading}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              id="page-auth-submit-btn"
              className={`w-full py-3 rounded-xl text-xs font-mono font-bold tracking-wide text-white transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 ${colors.btnPrimary} opacity-90 hover:opacity-100 disabled:opacity-50`}
            >
              {loading ? 'PROCESSING SECURE WORKSPACE...' : (tab === 'signin' ? 'AUTHORIZE WORKSPACE' : 'INITIALIZE ACCOUNT')}
              &rarr;
            </button>
          </form>

          {/* Social Sign In Div split line */}
          <div className="relative my-6 text-center">
            <span className="absolute inset-x-0 top-1/2 border-b border-white/5" />
            <span className="relative inline-block bg-[#090d16] px-3 text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">
              OR FEDERATED CREDENTIAL SIGN ON
            </span>
          </div>

          {/* Federated Google Provider Button */}
          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleSignIn}
            id="page-google-signin-btn"
            className="w-full py-3 rounded-xl text-xs font-mono font-bold border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 select-none"
          >
            {/* Inline SVG rendering Google colorful symbol to look standard and highly professional */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.87-2.6-3.3-4.53-6.16-4.53z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            AUTHORIZE INTERFACE WITH GOOGLE
          </button>

        </div>
      </div>
    </div>
  );
}
