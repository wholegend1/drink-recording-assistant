"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { addMonths, subMonths, format, startOfToday, isAfter } from "date-fns";
import { ChevronLeft, ChevronRight, RotateCcw, Settings } from "lucide-react";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { Modal } from "@/components/ui/Modal";
import { AddDrinkForm } from "@/components/records/AddDrinkForm";
import { useDrinkRecords } from "@/hooks/useDrinkRecords";

const SLOGANS = [
  "多喝水沒事，沒事多喝水，錢包更快樂！",
  "今天沒喝飲料，離財富自由又近了一步～",
  "水是最好的飲料，健康是最大的財富。",
  "忍住不喝飲料的你，今天特別帥氣！",
  "省下的飲料錢，是為了更快樂的明天。",
  "多喝水身體好，心情自然會變好。",
  "今天也是個健康的省錢小天才呢！",
  "沒喝飲料的一天，清爽無負擔，開心！",
  "你的腎臟和錢包同時對你表示感謝 <3",
  "白開水最甘甜，健康的快樂最長久。",
  "堅持多喝水，皮膚水噹噹，心情亮晶晶。",
  "恭喜達成「今日無糖」成就，健康值 +100！",
  "多喝水沒事，沒事多喝水，錢包更快樂！",
  "今天沒喝飲料，離財富自由又近了一步～",
  "水是最好的飲料，健康是最大的財富。",
  "忍住不喝飲料的你，今天特別帥氣！",
  "省下的飲料錢，是為了更快樂的明天。",
  "多喝水身體好，心情自然會變好。",
  "今天也是個健康的省錢小天才呢！",
  "沒喝飲料的一天，清爽無負擔，開心！",
  "你的腎臟和錢包同時對你表示感謝 <3",
  "白開水最甘甜，健康的快樂最長久。",
  "堅持多喝水，皮膚水噹噹，心情亮晶晶。",
  "恭喜達成「今日無糖」成就，健康值 +100！",
];

export default function HomePage() {
  const router = useRouter();
  const { records, isLoaded, addRecord } = useDrinkRecords();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [slogan, setSlogan] = useState("");

  useEffect(() => {
    setSlogan(SLOGANS[Math.floor(Math.random() * SLOGANS.length)]);
  }, []);

  useEffect(() => {
    const handleOpenModal = () => setIsModalOpen(true);
    window.addEventListener("open-add-drink-modal", handleOpenModal);
    return () =>
      window.removeEventListener("open-add-drink-modal", handleOpenModal);
  }, []);

  const today = startOfToday();
  const monthTotal = useMemo(() => {
    const prefix = format(currentDate, "yyyy-MM");
    return records
      .filter((r) => r.date.startsWith(prefix))
      .reduce((sum, r) => sum + r.finalCost, 0);
  }, [records, currentDate]);

  const todayStatus = useMemo(() => {
    const todayStr = format(new Date(), "yyyy-MM-dd");
    return records
      .filter((r) => r.date === todayStr)
      .reduce((sum, r) => sum + r.finalCost, 0);
  }, [records]);

  if (!isLoaded)
    return <div className="p-10 text-center text-gray-400">載入中...</div>;

  return (
    <div className="pb-24 pt-4 px-2">
      {/* Header */}
      <header className="flex justify-between items-center mb-6 px-2 sticky top-0 bg-bg/90 backdrop-blur-md z-10 py-2">
        <h1 className="text-xl font-extrabold text-text tracking-wide">
          月底破產兇手名單
        </h1>
        <button
          onClick={() => router.push("/settings")}
          className="w-10 h-10 flex items-center justify-center bg-card-bg rounded-full border border-border shadow-sm active:scale-95 transition-transform"
        >
          <Settings size={20} className="text-primary" />
        </button>
      </header>

      {/* 今日戰況 */}
      <div className="ios-card text-center py-6 mb-4">
        <div className="text-sm text-text-sub mb-1">📅 今日戰況</div>
        {todayStatus > 0 ? (
          // 修正：使用 text-primary
          <div className="text-4xl font-extrabold text-primary my-2">
            ${todayStatus}
          </div>
        ) : (
          <div className="text-sm text-text-sub py-2 px-4 leading-relaxed">
            {slogan}
          </div>
        )}
      </div>

      {/* 月曆 */}
      <div className="ios-card p-4 mb-4">
        <div className="flex justify-between items-center mb-4 relative">
          {/* 左箭頭 */}
          <button
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="w-10 h-10 flex items-center justify-center border border-border rounded-xl hover:bg-input-bg text-text-sub active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>

          {/* 中間標題區塊 (包含標題 + 回到今天按鈕) */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">
              {format(currentDate, "yyyy / MM")}
            </span>

            {/* 新增：回到本月按鈕 (只有當不在本月時才顯示，或者一直顯示也可以) */}
            {format(currentDate, "yyyy-MM") !==
              format(new Date(), "yyyy-MM") && (
              <button
                onClick={() => setCurrentDate(new Date())}
                className="p-1.5 bg-primary-light text-primary rounded-lg hover:opacity-80 active:scale-95 transition-all"
                title="回到本月"
              >
                <RotateCcw size={14} strokeWidth={2.5} />
              </button>
            )}
          </div>

          {/* 右箭頭 */}
          <button
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="w-10 h-10 flex items-center justify-center border border-border rounded-xl hover:bg-input-bg text-text-sub active:scale-95"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <CalendarGrid
          currentDate={currentDate}
          selectedDate={new Date()} // 這裡保持 new Date() 代表永遠 highlight 今天，或者你可以改成 state 讓使用者選
          records={records}
          onDateSelect={(date) => {
            if (!isAfter(date, today)) {
              router.push(`/day/${format(date, "yyyy-MM-dd")}`);
            }
          }}
        />
      </div>

      {/* 本月花費 (已修正為使用 primary 變數) */}
      <div className="bg-primary-light rounded-2xl p-6 text-center shadow-sm border border-primary/20">
        <div className="text-xs font-bold text-primary-dark mb-1">
          本月目前花費
        </div>
        <div className="text-3xl font-extrabold text-primary">
          ${monthTotal}
        </div>
      </div>

      {/* 新增紀錄 Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="新增飲料"
      >
        <AddDrinkForm
          onClose={() => setIsModalOpen(false)}
          onSubmit={(record) => {
            addRecord(record);
            router.push(`/day/${record.date}`); // 新增後跳轉查看
          }}
        />
      </Modal>
    </div>
  );
}
