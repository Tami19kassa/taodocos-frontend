import { motion } from 'framer-motion';
import { Play, Lock, CheckCircle2 } from 'lucide-react';
import { renderBlockText } from '@/utils/renderBlockText';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL  ;

export default function LevelGrid({ levels, isUnlocked, onLevelClick }) {
  return (
    <section id="levels" className="py-24 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Choose Your Path</h2>
        <p className="text-slate-400">Select the level of mastery you wish to unlock.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {levels.map((level, index) => {
          const unlocked = isUnlocked(level);
          
          // FIX: Handle Cloudinary URLs
          const rawUrl = level.cover?.url;
          const coverUrl = rawUrl 
            ? (rawUrl.startsWith('http') ? rawUrl : `${STRAPI_URL}${rawUrl}`)
            : null;
          // Highlight the middle card (or the Advanced one) like the reference image
          const isHighlight = index === 1; 

          return (
            <motion.div 
              key={level.id} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              onClick={() => onLevelClick(level)} 
              className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 group flex flex-col h-full ${
                isHighlight ? 'glass-card-highlight' : 'glass-card hover:border-slate-600'
              }`}
            >
              {/* Glowing Orb effect for Highlighted card */}
              {isHighlight && <div className="absolute -top-20 left-0 right-0 h-40 bg-cyan-500/20 blur-[80px] pointer-events-none" />}

              {/* Header */}
              <div className="mb-6 relative z-10">
                <h3 className="text-2xl font-bold text-white mb-2">{level.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">{level.price}</span>
                  <span className="text-sm text-slate-400">$ / lifetime</span>
                </div>
                
                {unlocked ? (
                   <span className="inline-block mt-3 text-xs font-bold px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                     UNLOCKED
                   </span>
                ) : (
                   <span className={`inline-block mt-3 text-xs font-bold px-2 py-1 rounded border ${isHighlight ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                     LOCKED
                   </span>
                )}
              </div>

              {/* Cover Image (Small & Styled) */}
              <div className="h-32 w-full rounded-lg overflow-hidden mb-6 border border-white/5 relative group-hover:opacity-80 transition-opacity">
                 {coverUrl ? (
                   <img src={coverUrl} className="w-full h-full object-cover" />
                 ) : <div className="bg-slate-800 w-full h-full"/>}
              </div>

              {/* Description / Features */}
              <div className="flex-1">
                <p className="text-sm text-slate-400 mb-4 font-medium uppercase tracking-wider">What's included</p>
                <div className="text-slate-300 text-sm space-y-3 mb-8">
                   {/* We render the description, but style it like a list */}
                   <div className="line-clamp-4 opacity-80">
                     {renderBlockText(level.description)}
                   </div>
                </div>
              </div>

              {/* Action Button */}
              <button className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                unlocked 
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                  : isHighlight
                    ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_20px_rgba(8,145,178,0.4)]'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              }`}>
                {unlocked ? (
                  <>Enter Course <Play size={16} /></>
                ) : (
                  <>Get Access <Lock size={16} /></>
                )}
              </button>

            </motion.div>
          );
        })}
      </div>
    </section>
  );
}