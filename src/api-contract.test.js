import test from "node:test";
import assert from "node:assert/strict";
import { API_BASE_URL, API_ROUTES, requestJson } from "./api-contract.js";

test("API contract defines the expected admin routes and methods", () => {
  assert.equal(API_ROUTES.login.method, "POST");
  assert.equal(API_ROUTES.craftedMetadata.method, "GET");
  assert.equal(API_ROUTES.saveCraftedBundle.method, "POST");
  assert.equal(API_ROUTES.saveCraftedBundle.path, "/v2/admin/crafted-defenses");
  assert.equal(API_ROUTES.logout.path, "/v1/admin/logout");
  assert.equal(API_ROUTES.session.method, "GET");
  assert.equal(API_ROUTES.session.path, "/v1/admin/session");
  assert.equal(API_ROUTES.saveGoblinConfig.path, "/v2/admin/events/goblin");
  assert.equal(API_ROUTES.hammerJam.method, "GET");
  assert.equal(API_ROUTES.hammerJam.path, "/v2/events/hammer-jam");
  assert.equal(API_ROUTES.saveHammerJam.method, "POST");
  assert.equal(API_ROUTES.saveHammerJam.path, "/v2/admin/events/hammer-jam");
  assert.ok(API_BASE_URL.startsWith("http"));
});

test("requestJson sends JSON headers and returns parsed JSON", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  let request;
  globalThis.fetch = async (url, options) => {
    request = { url, options };
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  const result = await requestJson("/test", {
    method: "POST",
    body: JSON.stringify({ value: 1 }),
  });

  assert.deepEqual(result, { success: true });
  assert.equal(request.url, API_BASE_URL + "/test");
  assert.equal(request.options.headers["Content-Type"], "application/json");
  assert.equal(request.options.credentials, "same-origin");
});

test("requestJson surfaces structured API error messages", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  globalThis.fetch = async () => new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });

  await assert.rejects(() => requestJson("/protected"), /Unauthorized/);
});

test("requestJson handles non-JSON error bodies", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  globalThis.fetch = async () => new Response("Unavailable", { status: 503 });

  await assert.rejects(() => requestJson("/test"), /Request failed \(503\)/);
});

test("requestJson includes cookies for admin routes", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  const requests = [];
  globalThis.fetch = async (url, options) => {
    requests.push({ url, options });
    return new Response(JSON.stringify({ authenticated: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  await requestJson(API_ROUTES.session.path);
  await requestJson(API_ROUTES.saveHammerJam.path, {
    method: "POST",
    body: JSON.stringify({ enabled: true }),
  });

  assert.equal(requests[0].options.credentials, "include");
  assert.equal(requests[1].options.credentials, "include");
  assert.equal("x-admin-token" in requests[1].options.headers, false);
});

test("requestJson accepts an empty successful logout response", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  globalThis.fetch = async () => new Response(null, { status: 204 });

  assert.equal(await requestJson(API_ROUTES.logout.path, {
    method: "POST",
  }), undefined);
});
