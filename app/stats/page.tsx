"use client";

import { useState, useMemo, useEffect } from "react";
import { useDrinkRecords } from "@/hooks/useDrinkRecords";
import { format } from "date-fns";
import { StatCard } from "@/components/stats/StatCard";
import { ShopPieChart } from "@/components/stats/ShopPieChart";
import { WeeklyChart } from "@/components/stats/WeeklyChart";
import { RankingList } from "@/components/stats/RankingList";
import { DollarSign, Coffee, Leaf } from "lucide-react";

// 更新 ID 列表，將排行榜拆開
const CHART_IDS = {
  OVERVIEW: "chart-overview",
  PIE: "chart-pie-shop",
  ECO: "chart-eco",
  WEEKLY: "chart-weekly",
  RANK_SHOP: "chart-rank-shop", // 店家排行
  RANK_ITEM: "chart-rank-item", // 飲料排行
  RANK_GUILTY: "chart-rank-guilty", // 罪惡組合
  RANK_TOPPING: "chart-rank-topping", // 加料王
};

export default function StatsPage() {
  const { records, isLoaded } = useDrinkRecords();
  const [scope, setScope] = useState<"month" | "year">("month");
  const [visible, setVisible] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("visibleCharts");
    setVisible(saved ? JSON.parse(saved) : Object.values(CHART_IDS));
  }, []);

  const filteredRecords = useMemo(() => {
    const now = new Date();
    const prefix =
      scope === "month" ? format(now, "yyyy-MM") : format(now, "yyyy");
    return records.filter((r) => r.date.startsWith(prefix));
  }, [records, scope]);

  const stats = useMemo(() => {
    const totalSpend = filteredRecords.reduce((sum, r) => sum + r.finalCost, 0);
    const totalCups = filteredRecords.length;
    const ecoCount = filteredRecords.filter((r) => r.isEco).length;
    const ecoRate =
      totalCups > 0 ? Math.round((ecoCount / totalCups) * 100) : 0;

    // 1. 店家排行 (依金額)
    const shopCounts: Record<string, number> = {};
    filteredRecords.forEach(
      (r) => (shopCounts[r.shop] = (shopCounts[r.shop] || 0) + r.finalCost),
    );
    const topShops = Object.entries(shopCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, value]) => ({ name, value }));

    // 2. 飲料排行 (依杯數)
    const itemCounts: Record<string, number> = {};
    filteredRecords.forEach(
      (r) => (itemCounts[r.item] = (itemCounts[r.item] || 0) + 1),
    );
    const topItems = Object.entries(itemCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, value]) => ({ name, value }));

    // 3. 罪惡組合 (飲料+加料)
    const guiltyCounts: Record<string, number> = {};
    filteredRecords.forEach((r) => {
      if (r.toppings && r.toppings.length > 0) {
        // key 格式: 50嵐 1號 + 椰果
        const toppingNames = r.toppings.map((t) => t.name).join("+");
        const key = `${r.shop} ${r.item} + ${toppingNames}`;
        guiltyCounts[key] = (guiltyCounts[key] || 0) + 1;
      }
    });
    const topGuilty = Object.entries(guiltyCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, value]) => ({ name, value }));

    // 4. 加料王 (單一加料統計)
    const toppingCounts: Record<string, number> = {};
    filteredRecords.forEach((r) => {
      r.toppings.forEach((t) => {
        // key 格式: 椰果 ($10 @ 50嵐)
        const key = `${t.name} ($${t.price} @ ${r.shop})`;
        toppingCounts[key] = (toppingCounts[key] || 0) + 1;
      });
    });
    const topToppings = Object.entries(toppingCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, value]) => ({ name, value }));

    return {
      totalSpend,
      totalCups,
      ecoCount,
      ecoRate,
      topShops,
      topItems,
      topGuilty,
      topToppings,
    };
  }, [filteredRecords]);

  if (!isLoaded)
    return <div className="p-10 text-center text-gray-400">載入中...</div>;

  return (
    <div className="pb-24 pt-4 px-4 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-xl font-extrabold text-text">飲用分析</h1>
        <div className="bg-white p-1 rounded-xl border border-gray-200 flex text-xs font-bold">
          <button
            onClick={() => setScope("month")}
            className={`px-4 py-1.5 rounded-lg transition-all ${scope === "month" ? "bg-primary text-white shadow-md" : "text-gray-400"}`}
          >
            本月
          </button>
          <button
            onClick={() => setScope("year")}
            className={`px-4 py-1.5 rounded-lg transition-all ${scope === "year" ? "bg-primary text-white shadow-md" : "text-gray-400"}`}
          >
            年度
          </button>
        </div>
      </header>

      {visible.includes(CHART_IDS.OVERVIEW) && (
        <div className="grid grid-cols-2 gap-3">
          {/* 修正：將 color="accent" 改為 color="primary" */}
          <StatCard
            title="總花費"
            value={stats.totalSpend}
            icon={<DollarSign size={16} />}
            color="primary"
            className="col-span-1"
          />
          <StatCard
            title="總杯數"
            value={stats.totalCups}
            unit="杯"
            icon={<Coffee size={16} />}
            color="primary"
            className="col-span-1"
          />
        </div>
      )}

      {visible.includes(CHART_IDS.ECO) && (
        <div className="ios-card">
          <div className="flex justify-between items-end mb-3">
            <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
              <Leaf size={14} className="text-primary" /> 環保杯使用率
            </span>
            <span className="text-xl font-extrabold text-primary">
              {stats.ecoRate}%
            </span>
          </div>
          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${stats.ecoRate}%` }}
            />
          </div>
          <div className="text-right text-[10px] text-gray-400 mt-1">
            {stats.ecoCount} / {stats.totalCups} 杯
          </div>
        </div>
      )}

      {visible.includes(CHART_IDS.WEEKLY) && (
        <div className="ios-card">
          <h3 className="font-bold text-text">每週飲用習慣</h3>
          <WeeklyChart records={filteredRecords} />
        </div>
      )}

      {visible.includes(CHART_IDS.PIE) && (
        <div className="ios-card">
          <h3 className="font-bold text-text">店家喜好分佈</h3>
          <ShopPieChart records={filteredRecords} />
        </div>
      )}

      {/* 排行榜們 (個別開關) */}
      {visible.includes(CHART_IDS.RANK_SHOP) && (
        <RankingList title="🏆 花費最高的店家" data={stats.topShops} unit="$" />
      )}
      {visible.includes(CHART_IDS.RANK_ITEM) && (
        <RankingList title="🥤 最常喝的飲料" data={stats.topItems} unit="杯" />
      )}
      {visible.includes(CHART_IDS.RANK_GUILTY) && (
        <RankingList title="😈 罪惡組合" data={stats.topGuilty} unit="次" />
      )}
      {visible.includes(CHART_IDS.RANK_TOPPING) && (
        <RankingList title="✨ 加料王" data={stats.topToppings} unit="次" />
      )}
    </div>
  );
}
