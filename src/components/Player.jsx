
import { useState, useRef, useEffect } from 'react';
import { 
  Play, ChevronLeft, ChevronDown, ChevronUp, Loader2, FileText, 
  Maximize, Lock, Cast, Settings, Subtitles, SkipBack, SkipForward, 
  ExternalLink, Youtube 
} from 'lucide-react';
import { renderBlockText } from '@/utils/renderBlockText';
import CommentSection from './CommentSection';

// Channel URL
const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@taodocostube6869"; 
export default function Player({ currentLesson, selectedLevel, setCurrentLesson, onExit, isLevelUnlocked, onUnlockRequest }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
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

  const handleSubscribe = () => {
    window.open(`${YOUTUBE_CHANNEL_URL}?sub_confirmation=1`, '_blank');
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
    // FIX: Changed 'pt-16' to 'pt-0 md:pt-24'. 
    // This removes the top gap on mobile while keeping space for the header on desktop.
    <div className={`transition-colors duration-700 ${isFullScreen ? 'bg-black' : 'pt-0 md:pt-24 pb-12 px-0 md:px-8 max-w-[1600px] mx-auto min-h-screen bg-[#120a05]'} text-stone-200`}>
        
        {/* --- HEADER (Desktop Only) --- */}
        {!isFullScreen && (
          <div className="hidden md:flex justify-between items-center mb-6 px-4">
            <button 
              onClick={onExit} 
              className="group relative flex items-center gap-4 pl-2 pr-6 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-amber-500/40 hover:bg-amber-950/30 transition-all duration-500 backdrop-blur-md overflow-hidden"
            >
               <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
               <div className="relative z-10 w-8 h-8 rounded-full bg-stone-800 border border-white/5 flex items-center justify-center group-hover:bg-amber-700 group-hover:border-amber-500 transition-all duration-300 shadow-lg">
                 <ChevronLeft size={16} className="text-stone-300 group-hover:text-white group-hover:-translate-x-0.5 transition-transform" />
               </div>
               <div className="relative z-10 flex flex-col items-start">
                  <span className="text-[9px] uppercase tracking-[0.25em] text-stone-500 group-hover:text-amber-400 font-bold transition-colors">Return</span>
                  <span className="font-cinzel text-xs text-stone-300 group-hover:text-white tracking-wide">To Sanctuary</span>
               </div>
            </button>
            <div className="text-right hidden lg:block opacity-60 hover:opacity-100 transition-opacity">
               <h2 className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-0.5">Current Chapter</h2>
               <span className="font-serif text-sm text-amber-500/80">{selectedLevel.title}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-0 lg:gap-8">
          
          {/* --- LEFT COLUMN --- */}
          <div className={`${isFullScreen ? 'w-full h-screen fixed top-0 left-0 z-[100] bg-black flex items-center justify-center' : 'w-full lg:w-[68%]'}`}>
            
            {/* VIDEO PLAYER */}
            <div ref={playerRef} className={`relative bg-black group w-full ${isFullScreen ? 'h-full' : 'aspect-video shadow-2xl rounded-none md:rounded-2xl overflow-hidden border-t md:border border-white/10'}`}>
               {!isPlaying || !isLessonPlayable ? (
                 <div className="absolute inset-0 z-20 flex flex-col justify-between bg-black/40 backdrop-blur-[2px]">
                   <div className="flex justify-between items-center p-4 bg-gradient-to-b from-black/80 to-transparent">
                     <button onClick={onExit} className="md:hidden text-white hover:text-amber-500"><ChevronLeft size={24} /></button>
                     <div className="hidden md:block"></div>
                     <div className="flex items-center gap-6 text-white opacity-80">
                        <Cast size={20} className="hover:text-amber-500 cursor-pointer" />
                        <Subtitles size={20} className="hover:text-amber-500 cursor-pointer" />
                        <Settings size={20} className="hover:text-amber-500 cursor-pointer" />
                     </div>
                   </div>
                   <div className="flex items-center justify-center gap-8 md:gap-16">
                      <button onClick={handlePrev} className="text-white/50 hover:text-white transition-colors p-2 hover:scale-110"><SkipBack size={32} /></button>
                      <button 
                        onClick={handlePlayClick}
                        className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-amber-600 hover:border-amber-500 hover:scale-110 transition-all duration-300 shadow-[0_0_40px_rgba(0,0,0,0.6)]"
                      >
                         {isLoading ? <Loader2 className="animate-spin" /> : isLessonPlayable ? <Play fill="white" className="ml-2" size={36} /> : <Lock size={32} />}
                      </button>
                      <button onClick={handleNext} className="text-white/50 hover:text-white transition-colors p-2 hover:scale-110"><SkipForward size={32} /></button>
                   </div>
                   <div className="p-4 bg-gradient-to-t from-black/90 to-transparent flex justify-between items-end">
                      <div className="text-xs font-mono text-stone-300">
                         {isLessonPlayable ? "Tap to Play" : "Preview Mode"}
                      </div>
                      <button onClick={toggleFullScreen} className="text-white hover:text-amber-500"><Maximize size={20} /></button>
                   </div>
                   <img src={`https://img.youtube.com/vi/${currentLesson.youtube_id}/maxresdefault.jpg`} className="absolute inset-0 w-full h-full object-cover -z-10 opacity-50 transition-opacity group-hover:opacity-60" />
                 </div>
               ) : (
                 <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${currentLesson.youtube_id}?autoplay=1&modestbranding=1&rel=0&showinfo=0&controls=1&playsinline=1`} allow="autoplay; encrypted-media" onLoad={() => setIsLoading(false)} />
               )}
            </div>

            {/* VIDEO INFO */}
            {!isFullScreen && (
              <div className="px-4 md:px-0 py-4 md:py-6 bg-[#120a05]">
                
                {/* Title & Chevron */}
                <div className="flex justify-between items-start mb-6 cursor-pointer group" onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}>
                   <div className="flex-1 pr-4">
                      <h1 className="text-lg md:text-2xl font-medium text-stone-100 line-clamp-2 leading-snug font-sans group-hover:text-amber-500 transition-colors">{currentLesson.title}</h1>
                      <div className="text-xs text-stone-500 mt-2 flex items-center gap-2 font-mono">
                         <span className="text-stone-400">Lesson {currentLesson.order}</span>
                         <span className="w-1 h-1 rounded-full bg-stone-600"></span>
                         <span>{selectedLevel.title}</span>
                      </div>
                   </div>
                   <div className={`p-2 text-stone-500 group-hover:text-white transition-transform duration-300 ${isDescriptionOpen ? 'rotate-180' : ''}`}>
                      <ChevronDown size={20} />
                   </div>
                </div>

                {/* Channel Bar */}
                <div className="flex items-center justify-between mb-6 p-3 bg-white/5 rounded-full border border-white/5">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-700 to-stone-900 border border-amber-500/30 overflow-hidden flex items-center justify-center">
                        <span className="font-cinzel font-bold text-xs text-amber-500">TB</span>
                      </div>
                      <div>
                         <h3 className="text-sm font-bold text-stone-200">Taodocos Begena</h3>
                         <p className="text-[10px] text-stone-500">Official Instructor</p>
                      </div>
                   </div>
                   <button 
                      onClick={handleSubscribe}
                      className="bg-stone-100 text-black px-5 py-2 rounded-full text-xs font-bold hover:bg-red-600 hover:text-white transition-colors tracking-wide flex items-center gap-2"
                   >
                      <Youtube size={14} /> Subscribe
                   </button>
                </div>

                {/* Description */}
                {isDescriptionOpen && currentLesson.lyrics && (
                   <div className="bg-[#1a0f0a] p-5 rounded-xl text-sm text-stone-300 font-serif leading-loose mb-6 border border-white/5 shadow-inner animate-fade-in">
                      <h4 className="text-amber-500 font-bold mb-3 uppercase text-xs tracking-widest flex items-center gap-2 border-b border-white/5 pb-2">
                        <FileText size={14} /> Study Notes
                      </h4>
                      {renderBlockText(currentLesson.lyrics)}
                   </div>
                )}

                {/* Discussion Section */}
                <div className="mt-6 border-t border-white/5 pt-2">
                   <button 
                     onClick={() => setIsCommentsOpen(!isCommentsOpen)} 
                     className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-xl transition-colors group"
                   >
                     <div className="flex items-center gap-3">
                        <h3 className="font-bold text-stone-200">Discussion</h3>
                        <span className="text-xs text-stone-500"> Tap to {isCommentsOpen ? 'close' : 'view'} </span>
                     </div>
                     {isCommentsOpen ? <ChevronUp size={20} className="text-amber-500" /> : <ChevronDown size={20} className="text-stone-500 group-hover:text-amber-500" />}
                   </button>

                   {/* Load the API Fetching Component */}
                   {isCommentsOpen && (
                      <div className="mt-2 animate-in slide-in-from-top-2 duration-300">
                         <CommentSection youtubeVideoId={currentLesson.youtube_id} />
                      </div>
                   )}
                </div>

              </div>
            )}
          </div>
          
          {/* --- RIGHT COLUMN: PLAYLIST --- */}
          {!isFullScreen && (
            <div className="w-full lg:w-[32%] px-4 md:px-0 pb-10">
              <div className="flex justify-between items-end mb-4 mt-2 lg:mt-0 pb-2 border-b border-white/5">
                 <h3 className="font-cinzel text-xl text-stone-200">Up Next</h3>
                 <span className="text-xs text-stone-600 font-mono uppercase tracking-widest">Autoplay On</span>
              </div>
              <div className="flex flex-col gap-3">
                {selectedLevel.lessons.map((lesson, idx) => {
                  const isPlayable = isLevelUnlocked || lesson.is_free_sample;
                  const isActive = currentLesson.id === lesson.id;
                  return (
                    <div 
                      key={lesson.id} 
                      onClick={() => handleLessonChange(lesson)}
                      className={`flex gap-3 cursor-pointer group p-2 rounded-lg transition-all duration-300 ${isActive ? 'bg-amber-900/20 border border-amber-500/20' : 'hover:bg-white/5 border border-transparent'}`}
                    >
                      <div className="relative w-40 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-black shadow-lg">
                        <img 
                          src={`https://img.youtube.com/vi/${lesson.youtube_id}/mqdefault.jpg`} 
                          className={`w-full h-full object-cover transition-opacity ${!isPlayable ? 'opacity-40 grayscale' : 'opacity-80 group-hover:opacity-100'}`}
                        />
                        <div className="absolute bottom-1 right-1 bg-black/90 text-stone-300 text-[9px] px-1.5 py-0.5 rounded font-mono">
                           {isPlayable ? String(idx+1).padStart(2,'0') : <Lock size={8} />}
                        </div>
                        {isActive && (
                           <div className="absolute inset-0 bg-amber-600/10 flex items-center justify-center">
                              <div className="bg-black/50 p-1 rounded-full"><Loader2 size={16} className="text-amber-500 animate-spin" /></div>
                           </div>
                        )}
                      </div>
                      <div className="flex flex-col flex-1 min-w-0 pt-0.5 justify-center">
                        <h4 className={`text-sm font-medium line-clamp-2 leading-snug mb-1 transition-colors ${isActive ? 'text-amber-400' : 'text-stone-300 group-hover:text-white'}`}>
                           {lesson.title}
                        </h4>
                        <p className="text-xs text-stone-500 group-hover:text-stone-400">Taodocos Begena</p>
                        <div className="flex items-center gap-2 mt-1.5">
                           {lesson.is_free_sample && !isLevelUnlocked && <span className="bg-emerald-900/30 text-emerald-400 border border-emerald-500/20 text-[9px] px-1.5 rounded font-bold uppercase">Free</span>}
                           {!isPlayable && <span className="bg-stone-800 text-stone-500 text-[9px] px-1.5 rounded uppercase">Locked</span>}
                           {isActive && <span className="text-[9px] text-amber-500 font-bold uppercase tracking-wider animate-pulse">Playing</span>}
                        </div>
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