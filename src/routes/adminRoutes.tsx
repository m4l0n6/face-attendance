import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AdminLayout } from "@/components/layout/DashboardLayout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { generateRoutes } from "@/utils/routeGenerator"
import { menuItems } from "@/config/menu"
import LoginPage from "@/pages/auth/login"
import NotFoundPage from "@/pages/exception/404"
import { Load } from "@/components/load"

const ClassesDetailPage = React.lazy(
  () => import("@/pages/classes/classes-detail")
);

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
          <Route 
            path="classes/:classId" 
            element={
              <React.Suspense fallback={<Load />}>
                <ClassesDetailPage />
              </React.Suspense>
            } 
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}