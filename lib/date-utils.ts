import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  isFuture,
  isToday,
} from "date-fns";

export const formatDate = (date: Date | string) =>
  format(new Date(date), "yyyy-MM-dd");

export const getCalendarDays = (currentDate: Date) => {
  const monthStart = startOfMonth(currentDate);
  // 修正這裡：原本寫錯成 currentStart，應該是 currentDate 或 monthStart
  const monthEnd = endOfMonth(currentDate);

  const startDate = startOfWeek(monthStart); // 預設週日開始
  const endDate = endOfWeek(monthEnd);

  return eachDayOfInterval({ start: startDate, end: endDate });
};

export const isDateFuture = (date: Date) => isFuture(date);
export const isSameDate = (d1: Date, d2: Date) => isSameDay(d1, d2);
// 補上這個 export，因為 DayCell 元件有用到
export { isToday, format, isSameMonth };
