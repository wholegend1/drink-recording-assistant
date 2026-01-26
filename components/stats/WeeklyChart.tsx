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
            // 使用 CSS 變數確保深色模式下文字可見
            tick={{ fill: "var(--theme-text-sub)", fontSize: 12 }}
            dy={10}
          />
          <Tooltip
            cursor={{ fill: "var(--theme-input-bg)" }}
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid var(--theme-border)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              backgroundColor: "var(--theme-card-bg)", // 跟隨主題背景
              color: "var(--theme-text)", // 跟隨主題文字
            }}
            itemStyle={{ color: "var(--theme-text)" }}
            formatter={(value: any) => [`${value} 杯`, "總杯數"]}
            labelFormatter={(label) => `星期${label}`}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                // 這裡改用 globals.css 定義的正確變數名
                fill={
                  entry.count === maxVal
                    ? "var(--theme-primary)"
                    : "var(--theme-border)" // 未選中的變灰色
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
