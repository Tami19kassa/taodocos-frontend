import { useState, useRef, useEffect } from 'react';
import { Play, ChevronLeft, Loader2, FileText, List, Maximize, Minimize, Lock } from 'lucide-react';
import { renderBlockText } from '@/utils/renderBlockText';
import CommentSection from './CommentSection';

export default function Player({ currentLesson, selectedLevel, setCurrentLesson, onExit, isLevelUnlocked, jwt, user, onUnlockRequest }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const playerRef = useRef(null);

  // Safety Check
  if (!currentLesson) return <div className="pt-32 text-center text-amber-500 font-cinzel">Loading Lesson...</div>;

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

  return (
    <div className={`transition-all ${isFullScreen ? 'bg-black' : 'pt-24 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto min-h-screen bg-[#120a05]'}`}>
        
        {!isFullScreen && (
          <div className="flex justify-between items-center mb-6">
            <button onClick={onExit} className="flex items-center gap-2 text-stone-400 hover:text-amber-500 transition-colors group">
               <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-amber-500/50 transition-all">
                 <ChevronLeft size={16} />
               </div>
               <span className="text-sm font-medium tracking-wide font-cinzel">Back to Sanctuary</span>
            </button>
            {!isLevelUnlocked && (
              <button onClick={onUnlockRequest} className="bg-amber-700 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 animate-pulse border border-amber-500/30">
                <Lock size={14} /> Unlock Full Level
              </button>
            )}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* VIDEO AREA */}
          <div className={`${isFullScreen ? 'w-full h-screen fixed top-0 left-0 z-[100] bg-black flex items-center justify-center' : 'w-full lg:w-3/4'}`}>
            <div ref={playerRef} className={`relative overflow-hidden bg-black group ${isFullScreen ? 'w-full h-full' : 'w-full h-0 pb-[56.25%] rounded-xl shadow-2xl border border-white/10'}`}>
               
               {!isFullScreen && isLessonPlayable && (
                 <button onClick={toggleFullScreen} className="absolute top-4 right-4 z-[70] p-2 bg-black/60 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-amber-900/60">
                   <Maximize size={20} />
                 </button>
               )}

               {!isPlaying || !isLessonPlayable ? (
                 <div className="absolute inset-0 z-20 flex flex-col items-center justify-center cursor-pointer bg-[#1a0f0a]" onClick={handlePlayClick}>
                   <img src={`https://img.youtube.com/vi/${currentLesson.youtube_id}/maxresdefault.jpg`} className={`absolute inset-0 w-full h-full object-cover ${isLessonPlayable ? 'opacity-60' : 'opacity-30 blur-sm'}`} />
                   <div className={`relative z-30 w-20 h-20 rounded-full flex items-center justify-center shadow-2xl shadow-black/50 transition-transform group-hover:scale-110 ${isLessonPlayable ? 'bg-amber-600/90' : 'bg-stone-800/90'}`}>
                     {isLoading ? <Loader2 className="animate-spin text-white" size={32} /> : 
                      isLessonPlayable ? <Play className="text-white ml-1" size={32} /> : 
                      <Lock className="text-stone-400" size={32} />
                     }
                   </div>
                   {!isLessonPlayable && (
                    <div className="relative z-30 mt-6 bg-black/80 backdrop-blur px-6 py-2 rounded-full border border-white/10 text-stone-300 font-cinzel text-lg tracking-widest">
                      Locked Content
                    </div>
                   )}
                 </div>
               ) : (
                 <>
                   <iframe className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 1 }} src={`https://www.youtube.com/embed/${currentLesson.youtube_id}?autoplay=1&modestbranding=1&rel=0&showinfo=0&controls=1&fs=0&disablekb=1&playsinline=1`} allow="autoplay; encrypted-media" onLoad={() => setIsLoading(false)} />
                   <div className="absolute top-0 left-0 w-full h-[15%]" style={{ zIndex: 50, background: 'rgba(255,255,255,0.001)' }} />
                   <div className="absolute bottom-0 right-0 w-[40%] h-[15%]" style={{ zIndex: 50, background: 'rgba(255,255,255,0.001)' }} />
                 </>
               )}
            </div>
            
            {!isFullScreen && (
              <>
                <div className="mt-8 border-b border-white/5 pb-6">
                  <h1 className="font-cinzel text-2xl md:text-4xl text-white mb-2">{currentLesson.title}</h1>
                  <div className="flex gap-3">
                    {currentLesson.is_free_sample && <span className="bg-emerald-900/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase border border-emerald-800">Free Sample</span>}
                    <span className="text-stone-500 text-sm self-center font-serif">Lesson {currentLesson.order}</span>
                  </div>
                </div>

                {isLessonPlayable && currentLesson.lyrics && (
                   <div className="mt-8 bg-[#1a0f0a] p-8 rounded-xl border border-white/5 shadow-lg">
                     <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-4">
                       <FileText className="text-amber-600" size={20} />
                       <h3 className="font-bold text-stone-300 text-sm tracking-widest uppercase">Lyrics & Notes</h3>
                     </div>
                    <div className="font-serif text-base md:text-lg text-stone-300 leading-loose whitespace-pre-wrap">
                       {renderBlockText(currentLesson.lyrics)}
                     </div>
                   </div>
                )}

                {/* Pass user and jwt to CommentSection */}
                <CommentSection lessonId={currentLesson.id} jwt={jwt} user={user} />
              </>
            )}
          </div>
          
          {/* PLAYLIST SIDEBAR */}
          {!isFullScreen && (
            <div className="w-full lg:w-1/4">
              <div className="bg-[#1a0f0a] border border-white/5 rounded-xl p-1 sticky top-24 shadow-xl">
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <List className="text-amber-600" size={20} />
                    <h3 className="font-bold text-stone-300 text-sm uppercase tracking-widest">Content</h3>
                  </div>
                  {!isLevelUnlocked && <Lock size={14} className="text-stone-600" />}
                </div>

                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2 space-y-1">
                  {/* ... inside the map loop ... */}
                {selectedLevel.lessons.map((lesson, idx) => {
                    const isPlayable = isLevelUnlocked || lesson.is_free_sample;
                    return (
                      <button 
                        key={lesson.id} 
                        onClick={() => handleLessonChange(lesson)} 
                        className={`w-full p-4 text-left text-sm rounded-lg transition-all flex items-start gap-3 group ${
                          currentLesson.id === lesson.id 
                            ? 'bg-amber-900/40 border border-amber-600/50 shadow-lg' // Active State
                            : 'hover:bg-white/10 border border-transparent' // Inactive State
                        }`}
                      >
                        <div className="mt-0.5">
                          {currentLesson.id === lesson.id ? (
                            <Play size={12} className="text-amber-500 fill-amber-500" />
                          ) : !isPlayable ? (
                            <Lock size={12} className="text-stone-500" />
                          ) : (
                            // Made number lighter (stone-500 instead of 600)
                            <span className="font-mono text-xs text-stone-500 group-hover:text-stone-300">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <span className={`block font-serif tracking-wide ${
                            currentLesson.id === lesson.id 
                              ? 'text-white font-bold' 
                              : isPlayable 
                                ? 'text-stone-300 group-hover:text-white' // MUCH BRIGHTER TEXT
                                : 'text-stone-500'
                          }`}>
                            {lesson.title}
                          </span>
                          
                          {lesson.is_free_sample && !isLevelUnlocked && (
                            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mt-1 block">
                              Free Preview
                            </span>
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