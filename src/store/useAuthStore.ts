import { create } from 'zustand';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';

interface User {
  uid: string;
  telegramId?: string;
  username: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  photoUrl?: string;
  phoneNumber?: string;
  phone?: string;
  createdAt?: string;
  role: 'super_admin' | 'admin' | 'user';
  usdtBalance: number;
  vaBalance: number;
  currentLevel: number;
  totalEarned: number;
  referralCount: number;
  dailyAdsWatched?: number;
  currentAdCount?: number;
  adCountdownUntil?: number;
  completedTasks?: number;
  currentStreak?: number;
  watchedAds?: number;
  adCampaignsWatched?: Record<string, { dailyWatched: number, lastDate: string }>;
  claimedAchievements?: string[];
  isVip?: boolean;
  vipExpiry?: number;
  status?: string;
  dailySpins?: number;
  lastSpinDate?: number;
  pushEnabled?: boolean;
  referredBy?: string;
  walletPassword?: string;
  accountPassword?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  initAuth: () => void;
  updateBalances: (usdt: number, va: number) => void;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((setStore, getStore) => ({
  user: null,
  isLoading: true,
  login: (user) => setStore({ user }),
  logout: () => setStore({ user: null }),
  initAuth: () => {
    let userUnsub;
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (userUnsub) {
        userUnsub();
        userUnsub = undefined;
      }
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        userUnsub = onSnapshot(userRef, (snapshot) => {
          if (snapshot.exists()) {
            setStore({ user: snapshot.data() as User, isLoading: false });
          } else {
            setStore({ isLoading: false });
          }
        }, (error) => {
          console.error("SNAPSHOT_ERROR: User fetch error:", error);
          setStore({ user: null, isLoading: false });
        });
      } else {
        setStore({ user: null, isLoading: false });
      }
    });
  },
  updateBalances: (usdt, va) => setStore((state) => {
    if (state.user) {
      updateDoc(doc(db, 'users', state.user.uid), {
        usdtBalance: usdt,
        vaBalance: va
      }).catch(e => console.log("Silent error updating balance", e));
      return { user: { ...state.user, usdtBalance: usdt, vaBalance: va } };
    }
    return state;
  }),
  updateUser: (data) => setStore((state) => {
    if (state.user) {
      return { user: { ...state.user, ...data } };
    }
    return state;
  }),
}));

