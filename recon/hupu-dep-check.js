// hupu-dep-check.js — 删除前依赖核查
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
const launch = fs.readFileSync(root + "cba-launch.js", "utf8");
console.log("cba-launch 引用 cba-app-gate.js: " + launch.includes("cba-app-gate"));
console.log("cba-launch 引用 __ai_app.html: " + launch.includes("__ai_app"));
console.log("index.html 引用 __ai_app: " + fs.readFileSync(root + "index.html", "utf8").includes("__ai_app"));

const js = fs.readFileSync(root + "cba-startup.js", "utf8");
// ColorboxAI.request / cloud.request 的调用处与守卫
function ctx(mark, before, after, max) {
  let i = js.indexOf(mark), n = 0;
  console.log("\n======== " + mark + " ========");
  while (i >= 0 && n < max) {
    console.log("--- @" + i + " ---");
    console.log(js.slice(Math.max(0, i - before), i + after).replace(/\s+/g, " ").slice(0, 420));
    i = js.indexOf(mark, i + 1); n++;
  }
}
ctx("ColorboxAI.request", 260, 200, 6);
ctx("cloud.request", 260, 200, 4);
// 分享按钮 JSX 文案（React 组件里的入口）
ctx("分享战果", 200, 120, 4);
ctx("分享阵容", 200, 120, 4);
// 海报模块起点：找 2341599 之前最近的模块开头
let k = 2341599;
console.log("\n海报模块往前找模块边界:");
console.log(js.slice(2339500, 2340100).replace(/\s+/g, " "));
// 邀请码模块边界：找 redeem 所在对象/闭包
ctx("redeemedCodes", 150, 100, 2);
