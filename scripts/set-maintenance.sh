#!/usr/bin/env bash
# 開關 Netlify 維護模式（需再部署才會生效）
# 用法：
#   ./scripts/set-maintenance.sh on              # 形象站 + portal 皆開啟
#   ./scripts/set-maintenance.sh off             # 形象站 + portal 皆關閉
#   ./scripts/set-maintenance.sh on marketing    # 僅形象站
#   ./scripts/set-maintenance.sh on portal       # 僅 portal
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MODE="${1:-}"
TARGET="${2:-all}"

usage() {
  echo "用法: $0 <on|off> [all|marketing|portal]"
  exit 1
}

[[ "$MODE" == "on" || "$MODE" == "off" ]] || usage

apply() {
  local dir="$1"
  local label="$2"
  local src="$dir/_redirects.$MODE"
  local dest="$dir/_redirects"
  if [[ ! -f "$src" ]]; then
    echo "找不到 $src" >&2
    exit 1
  fi
  cp "$src" "$dest"
  echo "[$label] 維護模式 → $MODE （已寫入 $dest）"
}

case "$TARGET" in
  all)
    apply "$ROOT" "marketing"
    apply "$ROOT/portal" "portal"
    ;;
  marketing)
    apply "$ROOT" "marketing"
    ;;
  portal)
    apply "$ROOT/portal" "portal"
    ;;
  *)
    usage
    ;;
esac

echo
echo "下一步：重新部署對應 Netlify 專案後才會生效。"
echo "  形象站：publish 根目錄 → zhujiarent.netlify.app"
echo "  portal：publish portal/ → zhujiarental-w1.netlify.app"
echo
if [[ "$MODE" == "on" ]]; then
  echo "目前為維護中：訪客會看到「系統暫停服務，請稍後再試」"
else
  echo "目前為正常開放"
fi
