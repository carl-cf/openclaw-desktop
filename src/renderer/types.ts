export interface ElectronAPI {
  gateway: {
    getStatus: () => Promise<{ running: boolean; status: string; uptime: number }>;
    start: () => Promise<{ success: boolean; error?: string }>;
    stop: () => Promise<{ success: boolean; error?: string }>;
  };
  config: {
    get: (key: string) => Promise<any>;
    set: (key: string, value: any) => Promise<{ success: boolean }>;
  };
  logs: {
    get: () => Promise<string[]>;
  };
  env: {
    check: () => Promise<{
      node: { installed: boolean; version?: string };
      npm: { installed: boolean; version?: string };
      network: { ok: boolean; latency?: number };
      disk: { ok: boolean; freeGB?: number };
      openclaw: { installed: boolean; version?: string };
    }>;
    installNode: () => Promise<void>;
  };
  openclaw: {
    install: () => Promise<void>;
  };
  onUpdateChecking: (callback: () => void) => void;
  onUpdateAvailable: (callback: (info: any) => void) => void;
  onUpdateProgress: (callback: (percent: number) => void) => void;
  onUpdateDownloaded: (callback: (info: any) => void) => void;
  onUpdateError: (callback: (error: any) => void) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
