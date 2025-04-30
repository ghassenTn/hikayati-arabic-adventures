
import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllStories } from "@/lib/db";
import Navbar from "@/components/layout/Navbar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";

// Import refactored components
import SummaryCards from "@/components/analytics/SummaryCards";
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
  calculateCompletionRate
} from "@/components/analytics/AnalyticsUtils";

const Analytics = () => {
  const { data: stories = [], isLoading } = useQuery({
    queryKey: ['stories'],
    queryFn: getAllStories,
  });

  // Generate all data using utility functions
  const activityData = useMemo(() => generateActivityData(stories), [stories]);
  const learningData = useMemo(() => generateLearningData(stories), [stories]);
  const quizPerformance = useMemo(() => generateQuizPerformance(stories), [stories]);
  const storyCompletionData = useMemo(() => generateStoryCompletionData(stories), [stories]);

  // Calculate metrics
  const totalActivities = useMemo(() => calculateTotalActivities(activityData), [activityData]);
  const completionRate = useMemo(() => calculateCompletionRate(stories, storyCompletionData), [stories, storyCompletionData]);

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

        <SummaryCards 
          stories={stories} 
          totalActivities={totalActivities} 
          completionRate={completionRate} 
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
