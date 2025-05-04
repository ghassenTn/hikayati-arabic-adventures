import React from "react";
import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";

type MiniPieChartProps = {
  data: any[];
};

const COLORS = ['#9b87f5', '#F97316', '#22c55e', '#E5DEFF'];

const MiniPieChart = ({ data }: MiniPieChartProps) => {
  return (
    <div className="h-[160px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={30}
            outerRadius={60}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="flex justify-center mt-4 flex-wrap gap-3">
        {data.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div 
              className="w-3 h-3 mr-1 rounded-sm" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-xs">
              {entry.name}: {Math.round(entry.value)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiniPieChart;
