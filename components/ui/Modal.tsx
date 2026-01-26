"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 鎖定背景捲動
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={clsx(
        "fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300",
        isOpen
          ? "opacity-100 visible"
          : "opacity-0 invisible pointer-events-none",
      )}
    >
      {/* 黑色半透明背景 (遮罩) */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal 本體 */}
      <div
        className={clsx(
          // 修正重點：改用 bg-card-bg (支援深色), text-text (支援深色)
          "relative w-full max-w-sm bg-card-bg text-text rounded-3xl shadow-2xl transform transition-all duration-300 flex flex-col max-h-[85vh]",
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="text-lg font-extrabold text-text">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 bg-input-bg rounded-full text-text-sub hover:text-text hover:bg-black/5 dark:hover:bg-white/10 transition-colors active:scale-90"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content (可捲動區域) */}
        <div className="p-5 overflow-y-auto custom-scrollbar">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
