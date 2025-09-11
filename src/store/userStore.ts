import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserInfo } from '@/types/login';
import { setToken as setTokenUtil, clearToken as clearTokenUtil } from '@/utils/tokenUtils';

interface UserState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  onLogin: (accessToken: string, refreshToken: string) => void;
  onLoadedUserInfo: (user: UserInfo) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    set => ({
      user: null,
      isAuthenticated: false,
      onLogin: (accessToken, refreshToken) => {
        // 保存token到localStorage
        setTokenUtil(accessToken, refreshToken);
      },
      onLoadedUserInfo: user => {
        // 保存用户信息和认证状态
        set({ user, isAuthenticated: true });
      },
      logout: () => {
        // 清理token
        clearTokenUtil();
        // 清理用户信息和认证状态
        // 清理user-storeage
        localStorage.removeItem('user-storage');
      },
    }),
    {
      name: 'user-storage',
      partialize: state => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
