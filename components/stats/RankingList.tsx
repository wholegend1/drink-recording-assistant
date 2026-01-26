import { DrinkRecord } from "@/types";
import clsx from "clsx";

interface RankingListProps {
  title: string;
  data: { name: string; value: number; subtext?: string }[];
  unit?: string;
}

export function RankingList({ title, data, unit = "次" }: RankingListProps) {
  return (
    // 修正：使用 ios-card 樣式類別 (已包含 bg-card-bg, border-border, shadow)
    <div className="ios-card mb-4">
      {/* 修正：文字顏色改為 text-text (自動適應深淺) */}
      <h3 className="font-bold text-text mb-4 flex items-center gap-2">
        {title}
      </h3>

      {data.length === 0 ? (
        <p className="text-xs text-text-sub text-center py-4">尚無資料</p>
      ) : (
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                {/* 排名 Badge */}
                <div
                  className={clsx(
                    "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0",
                    index === 0
                      ? "bg-[#FFD700]" // 金
                      : index === 1
                        ? "bg-[#C0C0C0]" // 銀
                        : index === 2
                          ? "bg-[#CD7F32]" // 銅
                          : // 第四名以後：淺色模式灰底，深色模式深灰底
                            "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300",
                  )}
                >
                  {index + 1}
                </div>

                <div className="flex flex-col truncate">
                  {/* 修正：文字改為 text-text */}
                  <span className="text-sm font-medium text-text truncate">
                    {item.name}
                  </span>
                  {/* 修正：副標題改為 text-text-sub */}
                  {item.subtext && (
                    <span className="text-[10px] text-text-sub truncate">
                      {item.subtext}
                    </span>
                  )}
                </div>
              </div>

              {/* 數值顯示 */}
              <div className="text-sm font-bold text-primary shrink-0 pl-2">
                {item.value}{" "}
                <span className="text-[10px] font-normal text-text-sub">
                  {unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
