import clsx from "clsx";
import { format, isSameMonth, isToday } from "date-fns";

interface DayCellProps {
  date: Date;
  currentMonth: Date;
  isSelected: boolean;
  recordCount: number; // 當天喝了幾杯
  onClick: () => void;
}

export function DayCell({
  date,
  currentMonth,
  isSelected,
  recordCount,
  onClick,
}: DayCellProps) {
  const isCurrentMonth = isSameMonth(date, currentMonth);
  const isDateToday = isToday(date);

  return (
    <div
      onClick={onClick}
      className={clsx(
        "aspect-square flex flex-col items-center justify-center relative rounded-xl text-sm font-medium cursor-pointer transition-all active:scale-95",
        !isCurrentMonth && "text-gray-300 opacity-50", // 非本月日期變淡
        isDateToday && "border-2 border-[#FF5252] text-[#FF5252] font-bold", // 今日樣式
        isSelected && "bg-gray-800 text-white shadow-inner", // 選中樣式
        !isSelected &&
          recordCount > 0 &&
          "bg-[#E8F3EB] text-[#4A6354] font-bold border-b-2 border-[#6B8E78]", // 有紀錄樣式
        !isCurrentMonth && "pointer-events-none", // 鎖定非本月點擊(可選)
      )}
    >
      {format(date, "d")}

      {/* 右上角紅色小圓點 (杯數) */}
      {recordCount > 0 && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF5252] text-white text-[10px] rounded-full flex items-center justify-center shadow-sm">
          {recordCount}
        </div>
      )}
    </div>
  );
}
