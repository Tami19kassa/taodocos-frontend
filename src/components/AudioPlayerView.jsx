import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Music, ChevronLeft, Loader2 } from 'lucide-react';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export default function AudioPlayerView({ folder, onExit }) {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState(null);
  const audioRefs = useRef({});

  // 1. Fetch Tracks for this Folder on Load
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const res = await fetch(`${STRAPI_URL}/api/audio-tracks?filters[audio_folder][id][$eq]=${folder.id}&populate=*`);
        const json = await res.json();
        setTracks(json.data || []);
      } catch (err) {
        console.error("Error fetching tracks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTracks();
  }, [folder]);

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

  return (
    <div className="pt-24 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto min-h-screen bg-[#120a05]">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <button 
          onClick={onExit} 
          className="flex items-center gap-2 text-stone-400 hover:text-amber-500 transition-colors group"
        >
           <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-amber-500/50 transition-all">
             <ChevronLeft size={16} />
           </div>
           <span className="text-sm font-medium tracking-wide font-cinzel">Back to Sanctuary</span>
        </button>

        <div className="text-right">
           <span className="text-amber-600 font-bold tracking-widest uppercase text-xs mb-1 block">Collection</span>
           <h1 className="font-cinzel text-3xl md:text-5xl text-white">{folder.title}</h1>
        </div>
      </div>

      {/* TRACK LIST */}
      {loading ? (
        <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-amber-600" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tracks.map((track) => {
            // URL Logic
            const audioData = track.audio_file || track.audio_file?.data?.attributes;
            const rawAudio = audioData?.url;
            const coverData = track.cover_art || track.cover;
            const rawCover = coverData?.url;

            const audioUrl = rawAudio ? (rawAudio.startsWith('http') ? rawAudio : `${STRAPI_URL}${rawAudio}`) : null;
            const trackCover = rawCover ? (rawCover.startsWith('http') ? rawCover : `${STRAPI_URL}${rawCover}`) : null;

            if (!audioUrl) return null;

            const isPlaying = playingId === track.id;

            return (
              <div 
                key={track.id} 
                className={`p-4 rounded-xl flex items-center gap-6 transition-all duration-300 border ${
                  isPlaying 
                    ? 'bg-[#1a0f0a] border-amber-500/40 shadow-lg shadow-amber-900/10 scale-[1.01]' 
                    : 'bg-[#1e100a]/40 border-white/5 hover:bg-[#1e100a] hover:border-white/10'
                }`}
              >
                
                {/* Track Cover / Visualizer */}
                <div className="w-16 h-16 rounded-lg bg-black/50 overflow-hidden shrink-0 relative border border-white/5">
                  {trackCover ? (
                    <img src={trackCover} className={`w-full h-full object-cover transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-60'}`} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-600">
                      <Music size={24} />
                    </div>
                  )}
                  {isPlaying && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-1">
                       <div className="w-1 bg-amber-500 animate-[bounce_1s_infinite] h-3" />
                       <div className="w-1 bg-amber-500 animate-[bounce_1.2s_infinite] h-5" />
                       <div className="w-1 bg-amber-500 animate-[bounce_0.8s_infinite] h-3" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className={`font-cinzel text-lg truncate ${isPlaying ? 'text-amber-500' : 'text-stone-300'}`}>
                    {track.title}
                  </h4>
                  <p className="text-xs text-stone-500 uppercase tracking-widest">
                    {isPlaying ? "Now Playing" : "Audio Track"}
                  </p>
                </div>

                {/* Play Button */}
                <button 
                  onClick={() => togglePlay(track.id)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${
                    isPlaying 
                      ? 'bg-amber-600 text-black scale-110' 
                      : 'bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-white'
                  }`}
                >
                  {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                </button>

                <audio ref={el => audioRefs.current[track.id] = el} src={audioUrl} onEnded={() => setPlayingId(null)} />
              </div>
            );
          })}
          
          {tracks.length === 0 && (
            <p className="text-stone-500 italic col-span-2 text-center py-10">No tracks found in this folder.</p>
          )}
        </div>
      )}
    </div>
  );
}