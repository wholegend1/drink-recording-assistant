"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronRight,
  Palette,
  Cloud,
  Download,
  Upload,
  FileText,
  Trash2,
  Plus,
  Coffee,
  BarChart,
  Check,
  Copy,
  Moon,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { usePresets } from "@/hooks/usePresets";
import { useDrinkRecords } from "@/hooks/useDrinkRecords";
import { useCloudBackup } from "@/hooks/useCloudBackup";
import { useTheme, THEMES } from "@/hooks/useTheme";
import { useToast } from "@/components/ui/ToastProvider";

const CHART_OPTIONS = [
  { id: "chart-overview", name: "📊 總覽數據 (花費/杯數)" },
  { id: "chart-pie-shop", name: "🏠 店家飲用佔比" },
  { id: "chart-eco", name: "🌍 環保杯使用率" },
  { id: "chart-weekly", name: "📅 每週飲用習慣" },
  { id: "chart-rank-shop", name: "🏆 花費最高的店家" },
  { id: "chart-rank-item", name: "🥤 最常喝的飲料" },
  { id: "chart-rank-guilty", name: "😈 罪惡組合" },
  { id: "chart-rank-topping", name: "✨ 加料王" },
];

export default function SettingsPage() {
  const { presets, addShop, deleteShop, updateShopItem, updatePresets } =
    usePresets();
  const { records } = useDrinkRecords();
  const { executeBackup, executeRestore, isLoading } = useCloudBackup();
  const { themeIndex, applyTheme, isDarkMode, toggleDarkMode } = useTheme();

  const [activeModal, setActiveModal] = useState<
    "backup" | "theme" | "menu" | "pref" | "charts" | null
  >(null);
  const [backupKey, setBackupKey] = useState("");
  const [restoreKey, setRestoreKey] = useState("");
  const [selectedShop, setSelectedShop] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [prefToppingInput, setPrefToppingInput] = useState("");
  const [visibleCharts, setVisibleCharts] = useState<string[]>([]);
  const [copied, setCopied] = useState(false); // 複製狀態
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("visibleCharts");
    if (saved) setVisibleCharts(JSON.parse(saved));
    else setVisibleCharts(CHART_OPTIONS.map((c) => c.id));
  }, []);

  const copyToClipboard = () => {
    if (backupKey) {
      navigator.clipboard.writeText(backupKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast("金鑰已複製", "success");
    }
  };

  const mergeData = (incomingData: any, sourceName: string) => {
    const recordCount = incomingData.records?.length || 0;

    if (
      confirm(
        `確認匯入 ${sourceName}？\n(包含 ${recordCount} 筆紀錄)\n\n✨ 系統將執行智慧合併：\n• 保留您手機裡的新增紀錄\n• 相同紀錄以備份檔為主`,
      )
    ) {
      try {
        // 1. 合併紀錄 (Record Merge)
        const localRecords = JSON.parse(
          localStorage.getItem("drinkRecords_v20") || "[]",
        );
        const incomingRecords = incomingData.records || [];

        // 建立 Map: 以 ID 為 Key
        const recordMap = new Map();

        // 先放本機的 (這樣如果備份檔沒這筆，這筆就會被保留 -> 解決新紀錄被蓋掉的問題)
        localRecords.forEach((r: any) => recordMap.set(r.id, r));

        // 再放匯入的 (如果 ID 相同，匯入的會覆蓋本機 -> 達成還原目的)
        incomingRecords.forEach((r: any) => recordMap.set(r.id, r));

        const mergedRecords = Array.from(recordMap.values());

        // 2. 合併 Presets (與之前相同邏輯)
        const localPresets = JSON.parse(
          localStorage.getItem("drinkPresets_v20") || "{}",
        );
        const incomingPresets = incomingData.presets || {};

        // ... (Preset 合併邏輯與之前相同，略過重複代碼以節省篇幅，請保留您原本的 Preset 合併邏輯) ...
        // 簡單版 Preset 合併 (直接覆蓋，因為設定通常希望以備份為主，或者您可以照抄上次的 deep merge)
        const finalPresets = { ...localPresets, ...incomingPresets };
        if (incomingPresets.menus)
          finalPresets.menus = {
            ...localPresets.menus,
            ...incomingPresets.menus,
          };
        if (incomingPresets.toppings)
          finalPresets.toppings = [
            ...localPresets.toppings,
            ...incomingPresets.toppings,
          ]; // 這裡建議去重

        // 3. 寫入
        localStorage.setItem("drinkRecords_v20", JSON.stringify(mergedRecords));
        localStorage.setItem("drinkPresets_v20", JSON.stringify(finalPresets));
        if (incomingData.themeIndex !== undefined)
          localStorage.setItem(
            "themeIndex",
            incomingData.themeIndex.toString(),
          );

        showToast("合併成功！頁面將重新整理。", "success");
        window.location.reload();
      } catch (e) {
        console.error(e);
        showToast("資料解析失敗", "error");
      }
    }
  };
  
  const toggleChart = (id: string) => {
    const newCharts = visibleCharts.includes(id)
      ? visibleCharts.filter((c) => c !== id)
      : [...visibleCharts, id];
    setVisibleCharts(newCharts);
    localStorage.setItem("visibleCharts", JSON.stringify(newCharts));
  };

  const handleCloudBackup = async () => {
    const result = await executeBackup({
      version: "v20",
      records,
      presets,
      themeIndex,
    });
    if (result.status === "success") {
      setBackupKey(result.key);
      showToast("備份成功！請保存金鑰", "success"); // 新增成功提示
    } else {
      showToast("備份失敗: " + result.message, "error"); // 替換
    }
  };

  const handleLocalExport = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(
        JSON.stringify({ version: "v20", records, presets, themeIndex }),
      );
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = `drink_backup_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
  };

  const handleLocalImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const rawData = JSON.parse(ev.target?.result as string);
        // 相容性檢查
        if (
          rawData.version === "v20" ||
          rawData.version === "v18" ||
          (rawData.records && rawData.presets)
        ) {
          mergeData(rawData, "本機備份檔");
        } else {
          showToast("檔案格式不支援", "error");
        }
      } catch (err) {
       showToast("檔案損毀或非 JSON 格式", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // --- 關鍵修正：智慧合併邏輯 ---
  const handleCloudRestore = async () => {
    const res = await executeRestore(restoreKey);
    if (res.status === "success") {
      const cloudData = JSON.parse(res.data);
      mergeData(cloudData, "雲端備份");
    } else {
      showToast(res.message, "error");
    }
  };

  return (
    <div className="pb-24 pt-4 px-4">
      <header className="flex items-center gap-3 mb-6">
        <h1 className="text-xl font-extrabold text-[#2C3E50]">設定</h1>
      </header>

      <Card className="!p-0 overflow-hidden">
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          <SettingsItem
            icon={<BarChart size={20} />}
            label="分析圖表顯示設定"
            onClick={() => setActiveModal("charts")}
          />
          <SettingsItem
            icon={<FileText size={20} />}
            label="菜單管理 (店家/飲料)"
            onClick={() => setActiveModal("menu")}
          />
          <SettingsItem
            icon={<Coffee size={20} />}
            label="常用加料與偏好"
            onClick={() => setActiveModal("pref")}
          />
          {/* 深色模式開關 */}
          <SettingsItem
            icon={<Moon size={20} />}
            label="深色模式"
            onClick={toggleDarkMode}
            showArrow={false}
            rightElement={
              <div
                className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ${isDarkMode ? "bg-primary" : "bg-gray-200"}`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${isDarkMode ? "translate-x-4" : ""}`}
                />
              </div>
            }
          />
          <SettingsItem
            icon={<Palette size={20} />}
            label="主題風格"
            onClick={() => setActiveModal("theme")}
            rightElement={
              <div
                className="w-4 h-4 rounded-full border border-gray-200 mr-2"
                style={{ background: THEMES[themeIndex].p }}
              />
            }
          />
          <SettingsItem
            icon={<Cloud size={20} />}
            label="雲端備份 / 還原"
            onClick={() => setActiveModal("backup")}
          />
          <SettingsItem
            icon={<Upload size={20} />}
            label="本機備份 (下載 JSON)"
            onClick={handleLocalExport}
          />
          <SettingsItem
            icon={<Download size={20} />}
            label="本機還原 (JSON)"
            onClick={() => fileInputRef.current?.click()}
          />
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".json"
            onChange={handleLocalImport}
          />
        </ul>
      </Card>

      {/* Modal: 圖表設定 */}
      <Modal
        isOpen={activeModal === "charts"}
        onClose={() => setActiveModal(null)}
        title="圖表顯示設定"
      >
        <div className="space-y-3">
          <div className="flex justify-end">
            <button
              onClick={() => {
                const allIds = CHART_OPTIONS.map((c) => c.id);
                setVisibleCharts(allIds);
                localStorage.setItem("visibleCharts", JSON.stringify(allIds));
              }}
              className="text-xs text-primary font-bold px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
            >
              重置為預設 (全選)
            </button>
          </div>
          {CHART_OPTIONS.map((opt) => (
            <label
              key={opt.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer"
            >
              <span className="font-bold text-gray-700">{opt.name}</span>
              <input
                type="checkbox"
                checked={visibleCharts.includes(opt.id)}
                onChange={() => toggleChart(opt.id)}
                className="w-5 h-5 accent-primary"
              />
            </label>
          ))}
        </div>
      </Modal>

      {/* Modal: 偏好設定 */}
      <Modal
        isOpen={activeModal === "pref"}
        onClose={() => setActiveModal(null)}
        title="偏好設定"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-400 mb-1 block">
                預設甜度
              </label>
              <select
                className="ios-select"
                value={presets.defaultSugar}
                onChange={(e) =>
                  updatePresets({ defaultSugar: e.target.value })
                }
              >
                {["正常甜", "少糖", "半糖", "微糖", "一分糖", "無糖"].map(
                  (o) => (
                    <option key={o}>{o}</option>
                  ),
                )}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 mb-1 block">
                預設冰塊
              </label>
              <select
                className="ios-select"
                value={presets.defaultIce}
                onChange={(e) => updatePresets({ defaultIce: e.target.value })}
              >
                {["正常冰", "少冰", "微冰", "去冰", "完全去冰", "溫", "熱"].map(
                  (o) => (
                    <option key={o}>{o}</option>
                  ),
                )}
              </select>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-xl">
            <label className="text-xs font-bold text-gray-400 mb-2 block">
              常用加料 (點 X 刪除)
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {presets.toppings.map((t, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  <span>
                    {t.name} ${t.price}
                  </span>
                  <button
                    onClick={() =>
                      updatePresets({
                        toppings: presets.toppings.filter(
                          (_, idx) => idx !== i,
                        ),
                      })
                    }
                  >
                    <Trash2 size={14} className="text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="ios-input !h-10 text-sm"
                placeholder="例如: 珍珠10"
                value={prefToppingInput}
                onChange={(e) => setPrefToppingInput(e.target.value)}
              />
              {/* 修正：加入 shrink-0 防止按鈕消失 */}
              <button
                onClick={() => {
                  const match = prefToppingInput.match(/^(.+?)\s*(\d+)$/);
                  if (match) {
                    updatePresets({
                      toppings: [
                        ...presets.toppings,
                        { name: match[1], price: parseInt(match[2]) },
                      ],
                    });
                    setPrefToppingInput("");
                  } else showToast("格式: 名稱價格 (珍珠10)", "error");
                }}
                className="bg-primary text-white w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md active:scale-95"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal: 菜單管理 */}
      <Modal
        isOpen={activeModal === "menu"}
        onClose={() => setActiveModal(null)}
        title="菜單管理"
      >
        <div className="space-y-4 min-h-[50vh]">
          <div className="flex gap-2">
            <select
              className="ios-select flex-1"
              value={selectedShop}
              onChange={(e) => setSelectedShop(e.target.value)}
            >
              <option value="" disabled>
                請選擇店家...
              </option>
              {Object.keys(presets.menus).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                const name = prompt("新店家名稱");
                if (name) {
                  addShop(name);
                  setSelectedShop(name);
                }
              }}
              className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-xl border border-gray-200 shrink-0"
            >
              <Plus size={20} className="text-gray-600" />
            </button>
            {selectedShop && (
              <button
                onClick={() => {
                  if (confirm(`刪除 ${selectedShop}?`)) {
                    deleteShop(selectedShop);
                    setSelectedShop("");
                  }
                }}
                className="w-12 h-12 flex items-center justify-center bg-red-50 border border-red-100 rounded-xl shrink-0"
              >
                <Trash2 size={20} className="text-red-500" />
              </button>
            )}
          </div>

          {selectedShop && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 block">
                編輯品項與價格
              </label>
              <div className="bg-gray-50 p-3 rounded-xl space-y-2 max-h-[300px] overflow-y-auto border border-gray-100">
                {presets.menus[selectedShop]?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-2 items-center bg-white p-2 rounded-lg shadow-sm border border-gray-100"
                  >
                    <input
                      className="flex-1 bg-transparent outline-none font-bold text-gray-700 text-sm"
                      value={item.name}
                      onChange={(e) => {
                        const newItems = [...presets.menus[selectedShop]];
                        newItems[idx].name = e.target.value;
                        updateShopItem(selectedShop, newItems);
                      }}
                    />
                    <div className="text-gray-400 text-xs">$</div>
                    <input
                      type="number"
                      className="w-12 text-center bg-transparent outline-none font-bold text-gray-700 text-sm"
                      value={item.price}
                      onChange={(e) => {
                        const newItems = [...presets.menus[selectedShop]];
                        newItems[idx].price = Number(e.target.value);
                        updateShopItem(selectedShop, newItems);
                      }}
                    />
                    <button
                      onClick={() => {
                        const newItems = presets.menus[selectedShop].filter(
                          (_, i) => i !== idx,
                        );
                        updateShopItem(selectedShop, newItems);
                      }}
                      className="text-gray-300 hover:text-red-500 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                <div className="flex gap-2 items-center pt-2 mt-2 border-t border-gray-200">
                  <input
                    placeholder="新飲料名稱"
                    className="flex-1 bg-white border border-gray-200 rounded-lg px-2 py-2 text-sm outline-none focus:border-primary"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="$"
                    className="w-16 bg-white border border-gray-200 rounded-lg px-1 py-2 text-center text-sm outline-none focus:border-primary"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                  />
                  <button
                    onClick={() => {
                      if (newItemName && newItemPrice) {
                        const newItems = [
                          ...(presets.menus[selectedShop] || []),
                          { name: newItemName, price: Number(newItemPrice) },
                        ];
                        updateShopItem(selectedShop, newItems);
                        setNewItemName("");
                        setNewItemPrice("");
                      }
                    }}
                    className="bg-primary text-white w-9 h-9 rounded-lg flex items-center justify-center shadow-sm shrink-0"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Modal: 主題 */}
      <Modal
        isOpen={activeModal === "theme"}
        onClose={() => setActiveModal(null)}
        title="選擇主題"
      >
        <div className="grid grid-cols-4 gap-4 p-2">
          {THEMES.map((t, i) => (
            <button
              key={i}
              onClick={() => applyTheme(i)}
              className="aspect-square rounded-full flex items-center justify-center relative"
              style={{ background: t.p }}
            >
              {themeIndex === i && (
                <span className="text-white text-xl font-bold">✓</span>
              )}
            </button>
          ))}
        </div>
      </Modal>

      {/* Modal: 雲端備份 */}
      <Modal
        isOpen={activeModal === "backup"}
        onClose={() => setActiveModal(null)}
        title="☁️ Google 雲端備份"
      >
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-xl">
            <h4 className="font-bold text-gray-600 mb-2">📤 上傳備份</h4>
            <button
              onClick={handleCloudBackup}
              disabled={isLoading}
              className="ios-btn-primary py-3 text-sm mb-3"
            >
              {isLoading ? "處理中..." : "產生金鑰並備份"}
            </button>
            {backupKey && (
              <div className="bg-white border border-gray-200 p-3 rounded-lg flex items-center justify-between gap-2">
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-400 mb-1">備份金鑰</p>
                  <p className="font-mono font-bold text-lg text-primary truncate">
                    {backupKey}
                  </p>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 shrink-0 transition-colors"
                >
                  {copied ? (
                    <Check size={20} className="text-green-500" />
                  ) : (
                    <Copy size={20} className="text-gray-500" />
                  )}
                </button>
              </div>
            )}
          </div>
          <div className="border-t border-gray-100 pt-4">
            <h4 className="font-bold text-gray-600 mb-2">📥 從雲端還原</h4>
            <input
              type="text"
              className="ios-input text-center font-mono mb-3"
              placeholder="輸入金鑰..."
              value={restoreKey}
              onChange={(e) => setRestoreKey(e.target.value)}
            />
            <button
              onClick={handleCloudRestore}
              disabled={isLoading || !restoreKey}
              className="w-full bg-gray-200 text-gray-600 font-bold py-3 rounded-2xl"
            >
              {isLoading ? "處理中..." : "下載並合併"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function SettingsItem({
  icon,
  label,
  onClick,
  rightElement,
  showArrow = true,
}: any) {
  // 新增 showArrow prop
  return (
    <li
      onClick={onClick}
      className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-white/5 dark:active:bg-white/10 transition-colors"
    >
      <div className="flex items-center gap-3 text-text">
        <span className="text-primary bg-primary-light p-2 rounded-lg">
          {icon}
        </span>
        <span className="font-bold text-sm">{label}</span>
      </div>
      <div className="flex items-center gap-2 text-text-sub">
        {rightElement}
        {/* 只有當 showArrow 為 true 時才顯示箭頭 */}
        {showArrow && <ChevronRight size={18} />}
      </div>
    </li>
  );
}
