const fs = require("fs");
const paths = ["C:/10.19源码/.lamps/auth-key", "C:/10.19源码/闯进无人相信的NBA/.lamps/auth-key"];
let key = "";
for (const p of paths) {
  try { const v = fs.readFileSync(p, "utf8").trim(); if (v && !/在此粘贴/.test(v)) { key = v; console.log("keyFile:", p, "len", v.length); break; } } catch (_) {}
}
if (!key) { console.log("no key"); process.exit(1); }
(async () => {
  const res = await fetch("https://lamps-api.hoorahgo.com/creator/openapi/works?page=1&size=100", { headers: { auth_key: key } });
  const t = await res.text();
  console.log("HTTP", res.status);
  try {
    const j = JSON.parse(t);
    console.log("code", j.code, "msg", j.msg, "total", j?.data?.total);
    for (const w of (j?.data?.dataList || [])) console.log(JSON.stringify({ id: w.workSessionId, title: w.title, review: w.reviewStatus, mini: w.miniGameId }));
  } catch { console.log(t.slice(0, 300)); }
})();
