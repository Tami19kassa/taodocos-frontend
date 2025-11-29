import { useState, useEffect } from 'react';
import { Send, User, MessageCircle, Heart, Smile, MoreHorizontal, Reply, CornerDownRight, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

const EMOJIS = ['🔥', '❤️', '🙌', '🙏', '👏', '🤔', '😢', '😍'];

export default function CommentSection({ lessonId, jwt, user }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  
  // Interaction State
  const [likedComments, setLikedComments] = useState(new Set());
  const [replyingTo, setReplyingTo] = useState(null);

  // 1. LOAD DATA & SAVED LIKES
  useEffect(() => {
    // Load Comments
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

    // Load Saved Likes from Local Storage
    const savedLikes = localStorage.getItem(`likes_${lessonId}`);
    if (savedLikes) {
      setLikedComments(new Set(JSON.parse(savedLikes)));
    }

    fetchComments();
  }, [lessonId, jwt]);

  // 2. HANDLE POSTING (Shared Logic)
  const postToStrapi = async (contentStr) => {
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
            content: contentStr,
            lesson: lessonId,
            user: user.id
          }
        })
      });
      
      const saved = await res.json();
      
      // Create new entry for UI
      const newEntry = {
        id: saved.data?.id || Date.now(),
        attributes: {
          content: contentStr,
          createdAt: new Date().toISOString(),
          user: { data: { attributes: { username: user.username } } }
        },
        // Fallback for V5 structure
        content: contentStr,
        user: { username: user.username },
        createdAt: new Date().toISOString()
      };

      setComments([newEntry, ...comments]); // Add to top of list
      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }

  // 3. HANDLERS
  const handleMainSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const success = await postToStrapi(newComment);
    if (success) {
      setNewComment('');
      setShowEmoji(false);
    }
  };

  const handleReplySubmit = async (e, parentAuthor) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    
    // Format reply: "@Username message"
    const text = `@${parentAuthor} ${replyContent}`;
    const success = await postToStrapi(text);
    
    if (success) {
      setReplyContent('');
      setReplyingTo(null); // Close reply box
    }
  };

  const toggleLike = (id) => {
    const newLikes = new Set(likedComments);
    if (newLikes.has(id)) newLikes.delete(id);
    else newLikes.add(id);
    
    setLikedComments(newLikes);
    // Save to Browser Storage so it remembers on reload
    localStorage.setItem(`likes_${lessonId}`, JSON.stringify([...newLikes]));
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

      {/* --- MAIN INPUT --- */}
      <div className="flex gap-4 mb-12">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-600 to-purple-600 flex items-center justify-center shrink-0 shadow-lg border border-white/10">
          <span className="font-bold text-white text-sm">{user.username.charAt(0).toUpperCase()}</span>
        </div>
        
        <div className="flex-1">
          <form onSubmit={handleMainSubmit} className="relative group">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Join the discussion..."
              className="w-full bg-[#0B0C15] border border-white/10 rounded-2xl p-4 text-slate-200 focus:border-cyan-500/50 focus:bg-[#11121f] focus:outline-none transition-all min-h-[100px] resize-none placeholder-slate-600 shadow-inner"
            />
            
            {/* Emoji Toolbar */}
            <div className="absolute bottom-3 left-3 flex gap-2">
              <div className="relative">
                <button 
                  type="button"
                  onClick={() => setShowEmoji(!showEmoji)}
                  className="p-2 text-slate-500 hover:text-cyan-400 hover:bg-white/5 rounded-full transition-colors"
                >
                  <Smile size={18} />
                </button>
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
                          onClick={() => setNewComment(prev => prev + emoji)}
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
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-slate-200 text-sm">{author}</span>
                  <span className="text-[10px] text-slate-600">• {date}</span>
                </div>
                
                <p className="text-slate-300 text-sm leading-relaxed mb-3 whitespace-pre-wrap">
                  {content}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-6 mb-2">
                  <button 
                    onClick={() => toggleLike(id)}
                    className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${isLiked ? 'text-pink-500' : 'text-slate-500 hover:text-pink-400'}`}
                  >
                    <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
                    {isLiked ? 1 : 0}
                  </button>
                  
                  <button 
                    onClick={() => {
                        setReplyingTo(replyingTo === id ? null : id);
                        setReplyContent(''); // Clear prev reply
                    }}
                    className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-cyan-400 transition-colors"
                  >
                    <Reply size={14} /> Reply
                  </button>
                </div>

                {/* --- REPLY INPUT (Accordion) --- */}
                <AnimatePresence>
                  {replyingTo === id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: 'auto', opacity: 1 }} 
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <form 
                        onSubmit={(e) => handleReplySubmit(e, author)}
                        className="flex gap-3 ml-2 pt-2"
                      >
                        <CornerDownRight className="text-white/20 mt-3 shrink-0" size={16} />
                        
                        <div className="flex-1 relative">
                          <input 
                            autoFocus
                            type="text" 
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder={`Replying to ${author}...`}
                            className="w-full bg-[#161726] border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:border-cyan-500/50 outline-none"
                          />
                          <button 
                            disabled={!replyContent.trim()}
                            className="absolute right-2 top-2 bg-cyan-600 hover:bg-cyan-500 text-white p-1.5 rounded-lg transition-colors disabled:opacity-0"
                          >
                            <ArrowUpRight size={16} />
                          </button>
                        </div>
                      </form>
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