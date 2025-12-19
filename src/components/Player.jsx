import { useState, useRef, useEffect } from 'react';
import { Play, ChevronLeft, Loader2, FileText, List, Maximize, Minimize, Lock, Music } from 'lucide-react';
import { renderBlockText } from '@/utils/renderBlockText';
import CommentSection from './CommentSection';

export default function Player({ currentLesson, selectedLevel, setCurrentLesson, onExit, isLevelUnlocked, jwt, user, onUnlockRequest }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
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

  return (
    <div className={`transition-colors duration-700 ${isFullScreen ? 'bg-black' : 'pt-24 pb-12 px-4 md:px-8 max-w-[1800px] mx-auto min-h-screen bg-[#120a05]'}`}>
        
        {/* --- HEADER NAVIGATION --- */}
        {!isFullScreen && (
          <div className="flex justify-between items-center mb-8 px-2">
            <button onClick={onExit} className="flex items-center gap-3 text-stone-400 hover:text-white transition-all group">
               <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-amber-500/50 group-hover:bg-amber-900/20 transition-all shadow-lg">
                 <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
               </div>
               <div className="flex flex-col items-start">
                   <span className="text-[10px] uppercase tracking-widest text-amber-500/70 font-bold">Return</span>
                   <span className="text-sm font-medium tracking-wide font-cinzel text-stone-300 group-hover:text-white">To Sanctuary</span>
               </div>
            </button>

            {!isLevelUnlocked && (
              <button onClick={onUnlockRequest} className="relative overflow-hidden bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-white px-6 py-2.5 rounded-full text-xs md:text-sm font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(217,119,6,0.3)] border border-amber-400/30 transition-all hover:scale-105">
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                <Lock size={14} /> 
                <span className="tracking-widest uppercase">Unlock Course</span>
              </button>
            )}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* --- LEFT COLUMN: VIDEO & INFO --- */}
          <div className={`${isFullScreen ? 'w-full h-screen fixed top-0 left-0 z-[100] bg-black flex items-center justify-center' : 'w-full lg:w-[72%]'}`}>
            
            {/* Video Wrapper with Cinematic Glow */}
            <div className="relative group/video">
                {/* Glow Effect */}
                {!isFullScreen && <div className="absolute -inset-1 bg-amber-600/10 blur-2xl rounded-2xl opacity-50 group-hover/video:opacity-75 transition-opacity duration-700" />}
                
                <div ref={playerRef} className={`relative overflow-hidden bg-black z-10 ${isFullScreen ? 'w-full h-full' : 'w-full h-0 pb-[56.25%] rounded-2xl shadow-2xl border border-white/10'}`}>
                
                {!isFullScreen && isLessonPlayable && (
                    <button onClick={toggleFullScreen} className="absolute top-4 right-4 z-[70] p-2.5 bg-black/40 backdrop-blur-md border border-white/10 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-amber-600 hover:border-amber-500 shadow-lg">
                    <Maximize size={20} />
                    </button>
                )}

                {!isPlaying || !isLessonPlayable ? (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center cursor-pointer bg-[#0c0502]" onClick={handlePlayClick}>
                        {/* Thumbnail */}
                        <img 
                            src={`https://img.youtube.com/vi/${currentLesson.youtube_id}/maxresdefault.jpg`} 
                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${isLessonPlayable ? 'opacity-50 group-hover:scale-105' : 'opacity-20 grayscale blur-sm'}`} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
                        
                        {/* Play / Lock Button */}
                        <div className={`relative z-30 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${isLessonPlayable ? 'shadow-[0_0_50px_rgba(217,119,6,0.5)]' : 'shadow-none'}`}>
                            {/* Outer Ring */}
                            <div className={`absolute inset-0 rounded-full border-2 ${isLessonPlayable ? 'border-amber-500/50 animate-[spin_10s_linear_infinite]' : 'border-stone-700'}`} />
                            
                            {/* Inner Circle */}
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center backdrop-blur-sm border ${
                                isLessonPlayable 
                                    ? 'bg-amber-600/90 border-amber-400 text-white' 
                                    : 'bg-stone-900/90 border-stone-700 text-stone-500'
                            }`}>
                                {isLoading ? <Loader2 className="animate-spin" size={32} /> : 
                                isLessonPlayable ? <Play className="ml-1 fill-white" size={32} /> : 
                                <Lock size={28} />
                                }
                            </div>
                        </div>

                        {!isLessonPlayable && (
                            <div className="relative z-30 mt-8 flex flex-col items-center gap-2">
                                <span className="font-cinzel text-xl text-stone-300 tracking-[0.2em] uppercase drop-shadow-md">Locked Content</span>
                                <span className="text-xs text-amber-500/60 uppercase tracking-widest font-mono border border-amber-500/20 px-3 py-1 rounded-full bg-black/40">Premium Access Only</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                    <iframe 
                        className="absolute top-0 left-0 w-full h-full" 
                        style={{ zIndex: 1 }} 
                        src={`https://www.youtube.com/embed/${currentLesson.youtube_id}?autoplay=1&modestbranding=1&rel=0&showinfo=0&controls=1&fs=0&disablekb=1&playsinline=1`} 
                        allow="autoplay; encrypted-media" 
                        onLoad={() => setIsLoading(false)} 
                    />
                    </>
                )}
                </div>
            </div>
            
            {!isFullScreen && (
              <div className="animate-fade-in-up">
                {/* Title Section */}
                <div className="mt-10 mb-8 border-b border-white/5 pb-8">
                  <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-amber-500 font-mono text-xs tracking-widest uppercase border border-amber-500/20 px-2 py-0.5 rounded">
                                Lesson {String(currentLesson.order).padStart(2, '0')}
                            </span>
                            {currentLesson.is_free_sample && (
                                <span className="bg-emerald-900/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-emerald-500/20 tracking-wider">
                                    Free Sample
                                </span>
                            )}
                        </div>
                        <h1 className="font-cinzel text-3xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-stone-100 via-stone-200 to-stone-400 mb-2 drop-shadow-sm">
                            {currentLesson.title}
                        </h1>
                      </div>
                  </div>
                </div>

                {/* Lyrics & Notes Card */}
                {isLessonPlayable && currentLesson.lyrics && (
                   <div className="relative bg-[#18100c] p-8 md:p-10 rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
                     {/* Decorative Background Element */}
                     <div className="absolute top-0 right-0 w-64 h-64 bg-amber-900/5 blur-[100px] rounded-full pointer-events-none" />
                     
                     <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                <FileText className="text-amber-500" size={20} />
                            </div>
                            <h3 className="font-bold text-stone-200 text-sm tracking-[0.2em] uppercase font-cinzel">Study Notes & Lyrics</h3>
                        </div>
                        <div className="font-serif text-lg md:text-xl text-stone-300/90 leading-loose whitespace-pre-wrap pl-4 border-l-2 border-amber-900/30">
                            {renderBlockText(currentLesson.lyrics)}
                        </div>
                     </div>
                   </div>
                )}

                {/* Comments */}
                <div className="mt-12">
                   <CommentSection lessonId={currentLesson.id} jwt={jwt} user={user} />
                </div>
              </div>
            )}
          </div>
          
          {/* --- RIGHT COLUMN: PLAYLIST --- */}
          {!isFullScreen && (
            <div className="w-full lg:w-[28%] min-w-[300px]">
              <div className="bg-[#1a0f0a]/80 backdrop-blur-md border border-white/5 rounded-2xl sticky top-24 shadow-2xl flex flex-col max-h-[calc(100vh-120px)] overflow-hidden">
                
                {/* Playlist Header */}
                <div className="p-5 border-b border-white/5 bg-white/[0.02] flex items-center justify-between z-10">
                  <div className="flex items-center gap-3">
                    <List className="text-amber-500" size={18} />
                    <h3 className="font-bold text-stone-200 text-xs uppercase tracking-[0.2em]">Course Content</h3>
                  </div>
                  <div className="text-[10px] text-stone-500 font-mono">
                      {selectedLevel.lessons.length} Lessons
                  </div>
                </div>

                {/* Playlist Items */}
                <div className="overflow-y-auto custom-scrollbar p-2 space-y-1 flex-1">
                  {selectedLevel.lessons.map((lesson, idx) => {
                    const isPlayable = isLevelUnlocked || lesson.is_free_sample;
                    const isActive = currentLesson.id === lesson.id;
                    
                    return (
                      <button 
                        key={lesson.id} 
                        onClick={() => handleLessonChange(lesson)} 
                        className={`relative w-full p-4 text-left rounded-xl transition-all duration-300 flex items-center gap-4 group overflow-hidden ${
                          isActive 
                            ? 'bg-amber-900/20 border border-amber-500/30' 
                            : 'hover:bg-white/5 border border-transparent hover:border-white/5'
                        }`}
                      >
                        {/* Active Indicator Bar */}
                        {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />}

                        {/* Number / Icon */}
                        <div className="flex-shrink-0 w-8 flex justify-center">
                          {isActive ? (
                            <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-600/20">
                                <Play size={10} className="text-black fill-black ml-0.5" />
                            </div>
                          ) : !isPlayable ? (
                            <Lock size={14} className="text-stone-600" />
                          ) : (
                            <span className="font-mono text-xs text-stone-600 group-hover:text-stone-400">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                          )}
                        </div>
                        
                        {/* Text Info */}
                        <div className="flex-1 min-w-0">
                          <span className={`block truncate font-serif text-sm transition-colors ${
                            isActive 
                              ? 'text-amber-100 font-medium' 
                              : isPlayable 
                                ? 'text-stone-400 group-hover:text-stone-200' 
                                : 'text-stone-600'
                          }`}>
                            {lesson.title}
                          </span>
                          
                          {lesson.is_free_sample && !isLevelUnlocked && (
                            <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider mt-1 inline-block border border-emerald-500/20 px-1.5 rounded bg-emerald-500/5">
                              Free Preview
                            </span>
                          )}
                        </div>
                        
                        {/* Hover Arrow (Visual feedback) */}
                        {isPlayable && !isActive && (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                                <Play size={10} className="text-stone-500" />
                            </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                
                {/* Bottom Shadow Gradient for list */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#1a0f0a] to-transparent pointer-events-none" />
              </div>
            </div>
          )}
        </div>
    </div>
  );
}