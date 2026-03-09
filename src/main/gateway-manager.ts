import { spawn, ChildProcess, exec } from 'child_process';
import { ConfigManager } from './config-manager';
import { Logger } from './logger';
import { NotificationManager } from './notification-manager';

export class GatewayManager {
  private process: ChildProcess | null = null;
  private logs: string[] = [];
  private status: 'stopped' | 'starting' | 'running' | 'error' = 'stopped';
  private configManager: ConfigManager;
  private logger: Logger | null;
  private notificationManager: NotificationManager | null = null;

  constructor(
    configManager: ConfigManager,
    logger: Logger | null = null,
    notificationManager: NotificationManager | null = null,
  ) {
    this.configManager = configManager;
    this.logger = logger;
    this.notificationManager = notificationManager;
  }

  async start(): Promise<void> {
    if (this.status === 'running') {
      this.logger?.warn('网关已在运行中');
      return;
    }

    this.status = 'starting';
    this.logger?.info('正在启动 OpenClaw 网关...');

    try {
      // 获取配置并转换为环境变量
      const config = this.configManager.getAll();
      const env = {
        ...process.env,
        ...(config.model?.provider ? { OPENCLAW_MODEL_PROVIDER: config.model.provider } : {}),
        ...(config.model?.apiKey ? { OPENCLAW_API_KEY: config.model.apiKey } : {}),
        ...(config.model?.model ? { OPENCLAW_MODEL: config.model.model } : {}),
      };

      // 启动网关进程
      this.process = spawn('openclaw', ['gateway', 'start'], {
        env,
        shell: true,
      });

      this.process.stdout?.on('data', (data) => {
        const log = data.toString();
        this.logs.push(log);
        this.logger?.info(`[Gateway] ${log.trim()}`);
      });

      this.process.stderr?.on('data', (data) => {
        const log = data.toString();
        this.logs.push(log);
        this.logger?.error(`[Gateway] ${log.trim()}`);
      });

      this.process.on('close', (code) => {
        this.status = code === 0 ? 'stopped' : 'error';
        this.logger?.info(`网关进程已退出，代码：${code}`);
      });

      // 等待网关启动
      await this.waitForStart();
      this.status = 'running';
      this.logger?.info('OpenClaw 网关启动成功');
      
      // 发送通知
      this.notificationManager?.showServiceStarted();
    } catch (error) {
      this.status = 'error';
      this.logger?.error(`网关启动失败：${error}`);
      this.notificationManager?.showError('网关启动失败', String(error));
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (this.status !== 'running') {
      this.logger?.warn('网关未运行');
      return;
    }

    this.logger?.info('正在停止 OpenClaw 网关...');

    try {
      await this.execCommand('openclaw gateway stop');
      this.process = null;
      this.status = 'stopped';
      this.logger?.info('OpenClaw 网关已停止');
      
      // 发送通知
      this.notificationManager?.showServiceStopped();
    } catch (error) {
      this.logger?.error(`网关停止失败：${error}`);
      this.notificationManager?.showError('网关停止失败', String(error));
      throw error;
    }
  }

  getStatus() {
    return {
      running: this.status === 'running',
      status: this.status,
      uptime: this.process ? process.uptime() : 0,
    };
  }

  getLogs(): string[] {
    return this.logs.slice(-100); // 返回最近 100 条日志
  }

  private async waitForStart(timeout = 10000): Promise<void> {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const checkInterval = setInterval(() => {
        if (this.process && !this.process.killed) {
          clearInterval(checkInterval);
          resolve();
        } else if (Date.now() - startTime > timeout) {
          clearInterval(checkInterval);
          reject(new Error('网关启动超时'));
        }
      }, 500);
    });
  }

  private async execCommand(command: string): Promise<void> {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}
