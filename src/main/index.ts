import { app, BrowserWindow, ipcMain, Tray, Menu, dialog } from 'electron';
import * as path from 'path';
import { GatewayManager } from './gateway-manager';
import { ConfigManager } from './config-manager';
import { Logger } from './logger';
import { AppUpdater } from './updater';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let gatewayManager: GatewayManager | null = null;
let configManager: ConfigManager | null = null;
let logger: Logger | null = null;

// 初始化日志
function initLogger() {
  logger = new Logger();
  logger.info('OpenClaw Desktop 启动中...');
}

// 创建主窗口
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, '../resources/icon.png'),
    titleBarStyle: 'default',
  });

  // 开发环境加载 Vite 开发服务器
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    // 生产环境加载打包后的文件
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  logger?.info('主窗口已创建');
}

// 创建系统托盘
function createTray() {
  const iconPath = path.join(__dirname, '../resources/icon.png');
  tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示主窗口',
      click: () => {
        mainWindow?.show();
      },
    },
    {
      label: '启动服务',
      click: async () => {
        await gatewayManager?.start();
      },
    },
    {
      label: '停止服务',
      click: async () => {
        await gatewayManager?.stop();
      },
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setToolTip('OpenClaw Desktop');
  tray.setContextMenu(contextMenu);

  logger?.info('系统托盘已创建');
}

// IPC 通信处理
function initIPC() {
  // 获取网关状态
  ipcMain.handle('gateway:status', async () => {
    return gatewayManager?.getStatus() || { running: false };
  });

  // 启动网关
  ipcMain.handle('gateway:start', async () => {
    try {
      await gatewayManager?.start();
      return { success: true };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  });

  // 停止网关
  ipcMain.handle('gateway:stop', async () => {
    try {
      await gatewayManager?.stop();
      return { success: true };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  });

  // 获取日志
  ipcMain.handle('logs:get', async () => {
    return logger?.getLogs() || [];
  });

  // 获取配置
  ipcMain.handle('config:get', async (_, key: any) => {
    return configManager?.get(key as string);
  });

  // 保存配置
  ipcMain.handle('config:set', async (_, key: any, value: any) => {
    configManager?.set(key as string, value);
    return { success: true };
  });

  // 环境检测
  ipcMain.handle('env:check', async () => {
    const { checkEnvironment } = await import('./installer');
    return await checkEnvironment();
  });

  // 安装 Node.js
  ipcMain.handle('env:install-node', async () => {
    const { installNode } = await import('./installer');
    return await installNode();
  });

  // 安装 OpenClaw
  ipcMain.handle('openclaw:install', async () => {
    const { installOpenClaw } = await import('./installer');
    return await installOpenClaw();
  });

  logger?.info('IPC 通信已初始化');
}

// 应用就绪时
app.whenReady().then(() => {
  initLogger();
  configManager = new ConfigManager();
  gatewayManager = new GatewayManager(configManager, logger);
  
  createWindow();
  createTray();
  initIPC();

  // 初始化自动更新
  const updater = new AppUpdater();
  updater.checkForUpdates();

  logger?.info('OpenClaw Desktop 已就绪');
});

// 所有窗口关闭时
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// 退出前清理
app.on('will-quit', async (event) => {
  event.preventDefault();
  await gatewayManager?.stop();
  logger?.info('OpenClaw Desktop 已退出');
  app.exit(0);
});
