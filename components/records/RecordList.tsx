import { DrinkRecord } from "@/types";
import { Trash2 } from "lucide-react";

interface RecordListProps {
  records: DrinkRecord[];
  onDelete: (id: number) => void;
  onEdit?: (record: DrinkRecord) => void;
}

export function RecordList({ records, onDelete, onEdit }: RecordListProps) {
  if (records.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-200">
        <p className="text-gray-400">🍃 本日無紀錄</p>
        <p className="text-xs text-gray-300 mt-1">快去喝一杯壓壓驚（誤）</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {records.map((record) => (
        <div
          key={record.id}
          // 修正點：這裡呼叫 onEdit，如果沒有傳入 onEdit (例如在首頁)，就不會執行
          onClick={() => onEdit && onEdit(record)}
          className="ios-card flex justify-between items-center relative overflow-hidden cursor-pointer active:scale-[0.98] transition-transform group"
        >
          {/* 左側裝飾線 */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />

          <div className="pl-3">
            <div className="font-bold text-text flex items-center gap-2">
              {record.shop} - {record.item}
              {record.isTreat && (
                <span className="bg-red-50 text-red-500 text-[10px] px-1.5 py-0.5 rounded">
                  請客
                </span>
              )}
              {record.isEco && (
                <span className="bg-green-50 text-green-600 text-[10px] px-1.5 py-0.5 rounded">
                  環保
                </span>
              )}
            </div>

            <div className="text-xs text-gray-500 mt-1">
              {record.sugar}・{record.ice}
              {record.toppings.length > 0 && (
                <span className="text-primary ml-1">
                  + {record.toppings.map((t) => t.name).join(", ")}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className="text-xl font-extrabold text-text">
              ${record.finalCost}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation(); // 防止觸發編輯 Modal
                onDelete(record.id);
              }}
              className="text-gray-300 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-100"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
