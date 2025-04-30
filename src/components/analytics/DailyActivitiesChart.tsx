
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

type DailyActivity = {
  name: string;
  قراءة: number;
  اختبارات: number;
  تلوين: number;
};

type DailyActivitiesChartProps = {
  activityData: DailyActivity[];
  activityConfig: {
    قراءة: { label: string; color: string };
    اختبارات: { label: string; color: string };
    تلوين: { label: string; color: string };
  };
};

const DailyActivitiesChart = ({ activityData, activityConfig }: DailyActivitiesChartProps) => {
  return (
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
  );
};

export default DailyActivitiesChart;
