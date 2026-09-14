# 三峽住旺房屋

三峽住旺房屋官方網站：形象站與租賃物件前台。

## 結構

- `/` — 形象站（安心租屋／輕鬆出租）
- `portal/` — 租賃物件前台（對應 zhujiarental-w1）
- `maintenance.html` — 維護頁（形象站）
- `portal/maintenance.html` — 維護頁（前台）

## 本機預覽

```bash
# 形象站
python3 -m http.server 8080

# 租賃前台
python3 -m http.server 8081 --directory portal
```

## 維護模式（暫時不對外開放）

訪客會看到：**系統暫停服務，請稍後再試**

```bash
# 開啟維護（形象站 + portal）
./scripts/set-maintenance.sh on

# 關閉維護，恢復正常
./scripts/set-maintenance.sh off

# 也可只切單一站
./scripts/set-maintenance.sh on marketing
./scripts/set-maintenance.sh on portal
```

切換後需重新部署對應 Netlify 專案才會生效：

| 專案 | Publish | 網址 |
|------|---------|------|
| 形象站 | 根目錄（排除 portal 內容即可） | https://zhujiarent.netlify.app |
| 前台 | `portal/` | https://zhujiarental-w1.netlify.app |

實作方式：以 Netlify `_redirects` 將全站強制導向 `maintenance.html`（HTTP 503）。
