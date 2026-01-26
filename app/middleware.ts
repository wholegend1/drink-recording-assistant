export const config = {
  matcher: [
    /*
     * 匹配所有路徑，但排除以下開頭的路徑：
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (瀏覽器圖示)
     * - manifest.json (PWA 設定檔)  <-- 務必加上這個！
     * - icon.png (你的 App 圖示)     <-- 建議也加上這個
     */
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icon.png).*)",
  ],
};
