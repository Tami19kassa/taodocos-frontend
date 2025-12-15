import { Music, Mail, Phone, Send, Globe, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer({ settings }) {
  // Strapi Data with Fallbacks
  const email = settings?.contact_email || "support@taodocos.com";
  const phone = settings?.contact_phone || "+251 911 000 000";
  const telegram = settings?.telegram_link || "#";
  const about = settings?.about_short || "Preserving the sacred heritage of the Begena through modern digital learning. Join us in keeping the ancient sounds alive.";
  const year = new Date().getFullYear();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#080503] relative pt-20 pb-8 overflow-hidden">
      
      {/* --- DECORATIVE TOP BORDER --- */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-700/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-amber-600 rounded-b-full shadow-[0_0_15px_rgba(217,119,6,0.5)]" />

      {/* --- BACKGROUND GLOW --- */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-900/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* 1. BRAND & MISSION (Left - Spans 5 columns) */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-amber-800/30 border border-amber-600/50 rounded-full flex items-center justify-center">
                <Music className="text-amber-500 w-6 h-6" />
              </div>
              <div>
                <span className="font-cinzel font-bold text-2xl text-white tracking-widest block leading-none">TAODOCOS</span>
                <span className="text-[10px] text-amber-600 uppercase tracking-[0.3em] font-bold">Begena School</span>
              </div>
            </div>
            <p className="text-stone-400 text-sm leading-7 mb-8 font-serif border-l-2 border-white/5 pl-4 max-w-sm">
              {about}
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <button key={i} className="w-10 h-10 rounded-full bg-white/5 hover:bg-amber-600 hover:text-white text-stone-500 flex items-center justify-center transition-all duration-300">
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* 2. NAVIGATION (Center - Spans 3 columns) */}
          <div className="md:col-span-3">
            <h4 className="font-cinzel text-white text-lg mb-6 border-b border-white/10 pb-2 inline-block">Explore</h4>
            <ul className="space-y-4 text-sm text-stone-400">
              {['Levels', 'Hymns', 'Library', 'Voices'].map((item) => (
                <li key={item}>
                  <button 
                    onClick={() => scrollTo(item === 'Hymns' ? 'audio-gallery' : item === 'Voices' ? 'testimonials' : item.toLowerCase())}
                    className="hover:text-amber-500 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-amber-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"/>
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. CONTACT CARD (Right - Spans 4 columns) */}
          <div className="md:col-span-4">
             <div className="bg-[#120a05] border border-white/5 p-6 rounded-2xl">
                <h4 className="font-cinzel text-white text-lg mb-6">Contact Us</h4>
                <ul className="space-y-5 text-sm text-stone-300">
                  <li className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-amber-600"><Mail size={16}/></div>
                    <span>{email}</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-amber-600"><Phone size={16}/></div>
                    <span>{phone}</span>
                  </li>
                </ul>

                <a 
                  href={telegram} 
                  target="_blank" 
                  className="mt-8 flex items-center justify-center gap-2 w-full bg-amber-700 hover:bg-amber-600 text-white font-bold py-3 rounded-lg transition-colors text-xs uppercase tracking-widest"
                >
                  <Send size={16} /> Chat on Telegram
                </a>
             </div>
          </div>

        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-600">
          <p>© {year} Taodocos School. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-stone-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-stone-400 cursor-pointer">Terms of Service</span>
          </div>
        </div>

      </div>
    </footer>
  );
}