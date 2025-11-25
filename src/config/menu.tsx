import React from "react"
import { Home, ScanFace, Calendar, Book, Bell } from "lucide-react"

export type MenuItem = {
  label: string
  path: string
  icon: React.ReactNode

  children?: MenuItem[]
}

export const menuItems: MenuItem[] = [
  { label: "Trang chủ", path: "/dashboard", icon: <Home size={16} /> },
  { label: "Điểm danh", path: "/face-record", icon: <ScanFace size={16} /> },
  { label: "Lớp học", path: "/classes", icon: <Book size={16} /> },
  { label: "Lịch học", path: "/schedule", icon: <Calendar size={16} /> },
  { label: "Thông báo", path: "/notification", icon: <Bell size={16} /> },
];