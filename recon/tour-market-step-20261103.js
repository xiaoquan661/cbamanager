const fs=require("fs");
const p="cba-startup.js";
let s=fs.readFileSync(p,"utf8");
const oldText="    {id: 'predictions', selector: '.page-home .cover-fusion', title: '每日预测', text: '开赛前选择你看好的球队。确认时可以使用倍数卡，赛后自动结算。'},\r\n    {id: 'shop', selector: '.page-home .cover-recruit', title: '每日商店', text: '先免费翻开今日球员，再决定是否签约。D 类合同球员和外援享折扣。'},";
const newText="    {id: 'predictions', selector: '.page-home .cover-fusion', title: '每日预测', text: '开赛前选择你看好的球队。确认时可以使用倍数卡，赛后自动结算。'},\r\n    {id: 'market', selector: '.page-home .cover-market', title: '签约市场', text: '查看每日行情与球员身价；点击「涨跌幅 / 能力 / 价格」排序，再点同一标签切换正序与倒序。'},\r\n    {id: 'shop', selector: '.page-home .cover-recruit', title: '每日商店', text: '先免费翻开今日球员，再决定是否签约。D 类合同球员和外援享折扣。'},";
const c=s.split(oldText).length-1;
if(c!==1){console.error("MATCH",c);process.exit(1);}
s=s.split(oldText).join(newText);
fs.writeFileSync(p,s,"utf8");
console.log("ok",fs.statSync(p).size);
