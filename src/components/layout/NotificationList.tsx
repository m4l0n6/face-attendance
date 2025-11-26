import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState, useCallback } from "react";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/services/api";
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

const NotificationList = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadOnly] = useState(true);
  const token = useAuthStore((state) => state.token);

  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    
    try {
      const data = await getNotifications(token, unreadOnly);
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [token, unreadOnly]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = async (notificationId: string) => {
    if (!token) return;
    
    try {
      await markNotificationAsRead(token, notificationId);
      await fetchNotifications();
      toast.success("Đã đánh dấu là đã đọc");
    } catch  {
      toast.error("Không thể đánh dấu thông báo");
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!token) return;
    
    try {
      await markAllNotificationsAsRead(token);
      await fetchNotifications();
      toast.success("Đã đánh dấu tất cả là đã đọc");
    } catch  {
      toast.error("Không thể đánh dấu tất cả");
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "border-green-500";
      case "warning":
        return "border-orange-500";
      case "info":
        return "border-blue-500";
      default:
        return "border-gray-500";
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative p-2 rounded-full" size="icon">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="top-1 right-1 absolute flex justify-center items-center bg-red-500 rounded-full w-4 h-4 font-bold text-[10px] text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Thông báo</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-primary text-xs"
              onClick={handleMarkAllAsRead}
            >
              Đánh dấu tất cả
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-sm">
              Không có thông báo
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`p-3 cursor-pointer ${
                  !notification.isRead ? "bg-accent/50" : ""
                }`}
                onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
              >
                <div className="flex gap-3 w-full">
                  <div
                    className={`w-1 shrink-0 rounded-full ${getTypeColor(
                      notification.type
                    )}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      {!notification.isRead && (
                        <Badge className="bg-blue-500 shrink-0 text-[10px]">Mới</Badge>
                      )}
                    </div>
                    <p className="mt-1 text-muted-foreground text-xs line-clamp-2">
                      {notification.message}
                    </p>
                    <span className="mt-1 text-[10px] text-muted-foreground">
                      {formatTime(notification.createdAt)}
                    </span>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center text-primary text-center cursor-pointer">
          Xem tất cả thông báo
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationList;