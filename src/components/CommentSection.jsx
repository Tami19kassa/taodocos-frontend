import { useState, useEffect } from 'react';
import { Send, User, MessageSquare } from 'lucide-react';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export default function CommentSection({ lessonId, jwt, user }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch comments when lesson changes
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
      
      const savedComment = await res.json();
      
      // Optimistic UI Update (Add to list immediately)
      const newEntry = {
        id: savedComment.data.id,
        attributes: {
          content: newComment,
          createdAt: new Date().toISOString(),
          user: { data: { attributes: { username: user.username } } }
        }
        // Handle Strapi v5 flat structure if necessary
        // ...savedComment.data 
      };

      // Re-fetch is safer for data structure consistency
      const reloadRes = await fetch(`${STRAPI_URL}/api/comments?filters[lesson][id][$eq]=${lessonId}&populate=user&sort=createdAt:desc`, {
          headers: { Authorization: `Bearer ${jwt}` }
      });
      const reloadData = await reloadRes.json();
      setComments(reloadData.data || []);
      
      setNewComment('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare className="text-cyan-400" size={24} />
        <h3 className="font-cinzel text-2xl text-white">Discussion</h3>
        <span className="text-slate-500 text-sm">{comments.length} comments</span>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mb-10 flex gap-4">
        <div className="w-10 h-10 rounded-full bg-cyan-900/30 flex items-center justify-center border border-cyan-500/20 shrink-0">
          <User size={18} className="text-cyan-400" />
        </div>
        <div className="flex-1 relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Ask a question or share your thoughts..."
            className="w-full bg-[#11121f] border border-white/10 rounded-xl p-4 text-slate-200 focus:border-cyan-500 focus:outline-none transition-all min-h-[100px] resize-none"
          />
          <button 
            disabled={loading}
            className="absolute bottom-4 right-4 bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </form>

      {/* Comment List */}
      <div className="space-y-6">
        {comments.map((comment) => {
          // Handle Strapi v4 vs v5 structure differences safely
          const content = comment.content || comment.attributes?.content;
          const author = comment.user?.username || comment.attributes?.user?.data?.attributes?.username || "Student";
          const date = new Date(comment.createdAt || comment.attributes?.createdAt).toLocaleDateString();

          return (
            <div key={comment.id} className="flex gap-4 group">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-white/5 text-slate-400">
                {author.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-bold text-slate-200 text-sm">{author}</span>
                  <span className="text-xs text-slate-600">{date}</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{content}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}