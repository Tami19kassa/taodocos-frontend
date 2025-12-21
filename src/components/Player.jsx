import { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, ChevronLeft, ChevronDown, Loader2, FileText, 
  Maximize, Lock, MoreVertical, ThumbsUp, ThumbsDown, 
  Share2, Download, ListPlus, Bell, Cast, Settings, Subtitles, 
  SkipBack, SkipForward 
} from 'lucide-react';
import { renderBlockText } from '@/utils/renderBlockText';
import CommentSection from './CommentSection';

export default function Player({ currentLesson, selectedLevel, setCurrentLesson, onExit, isLevelUnlocked, jwt, user, onUnlockRequest }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const playerRef = useRef(null);

  // Safety Check
  if (!currentLesson) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#120a05]">
        <div className="flex flex-col items-center gap-4 animate-pulse">
            <Loader2 className="text-amber-600 animate-spin" size={40} />
            <span className="text-amber-500/80 font-cinzel tracking-widest text-sm">Loading Sanctuary...</span>
        </div>
    </div>
  );

  const isLessonPlayable = isLevelUnlocked || currentLesson.is_free_sample;

  const handleLessonChange = (lesson) => {
    setIsPlaying(false);
    setIsLoading(false);
    setCurrentLesson(lesson);
    localStorage.setItem('last_lesson', JSON.stringify(lesson));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlayClick = () => {
    if (isLessonPlayable) {
      setIsLoading(true);
      setIsPlaying(true);
    } else {
      onUnlockRequest();
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch(() => setIsFullScreen(true));
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const handlePrev = () => {
    const idx = selectedLevel.lessons.findIndex(l => l.id === currentLesson.id);
    if (idx > 0) handleLessonChange(selectedLevel.lessons[idx - 1]);
  };

  const handleNext = () => {
    const idx = selectedLevel.lessons.findIndex(l => l.id === currentLesson.id);
    if (idx < selectedLevel.lessons.length - 1) handleLessonChange(selectedLevel.lessons[idx + 1]);
  };

  return (
    <div className={`transition-colors duration-700 ${isFullScreen ? 'bg-black' : 'pt-20 md:pt-24 pb-12 px-0 md:px-8 max-w-[1600px] mx-auto min-h-screen bg-[#120a05]'} text-stone-200`}>
        
        {/* DESKTOP HEADER (Hidden on Mobile to match YT app style) */}
        {!isFullScreen && (
          <div className="hidden md:flex justify-between items-center mb-6 px-4">
            <button onClick={onExit} className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors">
               <ChevronLeft size={20} />
               <span className="font-cinzel text-sm">Back to Sanctuary</span>
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-0 lg:gap-8">
          
          {/* --- LEFT COLUMN: VIDEO & ACTIONS --- */}
          <div className={`${isFullScreen ? 'w-full h-screen fixed top-0 left-0 z-[100] bg-black flex items-center justify-center' : 'w-full lg:w-[68%]'}`}>
            
            {/* 1. VIDEO PLAYER CONTAINER */}
            <div ref={playerRef} className={`relative bg-black group w-full ${isFullScreen ? 'h-full' : 'aspect-video'}`}>
               
               {/* CUSTOM OVERLAY (Visible when not playing) */}
               {!isPlaying || !isLessonPlayable ? (
                 <div className="absolute inset-0 z-20 flex flex-col justify-between bg-black/40">
                   
                   {/* Top Bar Overlay */}
                   <div className="flex justify-between items-center p-4 bg-gradient-to-b from-black/80 to-transparent">
                     <button onClick={onExit} className="text-white hover:text-amber-500"><ChevronLeft size={24} /></button>
                     <div className="flex items-center gap-6 text-white">
                        <Cast size={20} className="hover:text-amber-500 cursor-pointer" />
                        <Subtitles size={20} className="hover:text-amber-500 cursor-pointer" />
                        <Settings size={20} className="hover:text-amber-500 cursor-pointer" />
                     </div>
                   </div>

                   {/* Center Controls */}
                   <div className="flex items-center justify-center gap-12">
                      <button onClick={handlePrev} className="text-white/70 hover:text-white transition-colors p-2"><SkipBack size={32} /></button>
                      
                      <button 
                        onClick={handlePlayClick}
                        className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-amber-600/80 hover:border-amber-500 transition-all scale-100 hover:scale-110"
                      >
                         {isLoading ? <Loader2 className="animate-spin" /> : isLessonPlayable ? <Play fill="white" className="ml-1" /> : <Lock />}
                      </button>

                      <button onClick={handleNext} className="text-white/70 hover:text-white transition-colors p-2"><SkipForward size={32} /></button>
                   </div>

                   {/* Bottom Bar Overlay */}
                   <div className="p-4 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end">
                      <div className="text-xs font-mono text-stone-300">
                         {!isLessonPlayable && <span className="text-amber-500 font-bold uppercase tracking-widest mr-2">Locked</span>}
                         Preview Mode
                      </div>
                      <button onClick={toggleFullScreen} className="text-white hover:text-amber-500"><Maximize size={20} /></button>
                   </div>

                   {/* Background Image */}
                   <img 
                     src={`https://img.youtube.com/vi/${currentLesson.youtube_id}/maxresdefault.jpg`} 
                     className="absolute inset-0 w-full h-full object-cover -z-10 opacity-60" 
                   />
                 </div>
               ) : (
                 <iframe 
                   className="w-full h-full" 
                   src={`https://www.youtube.com/embed/${currentLesson.youtube_id}?autoplay=1&modestbranding=1&rel=0&showinfo=0&controls=1&playsinline=1`} 
                   allow="autoplay; encrypted-media" 
                   onLoad={() => setIsLoading(false)} 
                 />
               )}
            </div>

            {/* 2. VIDEO INFO SECTION (Mobile/Desktop) */}
            {!isFullScreen && (
              <div className="px-4 md:px-0 py-4 md:py-6 bg-[#120a05]">
                
                {/* Title Row */}
                <div className="flex justify-between items-start mb-4 cursor-pointer" onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}>
                   <div className="flex-1">
                      <h1 className="text-lg md:text-xl font-medium text-stone-100 line-clamp-2 leading-snug font-sans">
                        {currentLesson.title}
                      </h1>
                      <div className="text-xs text-stone-500 mt-1 flex items-center gap-2">
                         <span>{isLessonPlayable ? "1.2K views" : "Locked Content"}</span>
                         <span>•</span>
                         <span>{selectedLevel.title}</span>
                         {currentLesson.is_free_sample && <span className="text-amber-500 font-bold ml-2">FREE PREVIEW</span>}
                      </div>
                   </div>
                   <div className={`p-2 text-stone-400 transition-transform ${isDescriptionOpen ? 'rotate-180' : ''}`}>
                      <ChevronDown size={20} />
                   </div>
                </div>

                {/* Action Buttons Row (Scrollable) */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-6 pb-2 border-b border-white/5">
                   <ActionButton icon={<ThumbsUp size={18} />} label="245" />
                   <ActionButton icon={<ThumbsDown size={18} />} label="Dislike" />
                   <ActionButton icon={<Share2 size={18} />} label="Share" />
                   <ActionButton icon={<Download size={18} />} label="Download" />
                   <ActionButton icon={<ListPlus size={18} />} label="Save" />
                   <ActionButton icon={<MoreVertical size={18} />} />
                </div>

                {/* Channel / Teacher Row */}
                <div className="flex items-center justify-between mb-6 p-3 bg-white/5 rounded-xl border border-white/5">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-stone-800 border border-amber-500/30 overflow-hidden">
                        {/* Placeholder Teacher Image */}
                        <div className="w-full h-full bg-amber-900 flex items-center justify-center text-amber-500 font-bold text-xs">TB</div>
                      </div>
                      <div>
                         <h3 className="text-sm font-bold text-stone-200">Taodocos Begena</h3>
                         <p className="text-[10px] text-stone-500">Official Channel</p>
                      </div>
                   </div>
                   <button className="bg-stone-100 text-black px-4 py-2 rounded-full text-xs font-bold hover:bg-amber-500 hover:text-white transition-colors">
                      Subscribe
                   </button>
                </div>

                {/* Description / Lyrics (Expandable) */}
                {isDescriptionOpen && currentLesson.lyrics && (
                   <div className="bg-[#1a0f0a] p-4 rounded-xl text-sm text-stone-300 font-serif leading-relaxed mb-6 border border-white/5 animate-fade-in">
                      <h4 className="text-amber-500 font-bold mb-2 uppercase text-xs tracking-widest flex items-center gap-2">
                        <FileText size={14} /> Notes & Lyrics
                      </h4>
                      {renderBlockText(currentLesson.lyrics)}
                   </div>
                )}

                {/* Comments Section */}
                <CommentSection lessonId={currentLesson.id} jwt={jwt} user={user} />
              </div>
            )}
          </div>
          
          {/* --- RIGHT COLUMN: PLAYLIST (Up Next) --- */}
          {!isFullScreen && (
            <div className="w-full lg:w-[32%] px-4 md:px-0 pb-10">
              <div className="flex justify-between items-center mb-4 mt-2 lg:mt-0">
                 <h3 className="font-bold text-stone-200 text-base">Up Next</h3>
                 <div className="flex gap-4 text-xs font-bold text-stone-500">
                    <span className="text-amber-500">All</span>
                    <span>Related</span>
                    <span>Recent</span>
                 </div>
              </div>

              {/* Horizontal Card List (YouTube Style) */}
              <div className="flex flex-col gap-3">
                {selectedLevel.lessons.map((lesson, idx) => {
                  const isPlayable = isLevelUnlocked || lesson.is_free_sample;
                  const isActive = currentLesson.id === lesson.id;
                  
                  return (
                    <div 
                      key={lesson.id} 
                      onClick={() => handleLessonChange(lesson)}
                      className={`flex gap-3 cursor-pointer group p-2 rounded-lg transition-colors ${isActive ? 'bg-amber-900/20' : 'hover:bg-white/5'}`}
                    >
                      {/* Thumbnail Left */}
                      <div className="relative w-40 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-black">
                        <img 
                          src={`https://img.youtube.com/vi/${lesson.youtube_id}/mqdefault.jpg`} 
                          className={`w-full h-full object-cover ${!isPlayable ? 'opacity-40 grayscale' : ''}`}
                        />
                        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 rounded font-mono">
                           {isPlayable ? "Lesson " + (idx+1) : <Lock size={8} />}
                        </div>
                        {isActive && (
                           <div className="absolute inset-0 bg-amber-600/20 border-2 border-amber-500 flex items-center justify-center">
                              <Play size={20} fill="currentColor" className="text-white" />
                           </div>
                        )}
                      </div>

                      {/* Text Right */}
                      <div className="flex flex-col flex-1 min-w-0 pt-1">
                        <h4 className={`text-sm font-medium line-clamp-2 leading-snug mb-1 ${isActive ? 'text-amber-500' : 'text-stone-200 group-hover:text-white'}`}>
                           {lesson.title}
                        </h4>
                        <p className="text-xs text-stone-500">Taodocos Begena</p>
                        <div className="flex items-center gap-1 mt-1">
                           {lesson.is_free_sample && <span className="bg-amber-500/20 text-amber-500 text-[9px] px-1 rounded font-bold">FREE</span>}
                           {!isPlayable && <span className="bg-stone-800 text-stone-500 text-[9px] px-1 rounded">LOCKED</span>}
                        </div>
                      </div>

                      {/* Kebab Menu */}
                      <div className="pt-1">
                         <button className="text-stone-500 hover:text-white p-1">
                            <MoreVertical size={16} />
                         </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
    </div>
  );
}

// Helper Component for Action Buttons
function ActionButton({ icon, label }) {
   return (
      <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-medium whitespace-nowrap transition-colors min-w-fit">
         {icon}
         {label && <span>{label}</span>}
      </button>
   );
}