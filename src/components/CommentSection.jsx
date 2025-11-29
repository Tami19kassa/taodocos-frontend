import { useState, useEffect } from 'react';
import { Send, User, MessageCircle, Heart, Smile, MoreHorizontal, Reply } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

const EMOJIS = ['🔥', '❤️', '🙌', '🙏', '👏', '🤔', '😢', '😍'];

export default function CommentSection({ lessonId, jwt, user }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  
  // Local interaction state (Visual only)
  const [likedComments, setLikedComments] = useState(new Set());
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`${STRAPI_URL}/api/comments?filters[lesson][id][$eq]=${lessonId}&populate=user&sort=createdAt:desc`, {
          headers: { Authorization: `Bearer ${jwt}` }
        });
        const data = await res.json();
        setComments(data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchComments();
  }, [lessonId, jwt]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(`${STRAPI_URL}/api/comments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}` 
        },
        body: JSON.stringify({
          data: {
            content: newComment,
            lesson: lessonId,
            user: user.id
          }
        })
      });
      
      const saved = await res.json();
      
      // Optimistic UI Update
      const newEntry = {
        id: saved.data?.id || Date.now(),
        attributes: {
          content: newComment,
          createdAt: new Date().toISOString(),
          user: { data: { attributes: { username: user.username } } }
        },
        // Handle V5 Flat structure
        content: newComment,
        user: { username: user.username },
        createdAt: new Date().toISOString()
      };

      setComments([newEntry, ...comments]);
      setNewComment('');
      setShowEmoji(false);
    } catch (err) {
      alert("Failed to post.");
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = (id) => {
    const newLikes = new Set(likedComments);
    if (newLikes.has(id)) newLikes.delete(id);
    else newLikes.add(id);
    setLikedComments(newLikes);
  };

  const addEmoji = (emoji) => {
    setNewComment(prev => prev + emoji);
  };

  return (
    <div className="mt-12 max-w-4xl">
      <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-900/20 rounded-lg text-cyan-400">
            <MessageCircle size={20} />
          </div>
          <h3 className="font-cinzel text-xl text-white">Discussion</h3>
          <span className="bg-white/10 px-2 py-0.5 rounded text-xs text-slate-400 font-mono">{comments.length}</span>
        </div>
      </div>

      {/* --- INPUT AREA --- */}
      <div className="flex gap-4 mb-12">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-600 to-purple-600 flex items-center justify-center shrink-0 shadow-lg">
          <span className="font-bold text-white text-sm">{user.username.charAt(0).toUpperCase()}</span>
        </div>
        
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="relative group">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Join the discussion..."
              className="w-full bg-[#0B0C15] border border-white/10 rounded-2xl p-4 text-slate-200 focus:border-cyan-500/50 focus:bg-[#11121f] focus:outline-none transition-all min-h-[100px] resize-none placeholder-slate-600 shadow-inner"
            />
            
            {/* Toolbar */}
            <div className="absolute bottom-3 left-3 flex gap-2">
              <div className="relative">
                <button 
                  type="button"
                  onClick={() => setShowEmoji(!showEmoji)}
                  className="p-2 text-slate-500 hover:text-cyan-400 hover:bg-white/5 rounded-full transition-colors"
                >
                  <Smile size={18} />
                </button>
                
                {/* Emoji Popover */}
                <AnimatePresence>
                  {showEmoji && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      className="absolute top-10 left-0 bg-[#1a1b26] border border-white/10 p-2 rounded-xl shadow-2xl z-50 flex gap-1"
                    >
                      {EMOJIS.map(emoji => (
                        <button 
                          key={emoji} 
                          type="button" 
                          onClick={() => addEmoji(emoji)}
                          className="hover:bg-white/10 p-1.5 rounded-lg transition-colors text-lg"
                        >
                          {emoji}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <button 
              disabled={loading || !newComment.trim()}
              className="absolute bottom-3 right-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-500 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
            >
              Post <Send size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* --- COMMENT LIST --- */}
      <div className="space-y-8">
        {comments.map((comment) => {
          // Normalize Data (V4 vs V5)
          const content = comment.content || comment.attributes?.content;
          const author = comment.user?.username || comment.attributes?.user?.data?.attributes?.username || "Student";
          const rawDate = comment.createdAt || comment.attributes?.createdAt;
          const date = new Date(rawDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
          const id = comment.id;
          const isLiked = likedComments.has(id);

          return (
            <motion.div 
              key={id} 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 group"
            >
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-white/5 text-slate-400 shrink-0">
                {author.charAt(0).toUpperCase()}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200 text-sm">{author}</span>
                    <span className="text-[10px] text-slate-600">• {date}</span>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-white transition-opacity">
                    <MoreHorizontal size={14} />
                  </button>
                </div>
                
                <p className="text-slate-300 text-sm leading-relaxed mb-3 whitespace-pre-wrap">
                  {content}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => toggleLike(id)}
                    className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${isLiked ? 'text-pink-500' : 'text-slate-500 hover:text-pink-400'}`}
                  >
                    <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
                    {isLiked ? 1 : 0}
                  </button>
                  
                  <button 
                    onClick={() => setReplyingTo(replyingTo === id ? null : id)}
                    className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-cyan-400 transition-colors"
                  >
                    <Reply size={14} /> Reply
                  </button>
                </div>

                {/* Reply Input (Visual Only) */}
                <AnimatePresence>
                  {replyingTo === id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 flex gap-3 pl-4 border-l-2 border-white/5">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-xs">
                          {user.username.charAt(0)}
                        </div>
                        <div className="flex-1 relative">
                          <input 
                            type="text" 
                            placeholder={`Reply to ${author}...`}
                            className="w-full bg-[#0B0C15] border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:border-cyan-500/50 outline-none"
                          />
                          <p className="text-[10px] text-slate-600 mt-1 italic">* Replies require database update to save.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}