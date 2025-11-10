
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/mockApi';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import AiHelper from '../components/AiHelper';
import { UploadCloud, X } from '../components/Icons';

const CreatePostPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setError("Image is too large. Please upload an image smaller than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
        setError('');
      };
      reader.onerror = () => {
        setError("Failed to read the image file.");
      }
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !currentUser) {
      setError('Title and content are required.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const newPost = await api.createPost(title, content, currentUser, coverImage);
      navigate(`/post/${newPost.id}`);
    } catch (err) {
      setError('Failed to create post. Please try again.');
      setIsLoading(false);
    }
  };

  const handleAiGenerated = (generatedTitle: string, generatedContent: string) => {
    setTitle(generatedTitle);
    setContent(generatedContent);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Write a New Post</h1>
      <div className="space-y-6">
        <AiHelper onGenerated={handleAiGenerated} />
        <form onSubmit={handleSubmit} className="p-8 bg-white dark:bg-slate-800 rounded-lg shadow-md space-y-6">
          {error && <p className="text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-md">{error}</p>}
          
          <div>
            <label className="block text-lg font-semibold mb-2">Cover Image (Optional)</label>
            {coverImage ? (
              <div className="relative">
                <img src={coverImage} alt="Cover preview" className="w-full h-64 object-cover rounded-md" />
                <button
                  type="button"
                  onClick={() => setCoverImage(null)}
                  className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/75 transition-colors"
                  aria-label="Remove image"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <label className="flex justify-center w-full h-32 px-4 transition bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-md appearance-none cursor-pointer hover:border-slate-400 dark:hover:border-slate-500 focus:outline-none">
                <span className="flex items-center space-x-2">
                  <UploadCloud className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                  <span className="font-medium text-slate-600 dark:text-slate-400">
                    Drop files to Attach, or <span className="text-slate-800 dark:text-slate-200 underline">browse</span>
                  </span>
                </span>
                <input
                  type="file"
                  name="file_upload"
                  className="hidden"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageChange}
                />
              </label>
            )}
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Max file size: 2MB. Recommended aspect ratio: 16:9.</p>
          </div>

          <div>
            <label htmlFor="title" className="block text-lg font-semibold mb-2">Title</label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Your Post Title"
              required
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-lg font-semibold mb-2">Content (Markdown supported)</label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your story..."
              rows={15}
              required
            />
          </div>
          <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto">
            Publish Post
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;