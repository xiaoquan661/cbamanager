// rematch-probe.js — 结算页返回按钮 + beginMatch 动作链路
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
function ctx(mark, before, after, max) {
  let i = js.indexOf(mark), n = 0;
  console.log("\n======== " + mark + " x" + (js.split(mark).length - 1) + " ========");
  while (i >= 0 && n < max) {
    console.log("--- @" + i + " ---");
    console.log(js.slice(Math.max(0, i - before), i + after).replace(/\s+/g, " ").slice(0, 500));
    i = js.indexOf(mark, i + 1); n++;
  }
}
ctx("返回征战之路", 400, 250, 2);
ctx("beginMatch", 300, 300, 4);