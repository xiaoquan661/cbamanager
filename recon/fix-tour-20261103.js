// 新手引导修复：
// 1) 第 4 步目标 .cover-team 在新大厅不存在，改为底部导航「球队」
// 2) 目标缺失时跳过该步，而不是整层隐藏
// 3) 只要账号还是空白队（无卡、未比赛），即使先点了别的按钮引导也不消失
const fs = require("fs");
const file = "C:/10.19源码/签下整个CBA/cba-startup.js";
let js = fs.readFileSync(file, "utf8");

const oldStep = "selector: '.page-home .cover-team', title: '我的球队'";
const newStep = "selector: 'button[aria-label=\"球队\"]', title: '我的球队'";
console.log("step4 match:", js.split(oldStep).length - 1);
js = js.split(oldStep).join(newStep);

const oldTarget = "const target = doc.querySelector(STEPS[active.index].selector); if (!visible(target)) { hide(); return; }";
const newTarget = "let target = null; for (let guard = 0; guard < STEPS.length; guard++) { target = doc.querySelector(STEPS[active.index].selector); if (visible(target)) break; if (active.index >= STEPS.length - 1) { finish('completed'); return; } active.index++; active.scroll = true; updateText(); } if (!visible(target)) { finish('completed'); return; }";
console.log("target match:", js.split(oldTarget).length - 1);
js = js.split(oldTarget).join(newTarget);

const oldFresh = "if (rows.length < 5 || ['lineup', 'first_match', 'first_swap', 'first_prediction', 'first_shop_reveal'].some(id => !tutorial[id]) || rows.some(row => !row || row.completed !== false || row.claimed !== false || row.receipt)) return false;";
const newFresh = "if (rows.length < 5 || ['lineup', 'first_match', 'first_swap', 'first_prediction', 'first_shop_reveal'].some(id => !tutorial[id]) || rows.some(row => !row)) return false;";
console.log("fresh match:", js.split(oldFresh).length - 1);
js = js.split(oldFresh).join(newFresh);

fs.writeFileSync(file, js, "utf8");
try { new Function(js); console.log("✓ bundle 语法 OK"); } catch (e) { console.log("✗", e.message); process.exit(1); }