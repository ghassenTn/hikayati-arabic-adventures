
import React from "react";
import { Helmet } from "react-helmet-async";
import { useSettings } from "@/contexts/SettingsContext";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user } = useAuth();
  const { showChat, setShowChat, showStats, setShowStats } = useSettings();
  const { toast } = useToast();

  const handleChatToggle = (checked: boolean) => {
    setShowChat(checked);
    toast({
      title: checked ? "تم تفعيل المساعد" : "تم إيقاف المساعد",
      description: checked ? "سيظهر المساعد في القائمة الرئيسية" : "لن يظهر المساعد في القائمة الرئيسية",
    });
  };

  const handleStatsToggle = (checked: boolean) => {
    setShowStats(checked);
    toast({
      title: checked ? "تم تفعيل الإحصائيات" : "تم إيقاف الإحصائيات",
      description: checked ? "ستظهر الإحصائيات في القائمة الرئيسية" : "لن تظهر الإحصائيات في القائمة الرئيسية",
    });
  };

  // Format the date using a safe method since createdAt might not exist
  const formatJoinDate = () => {
    try {
      // If user has createdAt property, use it, otherwise use current date
      const joinDate = user && 'createdAt' in user ? user.createdAt : new Date().toISOString();
      return new Date(joinDate || Date.now()).toLocaleDateString('ar-SA');
    } catch (error) {
      console.error("Error formatting join date:", error);
      return new Date().toLocaleDateString('ar-SA');
    }
  };

  return (
    <>
      <Helmet>
        <title>الملف الشخصي | حكايتي</title>
        <meta name="description" content="إدارة الملف الشخصي والإعدادات الخاصة بك" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">الملف الشخصي</h1>
            
            {user ? (
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>المعلومات الشخصية</CardTitle>
                    <CardDescription>معلوماتك الأساسية</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">البريد الإلكتروني</h3>
                      <p className="mt-1">{user.email}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">اسم المستخدم</h3>
                      <p className="mt-1">{user.email?.split('@')[0]}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">تاريخ الانضمام</h3>
                      <p className="mt-1">{formatJoinDate()}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>الإعدادات</CardTitle>
                    <CardDescription>تخصيص تجربة التطبيق</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="show-chat">إظهار المساعد الذكي</Label>
                        <p className="text-sm text-muted-foreground">
                          عرض زر المساعد الذكي في شريط التنقل
                        </p>
                      </div>
                      <Switch
                        id="show-chat"
                        checked={showChat}
                        onCheckedChange={handleChatToggle}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="show-stats">إظهار الإحصائيات</Label>
                        <p className="text-sm text-muted-foreground">
                          عرض زر الإحصائيات في شريط التنقل
                        </p>
                      </div>
                      <Switch
                        id="show-stats"
                        checked={showStats}
                        onCheckedChange={handleStatsToggle}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <p>يرجى تسجيل الدخول لعرض الملف الشخصي</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Profile;
