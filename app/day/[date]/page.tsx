"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useDrinkRecords } from "@/hooks/useDrinkRecords";
import { RecordList } from "@/components/records/RecordList";
import { Modal } from "@/components/ui/Modal";
import { AddDrinkForm } from "@/components/records/AddDrinkForm";
import { DrinkRecord } from "@/types";
interface DayDetailPageProps {
  params: {
    date: string;
  };
}

export default function DayDetailPage({ params }: DayDetailPageProps) {
  const router = useRouter();
  const date = params.date;

  const { records, deleteRecord, updateRecord, addRecord } = useDrinkRecords();
  const [editingRecord, setEditingRecord] = useState<DrinkRecord | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const dayRecords = records.filter((r) => r.date === date);

  // 計算本日總花費
  const dayTotal = dayRecords.reduce((sum, r) => sum + r.finalCost, 0);

  useEffect(() => {
    const handleOpenModal = () => setIsAddModalOpen(true);
    window.addEventListener("open-add-drink-modal", handleOpenModal);
    return () =>
      window.removeEventListener("open-add-drink-modal", handleOpenModal);
  }, []);

  return (
    <div className="pt-4 pb-24 px-2">
      <header className="flex items-center gap-3 mb-6 px-2">
        <button
          onClick={() => router.push("/")}
          className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl active:scale-95 transition-transform"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-text">{date}</h1>
          {/* 新增：本日花費顯示 */}
          <p className="text-sm font-bold text-gray-400 mt-0.5">
            本日花費金額{" "}
            <span className="text-primary text-base">${dayTotal}</span>
          </p>
        </div>
      </header>

      <div className="ios-card">
        <RecordList
          records={dayRecords}
          onDelete={deleteRecord}
          onEdit={(record) => setEditingRecord(record)}
        />
      </div>

      <Modal
        isOpen={!!editingRecord}
        onClose={() => setEditingRecord(null)}
        title="編輯紀錄"
      >
        {editingRecord && (
          <AddDrinkForm
            initialData={editingRecord}
            onClose={() => setEditingRecord(null)}
            onSubmit={(updatedRecord) => {
              updateRecord(updatedRecord);
              setEditingRecord(null);
            }}
          />
        )}
      </Modal>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="新增飲料"
      >
        <AddDrinkForm
          initialDate={new Date(date)}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={(record) => {
            addRecord(record);
          }}
        />
      </Modal>
    </div>
  );
}
