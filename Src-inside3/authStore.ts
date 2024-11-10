import { create } from 'zustand';
import { auth, db } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface AuthState {
  user: null | (User & { username?: string });
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const initialize = () => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        set({ user: { ...user, username: userData?.username }, loading: false });
      } else {
        set({ user: null, loading: false });
      }
    });

    return () => unsubscribe();
  };

  // Initialize auth state listener
  initialize();

  return {
    user: null,
    loading: true,
    initialize,
    signUp: async (email, password, username) => {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        username,
        email,
        createdAt: new Date().toISOString(),
        followers: [],
        following: []
      });
    },
    signIn: async (email, password) => {
      await signInWithEmailAndPassword(auth, email, password);
    },
    signOut: async () => {
      await firebaseSignOut(auth);
      set({ user: null });
    }
  };
});