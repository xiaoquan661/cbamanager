// remove-pvp.js — 删除异步对决玩法（official-feed 只读，不承载玩家阵容）
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";

// 1) bundle：移除大厅「匹配对决」磁贴
let js = fs.readFileSync(root + "cba-startup.js", "utf8");
const pvpAnchor = "(0,D.jsxs)(`button`,{className:`cover-tile cover-pvp`";
const rankAnchor = "(0,D.jsxs)(`button`,{className:`cover-tile cover-ranking`";
const s = js.indexOf(pvpAnchor);
const r = js.indexOf(rankAnchor, s);
if (s < 0 || r < 0 || js[s - 1] !== "," || js[r - 1] !== ",") {
  console.log("✗ 磁贴边界不匹配", { s, r, before: js[s - 1], beforeRank: js[r - 1] });
  process.exit(1);
}
js = js.slice(0, s - 1) + js.slice(r);
const oldHook = "if(window.__CBA_PVPSYNC__){var p20=window.__CBA_PVPSYNC__.pool20(P_);if(p20&&p20.length===20)P_=p20;}";
const hookCount = js.split(oldHook).length - 1;
js = js.split(oldHook).join("");
fs.writeFileSync(root + "cba-startup.js", js, "utf8");
try { new Function(js); console.log("✓ bundle 语法 OK；磁贴已删，PVP 钩子删除", hookCount, "处"); }
catch (e) { console.log("✗ bundle 语法失败:", e.message); process.exit(1); }

// 2) glue：移除阵容共享初始化
let glue = fs.readFileSync(root + "assets/lamps/cba-lamps-glue.js", "utf8");
const blockStart = glue.indexOf("  /* ---------- 异步 PVP（P2）：阵容共享模块初始化 ----------");
const blockEnd = glue.indexOf("  /* ---------- 轻提示 Toast（交互反馈） ----------", blockStart);
if (blockStart < 0 || blockEnd < 0) { console.log("✗ glue 区块未找到"); process.exit(1); }
glue = glue.slice(0, blockStart) + glue.slice(blockEnd);
glue = glue.replace(/\n\s*bootSquadShare\(\);/, "");
fs.writeFileSync(root + "assets/lamps/cba-lamps-glue.js", glue, "utf8");
try { new Function(glue); console.log("✓ glue 语法 OK；bootSquadShare 已移除"); }
catch (e) { console.log("✗ glue 语法失败:", e.message); process.exit(1); }

// 3) index.html：移除阵容共享脚本
let html = fs.readFileSync(root + "index.html", "utf8");
const beforeLen = html.length;
html = html.replace(/\s*<script defer src="assets\/lamps\/cba-squad-share-r29\.js\?v=[^"]*"><\/script>/, "");
if (html.length === beforeLen) console.log("! index 未找到 squad-share 引用（可能已删）");
fs.writeFileSync(root + "index.html", html, "utf8");
console.log("✓ index 已移除 squad-share 引用");

// 4) CSS：移除 cover-pvp 规则，重排赛季/排行榜磁贴
let css = fs.readFileSync(root + "cba-startup.css", "utf8");
css = css.split("\n").filter(line => line.indexOf("cover-pvp") < 0).join("\n");
const MARK = "/* pvp-removed: 20261103 */";
if (css.indexOf(MARK) < 0) {
  css += "\n" + MARK + `
.page-home .cover-grid button.cover-season{grid-area:2/1/span 2/7!important}
.page-home .cover-grid button.cover-ranking{grid-area:4/1/auto/-1!important}
`;
}
fs.writeFileSync(root + "cba-startup.css", css, "utf8");
console.log("✓ CSS 已移除 cover-pvp 并重排磁贴");

// 5) 榜单 dataLoad 不再上传阵容（异步对决已删）
let rank = fs.readFileSync(root + "assets/lamps/cba-rank-sync.js", "utf8");
rank = rank.replace("//   - dataLoad 附带 {nickname, lineup:[5×playerId]}（异步 PVP 对手池来源；predict 榜只带 nickname）",
  "//   - dataLoad 只带 {nickname} / {nickname, wins}，不上传阵容");
rank = rank.replace("var lineup = [], power = 0, value = 0, names = [];", "var lineup = [], power = 0, value = 0;");
rank = rank.replace(/\n\s*names\.push\(player\.name \|\| ''\);/, "");
rank = rank.replace("dataLoad: { nickname: nickname(), lineup: lineup, names: names },", "dataLoad: { nickname: nickname() },");
rank = rank.replace("VERSION: 'rank-r30-20261030'", "VERSION: 'rank-r31-20261103'");
fs.writeFileSync(root + "assets/lamps/cba-rank-sync.js", rank, "utf8");
try { new Function(rank); console.log("✓ rank-sync 语法 OK；dataLoad 已去掉阵容"); }
catch (e) { console.log("✗ rank-sync 语法失败:", e.message); process.exit(1); }
