import "./globals.css";
import type { Metadata, Viewport } from "next";
import { AppProviders } from "@/components/layout/AppProviders";

// 1. 設定 Metadata (SEO & PWA)
export const metadata: Metadata = {
  title: "月底破產兇手名單",
  description: "紀錄每一筆飲料開銷",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

// 2. 設定 Viewport (手機版縮放控制)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // 禁止縮放，像原生 App
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className="antialiased min-h-screen pb-24 bg-bg text-text transition-colors duration-300">
        {/* 3. 使用剛剛抽離的 Client Component 包裹內容 */}
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
