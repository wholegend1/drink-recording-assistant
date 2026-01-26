import { useMemo } from "react";
import { DrinkRecord } from "@/types";
import { format } from "date-fns";

interface TodayStatusProps {
  records: DrinkRecord[];
}

export function TodayStatus({ records }: TodayStatusProps) {
  const todayStr = format(new Date(), "yyyy-MM-dd");

  const todayTotal = useMemo(() => {
    return records
      .filter((r) => r.date === todayStr)
      .reduce((sum, r) => sum + r.finalCost, 0);
  }, [records, todayStr]);

  // 標語庫 (可以放更多)
  const slogan = "多喝水沒事，沒事多喝水，錢包更快樂！";

  return (
    <div className="bg-white rounded-2xl p-6 mb-4 text-center shadow-sm border border-gray-100">
      <div className="text-sm text-gray-400 mb-1">📅 今日戰況</div>

      {todayTotal > 0 ? (
        <div className="text-4xl font-extrabold text-primary my-2">
          ${todayTotal}
        </div>
      ) : (
        <div className="text-gray-400 text-sm py-2 px-8">{slogan}</div>
      )}

      {/* 這裡之後可以加入連續天數 (Streak) 的計算邏輯 */}
    </div>
  );
}
