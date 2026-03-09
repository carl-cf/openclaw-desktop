import { contextBridge, ipcRenderer } from 'electron';

// 暴露安全的 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 网关控制
  gateway: {
    getStatus: () => ipcRenderer.invoke('gateway:status'),
    start: () => ipcRenderer.invoke('gateway:start'),
    stop: () => ipcRenderer.invoke('gateway:stop'),
  },

  // 配置管理
  config: {
    get: (key: string) => ipcRenderer.invoke('config:get', key),
    set: (key: string, value: any) => ipcRenderer.invoke('config:set', key, value),
  },

  // 日志
  logs: {
    get: () => ipcRenderer.invoke('logs:get'),
  },

  // 环境检测
  env: {
    check: () => ipcRenderer.invoke('env:check'),
    installNode: () => ipcRenderer.invoke('env:install-node'),
  },

  // OpenClaw 安装
  openclaw: {
    install: () => ipcRenderer.invoke('openclaw:install'),
  },

  // 更新事件
  onUpdateChecking: (callback: () => void) => {
    ipcRenderer.on('update-checking', () => callback());
  },

  onUpdateAvailable: (callback: (info: any) => void) => {
    ipcRenderer.on('update-available', (_, info) => callback(info));
  },

  onUpdateProgress: (callback: (percent: number) => void) => {
    ipcRenderer.on('update-progress', (_, percent) => callback(percent));
  },

  onUpdateDownloaded: (callback: (info: any) => void) => {
    ipcRenderer.on('update-downloaded', (_, info) => callback(info));
  },

  onUpdateError: (callback: (error: any) => void) => {
    ipcRenderer.on('update-error', (_, error) => callback(error));
  },
});
