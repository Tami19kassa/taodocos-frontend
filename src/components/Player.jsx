import { useState, useRef, useEffect } from 'react';
import { Play, ChevronLeft, Loader2, FileText, List, Maximize, Minimize, Lock, Unlock } from 'lucide-react';
import { renderBlockText } from '@/utils/renderBlockText';
import CommentSection from './CommentSection'; // Import Comments

export default function Player({ currentLesson, selectedLevel, setCurrentLesson, onExit, isLevelUnlocked, jwt, user, onUnlockRequest }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  const playerRef = useRef(null);

  // Check if specific lesson is playable (Either Level is bought OR it's a free sample)
  const isLessonPlayable = isLevelUnlocked || currentLesson.is_free_sample;

  const handleLessonChange = (lesson) => {
    setIsPlaying(false);
    setIsLoading(false);
    setCurrentLesson(lesson);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlayClick = () => {
    if (isLessonPlayable) {
      setIsLoading(true);
      setIsPlaying(true);
    } else {
      // If locked, trigger the payment modal from the parent
      onUnlockRequest();
    }
  };

  // ... (Keep toggleFullScreen & useEffect logic exactly as before) ...
  const toggleFullScreen = () => { /* ... existing code ... */ };
  useEffect(() => { /* ... existing code ... */ }, [isFullScreen]);

  return (
    <div className={`transition-all ${isFullScreen ? 'bg-black' : 'pt-24 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto min-h-screen bg-[#0B0C15]'}`}>
        
        {!isFullScreen && (
          <div className="flex justify-between items-center mb-6">
            <button onClick={onExit} className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors group">
               <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-cyan-500/50 transition-all">
                 <ChevronLeft size={16} />
               </div>
               <span className="text-sm font-medium tracking-wide">Back to Sanctuary</span>
            </button>
            
            {/* Show "Unlock Full Course" button if browsing samples */}
            {!isLevelUnlocked && (
              <button onClick={onUnlockRequest} className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 animate-pulse">
                <Lock size={14} /> Unlock Full Level
              </button>
            )}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- LEFT: VIDEO AREA --- */}
          <div className={`${isFullScreen ? 'w-full h-screen fixed top-0 left-0 z-[100] bg-black flex items-center justify-center' : 'w-full lg:w-3/4'}`}>
            
            <div ref={playerRef} className={`relative overflow-hidden bg-black group transition-all duration-300 ${isFullScreen ? 'w-full h-full rounded-none' : 'w-full h-0 pb-[56.25%] rounded-2xl shadow-2xl shadow-cyan-900/20 border border-white/10'}`}>
               
               {!isFullScreen && isLessonPlayable && (
                 <button onClick={toggleFullScreen} className="absolute top-4 right-4 z-[70] p-2 bg-black/60 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                   <Maximize size={20} />
                 </button>
               )}

               {!isPlaying || !isLessonPlayable ? (
                 // FACADE / LOCKED SCREEN
                 <div className="absolute inset-0 z-20 flex flex-col items-center justify-center cursor-pointer bg-slate-900" onClick={handlePlayClick}>
                   <img 
                     src={`https://img.youtube.com/vi/${currentLesson.youtube_id}/maxresdefault.jpg`} 
                     className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isLessonPlayable ? 'opacity-60 group-hover:opacity-80' : 'opacity-30 blur-sm'}`}
                   />
                   
                   {/* Play Button or Lock Icon */}
                   <div className={`relative z-30 w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110 ${isLessonPlayable ? 'bg-cyan-500/90' : 'bg-slate-700/90'}`}>
                     {isLoading ? <Loader2 className="animate-spin text-white" size={32} /> : 
                      isLessonPlayable ? <Play className="text-white fill-white ml-1" size={32} /> : 
                      <Lock className="text-white" size={32} />
                     }
                   </div>

                   {!isLessonPlayable && (
                     <div className="relative z-30 mt-6 bg-black/80 backdrop-blur px-6 py-2 rounded-full border border-white/10 text-white font-cinzel text-lg">
                       Locked Content
                     </div>
                   )}
                 </div>
               ) : (
                 // ACTIVE PLAYER
                 <>
                   <iframe 
                     className="absolute top-0 left-0 w-full h-full" 
                     style={{ zIndex: 1 }} 
                     src={`https://www.youtube.com/embed/${currentLesson.youtube_id}?autoplay=1&modestbranding=1&rel=0&showinfo=0&controls=1&fs=0&disablekb=1&playsinline=1`} 
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                     onLoad={() => setIsLoading(false)}
                   />
                   <div className="absolute top-0 left-0 w-full h-[15%]" style={{ zIndex: 50, background: 'rgba(255,255,255,0.001)' }} />
                   <div className="absolute bottom-0 right-0 w-[40%] h-[15%]" style={{ zIndex: 50, background: 'rgba(255,255,255,0.001)' }} />
                 </>
               )}
            </div>
            
            {/* CONTENT BELOW VIDEO */}
            {!isFullScreen && (
              <>
                <div className="mt-8 border-b border-white/5 pb-6">
                  <h1 className="font-cinzel text-2xl md:text-4xl text-white mb-2">{currentLesson.title}</h1>
                  <div className="flex gap-3">
                    {currentLesson.is_free_sample && <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase border border-emerald-500/20">Free Sample</span>}
                    <span className="text-slate-500 text-sm self-center">Lesson {currentLesson.order}</span>
                  </div>
                </div>

                {isLessonPlayable && currentLesson.lyrics && (
                   <div className="mt-8 bg-[#11121f] p-6 rounded-3xl border border-white/5">
                     <div className="flex items-center gap-3 mb-4">
                       <FileText className="text-cyan-500" size={20} />
                       <h3 className="font-bold text-white text-sm tracking-widest uppercase">Lyrics & Notes</h3>
                     </div>
                     <div className="font-sans text-lg text-slate-300 leading-loose whitespace-pre-wrap">
                       {renderBlockText(currentLesson.lyrics)}
                     </div>
                   </div>
                )}

                {/* COMMENTS SECTION */}
                <CommentSection lessonId={currentLesson.id} jwt={jwt} user={user} />
              </>
            )}
          </div>
          
          {/* --- RIGHT: PLAYLIST SIDEBAR --- */}
          {!isFullScreen && (
            <div className="w-full lg:w-1/4">
              <div className="bg-[#11121f]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-1 sticky top-24">
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <List className="text-purple-400" size={20} />
                    <h3 className="font-bold text-white text-sm uppercase tracking-wider">Course Content</h3>
                  </div>
                  {!isLevelUnlocked && <Lock size={16} className="text-amber-500" />}
                </div>

                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2 space-y-1">
                  {selectedLevel.lessons.map((lesson, idx) => {
                    const isPlayable = isLevelUnlocked || lesson.is_free_sample;
                    return (
                      <button 
                        key={lesson.id} 
                        onClick={() => handleLessonChange(lesson)} 
                        className={`w-full p-4 text-left text-sm rounded-xl transition-all flex items-start gap-3 group ${
                          currentLesson.id === lesson.id 
                            ? 'bg-gradient-to-r from-cyan-900/40 to-purple-900/40 border border-cyan-500/30' 
                            : 'hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        {/* Icon: Play, Lock, or Number */}
                        <div className="mt-0.5">
                          {currentLesson.id === lesson.id ? <Play size={12} className="text-cyan-400 fill-cyan-400" /> :
                           !isPlayable ? <Lock size={12} className="text-slate-600" /> :
                           <span className="font-mono text-xs text-slate-600">{String(idx + 1).padStart(2, '0')}</span>}
                        </div>
                        
                        <div className="flex-1">
                          <span className={`block font-medium line-clamp-2 ${currentLesson.id === lesson.id ? 'text-white' : isPlayable ? 'text-slate-400 group-hover:text-slate-200' : 'text-slate-600'}`}>
                            {lesson.title}
                          </span>
                          {lesson.is_free_sample && !isLevelUnlocked && (
                            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mt-1 block">Free Preview</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>
    </div>
  );
}