"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import clsx from "clsx";

// 定義 Toast 的類型
type ToastType = "success" | "error" | "info";

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// 自訂 Hook，讓其他元件方便呼叫
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{
    id: number;
    msg: string;
    type: ToastType;
  } | null>(null);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now();
    setToast({ id, msg: message, type });

    // 2.5秒後自動消失
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast UI 渲染層 */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-auto max-w-[90vw]"
          >
            <div
              className={clsx(
                "flex items-center gap-2.5 px-4 py-3 rounded-full shadow-lg backdrop-blur-md border",
                // 根據類型改變樣式
                toast.type === "success" &&
                  "bg-primary/95 text-white border-primary",
                toast.type === "error" && "bg-badge/95 text-white border-badge",
                toast.type === "info" &&
                  "bg-card-bg/95 text-text border-border",
              )}
            >
              {/* Icon */}
              {toast.type === "success" && (
                <CheckCircle size={18} strokeWidth={2.5} />
              )}
              {toast.type === "error" && (
                <AlertCircle size={18} strokeWidth={2.5} />
              )}
              {toast.type === "info" && <Info size={18} strokeWidth={2.5} />}

              {/* 文字 */}
              <span className="text-sm font-bold tracking-wide pr-1">
                {toast.msg}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
}
