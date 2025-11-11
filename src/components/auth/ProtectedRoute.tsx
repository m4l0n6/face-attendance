import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";
import { JSX } from "react/jsx-runtime";
import { useEffect } from "react";
import { Load } from "@/components/load";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, validateStoredToken } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      validateStoredToken();
    }
  }, [isAuthenticated, validateStoredToken]);

  if (isLoading) {
    return <Load />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
