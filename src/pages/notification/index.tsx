import { useEffect } from "react";
import { DataTable } from "@/components/common/DataTable";
import {
  createIndexColumn,
  createDateColumn,
  createActionsColumn,
} from "@/components/common/DataTableHelpers";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/auth";
import { useNotificationStore } from "@/stores/notification";
import type { Notification } from "@/services/notification/typing";
import { Load } from "@/components/load";

const NotificationPage = () => {
  const token = useAuthStore((state) => state.token);
  const { notifications, isLoading, fetchNotifications, markAsRead } = useNotificationStore();

  useEffect(() => {
    if (token) {
      fetchNotifications(token, false);
    }
  }, [token, fetchNotifications]);

  const handleMarkAsRead = async (notification: Notification) => {
    if (!token || notification.isRead) return;
    await markAsRead(token, notification.id);
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

  if (isLoading) {
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