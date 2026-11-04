// css-colors.js — 提取 cba-startup.css 的完整色板（hex/rgba），按出现次数排序
const fs = require("fs");
const raw = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.css", "utf8");
console.log("css bytes:", raw.length);

const hexCounts = {};
for (const m of raw.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
  const k = m[0].toLowerCase();
  hexCounts[k] = (hexCounts[k] || 0) + 1;
}
const hexSorted = Object.entries(hexCounts).sort((a, b) => b[1] - a[1]);
console.log("hex 种类:", hexSorted.length);
for (const [c, n] of hexSorted) console.log(c + " x" + n);

const rgbaCounts = {};
for (const m of raw.matchAll(/rgba?\([^)]+\)/g)) {
  const k = m[0].replace(/\s+/g, "");
  rgbaCounts[k] = (rgbaCounts[k] || 0) + 1;
}
const rgbaSorted = Object.entries(rgbaCounts).sort((a, b) => b[1] - a[1]);
console.log("\nrgba 种类:", rgbaSorted.length);
for (const [c, n] of rgbaSorted.slice(0, 40)) console.log(c + " x" + n);
