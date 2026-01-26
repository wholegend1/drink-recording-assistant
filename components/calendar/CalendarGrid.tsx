"use client";

import { format, isSameDay, isToday, isAfter, startOfToday } from "date-fns";
import { getCalendarDays } from "@/lib/date-utils";
import { DrinkRecord } from "@/types";
import clsx from "clsx";

interface CalendarGridProps {
  currentDate: Date;
  selectedDate: Date;
  records: DrinkRecord[];
  onDateSelect: (date: Date) => void;
}

export function CalendarGrid({
  currentDate,
  selectedDate,
  records,
  onDateSelect,
}: CalendarGridProps) {
  const days = getCalendarDays(currentDate);
  const today = startOfToday();

  const getDayCount = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return records.filter((r) => r.date === dateStr).length;
  };

  return (
    <div className="grid grid-cols-7 gap-y-3 gap-x-2 p-2">
      {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
        <div
          key={day}
          className="text-center text-xs font-bold text-text-sub mb-2"
        >
          {day}
        </div>
      ))}

      {days.map((date, idx) => {
        const count = getDayCount(date);
        const isSelected = isSameDay(date, selectedDate);
        const isCurrentMonth = date.getMonth() === currentDate.getMonth();
        const isDateToday = isToday(date);
        const hasRecords = count > 0;
        const isFuture = isAfter(date, today);

        return (
          <div key={idx} className="flex justify-center relative">
            <button
              onClick={() => {
                if (!isFuture) onDateSelect(date);
              }}
              disabled={isFuture}
              className={clsx(
                "w-10 h-10 flex items-center justify-center rounded-[14px] text-sm font-bold transition-all relative border-2",

                isFuture
                  ? "border-transparent text-border bg-transparent cursor-not-allowed opacity-30"
                  : isSelected
                    ? "border-primary bg-card-bg text-primary shadow-sm z-10 scale-105"
                    : hasRecords
                      ? "border-transparent bg-primary-light text-primary shadow-calendar hover:opacity-80"
                      : isDateToday
                        ? // 修正：bg-white -> bg-card-bg
                          "border-transparent bg-card-bg text-primary shadow-calendar ring-1 ring-inset ring-border"
                        : // 修正：bg-white -> bg-card-bg, text-gray-400 -> text-text-sub
                          "border-transparent bg-card-bg text-text-sub shadow-calendar hover:bg-input-bg",

                !isCurrentMonth && !isFuture && "opacity-30",
              )}
            >
              {format(date, "d")}

              {/* 右上角 Badge (使用 theme-badge 變數) */}
              {!isFuture && count > 0 && (
                <span
                  className={clsx(
                    "absolute -top-1.5 -right-1.5 w-5 h-5",
                    "bg-badge text-white text-[10px] font-bold flex items-center justify-center",
                    "rounded-full border-2 border-card-bg shadow-sm z-20",
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}
