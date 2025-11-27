import { Quote } from 'lucide-react';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export default function Testimonials({ testimonials }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-32 px-4 relative overflow-hidden bg-[#05060a]">
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="text-center mb-16">
          <h2 className="font-cinzel text-3xl md:text-5xl text-white mb-4">Voices of the Sanctuary</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto rounded-full"/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item) => {
            const rawUrl = item.avatar?.url;
            const avatarUrl = rawUrl 
              ? (rawUrl.startsWith('http') ? rawUrl : `${STRAPI_URL}${rawUrl}`)
              : null;

            return (
              <div 
                key={item.id} 
                className="bg-[#0B0C15]/60 backdrop-blur-md border border-white/5 p-8 rounded-3xl relative hover:border-cyan-500/30 transition-colors group flex flex-col justify-between"
              >
                {/* Big Quote Icon */}
                <Quote className="absolute top-8 right-8 text-white/5 w-12 h-12 group-hover:text-cyan-500/20 transition-colors" />

                {/* Text */}
                <p className="text-slate-300 leading-relaxed mb-8 relative z-10 italic">
                  "{item.quote}"
                </p>

                {/* User Info */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 bg-slate-800 shrink-0">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={item.student_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500">
                        {item.student_name ? item.student_name.charAt(0) : "?"}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-white font-bold font-cinzel text-lg">{item.student_name}</h4>
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