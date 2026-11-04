const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
let css = fs.readFileSync(root + "cba-startup.css", "utf8");
const MARK = "/* daily-ui: 20261103 */";
if (css.includes(MARK)) { console.log("已存在"); process.exit(0); }
css += "\n" + MARK + `
body.cba-task-open{overflow:hidden!important}
.fantasy-app .page-checkin{background:transparent!important;padding:0 0 20px!important}
.fantasy-app .cba-attendance.attendance-calendar{background:transparent!important;margin:0!important;border-radius:0!important;color:#f8fafc!important;overflow:visible!important}
.fantasy-app .attendance-hero{height:auto!important;min-height:0!important;margin:0 13px 10px!important;padding:16px 16px 14px!important;border:1px solid #263244!important;border-radius:14px!important;background:linear-gradient(125deg,#111827,#0f1622)!important;color:#f8fafc!important;overflow:hidden!important}
.fantasy-app .attendance-hero-copy{width:100%!important;padding-right:76px!important;text-shadow:none!important}
.fantasy-app .attendance-hero-copy small{font-size:9px!important;font-weight:800!important;letter-spacing:2.2px!important;color:#a3e635!important}
.fantasy-app .attendance-hero-copy h2{margin:6px 0 8px!important;font-size:23px!important;line-height:1.25!important;font-weight:800!important;color:#f8fafc!important;letter-spacing:-.3px!important}
.fantasy-app .attendance-hero-copy h2 em{font-style:normal!important;color:#a3e635!important}
.fantasy-app .attendance-hero-copy p{width:auto!important;margin:0!important;font-size:10px!important;line-height:1.6!important;color:#94a3b8!important}
.fantasy-app .attendance-counter{position:absolute!important;top:14px!important;right:14px!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;min-width:58px!important;padding:7px 8px!important;border:1px solid #263244!important;border-radius:10px!important;background:#0b1220!important;z-index:2!important}
.fantasy-app .attendance-counter small{font-size:8px!important;line-height:1.4!important;color:#94a3b8!important}
.fantasy-app .attendance-counter b{margin-top:2px!important;font-size:18px!important;line-height:1!important;font-weight:800!important;color:#a3e635!important}
.fantasy-app .attendance-counter span{font-size:8px!important;line-height:1.4!important;color:#64748b!important}
.fantasy-app .attendance-meta{padding:0 15px 8px!important;font-size:11px!important;color:#94a3b8!important}
.fantasy-app .attendance-meta b{font-weight:700!important;color:#f8fafc!important}
.fantasy-app .attendance-meta span{font-weight:700!important;color:#a3e635!important;white-space:nowrap!important}
.fantasy-app .attendance-month{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:7px!important;padding:0 13px!important}
.fantasy-app .attendance-cell{min-height:104px!important;padding:9px 6px 24px!important;border:1px solid #263244!important;border-top:2px solid #334155!important;border-radius:10px!important;background:#111827!important;color:#f8fafc!important;box-shadow:none!important}
.fantasy-app .attendance-day{font-size:12px!important;line-height:1.3!important;font-weight:800!important;letter-spacing:.6px!important;color:#f8fafc!important;text-align:left!important}
.fantasy-app .attendance-day-label{margin:2px 0 4px!important;font-size:9px!important;font-weight:600!important;line-height:1.4!important;letter-spacing:0!important;color:#64748b!important;text-align:left!important}
.fantasy-app .attendance-coin-amount{height:auto!important;display:block!important;margin-top:2px!important;font-size:20px!important;line-height:1.1!important;font-weight:800!important;letter-spacing:-.5px!important;color:#a3e635!important}
.fantasy-app .attendance-name{margin-top:1px!important;font-size:9px!important;line-height:1.4!important;font-weight:600!important;color:#94a3b8!important}
.fantasy-app .attendance-edition{margin-top:1px!important;font-size:8px!important;line-height:1.4!important;color:#64748b!important}
.fantasy-app .attendance-state{position:absolute!important;bottom:0!important;left:0!important;right:0!important;padding:4px 2px!important;background:#0b1220!important;color:#94a3b8!important;font-size:9px!important;font-weight:700!important}
.fantasy-app .attendance-cell.is-today{border-color:#a3e635!important;border-top-color:#a3e635!important;background:linear-gradient(180deg,#16210f,#111827)!important;box-shadow:0 0 0 1px #a3e635 inset,0 6px 18px #a3e63514!important}
.fantasy-app .attendance-cell.is-today .attendance-day,.fantasy-app .attendance-cell.is-today .attendance-day-label{color:#d9f99d!important}
.fantasy-app .attendance-cell.is-today .attendance-state{background:#a3e635!important;color:#111827!important;font-weight:800!important}
.fantasy-app .attendance-cell.is-claimed .attendance-state{background:#1b2535!important;color:#a3e635!important}
.fantasy-app .attendance-cell.is-claimed .attendance-coin-amount{color:#64748b!important}
.fantasy-app .attendance-cell.is-expired{background:#0f1622!important;border-color:#1f2b3a!important}
.fantasy-app .attendance-cell.is-blank{display:none!important}
.fantasy-app .attendance-claim{width:calc(100% - 26px)!important;margin:12px 13px 0!important;min-height:46px!important;border:0!important;border-radius:10px!important;background:linear-gradient(100deg,#a3e635,#83bb1b)!important;color:#111827!important;font-size:15px!important;font-weight:800!important;box-shadow:0 6px 16px #a3e6351f!important}
.fantasy-app .attendance-claim:disabled{background:#1b2535!important;color:#64748b!important;box-shadow:none!important;opacity:1!important}
.fantasy-app .attendance-rule{padding:0 13px!important;margin:10px 0 0!important;font-size:10px!important;line-height:1.7!important;color:#64748b!important}
@media(max-width:360px){
  .fantasy-app .attendance-month{gap:5px!important;padding:0 10px!important}
  .fantasy-app .attendance-cell{min-height:96px!important;padding:8px 4px 22px!important}
  .fantasy-app .attendance-day{font-size:11px!important}
  .fantasy-app .attendance-coin-amount{font-size:18px!important}
  .fantasy-app .attendance-hero{margin:0 10px 8px!important;padding:14px 13px 12px!important}
  .fantasy-app .attendance-hero-copy h2{font-size:21px!important}
}
`;
fs.writeFileSync(root + "cba-startup.css", css, "utf8");
console.log("✓ 签到页与任务页样式已更新，CSS bytes", fs.statSync(root + "cba-startup.css").size);