import { create } from "zustand";
import { mySchedules } from "@/services/schedules";
import type { Schedule } from "@/services/schedules/typing";

interface ScheduleState {
    schedules: Schedule[];
    isLoading: boolean;
    error: string | null;

    fetchSchedules: (token: string) => Promise<void>;
}

export const useScheduleStore = create<ScheduleState>((set) => ({
  schedules: [],
  isLoading: false,
  error: null,

  fetchSchedules: async (token: string) => {
    set({ isLoading: true, error: null });
    try {
      const schedules = await mySchedules(token);
      set({ schedules, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
