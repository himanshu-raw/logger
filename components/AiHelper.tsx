import React, { useState } from 'react';
import { generateBlogPost } from '../services/geminiService';
import Button from './Button';
import { Sparkles } from './Icons';
import Textarea from './Textarea';

interface AiHelperProps {
  onGenerated: (title: string, content: string) => void;
}

const AiHelper: React.FC<AiHelperProps> = ({ onGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a topic for the blog post.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const { title, content } = await generateBlogPost(prompt);
      onGenerated(title, content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-100 dark:bg-slate-800 space-y-3">
      <div className="flex items-center space-x-2">
        <Sparkles className="w-6 h-6 text-slate-600 dark:text-slate-400" />
        <h3 className="text-lg font-semibold">AI Writing Assistant</h3>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Describe the topic of your post, and our AI will generate a draft for you.
      </p>
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., The future of frontend development with React Server Components"
        rows={3}
        disabled={isLoading}
      />
      <Button onClick={handleGenerate} isLoading={isLoading}>
        Generate Content
      </Button>
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default AiHelper;