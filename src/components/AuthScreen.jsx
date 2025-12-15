import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Key, ArrowRight, Music, AlertCircle, CheckCircle, ChevronLeft } from 'lucide-react';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export default function AuthScreen({ onAuth, loading, authError, landing }) {
  const [view, setView] = useState('login'); // 'login', 'register', 'forgot'
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [resetStatus, setResetStatus] = useState(null); 

  // Theme Data
  const welcomeTitle = landing?.hero_title || "Taodocos Begena";
  const welcomeSubtitle = landing?.hero_subtitle || "Master the spiritual sounds of the Harp of David.";
  
  const rawUrl = landing?.hero_background?.url;
  const bgImage = rawUrl 
    ? (rawUrl.startsWith('http') ? rawUrl : `${STRAPI_URL}${rawUrl}`) 
    : null;

  // --- HANDLERS ---

  const handleSubmit = (e) => {
    e.preventDefault();
    if (view === 'forgot') {
      handleForgotPassword();
    } else {
      const payload = view === 'register' 
        ? formData 
        : { identifier: formData.email, password: formData.password };
      onAuth(payload, view === 'register');
    }
  };

  const handleForgotPassword = async () => {
    setResetStatus({ type: 'loading', msg: 'Sending...' });
    try {
      const res = await fetch(`${STRAPI_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      
      if (data.error) throw new Error(data.error.message);
      
      setResetStatus({ type: 'success', msg: 'Reset link sent! Check your email.' });
    } catch (err) {
      setResetStatus({ type: 'error', msg: err.message || 'Failed to send email.' });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans bg-[#120a05]">
      
      {/* --- BACKGROUND --- */}
      <div className="absolute inset-0 z-0">
        {bgImage ? (
          <img src={bgImage} alt="Background" className="w-full h-full object-cover object-top opacity-30" />
        ) : (
          <div className="w-full h-full bg-[#1a0f0a]" />
        )}
        {/* Warm/Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#120a05] via-[#120a05]/90 to-[#451a03]/20" />
      </div>

      {/* --- CONTENT --- */}
      <div className="relative z-10 w-full max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
        
        {/* Left Side: Text */}
        <div className="hidden lg:block pr-12 pt-10">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="w-20 h-20 rounded-full bg-amber-900/40 border border-amber-500/50 flex items-center justify-center mb-8 backdrop-blur-md shadow-[0_0_30px_rgba(217,119,6,0.2)]">
              <Music className="text-amber-500 w-10 h-10" />
            </div>
            <h1 className="font-cinzel text-6xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-xl">
              {welcomeTitle}
            </h1>
            <div className="border-l-4 border-amber-600 pl-6">
              <p className="text-[#e7e5e4] text-xl leading-relaxed font-light font-serif italic">
                "{welcomeSubtitle}"
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Side: The Card */}
        <div className="flex justify-center lg:justify-end">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="w-full max-w-[450px] bg-[#1a0f0a]/80 backdrop-blur-md border border-amber-500/20 p-8 md:p-12 rounded-3xl relative shadow-2xl"
          >
            
            {/* Back Button (Only for Forgot/Register modes) */}
            {view !== 'login' && (
              <button 
                onClick={() => { setView('login'); setResetStatus(null); setAuthError(''); }}
                className="absolute top-8 left-8 text-stone-500 hover:text-white transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <div className="text-center mb-8 mt-2">
              <h2 className="font-cinzel text-3xl text-white mb-2">
                {view === 'register' ? 'New Student' : view === 'forgot' ? 'Reset Password' : 'Sign In'}
              </h2>
              <p className="text-stone-400 text-sm font-serif italic">
                {view === 'register' ? "Begin your spiritual journey" : view === 'forgot' ? "We will send a link to your email" : "Welcome back to the sanctuary"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {view === 'register' && (
                <div className="relative group">
                  <User className="absolute left-4 top-3.5 text-stone-500 w-5 h-5 group-focus-within:text-amber-500 transition-colors" />
                  <input 
                    type="text" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-amber-500 focus:outline-none transition-all placeholder-stone-600"
                    placeholder="Username"
                    value={formData.username} 
                    onChange={e => setFormData({...formData, username: e.target.value})} 
                    required 
                  />
                </div>
              )}

              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 text-stone-500 w-5 h-5 group-focus-within:text-amber-500 transition-colors" />
                <input 
                  type="email" 
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-amber-500 focus:outline-none transition-all placeholder-stone-600"
                  placeholder="Email Address"
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  required 
                />
              </div>

              {view !== 'forgot' && (
                <div className="relative group">
                  <Key className="absolute left-4 top-3.5 text-stone-500 w-5 h-5 group-focus-within:text-amber-500 transition-colors" />
                  <input 
                    type="password" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-amber-500 focus:outline-none transition-all placeholder-stone-600"
                    placeholder="Password"
                    value={formData.password} 
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                    required 
                  />
                  {view === 'login' && (
                    <button 
                      type="button"
                      onClick={() => setView('forgot')}
                      className="absolute right-4 top-3.5 text-[10px] text-stone-500 hover:text-amber-500 uppercase tracking-wider font-bold transition-colors"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
              )}

              {/* Error / Status Messages */}
              {authError && view !== 'forgot' && (
                <div className="p-3 rounded-lg bg-red-900/20 border border-red-900/50 text-red-200 text-xs text-center flex items-center justify-center gap-2">
                  <AlertCircle size={14} /> {authError}
                </div>
              )}

              {resetStatus && view === 'forgot' && (
                <div className={`p-3 rounded-lg border text-xs text-center flex items-center justify-center gap-2 ${resetStatus.type === 'success' ? 'bg-green-900/20 border-green-800 text-green-200' : 'bg-red-900/20 border-red-900 text-red-200'}`}>
                  {resetStatus.type === 'success' ? <CheckCircle size={14}/> : <AlertCircle size={14}/>} 
                  {resetStatus.msg}
                </div>
              )}

              <button 
                disabled={loading || (view === 'forgot' && resetStatus?.type === 'loading')} 
                className="w-full bg-amber-700 hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(217,119,6,0.3)] flex items-center justify-center gap-2 mt-6 uppercase tracking-widest text-xs"
              >
                {loading ? 'Processing...' : view === 'register' ? 'Start Journey' : view === 'forgot' ? 'Send Reset Link' : 'Enter Sanctuary'}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            {/* Switch Mode Link */}
            {view === 'login' && (
              <div className="mt-8 text-center border-t border-white/5 pt-6">
                <p className="text-stone-500 text-xs mb-2">New to the school?</p>
                <button 
                  onClick={() => { setView('register'); setAuthError(''); }} 
                  className="text-amber-500 hover:text-amber-400 text-sm font-bold uppercase tracking-wider transition-colors"
                >
                  Apply for Access
                </button>
              </div>
            )}

          </motion.div>
        </div>
      </div>
    </div>
  );
}