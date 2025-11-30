import { motion } from 'framer-motion';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

export default function Hero({ landing }) {
  const title = landing?.hero_title || "The Ancient Harp";
  const subtitle = landing?.hero_subtitle || "Master the sacred sounds.";
  
  // FIX: Handle Cloudinary vs Local URLs
  const rawUrl = landing?.hero_background?.url;
  const bgImage = rawUrl 
    ? (rawUrl.startsWith('http') ? rawUrl : `${STRAPI_URL}${rawUrl}`)
    : null;

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden">
      
      {/* DYNAMIC BACKGROUND */}
      {bgImage ? (
        <div className="absolute inset-0 z-0">
          <img 
            src={bgImage} 
            alt="Hero Background" 
            className="w-full h-full object-cover object-top opacity-40" 
          />
          {/* Gradient Overlay (Warm/Dark) */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#120a05] via-[#120a05]/80 to-transparent" />
        </div>
      ) : (
        // Fallback Gradient
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 to-[#120a05] z-0" />
      )}

      {/* Glow Effects (Golden) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-amber-600/10 blur-[120px] rounded-full pointer-events-none opacity-50 z-0" />
      
      <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="z-10 relative max-w-4xl">
        
        <span className="inline-block py-1 px-3 rounded-full bg-amber-900/30 border border-amber-500/20 text-amber-500 text-xs font-bold tracking-widest mb-6 backdrop-blur-md uppercase">
          Premium Begena Learning
        </span>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight font-cinzel drop-shadow-xl">
          {title}
        </h1>
        
        <p className="text-lg text-stone-300 mb-10 max-w-xl mx-auto leading-relaxed font-light font-serif">
          {subtitle}
        </p>

        <button 
          onClick={() => document.getElementById('levels').scrollIntoView({ behavior: 'smooth' })} 
          className="px-8 py-4 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_-5px_rgba(217,119,6,0.3)] uppercase tracking-widest text-sm"
        >
          Start Learning Now
        </button>
      </motion.div>
    </section>
  );
}