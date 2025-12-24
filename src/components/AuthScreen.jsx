import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Key, ArrowRight, Music, AlertCircle, CheckCircle, 
  Sparkles, Eye, EyeOff 
} from 'lucide-react';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export default function AuthScreen({ onAuth, loading, authError, landing }) {
  const [view, setView] = useState('login'); // 'login', 'register', 'forgot'
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [resetStatus, setResetStatus] = useState(null);
  
  // New State for Password Visibility
  const [showPassword, setShowPassword] = useState(false);

  // Theme Data
  const welcomeTitle = landing?.hero_title || "Taodocos Begena";
  const welcomeSubtitle = landing?.hero_subtitle || "Master the spiritual sounds of the Harp of David.";
  
  // Background Logic
  const rawUrl = landing?.hero_background?.url;
  const bgImage = rawUrl 
    ? (rawUrl.startsWith('http') ? rawUrl : `${STRAPI_URL}${rawUrl}`) 
    : null;

  // --- HANDLERS (Unchanged) ---
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
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans bg-[#0c0a09]">
      
      {/* --- BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0 select-none">
        {bgImage ? (
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
            className="w-full h-full"
          >
            <img src={bgImage} alt="Background" className="w-full h-full object-cover object-center opacity-30" />
          </motion.div>
        ) : (
          <div className="w-full h-full bg-[#120a05]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-[#0c0a09]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0a09] via-transparent to-[#0c0a09]/80" />
      </div>

      {/* --- MAIN LAYOUT --- */}
      <div className="relative z-10 w-full max-w-[1400px] px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[80vh]">
        
        {/* LEFT SIDE: Hero Text */}
        <div className="hidden lg:flex lg:col-span-7 flex-col justify-center pr-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 1, ease: "easeOut" }}
          >
             <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-[0.2em] mb-8 backdrop-blur-md">
                <Sparkles size={14} /> Sacred Music Learning
             </div>

            <h1 className="font-cinzel text-7xl xl:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white via-stone-200 to-stone-500 mb-8 leading-tight drop-shadow-2xl">
              {welcomeTitle}
            </h1>
            
            <div className="flex items-start gap-6 max-w-xl">
               <div className="w-1 h-24 bg-gradient-to-b from-amber-600 to-transparent rounded-full" />
               <p className="text-stone-300 text-xl md:text-2xl leading-relaxed font-serif font-light opacity-90">
                 {welcomeSubtitle}
               </p>
            </div>
          </motion.div>
        </div>

        {/* RIGHT SIDE: Auth Card */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <motion.div 
            initial={{ opacity: 0, y: 40 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-[480px] relative"
          >
            {/* Ambient Glow */}
            <div className="absolute -inset-1 bg-gradient-to-b from-amber-600/20 to-transparent rounded-3xl blur-2xl opacity-50" />
            
            <div className="relative bg-[#120a05]/80 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-2xl shadow-2xl">
              
              {/* Header Icon */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-[#1c130e] rounded-full border border-amber-900/50 flex items-center justify-center shadow-xl shadow-black/50">
                  <Music className="text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" size={32} />
              </div>

              {/* Form Content */}
              <div className="mt-8">
                <div className="text-center mb-8">
                  <h2 className="font-cinzel text-3xl text-white mb-2">
                    {view === 'forgot' ? 'Reset Password' : 'Welcome'}
                  </h2>
                  <p className="text-stone-400 text-sm font-serif">
                     {view === 'register' ? "Start your journey today" : view === 'forgot' ? "Recover your account access" : "Sign in to continue learning"}
                  </p>
                </div>

                {/* Tab Switcher */}
                {view !== 'forgot' && (
                  <div className="flex p-1 bg-black/40 rounded-lg mb-8 border border-white/5">
                    <button 
                      onClick={() => setView('login')}
                      className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${view === 'login' ? 'bg-amber-900/40 text-amber-500 shadow-sm' : 'text-stone-500 hover:text-stone-300'}`}
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={() => setView('register')}
                      className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${view === 'register' ? 'bg-amber-900/40 text-amber-500 shadow-sm' : 'text-stone-500 hover:text-stone-300'}`}
                    >
                      New Account
                    </button>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {view === 'register' && (
                    <div className="group">
                      <div className="relative">
                        <User className="absolute left-4 top-4 text-stone-500 w-5 h-5 group-focus-within:text-amber-500 transition-colors" />
                        <input 
                          type="text" 
                          className="w-full bg-[#0a0503] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-600/50 focus:bg-black transition-all"
                          placeholder="Choose a Username"
                          value={formData.username} 
                          onChange={e => setFormData({...formData, username: e.target.value})} 
                          required 
                        />
                      </div>
                    </div>
                  )}

                  <div className="group">
                    <div className="relative">
                      <Mail className="absolute left-4 top-4 text-stone-500 w-5 h-5 group-focus-within:text-amber-500 transition-colors" />
                      <input 
                        type="email" 
                        className="w-full bg-[#0a0503] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-600/50 focus:bg-black transition-all"
                        placeholder="Email Address"
                        value={formData.email} 
                        onChange={e => setFormData({...formData, email: e.target.value})} 
                        required 
                      />
                    </div>
                  </div>

                  {view !== 'forgot' && (
                    <div className="group">
                      <div className="relative">
                        <Key className="absolute left-4 top-4 text-stone-500 w-5 h-5 group-focus-within:text-amber-500 transition-colors" />
                        <input 
                          type={showPassword ? "text" : "password"} 
                          className="w-full bg-[#0a0503] border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-600/50 focus:bg-black transition-all"
                          placeholder="Password"
                          value={formData.password} 
                          onChange={e => setFormData({...formData, password: e.target.value})} 
                          required 
                        />
                        {/* TOGGLE VISIBILITY BUTTON */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-4 text-stone-500 hover:text-stone-300 focus:text-amber-500 transition-colors"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Helpers: Forgot Password */}
                  {view === 'login' && (
                    <div className="flex justify-end">
                      <button 
                        type="button"
                        onClick={() => setView('forgot')}
                        className="text-[11px] text-stone-500 hover:text-amber-500 transition-colors font-medium"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  )}

                  {/* Messages */}
                  <AnimatePresence>
                    {authError && view !== 'forgot' && (
                      <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-xs flex items-center gap-2">
                        <AlertCircle size={14} className="flex-shrink-0" /> {authError}
                      </motion.div>
                    )}
                    {resetStatus && view === 'forgot' && (
                      <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${resetStatus.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200' : 'bg-red-500/10 border-red-500/20 text-red-200'}`}>
                        {resetStatus.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />} 
                        {resetStatus.msg}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Main Action Button */}
                  <button 
                    disabled={loading || (view === 'forgot' && resetStatus?.type === 'loading')} 
                    className="w-full bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-amber-900/30 flex items-center justify-center gap-2 mt-4 uppercase tracking-[0.15em] text-xs border border-white/5 hover:scale-[1.02]"
                  >
                    {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
                       <>
                         {view === 'register' ? 'Begin Journey' : view === 'forgot' ? 'Send Reset Link' : 'Enter Sanctuary'}
                         <ArrowRight size={16} className="opacity-70" />
                       </>
                    )}
                  </button>
                </form>

                {/* Back Link for Forgot Password */}
                {view === 'forgot' && (
                  <button onClick={() => { setView('login'); setResetStatus(null); }} className="mt-6 w-full text-stone-500 hover:text-white text-xs transition-colors flex items-center justify-center gap-2">
                    Back to Sign In
                  </button>
                )}
              </div>
            </div>
            
            <p className="text-center text-[10px] text-stone-600 mt-6 font-mono">
              © {new Date().getFullYear()} Taodocos Begena. Sacred Tradition.
            </p>

          </motion.div>
        </div>
      </div>
    </div>
  );
}