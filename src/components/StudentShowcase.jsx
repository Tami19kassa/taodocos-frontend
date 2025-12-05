import { useState } from 'react';
import { Play, Image as ImageIcon } from 'lucide-react';
import VideoModal from './VideoModal'; // Import the modal

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export default function StudentShowcase({ performances }) {
  const [activeVideoId, setActiveVideoId] = useState(null);

  if (!performances || performances.length === 0) return null;

  return (
    <section className="py-24 px-4 bg-[#0c0a09]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="text-amber-600 font-bold tracking-widest uppercase text-xs mb-2 block">Gallery</span>
            <h2 className="font-cinzel text-3xl md:text-4xl text-white">Student Performances</h2>
          </div>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-8 no-scrollbar snap-x snap-mandatory">
          {performances.map((item) => {
            const isVideo = item.type === 'video';
            
            const rawUrl = item.image?.url;
            const imageUrl = rawUrl 
               ? (rawUrl.startsWith('http') ? rawUrl : `${STRAPI_URL}${rawUrl}`)
               : null;

            return (
              <div 
                key={item.id} 
                className="snap-center shrink-0 w-[300px] md:w-[400px] group cursor-pointer"
                // If it's a video, open modal on click
                onClick={() => isVideo && setActiveVideoId(item.youtube_id)}
              >
                <div className="relative aspect-video rounded-xl overflow-hidden bg-[#1a0f0a] border border-white/10 mb-4 shadow-lg group-hover:border-amber-500/50 transition-colors">
                  
                  {isVideo ? (
                    // Video Thumbnail
                    <>
                      <img 
                        src={`https://img.youtube.com/vi/${item.youtube_id}/mqdefault.jpg`} 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-amber-600/90 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                          <Play fill="white" size={20} className="text-white ml-1" />
                        </div>
                      </div>
                    </>
                  ) : (
                    // Image Display
                    <>
                      {imageUrl ? (
                        <img src={imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-600">
                          <ImageIcon size={32} />
                        </div>
                      )}
                    </>
                  )}
                  
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase text-white border border-white/10">
                    {isVideo ? "Video Performance" : "Photo Gallery"}
                  </div>
                </div>

                <h3 className="font-cinzel text-xl text-white mb-1 group-hover:text-amber-500 transition-colors">{item.title}</h3>
                <p className="text-stone-400 text-sm">By <span className="text-amber-500">{item.student_name}</span></p>
              </div>
            );
          })}
        </div>

        {/* RENDER MODAL OUTSIDE LOOP */}
        <VideoModal 
          isOpen={!!activeVideoId} 
          videoId={activeVideoId} 
          onClose={() => setActiveVideoId(null)} 
        />

      </div>
    </section>
  );
}