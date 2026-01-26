"use client";

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { DrinkRecord } from "@/types";
import { useMemo } from "react";

interface WeeklyChartProps {
  records: DrinkRecord[];
}

export function WeeklyChart({ records }: WeeklyChartProps) {
  const data = useMemo(() => {
    const weekCounts = [0, 0, 0, 0, 0, 0, 0];
    records.forEach((r) => {
      const idx = (new Date(r.date).getDay() + 6) % 7;
      weekCounts[idx]++;
    });

    const labels = ["一", "二", "三", "四", "五", "六", "日"];
    return weekCounts.map((count, i) => ({
      day: labels[i],
      count,
    }));
  }, [records]);

  const maxVal = Math.max(...data.map((d) => d.count));

  if (maxVal === 0)
    return (
      <div className="text-center text-text-sub py-10 text-sm">暫無數據</div>
    );

  return (
    <div className="h-[200px] w-full mt-4 min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={20}>
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            // 修正：文字顏色使用變數 (透過 CSS 讀取，或直接給深色模式適用的灰)
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
            dy={10}
          />
          <Tooltip
            cursor={{ fill: "var(--color-input-bg)" }} // 修正：Hover 背景變數化
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              backgroundColor: "var(--color-card-bg)", // 修正：Tooltip 背景
              color: "var(--color-text)", // 修正：Tooltip 文字
            }}
            formatter={(value: any) => [`${value} 杯`, "總杯數"]}
            labelFormatter={(label) => `星期${label}`}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                // 修正重點：使用 var(--color-primary)
                fill={
                  entry.count === maxVal
                    ? "var(--color-primary)"
                    : "var(--color-border)"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
