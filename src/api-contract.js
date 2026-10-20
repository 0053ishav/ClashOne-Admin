export const API_BASE_URL = import.meta.env?.VITE_API_URL || "https://clashwidget.online";

export const API_ROUTES = Object.freeze({
  health: { method: "GET", path: "/health", auth: "public" },
  login: { method: "POST", path: "/v1/admin/login", auth: "password" },
  logout: { method: "POST", path: "/v1/admin/logout", auth: "admin" },
  session: { method: "GET", path: "/v1/admin/session", auth: "admin" },
  craftedMetadata: { method: "GET", path: "/v2/metadata/crafted-defenses", auth: "public" },
  craftedEvent: { method: "GET", path: "/v2/events/crafted-defenses-event", auth: "public" },
  goblinConfig: { method: "GET", path: "/v2/events/goblin-config", auth: "public" },
  hammerJam: { method: "GET", path: "/v2/events/hammer-jam", auth: "public" },
  saveCraftedBundle: { method: "POST", path: "/v2/admin/crafted-defenses", auth: "admin" },
  saveGoblinConfig: { method: "POST", path: "/v2/admin/events/goblin", auth: "admin" },
  saveHammerJam: { method: "POST", path: "/v2/admin/events/hammer-jam", auth: "admin" },
});

export async function requestJson(path, options = {}) {
  const isAdminRoute =
    path.startsWith("/v1/admin/") || path.startsWith("/v2/admin/");

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: isAdminRoute ? "include" : "same-origin",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  if (response.status === 204) return undefined;

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const payload = await response.json();
      if (typeof payload?.error === "string") message = payload.error;
    } catch {
      // The API may return a non-JSON error body.
    }
    throw new Error(message);
  }

  return response.json();
}
