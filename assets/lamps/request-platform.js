/**
 * 业务请求的游戏入口。只暴露 request。
 * 向父页面申请发请求。游戏代码只调 window.LampsGame。
 */
(function (global) {
  "use strict";

  var REQUEST_TIMEOUT_MS = 30000;

  function bridge() {
    return global.__HOORAH_LAMPS_BRIDGE__;
  }

  function normalizeHostResult(msg) {
    var data = msg && msg.data && typeof msg.data === "object" ? msg.data : null;
    if (!msg || msg.ok === false) {
      return {
        ok: false,
        message: (msg && msg.message) || (data && data.msg) || "请求失败",
        data: null,
      };
    }
    return {
      ok: true,
      data: data,
    };
  }

  function callHost(method, payload, timeoutMs) {
    var b = bridge();
    if (!b || typeof b.callHost !== "function") {
      return Promise.resolve({
        ok: false,
        message: "请求能力暂不可用",
        data: null,
      });
    }
    return b
      .callHost(method, payload || {}, timeoutMs)
      .then(normalizeHostResult)
      .catch(function (err) {
        return {
          ok: false,
          message: err && err.message ? err.message : String(err),
          data: null,
        };
      });
  }

  function asObject(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
    return value;
  }

  function pickOptions(options) {
    if (!options || typeof options !== "object") return {};
    var payload = {};
    if (typeof options.url === "string") payload.url = options.url;
    if (typeof options.method === "string") payload.method = options.method;
    var data = asObject(options.data);
    if (data) payload.data = data;
    var header = asObject(options.header);
    if (header) payload.header = header;
    return payload;
  }

  function request(options) {
    return callHost("request", pickOptions(options), REQUEST_TIMEOUT_MS);
  }

  var api = global.LampsGame || {};
  api.request = request;
  if (!api.bridge) api.bridge = bridge;
  global.LampsGame = api;
})(typeof window !== "undefined" ? window : globalThis);
