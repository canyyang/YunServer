# YunServer

云翰教育后端服务，基于 [Egg.js](https://eggjs.org) 3 构建，提供学员/教员信息管理、当期数据聚合、JWT 鉴权与 MongoDB 持久化。

配套管理端与登记页见前端项目 [yunhan](../yunhan)。

## 技术栈

| 项目 | 说明 |
|------|------|
| 运行时 | Node.js ≥ 18 |
| 框架 | Egg.js 3 |
| 数据库 | MongoDB（egg-mongoose） |
| 鉴权 | egg-jwt + 自定义 `jwtErr` 中间件 |
| 部署 | PM2 + HTTPS（Let's Encrypt） |
| 端口 | 7001 |

## 目录结构

```
YunServer/
├── server.js              # 生产集群启动（HTTPS）
├── app/
│   ├── router.js          # 路由
│   ├── controller/        # 控制器
│   ├── service/           # 业务逻辑
│   ├── model/             # Mongoose 模型
│   ├── middleware/        # JWT 中间件
│   └── lib/               # 期数、JWT 等工具
├── config/
│   ├── config.default.js  # 默认配置
│   ├── config.prod.js     # 生产环境 MongoDB
│   └── config.local.js    # 本地开发 MongoDB
└── ecosystem.config.js    # PM2 配置
```

## 本地开发

```bash
# 安装依赖
npm i

# 启动开发服务（HTTP，默认 7001）
npm run dev
```

本地 MongoDB 连接在 `config/config.local.js` 中配置，请确保本机已启动 MongoDB。

其他命令：

```bash
npm run lint        # 代码检查
npm run test:local  # 运行测试
```

## 服务器部署与更新

生产环境使用 **PM2** 托管 `server.js`，通过 `ecosystem.config.js` 以 **production** 模式启动。

### 服务器信息（参考）

| 项目 | 值 |
|------|-----|
| 主机 | `120.77.36.205` |
| 项目路径 | `~/workspace/yun-server`（以服务器实际路径为准） |
| 仓库 | `git@github.com:canyyang/YunServer.git` |
| 分支 | `main` |
| PM2 应用名 | `yun-server` |
| 访问地址 | `https://canyyang.xyz:7001` |

> 若你服务器上的目录名是 `YunServer` 等大写形式，下面命令中的路径请改成实际路径。

### 每次更新后：拉取代码并重启（推荐）

SSH 登录服务器后执行：

```bash
# 1. 进入项目目录
cd ~/workspace/yun-server

# 2. 拉取最新代码
git fetch origin
git checkout main
git pull origin main

# 3. 安装/更新依赖（有 package.json 变更时必做）
npm i --production=false

# 4. 用 PM2 平滑重载（不中断或短暂中断）
pm2 startOrReload ecosystem.config.js --env production

# 5. 确认状态与日志
pm2 status
pm2 logs yun-server --lines 50
```

以上 4 步是**日常更新**的标准流程：改代码 → push 到 GitHub → 服务器 `git pull` → `pm2 startOrReload`。

### 首次部署

```bash
# 克隆仓库
git clone git@github.com:canyyang/YunServer.git ~/workspace/yun-server
cd ~/workspace/yun-server

# 安装依赖
npm i --production=false

# 首次启动
pm2 start ecosystem.config.js --env production

# 设置开机自启（可选）
pm2 save
pm2 startup
```

### 常用 PM2 命令

```bash
pm2 status                    # 查看进程状态
pm2 logs yun-server           # 查看实时日志
pm2 logs yun-server --err     # 仅错误日志
pm2 restart yun-server        # 硬重启（一般优先用 startOrReload）
pm2 stop yun-server           # 停止
pm2 delete yun-server         # 删除进程（慎用）
```

### 使用 pm2 deploy（可选）

项目已配置 `ecosystem.config.js` 中的 `deploy.production`，在**本机**执行可一键部署：

```bash
pm2 deploy ecosystem.config.js production
```

该命令会在服务器上自动执行 `git pull`、`npm i` 和 `pm2 startOrReload`。

### 更新后自检

```bash
# 进程应显示 online，且有 1 个 agent + EGG_WORKERS 个 worker
pm2 describe yun-server

# 健康检查（需有效 token）
curl -k https://127.0.0.1:7001/admin/dataset \
  -H "Authorization: <你的JWT>"
```

## 主要接口

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| POST | `/login` | 否 | 管理员登录，返回 JWT |
| GET | `/admin/dataset` | 是 | 当期学员 + 教员全量数据 |
| POST | `/student/get` | 是 | 学员分页列表 |
| GET | `/student/getDetail` | 是 | 学员详情 |
| POST | `/student/add` | 否 | 学员登记（公开） |
| GET | `/student/public` | 否 | 当期公开学员 |
| POST | `/student/setPublic` | 是 | 设置是否公开 |
| POST | `/student/edit/charge` | 是 | 修改分院（仅当期） |
| POST | `/student/edit/teacher` | 是 | 分配教员（仅当期） |
| GET | `/student/delete` | 是 | 删除学员（仅当期） |
| POST | `/teacher/get` | 是 | 教员分页列表 |
| GET | `/teacher/getDetail` | 是 | 教员详情 |
| POST | `/teacher/add` | 否 | 教员登记（公开） |
| GET | `/teacher/delete` | 是 | 删除教员（仅当期） |

写操作（edit / delete / setPublic）仅允许**当期**编号；新增记录由服务端按当期 `stage` 生成 ID。

## 期数规则

服务端与前端一致，逻辑在 `app/lib/stage.js`：

- **2013-06-01** 为第 1 期起点
- 每年 **6 月 1 日** 进入新一期
- 编号前两位 = 期数（如 `14047` → 第 14 期）
- ID 生成：`stage * 1000 + 序号`

## 配置说明

| 文件 | 用途 |
|------|------|
| `config/config.default.js` | JWT、CORS、HTTPS、集群超时等 |
| `config/config.prod.js` | 生产 MongoDB 连接 |
| `config/config.local.js` | 本地 MongoDB 连接 |
| `config/mongoOptions.js` | 连接池与超时参数 |
| `ecosystem.config.js` | PM2 进程数、`EGG_WORKERS` 等 |

生产 HTTPS 证书路径（`server.js` / `config.default.js`）：

```
/etc/letsencrypt/live/canyyang.xyz/privkey.pem
/etc/letsencrypt/live/canyyang.xyz/fullchain.pem
```

环境变量：

| 变量 | 说明 | 生产默认值 |
|------|------|------------|
| `NODE_ENV` | 运行环境 | `production` |
| `PORT` | 监听端口 | `7001` |
| `EGG_WORKERS` | Egg Worker 数量 | `2` |

## 许可证

MIT
