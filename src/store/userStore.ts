import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserInfo } from '@/types/login';

interface UserState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  setUserState: (user: UserInfo | null, isAuthenticated: boolean) => void;
  clear: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    set => ({
      user: null,
      isAuthenticated: false,
      setUserState: (user, isAuthenticated) => set({ user, isAuthenticated }),
      clear: () => {
        set({ user: null, isAuthenticated: false });
        localStorage.removeItem('user-storage');
      },
    }),
    {
      name: 'user-storage',
      partialize: state => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
