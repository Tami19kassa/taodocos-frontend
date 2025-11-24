import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Key, ArrowRight, Music } from 'lucide-react';

 
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL  ;

export default function AuthScreen({ onAuth, loading, authError, landing }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  const welcomeTitle = landing?.hero_title || "Sanctuary Entrance";
  const welcomeSubtitle = landing?.hero_subtitle || "Begin your journey into the sacred sounds.";
  
  // FIX: Check if URL is absolute (Cloudinary) or relative (Local)
  const rawUrl = landing?.hero_background?.url;
  const bgImage = rawUrl 
    ? (rawUrl.startsWith('http') ? rawUrl : `${STRAPI_URL}${rawUrl}`)
    : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = isRegistering 
      ? formData 
      : { identifier: formData.email, password: formData.password };
    onAuth(payload, isRegistering);
  };

  return (
    <div className="h-screen w-full flex items-center justify-center relative overflow-hidden font-sans bg-[#0B0C15]">
      
      {/* --- BACKGROUND IMAGE (Fixed Fit) --- */}
      <div className="absolute inset-0 z-0">
        {bgImage ? (
          <img 
            src={bgImage} 
            alt="Background" 
            className="w-full h-full object-cover object-center opacity-50" // Slightly lower opacity for the dark tech vibe
          />
        ) : (
          <div className="w-full h-full bg-[#0B0C15]" />
        )}
        
        {/* Cool Blue/Purple Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0C15] via-[#0B0C15]/80 to-cyan-900/20" />
      </div>

      {/* --- CONTENT --- */}
      <div className="relative z-10 w-full max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
        
        {/* Left Side: Welcome Text */}
        <div className="hidden lg:block pr-12">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8 }}
          >
            {/* Icon Glow */}
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/50 flex items-center justify-center mb-8 backdrop-blur-md shadow-[0_0_30px_rgba(6,182,212,0.3)]">
              <Music className="text-cyan-400 w-8 h-8" />
            </div>
            
            <h1 className="font-cinzel text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
              {welcomeTitle}
            </h1>
            
            <div className="border-l-4 border-cyan-500 pl-6">
              <p className="text-slate-300 text-xl leading-relaxed font-light">
                {welcomeSubtitle}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex justify-center lg:justify-end">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-[450px] bg-[#0B0C15]/60 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl relative"
          >
            <div className="text-center mb-8">
              <h2 className="font-cinzel text-3xl text-white">
                {isRegistering ? 'Create Account' : 'Sign In'}
              </h2>
              <p className="text-slate-400 text-sm mt-2">
                {isRegistering ? "Join the future today" : "Welcome back"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {isRegistering && (
                <div className="group">
                  <label className="text-xs text-cyan-400 font-bold uppercase tracking-wider ml-1">Username</label>
                  <div className="relative mt-1">
                    <User className="absolute left-4 top-3.5 text-slate-500 w-5 h-5" />
                    <input 
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all placeholder-slate-600"
                      placeholder="Username"
                      value={formData.username} 
                      onChange={e => setFormData({...formData, username: e.target.value})} 
                      required 
                    />
                  </div>
                </div>
              )}

              <div className="group">
                <label className="text-xs text-cyan-400 font-bold uppercase tracking-wider ml-1">Email</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-4 top-3.5 text-slate-500 w-5 h-5" />
                  <input 
                    type="email" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all placeholder-slate-600"
                    placeholder="name@email.com"
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    required 
                  />
                </div>
              </div>

              <div className="group">
                <label className="text-xs text-cyan-400 font-bold uppercase tracking-wider ml-1">Password</label>
                <div className="relative mt-1">
                  <Key className="absolute left-4 top-3.5 text-slate-500 w-5 h-5" />
                  <input 
                    type="password" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all placeholder-slate-600"
                    placeholder="••••••••"
                    value={formData.password} 
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                    required 
                  />
                </div>
              </div>

              {authError && (
                <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200 text-xs text-center">
                  {authError}
                </div>
              )}

              <button 
                disabled={loading} 
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 mt-6"
              >
                {loading ? 'Processing...' : (isRegistering ? 'Register' : 'Enter Sanctuary')}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="mt-8 text-center">
              <button 
                onClick={() => { setIsRegistering(!isRegistering); setFormData({username:'', email:'', password:''}); }} 
                className="text-slate-400 hover:text-white text-sm transition-colors underline decoration-cyan-500/30 underline-offset-4"
              >
                {isRegistering ? "Already have an account? Sign In" : "Don't have an account? Register"}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}