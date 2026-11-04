// position-probe.js — 找位置显示的渲染点
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
for (const m of ["court-position", "控球后卫", "大前锋", "position"]) {
  let i = js.indexOf(m), n = 0;
  console.log("\n======== " + m + " x" + (js.split(m).length - 1) + " ========");
  while (i >= 0 && n < 3) {
    console.log("--- @" + i + " ---");
    console.log(js.slice(Math.max(0, i - 200), i + 250).replace(/\s+/g, " ").slice(0, 400));
    i = js.indexOf(m, i + 1); n++;
  }
}
