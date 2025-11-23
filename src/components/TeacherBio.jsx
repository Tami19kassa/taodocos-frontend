import { motion } from 'framer-motion';
import { renderBlockText } from '@/utils/renderBlockText';
import { ArrowRight } from 'lucide-react';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL  ;

export default function TeacherBio({ teacher }) {
  if (!teacher) return null;

  const imageUrl = teacher.photo?.url 
    ? `${STRAPI_URL}${teacher.photo.url}` 
    : null;

  return (
    <section className="py-24 px-4 bg-[#0B0C15] overflow-hidden relative">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-b from-[#0f101a] to-[#0B0C15] -z-10 opacity-50" />

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
              <div className="h-1 w-12 bg-cyan-500" />
              <span className="text-cyan-400 font-bold tracking-widest uppercase text-sm">
                The Instructor
              </span>
            </div>

            <h2 className="font-cinzel text-5xl md:text-6xl text-white mb-2 leading-tight">
              Meet the Master <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                {teacher.name}
              </span>
            </h2>

            <div className="mt-8 text-slate-400 leading-loose text-lg font-light border-l-2 border-cyan-500/20 pl-6">
              <div className="prose prose-invert max-w-none">
                {renderBlockText(teacher.bio)}
              </div>
            </div>

            <button className="mt-10 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl flex items-center gap-3 transition-all hover:gap-5 shadow-lg shadow-cyan-500/20">
              Start Learning <ArrowRight size={20} />
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
            {/* 1. The Big Solid Circle (Behind) - Purple/Blue Gradient */}
            <div className="absolute -top-10 -right-10 w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-purple-600 to-blue-900 rounded-full blur-xl opacity-60 z-0" />
            
            {/* 2. The White/Glass Circle (Behind Bottom) */}
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full z-0" />

            {/* 3. The Image Container */}
            <div className="relative z-10 rounded-full border-4 border-[#0B0C15] shadow-2xl overflow-hidden w-72 h-72 md:w-96 md:h-96">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={teacher.name}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                />
              ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-600">No Image</div>
              )}
            </div>

            {/* 4. The Floating Ring (In Front) */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute bottom-10 -right-6 z-20 bg-[#0B0C15]/90 backdrop-blur-md p-4 rounded-2xl border border-cyan-500/30 shadow-xl flex items-center gap-3"
            >
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Experience</p>
                <p className="text-white font-bold font-cinzel">10+ Years</p>
              </div>
            </motion.div>

          </motion.div>
        </div>

      </div>
    </section>
  );
}