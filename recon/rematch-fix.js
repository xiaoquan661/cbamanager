// rematch-fix.js — onRematch 补 pe(null)，确保 arena 切到新比赛
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
let js = fs.readFileSync(root + "cba-startup.js", "utf8");
const OLD = "onRematch:()=>{setDismissedArena(null);F({type:xe.mode===`dungeon`?`beginDungeon`:`beginMatch`})}";
const NEW = "onRematch:()=>{setDismissedArena(null);pe(null);F({type:xe.mode===`dungeon`?`beginDungeon`:`beginMatch`})}";
if (js.indexOf(OLD) < 0) { console.log("✗ 未找到 onRematch 锚点"); process.exit(1); }
js = js.split(OLD).join(NEW);
fs.writeFileSync(root + "cba-startup.js", js, "utf8");
try { new Function(js); console.log("✓ onRematch 已补 pe(null)，语法 OK"); } catch (e) { console.log("✗ 语法失败: " + e.message); process.exit(1); }