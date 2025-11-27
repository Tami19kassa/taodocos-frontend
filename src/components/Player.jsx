import { useState, useRef, useEffect } from 'react';
import { Play, ChevronLeft, Loader2, FileText, List, Maximize, Minimize } from 'lucide-react';
import { renderBlockText } from '@/utils/renderBlockText';

export default function Player({ currentLesson, selectedLevel, setCurrentLesson, onExit }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // Ref for the secure container
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

  // --- CUSTOM SAFE FULLSCREEN LOGIC ---
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Listen for fullscreen changes (ESC key) to update icon state
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  return (
    <div className="pt-24 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto min-h-screen bg-[#0B0C15]">
        
        <button 
          onClick={onExit} 
          className="mb-6 flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors group"
        >
           <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-cyan-500/50 transition-all">
             <ChevronLeft size={16} />
           </div>
           <span className="text-sm font-medium tracking-wide">Back to Sanctuary</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="w-full lg:w-3/4">
            
            {/* --- SECURE VIDEO CONTAINER --- */}
            {/* Added ref={playerRef} here */}
            <div 
              ref={playerRef}
              className="relative w-full h-0 pb-[56.25%] rounded-2xl overflow-hidden shadow-2xl shadow-cyan-900/20 border border-white/10 bg-black group"
            >
               {/* CUSTOM FULLSCREEN BUTTON (Sits on top of everything) */}
               {/* z-index 60 is higher than the shield (50) */}
               <button 
                 onClick={toggleFullScreen}
                 className="absolute top-4 right-4 z-[60] p-2 bg-black/50 hover:bg-cyan-600/80 backdrop-blur-md text-white rounded-lg border border-white/10 transition-all opacity-0 group-hover:opacity-100 duration-300"
                 title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
               >
                 {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
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
                     // fs=0 prevents the native YouTube fullscreen button from appearing
                     src={`https://www.youtube.com/embed/${currentLesson.youtube_id}?autoplay=1&modestbranding=1&rel=0&showinfo=0&controls=1&fs=0&disablekb=1&playsinline=1`} 
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                     onLoad={() => setIsLoading(false)}
                   />

                   {/* TOP SHIELD (Blocks Title) */}
                   <div 
                     className="absolute top-0 left-0 w-full h-[20%]" 
                     style={{ zIndex: 50, background: 'rgba(255,255,255,0.001)' }} 
                   />

                   {/* BOTTOM RIGHT SHIELD (Blocks Logo) */}
                   <div 
                     className="absolute bottom-0 right-0 w-[40%] h-[20%]" 
                     style={{ zIndex: 50, background: 'rgba(255,255,255,0.001)' }} 
                   />
                 </>
               )}
            </div>
            
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
          </div>
          
          {/* PLAYLIST */}
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
                      {currentLesson.id === lesson.id && (
                        <span className="text-[10px] text-cyan-400 uppercase tracking-wider font-bold mt-1 block animate-pulse">
                          Now Playing
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
    </div>
  );
}