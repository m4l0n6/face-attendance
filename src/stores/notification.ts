import { create } from "zustand";
import { getNotifications } from "@/services/notification";
import type { Notification } from "@/services/notification/typing";
import { toast } from "sonner";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;

  fetchNotifications: (token: string, unreadOnly?: boolean) => Promise<void>;
  markAsRead: (token: string, notificationId: string) => Promise<void>;
  markAllAsRead: (token: string) => Promise<void>;
  clearError: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async (token: string, unreadOnly: boolean = false) => {
    if (!token) {
      set({ error: "No token provided" });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const data = await getNotifications(token, unreadOnly);
      const notifications = data.notifications || [];
      const unreadCount = notifications.filter(
        (n: Notification) => !n.isRead
      ).length;

      set({
        notifications,
        unreadCount,
        isLoading: false,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch notifications";
      set({ error: message, isLoading: false });
      toast.error("Không thể tải thông báo");
    }
  },

  markAsRead: async (token: string, notificationId: string) => {
    if (!token) {
      set({ error: "No token provided" });
      return;
    }

    try {
      // Optimistically update the UI
      const currentNotifications = get().notifications;
      const updatedNotifications = currentNotifications.map((n) =>
        n.id === notificationId
          ? { ...n, isRead: true, readAt: new Date().toISOString() }
          : n
      );
      const unreadCount = updatedNotifications.filter((n) => !n.isRead).length;

      set({
        notifications: updatedNotifications,
        unreadCount,
      });

      // Refetch to sync with server
      await get().fetchNotifications(token, false);
      toast.success("Đã đánh dấu là đã đọc");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to mark as read";
      set({ error: message });
      toast.error("Không thể đánh dấu thông báo");

      // Revert on error
      await get().fetchNotifications(token, false);
    }
  },

  markAllAsRead: async (token: string) => {
    if (!token) {
      set({ error: "No token provided" });
      return;
    }

    try {
      // Optimistically update the UI
      const currentNotifications = get().notifications;
      const updatedNotifications = currentNotifications.map((n) => ({
        ...n,
        isRead: true,
        readAt: n.readAt || new Date().toISOString(),
      }));

      set({
        notifications: updatedNotifications,
        unreadCount: 0,
      });

      // Refetch to sync with server
      await get().fetchNotifications(token, false);
      toast.success("Đã đánh dấu tất cả là đã đọc");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to mark all as read";
      set({ error: message });
      toast.error("Không thể đánh dấu tất cả thông báo");

      // Revert on error
      await get().fetchNotifications(token, false);
    }
  },

  clearError: () => set({ error: null }),
}));
