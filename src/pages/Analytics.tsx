
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllStories } from "@/lib/db";
import Navbar from "@/components/layout/Navbar";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer 
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChartBar, ChartPie, ChartLine, Activity } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const Analytics = () => {
  const { data: stories = [], isLoading } = useQuery({
    queryKey: ['stories'],
    queryFn: getAllStories,
  });

  // Mock data for analytics (in a real app, this would come from a database)
  const activityData = [
    { name: "الأحد", قراءة: 4, اختبارات: 2, تلوين: 3 },
    { name: "الإثنين", قراءة: 3, اختبارات: 1, تلوين: 2 },
    { name: "الثلاثاء", قراءة: 5, اختبارات: 3, تلوين: 4 },
    { name: "الأربعاء", قراءة: 2, اختبارات: 4, تلوين: 1 },
    { name: "الخميس", قراءة: 6, اختبارات: 2, تلوين: 5 },
    { name: "الجمعة", قراءة: 4, اختبارات: 3, تلوين: 2 },
    { name: "السبت", قراءة: 5, اختبارات: 5, تلوين: 3 },
  ];

  const learningData = [
    { name: "الأسبوع 1", تعلم: 15 },
    { name: "الأسبوع 2", تعلم: 20 },
    { name: "الأسبوع 3", تعلم: 25 },
    { name: "الأسبوع 4", تعلم: 35 },
  ];

  const quizPerformance = [
    { name: "ممتاز", value: 60, color: "#9b87f5" },
    { name: "جيد", value: 25, color: "#E5DEFF" },
    { name: "متوسط", value: 10, color: "#F97316" },
    { name: "ضعيف", value: 5, color: "#ef4444" },
  ];

  const storyCompletionData = stories.map((story, index) => ({
    id: story.id,
    name: `قصة ${index + 1}`,
    title: story.title,
    قراءة: Math.floor(Math.random() * 100),
    اختبارات: Math.floor(Math.random() * 100),
    تلوين: Math.floor(Math.random() * 100),
  }));

  const activityConfig = {
    قراءة: { label: "القراءة", color: "#9b87f5" },
    اختبارات: { label: "الاختبارات", color: "#F97316" },
    تلوين: { label: "التلوين", color: "#22c55e" },
  };

  const learningConfig = {
    تعلم: { label: "التقدم في التعلم", color: "#9b87f5" },
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">تحليلات التعلم</h1>
            <p className="text-muted-foreground">تتبع تقدم التعلم والأنشطة</p>
          </div>
          <Button>
            <Activity className="mr-2" />
            تصدير التقرير
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">إجمالي القصص</CardTitle>
              <CardDescription>مجموع القصص المضافة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{stories.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">الأنشطة المكتملة</CardTitle>
              <CardDescription>مجموع الأنشطة المنجزة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">
                {activityData.reduce(
                  (acc, day) => acc + day.قراءة + day.اختبارات + day.تلوين, 0
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">معدل الإكمال</CardTitle>
              <CardDescription>نسبة إكمال الأنشطة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">85%</div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        <Tabs defaultValue="activities">
          <TabsList className="mb-8 w-full justify-start">
            <TabsTrigger value="activities" className="flex items-center">
              <ChartBar className="ml-2" size={18} />
              الأنشطة اليومية
            </TabsTrigger>
            <TabsTrigger value="learning" className="flex items-center">
              <ChartLine className="ml-2" size={18} />
              تقدم التعلم
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex items-center">
              <ChartPie className="ml-2" size={18} />
              أداء الاختبارات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>الأنشطة اليومية</CardTitle>
                <CardDescription>
                  عدد الأنشطة المكتملة يوميًا خلال الأسبوع الماضي
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ChartContainer config={activityConfig}>
                    <BarChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar dataKey="قراءة" fill="#9b87f5" />
                      <Bar dataKey="اختبارات" fill="#F97316" />
                      <Bar dataKey="تلوين" fill="#22c55e" />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>تفاصيل الأنشطة حسب القصص</CardTitle>
                <CardDescription>
                  نسبة إكمال كل نشاط لكل قصة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ChartContainer config={activityConfig}>
                    <BarChart 
                      data={storyCompletionData} 
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        width={100} 
                      />
                      <ChartTooltip 
                        content={<ChartTooltipContent />} 
                      />
                      <Bar dataKey="قراءة" fill="#9b87f5" />
                      <Bar dataKey="اختبارات" fill="#F97316" />
                      <Bar dataKey="تلوين" fill="#22c55e" />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="learning" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>تقدم التعلم الأسبوعي</CardTitle>
                <CardDescription>
                  مقياس التقدم في التعلم خلال الشهر الماضي
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ChartContainer config={learningConfig}>
                    <LineChart data={learningData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="تعلم" 
                        stroke="#9b87f5" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quiz" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>أداء الاختبارات</CardTitle>
                <CardDescription>
                  توزيع نتائج الاختبارات حسب المستوى
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ChartContainer>
                    <PieChart>
                      <Pie
                        data={quizPerformance}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        dataKey="value"
                      >
                        {quizPerformance.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Analytics;
