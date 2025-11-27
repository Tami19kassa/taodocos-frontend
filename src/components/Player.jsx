import { useState, useRef, useEffect } from 'react';
import { Play, ChevronLeft, Loader2, FileText, List, Maximize, Minimize } from 'lucide-react';
import { renderBlockText } from '@/utils/renderBlockText';

export default function Player({ currentLesson, selectedLevel, setCurrentLesson, onExit }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  const playerRef = useRef(null);

  // Reset state when lesson changes
  const handleLessonChange = (lesson) => {
    setIsPlaying(false);
    setIsLoading(false);
    setCurrentLesson(lesson);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlayClick = () => {
    setIsLoading(true);
    setIsPlaying(true);
  };

  // --- HYBRID FULLSCREEN LOGIC ---
  const toggleFullScreen = () => {
    const el = playerRef.current;

    if (!isFullScreen) {
      // 1. Try Standard Browser Fullscreen (Android/Desktop)
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => setIsFullScreen(true)); // Fallback if API fails
      } else if (el.webkitRequestFullscreen) { // Safari/iOS Support
        el.webkitRequestFullscreen(); 
      } else {
        // 2. Fallback to CSS Fullscreen (For stubborn iPhones)
        setIsFullScreen(true); 
      }
    } else {
      // Exit Logic
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => setIsFullScreen(false));
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else {
        setIsFullScreen(false);
      }
    }
  };

  // Listen for native fullscreen changes (ESC key or Native Mobile Back)
  useEffect(() => {
    const handleFsChange = () => {
      const isNativeFs = !!document.fullscreenElement || !!document.webkitFullscreenElement;
      if (!isNativeFs && isFullScreen) {
        // If native fullscreen exited, turn off our state
        setIsFullScreen(false);
      }
    };
    
    document.addEventListener("fullscreenchange", handleFsChange);
    document.addEventListener("webkitfullscreenchange", handleFsChange); // iOS
    
    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
      document.removeEventListener("webkitfullscreenchange", handleFsChange);
    };
  }, [isFullScreen]);

  return (
    <div className={`transition-all ${isFullScreen ? 'bg-black' : 'pt-24 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto min-h-screen bg-[#0B0C15]'}`}>
        
        {/* Hide Back Button in Fullscreen Mode */}
        {!isFullScreen && (
          <button 
            onClick={onExit} 
            className="mb-6 flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors group"
          >
             <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-cyan-500/50 transition-all">
               <ChevronLeft size={16} />
             </div>
             <span className="text-sm font-medium tracking-wide">Back to Sanctuary</span>
          </button>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className={`${isFullScreen ? 'w-full h-screen fixed top-0 left-0 z-[100] bg-black flex items-center justify-center' : 'w-full lg:w-3/4'}`}>
            
            {/* --- SECURE VIDEO CONTAINER --- */}
            <div 
              ref={playerRef}
              className={`relative overflow-hidden bg-black group transition-all duration-300 ${
                isFullScreen 
                  ? 'w-full h-full rounded-none' // Fullscreen Styles
                  : 'w-full h-0 pb-[56.25%] rounded-2xl shadow-2xl shadow-cyan-900/20 border border-white/10' // Normal Styles
              }`}
            >
               {/* TOGGLE BUTTON */}
               <button 
                 onClick={toggleFullScreen}
                 className="absolute top-6 right-6 z-[70] p-3 bg-black/60 hover:bg-cyan-600/90 backdrop-blur-md text-white rounded-full border border-white/20 transition-all opacity-0 group-hover:opacity-100 duration-300 shadow-xl"
                 title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
               >
                 {isFullScreen ? <Minimize size={24} /> : <Maximize size={24} />}
               </button>

               {!isPlaying ? (
                 // STATE 1: FACADE
                 <div 
                   className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer bg-slate-900"
                   onClick={handlePlayClick}
                 >
                   <img 
                     src={`https://img.youtube.com/vi/${currentLesson.youtube_id}/maxresdefault.jpg`} 
                     className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                     alt="Video Thumbnail"
                   />
                   
                   <div className="relative z-30 w-20 h-20 bg-cyan-500/90 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.6)] group-hover:scale-110 transition-transform backdrop-blur-sm border border-white/20">
                     {isLoading ? (
                       <Loader2 className="animate-spin text-white" size={32} />
                     ) : (
                       <Play className="text-white fill-white ml-1" size={32} />
                     )}
                   </div>
                 </div>
               ) : (
                 // STATE 2: ACTIVE PLAYER
                 <>
                   <iframe 
                     className="absolute top-0 left-0 w-full h-full" 
                     style={{ zIndex: 1 }} 
                     // playsinline=1 is CRITICAL for iOS to respect our custom container
                     src={`https://www.youtube.com/embed/${currentLesson.youtube_id}?autoplay=1&modestbranding=1&rel=0&showinfo=0&controls=1&fs=0&disablekb=1&playsinline=1`} 
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                     onLoad={() => setIsLoading(false)}
                   />

                   {/* TOP SHIELD */}
                   <div 
                     className="absolute top-0 left-0 w-full h-[15%]" 
                     style={{ zIndex: 50, background: 'rgba(255,255,255,0.001)' }} 
                   />

                   {/* BOTTOM RIGHT SHIELD */}
                   <div 
                     className="absolute bottom-0 right-0 w-[40%] h-[15%]" 
                     style={{ zIndex: 50, background: 'rgba(255,255,255,0.001)' }} 
                   />
                 </>
               )}
            </div>
            
            {/* HIDE CONTENT WHEN FULLSCREEN */}
            {!isFullScreen && (
              <>
                <div className="mt-8 border-b border-white/5 pb-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h1 className="font-cinzel text-2xl md:text-4xl text-white mb-2 leading-tight">
                        {currentLesson.title}
                      </h1>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/20 font-bold text-xs uppercase tracking-wider">
                          {selectedLevel?.name}
                        </span>
                        <span className="text-slate-500">Lesson {currentLesson.order}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {currentLesson.lyrics && (
                   <div className="mt-8 bg-[#11121f] p-6 md:p-10 rounded-3xl border border-white/5 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-[50px] pointer-events-none" />
                     <div className="flex items-center gap-3 mb-6">
                       <FileText className="text-cyan-500" size={20} />
                       <h3 className="font-bold text-white text-sm tracking-widest uppercase">
                         Lyrics & Notes
                       </h3>
                     </div>
                     <div className="font-sans text-lg text-slate-300 leading-loose whitespace-pre-wrap">
                       {renderBlockText(currentLesson.lyrics)}
                     </div>
                   </div>
                )}
              </>
            )}
          </div>
          
          {/* PLAYLIST (Hide on Fullscreen) */}
          {!isFullScreen && (
            <div className="w-full lg:w-1/4">
              <div className="bg-[#11121f]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-1 sticky top-24">
                <div className="p-4 border-b border-white/5 flex items-center gap-3">
                  <List className="text-purple-400" size={20} />
                  <h3 className="font-bold text-white text-sm uppercase tracking-wider">
                    Course Content
                  </h3>
                </div>
                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2 space-y-1">
                  {selectedLevel.lessons.map((lesson, idx) => (
                    <button 
                      key={lesson.id} 
                      onClick={() => handleLessonChange(lesson)} 
                      className={`w-full p-4 text-left text-sm rounded-xl transition-all flex items-start gap-4 group ${
                        currentLesson.id === lesson.id 
                          ? 'bg-gradient-to-r from-cyan-900/40 to-purple-900/40 border border-cyan-500/30' 
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <span className={`font-mono text-xs mt-0.5 ${
                        currentLesson.id === lesson.id ? 'text-cyan-400' : 'text-slate-600'
                      }`}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1">
                        <span className={`block font-medium line-clamp-2 ${
                          currentLesson.id === lesson.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                        }`}>
                          {lesson.title}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
    </div>
  );
}