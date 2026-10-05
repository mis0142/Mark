#!/usr/bin/env python3
"""Generate 2026 welfare committee ballot with reshuffled PST names."""
import random
import json
from pathlib import Path

SEED = 2180

PST = [
    "丁琬菁","王美娟","王嘉敏","白漢純","吳思穎","李志哲","李幸芬","李怡蘅","李彥穎","李紹廷","汪衡原","沈君凌","周洪麗","易建平",
    "林大翔","林志文","林志陽","林佩璇","林欣華","林昱甫","林淑芬","林淑鈴","林聖儒","林銘璋","林樹娟","邱祺傑","俞明珠","柯迺琛",
    "洪聿安","洪淑玲","徐建國","徐淑芬","翁健晃","張凱任","張嘉真","張瓊霞","許金緯","許瑞孜","許嘉玲","陳又嘉","陳光隆","陳佩翎",
    "陳柏愷","陳美雲","陳偉峰","陳淵泉","陳博育","麥佩芬","游明偉","游晴羽","黃美蓮","黃莉萍","黃獻德","黃馨霈","楊智皓","楊雅菁",
    "楊雅蓉","劉哲賢","劉毓婷","蔡佳君","蔡晨之","蔡嘉容","鄭宇峰","賴怡如","賴冠樺","賴超治","賴靜瑩","賴麗莉","簡惠英","蘇美珍",
]

TWSIR = [
    ["朱祐良","吳妙峯","吳彤","吳英才","李建國","卓芳琪","孫意婷","浦綺芯","高偉玲"],
    ["張慧嫻","郭宜菁","彭子健","彭銘慧","曾珮雯","楊光明","楊佩珊","劉恆碩","羅治麟"],
]
PSIN = [
    ["方信文","白櫻慧","江弘凱","沈勇龍","沙蓓旻","林玉娟","林維欣","施玟君"],
    ["柯淑仙","康銘仁","粘叔燕","郭端祺","黃秋鳳","潘中富","蔣玉女","謝玉卿"],
]
PGIS = ["王亦君","王韻婷","林家全","林筱娟","張韡","陳又嘉","饒婉玲"]
CIRCLED = ["①","②","③","④","⑤"]


def shuffle_pst(seed=SEED):
    assert len(PST) == 70 and len(set(PST)) == 70
    names = PST[:]
    random.Random(seed).shuffle(names)
    return [names[i * 14:(i + 1) * 14] for i in range(5)]


def build_table(title, columns):
    n = len(columns)
    rows = max(len(c) for c in columns)
    span = n * 2
    title_row = f'<tr><th colspan="{span}" class="sect">{title}</th></tr>'
    num_row = "<tr>" + "".join(
        f'<th colspan="2" class="colnum">{CIRCLED[i]}</th>' for i in range(n)
    ) + "</tr>"
    body = []
    for r in range(rows):
        cells = []
        for c in columns:
            nm = c[r] if r < len(c) else ""
            cells.append(f'<td class="name">{nm}</td><td class="box"></td>')
        body.append("<tr>" + "".join(cells) + "</tr>")
    colgroup = "".join('<col class="namecol"><col class="boxcol">' for _ in range(n))
    return f"""<table class="ballot">
  <colgroup>{colgroup}</colgroup>
  <thead>
    {title_row}
    {num_row}
  </thead>
  <tbody>
    {chr(10).join(body)}
  </tbody>
</table>"""


def render(cols):
    return f"""<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>2026年度 福利委員選舉選票</title>
<style>
  @page {{ size: A4 landscape; margin: 8mm; }}
  * {{ box-sizing: border-box; }}
  html, body {{
    margin: 0; padding: 0; background: #fff; color: #000;
    font-family: "Microsoft JhengHei","微軟正黑體","Noto Sans TC","PingFang TC","Heiti TC",sans-serif;
  }}
  .toolbar {{
    max-width: 290mm; margin: 12px auto; padding: 0 8mm;
    display: flex; gap: 12px; align-items: center; flex-wrap: wrap;
  }}
  .toolbar button {{
    font-size: 14px; padding: 8px 16px; cursor: pointer;
  }}
  .page {{
    width: 281mm; margin: 0 auto; padding: 4mm 5mm 4mm;
  }}
  h1 {{
    text-align: center; font-size: 20pt; font-weight: 700;
    letter-spacing: 0.18em; margin: 0 0 3mm;
  }}
  table.ballot {{
    width: 100%; border-collapse: collapse; table-layout: fixed;
    border: 2.2px solid #000; margin-bottom: 3mm;
  }}
  table.ballot th, table.ballot td {{
    border: 1px solid #000; vertical-align: middle;
  }}
  th.sect {{
    text-align: center; font-size: 11.5pt; font-weight: 700;
    padding: 1.6mm 1mm; letter-spacing: 0.04em;
  }}
  th.colnum {{
    text-align: center; font-size: 11pt; font-weight: 700;
    padding: 1mm; height: 6.5mm;
  }}
  td.name {{
    text-align: center; font-size: 10pt; padding: 0.9mm 1mm;
    white-space: nowrap; height: 5.6mm;
  }}
  td.box {{
    width: 6.8mm; min-width: 6.5mm; max-width: 7.5mm; height: 5.6mm;
  }}
  col.boxcol {{ width: 7mm; }}
  .bottom-row {{
    display: grid;
    grid-template-columns: 1.2fr 1.1fr 0.72fr;
    gap: 3.5mm;
    align-items: start;
  }}
  .bottom-row table.ballot {{ margin-bottom: 0; }}
  .footer {{
    margin-top: 3mm; font-size: 9.5pt; line-height: 1.5;
  }}
  .meta {{ margin-top: 2mm; font-size: 8pt; color: #555; }}
  @media print {{
    .toolbar, .meta, .noprint {{ display: none !important; }}
    .page {{ width: auto; padding: 0; }}
    body {{ -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
  }}
</style>
</head>
<body>
  <div class="toolbar noprint">
    <button type="button" onclick="window.print()">列印 / 另存 PDF 下載</button>
    <span>建議紙張 A4、方向「橫向」。開啟本檔後即可列印或另存為 PDF。</span>
  </div>
  <div class="page">
    <h1>2026年度 福利委員選舉選票</h1>
    {build_table("PST（應選5名）", cols)}
    <div class="bottom-row">
      {build_table("TWSIR（應選2名）", TWSIR)}
      {build_table("PSIN（應選2名）", PSIN)}
      {build_table("PGIS+PCBC（應選1名）", [PGIS])}
    </div>
    <div class="footer">
      投票方式：請於圈選人姓名右方空格內打「V」，各公司圈選人數不得超過應選名額，超過者該公司欄位視為無效票。
    </div>
    <div class="meta noprint">PST 70 名已以固定種子 {SEED} 重新洗牌並平均分配（5 欄 × 14 人），不再按姓氏排序；下半部三表與說明維持原樣。</div>
  </div>
</body>
</html>
"""


def main():
    cols = shuffle_pst()
    root = Path(__file__).resolve().parent
    (root / "ballot.html").write_text(render(cols), encoding="utf-8")
    (root / "pst_shuffled.json").write_text(
        json.dumps({"seed": SEED, "columns": {f"col{i+1}": cols[i] for i in range(5)}},
                   ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    flat = [n for c in cols for n in c]
    assert len(flat) == 70 and set(flat) == set(PST)
    print("Generated ballot.html and pst_shuffled.json")


if __name__ == "__main__":
    main()
