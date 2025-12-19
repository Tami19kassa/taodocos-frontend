import { motion } from 'framer-motion';
import { Home, Music, Book, Mic, User, LogOut, Video } from 'lucide-react';

export default function Navbar({ user, onLogout, setView }) {
  
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const navItems = [
    { name: 'Home', icon: Home, action: () => setView('home') },
    { name: 'Levels', icon: Book, action: () => scrollTo('levels') },
    { name: 'Hymns', icon: Music, action: () => scrollTo('audio-gallery') },
    { name: 'Gallery', icon: Video, action: () => scrollTo('student-showcase') },
    { name: 'Voices', icon: Mic, action: () => scrollTo('testimonials') },
  ];

  return (
    <>
      {/* DESKTOP: Top Floating Pill */}
      <motion.nav 
        initial={{ y: -100 }} animate={{ y: 0 }} 
        className="hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 z-50 items-center gap-2 p-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl"
      >
        <div className="flex items-center gap-1 px-2">
          {navItems.map((item) => (
            <button 
              key={item.name}
              onClick={item.action}
              className="relative px-5 py-2 rounded-full text-xs font-medium text-stone-400 hover:text-white transition-colors group uppercase tracking-wide"
            >
              <span className="relative z-10">{item.name}</span>
              <span className="absolute inset-0 bg-white/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-white/10 mx-2" />

        <div className="flex items-center gap-3 pr-4 pl-2">
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-white">{user?.username}</span>
          </div>
          <button onClick={onLogout} className="p-2 bg-white/5 rounded-full hover:bg-red-500/20 hover:text-red-400 transition-colors">
            <LogOut size={16} />
          </button>
        </div>
      </motion.nav>

      {/* MOBILE: Bottom Floating Dock */}
      <nav className="md:hidden fixed bottom-6 left-4 right-4 z-[90] bg-[#120a05]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl flex justify-between items-center px-4">
        {navItems.map((item) => (
          <button 
            key={item.name}
            onClick={item.action}
            className="flex flex-col items-center gap-1 text-stone-500 hover:text-amber-500 transition-colors p-2"
          >
            <item.icon size={20} />
            <span className="text-[10px] font-medium">{item.name}</span>
          </button>
        ))}
        <button onClick={onLogout} className="flex flex-col items-center gap-1 text-stone-500 hover:text-red-500 transition-colors p-2">
           <LogOut size={20} />
           <span className="text-[10px] font-medium">Exit</span>
        </button>
      </nav>
    </>
  );
}