// test-taskclaim.js — 验证 practice 白名单与 taskClaim 分支修复
const fs = require("fs");
const src = fs.readFileSync("C:/10.19源码/CBA梦幻经理2/cba-startup.js", "utf8");

// 1) 白名单包含 taskClaim
const wl = src.includes("'taskClaim'])") || src.includes('"taskClaim"])');
console.log("1) 白名单含 taskClaim:", wl);

// 2) taskClaim 分支存在且逻辑正确（提取分支源码模拟执行）
const m = src.match(/if\(t\.type===`taskClaim`\)\{[^}]+\}/);
if (!m) { console.log("2) taskClaim 分支: 未找到"); process.exit(1); }
console.log("2) 分支源码:", m[0]);

// 模拟：n.coins=500, amount=20 → 期望 520；amount=400 → assert 抛错
let coins = 500;
const n = { coins: coins, log: [] };
const Q_ = (st, text) => st.log.push(text);
const $ = (cond, msg) => { if (!cond) throw new Error(msg); };
function runBranch(t) {
  const branch = m[0]
    .replace(/if\(t\.type===`taskClaim`\)\{/, "")
    .replace(/\}$/, "")
    .replace(/return n/, "");
  eval(branch);
}
runBranch({ type: "taskClaim", amount: 20 });
console.log("3) 正常领取: 500 ->", n.coins, "(期望 520)", n.coins === 520 ? "✓" : "✗");

// 3) 边界：amount=300 允许（周奖励），amount=301 拒绝
let n2 = { coins: 0, log: [] };
try {
  runBranch({ type: "taskClaim", amount: 301 });
  console.log("4) amount=301: 未拒绝 ✗");
} catch (e) { console.log("4) amount=301 拒绝 ✓ (" + e.message + ")"); }

// 5) 上限确认：allowed Set 完整性
const allowedSrc = src.match(/Set\(\[([^\]]+)\]\)/);
const allowedItems = allowedSrc[1].split(",").map(s => s.replace(/['`]/g, ""));
console.log("5) allowed 包含 taskClaim:", allowedItems.includes("taskClaim"), "| 白名单项数:", allowedItems.length);
