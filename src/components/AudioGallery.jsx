import { Music, Folder } from 'lucide-react';
import { motion } from 'framer-motion';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export default function AudioGallery({ audios: folders, onFolderClick }) {
  if (!folders || folders.length === 0) return null;

  return (
    <section id="audio-gallery" className="py-24 px-4 relative z-10 bg-[#120a05] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-12">
          <div className="h-1 w-12 bg-amber-600"></div>
          <h2 className="font-cinzel text-3xl md:text-4xl text-white">Spiritual Hymns</h2>
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
                whileHover={{ y: -5 }}
                onClick={() => onFolderClick(folder)} // Pass click to parent
                className="group cursor-pointer bg-[#1e100a]/60 border border-white/5 rounded-2xl overflow-hidden hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-900/20 transition-all duration-300"
              >
                {/* Folder Image */}
                <div className="h-48 w-full relative bg-[#0c0a09] overflow-hidden">
                  {coverUrl ? (
                    <img src={coverUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-amber-700/50">
                      <Folder size={64} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e100a] to-transparent opacity-80" />
                </div>

                {/* Content */}
                <div className="p-6 relative">
                  <h3 className="font-cinzel text-xl text-white mb-2 group-hover:text-amber-500 transition-colors">{folder.title}</h3>
                  <div className="flex items-center gap-2 text-stone-500 text-sm">
                    <Music size={14} />
                    <span>{trackCount} Tracks</span>
                    <span className="text-amber-700 ml-auto text-xs uppercase font-bold tracking-widest group-hover:text-amber-500">Open Collection</span>
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