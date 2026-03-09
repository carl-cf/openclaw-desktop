import Store from 'electron-store';

interface AppConfig {
  model: {
    provider: string;
    apiKey: string;
    model: string;
  };
  channels: {
    feishu: { enabled: boolean; appId?: string; appSecret?: string };
    telegram: { enabled: boolean; botToken?: string };
    whatsapp: { enabled: boolean; phoneNumber?: string };
  };
  advanced: {
    port: number;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    autoStart: boolean;
  };
}

interface ValidationResult {
  ok: boolean;
  error?: string;
}

export class ConfigManager {
  private store: Store<AppConfig>;

  constructor() {
    this.store = new Store({
      name: 'openclaw-config',
      encryptionKey: 'openclaw-desktop-secret-key-2026',
      defaults: {
        model: {
          provider: 'bailian',
          apiKey: '',
          model: 'qwen3.5-plus',
        },
        channels: {
          feishu: { enabled: false },
          telegram: { enabled: false },
          whatsapp: { enabled: false },
        },
        advanced: {
          port: 18789,
          logLevel: 'info',
          autoStart: true,
        },
      },
    });
  }

  get(key: keyof AppConfig): any {
    return this.store.get(key);
  }

  set(key: keyof AppConfig, value: any): void {
    this.store.set(key, value);
  }

  getAll(): AppConfig {
    return this.store.store;
  }

  validate(): ValidationResult {
    const model = this.store.get('model');
    
    if (!model.apiKey || model.apiKey.trim() === '') {
      return { ok: false, error: 'API Key 未配置' };
    }

    if (!model.provider) {
      return { ok: false, error: '模型提供商未选择' };
    }

    // 验证渠道配置
    const channels = this.store.get('channels');
    const enabledChannels = Object.values(channels).filter(c => c.enabled);
    
    if (enabledChannels.length === 0) {
      return { 
        ok: false, 
        error: '至少需要启用一个通信渠道（飞书/Telegram/WhatsApp）' 
      };
    }

    return { ok: true };
  }

  export(): string {
    const config = this.store.store;
    // 导出时隐藏 API Key
    const safeConfig = {
      ...config,
      model: {
        ...config.model,
        apiKey: '***hidden***',
      },
    };
    return JSON.stringify(safeConfig, null, 2);
  }

  import(json: string): void {
    try {
      const config = JSON.parse(json);
      this.store.set(config);
    } catch (error) {
      throw new Error('配置导入失败：无效的 JSON 格式');
    }
  }

  clear(): void {
    this.store.clear();
  }
}
