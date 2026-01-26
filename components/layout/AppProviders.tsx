"use client";

import BottomNav from "@/components/layout/BottomNav";
import { useTheme } from "@/hooks/useTheme";
import { ToastProvider } from "@/components/ui/ToastProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  useTheme();

  return (
    <ToastProvider>
      <main className="container max-w-lg mx-auto p-4">{children}</main>
      <BottomNav />
    </ToastProvider>
  );
}
