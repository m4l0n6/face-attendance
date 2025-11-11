import { LoginForm } from "@/components/auth/LoginForm";
import { APP_NAME } from "@/utils/constant";

export default function LoginPage() {
  return (
    <div className="relative flex justify-center items-center bg-gradient-to-br from-blue-50 via-blue-100 to-purple-100 min-h-screen overflow-hidden">
      <div className="w-full max-w-sm">
        <LoginForm />
        <div className="py-4 text-gray-500 text-sm text-center">
        &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </div>
      </div>
      
    </div>
  );
}
