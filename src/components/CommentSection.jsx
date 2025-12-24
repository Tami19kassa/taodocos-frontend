import { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, ExternalLink, Loader2, Youtube } from 'lucide-react';
import { fetchYouTubeComments } from '@/utils/youtube';

export default function CommentSection({ youtubeVideoId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (youtubeVideoId) {
      setLoading(true);
      setError(false);
      
      fetchYouTubeComments(youtubeVideoId).then(data => {
        if (data) {
          setComments(data);
        } else {
          setError(true); 
        }
        setLoading(false);
      });
    }
  }, [youtubeVideoId]);

  const handleOpenYoutube = () => {
    window.open(`https://www.youtube.com/watch?v=${youtubeVideoId}#comment-section`, '_blank');
  };

  // --- FALLBACK UI (If Error) ---
  if (error) {
    return (
        <div className="bg-gradient-to-br from-[#1a0f0a] to-[#25150e] rounded-xl p-6 border border-white/10 text-center shadow-2xl relative overflow-hidden group/card mt-2">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/10 rounded-full blur-3xl group-hover/card:bg-amber-600/20 transition-all" />
            <MessageSquare className="w-10 h-10 text-stone-500 mx-auto mb-3" />
            <h4 className="text-stone-200 font-bold text-base mb-2">Join the Conversation</h4>
            <p className="text-stone-400 text-xs mb-4 max-w-sm mx-auto">
                View and post comments directly on our YouTube channel.
            </p>
            <button onClick={handleOpenYoutube} className="inline-flex items-center gap-2 bg-[#ff0000] hover:bg-[#d90000] text-white px-5 py-2.5 rounded-full font-bold text-xs transition-transform hover:scale-105 shadow-lg shadow-red-900/30">
                <Youtube size={16} fill="white" /> Open YouTube Comments
            </button>
        </div>
    );
  }

  return (
    <div className="bg-[#120a05] text-stone-300 px-2">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-stone-200 uppercase tracking-widest flex items-center gap-2">
           <Youtube size={16} className="text-[#ff0000]" />
           Comments ({comments.length})
        </h3>
        
        <button 
          onClick={handleOpenYoutube}
          className="flex items-center gap-2 text-[10px] font-bold text-stone-400 hover:text-white border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/5 transition-colors"
        >
          <span>Add Comment</span>
          <ExternalLink size={10} />
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-amber-500" size={24} />
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-6 pb-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 items-start group animate-in slide-in-from-bottom-2 duration-500">
              {/* Avatar */}
              <img 
                src={comment.avatar} 
                alt={comment.author}
                className="w-8 h-8 rounded-full border border-white/10"
                onError={(e) => {e.target.src = "https://ui-avatars.com/api/?background=333&color=fff"}} 
              />
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-200">{comment.author}</span>
                  <span className="text-[10px] text-stone-600">
                    {new Date(comment.publishedAt).toLocaleDateString()}
                  </span>
                </div>
                
                <p className="text-sm text-stone-400 leading-relaxed font-serif" 
                   dangerouslySetInnerHTML={{ __html: comment.text }} 
                />
                
                <div className="flex items-center gap-4 pt-1">
                  <button className="flex items-center gap-1 text-[10px] text-stone-600 hover:text-amber-500 transition-colors">
                    <ThumbsUp size={12} /> {comment.likes}
                  </button>
                  <button onClick={handleOpenYoutube} className="text-[10px] text-stone-600 hover:text-stone-300 font-bold">
                    Reply on YouTube
                  </button>
                </div>
              </div>
            </div>
          ))}
          {/* Button Removed Here */}
        </div>
      ) : (
        <div className="text-center py-8 text-stone-500 text-sm">
            No comments yet. Be the first to post on YouTube!
        </div>
      )}
    </div>
  );
}