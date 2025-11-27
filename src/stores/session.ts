import { create } from "zustand";
import { mySession } from "@/services/session";
import type { Session } from "@/services/session/typing";

interface SessionState {
    session: Session[] | null;
    isLoading: boolean;
    error: string | null;

    fetchMySession: (token: string) => Promise<void>;
}

export const useSessionStore = create<SessionState>((set) => ({
    session: [],
    isLoading: false,
    error: null,

    fetchMySession: async (token: string) => {
        if (!token) {
            set({ error: "No token provided" });
            return;
        }
        set({ isLoading: true, error: null });

        try {
            const data = await mySession(token);
            set({ session: data, isLoading: false });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to fetch sessions";
            set({ error: message, isLoading: false });
        }
    },

    clearError: () => set({ error: null }),
}));