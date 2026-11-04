// 底部导航：大厅 · 商店 · 市场 · 球队 · 征战
const fs = require("fs");
const p = "C:/10.19源码/签下整个CBA/cba-startup.js";
let js = fs.readFileSync(p, "utf8");
const from = "var Sy=[{id:`home`,label:`大厅`,icon:gg},{id:`recruit`,label:`商店`,icon:Sg},{id:`market`,label:`市场`,icon:Uh},{id:`season`,label:`征战`,icon:Jg},{id:`collection`,label:`球队`,icon:Vh}]";
const to = "var Sy=[{id:`home`,label:`大厅`,icon:gg},{id:`recruit`,label:`商店`,icon:Sg},{id:`market`,label:`市场`,icon:Uh},{id:`collection`,label:`球队`,icon:Vh},{id:`season`,label:`征战`,icon:Jg}]";
if (!js.includes(from)) {
  console.log("WARN nav array not found");
} else {
  js = js.replace(from, to);
  fs.writeFileSync(p, js, "utf8");
  console.log("nav order updated");
}
console.log("bytes", fs.statSync(p).size);
