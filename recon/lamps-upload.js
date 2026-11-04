// lamps-upload.js — 首次创建作品并上传 ZIP（不打印 auth_key）
const fs = require("fs");
const path = require("path");

const root = "C:/10.19源码/签下整个CBA";
const keyPaths = ["C:/10.19源码/.lamps/auth-key", "C:/10.19源码/闯进无人相信的NBA/.lamps/auth-key"];
let key = "";
for (const p of keyPaths) {
  try { const v = fs.readFileSync(p, "utf8").trim(); if (v && !/在此粘贴/.test(v)) { key = v; break; } } catch (_) {}
}
if (!key) { console.log("未找到 auth_key"); process.exit(1); }

const zipPath = path.join(root, "dist/cba-lamps-upload.zip");
const buf = fs.readFileSync(zipPath);
console.log("ZIP 大小:", (buf.length / 1048576).toFixed(2), "MB");

const form = new FormData();
form.append("file", new Blob([buf], { type: "application/zip" }), "cba-lamps-upload.zip");
form.append("title", "签下整个CBA");

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
    const id = j && j.data && j.data.workSessionId;
    if (id) {
      const dir = path.join(root, ".lamps");
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, "work-session-id"), String(id) + "\n", "utf8");
      console.log("已写入 .lamps/work-session-id");
    }
  } catch {
    console.log("响应:", text.slice(0, 500));
  }
})();
