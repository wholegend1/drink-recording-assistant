"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm touch-none"
          />

          {/* 彈出視窗本體 */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            // 關鍵修正：這裡加上 e.stopPropagation() 防止點擊內容時關閉視窗
            onClick={(e) => e.stopPropagation()}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2rem] z-[70] max-h-[90vh] overflow-y-auto shadow-2xl safe-pb"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-[#2C3E50]">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
