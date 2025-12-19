import { useState, useRef, useEffect } from 'react';
import { Play, Pause, ChevronLeft, SkipBack, SkipForward, Music, Repeat, Shuffle } from 'lucide-react';
import { motion } from 'framer-motion';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export default function AudioPlayerView({ folder, onExit }) {
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  
  const audioRef = useRef(null);

  // Fetch Tracks
  useEffect(() => {
    if (!folder) return;
    const fetchTracks = async () => {
      try {
        const res = await fetch(`${STRAPI_URL}/api/audio-tracks?filters[audio_folder][id][$eq]=${folder.id}&populate=*`);
        const json = await res.json();
        const allTracks = json.data || [];
        setTracks(allTracks);
        if (allTracks.length > 0) setCurrentTrack(allTracks[0]);
      } catch (err) { console.error(err); }
    };
    fetchTracks();
  }, [folder]);

  // Audio Logic
  useEffect(() => {
    if (isPlaying) audioRef.current?.play();
    else audioRef.current?.pause();
  }, [isPlaying, currentTrack]);

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration;
    setProgress((current / total) * 100);
    
    const format = (t) => {
      if (!t) return "0:00";
      const m = Math.floor(t / 60);
      const s = Math.floor(t % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    };
    setCurrentTime(format(current));
    if (total) setDuration(format(total));
  };

  const handleNext = () => {
    const idx = tracks.findIndex(t => t.id === currentTrack.id);
    if (idx < tracks.length - 1) setCurrentTrack(tracks[idx + 1]);
    else setCurrentTrack(tracks[0]); // Loop back to start
    setProgress(0);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    const idx = tracks.findIndex(t => t.id === currentTrack.id);
    if (idx > 0) setCurrentTrack(tracks[idx - 1]);
  };

  // Getters
  const getUrl = (path) => path ? (path.startsWith('http') ? path : `${STRAPI_URL}${path}`) : null;
  const activeCover = getUrl(currentTrack?.cover_art?.url || folder.cover?.url);
  const activeAudio = getUrl(currentTrack?.audio_file?.url);

  // CIRCLE CONFIG
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 z-[200] bg-[#1a0f0a] flex flex-col items-center justify-center overflow-hidden">
      
      {/* Background Blur */}
      <div className="absolute inset-0 z-0">
        {activeCover && <img src={activeCover} className="w-full h-full object-cover opacity-30 blur-[100px] scale-125" />}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Back Button */}
      <button onClick={onExit} className="absolute top-8 left-8 z-30 flex items-center gap-2 text-stone-400 hover:text-white transition-colors">
        <ChevronLeft /> Back
      </button>

      {/* --- THE CIRCULAR PLAYER --- */}
      <div className="relative z-20 flex flex-col items-center">
        
        {/* Album Art + Progress Circle */}
        <div className="relative w-[320px] h-[320px] flex items-center justify-center mb-12">
           
           {/* Rotating Art */}
           <motion.div 
             animate={{ rotate: isPlaying ? 360 : 0 }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear", playState: isPlaying ? "running" : "paused" }}
             className="w-56 h-56 rounded-full overflow-hidden shadow-2xl border-4 border-[#2a1a10] z-10"
           >
             {activeCover ? (
               <img src={activeCover} className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full bg-stone-900 flex items-center justify-center"><Music size={40} className="text-stone-600"/></div>
             )}
           </motion.div>

           {/* Progress Ring (SVG) */}
           <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 320 320">
             {/* Background Track */}
             <circle cx="160" cy="160" r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="2" fill="none" />
             {/* Active Progress */}
             <circle 
               cx="160" cy="160" r={radius} 
               stroke="#d97706" // Amber 600
               strokeWidth="4" 
               fill="none" 
               strokeDasharray={circumference}
               strokeDashoffset={strokeDashoffset}
               strokeLinecap="round"
               className="transition-all duration-300 ease-linear"
             />
             {/* Knob (Optional: Calculate position if needed) */}
           </svg>
           
           {/* Time Labels floating outside */}
           <div className="absolute -left-12 top-1/2 -translate-y-1/2 text-xs font-mono text-stone-400">{currentTime}</div>
           <div className="absolute -right-12 top-1/2 -translate-y-1/2 text-xs font-mono text-stone-400">{duration}</div>
        </div>

        {/* Info */}
        <div className="text-center mb-10">
          <h2 className="font-cinzel text-3xl text-white mb-2 max-w-md line-clamp-1">{currentTrack?.title || "Select Track"}</h2>
          <p className="text-stone-500 uppercase tracking-widest text-xs">{folder.title}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-12">
          <button className="text-stone-500 hover:text-white transition-colors"><Shuffle size={20} /></button>
          
          <button onClick={handlePrev} className="text-white hover:text-amber-500 transition-colors">
            <SkipBack size={32} />
          </button>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-black shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-110 transition-transform"
          >
            {isPlaying ? <Pause size={32} fill="black" /> : <Play size={32} fill="black" className="ml-2" />}
          </button>
          
          <button onClick={handleNext} className="text-white hover:text-amber-500 transition-colors">
            <SkipForward size={32} />
          </button>
          
          <button className="text-stone-500 hover:text-white transition-colors"><Repeat size={20} /></button>
        </div>

        {/* Playlist (Mini) */}
        <div className="mt-12 w-full max-w-sm h-32 overflow-y-auto custom-scrollbar border-t border-white/5 pt-4">
           {tracks.map((t, i) => (
             <div 
               key={t.id} 
               onClick={() => { setCurrentTrack(t); setIsPlaying(true); }}
               className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${currentTrack?.id === t.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
             >
               <span className={`text-sm ${currentTrack?.id === t.id ? 'text-amber-500' : 'text-stone-400'}`}>{i+1}. {t.title}</span>
               {currentTrack?.id === t.id && <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"/>}
             </div>
           ))}
        </div>

        <audio ref={audioRef} src={activeAudio} onTimeUpdate={handleTimeUpdate} onEnded={handleNext} onLoadedMetadata={handleTimeUpdate} />
      </div>
    </div>
  );
}