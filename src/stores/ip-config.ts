import { create } from "zustand";
import {
  getCurrentIP,
} from "@/services/ip";
import type {
  CurrentIPResponse,
} from "@/services/ip/typing";

interface IPConfigState {
  // Current IP State
  currentIP: CurrentIPResponse | null;
  
  // Error State
  error: string | null;
  // Current IP Actions
  fetchCurrentIP: () => Promise<void>;
  
  // Utility Actions
  clearError: () => void;
}

export const useIPConfigStore = create<IPConfigState>()((set) => ({

  currentIP: null,
  error: null,

  // Current IP Actions
  fetchCurrentIP: async () => {
    try {
      const response = await getCurrentIP();
      set({ currentIP: response });
    } catch (error) {
      console.error("Failed to fetch current IP:", error);
    }
  },

  // Utility Actions
  clearError: () => set({ error: null }),
}));
