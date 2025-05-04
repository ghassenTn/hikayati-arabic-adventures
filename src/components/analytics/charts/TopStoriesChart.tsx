import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  Legend,
  Tooltip 
} from "recharts";

type TopStoriesChartProps = {
  data: any[];
};

const TopStoriesChart = ({ data }: TopStoriesChartProps) => {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" />
          <YAxis 
            dataKey="title"
            type="category" 
            width={150} 
            tick={{ fontSize: 12 }}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="قراءة" stackId="a" fill="#9b87f5" name="قراءة" />
          <Bar dataKey="اختبارات" stackId="a" fill="#F97316" name="اختبارات" />
          <Bar dataKey="تلوين" stackId="a" fill="#22c55e" name="تلوين" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopStoriesChart;