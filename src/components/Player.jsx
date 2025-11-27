import { useState } from 'react';
import { Play, ChevronDown, Loader2 } from 'lucide-react';
import { renderBlockText } from '@/utils/renderBlockText';

export default function Player({ currentLesson, selectedLevel, setCurrentLesson, onExit }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Reset state when lesson changes
  const handleLessonChange = (lesson) => {
    setIsPlaying(false); // Go back to thumbnail mode
    setIsLoading(false);
    setCurrentLesson(lesson);
  };

  const handlePlayClick = () => {
    setIsLoading(true);
    setIsPlaying(true);
  };

  return (
    <div className="pt-24 pb-12 px-4 max-w-[1600px] mx-auto min-h-screen">
        <button onClick={onExit} className="mb-6 flex items-center gap-2 text-stone-500 hover:text-white transition-colors">
           <ChevronDown className="rotate-90" size={16}/> Back to Sanctuary
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-9">
            
            {/* --- THE SECURE VIDEO CONTAINER --- */}
            <div className="relative w-full h-0 pb-[56.25%] rounded-xl overflow-hidden shadow-2xl border border-amber-500/20 bg-black group">
               
               {!isPlaying ? (
                 // STATE 1: THE "FACADE" (Custom Thumbnail)
                 // This is just an image. No YouTube links exist here. 100% Safe.
                 <div 
                   className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer"
                   onClick={handlePlayClick}
                 >
                   {/* High Res Thumbnail from YouTube */}
                   <img 
                     src={`https://img.youtube.com/vi/${currentLesson.youtube_id}/maxresdefault.jpg`} 
                     className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                     alt="Video Thumbnail"
                   />
                   
                   {/* Custom Play Button */}
                   <div className="relative z-30 w-20 h-20 bg-amber-600/90 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(217,119,6,0.6)] group-hover:scale-110 transition-transform">
                     {isLoading ? (
                       <Loader2 className="animate-spin text-white" size={32} />
                     ) : (
                       <Play className="text-white fill-white ml-1" size={32} />
                     )}
                   </div>
                 </div>
               ) : (
                 // STATE 2: THE ACTIVE PLAYER
                 <>
                   <iframe 
                     className="absolute top-0 left-0 w-full h-full" 
                     style={{ zIndex: 1 }} 
                     // autoplay=1 makes it start immediately after the facade click
                     src={`https://www.youtube.com/embed/${currentLesson.youtube_id}?autoplay=1&modestbranding=1&rel=0&showinfo=0&controls=1&fs=0&disablekb=1&playsinline=1`} 
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                     onLoad={() => setIsLoading(false)}
                   />

                   {/* --- AGGRESSIVE SHIELDS --- */}
                   
                   {/* TOP SHIELD: Covers 100% width. Blocks Title (Left) AND Share Button (Right) */}
                   <div 
                     className="absolute top-0 left-0 w-full h-[25%]" 
                     style={{ zIndex: 50, background: 'rgba(255,255,255,0.001)' }} 
                     title="Protected Content"
                   />

                   {/* BOTTOM RIGHT SHIELD: Blocks YouTube Logo */}
                   <div 
                     className="absolute bottom-0 right-0 w-[40%] h-[20%]" 
                     style={{ zIndex: 50, background: 'rgba(255,255,255,0.001)' }} 
                     title="Protected Content"
                   />
                 </>
               )}
            </div>
            
            <div className="mt-8 border-b border-white/10 pb-6">
              <h1 className="font-cinzel text-3xl text-white mb-2">{currentLesson.title}</h1>
              <p className="text-stone-500 text-sm">Lesson {currentLesson.order} of {selectedLevel?.name}</p>
            </div>

            {currentLesson.lyrics && (
               <div className="mt-8 bg-white/5 p-8 rounded border border-white/5">
                 <h3 className="font-cinzel text-amber-500 mb-6 text-sm tracking-widest uppercase">Lyrics & Notes</h3>
                 <div className="font-serif text-xl text-stone-300 leading-loose whitespace-pre-wrap">
                   {renderBlockText(currentLesson.lyrics)}
                 </div>
               </div>
            )}
          </div>
          
          {/* SIDEBAR */}
          <div className="lg:col-span-3">
            <div className="bg-[#141210] border border-white/10 rounded-xl p-4 sticky top-28">
              <h3 className="font-cinzel text-white mb-4 px-2">Course Content</h3>
              <div className="space-y-1 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {selectedLevel.lessons.map((lesson, idx) => (
                  <button 
                    key={lesson.id} 
                    onClick={() => handleLessonChange(lesson)} 
                    className={`w-full p-3 text-left text-sm rounded transition-all flex items-center gap-3 ${currentLesson.id === lesson.id ? 'bg-amber-900/30 text-amber-500 border border-amber-500/30' : 'text-stone-500 hover:bg-white/5 hover:text-stone-300'}`}
                  >
                    <span className="font-mono opacity-50 text-xs">{idx + 1}</span>
                    <span className="line-clamp-1">{lesson.title}</span>
                    {currentLesson.id === lesson.id && <Play size={12} fill="currentColor"/>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}