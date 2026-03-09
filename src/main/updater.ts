import { autoUpdater } from 'electron-updater';
import { BrowserWindow, dialog } from 'electron';
import { Logger } from './logger';

export class AppUpdater {
  private logger: Logger | null = null;
  private mainWindow: BrowserWindow | null = null;

  constructor() {
    // 配置自动更新
    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true;
    autoUpdater.allowDowngrade = false;

    // 更新事件监听
    autoUpdater.on('checking-for-update', () => {
      this.logger?.info('正在检查更新...');
      this.mainWindow?.webContents.send('update-checking');
    });

    autoUpdater.on('update-available', (info) => {
      this.logger?.info(`发现新版本：${info.version}`);
      this.mainWindow?.webContents.send('update-available', info);
      
      // 提示用户
      dialog.showMessageBox({
        type: 'info',
        title: '发现新版本',
        message: `发现新版本 ${info.version}，是否立即下载？`,
        buttons: ['立即下载', '稍后'],
        defaultId: 0,
      }).then((result) => {
        if (result.response === 0) {
          autoUpdater.downloadUpdate();
        }
      });
    });

    autoUpdater.on('update-not-available', () => {
      this.logger?.info('当前已是最新版本');
      this.mainWindow?.webContents.send('update-not-available');
    });

    autoUpdater.on('download-progress', (progress) => {
      const percent = Math.round(progress.percent);
      this.logger?.info(`下载进度：${percent}%`);
      this.mainWindow?.webContents.send('update-progress', percent);
    });

    autoUpdater.on('update-downloaded', (info) => {
      this.logger?.info(`新版本 ${info.version} 已下载完成`);
      this.mainWindow?.webContents.send('update-downloaded', info);

      // 提示用户重启安装
      dialog.showMessageBox({
        type: 'info',
        title: '更新已就绪',
        message: '新版本已下载完成，是否立即重启安装？',
        buttons: ['立即重启', '稍后'],
        defaultId: 0,
      }).then((result) => {
        if (result.response === 0) {
          autoUpdater.quitAndInstall();
        }
      });
    });

    autoUpdater.on('error', (err) => {
      this.logger?.error(`更新失败：${err.message}`);
      this.mainWindow?.webContents.send('update-error', err);
    });
  }

  setLogger(logger: Logger): void {
    this.logger = logger;
  }

  setMainWindow(window: BrowserWindow): void {
    this.mainWindow = window;
  }

  checkForUpdates(): void {
    this.logger?.info('手动检查更新');
    autoUpdater.checkForUpdates();
  }
}
