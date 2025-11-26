import { Outlet } from "react-router-dom"
import { SidebarProvider } from "@/components/ui/sidebar"
import { LayoutSidebar } from "./Sidebar"
import { BreadcrumbHeader } from "./BreadcrumbHeader"
import NotificationList from "./NotificationList"
import AvatarDropMenu from "./AvatarDropMenu"  // Bỏ dấu {} - sửa từ { AvatarDropMenu }

export function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen overflow-hidden">
        <LayoutSidebar />
        <div className="relative flex-1 min-w-0">
          <div className="flex justify-between items-center border-b px-4 h-14">
            <BreadcrumbHeader />
            <div className="flex items-center gap-2">
              <NotificationList />
              <AvatarDropMenu />
            </div>
          </div>
          <div className="top-14 absolute inset-0 overflow-auto">
            <main className="p-4 md:p-6 w-full">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}