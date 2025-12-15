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
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden">
      
      {/* BACKGROUND */}
      {bgImage ? (
        <div className="absolute inset-0 z-0">
          <img src={bgImage} alt="Hero Background" className="w-full h-full object-cover object-top opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-[#0c0a09]/60 to-transparent" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 to-[#120a05] z-0" />
      )}

      {/* CONTENT */}
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={fadeInUp} 
        className="z-10 relative max-w-4xl flex flex-col items-center"
      >
        
        <span className="inline-block py-1.5 px-4 rounded-full bg-amber-900/40 border border-amber-500/20 text-amber-500 text-[10px] md:text-xs font-bold tracking-widest mb-6 backdrop-blur-md uppercase">
          Premium Begena Learning
        </span>

        {/* Responsive Font Size: Smaller on mobile, Huge on desktop */}
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold text-white mb-6 leading-tight tracking-tight font-cinzel drop-shadow-xl">
          {title}
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-stone-300 mb-8 max-w-lg md:max-w-2xl mx-auto leading-relaxed font-light font-serif px-4">
          {subtitle}
        </p>

        <button 
          onClick={() => document.getElementById('levels').scrollIntoView({ behavior: 'smooth' })} 
          className="px-8 py-4 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-full hover:scale-105 transition-transform shadow-lg shadow-amber-900/30 uppercase tracking-widest text-xs md:text-sm"
        >
          Start Learning Now
        </button>
      </motion.div>
    </section>
  );
}