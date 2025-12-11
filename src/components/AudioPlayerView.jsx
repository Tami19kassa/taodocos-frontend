import { useState, useRef, useEffect } from 'react';
import { Play, Pause, ChevronLeft, SkipBack, SkipForward, Music, Heart, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export default function AudioPlayerView({ folder, onExit }) {
  const [tracks, setTracks] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  
  const audioRef = useRef(null);

  // 1. Fetch Tracks
  useEffect(() => {
    if (!folder) return;
    const fetchTracks = async () => {
      try {
        const res = await fetch(`${STRAPI_URL}/api/audio-tracks?filters[audio_folder][id][$eq]=${folder.id}&populate=*`);
        const json = await res.json();
        const allTracks = json.data || [];
        setTracks(allTracks);
        if (allTracks.length > 0) setCurrentTrack(allTracks[0]);
      } catch (err) {
        console.error("Error fetching tracks:", err);
      }
    };
    fetchTracks();
  }, [folder]);

  // 2. Audio Control
  useEffect(() => {
    if (isPlaying) audioRef.current?.play();
    else audioRef.current?.pause();
  }, [isPlaying, currentTrack]);

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration;
    setProgress((current / total) * 100);
    
    const format = (time) => {
      if (!time) return "0:00";
      const min = Math.floor(time / 60);
      const sec = Math.floor(time % 60);
      return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    };
    setCurrentTime(format(current));
    if (total) setDuration(format(total));
  };

  const playTrack = (track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      setProgress(0);
    }
  };

  const handleNext = () => {
    const idx = tracks.findIndex(t => t.id === currentTrack.id);
    if (idx < tracks.length - 1) playTrack(tracks[idx + 1]);
  };

  const handlePrev = () => {
    const idx = tracks.findIndex(t => t.id === currentTrack.id);
    if (idx > 0) playTrack(tracks[idx - 1]);
  };

  const getCover = (track) => {
    const raw = track?.cover_art?.url || track?.cover?.url || folder.cover?.url;
    return raw ? (raw.startsWith('http') ? raw : `${STRAPI_URL}${raw}`) : null;
  };

  const getAudioUrl = (track) => {
    const raw = track?.audio_file?.url;
    return raw ? (raw.startsWith('http') ? raw : `${STRAPI_URL}${raw}`) : null;
  };

  const activeCover = getCover(currentTrack);
  const activeAudioUrl = getAudioUrl(currentTrack);

  return (
    // FIX: z-[200] ensures it covers the Navbar
    <div className="fixed inset-0 z-[200] bg-[#120a05] flex flex-col md:flex-row overflow-hidden">
      
      {/* Background Blur */}
      <div className="absolute inset-0 z-0">
        {activeCover && (
          <img 
            src={activeCover} 
            className="w-full h-full object-cover opacity-30 blur-[80px] scale-110 transition-all duration-1000"
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* LEFT: Playlist */}
      <div className="relative z-10 w-full md:w-1/2 h-1/2 md:h-full p-6 md:p-12 overflow-y-auto custom-scrollbar flex flex-col border-r border-white/5 bg-[#120a05]/50 backdrop-blur-md">
        <button onClick={onExit} className="flex items-center gap-2 text-stone-400 hover:text-amber-500 mb-8 w-fit transition-colors group">
          <ChevronLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Sanctuary
        </button>

        <h2 className="font-cinzel text-3xl md:text-4xl text-white mb-2">{folder.title}</h2>
        <p className="text-stone-500 text-sm mb-8">{tracks.length} Hymns in Collection</p>

        <div className="space-y-2">
          {tracks.slice(0, visibleCount).map((track, index) => {
            const isActive = currentTrack?.id === track.id;
            return (
              <div 
                key={track.id}
                onClick={() => playTrack(track)}
                className={`p-4 rounded-xl flex items-center gap-4 cursor-pointer transition-all border ${
                  isActive 
                    ? 'bg-amber-900/20 border-amber-600/40' 
                    : 'bg-transparent border-transparent hover:bg-white/5'
                }`}
              >
                <div className={`font-mono text-xs w-6 ${isActive ? 'text-amber-500' : 'text-stone-600'}`}>{index + 1}</div>
                <div className="flex-1">
                  <h4 className={`font-medium text-sm md:text-base ${isActive ? 'text-amber-100' : 'text-stone-300'}`}>{track.title}</h4>
                </div>
                {isActive && (
                  <div className="flex gap-1 h-3 items-end">
                     <div className="w-1 bg-amber-500 animate-[bounce_1s_infinite] h-full" />
                     <div className="w-1 bg-amber-500 animate-[bounce_1.2s_infinite] h-2/3" />
                     <div className="w-1 bg-amber-500 animate-[bounce_0.8s_infinite] h-full" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {visibleCount < tracks.length && (
          <button 
            onClick={() => setVisibleCount(prev => prev + 10)}
            className="mt-6 py-3 w-full rounded-xl border border-white/10 text-stone-400 hover:bg-white/5 hover:text-white transition-all text-sm uppercase tracking-widest"
          >
            Load More Hymns
          </button>
        )}
      </div>

      {/* RIGHT: Now Playing */}
      <div className="relative z-20 w-full md:w-1/2 h-1/2 md:h-full bg-black/20 backdrop-blur-xl flex flex-col justify-center items-center p-8 md:p-12">
        
        {currentTrack ? (
          <div className="w-full max-w-md flex flex-col h-full justify-center">
            
            {/* Album Art Container */}
            <motion.div 
              key={currentTrack.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="aspect-square w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 mb-8 relative group bg-[#0c0a09]"
            >
              {activeCover ? (
                <img src={activeCover} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music size={64} className="text-stone-700" />
                </div>
              )}
            </motion.div>

            {/* Title & Info */}
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-1 line-clamp-1 font-cinzel">{currentTrack.title}</h2>
                <p className="text-stone-400 text-sm">{folder.title}</p>
              </div>
              <Heart className="text-stone-500 hover:text-red-500 cursor-pointer transition-colors" />
            </div>

            {/* Progress Bar */}
            <div className="mb-8 group">
              <input 
                type="range" 
                min="0" max="100" 
                value={progress}
                onChange={(e) => {
                  if(audioRef.current) {
                    const newTime = (e.target.value / 100) * audioRef.current.duration;
                    audioRef.current.currentTime = newTime;
                    setProgress(e.target.value);
                  }
                }}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-600 hover:accent-amber-500"
              />
              <div className="flex justify-between text-xs text-stone-500 mt-2 font-mono">
                <span>{currentTime}</span>
                <span>{duration}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between px-4">
               <button className="text-stone-500 hover:text-white"><MoreHorizontal /></button>
               
               <div className="flex items-center gap-8">
                 <button onClick={handlePrev} className="text-stone-300 hover:text-amber-500 transition-colors"><SkipBack size={32} /></button>
                 
                 <button 
                   onClick={() => setIsPlaying(!isPlaying)}
                   className="w-16 h-16 rounded-full bg-amber-600 text-black flex items-center justify-center hover:scale-110 hover:bg-amber-500 transition-transform shadow-lg shadow-amber-900/40"
                 >
                   {isPlaying ? <Pause size={28} fill="black" /> : <Play size={28} fill="black" className="ml-1" />}
                 </button>
                 
                 <button onClick={handleNext} className="text-stone-300 hover:text-amber-500 transition-colors"><SkipForward size={32} /></button>
               </div>

               <button className="text-stone-500 hover:text-white"><Music size={20} /></button>
            </div>

            <audio 
              ref={audioRef} 
              src={activeAudioUrl} 
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleNext}
              onLoadedMetadata={handleTimeUpdate}
            />

          </div>
        ) : (
          <p className="text-stone-500 font-cinzel">Select a hymn to begin.</p>
        )}
      </div>
    </div>
  );
}