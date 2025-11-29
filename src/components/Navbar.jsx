import { motion } from 'framer-motion';
import { Music, LogOut } from 'lucide-react';

export default function Navbar({ user, onLogout, setView }) {
  
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav 
      initial={{ y: -100 }} 
      animate={{ y: 0 }} 
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3 flex justify-between items-center shadow-2xl">
        
        {/* LOGO */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('home')}>
          <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Music className="text-white w-5 h-5" />
          </div>
          <div>
            <span className="font-cinzel font-bold text-lg text-white tracking-wider block leading-none">TAODOCOS</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em]">School</span>
          </div>
        </div>
        
        {/* CENTER LINKS */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <button onClick={() => setView('home')} className="hover:text-white transition-colors relative group">
            Sanctuary
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-500 transition-all group-hover:w-full" />
          </button>
          <button onClick={() => scrollTo('levels')} className="hover:text-white transition-colors relative group">
            Levels
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-500 transition-all group-hover:w-full" />
          </button>
          
          {/* NEW HYMNS BUTTON */}
          <button onClick={() => scrollTo('audio-gallery')} className="hover:text-white transition-colors relative group">
            Hymns
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-500 transition-all group-hover:w-full" />
          </button>

          <button onClick={() => scrollTo('library')} className="hover:text-white transition-colors relative group">
            Library
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-500 transition-all group-hover:w-full" />
          </button>
          <button onClick={() => scrollTo('testimonials')} className="hover:text-white transition-colors relative group">
            Voices
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-500 transition-all group-hover:w-full" />
          </button>
        </div>

        {/* USER ACTIONS */}
        <div className="flex items-center gap-4">
           <div className="hidden sm:flex flex-col items-end">
              <p className="text-xs text-white font-bold">{user?.username}</p>
              <p className="text-[10px] text-cyan-500 uppercase tracking-wider">Student</p>
           </div>
           <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />
           <button 
             onClick={onLogout} 
             className="bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-slate-400 p-2 rounded-lg transition-all"
             title="Sign Out"
           >
              <LogOut size={18} />
           </button>
        </div>

      </div>
    </motion.nav>
  );
}