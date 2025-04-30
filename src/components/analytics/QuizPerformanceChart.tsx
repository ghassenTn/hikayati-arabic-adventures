
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";

type QuizPerformanceData = {
  name: string;
  value: number;
  color: string;
};

type QuizPerformanceChartProps = {
  quizPerformance: QuizPerformanceData[];
  quizConfig: {
    [key: string]: { label: string; color: string };
  };
};

const QuizPerformanceChart = ({ quizPerformance, quizConfig }: QuizPerformanceChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>أداء الاختبارات</CardTitle>
        <CardDescription>
          توزيع نتائج الاختبارات حسب المستوى
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ChartContainer config={quizConfig}>
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
  );
};

export default QuizPerformanceChart;
