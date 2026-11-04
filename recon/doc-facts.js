// doc-facts.js — 写文档前核实关键事实（feed 时间/规模、快照结构）
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
const feed = JSON.parse(fs.readFileSync(root + "player-feed.json", "utf8"));
console.log("feed.updatedAt:", feed.updatedAt);
console.log("feed keys:", Object.keys(feed).join(", "));
console.log("players:", Object.keys(feed.players || {}).length);
console.log("schedules:", (feed.schedules || []).length);
console.log("teams:", Object.keys(feed.teams || {}).length);
console.log("coverage:", JSON.stringify(feed.coverage || null));
console.log("feed 大小 KB:", Math.round(fs.statSync(root + "player-feed.json").size / 1024));
// 快照里的日期范围
const dates = [...new Set((feed.schedules || []).map(s => s.date).filter(Boolean))].sort();
console.log("赛程日期范围:", dates[0], "~", dates[dates.length - 1]);
// 已完场数
console.log("完场(final)场次:", (feed.schedules || []).filter(s => s.status === 'final').length);
const js = fs.readFileSync(root + "cba-startup.js", "utf8");
console.log("\nCBAPlayerData 定义存在:", js.includes("CBAPlayerData"));
console.log("snapshot 全局:", js.includes("groundFeed") || js.includes("CBAPlayerData"));
console.log("practice 存储 key:", (js.match(/r13-isolated-practice/g) || []).length, "处");