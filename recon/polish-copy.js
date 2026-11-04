// polish-copy.js — 文案与叙事打磨补丁
const fs = require("fs");
const f = "C:/10.19源码/签下整个CBA/cba-startup.js";
let raw = fs.readFileSync(f, "utf8");

function rep(name, oldS, newS, expect) {
  let c = 0, i = 0;
  while ((i = raw.indexOf(oldS, i)) >= 0) { c++; i++; }
  if (expect && c !== expect) { console.log(`MISS ${name}: 命中 ${c}`); return false; }
  raw = raw.split(oldS).join(newS);
  console.log(`ok(${c}) ${name}`);
  return true;
}

// 1) 过时文案：浏览器存储提示
rep("storage-notice",
  "浏览器无法保存进度，请保持当前页面打开。",
  "进度自动保存至本机与云端，请保持页面打开。", 1);

// 2) 过时文案：补给站掉落描述（金币卡已下线）
rep("supply-desc",
  "每天不限次数 · 每次完整观看随机得 1 张金币卡或道具卡",
  "每天不限次数 · 每次完整观看随机得 1 张道具卡", 1);

// 3) 征战之路结算叙事文案包（胜负分支，种子随机取一条）
const oldMsg = "n.result={title:`${i?`比赛胜利`:`惜败，再战`} ${r.homeScore} : ${r.awayScore}`,message:`${r.phase} · 对阵${r.opponentTeam}。${i?`获得 ${a} 金币、${s}${c}。`:`获得败场安慰金币 ${a}。`} 胜方 MVP：${r.mvp.name}。${o}`,cards:r.reward.cards||[],coins:a,fragments:r.reward.fragments,match:r,kind:`match`},Q_";
const newMsg = "let fv0=[`这支球队正在书写自己的赛季。`,`胜利正在成为习惯。`,`一场一场，把目标踩在脚下。`,`每一次攻防都算数。`],fv1=[`失利会留下注脚，下一场由自己改写。`,`调整，再战，赛季还长。`,`低谷不会定义整段征程。`,`把这场记下来，下次讨回来。`],fv=(i?fv0:fv1)[Math.floor(J_(n)*(i?fv0:fv1).length)];n.result={title:`${i?`比赛胜利`:`惜败，再战`} ${r.homeScore} : ${r.awayScore}`,message:`${r.phase} · 对阵${r.opponentTeam}。${i?`获得 ${a} 金币、${s}${c}。`:`获得败场安慰金币 ${a}。`} 胜方 MVP：${r.mvp.name}。${o}${fv?` `+fv:``}`,cards:r.reward.cards||[],coins:a,fragments:r.reward.fragments,match:r,kind:`match`},Q_";
rep("match-narrative", oldMsg, newMsg, 1);

fs.writeFileSync(f, raw, "utf8");
try { new Function(raw); console.log("SYNTAX OK"); } catch (e) { console.log("SYNTAX FAIL: " + e.message); }
