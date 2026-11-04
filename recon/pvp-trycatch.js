// pvp-trycatch.js — 匹配对决按钮的 dispatch 加异常保护
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
let js = fs.readFileSync(root + "cba-startup.js", "utf8");
const OLD = "window.__CBA_TOAST__&&window.__CBA_TOAST__(`正在匹配玩家阵容…`);const ok=window.CBAStorageSession.dispatch({type:`beginMatch`});if(!ok)window.__CBA_TOAST__&&window.__CBA_TOAST__((window.CBAStorageSession.getSnapshot()||{}).message||`匹配暂不可用，请稍后再试`)";
const NEW = "window.__CBA_TOAST__&&window.__CBA_TOAST__(`正在匹配玩家阵容…`);try{const ok=window.CBAStorageSession.dispatch({type:`beginMatch`});if(ok!==true)window.__CBA_TOAST__&&window.__CBA_TOAST__((window.CBAStorageSession.getSnapshot()||{}).message||`匹配暂不可用，请稍后再试`)}catch(err){window.__CBA_TOAST__&&window.__CBA_TOAST__(err&&err.message||`匹配暂不可用，请稍后再试`)}";
if (js.indexOf(OLD) < 0) { console.log("✗ 锚点未找到"); process.exit(1); }
js = js.split(OLD).join(NEW);
fs.writeFileSync(root + "cba-startup.js", js, "utf8");
try { new Function(js); console.log("✓ 语法 OK"); } catch (e) { console.log("✗ " + e.message); process.exit(1); }
const VER = "20261030k-pvp-rank";
let html = fs.readFileSync(root + "index.html", "utf8");
fs.writeFileSync(root + "index.html", html, "utf8");
console.log("完成，版本 " + VER);