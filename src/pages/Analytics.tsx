import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllStories } from "@/lib/db";
import Navbar from "@/components/layout/Navbar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2, Activity, ChartColumnBig } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Import refactored components
import SummaryCards from "@/components/analytics/SummaryCards";
import OverviewGrid from "@/components/analytics/OverviewGrid";
import AnalyticsTabs from "@/components/analytics/AnalyticsTabs";
import { 
  activityConfig, 
  learningConfig, 
  quizConfig 
} from "@/components/analytics/ChartConfigData";
import {
  generateActivityData,
  generateLearningData,
  generateQuizPerformance,
  generateStoryCompletionData,
  calculateTotalActivities,
  calculateCompletionRate,
  generateTimeDistribution,
  generateGrowthData,
  generateTopStories
} from "@/components/analytics/AnalyticsUtils";
import { exportAnalyticsToPDF } from "@/utils/pdfExport";

const Analytics = () => {
  const { data: stories = [], isLoading } = useQuery({
    queryKey: ['stories'],
    queryFn: getAllStories,
  });
  const { toast } = useToast();
  const [exporting, setExporting] = useState(false);

  // Generate all data using utility functions
  const activityData = useMemo(() => generateActivityData(stories), [stories]);
  const learningData = useMemo(() => generateLearningData(stories), [stories]);
  const quizPerformance = useMemo(() => generateQuizPerformance(stories), [stories]);
  const storyCompletionData = useMemo(() => generateStoryCompletionData(stories), [stories]);
  const timeDistribution = useMemo(() => generateTimeDistribution(stories), [stories]);
  const growthData = useMemo(() => generateGrowthData(stories), [stories]);
  const topStories = useMemo(() => generateTopStories(stories), [stories]);

  // Calculate metrics
  const totalActivities = useMemo(() => calculateTotalActivities(activityData), [activityData]);
  const completionRate = useMemo(() => calculateCompletionRate(stories, storyCompletionData), [stories, storyCompletionData]);

  // Function to handle PDF export
  const handleExportToPDF = async () => {
    setExporting(true);
    try {
      const fileName = await exportAnalyticsToPDF(
        stories,
        activityData,
        storyCompletionData,
        learningData,
        quizPerformance,
        totalActivities,
        completionRate
      );
      
      toast({
        title: "تم تصدير التقرير بنجاح",
        description: `تم حفظ الملف باسم ${fileName}`,
      });
    } catch (error) {
      toast({
        title: "خطأ في تصدير التقرير",
        description: "حدث خطأ أثناء إنشاء ملف PDF. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div dir="rtl" className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-6 flex items-center justify-center">
          <div className="text-center">
            <ChartColumnBig className="mx-auto h-12 w-12 text-primary animate-pulse" />
            <h2 className="mt-4 text-xl">جاري تحميل البيانات...</h2>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">تحليلات التعلم</h1>
            <p className="text-muted-foreground">تتبع تقدم التعلم والأنشطة</p>
          </div>
          <Button 
            onClick={handleExportToPDF}
            disabled={exporting}
          >
            {exporting ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جارِ التصدير...
              </>
            ) : (
              <>
                <FileText className="ml-2 h-4 w-4" />
                تصدير PDF
              </>
            )}
          </Button>
        </div>

        <SummaryCards 
          stories={stories} 
          totalActivities={totalActivities} 
          completionRate={completionRate} 
        />

        <OverviewGrid 
          learningData={learningData}
          timeDistribution={timeDistribution}
          growthData={growthData}
          topStories={topStories}
        />

        <Separator className="my-8" />

        <AnalyticsTabs 
          activityData={activityData}
          storyCompletionData={storyCompletionData}
          learningData={learningData}
          quizPerformance={quizPerformance}
          activityConfig={activityConfig}
          learningConfig={learningConfig}
          quizConfig={quizConfig}
        />
      </main>
    </div>
  );
};

export default Analytics;
