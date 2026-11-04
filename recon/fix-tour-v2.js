const fs = require("fs");
const file = "C:/10.19源码/签下整个CBA/cba-startup.js";
let js = fs.readFileSync(file, "utf8");

const oldTarget = "const target = doc.querySelector(STEPS[active.index].selector);\r\n      if (!visible(target)) { hide(); return; }";
const newTarget = "let target = null;\r\n      for (let guard = 0; guard < STEPS.length; guard++) {\r\n        target = doc.querySelector(STEPS[active.index].selector);\r\n        if (visible(target)) break;\r\n        if (active.index >= STEPS.length - 1) { finish('completed'); return; }\r\n        active.index++; active.scroll = true; updateText();\r\n      }\r\n      if (!visible(target)) { finish('completed'); return; }";
console.log("target:", js.split(oldTarget).length - 1);
js = js.split(oldTarget).join(newTarget);

const oldFresh = "rows.some(row => !row || row.completed !== false || row.claimed !== false || row.receipt)";
const newFresh = "rows.some(row => !row)";
console.log("fresh:", js.split(oldFresh).length - 1);
js = js.split(oldFresh).join(newFresh);

fs.writeFileSync(file, js, "utf8");
try { new Function(js); console.log("✓ 语法 OK"); } catch (e) { console.log("✗", e.message); process.exit(1); }
console.log("step4:", js.includes("button[aria-label=\"球队\"]"), "| skip:", js.includes("guard++") || js.includes("guard < STEPS.length"));