// pull-original.js — 拉取虎扑线上原版最新 bundle，对比球员详情页是否改版
const fs = require("fs");
const path = require("path");
const p = "C:/10.19源码/CBA梦幻经理/";
for (const f of ["index.html", "__ai_app.html"]) {
  const raw = fs.readFileSync(p + f, "utf8");
  const urls = [...new Set((raw.match(/https?:\/\/[^"' )]{10,140}/g) || []))];
  console.log("== " + f + " 外链 ==");
  console.log(urls.slice(0, 15).join("\n"));
  // 相对路径的 js/css 引用
  const rel = [...new Set((raw.match(/(?:src|href)=[\"']([^\"']+\.(?:js|css))[\"']/g) || []).map(m => m.replace(/(?:src|href)=[\"']/, "")))];
  console.log("-- 相对引用 --\n" + rel.slice(0, 15).join("\n"));
}
