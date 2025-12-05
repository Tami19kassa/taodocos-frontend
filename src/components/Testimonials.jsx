import { Quote } from 'lucide-react';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export default function Testimonials({ testimonials }) {
  if (!testimonials || testimonials.length === 0) return null;

  // Duplicate list to create seamless loop
  const loopList = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden bg-[#120a05] border-t border-white/5">
      
      {/* Warm Glow Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-amber-900/5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 mb-12 text-center relative z-10">
        <h2 className="font-cinzel text-3xl md:text-5xl text-white mb-4">Voices of the Sanctuary</h2>
        <p className="text-amber-500/60 font-serif italic">Hear from our dedicated students</p>
      </div>

      {/* SCROLLING CONTAINER */}
      <div className="relative w-full overflow-hidden">
        {/* Fade Edges */}
        <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-[#120a05] to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-[#120a05] to-transparent z-20 pointer-events-none" />

        {/* The Moving Track */}
        <div className="flex gap-6 w-max animate-scroll">
          {loopList.map((item, idx) => {
             const rawUrl = item.avatar?.url;
             const avatarUrl = rawUrl 
               ? (rawUrl.startsWith('http') ? rawUrl : `${STRAPI_URL}${rawUrl}`)
               : null;

             return (
               <div 
                 key={`${item.id}-${idx}`}
                 className="w-[350px] md:w-[400px] bg-[#1a0f0a]/90 border border-white/5 p-8 rounded-2xl relative shrink-0 hover:border-amber-500/30 transition-colors shadow-xl"
               >
                 <Quote className="absolute top-6 right-6 text-white/5 w-10 h-10" />
                 
                 <p className="text-stone-300 leading-relaxed mb-6 relative z-10 italic font-serif text-sm line-clamp-4">
                   "{item.quote}"
                 </p>

                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-500/20 bg-stone-900 shrink-0">
                     {avatarUrl ? (
                       <img src={avatarUrl} alt={item.student_name} className="w-full h-full object-cover" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center text-xs font-bold text-amber-600">
                         {item.student_name ? item.student_name.charAt(0) : "?"}
                       </div>
                     )}
                   </div>
                   <div>
                     <h4 className="text-white font-bold font-cinzel text-sm">{item.student_name}</h4>
                   </div>
                 </div>
               </div>
             );
          })}
        </div>
      </div>
    </section>
  );
}