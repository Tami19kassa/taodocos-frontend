import { motion } from 'framer-motion';
import { Music, LogOut, User } from 'lucide-react';

export default function Navbar({ user, onLogout, setView }) {
  
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'Levels', id: 'levels' },
    { name: 'Hymns', id: 'audio-gallery' },
    { name: 'Library', id: 'library' },
    { name: 'Gallery', id: 'student-showcase' }, // New
    { name: 'Voices', id: 'testimonials' },
    { name: 'Master', id: 'teacher-bio' }, // New
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }} 
      animate={{ y: 0 }} 
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#120a05]/90 backdrop-blur-md border-b border-amber-900/30 shadow-2xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* LEFT: LOGO */}
        <div className="flex items-center gap-3 cursor-pointer group shrink-0" onClick={() => setView('home')}>
          <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center shadow-lg border border-amber-500/30">
            <Music className="text-white w-4 h-4" />
          </div>
          <span className="font-cinzel font-bold text-lg text-white tracking-widest group-hover:text-amber-500 transition-colors">
            TAODOCOS
          </span>
        </div>
        
        {/* CENTER: SCROLLABLE LINKS */}
        <div className="flex-1 overflow-x-auto no-scrollbar mx-4 md:mx-8">
          <div className="flex items-center gap-6 md:gap-8 min-w-max px-2">
            <button 
              onClick={() => setView('home')} 
              className="text-sm font-medium text-stone-300 hover:text-white relative group py-2"
            >
              Sanctuary
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 transition-all group-hover:w-full" />
            </button>
            
            {navLinks.map((link) => (
              <button 
                key={link.name}
                onClick={() => scrollTo(link.id)}
                className="text-sm font-medium text-stone-400 hover:text-amber-500 relative group py-2 transition-colors"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 transition-all group-hover:w-full" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: USER PROFILE */}
        <div className="flex items-center gap-4 shrink-0 border-l border-white/10 pl-4">
           <div className="hidden sm:flex flex-col items-end">
              <p className="text-xs text-white font-bold">{user?.username}</p>
              <p className="text-[10px] text-amber-600 uppercase tracking-wider font-bold">Student</p>
           </div>
           <button 
             onClick={onLogout} 
             className="text-stone-500 hover:text-red-400 transition-colors p-1"
             title="Log Out"
           >
              <LogOut size={18} />
           </button>
        </div>

      </div>
    </motion.nav>
  );
}