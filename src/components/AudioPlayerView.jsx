import { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, ChevronDown, SkipBack, SkipForward, 
  Music, Heart, MoreHorizontal, Shuffle, Repeat, ListMusic 
} from 'lucide-react';
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
  const [showPlaylist, setShowPlaylist] = useState(false); // Toggle for mobile playlist view
  
  const audioRef = useRef(null);

  // --- LOGIC SECTION (Unchanged) ---
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

  // --- CIRCULAR PROGRESS MATH ---
  const radius = 120; // Size of the circle
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - ((progress || 0) / 100) * circumference;

  // Calculate knob position (simple trigonometry)
  const angle = ((progress || 0) / 100) * 360;
  const radians = (angle - 90) * (Math.PI / 180); // -90 to start at top
  const knobX = 140 + radius * Math.cos(radians); // 140 is half of SVG width (280)
  const knobY = 140 + radius * Math.sin(radians);

  return (
    <div className="fixed inset-0 z-[200] bg-[#1a100a] text-stone-200 flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* Background Gradient/Blur */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {activeCover && (
          <img 
            src={activeCover} 
            className="w-full h-full object-cover opacity-20 blur-[100px] scale-125"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a100a]/80 via-[#1a100a]/90 to-[#120805]" />
      </div>

      {/* --- MAIN PLAYER AREA (Styled like the Center Phone Image) --- */}
      <div className={`relative z-20 w-full ${showPlaylist ? 'hidden md:flex' : 'flex'} md:w-1/2 h-full flex-col justify-between p-6 py-10 md:p-12 items-center`}>
        
        {/* Header */}
        <div className="w-full flex justify-between items-center mb-4">
          <button onClick={onExit} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
            <ChevronDown size={20} className="text-stone-300" />
          </button>
          <span className="text-xs uppercase tracking-widest text-stone-500 font-medium">Playing Now</span>
          <button className="p-2">
            <MoreHorizontal size={20} className="text-stone-300" />
          </button>
        </div>

        {currentTrack ? (
          <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm">
            
            {/* Text Info (Top Center) */}
            <div className="text-center mb-2">
              <h2 className="text-2xl font-bold text-white mb-1 line-clamp-1 tracking-tight">{currentTrack.title}</h2>
              <p className="text-amber-500/80 text-sm font-medium tracking-wide">{folder.title}</p>
            </div>

            {/* Time Indicators (Centered above art) */}
            <div className="flex items-center gap-2 text-[10px] text-stone-400 font-mono mb-6 tracking-widest">
                <span>{currentTime}</span>
                <span className="text-stone-600">|</span>
                <span>{duration}</span>
            </div>

            {/* Circular Artwork & Progress */}
            <div className="relative w-[280px] h-[280px] flex items-center justify-center mb-10">
              
              {/* SVG Ring */}
              <svg className="absolute inset-0 w-full h-full rotate-0" viewBox="0 0 280 280">
                {/* Track */}
                <circle 
                  cx="140" cy="140" r={radius} 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  className="text-white/5"
                />
                {/* Progress */}
                <circle 
                  cx="140" cy="140" r={radius} 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="3" 
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="text-amber-500 transition-all duration-300 ease-linear transform -rotate-90 origin-center"
                />
                {/* Knob Dot */}
                <circle 
                  cx={knobX} cy={knobY} r="6" 
                  className="fill-amber-200 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] transition-all duration-300 ease-linear"
                />
              </svg>

              {/* Artwork Image (Masked Circle) */}
              <motion.div 
                key={currentTrack.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-[210px] h-[210px] rounded-full overflow-hidden shadow-2xl z-10 border-4 border-[#1a100a]"
              >
                {activeCover ? (
                  <img src={activeCover} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-stone-900 flex items-center justify-center">
                    <Music size={50} className="text-stone-700" />
                  </div>
                )}
              </motion.div>

              {/* Hidden Range Input for Scrubbing (Preserves Logic) */}
              <input 
                type="range" min="0" max="100" value={progress}
                onChange={(e) => { 
                  if(audioRef.current) { 
                    audioRef.current.currentTime = (e.target.value/100) * audioRef.current.duration; 
                    setProgress(e.target.value); 
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 rounded-full"
                title="Seek"
              />
            </div>

            {/* Controls */}
            <div className="w-full flex items-center justify-between px-2">
              <button className="text-stone-500 hover:text-stone-300 transition-colors">
                <Shuffle size={20} />
              </button>

              <div className="flex items-center gap-6">
                 <button onClick={handlePrev} className="text-stone-300 hover:text-white transition-colors">
                    <SkipBack size={26} />
                 </button>
                 
                 <button 
                  onClick={() => setIsPlaying(!isPlaying)} 
                  className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-white/10"
                >
                   {isPlaying ? <Pause size={28} fill="black" /> : <Play size={28} fill="black" className="ml-1" />}
                 </button>
                 
                 <button onClick={handleNext} className="text-stone-300 hover:text-white transition-colors">
                    <SkipForward size={26} />
                 </button>
              </div>

              <button className="text-stone-500 hover:text-amber-500 transition-colors">
                <Heart size={20} />
              </button>
            </div>

            {/* Bottom Utility Row */}
            <div className="w-full flex justify-between items-center mt-12 px-6">
                <button className="text-stone-600 hover:text-stone-400">
                    <Repeat size={18} />
                </button>
                <button 
                  onClick={() => setShowPlaylist(true)} 
                  className="flex flex-col items-center gap-1 text-amber-600 md:hidden"
                >
                    <ListMusic size={20} />
                    <span className="text-[10px] uppercase font-bold">Playlist</span>
                </button>
                {/* Desktop placeholder for symmetry */}
                <div className="hidden md:block w-5"></div> 
                <button className="text-stone-600 hover:text-stone-400">
                    <MoreHorizontal size={18} />
                </button>
            </div>

            <audio ref={audioRef} src={activeAudioUrl} onTimeUpdate={handleTimeUpdate} onEnded={handleNext} onLoadedMetadata={handleTimeUpdate} />
          </div>
        ) : (
          <p className="text-stone-500 animate-pulse">Loading tracks...</p>
        )}
      </div>

      {/* --- PLAYLIST SIDEBAR (Hidden on mobile unless toggled, Visible on Desktop) --- */}
      <div className={`
        absolute inset-0 z-30 bg-[#120805]/95 backdrop-blur-xl md:relative md:bg-transparent md:backdrop-blur-none 
        md:w-1/2 h-full flex flex-col border-l border-white/5 transition-transform duration-300
        ${showPlaylist ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}
      `}>
        
        <div className="p-6 md:p-12 h-full overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-serif text-white mb-1">{folder.title}</h2>
              <p className="text-stone-500 text-sm">{tracks.length} Tracks</p>
            </div>
            <button onClick={() => setShowPlaylist(false)} className="md:hidden p-2 bg-white/10 rounded-full">
              <ChevronDown size={20} />
            </button>
          </div>

          <div className="space-y-1">
            {tracks.slice(0, visibleCount).map((track, index) => {
              const isActive = currentTrack?.id === track.id;
              return (
                <div 
                  key={track.id}
                  onClick={() => { playTrack(track); setShowPlaylist(false); }}
                  className={`p-4 rounded-xl flex items-center gap-4 cursor-pointer group transition-all ${
                    isActive ? 'bg-amber-500/10' : 'hover:bg-white/5'
                  }`}
                >
                  <div className={`w-8 text-center text-sm font-medium ${isActive ? 'text-amber-500' : 'text-stone-600'}`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-sm font-medium ${isActive ? 'text-white' : 'text-stone-300 group-hover:text-white'}`}>
                      {track.title}
                    </h4>
                  </div>
                  {isActive && (
                    <div className="flex gap-1 h-3 items-end">
                       <div className="w-0.5 h-full bg-amber-500 animate-[bounce_1s_infinite]" />
                       <div className="w-0.5 h-2/3 bg-amber-500 animate-[bounce_1.1s_infinite]" />
                       <div className="w-0.5 h-1/2 bg-amber-500 animate-[bounce_1.2s_infinite]" />
                    </div>
                  )}
                </div>
              );
            })}
            
            {visibleCount < tracks.length && (
              <button onClick={() => setVisibleCount(prev => prev + 10)} className="mt-6 w-full py-4 text-xs text-stone-500 hover:text-stone-300 uppercase tracking-widest">
                Load More Tracks
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}