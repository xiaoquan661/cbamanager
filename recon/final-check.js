const fs = require("fs");
const path = require("path");
const root = "C:/10.19源码/签下整个CBA/dist/stage";
const read = p => fs.readFileSync(path.join(root, p), "utf8");
let ok = true;
const fail = m => { ok = false; console.log("✗ " + m); };

// 1) 脚本语法
for (const f of ["cba-startup.js", "cba-launch.js", "assets/lamps/cba-lamps-glue.js", "assets/lamps/cba-daily-tasks.js", "assets/lamps/cba-rank-sync.js", "assets/lamps/request-bridge.js", "assets/lamps/request-platform.js", "assets/lamps/game-progress-bridge.js", "assets/lamps/game-progress-platform.js", "assets/lamps/game-leaderboard-bridge.js", "assets/lamps/game-leaderboard-platform.js", "assets/lamps/game-rewarded-video-bridge.js", "assets/lamps/game-rewarded-video-platform.js"]) {
  try { new Function(read(f)); console.log("✓ syntax", f); }
  catch (e) { fail(f + " 语法: " + e.message); }
}

// 2) index 引用文件存在
const html = read("index.html");
const refs = [];
const re = /(?:src|href)="([^"]+?)(?:\?v=[^"]*)?"/g;
let m;
while ((m = re.exec(html))) if (!/^(https?:|data:|#)/.test(m[1])) refs.push(m[1]);
for (const r of refs) {
  if (!fs.existsSync(path.join(root, r))) fail("index 引用缺失: " + r);
}
console.log("index 本地引用:", refs.length, refs.join(", "));

// 3) CSS 资源存在
const css = read("cba-startup.css");
const cssRefs = [...css.matchAll(/url\(([^)]+)\)/g)].map(x => x[1].replace(/["']/g, "")).filter(u => !/^(data:|https?:)/.test(u));
let missingCss = 0;
for (const u of new Set(cssRefs)) {
  const clean = u.split("#")[0].split("?")[0];
  if (!fs.existsSync(path.join(root, decodeURIComponent(clean)))) { missingCss++; fail("CSS 资源缺失: " + clean); }
}
console.log("CSS 本地资源:", new Set(cssRefs).size, "缺失:", missingCss);

// 4) 版本与字节一致
const cssSize = fs.statSync(path.join(root, "cba-startup.css")).size;
const manifest = JSON.parse((html.match(/id="cba-launch-resources">(\[[\s\S]*?\])<\/script>/) || [])[1]);
const cssEntry = manifest.find(x => x.type === "style");
if (!cssEntry || cssEntry.bytes !== cssSize) fail("manifest CSS bytes 不一致: " + (cssEntry && cssEntry.bytes) + " vs " + cssSize);
else console.log("✓ manifest CSS bytes", cssSize);

// 5) 关键业务值
const js = read("cba-startup.js");
const checks = [
  ["OPENING_COINS = 500", /OPENING_COINS = 500/.test(js)],
  ["openingCoins:500", (js.split("openingCoins\":500").length - 1) + (js.split("openingCoins:500").length - 1) === 2],
  ["弱队优先 plan", js.includes("plan=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,14,15,15,16,16,17,17,18,18,19,19]")],
  ["引导第4步选择器", js.includes(".bottom-nav>button:last-child")],
  ["引导缺失跳过", js.includes("guard < STEPS.length")],
  ["无 PVP", !js.includes("cover-pvp") && !js.includes("PVPSYNC")],
];
for (const [n, v] of checks) { if (v) console.log("✓ " + n); else fail(n); }

// 6) 敏感项
const sensitive = ["auth_key", "BEGIN PRIVATE KEY", "password"];
for (const s of sensitive) {
  for (const f of ["cba-startup.js", "index.html", "assets/lamps/cba-lamps-glue.js", "assets/lamps/cba-daily-tasks.js"]) {
    if (read(f).includes(s)) console.log("⚠ 敏感词 " + s + " in " + f);
  }
}

console.log(ok ? "✓ FINAL CHECK PASS" : "✗ FINAL CHECK FAIL");