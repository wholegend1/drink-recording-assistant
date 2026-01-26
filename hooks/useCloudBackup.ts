"use client";

import { useState } from "react";

export function useCloudBackup() {
  const [isLoading, setIsLoading] = useState(false);

  // 產生 4組 4碼 混合大小寫與數字的字串
  const generateComplexKey = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const segment = () =>
      Array(4)
        .fill(0)
        .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
        .join("");
    return `${segment()}-${segment()}-${segment()}-${segment()}`;
  };

  const executeBackup = async (fullData: any) => {
    setIsLoading(true);

    // 使用新的金鑰產生邏輯
    const newKey = generateComplexKey();

    try {
      const res = await fetch("/api/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: newKey,
          data: JSON.stringify(fullData),
        }),
      });

      const result = await res.json();

      if (result.status === "success") {
        result.key = newKey;
      }
      return result;
    } catch (error) {
      console.error(error);
      return { status: "error", message: "連線錯誤" };
    } finally {
      setIsLoading(false);
    }
  };

  const executeRestore = async (key: string) => {
    setIsLoading(true);
    try {
      if (!key) throw new Error("請輸入金鑰");
      const res = await fetch(`/api/backup?code=${key}`);
      return await res.json();
    } catch (error: any) {
      return { status: "error", message: error.message || "連線錯誤" };
    } finally {
      setIsLoading(false);
    }
  };

  return { executeBackup, executeRestore, isLoading };
}
