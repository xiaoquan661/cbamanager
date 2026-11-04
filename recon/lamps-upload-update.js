// lamps-upload-update.js — 更新已创建作品（读取 .lamps/work-session-id）
const fs = require("fs");
const path = require("path");
const root = "C:/10.19源码/签下整个CBA";

let key = "";
for (const p of ["C:/10.19源码/.lamps/auth-key", "C:/10.19源码/闯进无人相信的NBA/.lamps/auth-key"]) {
  try { const v = fs.readFileSync(p, "utf8").trim(); if (v && !/在此粘贴/.test(v)) { key = v; break; } } catch (_) {}
}
if (!key) { console.log("未找到 auth_key"); process.exit(1); }

let sid = "";
try { sid = fs.readFileSync(path.join(root, ".lamps/work-session-id"), "utf8").trim(); } catch (_) {}
if (!/^[0-9a-f-]{36}$/i.test(sid)) { console.log("未找到有效 workSessionId:", JSON.stringify(sid)); process.exit(1); }
console.log("更新作品:", sid);

const buf = fs.readFileSync(path.join(root, "dist/cba-lamps-upload.zip"));
console.log("ZIP 大小:", (buf.length / 1048576).toFixed(2), "MB");

const form = new FormData();
form.append("file", new Blob([buf], { type: "application/zip" }), "cba-lamps-upload.zip");
form.append("worksSessionId", sid);

(async () => {
  const t0 = Date.now();
  const res = await fetch("https://lamps-api.hoorahgo.com/creator/openapi/upload", {
    method: "POST",
    headers: { auth_key: key },
    body: form,
    signal: AbortSignal.timeout(600000),
  });
  const text = await res.text();
  console.log("HTTP", res.status, "耗时", ((Date.now() - t0) / 1000).toFixed(1) + "s");
  try {
    const j = JSON.parse(text);
    console.log("code:", j.code, "msg:", j.msg || "");
    if (j.data) console.log("data:", JSON.stringify(j.data));
  } catch { console.log("响应:", text.slice(0, 500)); }
})();
