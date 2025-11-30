import { Play, Pause, Music } from 'lucide-react';
import { useState, useRef } from 'react';

// Added Fallback to prevent crashes if env var is missing
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export default function AudioGallery({ audios }) {
  const [playingId, setPlayingId] = useState(null);
  const audioRefs = useRef({});

  if (!audios || audios.length === 0) return null;

  const togglePlay = (id) => {
    const audio = audioRefs.current[id];
    if (!audio) return;

    if (playingId === id) {
      audio.pause();
      setPlayingId(null);
    } else {
      // Pause others
      if (playingId && audioRefs.current[playingId]) {
        audioRefs.current[playingId].pause();
      }
      audio.play();
      setPlayingId(id);
    }
  };

  return (
    // Updated Background to Warm Brown
    <section id="audio-gallery" className="py-24 px-4 relative z-10 bg-[#120a05] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-1 w-12 bg-amber-600"></div>
          <h2 className="font-cinzel text-3xl md:text-4xl text-white">Spiritual Hymns</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audios.map((track) => {
            
            // --- ROBUST URL LOGIC (Handles V4/V5 + Cloudinary) ---
            const audioData = track.audio_file || track.audio_file?.data?.attributes;
            const rawAudioUrl = audioData?.url;
            
            const coverData = track.cover_art || track.cover || track.cover_art?.data?.attributes;
            const rawCoverUrl = coverData?.url;

            const audioUrl = rawAudioUrl 
              ? (rawAudioUrl.startsWith('http') ? rawAudioUrl : `${STRAPI_URL}${rawAudioUrl}`)
              : null;

            const coverUrl = rawCoverUrl 
              ? (rawCoverUrl.startsWith('http') ? rawCoverUrl : `${STRAPI_URL}${rawCoverUrl}`)
              : null;

            if (!audioUrl) return null;

            return (
              <div 
                key={track.id} 
                // Updated Card Style: Warm Glass
                className="bg-[#1e100a]/60 backdrop-blur-md border border-white/5 p-4 rounded-xl flex items-center gap-4 group hover:border-amber-500/40 transition-colors shadow-lg"
              >
                {/* Cover / Icon */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-black/50 shrink-0 relative border border-white/5">
                  {coverUrl ? (
                    <img src={coverUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-amber-700">
                      <Music size={24} />
                    </div>
                  )}
                  
                  {/* Playing Animation Overlay */}
                  {playingId === track.id && (
                    <div className="absolute inset-0 bg-amber-900/60 flex items-center justify-center">
                      <div className="flex gap-1">
                        <div className="w-1 h-3 bg-amber-400 animate-bounce" />
                        <div className="w-1 h-5 bg-amber-400 animate-bounce delay-75" />
                        <div className="w-1 h-3 bg-amber-400 animate-bounce delay-150" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-cinzel truncate">{track.title}</h4>
                  <p className="text-xs text-stone-500 uppercase tracking-widest group-hover:text-amber-500 transition-colors">Audio Track</p>
                </div>

                <button 
                  onClick={() => togglePlay(track.id)}
                  className="w-12 h-12 rounded-full bg-amber-700 hover:bg-amber-600 flex items-center justify-center text-white transition-transform hover:scale-110 shadow-lg"
                >
                  {playingId === track.id ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
                </button>

                {/* Hidden Audio Element */}
                <audio 
                  ref={el => audioRefs.current[track.id] = el}
                  src={audioUrl}
                  onEnded={() => setPlayingId(null)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}