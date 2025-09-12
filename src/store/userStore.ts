import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserInfo } from '@/types/login';
import { setToken as setTokenUtil, clearToken as clearTokenUtil } from '@/utils/tokenUtils';
import { getUserInfo, logout } from '@/services/auth.api';

interface UserState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  onLogin: (accessToken: string, refreshToken: string) => Promise<void>;
  fetchUserInfo: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    set => ({
      user: null,
      isAuthenticated: false,
      onLogin: async (accessToken, refreshToken) => {
        // 保存token到localStorage
        setTokenUtil(accessToken, refreshToken);
        // 获取用户信息
        const userInfoResponse = await getUserInfo();
        set({ user: userInfoResponse.data, isAuthenticated: true });
      },
      fetchUserInfo: async () => {
        // 获取用户信息
        const userInfoResponse = await getUserInfo();
        set({ user: userInfoResponse.data, isAuthenticated: true });
      },
      logout: async () => {
        await logout();
        // 清理token
        clearTokenUtil();
        // 清理用户信息和认证状态
        set({ user: null, isAuthenticated: false });
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
