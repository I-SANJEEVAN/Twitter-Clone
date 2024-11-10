import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-hot-toast';

export const TweetForm: React.FC = () => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await addDoc(collection(db, 'tweets'), {
        content,
        username: user?.username,
        userId: user?.uid,
        createdAt: new Date().toISOString(),
        likes: [],
        retweets: [],
        comments: []
      });
      setContent('');
      toast.success('Tweet posted!');
    } catch (error) {
      toast.error('Failed to post tweet');
      console.error('Error posting tweet:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-b border-gray-200 p-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's happening?"
        className="w-full h-24 resize-none border-none focus:ring-0 text-lg placeholder-gray-500"
        maxLength={280}
        disabled={isSubmitting}
      />
      <div className="flex items-center justify-between pt-2">
        <div className="text-sm text-gray-500">
          {content.length}/280
        </div>
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="bg-blue-500 text-white px-4 py-2 rounded-full font-bold hover:bg-blue-600 disabled:opacity-50 flex items-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Posting...</span>
            </>
          ) : (
            'Tweet'
          )}
        </button>
      </div>
    </form>
  );
};