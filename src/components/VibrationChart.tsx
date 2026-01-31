// src/components/VibrationChart.tsx
"use client";

import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";

export function VibrationChart({ data, color }: { data: number[]; color: string }) {
  // Convert array [12, 15...] to object array [{value: 12}, {value: 15}...] for Recharts
  const chartData = data.map((val, i) => ({ index: i, value: val }));

  return (
    <div className="h-[60px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <YAxis domain={[0, 100]} hide />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={true} // Magic animation
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}