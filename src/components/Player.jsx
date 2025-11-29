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
  if (!currentLesson) return <div className="pt-32 text-center text-white">Loading Lesson...</div>;

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
    <div className={`transition-all ${isFullScreen ? 'bg-black' : 'pt-24 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto min-h-screen bg-[#0B0C15]'}`}>
        
        {!isFullScreen && (
          <div className="flex justify-between items-center mb-6">
            <button onClick={onExit} className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors">
               <ChevronLeft size={16} /> Back to Sanctuary
            </button>
            {!isLevelUnlocked && (
              <button onClick={onUnlockRequest} className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 animate-pulse">
                <Lock size={14} /> Unlock Full Level
              </button>
            )}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* VIDEO */}
          <div className={`${isFullScreen ? 'w-full h-screen fixed top-0 left-0 z-[100] bg-black flex items-center justify-center' : 'w-full lg:w-3/4'}`}>
            <div ref={playerRef} className={`relative overflow-hidden bg-black group ${isFullScreen ? 'w-full h-full' : 'w-full h-0 pb-[56.25%] rounded-2xl shadow-2xl border border-white/10'}`}>
               
               {!isFullScreen && isLessonPlayable && (
                 <button onClick={toggleFullScreen} className="absolute top-4 right-4 z-[70] p-2 bg-black/60 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                   <Maximize size={20} />
                 </button>
               )}

               {!isPlaying || !isLessonPlayable ? (
                 <div className="absolute inset-0 z-20 flex flex-col items-center justify-center cursor-pointer bg-slate-900" onClick={handlePlayClick}>
                   <img src={`https://img.youtube.com/vi/${currentLesson.youtube_id}/maxresdefault.jpg`} className={`absolute inset-0 w-full h-full object-cover ${isLessonPlayable ? 'opacity-60' : 'opacity-30 blur-sm'}`} />
                   <div className={`relative z-30 w-20 h-20 rounded-full flex items-center justify-center shadow-2xl ${isLessonPlayable ? 'bg-cyan-500/90' : 'bg-slate-700/90'}`}>
                     {isLessonPlayable ? <Play className="text-white ml-1" size={32} /> : <Lock className="text-white" size={32} />}
                   </div>
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
                    {currentLesson.is_free_sample && <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase border border-emerald-500/20">Free Sample</span>}
                    <span className="text-slate-500 text-sm self-center">Lesson {currentLesson.order}</span>
                  </div>
                </div>
                <CommentSection lessonId={currentLesson.id} jwt={jwt} user={user} />
              </>
            )}
          </div>
          
          {/* PLAYLIST */}
          {!isFullScreen && (
            <div className="w-full lg:w-1/4">
              <div className="bg-[#11121f]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-1 sticky top-24">
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm uppercase">Course Content</h3>
                  {!isLevelUnlocked && <Lock size={16} className="text-amber-500" />}
                </div>
                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2 space-y-1">
                  {selectedLevel.lessons.map((lesson, idx) => {
                    const isPlayable = isLevelUnlocked || lesson.is_free_sample;
                    return (
                      <button key={lesson.id} onClick={() => handleLessonChange(lesson)} className={`w-full p-4 text-left text-sm rounded-xl transition-all flex items-start gap-3 group ${currentLesson.id === lesson.id ? 'bg-gradient-to-r from-cyan-900/40 to-purple-900/40 border border-cyan-500/30' : 'hover:bg-white/5 border border-transparent'}`}>
                        <div className="mt-0.5">{currentLesson.id === lesson.id ? <Play size={12} className="text-cyan-400" /> : !isPlayable ? <Lock size={12} className="text-slate-600" /> : <span className="font-mono text-xs text-slate-600">{String(idx + 1).padStart(2, '0')}</span>}</div>
                        <div className="flex-1">
                          <span className={`block font-medium ${currentLesson.id === lesson.id ? 'text-white' : isPlayable ? 'text-slate-400' : 'text-slate-600'}`}>{lesson.title}</span>
                          {lesson.is_free_sample && !isLevelUnlocked && <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mt-1 block">Free Preview</span>}
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