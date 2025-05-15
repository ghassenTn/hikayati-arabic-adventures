
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { User, Mail, Lock } from "lucide-react";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Handle form submission for name change
  const handleUpdateProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // This is just a placeholder since we're not persisting user data yet
    toast({
      title: "تم تحديث الملف الشخصي",
      description: "تم حفظ التغييرات بنجاح",
    });
  };

  // Handle password change
  const handleChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // This is just a placeholder
    toast({
      title: "تم تغيير كلمة المرور",
      description: "تم تغيير كلمة المرور بنجاح",
    });
  };

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase();
  };

  const displayName = user.name || user.email.split("@")[0];
  const initials = user.name ? getInitials(user.name) : user.email[0].toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <div className="mx-auto max-w-2xl space-y-8">
          <h1 className="text-3xl font-bold text-center">الملف الشخصي</h1>
          
          {/* Profile Card */}
          <Card className="shadow-md">
            <CardHeader className="flex flex-col items-center pb-6">
              <Avatar className="h-24 w-24 mb-4">
                {user.picture ? (
                  <AvatarImage src={user.picture} alt={displayName} />
                ) : null}
                <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{displayName}</CardTitle>
              <p className="text-muted-foreground mt-1">{user.email}</p>
              <div className="mt-3">
                {user.provider && (
                  <span className="inline-flex items-center px-3 py-1 text-xs rounded-full bg-primary/10 text-primary">
                    {user.provider}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Personal Info Section */}
              <form onSubmit={handleUpdateProfile}>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  المعلومات الشخصية
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم</Label>
                    <Input 
                      id="name" 
                      defaultValue={user.name || ''} 
                      placeholder="ادخل اسمك الكامل" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      defaultValue={user.email} 
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      لا يمكن تغيير البريد الإلكتروني
                    </p>
                  </div>
                </div>
                <Button type="submit" className="mt-4">
                  حفظ التغييرات
                </Button>
              </form>
              
              <Separator />
              
              {/* Password Section */}
              <form onSubmit={handleChangePassword}>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Lock className="mr-2 h-5 w-5" />
                  تغيير كلمة المرور
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">كلمة المرور الحالية</Label>
                    <Input 
                      id="current-password" 
                      type="password" 
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                    <Input 
                      id="new-password" 
                      type="password" 
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <Button type="submit" className="mt-4">
                  تحديث كلمة المرور
                </Button>
              </form>
              
              <Separator />

              {/* Account Section */}
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Mail className="mr-2 h-5 w-5" />
                  إعدادات الحساب
                </h3>
                <div className="space-y-4">
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      logout();
                      navigate('/');
                      toast({
                        title: "تم تسجيل الخروج",
                        description: "تم تسجيل خروجك بنجاح",
                      });
                    }}
                  >
                    تسجيل الخروج
                  </Button>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
