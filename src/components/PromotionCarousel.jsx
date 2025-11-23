import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';

const STRAPI_URL = 'http://localhost:1337';

export default function PromotionCarousel({ promotions }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!promotions || promotions.length === 0) return null;

  useEffect(() => {
    if (promotions.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promotions.length);
    }, 6000); 
    return () => clearInterval(timer);
  }, [promotions.length]);

  const currentPromo = promotions[currentIndex];
  const imageUrl = currentPromo.banner?.url 
    ? `${STRAPI_URL}${currentPromo.banner.url}` 
    : null;

  if (!imageUrl) return null;

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      {/* Label */}
      <div className="flex items-center gap-2 mb-6 ml-2">
        <Sparkles className="text-purple-500 w-4 h-4" />
        <span className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">Featured Highlights</span>
      </div>

      <div className="relative w-full h-[400px] rounded-3xl overflow-hidden group shadow-2xl shadow-purple-900/20">
        
        {/* Animated Border Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-purple-600/30 opacity-50 group-hover:opacity-100 transition-opacity z-0" />
        <div className="absolute inset-[1px] bg-[#0B0C15] rounded-3xl z-0" />

        <div className="relative w-full h-full rounded-3xl overflow-hidden z-10">
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentPromo.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              {/* Background Image */}
              <img 
                src={imageUrl} 
                alt={currentPromo.title} 
                className="w-full h-full object-cover" 
              />
              
              {/* Dark Overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C15] via-transparent to-transparent opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B0C15]/80 to-transparent opacity-80" />
            </motion.div>
          </AnimatePresence>

          {/* --- CONTENT BOX --- */}
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="max-w-2xl">
              <motion.h3 
                key={currentPromo.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-cinzel text-3xl md:text-5xl font-bold text-white mb-4 leading-tight"
              >
                {currentPromo.title}
              </motion.h3>
              
              {/* Optional: Description if you add it to Strapi later */}
              <p className="text-slate-300 text-sm md:text-base max-w-lg">
                Don't miss out on this exclusive update. Dive deeper into the heritage.
              </p>
            </div>

            {currentPromo.link && (
              <a 
                href={currentPromo.link} 
                target="_blank"
                className="group/btn flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 px-6 py-3 rounded-xl text-white font-bold transition-all"
              >
                View Details
                <ArrowUpRight className="w-5 h-5 text-cyan-400 group-hover/btn:rotate-45 transition-transform" />
              </a>
            )}
          </div>

          {/* Indicators */}
          {promotions.length > 1 && (
            <div className="absolute top-6 right-6 flex gap-2">
              {promotions.map((_, idx) => (
                <div 
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-8 bg-cyan-400' : 'w-2 bg-white/20'}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}