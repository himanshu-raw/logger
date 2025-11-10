import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, Post } from '../types';
import { api } from '../services/mockApi';

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const [fetchedUser, fetchedPosts] = await Promise.all([
          api.getUserById(userId),
          api.getPostsByUserId(userId),
        ]);
        setUser(fetchedUser);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [userId]);

  if (loading) {
    return <div className="text-center py-10">Loading profile...</div>;
  }

  if (!user) {
    return <div className="text-center py-10">User not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="p-8 bg-white dark:bg-slate-800 rounded-lg shadow-md mb-8">
        <h1 className="text-4xl font-bold">{user.username}</h1>
        <p className="text-slate-500 dark:text-slate-400">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
      </div>
      
      <h2 className="text-3xl font-bold mb-6">Posts by {user.username}</h2>
      {posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map(post => (
            <div key={post.id} className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-2">
                <Link to={`/post/${post.id}`} className="text-slate-800 dark:text-slate-200 hover:underline">
                  {post.title}
                </Link>
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Posted on {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-slate-500 dark:text-slate-400 p-8 bg-white dark:bg-slate-800 rounded-lg shadow-md">
          {user.username} hasn't written any posts yet.
        </p>
      )}
    </div>
  );
};

export default ProfilePage;