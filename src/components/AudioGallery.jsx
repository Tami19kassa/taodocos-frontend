import { Play, Pause, Music } from 'lucide-react';
import { useState, useRef } from 'react';

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
    <section className="py-24 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-1 w-12 bg-amber-600"></div>
          <h2 className="font-cinzel text-3xl md:text-4xl text-white">Spiritual Hymns</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audios.map((track) => {
            const audioUrl = track.audio_file?.url ? (track.audio_file.url.startsWith('http') ? track.audio_file.url : `${STRAPI_URL}${track.audio_file.url}`) : null;
            const coverUrl = track.cover_art?.url ? (track.cover_art.url.startsWith('http') ? track.cover_art.url : `${STRAPI_URL}${track.cover_art.url}`) : null;

            if (!audioUrl) return null;

            return (
              <div key={track.id} className="ancient-card p-4 rounded-xl flex items-center gap-4 group hover:border-amber-500/50 transition-colors">
                {/* Cover / Icon */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-black/50 shrink-0 relative">
                  {coverUrl ? (
                    <img src={coverUrl} className="w-full h-full object-cover opacity-80" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-amber-600">
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
                  <p className="text-xs text-stone-400 uppercase tracking-widest">Audio Track</p>
                </div>

                <button 
                  onClick={() => togglePlay(track.id)}
                  className="w-10 h-10 rounded-full bg-amber-600 hover:bg-amber-500 flex items-center justify-center text-black transition-transform hover:scale-110"
                >
                  {playingId === track.id ? <Pause size={18} fill="black" /> : <Play size={18} fill="black" />}
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