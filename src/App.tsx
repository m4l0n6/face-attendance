import { useEffect } from "react";
import { AdminRoutes } from "@/routes/adminRoutes"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { useAuthStore } from "@/stores/auth";
import { useClassStore } from "@/stores/classes";
import { Toaster } from "@/components/ui/sonner";

function App() {
  const validateStoredToken = useAuthStore((state) => state.validateStoredToken);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const fetchClasses = useClassStore((state) => state.fetchClasses);

  useEffect(() => {
    validateStoredToken();
  }, [validateStoredToken]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchClasses();
    }
  }, [isAuthenticated, fetchClasses]);

  return (
    <ThemeProvider defaultTheme="light" storageKey="app-theme">
      <AdminRoutes />
      <Toaster position="top-center" richColors closeButton/>
    </ThemeProvider>
  )
}

export default App