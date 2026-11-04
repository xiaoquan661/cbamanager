// test-feed-variants.js — 试探代理接口的接受形态
const URL = "https://lamps-api.hoorahgo.com/cloud-proxy/app-1b8c1d4749-d8gmk54gz5fc75d0d-1252166086.ap-shanghai.app.tcloudbase.com/api/official-feed";
async function tryReq(name, opts) {
  try {
    const res = await fetch(URL, opts);
    const text = await res.text();
    console.log(`[${name}] HTTP ${res.status} len=${text.length} :: ${text.slice(0, 160).replace(/\s+/g, " ")}`);
  } catch (e) { console.log(`[${name}] 失败: ${e.message}`); }
}
(async () => {
  await tryReq("GET 默认", {});
  await tryReq("GET + Origin/Referer", { headers: { Origin: "https://lamps.hoorahgo.com", Referer: "https://lamps.hoorahgo.com/", Accept: "application/json" } });
  await tryReq("GET + UA LampsSDK", { headers: { "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 LampsSDK", Accept: "application/json" } });
  await tryReq("POST 空体", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
  await tryReq("GET + x-requested-with", { headers: { "X-Requested-With": "XMLHttpRequest", Accept: "application/json" } });
})();