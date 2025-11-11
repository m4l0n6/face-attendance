import { useEffect } from "react";
import { AdminRoutes } from "@/routes/adminRoutes"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { useAuthStore } from "@/stores/auth";
import { Toaster } from "@/components/ui/sonner";

function App() {
  const validateStoredToken = useAuthStore((state) => state.validateStoredToken);

  useEffect(() => {
    validateStoredToken();
  }, [validateStoredToken]);

  return (
    <ThemeProvider defaultTheme="light" storageKey="app-theme">
      <AdminRoutes />
      <Toaster />
    </ThemeProvider>
  )
}

export default App