const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
let css = fs.readFileSync(root + "cba-startup.css", "utf8");
const before = (css.match(/lobby-star\.jpg/g) || []).length;
css = css.split("assets/lobby/lobby-star.jpg?v=20261103p").join("assets/lobby/lobby-star.jpg");
css = css.split("assets/lobby/lobby-star.jpg").join("assets/lobby/lobby-star.jpg?v=20261103p");
fs.writeFileSync(root + "cba-startup.css", css, "utf8");
console.log("star 引用更新:", before, "处");
