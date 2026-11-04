// 把中文目录里的字体挪到 assets/fonts/，避免移动端解压时中文路径乱码
const fs = require("fs");
const path = require("path");
const root = "C:/10.19源码/签下整个CBA";
const srcDir = path.join(root, "CBA范特西_资源_2MB");
const dstDir = path.join(root, "assets", "fonts");
fs.mkdirSync(dstDir, { recursive: true });
for (const f of ["asset-276.woff2", "asset-277.woff"]) {
  fs.copyFileSync(path.join(srcDir, f), path.join(dstDir, f));
}
let css = fs.readFileSync(path.join(root, "cba-startup.css"), "utf8");
const before = (css.match(/CBA范特西_资源_2MB/g) || []).length;
css = css.split("CBA范特西_资源_2MB/asset-276.woff2").join("assets/fonts/asset-276.woff2");
css = css.split("CBA范特西_资源_2MB/asset-277.woff").join("assets/fonts/asset-277.woff");
css = css.split("CBA范特西_资源_2MB/").join("assets/fonts/");
fs.writeFileSync(path.join(root, "cba-startup.css"), css, "utf8");
console.log("CSS 中文路径替换:", before, "剩余:", (css.match(/CBA范特西_资源_2MB/g) || []).length);

// stage 同步
const stage = path.join(root, "dist", "stage");
const stageDst = path.join(stage, "assets", "fonts");
fs.mkdirSync(stageDst, { recursive: true });
for (const f of ["asset-276.woff2", "asset-277.woff"]) {
  fs.copyFileSync(path.join(dstDir, f), path.join(stageDst, f));
}
fs.copyFileSync(path.join(root, "cba-startup.css"), path.join(stage, "cba-startup.css"));
const stageOld = path.join(stage, "CBA范特西_资源_2MB");
if (fs.existsSync(stageOld)) fs.rmSync(stageOld, { recursive: true, force: true });
console.log("stage 旧目录存在:", fs.existsSync(stageOld));