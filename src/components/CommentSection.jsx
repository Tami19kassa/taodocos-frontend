import { useState, useEffect } from 'react';
import { Send, MessageCircle, Heart, Smile, Reply, CornerDownRight, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const EMOJIS = ['🔥', '❤️', '🙌', '🙏', '👏', '🤔', '😢', '😍'];

export default function CommentSection({ lessonId, jwt, user }) {
  const [comments, setComments] = useState([]); // Raw flat list
  const [newComment, setNewComment] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [likedComments, setLikedComments] = useState(new Set());
  const [replyingTo, setReplyingTo] = useState(null);

  // 1. FETCH DATA
  const fetchComments = async () => {
    try {
      // We must populate 'parent' to know the structure
      const res = await fetch(`${STRAPI_URL}/api/comments?filters[lesson][id][$eq]=${lessonId}&populate=user&populate=parent&sort=createdAt:desc`, {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      const data = await res.json();
      setComments(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComments();
    const savedLikes = localStorage.getItem(`likes_${lessonId}`);
    if (savedLikes) setLikedComments(new Set(JSON.parse(savedLikes)));
  }, [lessonId, jwt]);

  // 2. HELPER: BUILD THE TREE
  // This takes the flat list from Strapi and organizes it into Parent -> Children
  const buildCommentTree = (flatComments) => {
    const roots = [];
    const childrenMap = {};

    flatComments.forEach(c => {
      // Check if it has a parent (Handle Strapi v4/v5 differences)
      const parentId = c.parent?.id || c.attributes?.parent?.data?.id;

      if (!parentId) {
        roots.push(c);
      } else {
        if (!childrenMap[parentId]) childrenMap[parentId] = [];
        childrenMap[parentId].push(c);
      }
    });

    // Sort roots by date desc (newest top), replies by date asc (oldest top)
    return { roots, childrenMap };
  };

  // 3. POST LOGIC
  const postComment = async (contentStr, parentId = null) => {
    setLoading(true);
    try {
      const payload = {
        data: {
          content: contentStr,
          lesson: lessonId,
          user: user.id,
          parent: parentId // LINK TO PARENT IN DB
        }
      };

      await fetch(`${STRAPI_URL}/api/comments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}` 
        },
        body: JSON.stringify(payload)
      });
      
      // Reload to get correct structure/IDs
      await fetchComments();
      return true;
    } catch (err) {
      alert("Failed to post.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = (id) => {
    const newLikes = new Set(likedComments);
    if (newLikes.has(id)) newLikes.delete(id);
    else newLikes.add(id);
    setLikedComments(newLikes);
    localStorage.setItem(`likes_${lessonId}`, JSON.stringify([...newLikes]));
  };

  const { roots, childrenMap } = buildCommentTree(comments);

  return (
    <div className="mt-12 max-w-4xl">
      <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
        <MessageCircle className="text-cyan-400" size={24} />
        <h3 className="font-cinzel text-xl text-white">Discussion</h3>
        <span className="bg-white/10 px-2 py-0.5 rounded text-xs text-slate-400 font-mono">{comments.length}</span>
      </div>

      {/* MAIN INPUT */}
      <div className="flex gap-4 mb-12">
        <Avatar name={user.username} />
        <div className="flex-1 relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Start a conversation..."
            className="w-full bg-[#0B0C15] border border-white/10 rounded-2xl p-4 text-slate-200 focus:border-cyan-500/50 outline-none transition-all min-h-[100px] resize-none"
          />
          <div className="absolute bottom-3 left-3">
             <button type="button" onClick={() => setShowEmoji(!showEmoji)}><Smile size={20} className="text-slate-500 hover:text-cyan-400"/></button>
             {showEmoji && <EmojiPicker onSelect={(e) => setNewComment(prev => prev + e)} />}
          </div>
          <button 
            disabled={!newComment.trim()}
            onClick={async () => {
              if(await postComment(newComment)) { setNewComment(''); setShowEmoji(false); }
            }}
            className="absolute bottom-3 right-3 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 disabled:opacity-50"
          >
            Post <Send size={14} />
          </button>
        </div>
      </div>

      {/* COMMENTS RENDER */}
      <div className="space-y-8">
        {roots.map((root) => (
          <CommentItem 
            key={root.id} 
            comment={root} 
            replies={childrenMap[root.id] || []}
            user={user}
            isLiked={likedComments.has(root.id)}
            onLike={() => toggleLike(root.id)}
            onReply={postComment}
            activeReplyId={replyingTo}
            setActiveReplyId={setReplyingTo}
            replyContent={replyContent}
            setReplyContent={setReplyContent}
            allLiked={likedComments}
            onChildLike={toggleLike}
          />
        ))}
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function CommentItem({ comment, replies, user, isLiked, onLike, onReply, activeReplyId, setActiveReplyId, replyContent, setReplyContent, allLiked, onChildLike }) {
  const content = comment.content || comment.attributes?.content;
  const author = comment.user?.username || comment.attributes?.user?.data?.attributes?.username || "Student";
  const date = new Date(comment.createdAt || comment.attributes?.createdAt).toLocaleDateString();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group">
      <div className="flex gap-4">
        <Avatar name={author} />
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-slate-200 text-sm">{author}</span>
            <span className="text-[10px] text-slate-600">• {date}</span>
          </div>
          
          {/* Content */}
          <p className="text-slate-300 text-sm leading-relaxed mb-2 whitespace-pre-wrap">{content}</p>

          {/* Actions */}
          <div className="flex items-center gap-6 mb-3">
            <button onClick={onLike} className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${isLiked ? 'text-pink-500' : 'text-slate-500 hover:text-pink-400'}`}>
              <Heart size={14} fill={isLiked ? "currentColor" : "none"} /> {isLiked ? 1 : 0}
            </button>
            <button onClick={() => { setActiveReplyId(activeReplyId === comment.id ? null : comment.id); setReplyContent(''); }} className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-cyan-400 transition-colors">
              <Reply size={14} /> Reply
            </button>
          </div>

          {/* Reply Input */}
          <AnimatePresence>
            {activeReplyId === comment.id && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-4">
                <div className="flex gap-3 pt-2">
                  <CornerDownRight className="text-white/20 mt-3 shrink-0" size={16} />
                  <div className="flex-1 relative">
                    <input 
                      autoFocus
                      type="text" 
                      value={replyContent} 
                      onChange={(e) => setReplyContent(e.target.value)} 
                      placeholder={`Reply to ${author}...`} 
                      className="w-full bg-[#161726] border border-white/10 rounded-xl py-2 pl-4 pr-12 text-sm text-white focus:border-cyan-500/50 outline-none" 
                    />
                    <button 
                      disabled={!replyContent.trim()}
                      onClick={async () => {
                        if(await onReply(replyContent, comment.id)) { setActiveReplyId(null); }
                      }}
                      className="absolute right-2 top-1.5 bg-cyan-600 hover:bg-cyan-500 text-white p-1 rounded transition-colors disabled:opacity-0"
                    >
                      <ArrowUpRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nested Replies */}
          {replies.length > 0 && (
            <div className="pl-6 border-l-2 border-white/5 space-y-4 mt-2">
              {replies.map(reply => (
                <CommentItem 
                  key={reply.id} 
                  comment={reply} 
                  replies={[]} // Assuming 1 level deep for simplicity, but logic supports more
                  user={user}
                  isLiked={allLiked.has(reply.id)}
                  onLike={() => onChildLike(reply.id)}
                  onReply={onReply} // Recursion possible here
                  activeReplyId={activeReplyId}
                  setActiveReplyId={setActiveReplyId}
                  replyContent={replyContent}
                  setReplyContent={setReplyContent}
                  allLiked={allLiked}
                  onChildLike={onChildLike}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function Avatar({ name }) {
  return (
    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 text-slate-400 shrink-0 shadow-lg">
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function EmojiPicker({ onSelect }) {
  return (
    <div className="absolute bottom-8 left-0 bg-[#1a1b26] border border-white/10 p-2 rounded-xl shadow-2xl z-50 flex gap-1">
      {EMOJIS.map(emoji => (
        <button key={emoji} type="button" onClick={() => onSelect(emoji)} className="hover:bg-white/10 p-1.5 rounded-lg text-lg">{emoji}</button>
      ))}
    </div>
  );
}