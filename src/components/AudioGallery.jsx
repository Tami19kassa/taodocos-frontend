import { Music, Folder, Lock, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export default function AudioGallery({ audios: folders, onFolderClick, userOwnedLevels }) {
  if (!folders || folders.length === 0) return null;

  // LOGIC: User must own at least 1 level to be considered a "Student"
  const isStudent = userOwnedLevels && userOwnedLevels.length > 0;

  const handleClick = (folder) => {
    if (isStudent) {
      onFolderClick(folder);
    } else {
      alert("🔒 Restricted Access: Only active students can listen to the Hymns. Please wait for Admin approval or unlock a level.");
    }
  };

  return (
    <section id="audio-gallery" className="py-24 px-4 relative z-10 bg-[#120a05] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="h-1 w-12 bg-amber-600"></div>
            <h2 className="font-cinzel text-3xl md:text-4xl text-white">Spiritual Hymns</h2>
          </div>
          {!isStudent && (
             <span className="text-xs font-bold uppercase tracking-widest text-stone-500 border border-stone-700 px-3 py-1 rounded-full">
               Members Only
             </span>
          )}
        </div>

        {/* FOLDER GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {folders.map((folder) => {
            const rawUrl = folder.cover?.url;
            const coverUrl = rawUrl ? (rawUrl.startsWith('http') ? rawUrl : `${STRAPI_URL}${rawUrl}`) : null;
            const trackCount = folder.audio_tracks?.length || 0;

            return (
              <motion.div 
                key={folder.id}
                whileHover={{ y: isStudent ? -5 : 0 }}
                onClick={() => handleClick(folder)} 
                className={`group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 border ${
                  isStudent 
                    ? 'bg-[#1e100a]/60 border-white/5 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-900/20' 
                    : 'bg-[#0c0a09] border-white/5 opacity-70 grayscale'
                }`}
              >
                {/* Folder Image */}
                <div className="h-48 w-full relative bg-[#0c0a09] overflow-hidden">
                  {coverUrl ? (
                    <img src={coverUrl} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-amber-700/50">
                      <Folder size={64} />
                    </div>
                  )}
                  
                  {/* OVERLAYS */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e100a] to-transparent opacity-80" />
                  
                  {isStudent ? (
                    // Play Icon (Active)
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center shadow-lg">
                        <Play fill="white" size={20} className="text-white ml-1" />
                      </div>
                    </div>
                  ) : (
                    // Lock Icon (Restricted)
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <div className="w-12 h-12 bg-stone-800/80 rounded-full flex items-center justify-center border border-white/10">
                        <Lock className="text-stone-400" size={20} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 relative">
                  <h3 className={`font-cinzel text-xl mb-2 transition-colors ${isStudent ? 'text-white group-hover:text-amber-500' : 'text-stone-500'}`}>
                    {folder.title}
                  </h3>
                  <div className="flex items-center gap-2 text-stone-500 text-sm">
                    <Music size={14} />
                    <span>{trackCount} Tracks</span>
                    {isStudent ? (
                      <span className="text-amber-700 ml-auto text-xs uppercase font-bold tracking-widest group-hover:text-amber-500">Open</span>
                    ) : (
                      <span className="text-stone-600 ml-auto text-xs uppercase font-bold tracking-widest">Locked</span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}