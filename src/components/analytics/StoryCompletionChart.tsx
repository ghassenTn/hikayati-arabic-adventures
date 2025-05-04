import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";

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
        <CardDescription>نسبة إكمال كل نشاط لكل قصة</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[700px]">
          <ChartContainer config={activityConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={storyCompletionData}
                layout="vertical"
                barCategoryGap="20%" // Space between bars in the same category
                barGap={2} // Space between bars within a group
                margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  label={{
                    value: "عدد الأنشطة",
                    position: "insideBottomRight",
                    offset: -10,
                    fontFamily: "Noto Sans Arabic",
                  }}
                  tick={{ fontFamily: "Noto Sans Arabic" }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={100}
                  tick={{ fontFamily: "Noto Sans Arabic" }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelStyle={{ fontFamily: "Noto Sans Arabic", direction: "rtl" }}
                      itemStyle={{ fontFamily: "Noto Sans Arabic", direction: "rtl" }}
                    />
                  }
                />
                <Legend
                  align="right"
                  verticalAlign="top"
                  wrapperStyle={{ fontFamily: "Noto Sans Arabic", direction: "rtl" }}
                />
                <Bar
                  dataKey="قراءة"
                  fill={activityConfig.قراءة.color || "#9b87f5"}
                  name={activityConfig.قراءة.label}
                  barSize={20}
                />
                <Bar
                  dataKey="اختبارات"
                  fill={activityConfig.اختبارات.color || "#F97316"}
                  name={activityConfig.اختبارات.label}
                  barSize={20}
                />
                <Bar
                  dataKey="تلوين"
                  fill={activityConfig.تلوين.color || "#22c55e"}
                  name={activityConfig.تلوين.label}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoryCompletionChart;