"use client";

import { useState, useEffect } from "react";
import { Presets } from "@/types";

const PRESET_KEY = "drinkPresets_v20";

const defaultPresets: Presets = {
  menus: {},
  toppings: [],
  defaultSugar: "半糖",
  defaultIce: "少冰",
};

export function usePresets() {
  const [presets, setPresets] = useState<Presets>(defaultPresets);

  // 初始化讀取
  useEffect(() => {
    const localData = localStorage.getItem(PRESET_KEY);
    if (localData) {
      try {
        setPresets({ ...defaultPresets, ...JSON.parse(localData) });
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // 內部儲存 Helper
  const save = (newPresets: Presets) => {
    setPresets(newPresets);
    localStorage.setItem(PRESET_KEY, JSON.stringify(newPresets));
  };

  // 1. 自動學習 (保留舊功能)
  const learnMenu = (shop: string, item: string, price: number) => {
    const newMenus = { ...presets.menus };
    if (!newMenus[shop]) newMenus[shop] = [];
    if (!newMenus[shop].some((m) => m.name === item)) {
      newMenus[shop] = [...newMenus[shop], { name: item, price }];
      save({ ...presets, menus: newMenus });
    }
  };

  // 2. 菜單管理功能
  const addShop = (shopName: string) => {
    if (presets.menus[shopName]) return;
    save({ ...presets, menus: { ...presets.menus, [shopName]: [] } });
  };

  const deleteShop = (shopName: string) => {
    const newMenus = { ...presets.menus };
    delete newMenus[shopName];
    save({ ...presets, menus: newMenus });
  };

  const updateShopItem = (
    shopName: string,
    items: { name: string; price: number }[],
  ) => {
    save({ ...presets, menus: { ...presets.menus, [shopName]: items } });
  };

  // 3. 通用更新 (給設定頁的偏好設定使用)
  const updatePresets = (updates: Partial<Presets>) => {
    save({ ...presets, ...updates });
  };

  return {
    presets,
    learnMenu,
    addShop,
    deleteShop,
    updateShopItem,
    updatePresets,
  };
}
