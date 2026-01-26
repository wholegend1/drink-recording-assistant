"use client";
import { Home, Plus, Settings, BarChart2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  // 定義哪些頁面要隱藏新增按鈕
  const shouldHideFab = pathname === "/settings" || pathname === "/stats";

  const handleAddClick = () => {
    window.dispatchEvent(new Event("open-add-drink-modal"));
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card-bg border-t border-border px-4 py-2 pb-[env(safe-area-inset-bottom)] flex justify-around items-center z-50 transition-all duration-300">
      {/* 首頁 */}
      <button
        onClick={() => router.push("/")}
        className={clsx(
          "flex flex-col items-center gap-1 p-2 w-12 transition-colors",
          isActive("/") ? "text-primary" : "text-text-sub",
        )}
      >
        <Home size={24} strokeWidth={isActive("/") ? 3 : 2} />
        <span className="text-[10px] font-bold">首頁</span>
      </button>

      {/* FAB (中間大按鈕) */}
      <div
        className={clsx("relative w-14 h-14 -mt-8", shouldHideFab && "hidden")}
      >
        <button
          onClick={handleAddClick}
          className="absolute inset-0 w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white shadow-lg border-4 border-bg active:scale-95 transition-transform"
        >
          <Plus size={28} strokeWidth={3} />
        </button>
      </div>
      {/* 分析 */}
      <button
        onClick={() => router.push("/stats")}
        className={clsx(
          "flex flex-col items-center gap-1 p-2 w-12 transition-colors",
          isActive("/stats") ? "text-primary" : "text-text-sub",
        )}
      >
        <BarChart2 size={24} strokeWidth={isActive("/stats") ? 3 : 2} />
        <span className="text-[10px] font-bold">分析</span>
      </button>

      {/* 設定 */}
      <button
        onClick={() => router.push("/settings")}
        className={clsx(
          "flex flex-col items-center gap-1 p-2 w-12 transition-colors",
          isActive("/settings") ? "text-primary" : "text-text-sub",
          !shouldHideFab && "hidden",
        )}
      >
        <Settings size={24} strokeWidth={isActive("/settings") ? 3 : 2} />
        <span className="text-[10px] font-bold">設定</span>
      </button>
    </nav>
  );
}
