import { Play, Pause, Music, Folder, ChevronLeft } from 'lucide-react';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export default function AudioGallery({ audios: folders }) {
  const [selectedFolder, setSelectedFolder] = useState(null); // Stores the active folder
  const [playingId, setPlayingId] = useState(null);
  const audioRefs = useRef({});

  // Reset audio when switching folders
  const handleBack = () => {
    setPlayingId(null); // Stop music
    setSelectedFolder(null); // Go back to grid
  };

  const togglePlay = (id) => {
    const audio = audioRefs.current[id];
    if (!audio) return;

    if (playingId === id) {
      audio.pause();
      setPlayingId(null);
    } else {
      if (playingId && audioRefs.current[playingId]) {
        audioRefs.current[playingId].pause();
      }
      audio.play();
      setPlayingId(id);
    }
  };

  if (!folders || folders.length === 0) return null;

  return (
    <section id="audio-gallery" className="py-24 px-4 relative z-10 bg-[#120a05] border-t border-white/5 min-h-[600px]">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="h-1 w-12 bg-amber-600"></div>
            <h2 className="font-cinzel text-3xl md:text-4xl text-white">
              {selectedFolder ? selectedFolder.title : "Hymn Collections"}
            </h2>
          </div>
          
          {selectedFolder && (
            <button 
              onClick={handleBack}
              className="flex items-center gap-2 text-stone-400 hover:text-amber-500 transition-colors"
            >
              <ChevronLeft size={20} /> Back to Folders
            </button>
          )}
        </div>

        <AnimatePresence mode='wait'>
          {!selectedFolder ? (
            /* --- VIEW 1: FOLDER GRID --- */
            <motion.div 
              key="grid"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {folders.map((folder) => {
                const rawUrl = folder.cover?.url;
                const coverUrl = rawUrl ? (rawUrl.startsWith('http') ? rawUrl : `${STRAPI_URL}${rawUrl}`) : null;
                const trackCount = folder.audio_tracks?.length || 0;

                return (
                  <div 
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder)}
                    className="group cursor-pointer bg-[#1e100a]/60 border border-white/5 rounded-2xl overflow-hidden hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-900/20 transition-all duration-300"
                  >
                    {/* Folder Image */}
                    <div className="h-48 w-full relative bg-[#0c0a09] overflow-hidden">
                      {coverUrl ? (
                        <img src={coverUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-amber-700/50">
                          <Folder size={64} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-cinzel text-xl text-white mb-2 group-hover:text-amber-500 transition-colors">{folder.title}</h3>
                      <div className="flex items-center gap-2 text-stone-500 text-sm">
                        <Music size={14} />
                        <span>{trackCount} Tracks</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          ) : (
            /* --- VIEW 2: TRACK LIST (Inside Folder) --- */
            <motion.div 
              key="list"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {selectedFolder.audio_tracks?.map((track) => {
                // Robust URL Logic
                const audioData = track.audio_file || track.audio_file?.data?.attributes;
                const rawAudio = audioData?.url;
                const coverData = track.cover_art || track.cover; // Check various field names
                const rawCover = coverData?.url;

                const audioUrl = rawAudio ? (rawAudio.startsWith('http') ? rawAudio : `${STRAPI_URL}${rawAudio}`) : null;
                const trackCover = rawCover ? (rawCover.startsWith('http') ? rawCover : `${STRAPI_URL}${rawCover}`) : null;

                if (!audioUrl) return null;

                return (
                  <div key={track.id} className={`bg-[#1a0f0a] border ${playingId === track.id ? 'border-amber-500/50 bg-amber-900/10' : 'border-white/5'} p-4 rounded-xl flex items-center gap-4 hover:bg-[#25140d] transition-colors`}>
                    
                    {/* Track Cover */}
                    <div className="w-14 h-14 rounded-lg bg-black/50 overflow-hidden shrink-0 relative">
                      {trackCover ? (
                        <img src={trackCover} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-600">
                          <Music size={20} />
                        </div>
                      )}
                      {playingId === track.id && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="flex gap-1 h-3 items-end">
                            <div className="w-1 bg-amber-500 animate-[bounce_1s_infinite]" />
                            <div className="w-1 bg-amber-500 animate-[bounce_1.2s_infinite]" />
                            <div className="w-1 bg-amber-500 animate-[bounce_0.8s_infinite]" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className={`font-cinzel text-lg truncate ${playingId === track.id ? 'text-amber-500' : 'text-stone-200'}`}>
                        {track.title}
                      </h4>
                    </div>

                    <button 
                      onClick={() => togglePlay(track.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${playingId === track.id ? 'bg-amber-600 text-black' : 'bg-white/10 text-white hover:bg-amber-600 hover:text-black'}`}
                    >
                      {playingId === track.id ? <Pause size={16} fill="black" /> : <Play size={16} fill="white" className="ml-1" />}
                    </button>

                    <audio ref={el => audioRefs.current[track.id] = el} src={audioUrl} onEnded={() => setPlayingId(null)} />
                  </div>
                );
              })}
              
              {selectedFolder.audio_tracks?.length === 0 && (
                <p className="text-stone-500 italic col-span-2 text-center py-10">No tracks in this folder yet.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}