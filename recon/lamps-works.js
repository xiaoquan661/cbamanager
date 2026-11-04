// lamps-works.js — 查询 Lamps 作品列表（不打印 auth_key）
const fs = require("fs");
const paths = [
  "C:/10.19源码/.lamps/auth-key",
  "C:/10.19源码/闯进无人相信的NBA/.lamps/auth-key",
];
let key = "";
for (const p of paths) {
  try {
    const v = fs.readFileSync(p, "utf8").trim();
    if (v && !/在此粘贴/.test(v)) { key = v; console.log("使用 Key 文件:", p.slice(0, 20) + "…", "长度", v.length); break; }
  } catch (_) {}
}
if (!key) { console.log("未找到 auth_key"); process.exit(1); }

const titles = ["签下整个CBA", "CBA梦幻经理", "签下整个"];
(async () => {
  for (const t of titles) {
    const url = "https://lamps-api.hoorahgo.com/creator/openapi/works?title=" + encodeURIComponent(t) + "&page=1&size=100";
    const res = await fetch(url, { headers: { auth_key: key } });
    const text = await res.text();
    console.log("\n== 查询:", t, "HTTP", res.status);
    try {
      const j = JSON.parse(text);
      console.log("code:", j.code, "msg:", j.msg || "");
      const list = j && j.data && j.data.dataList || [];
      console.log("total:", j && j.data && j.data.total, "本页:", list.length);
      for (const w of list) console.log(JSON.stringify({ workSessionId: w.workSessionId, title: w.title, reviewStatus: w.reviewStatus, miniGameId: w.miniGameId }));
    } catch (e) { console.log("非 JSON:", text.slice(0, 200)); }
  }
})();
