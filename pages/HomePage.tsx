
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { api } from '../services/mockApi';
import { User } from '../components/Icons';

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const contentSnippet = post.content.substring(0, 150) + '...';
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
      {post.coverImage && (
        <Link to={`/post/${post.id}`}>
          <img src={post.coverImage} alt={post.title} className="w-full h-48 object-cover" />
        </Link>
      )}
      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-2xl font-bold mb-2">
          <Link to={`/post/${post.id}`} className="text-slate-800 dark:text-slate-200 hover:underline">
            {post.title}
          </Link>
        </h2>
        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-4">
          <User className="w-4 h-4 mr-2" />
          <Link to={`/profile/${post.authorId}`} className="hover:underline">
            {post.authorUsername}
          </Link>
          <span className="mx-2">•</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <p className="text-slate-600 dark:text-slate-300 flex-grow">{contentSnippet}</p>
        <Link to={`/post/${post.id}`} className="inline-block mt-4 text-slate-700 dark:text-slate-300 font-semibold hover:translate-x-1 transition-transform self-start">
          Read more &rarr;
        </Link>
      </div>
    </div>
  );
};


const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await api.getPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="w-8 h-8 border-4 border-slate-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-2">Loading posts...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-8 text-center tracking-tight">Latest Posts</h1>
      {posts.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-slate-500 dark:text-slate-400">No posts yet. Be the first to write one!</p>
      )}
    </div>
  );
};

export default HomePage;