import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login, getMe } from '../services/api';
import { toast } from "sonner";
import type { User } from '@/services/user/typing';

interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    validateStoredToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            token: null,
            user: null,
            isLoading: false,
            login: async (email: string, password: string) => {
                set({ isLoading: true });
                try {
                    const response = await login(email, password);
                    set({
                        isAuthenticated: true,
                        token: response.token,
                        user: response.user,
                        isLoading: false,
                    });
                    localStorage.setItem('auth_token', response.token);
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },
            logout: () => {
                localStorage.removeItem('auth_token');
                set({ 
                    isAuthenticated: false, 
                    token: null, 
                    user: null 
                });
            },
            validateStoredToken: async () => {
                const token = get().token || localStorage.getItem('auth_token');
                if (!token) {
                    set({ isAuthenticated: false, token: null, user: null });
                    return;
                }

                set({ isLoading: true });
                try {
                    const user = await getMe(token);
                    set({
                        isAuthenticated: true,
                        token,
                        user,
                        isLoading: false,
                    });
                } catch (error) {
                    toast.error('Lỗi xác thực. Vui lòng đăng nhập lại.');
                    localStorage.removeItem('auth_token');
                    set({ 
                        isAuthenticated: false, 
                        token: null, 
                        user: null,
                        isLoading: false 
                    });
                }
            },
        }),
        {
            name: 'auth-store',
            partialize: (state) => ({
                token: state.token,
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);