"use client";
import { useState, useEffect } from "react";

// 定義主題 (p:主色, l:淺色, d:深色, a:協調的強調色/警示色, m:名稱)
export const THEMES = [
  { p: "#D68C8C", l: "#F9EBEB", d: "#A65C5C", a: "#C75C5C", m: "1月 胭脂紅" },
  { p: "#F48FB1", l: "#FCE4EC", d: "#C2185B", a: "#AD1457", m: "2月 櫻花粉" },
  { p: "#6B8E78", l: "#E8F3EB", d: "#4A6354", a: "#D67D7D", m: "3月 嫩芽綠" }, // 經典綠配粉紅
  { p: "#FFB74D", l: "#FFF3E0", d: "#F57C00", a: "#E65100", m: "4月 陽光橙" },
  { p: "#4FC3F7", l: "#E1F5FE", d: "#0288D1", a: "#01579B", m: "5月 天空藍" },
  { p: "#9E8CAE", l: "#F3EBF9", d: "#6B547E", a: "#7B1FA2", m: "6月 薰衣草" },
  { p: "#FF7043", l: "#FBE9E7", d: "#D84315", a: "#BF360C", m: "7月 烈日紅" },
  { p: "#FFD54F", l: "#FFF8E1", d: "#FFA000", a: "#FF6F00", m: "8月 金盞花" },
  { p: "#90A4AE", l: "#ECEFF1", d: "#455A64", a: "#37474F", m: "9月 迷霧灰" },
  { p: "#8D6E63", l: "#EFEBE9", d: "#5D4037", a: "#4E342E", m: "10月 栗子棕" },
  { p: "#5C6BC0", l: "#E8EAF6", d: "#283593", a: "#1A237E", m: "11月 深海藍" },
  { p: "#26A69A", l: "#E0F2F1", d: "#00695C", a: "#004D40", m: "12月 松葉青" },
];

export function useTheme() {
  const [themeIndex, setThemeIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // 1. 讀取主題色
    const savedTheme = localStorage.getItem("themeIndex");
    if (savedTheme) {
      const idx = parseInt(savedTheme);
      setThemeIndex(idx);
      updateCssVariables(idx);
    } else {
      const currentMonth = new Date().getMonth();
      setThemeIndex(currentMonth);
      updateCssVariables(currentMonth);
    }

    // 2. 讀取深色模式
    const savedDark = localStorage.getItem("isDarkMode");
    if (savedDark === "true") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const applyTheme = (index: number) => {
    setThemeIndex(index);
    localStorage.setItem("themeIndex", index.toString());
    updateCssVariables(index);
  };

  const toggleDarkMode = () => {
    const newStatus = !isDarkMode;
    setIsDarkMode(newStatus);
    localStorage.setItem("isDarkMode", newStatus.toString());

    if (newStatus) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const updateCssVariables = (index: number) => {
    const t = THEMES[index] || THEMES[0];
    const root = document.documentElement;
    root.style.setProperty("--theme-primary", t.p);
    root.style.setProperty("--theme-primary-light", t.l);
    root.style.setProperty("--theme-primary-dark", t.d);
    root.style.setProperty("--theme-accent", t.a); // 更新強調色
  };

  return { themeIndex, applyTheme, isDarkMode, toggleDarkMode };
}
