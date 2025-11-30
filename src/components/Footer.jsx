import { Music, Mail, Phone, Send, Globe } from 'lucide-react';

export default function Footer({ settings }) {
  const email = settings?.contact_email || "support@taodocos.com";
  const phone = settings?.contact_phone || "+251 911 000 000";
  const telegram = settings?.telegram_link || "#";
  const about = settings?.about_short || "Preserving the sacred heritage of the Begena through modern digital learning.";
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#120a05] border-t border-white/5 pt-20 pb-10 px-6 relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24 mb-16">
        
        {/* Column 1: Brand */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-700 rounded-full flex items-center justify-center shadow-lg shadow-amber-900/20 border border-amber-600/30">
              <Music className="text-white w-5 h-5" />
            </div>
            <span className="font-cinzel font-bold text-xl text-white tracking-widest">TAODOCOS</span>
          </div>
          <p className="text-stone-400 text-sm leading-relaxed mb-6 font-serif italic">
            {about}
          </p>
          <div className="flex gap-4">
            <a href={telegram} target="_blank" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-stone-400 hover:bg-amber-900/30 hover:text-amber-500 transition-colors border border-white/5 hover:border-amber-500/30">
              <Send size={18} />
            </a>
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-stone-400 hover:bg-amber-900/30 hover:text-amber-500 transition-colors cursor-pointer border border-white/5 hover:border-amber-500/30">
              <Globe size={18} />
            </div>
          </div>
        </div>

        {/* Column 2: Navigation */}
        <div>
          <h4 className="text-white font-cinzel font-bold mb-6 text-lg">Explore</h4>
          <ul className="space-y-4 text-sm text-stone-400 font-medium">
            <li>
              <button onClick={() => document.getElementById('levels').scrollIntoView({ behavior: 'smooth' })} className="hover:text-amber-500 transition-colors hover:translate-x-1 inline-block duration-200">
                Course Levels
              </button>
            </li>
            <li>
              <button onClick={() => document.getElementById('audio-gallery').scrollIntoView({ behavior: 'smooth' })} className="hover:text-amber-500 transition-colors hover:translate-x-1 inline-block duration-200">
                Spiritual Hymns
              </button>
            </li>
            <li>
              <button onClick={() => document.getElementById('library').scrollIntoView({ behavior: 'smooth' })} className="hover:text-amber-500 transition-colors hover:translate-x-1 inline-block duration-200">
                Sacred Library
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact */}
        <div>
          <h4 className="text-white font-cinzel font-bold mb-6 text-lg">Contact Us</h4>
          <ul className="space-y-4 text-sm text-stone-400">
            <li className="flex items-start gap-3 group">
              <Mail className="w-5 h-5 text-amber-600 mt-0.5 group-hover:text-amber-500 transition-colors" />
              <span className="group-hover:text-stone-200 transition-colors">{email}</span>
            </li>
            <li className="flex items-start gap-3 group">
              <Phone className="w-5 h-5 text-amber-600 mt-0.5 group-hover:text-amber-500 transition-colors" />
              <span className="group-hover:text-stone-200 transition-colors">{phone}</span>
            </li>
            <li className="flex items-start gap-3 group">
              <Send className="w-5 h-5 text-amber-600 mt-0.5 group-hover:text-amber-500 transition-colors" />
              <a href={telegram} target="_blank" className="hover:text-amber-500 underline decoration-stone-700 underline-offset-4 hover:decoration-amber-500 transition-all">
                Contact Admin via Telegram
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-600 uppercase tracking-widest">
        <p>© {year} Taodocos School. All rights reserved.</p>
        <div className="flex gap-6">
          <span className="hover:text-stone-400 cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-stone-400 cursor-pointer transition-colors">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}