import { Notification, nativeImage } from 'electron';
import * as path from 'path';
import { Logger } from './logger';

export class NotificationManager {
  private logger: Logger | null = null;

  constructor(logger: Logger | null = null) {
    this.logger = logger;
  }

  show(title: string, body: string, icon?: string): void {
    try {
      const iconPath = icon || path.join(__dirname, '../resources/icon.png');
      const iconImage = nativeImage.createFromPath(iconPath);

      const notification = new Notification({
        title,
        body,
        icon: iconImage,
        silent: false,
      });

      notification.on('click', () => {
        this.logger?.info('通知被点击');
      });

      notification.on('close', () => {
        this.logger?.debug('通知已关闭');
      });

      notification.show();
      this.logger?.info(`通知：${title} - ${body}`);
    } catch (error) {
      this.logger?.error(`显示通知失败：${error}`);
    }
  }

  showServiceStarted(): void {
    this.show(
      '服务已启动',
      'OpenClaw 网关已成功启动，可以开始使用 AI 助手了！',
    );
  }

  showServiceStopped(): void {
    this.show(
      '服务已停止',
      'OpenClaw 网关已停止运行。',
    );
  }

  showUpdateAvailable(version: string): void {
    this.show(
      '发现新版本',
      `发现新版本 ${version}，请重启应用以完成更新。`,
    );
  }

  showError(title: string, message: string): void {
    this.show(
      `错误：${title}`,
      message,
    );
  }
}
