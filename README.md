# ZhuJiaRental 助家租賃

ZhuJiaRental（助家租賃）官方形象站：專業包租代管、媒合房東與房客，介紹 333 政策優惠與服務流程。

## 本機預覽

以任意靜態伺服器開啟根目錄即可，例如：

```bash
npx serve .
# 或
python3 -m http.server 8080
```

然後瀏覽 `http://localhost:8080`。

## 結構

- `index.html` — 單頁官網
- `css/styles.css` — 樣式
- `js/main.js` — 行動選單、FAQ、捲動揭示

## 部署

可直接部署至 Netlify / 任何靜態託管；入口為 `index.html`。
