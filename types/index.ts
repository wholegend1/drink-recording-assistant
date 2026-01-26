export interface Topping {
  name: string;
  price: number;
  count: number;
  attr: "正常" | "多" | "少";
}

export interface DrinkRecord {
  id: number;
  date: string; // YYYY-MM-DD
  shop: string;
  item: string;
  priceOriginal: number;
  finalCost: number;
  toppings: Topping[];
  sugar: string;
  ice: string;
  isEco: boolean;
  isTreat: boolean;
}

export interface MenuItem {
  name: string;
  price: number;
}

export interface Presets {
  menus: Record<string, MenuItem[]>; // 店家名稱 -> 飲料列表
  toppings: { name: string; price: number }[];
  defaultSugar: string;
  defaultIce: string;
}

export interface AppSettings {
  visibleCharts: string[];
  // 注意：GAS URL 不存在這裡了，改用 Server 端處理
}
