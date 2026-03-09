# 🦞 OpenClaw Desktop

**一键部署 · 零配置 · 跨平台**

OpenClaw Desktop 是一个图形化的 OpenClaw 部署和管理工具，让 AI 助手触手可及！

---

## ✨ 特性

- 🚀 **一键安装** - 自动检测环境，智能安装依赖
- ⚙️ **图形配置** - 无需命令行，可视化配置 AI 模型
- 🔄 **自动更新** - 始终保持最新版本
- 📊 **实时监控** - 查看运行状态、日志、统计信息
- 🌐 **跨平台** - 支持 Windows、macOS、Linux

---

## 📥 下载安装

### Windows
1. 下载 [OpenClaw-Setup-1.0.0.exe](https://github.com/carl-cf/openclaw-desktop/releases)
2. 双击运行
3. 按照向导完成安装

### macOS
1. 下载 [OpenClaw-1.0.0.dmg](https://github.com/carl-cf/openclaw-desktop/releases)
2. 拖拽到 Applications 文件夹
3. 首次运行右键→打开

### Linux
```bash
# Debian/Ubuntu
sudo dpkg -i openclaw_1.0.0_amd64.deb

# 或使用包管理器
sudo apt install ./openclaw_1.0.0_amd64.deb
```

---

## 🎯 快速开始

### 第 1 步：运行应用
双击桌面图标启动 OpenClaw Desktop

### 第 2 步：环境检测
应用会自动检测：
- ✅ Node.js
- ✅ npm
- ✅ 网络连接
- ✅ 磁盘空间

如缺失会自动提示安装

### 第 3 步：配置 AI 模型
选择模型提供商并输入 API Key：
- 百度千帆 (Qwen)
- SiliconFlow (MiniMax)
- OpenAI (GPT-4)
- 自定义

### 第 4 步：配置通信渠道
选择使用方式：
- 飞书私聊
- Telegram
- 仅网页版

### 第 5 步：启动服务
点击"启动服务"按钮，完成！

---

## 🖥️ 界面预览

### 欢迎界面
简洁大气的欢迎界面，清晰的引导流程

### 环境检测
实时显示检测进度，自动修复问题

### 配置向导
分步配置，简单易懂

### 控制面板
- 服务状态监控
- 实时日志查看
- 一键启动/停止
- 系统统计信息

---

## 🛠️ 开发指南

### 环境要求
- Node.js >= 20.x
- npm >= 10.x

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 打包构建
```bash
npm run build
npm run dist
```

### 分平台打包
```bash
npm run dist:win    # Windows
npm run dist:mac    # macOS
npm run dist:linux  # Linux
```

---

## 📁 项目结构

```
openclaw-desktop/
├── src/
│   ├── main/           # Electron 主进程
│   │   ├── index.ts
│   │   ├── gateway-manager.ts
│   │   ├── config-manager.ts
│   │   ├── logger.ts
│   │   ├── installer.ts
│   │   └── updater.ts
│   ├── preload/        # 预加载脚本
│   │   └── index.ts
│   └── renderer/       # React 前端
│       ├── App.tsx
│       ├── components/
│       │   ├── Welcome.tsx
│       │   ├── EnvCheck.tsx
│       │   ├── ConfigWizard.tsx
│       │   └── Dashboard.tsx
│       └── index.tsx
├── resources/          # 应用资源
├── releases/           # 打包输出
└── package.json
```

---

## 🔧 技术栈

- **框架**: Electron 30+
- **前端**: React 18 + TypeScript
- **UI 库**: Ant Design 5
- **打包**: electron-builder
- **更新**: electron-updater
- **构建**: Vite

---

## 📝 常见问题

### Q: 需要付费吗？
A: 完全免费！OpenClaw Desktop 是开源软件。

### Q: 安全吗？
A: 所有配置本地存储，API Key 加密保存，不会上传到任何服务器。

### Q: 支持哪些 AI 模型？
A: 支持所有 OpenAI 兼容的 API，包括：
- 百度千帆（Qwen、MiniMax 等）
- SiliconFlow
- OpenAI
- 以及任何兼容 OpenAI API 的服务

### Q: 如何更新？
A: 应用会自动检查更新，提示重启安装。也可以手动点击"检查更新"。

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

- 报告 Bug: [GitHub Issues](https://github.com/carl-cf/openclaw-desktop/issues)
- 功能建议: [GitHub Discussions](https://github.com/carl-cf/openclaw-desktop/discussions)

---

## 📄 许可证

MIT License

---

## 🙏 致谢

- [OpenClaw](https://github.com/openclaw/openclaw) - 强大的 AI 助手框架
- [Electron](https://www.electronjs.org/) - 跨平台桌面应用框架
- [Ant Design](https://ant.design/) - 优秀的 UI 组件库

---

**Made with ❤️ by Carl**

GitHub: [carl-cf/openclaw-desktop](https://github.com/carl-cf/openclaw-desktop)
