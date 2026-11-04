// tactic-vector-icons.js — 用矢量战术板图示替换 20 个战术卡片位图图标
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";

const W = 60, H = 39;

function svg(body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">${body}</svg>`;
}
function court() {
  return `<rect x="1.4" y="2.6" width="57.2" height="33.8" rx="3" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="1.3"/>`
    + `<path d="M30 2.6v33.8" stroke="#fff" stroke-opacity=".18" stroke-width="1.1"/>`
    + `<circle cx="50" cy="19.5" r="3.6" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1.3"/>`;
}
function dot(x, y, r = 2.5) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/>`;
}
function ring(x, y, r = 2.4) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="1.5"/>`;
}
function line(x1, y1, x2, y2, w = 1.5, op = .65) {
  return `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#fff" stroke-opacity="${op}" stroke-width="${w}" stroke-linecap="round"/>`;
}
function dashed(x1, y1, x2, y2) {
  return `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#fff" stroke-opacity=".7" stroke-width="1.5" stroke-dasharray="3 2.4" stroke-linecap="round"/>`;
}
function arrow(x1, y1, x2, y2, w = 1.7) {
  const ang = Math.atan2(y2 - y1, x2 - x1), L = 4.4;
  const a1 = ang + Math.PI - 0.42, a2 = ang + Math.PI + 0.42;
  const p1 = [x2 + L * Math.cos(a1), y2 + L * Math.sin(a1)];
  const p2 = [x2 + L * Math.cos(a2), y2 + L * Math.sin(a2)];
  return line(x1, y1, x2, y2, w, .85)
    + `<path d="M${x2} ${y2}L${p1[0].toFixed(1)} ${p1[1].toFixed(1)}L${p2[0].toFixed(1)} ${p2[1].toFixed(1)}Z" fill="#fff" fill-opacity=".9"/>`;
}
function zone(x, y, w, h, rx = 2) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.2" stroke-dasharray="2.6 2.2"/>`;
}

const ICONS = {
  // 进攻
  rim: court() + dot(14, 10) + dot(14, 29) + dot(24, 19.5) + arrow(16, 12, 45, 18) + arrow(16, 27, 45, 21) + arrow(26, 19.5, 45, 19.5),
  pace: court() + dot(11, 10) + dot(11, 29) + dot(18, 19.5) + arrow(13, 10, 50, 10) + arrow(13, 29, 50, 29) + arrow(20, 19.5, 52, 19.5) + line(7, 15, 13, 15, 1.2, .4) + line(7, 24, 13, 24, 1.2, .4),
  high: court() + dot(30, 19.5) + dot(12, 8) + dot(12, 31) + arrow(30, 19.5, 44, 10) + arrow(30, 19.5, 44, 29) + line(30, 19.5, 30, 9, 1.3, .5),
  cross: court() + dot(16, 12) + dot(16, 27) + arrow(17, 14, 38, 26) + arrow(17, 25, 38, 13),
  handoff: court() + dot(23, 14) + dot(26, 24) + arrow(24, 16, 27, 21, 1.4) + arrow(28, 24, 45, 19.5),
  cut: court() + dot(12, 19.5) + dot(30, 9) + dashed(14, 19.5, 29, 10) + arrow(30, 9, 45, 19) + dot(34, 31),
  princeton: court() + dot(27, 11) + dot(12, 29) + dot(20, 33) + arrow(28, 12, 45, 27) + arrow(14, 28, 38, 9) + dashed(27, 11, 12, 29),
  pick: court() + dot(22, 14) + dot(26, 14) + ring(26, 24) + line(26, 16, 26, 21, 1.8, .9) + arrow(28, 15, 46, 19.5),
  wing: court() + dot(44, 8) + dot(44, 19.5) + dot(44, 31) + arrow(18, 19.5, 43, 8) + dashed(44, 8, 44, 19.5),
  triangle: court() + dot(18, 10) + dot(18, 29) + dot(35, 19.5) + line(18, 10, 18, 29, 1.2, .5) + line(18, 10, 35, 19.5, 1.2, .5) + line(18, 29, 35, 19.5, 1.2, .5) + arrow(36, 19.5, 47, 19.5),
  // 防守
  paint: court() + dot(44, 12) + dot(44, 27) + dot(36, 19.5) + `<path d="M40 12a7.5 7.5 0 0 0 0 15" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1.4" stroke-dasharray="2.6 2.2"/>` + ring(50, 19.5, 3.4),
  zone23: court() + zone(32, 7, 20, 25) + dot(38, 9.5) + dot(38, 29.5) + dot(48, 9.5) + dot(48, 19.5) + dot(48, 29.5),
  hustle: court() + dot(30, 19.5) + line(30, 16, 30, 11, 1.5, .7) + line(30, 23, 30, 28, 1.5, .7) + line(27, 19.5, 21, 19.5, 1.5, .7) + line(33, 19.5, 39, 19.5, 1.5, .7) + dot(14, 19.5, 2.2) + dot(46, 19.5, 2.2),
  press: court() + dot(12, 10) + dot(20, 19.5) + dot(12, 29) + arrow(14, 10, 38, 17) + arrow(22, 19.5, 40, 19.5) + arrow(14, 29, 38, 22) + ring(44, 19.5, 2.4),
  zone: court() + zone(34, 8, 18, 23) + dot(38, 11) + dot(48, 11) + dot(38, 28) + dot(48, 28),
  zone32: court() + zone(33, 7, 21, 25) + dot(39, 9.5) + dot(39, 19.5) + dot(39, 29.5) + dot(49, 13) + dot(49, 26),
  double: court() + dot(42, 12, 3) + dot(42, 27, 3) + line(46, 12, 46, 27, 1.4, .5) + arrow(48, 12, 49, 18) + arrow(48, 27, 49, 21) + ring(50, 19.5, 3.2),
  switch: court() + dot(16, 11) + dot(16, 28) + dot(32, 11) + dot(32, 28) + arrow(18, 12, 30, 27) + arrow(18, 27, 30, 12),
  man: court() + dot(16, 10) + ring(24, 10, 2) + dot(16, 19.5) + ring(24, 19.5, 2) + dot(16, 29) + ring(24, 29, 2) + dot(36, 12) + ring(44, 12, 2) + dot(36, 26) + ring(44, 26, 2),
  zone131: court() + zone(34, 6, 20, 27) + dot(38, 19.5) + dot(46, 10) + dot(46, 19.5) + dot(46, 29) + dot(52, 19.5),
};

function dataUri(s) {
  return "url(\"data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg(s)) + "\")";
}

let css = fs.readFileSync(root + "cba-startup.css", "utf8");
const MARK = "/* tactic-vector-icons: 20261103 */";
if (css.includes(MARK)) { console.log("已存在，跳过"); process.exit(0); }

let out = "\n" + MARK + `
.fantasy-app .tp-choices .tp-icon{background-image:none!important;background-color:currentColor!important;-webkit-mask-repeat:no-repeat!important;mask-repeat:no-repeat!important;-webkit-mask-position:center!important;mask-position:center!important;-webkit-mask-size:60px 39px!important;mask-size:60px 39px!important}
`;
for (const [k, body] of Object.entries(ICONS)) {
  const u = dataUri(body);
  out += `.tp-icon-${k}{-webkit-mask-image:${u}!important;mask-image:${u}!important}\n`;
}
css += out;
fs.writeFileSync(root + "cba-startup.css", css, "utf8");
console.log("✓ 已生成", Object.keys(ICONS).length, "个矢量战术图标，CSS 大小", Buffer.byteLength(css, "utf8"));
