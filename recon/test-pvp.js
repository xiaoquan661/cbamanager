const crypto = require("crypto");
// 1) 真实云函数：上报阵容
const lu = { nickname: "测试经理甲", players: [
  {playerId:"cba-679408",name:"王哲林",position:"C"},
  {playerId:"cba-907766",name:"贺希宁",position:"SG"},
  {playerId:"cba-100002176",name:"白昊天",position:"PG"},
  {playerId:"cba-100002143",name:"韩德君",position:"C"},
  {playerId:"cba-907905",name:"原帅",position:"SG"} ] };
const r1 = await fetch("https://1519902968-675a8dv0r8.ap-shanghai.tencentscf.com/cba/lineup", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(lu) });
console.log("POST /cba/lineup:", r1.status, await r1.text());
// 2) 拉对手池
const r2 = await fetch("https://1519902968-675a8dv0r8.ap-shanghai.tencentscf.com/cba/lineups?count=5");
const j2 = await r2.json();
console.log("GET /cba/lineups:", r2.status, "池人数:", (j2.data.lineups||[]).length, "昵称:", (j2.data.lineups||[]).map(l=>l.nickname).join(","));
// 3) pool20 逻辑单测（复制 glue 的 pool20 核心逻辑）
function pool20(base, poolCache) {
  if (poolCache && poolCache.length) {
    var out = base.map(function (x) { return x; });
    var usedTeam = {};
    out.forEach(function (x) { usedTeam[x.team] = 1; });
    var idx = 0;
    for (var i = 0; i < poolCache.length && idx < out.length; i++) {
      var lu2 = poolCache[i];
      var team = lu2.nickname + " 的球队";
      var suffix = 2;
      while (usedTeam[team]) { team = lu2.nickname + " 的球队 " + suffix; suffix++; }
      usedTeam[team] = 1;
      out[idx++] = { team: team, starters: lu2.players.map(function (p) { return { playerId: p.playerId, name: p.name, position: p.position }; }), sourceDate: (lu2.updatedAt || "").slice(0, 10), basis: "真实玩家阵容 · 异步挑战", status: "roster-simulated-starting-five" };
    }
    return out;
  }
  return base;
}
const fake = Array.from({length:20}, (_,i)=>({team:"官方队"+i, starters:[1,2,3,4,5]}));
const out = pool20(fake, j2.data.lineups);
console.log("pool20: 长度=" + out.length + " (期望20), 前3队名=" + out.slice(0,3).map(x=>x.team).join(","), "| 唯一:", new Set(out.map(x=>x.team)).size === 20 ? "✓" : "✗");