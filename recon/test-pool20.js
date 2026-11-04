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
const pool = [{nickname:"测试经理甲",players:[{playerId:"cba-679408",name:"王哲林",position:"C"},{playerId:"cba-907766",name:"贺希宁",position:"SG"},{playerId:"cba-100002176",name:"白昊天",position:"PG"},{playerId:"cba-100002143",name:"韩德君",position:"C"},{playerId:"cba-907905",name:"原帅",position:"SG"}],updatedAt:"2026-10-29"},{nickname:"测试经理乙",players:[{playerId:"cba-100079508",name:"球员B1",position:"SF"},{playerId:"cba-100080917",name:"球员B2",position:"SG"},{playerId:"cba-100088371",name:"球员B3",position:"PF"},{playerId:"cba-908263",name:"球员B4",position:"C"},{playerId:"cba-907783",name:"球员B5",position:"SF"}],updatedAt:"2026-10-28"}];
const out = pool20(fake, pool);
console.log("长度:", out.length, "(期望20)");
console.log("前2队名:", out.slice(0,2).map(x=>x.team).join(" | "));
console.log("队名唯一:", new Set(out.map(x=>x.team)).size === 20 ? "✓" : "✗");
console.log("注入阵容:", out[0].team, "->", out[0].starters.map(p=>p.name).join(","));
console.log("官方保留:", out[2].team, "(后18队官方)");