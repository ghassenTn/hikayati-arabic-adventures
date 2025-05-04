import React from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

type MiniAreaChartProps = {
  data: any[];
  dataKey: string;
};

const MiniAreaChart = ({ data, dataKey }: MiniAreaChartProps) => {
  return (
    <div className="h-[160px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#9b87f5" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <Area 
            type="monotone" 
            dataKey={dataKey} 
            stroke="#9b87f5" 
            strokeWidth={2}
            fill="url(#colorGrowth)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MiniAreaChart;
