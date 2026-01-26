'use client'; // 必須標記為 Client Component，因為使用了 localStorage

import { useState, useEffect, useCallback } from 'react';
import { DrinkRecord } from '@/types';

// 關鍵：這裡必須跟舊版 index.html 裡的 key 一模一樣！
const STORAGE_KEY = "drinkRecords_v20";

export function useDrinkRecords() {
  const [records, setRecords] = useState<DrinkRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false); // 標記是否已讀取完成

  // 1. 初始化讀取 (只在 Client 端執行)
  useEffect(() => {
    try {
      const localData = localStorage.getItem(STORAGE_KEY);
      if (localData) {
        const parsedData = JSON.parse(localData);
        // 這裡可以做簡單的資料清洗 (Migration)，防止舊資料缺欄位炸開
        const safeData = parsedData.map((r: any) => ({
          ...r,
          isEco: r.isEco ?? false,   // 如果舊資料沒有 isEco，預設為 false
          isTreat: r.isTreat ?? false,
          toppings: r.toppings || []
        }));
        setRecords(safeData);
      }
    } catch (e) {
      console.error('讀取紀錄失敗:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 2. 儲存 Helper (每次變更都自動寫入 localStorage)
  const saveToStorage = (newRecords: DrinkRecord[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newRecords));
    setRecords(newRecords);
  };

  // 3. 新增紀錄
  const addRecord = useCallback((newRecord: DrinkRecord) => {
    setRecords((prev) => {
      const updated = [...prev, newRecord];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // 4. 刪除紀錄
  const deleteRecord = useCallback((id: number) => {
    if (!confirm('確定要刪除這筆紀錄嗎？')) return;
    
    setRecords((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // 5. 更新紀錄 (編輯用)
  const updateRecord = useCallback((updatedRecord: DrinkRecord) => {
    setRecords((prev) => {
      const updated = prev.map((r) => 
        r.id === updatedRecord.id ? updatedRecord : r
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // 回傳這些東西給 UI 使用
  return {
    records,
    isLoaded,
    addRecord,
    deleteRecord,
    updateRecord
  };
}