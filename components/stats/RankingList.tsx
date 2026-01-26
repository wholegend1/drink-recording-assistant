import { DrinkRecord } from "@/types";
import clsx from "clsx";

interface RankingListProps {
  title: string;
  data: { name: string; value: number; subtext?: string }[];
  unit?: string;
}

export function RankingList({ title, data, unit = "次" }: RankingListProps) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-4">
      <h3 className="font-bold text-[#2C3E50] mb-4 flex items-center gap-2">
        {title}
      </h3>

      {data.length === 0 ? (
        <p className="text-xs text-gray-300 text-center py-4">尚無資料</p>
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
                      ? "bg-[#FFD700]"
                      : index === 1
                        ? "bg-[#C0C0C0]"
                        : index === 2
                          ? "bg-[#CD7F32]"
                          : "bg-gray-200",
                  )}
                >
                  {index + 1}
                </div>

                <div className="flex flex-col truncate">
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {item.name}
                  </span>
                  {item.subtext && (
                    <span className="text-[10px] text-gray-400 truncate">
                      {item.subtext}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-sm font-bold text-primary shrink-0 pl-2">
                {item.value}{" "}
                <span className="text-[10px] font-normal text-gray-400">
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
