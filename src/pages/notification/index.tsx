import { useEffect, useState, useCallback } from "react";
import { DataTable } from "@/components/common/DataTable";
import {
  createIndexColumn,
  createDateColumn,
  createActionsColumn,
} from "@/components/common/DataTableHelpers";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { getNotifications, markNotificationAsRead } from "@/services/notification/index";
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";
import type { Notification } from "@/services/notification/typing";
import { Load } from "@/components/load";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useAuthStore((state) => state.token);

  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const data = await getNotifications(token, false);
      setNotifications(data.notifications || []);
    } catch {
      toast.error("Không thể tải thông báo");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (notification: Notification) => {
    if (!token || notification.isRead) return;
    
    try {
      await markNotificationAsRead(token, notification.id);
      await fetchNotifications();
      toast.success("Đã đánh dấu là đã đọc");
    } catch  {
      toast.error("Không thể đánh dấu thông báo");
    }
  };

  const columns: ColumnDef<Notification>[] = [
    createIndexColumn(),
    {
      accessorKey: "title",
      header: "Tiêu đề",
    },
    {
      accessorKey: "message",
      header: "Nội dung",
    },
    {
      accessorKey: "type",
      header: "Loại",
      cell: ({ row }) => {
        const type = row.original.type;
        const variant = 
          type === "success" ? "default" :
          type === "warning" ? "destructive" :
          "secondary";
        return <Badge variant={variant}>{type}</Badge>;
      },
    },
    {
      accessorKey: "isRead",
      header: "Trạng thái",
      cell: ({ row }) => {
        const isRead = row.original.isRead;
        return (
          <Badge variant={isRead ? "outline" : "default"}>
            {isRead ? "Đã đọc" : "Chưa đọc"}
          </Badge>
        );
      },
    },
    createDateColumn("createdAt", "Ngày tạo"),
    createActionsColumn({
      onView: handleMarkAsRead,
    }),
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Load />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4 font-bold text-2xl">Thông báo</h1>
      <DataTable
        columns={columns}
        data={notifications}
        searchKey="title"
        searchPlaceholder="Tìm kiếm thông báo..."
      />
    </div>
  );
};

export default NotificationPage;