
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChartBar, ChartLine, ChartPie } from "lucide-react";
import DailyActivitiesChart from "./DailyActivitiesChart";
import StoryCompletionChart from "./StoryCompletionChart";
import LearningProgressChart from "./LearningProgressChart";
import QuizPerformanceChart from "./QuizPerformanceChart";

type AnalyticsTabsProps = {
  activityData: any[];
  storyCompletionData: any[];
  learningData: any[];
  quizPerformance: any[];
  activityConfig: any;
  learningConfig: any;
  quizConfig: any;
};

const AnalyticsTabs = ({ 
  activityData, 
  storyCompletionData, 
  learningData, 
  quizPerformance,
  activityConfig,
  learningConfig,
  quizConfig
}: AnalyticsTabsProps) => {
  return (
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
        <DailyActivitiesChart 
          activityData={activityData} 
          activityConfig={activityConfig} 
        />
        <StoryCompletionChart 
          storyCompletionData={storyCompletionData} 
          activityConfig={activityConfig} 
        />
      </TabsContent>

      <TabsContent value="learning" className="space-y-4">
        <LearningProgressChart 
          learningData={learningData} 
          learningConfig={learningConfig} 
        />
      </TabsContent>

      <TabsContent value="quiz" className="space-y-4">
        <QuizPerformanceChart 
          quizPerformance={quizPerformance} 
          quizConfig={quizConfig} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default AnalyticsTabs;
