import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getAllClasses, getStatisticStudentsInClass } from "@/services/classes/index";
import { useAuthStore } from "./auth";
import type { Classes, StudentStatisticsResponse } from "@/services/classes/typing";

interface ClassState {
    classes: Classes[];
    statistic: StudentStatisticsResponse | null;
    isLoading: boolean;
    error: string | null;
    fetchClasses: () => Promise<void>;
    getStatisticStudentsInClass: (studentID: string, classId: string) => Promise<StudentStatisticsResponse | undefined>;
    clearError: () => void;
}

export const useClassStore = create<ClassState>()(
    persist(
        (set) => ({
            classes: [],
            statistic: null,
            isLoading: false,
            error: null,
            
            fetchClasses: async () => {
                try {
                    set({ isLoading: true, error: null });
                    
                    const token = useAuthStore.getState().token;
                    if (!token) {
                        throw new Error("No authentication token found");
                    }
                    
                    const response = await getAllClasses(token);
                    set({ classes: response, isLoading: false });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : "Failed to fetch classes";
                    set({ error: errorMessage, isLoading: false });
                }
            },

            getStatisticStudentsInClass: async (studentID: string, classId: string) => {
                try {
                    set({ isLoading: true, error: null });
                    const token = useAuthStore.getState().token;
                    if (!token) {
                        throw new Error("No authentication token found");
                    }
                    const response = await getStatisticStudentsInClass(token, studentID, classId);
                    set({ statistic: response, isLoading: false });
                    return response;
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : "Failed to fetch statistics";
                    set({ error: errorMessage, isLoading: false });
                }
            },
            
            clearError: () => set({ error: null }),
        }),
        {
            name: "class-storage",
            partialize: (state) => ({ classes: state.classes }),
        }
    )
)

