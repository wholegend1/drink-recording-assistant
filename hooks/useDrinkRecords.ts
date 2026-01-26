"use client";

import { useState, useEffect, useCallback } from "react";
import { DrinkRecord } from "@/types";

const STORAGE_KEY = "drinkRecords_v20";

export function useDrinkRecords() {
  const [records, setRecords] = useState<DrinkRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. 初始化讀取
  useEffect(() => {
    try {
      const localData = localStorage.getItem(STORAGE_KEY);
      if (localData) {
        const parsedData = JSON.parse(localData);
        const safeData = parsedData.map((r: any) => ({
          ...r,
          isEco: r.isEco ?? false,
          isTreat: r.isTreat ?? false,
          toppings: r.toppings || [],
        }));
        setRecords(safeData);
      }
    } catch (e) {
      console.error("讀取紀錄失敗:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // ... (addRecord, deleteRecord, updateRecord 保持不變)
  const addRecord = useCallback((newRecord: DrinkRecord) => {
    setRecords((prev) => {
      const updated = [...prev, newRecord];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteRecord = useCallback((id: number) => {
    if (!confirm("確定要刪除這筆紀錄嗎？")) return;
    setRecords((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateRecord = useCallback((updatedRecord: DrinkRecord) => {
    setRecords((prev) => {
      const updated = prev.map((r) =>
        r.id === updatedRecord.id ? updatedRecord : r,
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // ★★★ 新增：覆寫所有紀錄 (給雲端還原使用) ★★★
  const setAllRecords = useCallback((newRecords: DrinkRecord[]) => {
    setRecords(newRecords);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newRecords));
  }, []);

  return {
    records,
    isLoaded,
    addRecord,
    deleteRecord,
    updateRecord,
    setAllRecords, // 記得匯出
  };
}
