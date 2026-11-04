// css-probe.js — 探测 bundle 样式的组织方式（设计 token / CSS 变量 / 内联样式）
const fs = require("fs");
const raw = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
const marks = [":root{", "--cba-", "createElement(`style`)", "styled-components", "game-content{", ".game-content", "body{", "font-family"];
for (const m of marks) {
  let c = 0, i = 0;
  while ((i = raw.indexOf(m, i)) >= 0) { c++; i++; }
  console.log(m + ": " + c);
}
// 找 :root 定义处，看设计 token
let i = raw.indexOf(":root{");
if (i >= 0) console.log("\n=== :root 上下文 ===\n" + raw.slice(i, i + 1200));
// 找 body 背景
let b = raw.indexOf("body{");
if (b >= 0) console.log("\n=== body 上下文 ===\n" + raw.slice(b, b + 600));
