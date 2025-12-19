// --- FIX: Added AnimatePresence to imports ---
import { motion, AnimatePresence } from 'framer-motion';
import { Music, LogOut, Menu, X, User } from 'lucide-react';
import { useState } from 'react';

export default function Navbar({ user, onLogout, setView }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const scrollTo = (id) => {
    setIsMenuOpen(false); 
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'Levels', id: 'levels' },
    { name: 'Hymns', id: 'audio-gallery' },
    { name: 'Library', id: 'library' },
    { name: 'Gallery', id: 'student-showcase' }, 
    { name: 'Voices', id: 'testimonials' },
    { name: 'Master', id: 'teacher-bio' }, 
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#120a05]/95 backdrop-blur-xl border-b border-amber-900/30 h-16 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          
          {/* LEFT: LOGO */}
          <div className="flex items-center gap-3 cursor-pointer z-50" onClick={() => setView('home')}>
            <div className="w-8 h-8 bg-amber-700 rounded-full flex items-center justify-center shadow-lg border border-amber-500/30">
              <Music className="text-white w-4 h-4" />
            </div>
            <span className="font-cinzel font-bold text-lg text-white tracking-widest hidden sm:block">
              TAODOCOS
            </span>
          </div>
          
          {/* CENTER: DESKTOP LINKS */}
          <div className="hidden lg:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            <button onClick={() => setView('home')} className="text-xs font-medium text-stone-300 hover:text-white transition-colors uppercase tracking-wide">
              Sanctuary
            </button>
            {navLinks.map((link) => (
              <button 
                key={link.name}
                onClick={() => scrollTo(link.id)}
                className="text-xs font-medium text-stone-400 hover:text-amber-500 transition-colors uppercase tracking-wide"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* RIGHT: ACTIONS */}
          <div className="flex items-center gap-4 z-50">
             <div className="hidden md:flex flex-col items-end">
                <p className="text-xs text-white font-bold">{user?.username}</p>
                <p className="text-[10px] text-amber-600 uppercase font-bold">Student</p>
             </div>
             
             <button onClick={onLogout} className="hidden md:block text-stone-500 hover:text-red-400 p-1">
                <LogOut size={20} />
             </button>

             <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-white p-2">
               {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
             </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[90] bg-[#120a05] pt-24 px-6 lg:hidden flex flex-col items-center gap-6"
          >
            <button onClick={() => { setView('home'); setIsMenuOpen(false); }} className="text-xl font-cinzel text-white">Sanctuary</button>
            {navLinks.map(link => (
              <button key={link.name} onClick={() => scrollTo(link.id)} className="text-lg text-stone-400 hover:text-amber-500 font-medium">
                {link.name}
              </button>
            ))}
            
            <div className="w-full h-px bg-white/10 my-4" />
            <button onClick={onLogout} className="flex items-center gap-2 text-red-400 font-bold mt-4">
              <LogOut size={18} /> Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}