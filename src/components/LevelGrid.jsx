import { motion } from 'framer-motion';
import { Play, Lock, Star } from 'lucide-react';
import { renderBlockText } from '@/utils/renderBlockText';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export default function LevelGrid({ levels, isUnlocked, onLevelClick }) {
  return (
    <section id="levels" className="py-24 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-cinzel text-3xl md:text-5xl text-white mb-4">Choose Your Path</h2>
        <div className="h-1 w-24 bg-amber-700 mx-auto rounded-full mb-4"/>
        <p className="text-stone-400 font-serif italic">Select the level of mastery you wish to unlock.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {levels.map((level, index) => {
          const unlocked = isUnlocked(level);
          
          // Handle URL
          const rawUrl = level.cover?.url;
          const coverUrl = rawUrl 
            ? (rawUrl.startsWith('http') ? rawUrl : `${STRAPI_URL}${rawUrl}`)
            : null;

          // Highlight the middle card
          const isHighlight = index === 1; 

          return (
            <motion.div 
              key={level.id} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              onClick={() => onLevelClick(level)} 
              // HARDCODED BACKGROUND STYLES HERE TO FIX THE ISSUE
              className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 group flex flex-col h-full 
                bg-[#1e100a]/80 backdrop-blur-md border ${
                isHighlight 
                  ? 'border-amber-500/40 shadow-2xl shadow-amber-900/20 scale-100 md:scale-105 z-10' 
                  : 'border-white/5 hover:border-amber-500/30'
              }`}
            >
              {/* Golden Glow for Highlighted card */}
              {isHighlight && <div className="absolute -top-20 left-0 right-0 h-40 bg-amber-600/10 blur-[80px] pointer-events-none" />}

              {/* Header */}
              <div className="mb-6 relative z-10">
                <div className="flex justify-between items-start">
                   <h3 className="font-cinzel text-2xl text-white mb-2">{level.name}</h3>
                   {isHighlight && <Star className="text-amber-500 fill-amber-500" size={20} />}
                </div>
                
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-amber-500">{level.price}</span>
                  <span className="text-sm text-stone-500 font-bold">$</span>
                </div>
                
                {unlocked ? (
                   <span className="inline-block mt-3 text-[10px] font-bold px-3 py-1 rounded-full bg-green-900/30 text-green-400 border border-green-800 uppercase tracking-wider">
                     Unlocked
                   </span>
                ) : (
                   <span className={`inline-block mt-3 text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${isHighlight ? 'bg-amber-900/20 text-amber-200 border-amber-800' : 'bg-black/40 text-stone-500 border-white/10'}`}>
                     Locked
                   </span>
                )}
              </div>

              {/* Cover Image */}
              <div className="h-40 w-full rounded-lg overflow-hidden mb-6 border border-white/10 relative group-hover:opacity-90 transition-opacity bg-[#0c0a09]">
                 {coverUrl ? (
                   <img src={coverUrl} className="w-full h-full object-cover object-top" alt={level.name} />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-stone-700">
                     <Lock size={32} />
                   </div>
                 )}
                 {/* Overlay Gradient */}
                 <div className="absolute inset-0 bg-gradient-to-t from-[#1e100a] to-transparent opacity-60" />
              </div>

              {/* Description */}
              <div className="flex-1">
                <p className="text-xs text-amber-600 mb-4 font-bold uppercase tracking-widest">Curriculum</p>
                <div className="text-stone-300 text-sm space-y-3 mb-8 leading-relaxed font-light">
                   <div className="line-clamp-4">
                     {renderBlockText(level.description)}
                   </div>
                </div>
              </div>

              {/* Action Button */}
              <button className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all uppercase tracking-widest ${
                unlocked 
                  ? 'bg-stone-800 hover:bg-stone-700 text-white border border-stone-600' 
                  : 'bg-amber-700 hover:bg-amber-600 text-white shadow-lg shadow-amber-900/20'
              }`}>
                {unlocked ? (
                  <>Enter Sanctuary <Play size={14} /></>
                ) : (
                  <>Unlock Access <Lock size={14} /></>
                )}
              </button>

            </motion.div>
          );
        })}
      </div>
    </section>
  );
}