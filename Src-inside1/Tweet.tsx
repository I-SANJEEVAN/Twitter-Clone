import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { HeartIcon, ChatBubbleLeftIcon, ArrowPathRoundedSquareIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { db } from '../lib/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuthStore } from '../store/authStore';

interface TweetProps {
  id: string;
  content: string;
  username: string;
  createdAt: string;
  likes: string[];
  retweets: string[];
  comments: any[];
}

export const Tweet: React.FC<TweetProps> = ({ 
  id, 
  content, 
  username, 
  createdAt, 
  likes, 
  retweets, 
  comments 
}) => {
  const { user } = useAuthStore();
  const isLiked = likes.includes(user?.uid);
  const isRetweeted = retweets.includes(user?.uid);

  const handleLike = async () => {
    const tweetRef = doc(db, 'tweets', id);
    await updateDoc(tweetRef, {
      likes: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid)
    });
  };

  const handleRetweet = async () => {
    const tweetRef = doc(db, 'tweets', id);
    await updateDoc(tweetRef, {
      retweets: isRetweeted ? arrayRemove(user.uid) : arrayUnion(user.uid)
    });
  };

  return (
    <div className="border-b border-gray-200 p-4 hover:bg-gray-50">
      <div className="flex space-x-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-bold">{username}</span>
            <span className="text-gray-500 text-sm">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="mt-2 text-gray-900">{content}</p>
          <div className="mt-3 flex items-center space-x-8">
            <button 
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-500"
              onClick={() => {}}
            >
              <ChatBubbleLeftIcon className="h-5 w-5" />
              <span>{comments.length}</span>
            </button>
            <button 
              className={`flex items-center space-x-2 ${
                isRetweeted ? 'text-green-500' : 'text-gray-500 hover:text-green-500'
              }`}
              onClick={handleRetweet}
            >
              <ArrowPathRoundedSquareIcon className="h-5 w-5" />
              <span>{retweets.length}</span>
            </button>
            <button 
              className={`flex items-center space-x-2 ${
                isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
              onClick={handleLike}
            >
              {isLiked ? (
                <HeartIconSolid className="h-5 w-5" />
              ) : (
                <HeartIcon className="h-5 w-5" />
              )}
              <span>{likes.length}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};