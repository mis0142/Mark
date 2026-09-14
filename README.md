# 三峽住旺房屋

三峽住旺房屋官方網站：形象站與租賃物件前台。

## 結構

- `/` — 形象站（安心租屋／輕鬆出租）
- `portal/` — 租賃物件前台（對應原 zhujiarental-w1）

## 本機預覽

```bash
# 形象站
python3 -m http.server 8080

# 租賃前台
python3 -m http.server 8081 --directory portal
```

## 部署

可分別部署根目錄與 `portal/` 至 Netlify。
