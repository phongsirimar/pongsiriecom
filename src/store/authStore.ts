'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, LoginCredentials, RegisterData } from '@/types';
import api from '@/lib/api';

interface LocalUser extends RegisterData {
  id: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async ({ username, password }) => {
        set({ isLoading: true });
        try {
          // Check locally registered users first
          const localUsers: LocalUser[] = JSON.parse(
            localStorage.getItem('registered-users') || '[]'
          );
          const found = localUsers.find(
            (u) => u.username === username && u.password === password
          );
          if (found) {
            const user: User = {
              id: found.id,
              username: found.username,
              email: found.email,
              firstName: found.firstName,
              lastName: found.lastName,
              gender: 'other',
              image: `https://ui-avatars.com/api/?name=${found.firstName}+${found.lastName}&background=6366f1&color=fff`,
              accessToken: `local_${Date.now()}`,
              refreshToken: `local_refresh_${Date.now()}`,
            };
            set({ user, token: user.accessToken, isAuthenticated: true, isLoading: false });
            return true;
          }

          // Try DummyJSON API
          const { data } = await api.post('/auth/login', {
            username,
            password,
            expiresInMins: 60,
          });
          const user: User = {
            id: data.id,
            username: data.username,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            gender: data.gender,
            image: data.image,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };
          set({ user, token: data.accessToken, isAuthenticated: true, isLoading: false });
          return true;
        } catch {
          set({ isLoading: false });
          return false;
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const localUsers: LocalUser[] = JSON.parse(
            localStorage.getItem('registered-users') || '[]'
          );
          if (localUsers.some((u) => u.username === data.username || u.email === data.email)) {
            set({ isLoading: false });
            return false;
          }
          const newUser: LocalUser = { id: Date.now(), ...data };
          localStorage.setItem('registered-users', JSON.stringify([...localUsers, newUser]));

          const user: User = {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            gender: 'other',
            image: `https://ui-avatars.com/api/?name=${newUser.firstName}+${newUser.lastName}&background=6366f1&color=fff`,
            accessToken: `local_${Date.now()}`,
            refreshToken: `local_refresh_${Date.now()}`,
          };
          set({ user, token: user.accessToken, isAuthenticated: true, isLoading: false });
          return true;
        } catch {
          set({ isLoading: false });
          return false;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : ({ getItem: () => null, setItem: () => {}, removeItem: () => {} } as unknown as Storage)
      ),
      partialize: (s) => ({ user: s.user, token: s.token, isAuthenticated: s.isAuthenticated }),
    }
  )
);

