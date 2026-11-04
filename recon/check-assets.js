// check-assets.js — 检查 feed 中 avatar/logo 字段与远程 URL 残留
const fs = require("fs");
const j = JSON.parse(fs.readFileSync("C:/10.19源码/签下整个CBA/player-feed.json", "utf8"));
const raw = fs.readFileSync("C:/10.19源码/签下整个CBA/player-feed.json", "utf8");
const ps = Object.values(j.players || {});
console.log("players:", ps.length);
console.log("sample avatars:", JSON.stringify(ps.slice(0, 3).map(p => p.avatar)));
console.log("remote http avatars:", ps.filter(p => /^https?:/.test(p.avatar || "")).length);
const m = raw.match(/https?:\/\/[^"']{10,90}/g) || [];
console.log("feed 中远程URL出现次数:", m.length);
console.log([...new Set(m)].slice(0, 8).join("\n"));
