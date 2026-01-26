"use client";

import { useState, useEffect } from "react";
import { DrinkRecord, Topping } from "@/types";
import { usePresets } from "@/hooks/usePresets";
import { format, isAfter, startOfToday, parseISO } from "date-fns";
import { Plus, X } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

interface AddDrinkFormProps {
  onSubmit: (record: DrinkRecord) => void;
  onClose: () => void;
  initialDate?: Date;
  initialData?: DrinkRecord;
}

export function AddDrinkForm({
  onSubmit,
  onClose,
  initialDate,
  initialData,
}: AddDrinkFormProps) {
  const { presets, learnMenu, updatePresets } = usePresets();
  const { showToast } = useToast();

  const [date, setDate] = useState(
    initialData?.date ||
      (initialDate
        ? format(initialDate, "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd")),
  );
  const [shop, setShop] = useState(initialData?.shop || "");
  const [item, setItem] = useState(initialData?.item || "");
  const [price, setPrice] = useState<number | "">(
    initialData?.priceOriginal || "",
  );

  const [sugar, setSugar] = useState(initialData?.sugar || "半糖");
  const [ice, setIce] = useState(initialData?.ice || "少冰");

  const [toppings, setToppings] = useState<Topping[]>(
    initialData?.toppings || [],
  );
  const [isEco, setIsEco] = useState(initialData?.isEco || false);
  const [isTreat, setIsTreat] = useState(initialData?.isTreat || false);

  const [customToppingName, setCustomToppingName] = useState("");
  const [customToppingPrice, setCustomToppingPrice] = useState<number | "">("");

  // 預設值同步
  useEffect(() => {
    if (!initialData) {
      if (presets.defaultSugar) setSugar(presets.defaultSugar);
      if (presets.defaultIce) setIce(presets.defaultIce);
    }
  }, [presets.defaultSugar, presets.defaultIce, initialData]);

  // 自動填入價格
  useEffect(() => {
    if (shop && item && presets.menus[shop]) {
      if (initialData && initialData.item === item && initialData.priceOriginal)
        return;
      const found = presets.menus[shop].find((m) => m.name === item);
      if (found) setPrice(found.price);
    }
  }, [shop, item, presets.menus, initialData]);

  // --- 嚴格數值處理 (解決 0123 與 點擊清空問題) ---

  // 1. 禁止輸入無效符號 (小數點、負號、e)
  const preventInvalidKeys = (e: React.KeyboardEvent) => {
    if ([".", "e", "E", "-", "+"].includes(e.key)) {
      e.preventDefault();
    }
  };

  // 2. 處理數值變更 (強制去除前導零)
  const handleIntegerChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: number | "") => void,
  ) => {
    const rawVal = e.target.value;

    // 如果全空，設為空字串
    if (rawVal === "") {
      setter("");
      return;
    }

    // 強制轉為整數 (這會自動把 "035" 變成 35)
    const intVal = parseInt(rawVal, 10);

    // 更新狀態 (避免 NaN)
    if (!isNaN(intVal)) {
      setter(intVal);
    }
  };

  // 3. 聚焦時清空 0 (使用 Number() 轉型檢查，確保字串 "0" 也能被抓到)
  const handleFocusClear = (
    val: number | "",
    setter: (val: number | "") => void,
  ) => {
    if (Number(val) === 0) {
      setter("");
    }
  };

  // --- 日期檢查邏輯 ---
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDateStr = e.target.value;
    const newDate = parseISO(newDateStr);
    const today = startOfToday();

    if (isAfter(newDate, today)) {
      showToast("不能選擇未來日期！已跳回今天", "error");
      setDate(format(new Date(), "yyyy-MM-dd"));
    } else {
      setDate(newDateStr);
    }
  };

  // --- 加料邏輯區 ---

  const handleAddTopping = (name: string, priceVal: number) => {
    const exists = toppings.find((t) => t.name === name);
    if (exists) {
      updateTopping(toppings.indexOf(exists), {
        count: ((exists.count || 1) % 3) + 1,
      });
    } else {
      setToppings([
        ...toppings,
        { name, price: priceVal, count: 1, attr: "正常" },
      ]);
    }
  };

  const addCustomTopping = () => {
    if (!customToppingName.trim()) {
      showToast("請輸入加料名稱", "error");
      return;
    }
    // 允許 0 元，但不能為空字串
    if (customToppingPrice === "") {
      showToast("請輸入加料價格", "error");
      return;
    }

    const name = customToppingName.trim();
    const priceVal = Number(customToppingPrice);

    handleAddTopping(name, priceVal);

    const isExistInPresets = presets.toppings.some((t) => t.name === name);
    if (!isExistInPresets) {
      updatePresets({
        toppings: [...presets.toppings, { name, price: priceVal }],
      });
    }

    setCustomToppingName("");
    setCustomToppingPrice("");
  };

  const updateTopping = (index: number, updates: Partial<Topping>) => {
    const newToppings = [...toppings];
    newToppings[index] = { ...newToppings[index], ...updates };
    setToppings(newToppings);
  };

  const toggleToppingAttr = (current: string = "正常") => {
    if (current === "正常") return "多";
    if (current === "多") return "少";
    return "正常";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!shop.trim()) {
      showToast("請輸入店家名稱！", "error");
      return;
    }
    if (!item.trim()) {
      showToast("請輸入飲料品項！", "error");
      return;
    }
    if (price === "" || price < 0) {
      showToast("請輸入正確價格！", "error");
      return;
    }
    if (!sugar) {
      showToast("請選擇甜度！", "error");
      return;
    }
    if (!ice) {
      showToast("請選擇冰塊！", "error");
      return;
    }

    const toppingTotal = toppings.reduce(
      (sum, t) => sum + t.price * (t.count || 1),
      0,
    );
    let finalCost = Number(price) + toppingTotal;
    if (isTreat) finalCost = 0;
    else if (isEco) finalCost = Math.max(0, finalCost - 5);

    const newRecord: DrinkRecord = {
      id: initialData?.id || Date.now(),
      date,
      shop,
      item,
      priceOriginal: Number(price),
      finalCost,
      toppings,
      sugar,
      ice,
      isEco,
      isTreat,
    };

    learnMenu(shop, item, Number(price));
    onSubmit(newRecord);
    showToast(initialData ? "更新成功！" : "紀錄已儲存！", "success");
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pb-10">
      {/* 日期 */}
      <div className="flex justify-center">
        <input
          type="date"
          value={date}
          onChange={handleDateChange}
          className="bg-input-bg border-none rounded-xl px-4 py-2 font-bold text-text outline-none text-center"
        />
      </div>

      {/* 店家 */}
      <div>
        <label className="text-xs font-bold text-text-sub mb-1 block">
          店家名稱
        </label>
        <input
          list="shopList"
          value={shop}
          onChange={(e) => setShop(e.target.value)}
          placeholder="請選擇或輸入店家..."
          className="ios-input"
        />
        <datalist id="shopList">
          {Object.keys(presets.menus).map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </div>

      {/* 品項與價格 */}
      <div className="flex gap-3">
        <div className="flex-[2]">
          <label className="text-xs font-bold text-text-sub mb-1 block">
            飲料品項
          </label>
          <input
            list="itemList"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder="品項..."
            className="ios-input"
          />
          <datalist id="itemList">
            {shop &&
              presets.menus[shop]?.map((m) => (
                <option key={m.name} value={m.name} />
              ))}
          </datalist>
        </div>
        <div className="flex-1">
          <label className="text-xs font-bold text-text-sub mb-1 block">
            價格
          </label>
          <input
            type="number"
            value={price}
            // 修正：擋住小數點
            onKeyDown={preventInvalidKeys}
            // 修正：強制去零
            onChange={(e) => handleIntegerChange(e, setPrice)}
            // 修正：點擊清空 0
            onFocus={() => handleFocusClear(price, setPrice)}
            placeholder="$"
            className="ios-input text-center"
          />
        </div>
      </div>

      {/* 甜度冰塊 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-text-sub mb-1 block">
            甜度
          </label>
          <select
            value={sugar}
            onChange={(e) => setSugar(e.target.value)}
            className="ios-select"
          >
            {["正常甜", "少糖", "半糖", "微糖", "一分糖", "無糖"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-text-sub mb-1 block">
            冰塊
          </label>
          <select
            value={ice}
            onChange={(e) => setIce(e.target.value)}
            className="ios-select"
          >
            {["正常冰", "少冰", "微冰", "去冰", "完全去冰", "溫", "熱"].map(
              (o) => (
                <option key={o}>{o}</option>
              ),
            )}
          </select>
        </div>
      </div>

      {/* 加料區 */}
      <div>
        <label className="text-xs font-bold text-primary mb-2 flex items-center gap-1">
          ✨ 加料區
        </label>
        <div className="bg-input-bg/50 p-3 rounded-2xl border border-border">
          {/* 常用加料 */}
          {presets.toppings.length > 0 && (
            <div className="mb-3">
              <span className="text-[10px] text-text-sub mb-1.5 block">
                常用加料 (點擊加入)
              </span>
              <div className="flex flex-wrap gap-2">
                {presets.toppings.map((t, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => handleAddTopping(t.name, t.price)}
                    className="bg-card-bg border border-border px-3 py-1 rounded-full text-xs font-bold text-text shadow-sm hover:border-primary active:scale-95 transition-all"
                  >
                    {t.name} ${t.price}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 自訂加料 (雙欄位) */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={customToppingName}
              onChange={(e) => setCustomToppingName(e.target.value)}
              placeholder="加料名稱 (例: 椰果)"
              className="flex-[2] min-w-0 bg-card-bg border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <input
              type="number"
              value={customToppingPrice}
              // 修正：擋住小數點
              onKeyDown={preventInvalidKeys}
              // 修正：強制去零
              onChange={(e) => handleIntegerChange(e, setCustomToppingPrice)}
              // 修正：點擊清空 0
              onFocus={() =>
                handleFocusClear(customToppingPrice, setCustomToppingPrice)
              }
              placeholder="$"
              className="flex-1 min-w-0 bg-card-bg border border-border rounded-xl px-3 py-2 text-sm outline-none text-center focus:border-primary"
            />
            <button
              type="button"
              onClick={addCustomTopping}
              className="bg-accent text-white w-10 rounded-xl flex items-center justify-center shadow-sm active:scale-95 shrink-0"
            >
              <Plus size={20} />
            </button>
          </div>

          {/* 已選列表 */}
          <div className="space-y-2">
            {toppings.map((t, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-card-bg p-2 rounded-xl border-l-4 border-primary shadow-sm"
              >
                <span className="font-bold text-text text-sm ml-1">
                  {t.name} (${t.price})
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      updateTopping(i, { count: ((t.count || 1) % 3) + 1 })
                    }
                    className="w-8 h-7 bg-input-bg rounded-lg text-xs font-bold text-text-sub hover:text-primary transition-colors border border-transparent hover:border-primary/30"
                  >
                    x{t.count || 1}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateTopping(i, { attr: toggleToppingAttr(t.attr) })
                    }
                    className="w-10 h-7 bg-input-bg rounded-lg text-xs font-bold text-text-sub hover:text-primary transition-colors border border-transparent hover:border-primary/30"
                  >
                    {t.attr || "正常"}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setToppings(toppings.filter((_, idx) => idx !== i))
                    }
                    className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setIsEco(!isEco)}
          className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${isEco ? "border-primary bg-primary-light text-primary-dark" : "border-border bg-card-bg text-text-sub"}`}
        >
          🌍 環保杯 -5
        </button>
        <button
          type="button"
          onClick={() => setIsTreat(!isTreat)}
          className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${isTreat ? "border-accent bg-[#FFF0F0] dark:bg-red-900/20 text-accent" : "border-border bg-card-bg text-text-sub"}`}
        >
          🎁 請客 $0
        </button>
      </div>

      <button type="submit" className="ios-btn-primary">
        {initialData ? "更新紀錄" : "儲存紀錄"}
      </button>
    </form>
  );
}
