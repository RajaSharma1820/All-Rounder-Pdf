import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Mail, Lock, User, Chrome, Sparkles, AlertCircle, CheckCircle2, ArrowRight, ShieldCheck, LogIn, UserPlus
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

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  colors: any;
  onAuthSuccess: (user: any) => void;
}

export default function AuthModal({ isOpen, onClose, colors, onAuthSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

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
      
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        onAuthSuccess(userCredential.user);
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password credentials are not enabled in the Firebase console. Please use Google Login or verify console settings.');
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
      
      setSuccess('Logged in successfully!');
      setTimeout(() => {
        onAuthSuccess(userCredential.user);
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid credentials. Please double-check and try again.');
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
      // Configure prompt to let users select account easily
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      await handleSyncUser(result.user);
      
      setSuccess('Signed in with Google!');
      setTimeout(() => {
        onAuthSuccess(result.user);
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-blocked') {
        setError('Popup was blocked by your browser. Please allow popups for this site.');
      } else {
        setError(err.message || 'Google Auth failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div 
        id="auth-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ type: 'spring', duration: 0.4 }}
          id="auth-modal-container"
          className="relative w-full max-w-md overflow-hidden bg-slate-900 border border-white/10 rounded-3xl shadow-2xl p-6 lg:p-8"
        >
          {/* Neon Top Orbit Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500 via-indigo-500 to-purple-500" />

          {/* Close button */}
          <button
            type="button"
            id="auth-modal-close"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title and Badge */}
          <div className="flex flex-col items-center text-center mt-2 mb-6">
            <div className="inline-flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] font-mono text-slate-300 font-bold uppercase tracking-wider">SECURE LANDBOX ACCESS</span>
            </div>
            <h2 className="text-xl font-sans font-bold text-white tracking-tight">
              {tab === 'signin' ? 'Welcome Back Officer' : 'Create Sandbox Account'}
            </h2>
            <p className="text-xs text-slate-400 mt-1.5 max-w-[280px]">
              Access persistent processed records, secure workspaces, and premium helpers.
            </p>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-2 bg-slate-950/60 p-1 rounded-2xl border border-white/5 mb-6">
            <button
              type="button"
              id="auth-tab-signin"
              onClick={() => { setTab('signin'); setError(null); }}
              className={`py-2 text-xs font-mono font-medium rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                tab === 'signin' 
                  ? `${colors.sidebarActive.replace('bg-opacity', '')} text-white font-bold border border-white/15` 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" /> SIGN IN
            </button>
            <button
              type="button"
              id="auth-tab-signup"
              onClick={() => { setTab('signup'); setError(null); }}
              className={`py-2 text-xs font-mono font-medium rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                tab === 'signup' 
                  ? `${colors.sidebarActive.replace('bg-opacity', '')} text-white font-bold border border-white/15` 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" /> REGISTER
            </button>
          </div>

          <div className="space-y-4">
            {/* Success and Error messages */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  id="auth-error-alert"
                  className="p-3 bg-red-500/10 border border-red-500/25 rounded-2xl flex items-start gap-2.5 text-xs text-red-300"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">Request Failed</p>
                    <p className="text-[11px] opacity-90">{error}</p>
                  </div>
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  id="auth-success-alert"
                  className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-300"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">Authentication Completed</p>
                    <p className="text-[11px] opacity-90">{success}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Form */}
            <form onSubmit={tab === 'signin' ? handleEmailSignIn : handleEmailSignUp} className="space-y-3.5" id="auth-credential-form">
              {tab === 'signup' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">Display Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-500" />
                    <input
                      type="text"
                      className="w-full bg-slate-950 border border-white/10 hover:border-white/20 focus:border-indigo-500/50 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all"
                      placeholder="e.g. Neo Jenkins"
                      value={displayName}
                      disabled={loading}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-500" />
                  <input
                    type="email"
                    className="w-full bg-slate-950 border border-white/10 hover:border-white/20 focus:border-indigo-500/50 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all"
                    placeholder="name@company.com"
                    value={email}
                    disabled={loading}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">Secure Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-500" />
                  <input
                    type="password"
                    className="w-full bg-slate-950 border border-white/10 hover:border-white/20 focus:border-indigo-500/50 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all"
                    placeholder="Min. 6 alphanumeric characters"
                    value={password}
                    disabled={loading}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                id="auth-submit-btn"
                className={`w-full py-2.5 rounded-xl text-xs font-mono font-bold tracking-wide text-white transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 ${colors.btnPrimary} opacity-90 hover:opacity-100 disabled:opacity-50`}
              >
                {loading ? 'Processing Workspace...' : (tab === 'signin' ? 'AUTHORIZE WORKSPACE' : 'INITIALIZE ACCOUNT')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="relative my-6 text-center">
              <span className="absolute inset-x-0 top-1/2 border-b border-white/5" />
              <span className="relative inline-block bg-slate-900 px-3 text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                OR FEDERATED IDENTITY
              </span>
            </div>

            {/* Google Authentication */}
            <button
              type="button"
              disabled={loading}
              onClick={handleGoogleSignIn}
              id="google-signin-btn"
              className="w-full py-2.5 rounded-xl text-xs font-mono font-bold border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
            >
              <Chrome className="w-4 h-4 text-teal-400" /> CONTINUE WITH GOOGLE
            </button>
          </div>

          {/* Verification Warning for developers */}
          <div className="mt-6 border-t border-white/5 pt-4 flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5 animate-pulse" />
            <p className="text-[10px] text-slate-500 font-mono leading-relaxed text-left">
              Google Auth is prepared out of the box. For Email Signups/Logins, ensure the Email Provider is enabled in the Firebase Console if you experience issues.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
