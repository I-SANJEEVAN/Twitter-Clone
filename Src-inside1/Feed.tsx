import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Tweet } from './Tweet';
import { TweetForm } from './TweetForm';

export const Feed: React.FC = () => {
  const [tweets, setTweets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'tweets'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTweets(
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      );
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <TweetForm />
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : tweets.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No tweets yet. Be the first to tweet!
        </div>
      ) : (
        <div>
          {tweets.map((tweet) => (
            <Tweet key={tweet.id} {...tweet} />
          ))}
        </div>
      )}
    </div>
  );
};