// rematch-patch.js — 结算页加"再战一会"按钮，直接开下一场模拟
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
let js = fs.readFileSync(root + "cba-startup.js", "utf8");
let ok = 0;

// 1) arena 组件签名加 onRematch
const OLD_SIG = "function ay({match:e,settled:t,renderCard:n,onComplete:r,onClose:i,onLeave,settledReward,onTactics:o,onProgress:s,onPlayer})";
const NEW_SIG = "function ay({match:e,settled:t,renderCard:n,onComplete:r,onClose:i,onLeave,settledReward,onTactics:o,onProgress:s,onPlayer,onRematch})";
if (js.indexOf(OLD_SIG) >= 0) { js = js.split(OLD_SIG).join(NEW_SIG); ok++; console.log("✓ 组件签名已加 onRematch"); }
else console.log("✗ 未找到 ay 签名");

// 2) 结算页 footer：一钮 → 两钮（再战一会 + 返回征战之路）
const OLD_FOOT = "t?(0,D.jsxs)(`button`,{ref:E,type:`button`,className:`button gold full`,onClick:i,children:[`返回征战之路 `,(0,D.jsx)(Z,{})]})";
const NEW_FOOT = "t?(0,D.jsxs)(D.Fragment,{children:[e.matchIndex<25&&(0,D.jsxs)(`button`,{type:`button`,className:`arena-rematch`,onClick:()=>onRematch&&onRematch(),children:[`再战一会 `,(0,D.jsx)(Z,{})]}),(0,D.jsxs)(`button`,{ref:E,type:`button`,className:`arena-return`,onClick:i,children:[`返回征战之路 `,(0,D.jsx)(Z,{})]})]})";
if (js.indexOf(OLD_FOOT) >= 0) { js = js.split(OLD_FOOT).join(NEW_FOOT); ok++; console.log("✓ 结算页双按钮已注入"); }
else console.log("✗ 未找到 footer 锚点");

// 3) 调用点加 onRematch（派发开赛动作）
const OLD_CALL = "onLeave:()=>{setDismissedArena({...cbaArenaOwner(window.CBAStorageSession.getSnapshot()),matchId:xe.id});pe(null);P(`home`)}";
const NEW_CALL = OLD_CALL + ",onRematch:()=>{setDismissedArena(null);F({type:xe.mode===`dungeon`?`beginDungeon`:`beginMatch`})}";
if (js.indexOf(OLD_CALL) >= 0) { js = js.split(OLD_CALL).join(NEW_CALL); ok++; console.log("✓ 调用点已加 onRematch"); }
else console.log("✗ 未找到调用点锚点");

if (ok !== 3) { console.log("部分未命中，放弃写入"); process.exit(1); }
fs.writeFileSync(root + "cba-startup.js", js, "utf8");
try { new Function(js); console.log("✓ 语法 OK"); } catch (e) { console.log("✗ 语法失败: " + e.message); process.exit(1); }

// 4) CSS：双按钮布局
const cssPath = root + "cba-startup.css";
let css = fs.readFileSync(cssPath, "utf8");
const MARK = "/* arena-rematch: 20261030 */";
if (css.indexOf(MARK) < 0) {
  css += "\n" + MARK + `
.arena-controls>button.arena-rematch{flex:1;color:#0c3f57!important;background:#a6e236!important;border-color:#a6e236!important;font-weight:800;justify-content:center;display:flex;align-items:center;gap:6px;min-height:44px;padding:8px 12px}
.arena-controls>button.arena-return{flex:1;color:#f5f6f7!important;background:#21252e!important;border:1px solid #6c717a!important;justify-content:center;display:flex;align-items:center;gap:6px;min-height:44px;padding:8px 12px}
`;
  fs.writeFileSync(cssPath, css, "utf8");
  console.log("✓ CSS 已追加");
}
let html = fs.readFileSync(root + "index.html", "utf8");
html = html.replace(/cba-startup\.css\?v=[^"']+/, "cba-startup.css?v=20261030g-rematch");
fs.writeFileSync(root + "index.html", html, "utf8");

// 5) 版本
let glue = fs.readFileSync(root + "assets/lamps/cba-lamps-glue.js", "utf8");
glue = glue.replace(/var VERSION = '[^']+';/, "var VERSION = '20261030g-rematch';");
fs.writeFileSync(root + "assets/lamps/cba-lamps-glue.js", glue, "utf8");
html = fs.readFileSync(root + "index.html", "utf8");
html = html.replace(/cba-lamps-glue\.js\?v=[^"']+/, "cba-lamps-glue.js?v=20261030g-rematch");
fs.writeFileSync(root + "index.html", html, "utf8");
console.log("版本 → 20261030g-rematch");