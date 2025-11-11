import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";

const AvatarDropMenu = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
      useAuthStore.getState().logout();
      navigate("/login");
    };
    const { user } = useAuthStore();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="border-none h-full">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            </Avatar>
            <p className="hidden md:block">{user?.displayName}</p>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-36" align="end">
          <DropdownMenuItem>Hồ sơ</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default AvatarDropMenu;
