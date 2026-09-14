/**
 * 三峽住旺房屋 Web 執行環境設定
 *
 * 整合模式（5216）：同一 dotnet 程序提供頁面 + /api（同源，類似犇亞單一專案）
 * 其他埠（純靜態預覽）：API 固定指向 http://localhost:5216
 */
(function () {
  const origin = window.location.origin;
  const port = window.location.port;
  const integrated = new Set(["5216", "44379", ""]).has(port);
  const apiOrigin = integrated ? origin : "http://localhost:5216";

  window.APP_CONFIG = {
    apiOrigin,
    apiBase: integrated ? "/api" : `${apiOrigin}/api`,
    webOrigin: origin,
    adminOrigin: "http://localhost:5217",
  };
})();
