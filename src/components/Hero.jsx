import { motion } from 'framer-motion';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
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
      
      {/* BACKGROUND IMAGE */}
      {bgImage ? (
        <div className="absolute inset-0 z-0">
          <img 
            src={bgImage} 
            alt="Hero Background" 
            className="w-full h-full object-cover object-center" 
          />
          {/* UPDATED: Darker overlay for better text contrast */}
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-transparent to-black/40" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 to-[#120a05] z-0" />
      )}

      {/* CONTENT - Now inside a Glass Card for maximum readability */}
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={fadeInUp} 
        className="z-10 relative max-w-4xl flex flex-col items-center mt-16 md:mt-0 p-8 md:p-12 rounded-3xl bg-black/40 backdrop-blur-sm border border-white/10 shadow-2xl"
      >
        
        <span className="inline-block py-1.5 px-4 rounded-full bg-amber-900/60 border border-amber-500/30 text-amber-400 text-[10px] md:text-xs font-bold tracking-widest mb-6 uppercase shadow-lg">
          Taodocos Begena Learning
        </span>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight font-cinzel drop-shadow-2xl">
          {title}
        </h1>
        
        {/* UPDATED: Added drop-shadow to paragraph for clarity against white clothing */}
        <p className="text-base sm:text-lg md:text-xl text-stone-200 mb-8 max-w-lg md:max-w-2xl mx-auto leading-relaxed font-serif px-4 drop-shadow-lg font-medium">
          {subtitle}
        </p>

        <button 
          onClick={() => document.getElementById('levels').scrollIntoView({ behavior: 'smooth' })} 
          className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(217,119,6,0.4)] uppercase tracking-widest text-xs md:text-sm border border-amber-400/20"
        >
          Start Learning Now
        </button>
      </motion.div>
    </section>
  );
}