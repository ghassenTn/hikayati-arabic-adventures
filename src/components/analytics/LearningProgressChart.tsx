
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

type LearningProgress = {
  name: string;
  تعلم: number;
};

type LearningProgressChartProps = {
  learningData: LearningProgress[];
  learningConfig: {
    تعلم: { label: string; color: string };
  };
};

const LearningProgressChart = ({ learningData, learningConfig }: LearningProgressChartProps) => {
  return (
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
  );
};

export default LearningProgressChart;
