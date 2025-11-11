import React from "react"
import { Home, ScanFace, User2 } from "lucide-react"

export type MenuItem = {
  label: string
  path: string
  icon: React.ReactNode

  children?: MenuItem[]
}

export const menuItems: MenuItem[] = [
  { label: "Trang chủ", path: "/dashboard", icon: <Home size={16} /> },
  { label: "Điểm danh", path: "/face-record", icon: <ScanFace size={16} /> },
  { label: "Lớp học", path: "/classes", icon: <User2 size={16} /> },
]