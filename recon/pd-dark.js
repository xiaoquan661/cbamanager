// pd-dark.js — 球员详情/市场详情页白皮肤 → 深色主题
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
const cssPath = root + "cba-startup.css";
let css = fs.readFileSync(cssPath, "utf8");
const MARK = "/* pd-dark: 20261030 */";
if (css.indexOf(MARK) >= 0) { console.log("已存在"); process.exit(0); }
css += "\n" + MARK + `
:root{background:#090d16!important}
.app-screen{background:#090d16!important}
.bottom-sheet{background:#0f1622!important}
.sheet-handle{background:#3a4354!important}
.pd-detail{background:#0b111b!important;color:#f8fafc!important}
.pd-detail .pd-tabs{background:#0b111b!important;border-bottom-color:#263244!important}
.pd-detail .pd-tabs button{background:#0b111b!important;color:#94a3b8!important}
.pd-detail .pd-tabs button[aria-selected=true]{color:#a3e635!important;border-bottom-color:#a3e635!important}
.pd-detail .pd-body{background:#0b111b!important;color:#f8fafc!important}
.pd-detail .pd-avatar{background:#1b2535!important}
.pd-detail .pd-chart{background:#0b111b!important;border-bottom-color:#263244!important}
.pd-detail .pd-chart-canvas{background:#111827!important}
.pd-detail .pd-primary-stats>div,.pd-detail .pd-average-grid>div,.pd-detail .pd-composition-grid>div{background:#1b2535!important;border:1px solid #263244!important;border-radius:8px}
.pd-detail .pd-primary-stats strong,.pd-detail .pd-average-grid strong{color:#f8fafc!important}
.pd-detail .pd-primary-stats span,.pd-detail .pd-primary-stats small,.pd-detail .pd-average-grid small{color:#94a3b8!important}
.pd-detail .pd-period{background:#111827!important;border-color:#263244!important}
.pd-detail .pd-period button{background:#111827!important;color:#94a3b8!important}
.pd-detail .pd-period button[aria-pressed=true]{background:#1f2b1c!important;color:#a3e635!important;border-color:#a3e63566!important}
.pd-detail .pd-games th,.pd-detail .pd-games td{background:#111827!important;border-color:#263244!important;color:#e2e8f0!important}
.pd-detail .pd-game-filters button{background:#1b2535!important;border-color:#263244!important;color:#94a3b8!important}
.pd-detail .pd-game-filters button[aria-pressed=true]{background:#1f2b1c!important;color:#a3e635!important;border-color:#a3e63566!important}
.pd-detail .fantasy-confirm-price,.pd-detail .exchange-detail-price{background:#1b2535!important;border-color:#263244!important;color:#f8fafc!important}
.pd-detail .pd-trade-actions .exchange-blocked,.pd-detail .pd-trade-actions .exchange-list-form,.pd-detail .untradable-note,.pd-detail .sell-options{background:#1b2535!important;color:#94a3b8!important;border-color:#263244!important}
.pd-detail .pd-trade-actions input{background:#111827!important;color:#f8fafc!important;border-color:#263244!important}
.pd-detail h3{color:#a3e635!important}
.pd-detail .pd-section-head small,.pd-detail .pd-source,.pd-detail .pd-chart-meta,.pd-detail .pd-no-games{color:#94a3b8!important}
.pd-detail .pd-composition-grid span,.pd-detail .pd-composition span{color:#94a3b8!important}
.pd-detail .pd-composition-grid b,.pd-detail .pd-composition-grid strong{color:#f8fafc!important}
.cba-market-detail-enhanced{background:#0f1622!important;color:#f8fafc!important}
.cba-market-detail-enhanced .exchange-price-stats{background:#1b2535!important;color:#f8fafc!important;border-color:#263244!important}
.cba-detail-radar,.cba-detail-chart,.cba-market-detail-enhanced .cba-detail-chart,.cba-market-detail-enhanced .cba-detail-chart svg{background:#111827!important;border-color:#263244!important;color:#f8fafc!important}
.cba-detail-listings{background:#1b2535!important;border-color:#263244!important;color:#f8fafc!important}
.exchange-search,.exchange-price-stats,.coach-matchup{background:#111827!important;color:#f8fafc!important;border-color:#263244!important}
.segmented button.active,.exchange-entity button.active,.page-market .exchange-entity button.active{background:#1f2b1c!important;color:#a3e635!important;border-color:#a3e63566!important;box-shadow:none!important}
.r13-guide-dialog .r13-guide-head{background:#111827!important}
.cba-attendance{color:#f8fafc!important;background:#0f1622!important}
.attendance-cell,.attendance-cell.is-expired,.attendance-month .attendance-cell.is-blank{background:#1b2535!important;border-color:#263244!important}
.attendance-state{background:#1b2535!important;color:#94a3b8!important}
`;
fs.writeFileSync(cssPath, css, "utf8");
let html = fs.readFileSync(root + "index.html", "utf8");
html = html.replace(/cba-startup\.css\?v=[^"']+/, "cba-startup.css?v=20261030l-pd-dark");
html = html.replace(/cba-lamps-glue\.js\?v=[^"']+/, "cba-lamps-glue.js?v=20261030l-pd-dark");
fs.writeFileSync(root + "index.html", html, "utf8");
let glue = fs.readFileSync(root + "assets/lamps/cba-lamps-glue.js", "utf8");
glue = glue.replace(/var VERSION = '[^']+';/, "var VERSION = '20261030l-pd-dark';");
fs.writeFileSync(root + "assets/lamps/cba-lamps-glue.js", glue, "utf8");
console.log("✓ 球员详情深色覆盖已追加，版本 → 20261030l-pd-dark");