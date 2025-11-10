
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Post, Comment } from '../types';
import { api } from '../services/mockApi';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Textarea from '../components/Textarea';
import { User, PenSquare, Trash2 } from '../components/Icons';
import { Remarkable } from 'remarkable';

const md = new Remarkable({ html: true });

const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => (
  <div className="p-4 border-t border-slate-200 dark:border-slate-700">
    <div className="flex items-center mb-2">
      <User className="w-5 h-5 mr-2 text-slate-500" />
      <Link to={`/profile/${comment.authorId}`} className="font-semibold hover:underline">
        {comment.authorUsername}
      </Link>
      <span className="text-xs text-slate-500 dark:text-slate-400 ml-auto">
        {new Date(comment.createdAt).toLocaleString()}
      </span>
    </div>
    <p className="text-slate-700 dark:text-slate-300">{comment.text}</p>
  </div>
);

const PostPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [commenting, setCommenting] = useState(false);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const fetchPostAndComments = useCallback(async () => {
    if (!postId) return;
    try {
      setLoading(true);
      const fetchedPost = await api.getPostById(postId);
      const fetchedComments = await api.getCommentsByPostId(postId);
      setPost(fetchedPost);
      setComments(fetchedComments);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchPostAndComments();
  }, [fetchPostAndComments]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser || !postId) return;
    setCommenting(true);
    try {
      await api.addComment(newComment, postId, currentUser);
      setNewComment('');
      fetchPostAndComments(); // Refresh comments
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setCommenting(false);
    }
  };

  const handleDeletePost = async () => {
    if (!postId || !window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.deletePost(postId);
      navigate('/');
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading post...</div>;
  }

  if (!post) {
    return <div className="text-center py-10">Post not found.</div>;
  }

  const renderedContent = md.render(post.content);

  return (
    <div className="max-w-4xl mx-auto">
      {post.coverImage && (
        <div className="mb-8 overflow-hidden rounded-lg shadow-lg">
          <img src={post.coverImage} alt={post.title} className="w-full h-auto max-h-[500px] object-cover" />
        </div>
      )}
      <article className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 md:p-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{post.title}</h1>
        <div className="flex items-center text-slate-500 dark:text-slate-400 mb-6">
          <User className="w-5 h-5 mr-2" />
          By <Link to={`/profile/${post.authorId}`} className="font-semibold ml-1 hover:underline">{post.authorUsername}</Link>
          <span className="mx-2">•</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          {currentUser?.id === post.authorId && (
            <div className="ml-auto flex items-center space-x-4">
              <Link to={`/edit-post/${post.id}`} className="flex items-center text-sm hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
                <PenSquare className="w-4 h-4 mr-1" /> Edit
              </Link>
              <button onClick={handleDeletePost} className="flex items-center text-sm text-red-500 hover:text-red-700 transition-colors">
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </button>
            </div>
          )}
        </div>
        <div 
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: renderedContent }}
        />
      </article>

      <section className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 md:p-8 mt-8">
        <h3 className="text-2xl font-bold mb-4">Comments ({comments.length})</h3>
        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map(comment => <CommentItem key={comment.id} comment={comment} />)
          ) : (
            <p className="text-slate-500 dark:text-slate-400">No comments yet.</p>
          )}
        </div>
        {currentUser ? (
          <form onSubmit={handleCommentSubmit} className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-6">
            <h4 className="font-semibold mb-2">Leave a comment</h4>
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment..."
              rows={4}
              required
            />
            <Button type="submit" isLoading={commenting} className="mt-2">
              Post Comment
            </Button>
          </form>
        ) : (
          <p className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-6 text-center">
            <Link to="/login" className="text-slate-800 dark:text-slate-200 font-semibold hover:underline">Log in</Link> to leave a comment.
          </p>
        )}
      </section>
    </div>
  );
};

export default PostPage;