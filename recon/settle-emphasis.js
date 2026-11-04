// settle-emphasis.js — 结算页胜负反馈强化 + 底部按钮布局修复
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
const cssPath = root + "cba-startup.css";
let css = fs.readFileSync(cssPath, "utf8");
const MARK = "/* settle-emphasis: 20261030 */";
if (css.indexOf(MARK) >= 0) { console.log("已存在"); process.exit(0); }
css += "\n" + MARK + `
.arena-outcome{position:relative;padding:18px 8px 16px;border-bottom:1px solid #263244;margin-bottom:6px}
.arena-outcome>span{display:inline-block;padding:4px 14px;border-radius:999px;border:1px solid currentColor;font:italic 800 22px/1.2 Arial;letter-spacing:4px}
.arena-outcome h2{font-size:clamp(21px,5vw,26px);letter-spacing:2px;color:#f8fafc;margin:12px 0 8px}
.arena-outcome p{font-size:12px;line-height:1.7;color:#94a3b8}
.arena-outcome.is-win>span{color:#a3e635;background:#a3e6351a;box-shadow:0 0 18px #a3e63533}
.arena-outcome.is-win h2{text-shadow:0 0 22px #a3e6355c}
.arena-outcome.is-win{background:radial-gradient(60% 120% at 50% 0,#a3e63512 0,transparent 70%)}
.arena-outcome.is-loss>span{color:#f97316;font-size:22px;background:#f973161a;box-shadow:0 0 18px #f9731633}
.arena-outcome.is-loss h2{text-shadow:0 0 22px #f973164a}
.arena-outcome.is-loss{background:radial-gradient(60% 120% at 50% 0,#f9731612 0,transparent 70%)}
.match-arena .arena-controls{gap:8px!important;background:#0f1622!important;border-top:1px solid #263244!important}
.arena-controls>button.arena-rematch,.arena-controls>button.arena-return{flex:1 1 0!important;width:auto!important;min-width:0!important;height:46px!important;min-height:46px!important;padding:0 14px!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:6px!important;white-space:nowrap!important;border-radius:10px!important;box-shadow:none!important;overflow:hidden!important;font-size:14px!important}
.arena-controls>button.arena-rematch{background:linear-gradient(100deg,#bdf25a,#8fd12a)!important;color:#0c1a06!important;border:1px solid #bdf25a!important;font-weight:800!important}
.arena-controls>button.arena-return{background:#1b2535!important;color:#e2e8f0!important;border:1px solid #3a4354!important;font-weight:700!important}
.arena-controls>button.arena-rematch svg,.arena-controls>button.arena-return svg{width:16px!important;height:16px!important;flex:none!important}
`;
fs.writeFileSync(cssPath, css, "utf8");
let html = fs.readFileSync(root + "index.html", "utf8");
html = html.replace(/cba-startup\.css\?v=[^"']+/, "cba-startup.css?v=20261030n-settle-ui");
html = html.replace(/cba-lamps-glue\.js\?v=[^"']+/, "cba-lamps-glue.js?v=20261030n-settle-ui");
fs.writeFileSync(root + "index.html", html, "utf8");
let glue = fs.readFileSync(root + "assets/lamps/cba-lamps-glue.js", "utf8");
glue = glue.replace(/var VERSION = '[^']+';/, "var VERSION = '20261030n-settle-ui';");
fs.writeFileSync(root + "assets/lamps/cba-lamps-glue.js", glue, "utf8");
console.log("✓ 结算页样式已强化，版本 → 20261030n-settle-ui");