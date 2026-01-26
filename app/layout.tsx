"use client";
import "./globals.css";
import BottomNav from "@/components/layout/BottomNav";
import { useTheme } from "@/hooks/useTheme";
import { ToastProvider } from "@/components/ui/ToastProvider"; // 新增

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useTheme();

  return (
    <html lang="zh-TW">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body className="antialiased min-h-screen pb-24 bg-bg text-text transition-colors duration-300">
        {/* 包裹 ToastProvider */}
        <ToastProvider>
          <main className="container max-w-lg mx-auto p-4">{children}</main>
          <BottomNav />
        </ToastProvider>
      </body>
    </html>
  );
}
