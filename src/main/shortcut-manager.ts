import { app, globalShortcut, BrowserWindow } from 'electron';
import { Logger } from './logger';

export class ShortcutManager {
  private mainWindow: BrowserWindow | null = null;
  private logger: Logger | null = null;

  constructor(mainWindow: BrowserWindow, logger: Logger | null = null) {
    this.mainWindow = mainWindow;
    this.logger = logger;
    this.registerShortcuts();
  }

  private registerShortcuts(): void {
    // Cmd/Ctrl + P - 打开命令面板（待实现）
    globalShortcut.register('CommandOrControl+P', () => {
      this.logger?.info('快捷键：打开命令面板');
      this.mainWindow?.webContents.send('shortcut:command-palette');
    });

    // Cmd/Ctrl + , - 打开设置
    globalShortcut.register('CommandOrControl+,', () => {
      this.logger?.info('快捷键：打开设置');
      this.mainWindow?.webContents.send('shortcut:settings');
    });

    // Cmd/Ctrl + H - 打开帮助
    globalShortcut.register('CommandOrControl+H', () => {
      this.logger?.info('快捷键：打开帮助');
      this.mainWindow?.webContents.send('shortcut:help');
    });

    // Cmd/Ctrl + L - 聚焦日志
    globalShortcut.register('CommandOrControl+L', () => {
      this.logger?.info('快捷键：聚焦日志');
      this.mainWindow?.webContents.send('shortcut:focus-logs');
    });

    // Cmd/Ctrl + R - 刷新页面（仅开发模式）
    if (process.env.NODE_ENV === 'development') {
      globalShortcut.register('CommandOrControl+R', () => {
        this.logger?.info('快捷键：刷新页面');
        this.mainWindow?.reload();
      });

      // Cmd/Ctrl + Shift + I - 打开开发者工具
      globalShortcut.register('CommandOrControl+Shift+I', () => {
        this.logger?.info('快捷键：打开开发者工具');
        this.mainWindow?.webContents.openDevTools();
      });
    }

    this.logger?.info('快捷键注册完成');
  }

  unregisterAll(): void {
    globalShortcut.unregisterAll();
    this.logger?.info('所有快捷键已注销');
  }
}
