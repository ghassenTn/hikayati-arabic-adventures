import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MiniBarChart from "./charts/MiniBarChart";
import MiniAreaChart from "./charts/MiniAreaChart";
import MiniPieChart from "./charts/MiniPieChart";
import TopStoriesChart from "./charts/TopStoriesChart";

type OverviewGridProps = {
  learningData: any[];
  timeDistribution: any[];
  growthData: any[];
  topStories: any[];
};

const OverviewGrid = ({ 
  learningData,
  timeDistribution, 
  growthData,
  topStories
}: OverviewGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="md:col-span-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>نمو المحتوى</CardTitle>
            <Badge variant="outline" className="bg-secondary/10 text-secondary">
              +{growthData[growthData.length - 1]?.growth || 0}%
            </Badge>
          </div>
          <CardDescription>
            معدل نمو المحتوى والقصص الشهري
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MiniAreaChart data={growthData} dataKey="نمو" />
        </CardContent>
      </Card>

      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>توزيع الوقت</CardTitle>
          <CardDescription>
            كيفية توزيع وقت التعلم على الأنشطة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MiniPieChart data={timeDistribution} />
        </CardContent>
      </Card>

      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>تقدم التعلم</CardTitle>
          <CardDescription>
            تقدم التعلم خلال الشهر الماضي
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MiniBarChart data={learningData} dataKey="تعلم" />
        </CardContent>
      </Card>

      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle>أكثر القصص تفاعلاً</CardTitle>
          <CardDescription>
            القصص الأكثر تفاعلاً حسب الأنشطة المكتملة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TopStoriesChart data={topStories} />
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewGrid;
