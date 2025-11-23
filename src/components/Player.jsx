import { Play, ChevronDown } from 'lucide-react';
import { renderBlockText } from '@/utils/renderBlockText';

export default function Player({ currentLesson, selectedLevel, setCurrentLesson, onExit }) {
  return (
    <div className="pt-28 pb-12 px-4 max-w-[1600px] mx-auto min-h-screen">
        <button onClick={onExit} className="mb-6 flex items-center gap-2 text-stone-500 hover:text-white transition-colors">
           <ChevronDown className="rotate-90" size={16}/> Back to Sanctuary
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-9">
            {/* VIDEO CONTAINER WITH SHIELDS */}
            <div className="relative w-full h-0 pb-[56.25%] rounded-xl overflow-hidden shadow-2xl border border-amber-500/20 bg-black">
               <iframe 
                 className="absolute top-0 left-0 w-full h-full" 
                 style={{ zIndex: 1 }} 
                 src={`https://www.youtube.com/embed/${currentLesson.youtube_id}?modestbranding=1&rel=0&showinfo=0&controls=1&fs=0&disablekb=1`} 
               />
               <div className="absolute top-0 left-0 w-full h-[15%]" style={{ zIndex: 10, background: 'rgba(255,255,255,0.001)' }} title="Protected Content" />
               <div className="absolute bottom-0 right-0 w-[150px] h-[15%]" style={{ zIndex: 10, background: 'rgba(255,255,255,0.001)' }} title="Protected Content" />
            </div>
            
            <h1 className="font-cinzel text-3xl text-white mt-6 mb-2">{currentLesson.title}</h1>
            
            {currentLesson.lyrics && (
               <div className="bg-[#110a0a] p-8 rounded border border-white/5 mt-8">
                 <h3 className="font-cinzel text-amber-500 mb-6 text-sm tracking-widest uppercase">Lyrics</h3>
                 <div className="font-serif text-xl text-white/80 leading-loose whitespace-pre-wrap">
                   {renderBlockText(currentLesson.lyrics)}
                 </div>
               </div>
            )}
          </div>
          
          <div className="lg:col-span-3 bg-[#110a0a] border border-white/10 rounded p-6 sticky top-28 h-fit">
              <div className="flex justify-between mb-4"><h3 className="font-cinzel text-white">Lessons</h3></div>
              {selectedLevel.lessons.map((lesson, idx) => (
                <button 
                  key={lesson.id} 
                  onClick={() => setCurrentLesson(lesson)} 
                  className={`w-full p-4 text-left text-sm mb-2 transition-all rounded ${currentLesson.id === lesson.id ? 'bg-amber-900/30 text-amber-500 border border-amber-500/30' : 'text-stone-500 hover:text-white'}`}
                >
                  <span className="mr-2 font-mono opacity-50">{idx + 1}.</span> {lesson.title}
                </button>
              ))}
          </div>
        </div>
    </div>
  );
}