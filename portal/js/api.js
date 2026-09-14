const Api = (() => {
  const cfg = window.APP_CONFIG || {};
  const BASE = String(cfg.apiBase || "/api").replace(/\/$/, "");
  const ORIGIN = String(cfg.apiOrigin || "").replace(/\/$/, "");

  function resolveMediaUrl(url) {
    if (!url) return "";
    const s = String(url).trim();
    if (!s) return "";
    if (/^(https?:)?\/\//i.test(s) || s.startsWith("data:") || s.startsWith("blob:")) return s;
    if (s.startsWith("/") && ORIGIN) return ORIGIN + s;
    return s;
  }

  function toRelativeMediaPath(url) {
    if (!url) return null;
    const s = String(url).trim();
    if (!s) return null;
    if (ORIGIN && s.startsWith(ORIGIN + "/")) return s.slice(ORIGIN.length);
    return s;
  }

  async function request(path, options = {}) {
    let res;
    try {
      res = await fetch(`${BASE}${path}`, {
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
        ...options,
      });
    } catch (_) {
      throw new Error(
        `無法連線到伺服器（Failed to fetch）。請執行 npm run dev 啟動整合伺服器（${ORIGIN || window.location.origin || BASE}），然後重新整理頁面再試。`
      );
    }

    if (!res.ok) {
      let message = res.statusText;
      try {
        const body = await res.json();
        message = body.message || body.Message || JSON.stringify(body);
      } catch (_) {}
      throw new Error(message || `HTTP ${res.status}`);
    }

    if (res.status === 204) return null;
    return res.json();
  }

  function toQuery(params) {
    const q = new URLSearchParams();
    Object.entries(params || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v).trim() !== "") {
        q.set(k, v);
      }
    });
    const s = q.toString();
    return s ? `?${s}` : "";
  }

  return {
    config: cfg,
    resolveMediaUrl,
    toRelativeMediaPath,
    getProperties(filters) {
      return request(`/properties${toQuery({ publishedOnly: true, ...filters })}`);
    },
    getAllProperties(filters) {
      return request(`/properties${toQuery(filters)}`);
    },
    getProperty(id) {
      return request(`/properties/${id}`);
    },
    createInquiry(payload) {
      return request("/inquiries", { method: "POST", body: JSON.stringify(payload) });
    },
    createAppointment(payload) {
      return request("/appointments", { method: "POST", body: JSON.stringify(payload) });
    },
    getDashboardSummary(year, month) {
      return request(`/reports/summary${toQuery({ year, month })}`);
    },

    getMaintenances(filters) {
      return request(`/maintenances${toQuery(filters)}`);
    },
    getMaintenance(id) {
      return request(`/maintenances/${id}`);
    },
    createMaintenance(payload) {
      return request("/maintenances", { method: "POST", body: JSON.stringify(payload) });
    },
    updateMaintenance(id, payload) {
      return request(`/maintenances/${id}`, { method: "PUT", body: JSON.stringify(payload) });
    },

    getLeases(filters) {
      return request(`/leases${toQuery(filters)}`);
    },
    getLease(id) {
      return request(`/leases/${id}`);
    },
    createLease(payload) {
      return request("/leases", { method: "POST", body: JSON.stringify(payload) });
    },
    updateLease(id, payload) {
      return request(`/leases/${id}`, { method: "PUT", body: JSON.stringify(payload) });
    },
    moveOutLease(id, params) {
      return request(`/leases/${id}/move-out${toQuery(params)}`, { method: "POST" });
    },

    getRentBills(filters) {
      return request(`/rentbills${toQuery(filters)}`);
    },
    generateRentBills(payload) {
      return request("/rentbills/generate", { method: "POST", body: JSON.stringify(payload) });
    },
    getPayments(filters) {
      return request(`/payments${toQuery(filters)}`);
    },
    createPayment(payload) {
      return request("/payments", { method: "POST", body: JSON.stringify(payload) });
    },

    getLandlords() {
      return request("/landlords");
    },
    createLandlord(payload) {
      return request("/landlords", { method: "POST", body: JSON.stringify(payload) });
    },
    getTenants() {
      return request("/tenants");
    },
    createTenant(payload) {
      return request("/tenants", { method: "POST", body: JSON.stringify(payload) });
    },

    createProperty(payload) {
      return request("/properties", { method: "POST", body: JSON.stringify(payload) });
    },
    updateProperty(id, payload) {
      return request(`/properties/${id}`, { method: "PUT", body: JSON.stringify(payload) });
    },
    async uploadImages(files) {
      const fd = new FormData();
      Array.from(files || []).forEach((file) => fd.append("files", file));
      let res;
      try {
        res = await fetch(`${BASE}/uploads/images`, {
          method: "POST",
          body: fd,
        });
      } catch (_) {
        throw new Error(
          `無法連線到伺服器（Failed to fetch）。請確認 API 已啟動（${ORIGIN || BASE}），然後重新整理頁面再試。`
        );
      }
      if (!res.ok) {
        let message = res.statusText;
        try {
          const body = await res.json();
          message = body.message || body.Message || JSON.stringify(body);
        } catch (_) {}
        throw new Error(message || `HTTP ${res.status}`);
      }
      return res.json();
    },
    publishListing(propertyId, payload) {
      return request(`/properties/${propertyId}/listings`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    unpublishListing(listingId) {
      return request(`/listings/${listingId}`, { method: "DELETE" });
    },
  };
})();
