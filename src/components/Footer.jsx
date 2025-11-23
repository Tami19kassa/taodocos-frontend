import { Music, Mail, Phone, Send, Globe } from 'lucide-react';

export default function Footer({ settings }) {
  // Default fallbacks if Strapi data is missing
  const email = settings?.contact_email || "support@taodocos.com";
  const phone = settings?.contact_phone || "+251 911 000 000";
  const telegram = settings?.telegram_link || "#";
  const about = settings?.about_short || "Preserving the sacred heritage of the Begena through modern digital learning.";
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#05060a] border-t border-white/5 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24 mb-16">
        
        {/* Column 1: Brand */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-900/20">
              <Music className="text-white w-5 h-5" />
            </div>
            <span className="font-cinzel font-bold text-xl text-white tracking-widest">TAODOCOS</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            {about}
          </p>
          <div className="flex gap-4">
            {/* Social Placeholders */}
            <a href={telegram} target="_blank" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:bg-cyan-500/20 hover:text-cyan-400 transition-colors">
              <Send size={18} />
            </a>
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:bg-purple-500/20 hover:text-purple-400 transition-colors cursor-pointer">
              <Globe size={18} />
            </div>
          </div>
        </div>

        {/* Column 2: Navigation */}
        <div>
          <h4 className="text-white font-bold mb-6">Explore</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li>
              <button onClick={() => document.getElementById('levels').scrollIntoView({ behavior: 'smooth' })} className="hover:text-cyan-400 transition-colors">
                Course Levels
              </button>
            </li>
            <li>
              <button onClick={() => document.getElementById('library').scrollIntoView({ behavior: 'smooth' })} className="hover:text-cyan-400 transition-colors">
                Sacred Library
              </button>
            </li>
            <li>
              <span className="opacity-50 cursor-not-allowed">Live Workshops (Coming Soon)</span>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact */}
        <div>
          <h4 className="text-white font-bold mb-6">Contact Us</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-purple-500 mt-0.5" />
              <span>{email}</span>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-purple-500 mt-0.5" />
              <span>{phone}</span>
            </li>
            <li className="flex items-start gap-3">
              <Send className="w-5 h-5 text-purple-500 mt-0.5" />
              <a href={telegram} target="_blank" className="hover:text-white underline decoration-slate-700 underline-offset-4">
                Contact Admin via Telegram
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
        <p>© {year} Taodocos School. All rights reserved.</p>
        <div className="flex gap-6">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}