export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

type NotificationType =
  | SCHEDULE_CREATED
  | SCHEDULE_UPDATED
  | SCHEDULE_CANCELLED
  | SESSION_REMINDER
  | ATTENDANCE_MARKED
  | ATTENDANCE_REMINDER
  | GENERAL;