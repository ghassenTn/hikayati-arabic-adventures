
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

const UserProfileButton = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  if (!isAuthenticated) {
    return (
      <Button 
        variant="outline" 
        onClick={() => navigate("/login")}
        className="text-sm"
      >
        <User className="mr-2 h-4 w-4" />
        تسجيل الدخول
      </Button>
    );
  }

  const handleLogout = () => {
    logout();
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل خروجك بنجاح",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" className="relative">
          <User className="mr-2 h-4 w-4" />
          <span className="max-w-[100px] truncate">
            {user?.email?.split('@')[0]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>حسابي</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/profile")}>
          الملف الشخصي
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          تسجيل الخروج
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileButton;
