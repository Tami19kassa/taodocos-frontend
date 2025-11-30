import { motion } from 'framer-motion';
import { Music, LogOut } from 'lucide-react';

export default function Navbar({ user, onLogout, setView }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav 
      initial={{ y: -100 }} animate={{ y: 0 }} 
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto bg-black/60 backdrop-blur-xl border border-amber-500/20 rounded-2xl px-6 py-3 flex justify-between items-center shadow-2xl">
        
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('home')}>
          <div className="w-10 h-10 bg-amber-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Music className="text-white w-5 h-5" />
          </div>
          <div>
            <span className="font-cinzel font-bold text-lg text-white tracking-wider block">TAODOCOS</span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-400">
          {['Sanctuary', 'Levels', 'Hymns', 'Library', 'Voices'].map((item, idx) => (
            <button 
              key={idx}
              onClick={() => item === 'Sanctuary' ? setView('home') : scrollTo(item === 'Hymns' ? 'audio-gallery' : item === 'Voices' ? 'testimonials' : item.toLowerCase())} 
              className="hover:text-amber-500 transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all group-hover:w-full" />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
           <div className="hidden sm:flex flex-col items-end">
              <p className="text-xs text-white font-bold">{user?.username}</p>
              <p className="text-[10px] text-amber-500 uppercase tracking-wider">Student</p>
           </div>
           <button onClick={onLogout} className="bg-white/5 hover:bg-red-900/30 text-stone-400 hover:text-red-400 p-2 rounded-lg transition-all">
              <LogOut size={18} />
           </button>
        </div>

      </div>
    </motion.nav>
  );
}