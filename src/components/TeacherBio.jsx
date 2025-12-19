import { motion } from 'framer-motion';
import { renderBlockText } from '@/utils/renderBlockText';
import { ArrowRight } from 'lucide-react';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export default function TeacherBio({ teacher }) {
  if (!teacher) return null;

  const rawUrl = teacher.photo?.url;
  const imageUrl = rawUrl 
    ? (rawUrl.startsWith('http') ? rawUrl : `${STRAPI_URL}${rawUrl}`)
    : null;

  return (
    <section id="teacher-bio" className="py-24 px-4 relative overflow-hidden bg-[#120a05]">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-b from-[#1a0f0a] to-[#120a05] -z-10 opacity-50" />

      <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-16 md:gap-24">
        
        {/* --- LEFT SIDE: CONTENT --- */}
        <div className="w-full md:w-1/2 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-1 w-12 bg-amber-600" />
              <span className="text-amber-500 font-bold tracking-widest uppercase text-sm">
                The Instructor
              </span>
            </div>

            <h2 className="font-cinzel text-5xl md:text-6xl text-white mb-2 leading-tight">
              Meet the Master <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">
                {teacher.name}
              </span>
            </h2>

            <div className="mt-8 text-stone-400 leading-loose text-lg font-light border-l-2 border-amber-500/20 pl-6 font-serif">
              <div className="prose prose-invert max-w-none prose-p:text-stone-300">
                {renderBlockText(teacher.bio)}
              </div>
            </div>

            <button className="mt-10 px-8 py-4 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-sm flex items-center gap-3 transition-all hover:gap-5 shadow-lg shadow-amber-900/20 uppercase tracking-widest text-sm">
              Start Learning <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>

        {/* --- RIGHT SIDE: IMAGE & GEOMETRY --- */}
        <div className="w-full md:w-1/2 relative flex justify-center md:justify-end">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* 1. The Big Solid Circle (Behind) */}
            <div className="absolute -top-10 -right-10 w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-amber-600 to-orange-900 rounded-full blur-xl opacity-60 z-0" />
            
            {/* 2. The White/Glass Circle (Behind Bottom) */}
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#1e100a]/80 backdrop-blur-xl border border-white/5 rounded-full z-0" />

            {/* 3. The Image Container */}
            <div className="relative z-10 rounded-full border-4 border-[#120a05] shadow-2xl overflow-hidden w-72 h-72 md:w-96 md:h-96">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={teacher.name}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                />
              ) : (
                <div className="w-full h-full bg-stone-800 flex items-center justify-center text-stone-600">No Image</div>
              )}
            </div>

            {/* 4. The Floating Ring (In Front) */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute bottom-10 -right-6 z-20 bg-[#1a0f0a]/90 backdrop-blur-md p-4 rounded-2xl border border-amber-500/30 shadow-xl flex items-center gap-3"
            >
              <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
              <div>
                <p className="text-xs text-stone-400 uppercase tracking-wider">Experience</p>
                <p className="text-white font-bold font-cinzel">10+ Years</p>
              </div>
            </motion.div>

          </motion.div>
        </div>

      </div>
    </section>
  );
}