import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface EnvCheckResult {
  node: { installed: boolean; version?: string };
  npm: { installed: boolean; version?: string };
  network: { ok: boolean; latency?: number };
  disk: { ok: boolean; freeGB?: number };
  openclaw: { installed: boolean; version?: string };
}

export async function checkEnvironment(): Promise<EnvCheckResult> {
  const result: EnvCheckResult = {
    node: await checkNode(),
    npm: await checkNpm(),
    network: await checkNetwork(),
    disk: await checkDiskSpace(),
    openclaw: await checkOpenClaw(),
  };

  return result;
}

async function checkNode() {
  try {
    const { stdout } = await execCommand('node -v');
    return { installed: true, version: stdout.trim() };
  } catch {
    return { installed: false };
  }
}

async function checkNpm() {
  try {
    const { stdout } = await execCommand('npm -v');
    return { installed: true, version: stdout.trim() };
  } catch {
    return { installed: false };
  }
}

async function checkNetwork() {
  try {
    const start = Date.now();
    await execCommand('ping -n 1 github.com');
    const latency = Date.now() - start;
    return { ok: true, latency };
  } catch {
    return { ok: false };
  }
}

async function checkDiskSpace() {
  try {
    const drive = process.platform === 'win32' ? 'C:' : '/';
    const free = await getFreeDiskSpace(drive);
    const freeGB = free / (1024 * 1024 * 1024);
    return { ok: freeGB > 1, freeGB }; // 需要至少 1GB 可用空间
  } catch {
    return { ok: false };
  }
}

async function checkOpenClaw() {
  try {
    const { stdout } = await execCommand('openclaw --version');
    return { installed: true, version: stdout.trim() };
  } catch {
    return { installed: false };
  }
}

export async function installNode(): Promise<void> {
  // 根据平台下载并安装 Node.js
  const platform = process.platform;
  
  if (platform === 'win32') {
    // Windows: 下载 MSI 安装包
    await downloadAndInstallNodeWindows();
  } else if (platform === 'darwin') {
    // Mac: 使用 Homebrew 或下载 PKG
    await downloadAndInstallNodeMac();
  } else {
    // Linux: 使用包管理器
    await downloadAndInstallNodeLinux();
  }
}

export async function installOpenClaw(): Promise<void> {
  return new Promise((resolve, reject) => {
    exec('npm install -g openclaw@latest', (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

async function execCommand(command: string): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

async function getFreeDiskSpace(drive: string): Promise<number> {
  return new Promise((resolve, reject) => {
    if (process.platform === 'win32') {
      exec(`wmic logicaldisk where "DeviceID='${drive}'" get FreeSpace`, (error, stdout) => {
        if (error) {
          reject(error);
        } else {
          const lines = stdout.trim().split('\n');
          const freeSpace = parseInt(lines[1].replace(/\s/g, ''));
          resolve(freeSpace);
        }
      });
    } else {
      exec('df -k /', (error, stdout) => {
        if (error) {
          reject(error);
        } else {
          const lines = stdout.trim().split('\n');
          const parts = lines[1].split(/\s+/);
          const freeSpace = parseInt(parts[3]) * 1024; // 转换为字节
          resolve(freeSpace);
        }
      });
    }
  });
}

async function downloadAndInstallNodeWindows(): Promise<void> {
  // 简化实现：提示用户手动安装
  throw new Error('请手动安装 Node.js: https://nodejs.org/');
}

async function downloadAndInstallNodeMac(): Promise<void> {
  // 简化实现：提示用户手动安装
  throw new Error('请手动安装 Node.js: https://nodejs.org/ 或使用 Homebrew: brew install node');
}

async function downloadAndInstallNodeLinux(): Promise<void> {
  // 简化实现：提示用户手动安装
  throw new Error('请手动安装 Node.js: https://nodejs.org/ 或使用包管理器');
}
