(function () {
  const form = document.getElementById("filter-form");
  const grid = document.getElementById("property-grid");
  const statusEl = document.getElementById("list-status");

  function readFilters() {
    const fd = new FormData(form);
    return {
      city: fd.get("city"),
      district: fd.get("district"),
      minRent: fd.get("minRent"),
      maxRent: fd.get("maxRent"),
      minPing: fd.get("minPing"),
      maxPing: fd.get("maxPing"),
      layout: fd.get("layout"),
    };
  }

  function formatRent(n) {
    if (n == null) return "租金電洽";
    return `月租金 NTD ${Number(n).toLocaleString("zh-TW")}`;
  }

  function formatPing(n) {
    if (n == null) return "建物面積 —";
    return `建物面積 ${Number(n).toLocaleString("zh-TW")} 坪`;
  }

  function escapeHtml(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  function locationLine(city, district) {
    const place = `${city || ""}${district || ""}`.trim() || "地點未提供";
    return `${place} • 租賃`;
  }

  function renderCards(items) {
    if (!items.length) {
      grid.innerHTML = "";
      statusEl.textContent = "沒有符合條件的物件。";
      return;
    }
    statusEl.textContent = `共 ${items.length} 筆結果`;
    grid.innerHTML = items
      .map((p) => {
        const img = Api.resolveMediaUrl(p.coverImageUrl || p.CoverImageUrl || "");
        const title = p.title || p.Title || "";
        const city = p.city || p.City || "";
        const district = p.district || p.District || "";
        const ping = p.areaPing ?? p.AreaPing;
        const rent = p.rentAmount ?? p.RentAmount;
        const id = p.id ?? p.Id;
        if (id == null || id === "") return "";
        return `
          <article class="property-card">
            <a href="/property-detail.html?id=${encodeURIComponent(id)}">
              <div class="card-image">
                ${img ? `<img src="${escapeHtml(img)}" alt="" loading="lazy" />` : `<div class="img-placeholder"></div>`}
              </div>
              <div class="card-body">
                <h2 class="card-title">${escapeHtml(title)}</h2>
                <p class="card-address">${escapeHtml(locationLine(city, district))}</p>
                <p class="card-meta">
                  <span>${escapeHtml(formatPing(ping))}</span>
                  <span class="sep" aria-hidden="true">•</span>
                  <span class="card-rent">${escapeHtml(formatRent(rent))}</span>
                </p>
              </div>
            </a>
          </article>`;
      })
      .filter(Boolean)
      .join("");
  }

  async function load() {
    statusEl.textContent = "載入中…";
    try {
      const data = await Api.getProperties(readFilters());
      renderCards(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      statusEl.textContent = "載入失敗：" + err.message;
      grid.innerHTML = "";
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    load();
  });
  document.getElementById("filter-reset")?.addEventListener("click", () => setTimeout(load, 0));
  load();
})();
