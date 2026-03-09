import Store from 'electron-store';

export class ConfigManager {
  private store: any;

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

  get(key: string): any {
    return this.store.get(key);
  }

  set(key: string, value: any): void {
    this.store.set(key, value);
  }

  getAll(): any {
    return this.store.store;
  }

  validate(): { ok: boolean; error?: string } {
    const model = this.store.get('model');
    
    if (!model.apiKey || model.apiKey.trim() === '') {
      return { ok: false, error: 'API Key 未配置' };
    }

    if (!model.provider) {
      return { ok: false, error: '模型提供商未选择' };
    }

    return { ok: true };
  }

  export(): string {
    const config = this.store.store;
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
