"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { DrinkRecord } from "@/types";
import { useMemo } from "react";

const COLORS = [
  "#6B8E78",
  "#D67D7D",
  "#FFB74D",
  "#90A4AE",
  "#9E8CAE",
  "#8D6E63",
  "#E0E0E0",
];

interface ShopPieChartProps {
  records: DrinkRecord[];
}

export function ShopPieChart({ records }: ShopPieChartProps) {
  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    records.forEach((r) => {
      counts[r.shop] = (counts[r.shop] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [records]);

  if (data.length === 0) {
    return (
      <div className="text-center text-gray-300 py-10 text-sm">暫無數據</div>
    );
  }

  return (
    <div className="h-[250px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="none"
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
            // 修正：同樣將型別放寬為 any
            formatter={(value: any) => [`${value} 杯`, "數量"]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => (
              <span className="text-xs text-gray-500 ml-1">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
