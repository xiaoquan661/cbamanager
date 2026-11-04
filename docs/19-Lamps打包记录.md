# 19 Lamps 上传包打包记录（2026-10-30）

## 交付物

**`C:\10.19源码\CBA梦幻经理2\dist\cba-lamps-upload.zip`**（34.15MB，159 文件，index.html 在根 ✓）

## 包内清单

```
index.html                      入口（Lamps bridge 引用 + 启动 manifest）
cba-launch.js / cba-startup.css(558KB) / cba-startup.js(4014KB，含全部新玩法)
player-feed.json                内置数据快照兜底
assets/lamps/                   Lamps 四组 bridge/platform + glue + 每日任务 + rank-sync + squad-share
assets/                         头像分片 93 / 首屏图 / 精灵图 / cover
CBA范特西_资源_2MB/             字体 2 个（css 引用必须）
daily-*.svg                     页面美术
```

## 已清理（虎扑痕迹 0）

colorbox-ai / colyseus / hupu-js-bridge / web-guard / hupu-Medium.ttf / hupu-Regular.ttf——全部确认代码 0 引用后移除。

## 未包含（有意排除）

docs/、recon/、relay/（服务端）、dev-server.js、__ai_app.html、cba-app-gate.js、README

## 上传待办

1. **游戏名待定稿**（候选：《签下整个CBA》《CBA抄底之王》等，见讨论记录）——上传时需填写
2. 上传流程按 lamps-openapi（开发者控制台建 auth_key → 获取/新建 workSessionId → 上传 API），或 Lamps 创作者后台上传 zip
3. 真机验证清单：LampsGame.request 通路（meta/games 拉取）、云存档读写（saveGameProgress/getGameProgress）、广告播放（商店刷新/补给站）、排行榜提交/读榜、状态角标与每日任务显示
