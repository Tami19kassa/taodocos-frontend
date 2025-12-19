import { motion } from 'framer-motion';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function Hero({ landing }) {
  const title = landing?.hero_title || "The Ancient Harp";
  const subtitle = landing?.hero_subtitle || "Master the sacred sounds.";
  
  const rawUrl = landing?.hero_background?.url;
  const bgImage = rawUrl 
    ? (rawUrl.startsWith('http') ? rawUrl : `${STRAPI_URL}${rawUrl}`)
    : null;

  return (
   <section className="relative h-[100dvh] w-full flex flex-col justify-center items-center text-center px-4 overflow-hidden">
      
      {/* BACKGROUND LAYER */}
      {bgImage ? (
        <div className="absolute inset-0 z-0">
          <img 
            src={bgImage} 
            alt="Hero Background" 
            className="w-full h-full object-cover object-center" 
          />
          {/* 
             FIX: 
             1. Global dark overlay (bg-black/60) ensures text pops anywhere.
             2. Gradient at the bottom helps the button and lower text stand out.
          */}
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 to-[#120a05] z-0" />
      )}

      {/* CONTENT LAYER */}
      {/* FIX: Removed the 'bg-black/40' box. Now text floats freely. */}
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={fadeInUp} 
        className="z-10 relative max-w-5xl flex flex-col items-center mt-12"
      >
        
        <span className="inline-block py-1.5 px-5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] md:text-xs font-bold tracking-[0.2em] mb-8 uppercase backdrop-blur-sm">
          Taodocos Begena Learning
        </span>

        {/* Title with heavy drop-shadow to separate from background */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold text-white mb-6 leading-tight tracking-tight font-cinzel drop-shadow-2xl">
          {title}
        </h1>
        
        <p className="text-base sm:text-lg md:text-2xl text-stone-200 mb-10 max-w-2xl mx-auto leading-relaxed font-light font-serif px-4 drop-shadow-lg">
          {subtitle}
        </p>

        <button 
          onClick={() => document.getElementById('levels').scrollIntoView({ behavior: 'smooth' })} 
          className="px-10 py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-full hover:scale-105 transition-all shadow-[0_0_40px_rgba(217,119,6,0.3)] hover:shadow-[0_0_60px_rgba(217,119,6,0.5)] uppercase tracking-widest text-xs md:text-sm"
        >
          Start Learning Now
        </button>
      </motion.div>
    </section>
  );
}