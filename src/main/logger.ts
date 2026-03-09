import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';

export class Logger {
  private logs: string[] = [];
  private logFile: string;
  private maxLogs = 1000; // 内存中最多保留 1000 条日志

  constructor() {
    // 日志文件路径
    const userDataPath = app.getPath('userData');
    const logsDir = path.join(userDataPath, 'logs');
    
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    const date = new Date().toISOString().split('T')[0];
    this.logFile = path.join(logsDir, `${date}.log`);

    this.info('=== 日志系统初始化 ===');
  }

  info(message: string): void {
    this.log('INFO', message);
  }

  warn(message: string): void {
    this.log('WARN', message);
  }

  error(message: string): void {
    this.log('ERROR', message);
  }

  debug(message: string): void {
    this.log('DEBUG', message);
  }

  private log(level: string, message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}`;
    
    // 添加到内存
    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift(); // 移除最早的日志
    }

    // 写入文件
    fs.appendFile(this.logFile, logEntry + '\n', (err) => {
      if (err) {
        console.error('写入日志失败:', err);
      }
    });

    // 开发环境下输出到控制台
    if (process.env.NODE_ENV === 'development') {
      console.log(logEntry);
    }
  }

  getLogs(lines = 100): string[] {
    return this.logs.slice(-lines);
  }

  getLogFile(): string {
    return this.logFile;
  }

  clear(): void {
    this.logs = [];
  }
}
