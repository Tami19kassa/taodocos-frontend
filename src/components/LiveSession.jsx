import { Video, Calendar, Clock, Lock } from 'lucide-react';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export default function LiveSession({ classes, userOwnedClasses, onJoin }) {
  
  if (!classes || classes.length === 0) return null;

  const isOwned = (classId) => {
    if (!userOwnedClasses) return false;
    return userOwnedClasses.some(c => c.id === classId || c.documentId === classId);
  };

  return (
    <section id="live-sessions" className="py-24 px-4 bg-[#0e0805] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex items-center gap-4 mb-12">
          <div className="h-1 w-12 bg-red-600"></div>
          <div>
             <span className="text-red-500 font-bold tracking-widest uppercase text-xs block mb-1">Live Workshops</span>
             <h2 className="font-cinzel text-3xl md:text-4xl text-white">Masterclass Sessions</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {classes.map((item) => {
            const owned = isOwned(item.id);
            const date = new Date(item.start_time);
            
            // Image Logic
            const rawUrl = item.cover?.url;
            const coverUrl = rawUrl 
              ? (rawUrl.startsWith('http') ? rawUrl : `${STRAPI_URL}${rawUrl}`) 
              : null;

            // --- URL FIX ---
            let meetUrl = item.meet_link || "#";
            if (meetUrl && !meetUrl.startsWith('http')) {
              meetUrl = `https://${meetUrl}`;
            }

            return (
              <div key={item.id} className="group relative bg-[#1a0f0a] border border-white/10 rounded-2xl overflow-hidden flex flex-col md:flex-row hover:border-red-500/30 transition-all shadow-xl">
                
                {/* Image Side */}
                <div className="w-full md:w-2/5 h-48 md:h-auto relative bg-black">
                   {coverUrl ? (
                     <img src={coverUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-stone-600"><Video size={40}/></div>
                   )}
                   <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                     Live Event
                   </div>
                </div>

                {/* Content Side */}
                <div className="flex-1 p-8 flex flex-col justify-center">
                   <h3 className="font-cinzel text-2xl text-white mb-2">{item.title}</h3>
                   <p className="text-stone-400 text-sm mb-6 line-clamp-2">{item.description}</p>
                   
                   <div className="flex items-center gap-6 text-sm text-stone-300 mb-8 font-mono bg-black/20 p-3 rounded-lg border border-white/5">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-amber-600"/>
                        {date.toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-amber-600"/>
                        {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                   </div>

                   {/* Logic Button */}
                   {owned ? (
                     <a 
                       href={meetUrl} 
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex items-center justify-center gap-2 w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-emerald-900/20"
                     >
                       <Video size={18} /> Enter Classroom
                     </a>
                   ) : (
                     <button 
                       onClick={() => onJoin(item)}
                       className="flex items-center justify-between w-full bg-white/5 hover:bg-amber-900/20 border border-white/10 hover:border-amber-500/50 text-white font-bold py-3 px-6 rounded-lg transition-all group"
                     >
                       <span className="flex items-center gap-2"><Lock size={16} className="text-amber-600"/> Book Seat</span>
                       <span className="text-amber-500 font-mono">{item.price} ETB</span>
                     </button>
                   )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}