import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { generateRoutes } from "@/utils/routeGenerator"
import { menuItems } from "@/config/menu"
import LoginPage from "@/pages/auth/login"
import NotFoundPage from "@/pages/exception/404"

export function AdminRoutes() {
  const autoRoutes = generateRoutes(menuItems)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="/" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          {autoRoutes}
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}