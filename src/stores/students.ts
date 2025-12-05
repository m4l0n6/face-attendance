import { create } from "zustand";
import { getStudentByClassID } from "@/services/students";
import type { Student, PaginationMeta } from "@/services/students/typing";
import { toast } from "sonner";
import { useAuthStore } from "./auth";

interface StudentStore {
  studentsByClassId: Student[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  searchQuery: string;
  selectedClassId: string | null;

  fetchStudentsByClassId: (classId: string) => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSearchQuery: (query: string) => void;
  setSelectedClass: (classId: string | null) => void;
}

export const useStudentStore = create<StudentStore>((set) => ({
    studentsByClassId: [],
    pagination: null,
    isLoading: false,
    error: null,
    currentPage: 1,
    pageSize: 10,
    searchQuery: "",
    selectedClassId: null,

    fetchStudentsByClassId: async (classId: string) => {
        set({ isLoading: true, error: null });
        try {
        const token = useAuthStore.getState().token;
        if (!token) {
            throw new Error("No authentication token found");
        }
        const response = await getStudentByClassID(token, classId);
        set({ 
            studentsByClassId: response.data,
            isLoading: false 
        });
        } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to fetch students by class ID";
        console.error("Fetch students by class ID error:", error);
        set({ error: message, isLoading: false });
        toast.error(message);
        }
    },

    setPage: (page: number) => set({ currentPage: page }),

    setPageSize: (size: number) => set({ pageSize: size }),

    setSearchQuery: (query: string) => set({ searchQuery: query }),

    setSelectedClass: (classId: string | null) => set({ selectedClassId: classId }),

}));
