import React from "react";
import { BarChart, Bar, ResponsiveContainer, Cell } from "recharts";

type MiniBarChartProps = {
  data: any[];
  dataKey: string;
  id?: string;
};

const MiniBarChart = ({ data, dataKey, id = "mini-bar-chart" }: MiniBarChartProps) => {
  return (
    <div className="h-[160px]" id={id}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index % 2 === 0 ? "var(--color-primary)" : "var(--color-secondary)"} 
                className="dark:fill-primary dark:opacity-90"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MiniBarChart;