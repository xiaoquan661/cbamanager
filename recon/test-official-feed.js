// test-official-feed.js — 验证 Lamps 代理接口的返回结构
const URL = "https://lamps-api.hoorahgo.com/cloud-proxy/app-1b8c1d4749-d8gmk54gz5fc75d0d-1252166086.ap-shanghai.app.tcloudbase.com/api/official-feed";
(async () => {
  try {
    const t0 = Date.now();
    const res = await fetch(URL, { headers: { Accept: "application/json" } });
    console.log("HTTP", res.status, "耗时", Date.now() - t0, "ms");
    console.log("content-type:", res.headers.get("content-type"));
    const text = await res.text();
    console.log("响应长度:", text.length);
    console.log("响应前 300 字符:", text.slice(0, 300));
    let data;
    try { data = JSON.parse(text); } catch (e) { console.log("非 JSON:", e.message); return; }
    const j = data && data.data ? data.data : data;
    if (typeof j === "string") { try { const k = JSON.parse(j); console.log("二次解析 keys:", Object.keys(k)); } catch (_) {} }
    else if (j && typeof j === "object") {
      console.log("顶层 keys:", Object.keys(j).slice(0, 20));
      if (j.updatedAt) console.log("updatedAt:", j.updatedAt);
      if (j.players) console.log("players:", Object.keys(j.players).length);
      if (j.schedules) console.log("schedules:", j.schedules.length);
      if (j.coverage) console.log("coverage:", JSON.stringify(j.coverage).slice(0, 300));
      if (j.code !== undefined) console.log("code:", j.code, "msg:", j.msg || j.message);
    }
  } catch (e) {
    console.log("请求失败:", e.message);
  }
})();