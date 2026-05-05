# 你画我猜 - 前端应用

一个基于 React + TypeScript 的实时多人在线"你画我猜"游戏前端应用。

## 技术栈

- **框架**: React 18
- **开发语言**: TypeScript
- **构建工具**: Vite
- **路由**: React Router v6
- **状态管理**: React Context API
- **实时通信**: Socket.io Client
- **绘图库**: Rough.js (手绘风格)
- **样式**: CSS-in-JS (内联样式)

## 项目架构

```
drawingBoard_frontend/
├── src/
│   ├── main.tsx              # 应用入口
│   ├── App.tsx               # 根组件
│   ├── vite-env.d.ts         # Vite 类型声明
│   │
│   ├── components/           # 可复用组件
│   │   ├── chat-panel.tsx       # 聊天/猜词面板
│   │   ├── timer.tsx            # 倒计时组件
│   │   ├── word-selector.tsx    # 选词界面
│   │   ├── score-board.tsx      # 计分板
│   │   ├── room-card.tsx        # 房间卡片
│   │   └── create-room-modal.tsx # 创建房间弹窗
│   │
│   ├── context/              # 全局状态管理
│   │   ├── socket-context.tsx   # Socket 连接管理
│   │   └── game-context.tsx     # 游戏状态管理
│   │
│   ├── pages/                # 页面组件
│   │   ├── lobby.tsx           # 大厅页面
│   │   └── game-room.tsx       # 游戏房间页面
│   │
│   ├── types/                # TypeScript 类型定义
│   │   ├── game.ts             # 游戏相关类型
│   │   └── socket.ts           # Socket 事件类型
│   │
│   └── type/                 # 旧类型定义(兼容)
│       └── element.ts          # 画布元素类型
│
├── public/                   # 静态资源
├── dist/                     # 构建输出
├── index.html                # HTML 模板
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 核心模块说明

### 1. 状态管理 (Context)

#### SocketContext
- 管理 Socket.io 连接
- 提供连接、断开、重连方法
- 全局共享 socket 实例

#### GameContext
- 房间列表管理
- 当前房间和玩家状态
- 游戏状态同步
- 聊天消息管理
- 画布元素管理

### 2. 页面组件

#### Lobby (大厅页面)
- 显示房间列表
- 创建房间功能
- 加入房间功能

#### GameRoom (游戏房间页面)
- 玩家列表显示
- 准备/开始游戏
- 画布绘制功能
- 聊天/猜词功能
- 游戏结束排名

### 3. 核心组件

#### ChatPanel
- 聊天消息展示
- 猜词输入
- 系统消息提示
- 自动滚动到最新消息

#### Timer
- 倒计时显示
- 进度条动画
- 阶段指示

#### WordSelector
- 词语选择界面
- 倒计时提示
- 超时自动选择

#### ScoreBoard
- 玩家排名展示
- 分数显示
- 排名样式区分

### 4. 画布功能

基于 Rough.js 实现的手绘风格画布：

- **画笔工具**: 自由绘制线条
- **矩形工具**: 绘制矩形
- **颜色选择**: 自定义画笔颜色
- **粗细调节**: 多种线条粗细
- **清空画布**: 一键清空

## 数据类型定义

### RoomData (房间数据)
```typescript
interface RoomData {
  id: string
  name: string
  hostId: string
  players: PlayerData[]
  maxPlayers: number
  status: RoomStatus
  currentRound: number
  maxRounds: number
  currentDrawerId: string | null
  currentWord: string | null
  wordHints: string[]
  drawTime: number
  canStartGame: boolean
}
```

### PlayerData (玩家数据)
```typescript
interface PlayerData {
  id: string
  nickname: string
  avatar: string
  score: number
  isReady: boolean
  isDrawing: boolean
  hasGuessed: boolean
  socketId: string
  isHost: boolean
}
```

### GameStatus (游戏状态)
```typescript
type GameStatus = 
  | 'waiting'    // 等待中
  | 'selecting'  // 选词中
  | 'drawing'    // 绘画中
  | 'roundEnd'   // 回合结束
  | 'gameEnd'    // 游戏结束
```

## 项目启动指南

### 环境要求
- Node.js >= 16.x
- npm >= 8.x

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```
应用将在 `http://localhost:5173` 启动，支持热重载。

### 生产构建
```bash
npm run build
```
构建产物将输出到 `dist/` 目录。

### 预览生产构建
```bash
npm run preview
```

### 类型检查
```bash
npm run build
```
TypeScript 编译器会进行类型检查。

## 配置说明

### 后端地址配置

在 `src/context/socket-context.tsx` 中修改后端地址：

```typescript
const SOCKET_URL = 'http://localhost:3000'
```

### Vite 配置

`vite.config.ts` 主要配置：
- React 插件
- 路径别名
- 开发服务器代理（如需要）

## 游戏流程说明

### 1. 进入大厅
- 查看当前房间列表
- 选择创建房间或加入已有房间

### 2. 房间等待
- 等待其他玩家加入
- 非房主玩家点击"准备"
- 房主在所有玩家准备后可开始游戏

### 3. 游戏进行
- **选词阶段**: 绘画者从3个词语中选择1个
- **绘画阶段**: 绘画者在画布上作画，其他玩家猜词
- **回合结束**: 显示正确答案和本回合得分

### 4. 游戏结束
- 所有回合完成后显示最终排名
- 可返回大厅继续游戏

## 开发注意事项

1. **组件拆分**: 保持组件职责单一，便于复用
2. **类型定义**: 充分利用 TypeScript 类型检查
3. **状态管理**: 合理使用 Context，避免过度渲染
4. **样式规范**: 使用内联样式保持一致性
5. **错误处理**: 处理网络断开、重连等异常情况

## 扩展建议

1. **UI 优化**
   - 添加动画效果
   - 响应式布局优化
   - 主题切换功能

2. **功能增强**
   - 个人中心页面
   - 历史战绩查看
   - 好友系统
   - 私人房间密码

3. **性能优化**
   - 画布渲染优化
   - 组件懒加载
   - 状态缓存

4. **用户体验**
   - 断线重连提示
   - 游戏音效
   - 表情包支持

## 常见问题

### Q: 无法连接后端？
A: 检查后端服务是否启动，确认 `SOCKET_URL` 配置正确。

### Q: 画布不显示？
A: 检查浏览器是否支持 Canvas，确认 Rough.js 正确加载。

### Q: 消息发送失败？
A: 检查 Socket 连接状态，确认已成功加入房间。

## 许可证

MIT License
