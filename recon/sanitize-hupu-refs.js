// sanitize-hupu-refs.js — 把包内残留的虎扑/虎扑图片外域字符串改写为本地来源标记
// 这些字段仅作来源标注展示（avatarSourceUrl 从未被读取），改写不影响玩法与图片（头像走本地 base64）
const fs = require("fs");
const file = "C:/10.19源码/签下整个CBA/cba-startup.js";
let t = fs.readFileSync(file, "utf8");

const before = (t.match(/https?:\/\/[^\s"'`<>)]*(?:hupu|hoopchina)[^\s"'`<>)]*/g) || []).length;
const rewritten = t.replace(/https?:\/\/([a-z0-9.-]*(?:hupu|hoopchina)\.(?:com|cn))(\/[^\s"'`<>)]*)?/gi, (m, host, p) => {
  const slug = String(p || "").replace(/[^A-Za-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48);
  return "data-source.html#" + (slug || "source");
});
// 本地自更新白名单只对本地调试有意义，且同源校验已足够；去掉外域域名文本
const cleaned = rewritten.replace('["hupu.com","hoopchina.com.cn","static.cloudbase.net"]', '["localhost","127.0.0.1"]');
const after = (cleaned.match(/https?:\/\/[^\s"'`<>)]*(?:hupu|hoopchina)[^\s"'`<>)]*/g) || []).length;
const leftover = (cleaned.match(/(?:hupu|hoopchina|cloudbase)\.(?:com|cn)/gi) || []).length;

if (after === 0 && leftover === 0) {
  fs.writeFileSync(file, cleaned, "utf8");
  console.log("✓ 改写完成：原 " + before + " 处外域引用 → 0（无残留域名）");
} else {
  console.log("✗ 仍有残留：url=" + after + " domain=" + leftover);
  process.exit(1);
}
