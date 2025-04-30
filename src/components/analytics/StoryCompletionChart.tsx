
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

type StoryCompletion = {
  id: number;
  name: string;
  title: string;
  قراءة: number;
  اختبارات: number;
  تلوين: number;
};

type StoryCompletionChartProps = {
  storyCompletionData: StoryCompletion[];
  activityConfig: {
    قراءة: { label: string; color: string };
    اختبارات: { label: string; color: string };
    تلوين: { label: string; color: string };
  };
};

const StoryCompletionChart = ({ storyCompletionData, activityConfig }: StoryCompletionChartProps) => {
  return (
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
  );
};

export default StoryCompletionChart;
