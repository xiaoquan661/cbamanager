// revert-tactics-icon.js — 撤销「战术调整」按钮图标替换，恢复原魔棒图标
const fs = require("fs");
const file = "C:/10.19源码/签下整个CBA/cba-startup.js";
let js = fs.readFileSync(file, "utf8");

const icon = "(0,D.jsx)(`svg`,{width:`15`,height:`15`,viewBox:`0 0 15 15`,fill:`none`,xmlns:window.CBADOMNamespaces.svg,children:(0,D.jsx)(`path`,{d:`M3.4 3.1h8.2a.8.8 0 0 1 .8.8v7.2a.8.8 0 0 1-.8.8H3.4a.8.8 0 0 1-.8-.8V3.9a.8.8 0 0 1 .8-.8zM5.2 5.7l2 2M7.2 5.7l-2 2M9.3 8.2a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5z`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.35`,strokeLinecap:`round`,strokeLinejoin:`round`})})";
const oldMark = "(0,D.jsx)(Og,{}),`战术调整`";
const n = js.split(icon + ",`战术调整`").length - 1;
console.log("替换后图标匹配:", n);
if (n !== 1) { console.log("未定位，停止"); process.exit(1); }
js = js.replace(icon + ",`战术调整`", oldMark);
fs.writeFileSync(file, js, "utf8");
try { new Function(js); console.log("✓ 已恢复原图标，语法 OK"); }
catch (e) { console.log("✗ 语法失败:", e.message); process.exit(1); }
