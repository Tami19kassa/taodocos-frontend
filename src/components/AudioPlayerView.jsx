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
    <div className="fixed inset-0 z-[200] bg-[#120a05] flex flex-col md:flex-row overflow-hidden h-[100dvh]">
      
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

      {/* --- PLAYER CONTROLS --- */}
      <div className="relative z-20 w-full md:w-1/2 h-[55%] md:h-full bg-black/20 backdrop-blur-xl flex flex-col justify-center items-center px-6 pt-28 pb-6 md:p-12 order-1 md:order-2 border-b md:border-b-0 md:border-l border-white/10">
        
        <button onClick={onExit} className="absolute top-24 left-4 md:hidden flex items-center gap-2 text-stone-400 bg-black/40 px-3 py-1.5 rounded-full text-xs z-30">
          <ChevronLeft size={14} /> Back
        </button>

        {currentTrack ? (
          <div className="w-full max-w-md flex flex-col items-center">
            
            {/* Album Art */}
            <motion.div 
              key={currentTrack.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square w-40 h-40 sm:w-56 sm:h-56 md:w-full md:max-w-xs rounded-xl overflow-hidden shadow-2xl border border-white/10 mb-6 bg-[#0c0a09]"
            >
              {activeCover ? (
                <img src={activeCover} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music size={40} className="text-stone-700" />
                </div>
              )}
            </motion.div>

            {/* Info */}
            <div className="text-center mb-6 w-full">
              <h2 className="text-lg md:text-3xl font-bold text-white mb-1 line-clamp-1 font-cinzel">{currentTrack.title}</h2>
              <p className="text-stone-400 text-xs md:text-sm">{folder.title}</p>
            </div>

            {/* Progress */}
            <div className="w-full mb-6 group">
              <input 
                type="range" min="0" max="100" value={progress}
                onChange={(e) => { if(audioRef.current) { audioRef.current.currentTime = (e.target.value/100) * audioRef.current.duration; setProgress(e.target.value); }}}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
              <div className="flex justify-between text-[10px] text-stone-500 mt-2 font-mono">
                <span>{currentTime}</span><span>{duration}</span>
              </div>
            </div>

            {/* Controls (Fixed Responsive Size) */}
            <div className="flex items-center gap-8 md:gap-10">
               <button onClick={handlePrev} className="text-stone-300 hover:text-amber-500">
                  <SkipBack size={28} />
               </button>
               
               <button onClick={() => setIsPlaying(!isPlaying)} className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-amber-600 text-black flex items-center justify-center shadow-lg shadow-amber-900/40">
                 {isPlaying ? <Pause size={24} fill="black" /> : <Play size={24} fill="black" className="ml-1" />}
               </button>
               
               <button onClick={handleNext} className="text-stone-300 hover:text-amber-500">
                  <SkipForward size={28} />
               </button>
            </div>

            <audio ref={audioRef} src={activeAudioUrl} onTimeUpdate={handleTimeUpdate} onEnded={handleNext} onLoadedMetadata={handleTimeUpdate} />
          </div>
        ) : (
          <p className="text-stone-500">Select a hymn...</p>
        )}
      </div>

      {/* --- PLAYLIST --- */}
      <div className="relative z-10 w-full md:w-1/2 h-[45%] md:h-full p-4 md:p-12 overflow-y-auto custom-scrollbar flex flex-col order-2 md:order-1 bg-[#120a05]/80">
        
        <button onClick={onExit} className="hidden md:flex items-center gap-2 text-stone-400 hover:text-amber-500 mb-8 w-fit transition-colors group">
          <ChevronLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Sanctuary
        </button>

        <h2 className="font-cinzel text-xl md:text-4xl text-white mb-2 hidden md:block">{folder.title}</h2>
        <p className="text-stone-500 text-xs md:text-sm mb-4 md:mb-8">{tracks.length} Hymns</p>

        <div className="space-y-2 pb-20 md:pb-0">
          {tracks.slice(0, visibleCount).map((track, index) => {
            const isActive = currentTrack?.id === track.id;
            return (
              <div 
                key={track.id}
                onClick={() => playTrack(track)}
                className={`p-3 md:p-4 rounded-xl flex items-center gap-4 cursor-pointer transition-all border ${
                  isActive 
                    ? 'bg-amber-900/20 border-amber-600/40' 
                    : 'bg-transparent border-transparent hover:bg-white/5'
                }`}
              >
                <div className={`font-mono text-xs w-4 md:w-6 ${isActive ? 'text-amber-500' : 'text-stone-600'}`}>{index + 1}</div>
                <div className="flex-1">
                  <h4 className={`font-medium text-sm md:text-base line-clamp-1 ${isActive ? 'text-amber-100' : 'text-stone-300'}`}>{track.title}</h4>
                </div>
                {isActive && (
                  <div className="flex gap-0.5 h-3 items-end">
                     <div className="w-0.5 bg-amber-500 animate-bounce" />
                     <div className="w-0.5 bg-amber-500 animate-bounce delay-75" />
                     <div className="w-0.5 bg-amber-500 animate-bounce delay-150" />
                  </div>
                )}
              </div>
            );
          })}
          
          {visibleCount < tracks.length && (
            <button onClick={() => setVisibleCount(prev => prev + 10)} className="mt-4 py-3 w-full text-xs text-stone-500 uppercase tracking-widest bg-white/5 rounded-lg">Load More</button>
          )}
        </div>
      </div>

    </div>
  );
}