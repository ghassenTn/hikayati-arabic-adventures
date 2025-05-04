import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend, // Import ChartLegend if you want a legend instead of/besides labels
  ChartLegendContent
} from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts"; // Keep ResponsiveContainer if needed, but ChartContainer might handle it

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

  // Custom label function (optional: adjust if needed for larger size)
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const RADIAN = Math.PI / 180;
    // Adjust label position based on the larger radius
    const radius = outerRadius * 1.1; // Position labels slightly outside the pie
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const textAnchor = x > cx ? 'start' : 'end';

    return (
      <text
        x={x}
        y={y}
        fill="currentColor" // Use current text color
        textAnchor={textAnchor}
        dominantBaseline="central"
        className="text-xs fill-muted-foreground" // Style using Tailwind classes
      >
        {`${name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };


  return (
    <Card className="flex flex-col h-full"> {/* Ensure Card can grow if needed */}
      <CardHeader>
        <CardTitle>أداء الاختبارات</CardTitle>
        <CardDescription>
          توزيع نتائج الاختبارات حسب المستوى
        </CardDescription>
      </CardHeader>
      {/* Use flex-grow to allow content to fill available space */}
      <CardContent className="flex-grow flex items-center justify-center pb-6">
        {/* Adjust height here. Let's make it slightly smaller than 700px 
           since the radius is now relative, but still large. 
           Or use aspect-ratio for responsive sizing based on width.
        */}
        <div className="w-full h-[500px] md:h-[600px]"> {/* Example height, adjust as needed */}
          <ChartContainer config={quizConfig} className="h-full w-full">
            {/* Recharts PieChart needs a sized container. 
              ChartContainer likely provides ResponsiveContainer behavior.
            */}
            <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}> {/* Add margins for labels */}
              <Pie
                data={quizPerformance}
                cx="50%"
                cy="50%"
                // --- Make the pie itself larger ---
                outerRadius="85%" // Use percentage for responsiveness (e.g., 85% of the container's smaller dimension)
                // innerRadius="30%" // Optional: Create a Donut chart
                labelLine={false} // Disable default label lines if using custom labels
                label={renderCustomizedLabel} // Use the custom label function
                // label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} // Original simpler label
                dataKey="value"
                strokeWidth={1} // Add a small stroke between slices
                stroke="hsl(var(--background))" // Use background color for stroke
              >
                {quizPerformance.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              {/* You can add ChartLegend here if preferred over labels */}
              {/* <ChartLegend content={<ChartLegendContent />} /> */}
              <ChartTooltip
                 cursor={{ fill: "hsl(var(--muted)/0.5)", strokeWidth: 0 }} // Nicer cursor
                 content={<ChartTooltipContent hideLabel />} // Hide default label in tooltip if name is clear
              />
            </PieChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizPerformanceChart;