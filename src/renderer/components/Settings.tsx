import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Button,
  Card,
  Typography,
  Divider,
  message,
  Tabs,
} from 'antd';

const { Title, Paragraph, Text } = Typography;

interface SettingsProps {
  onComplete?: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onComplete }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const model = await window.electronAPI.config.get('model');
      const channels = await window.electronAPI.config.get('channels');
      const advanced = await window.electronAPI.config.get('advanced');

      setConfig({ model, channels, advanced });
      form.setFieldsValue({
        provider: model?.provider,
        apiKey: model?.apiKey,
        model: model?.model,
        feishuEnabled: channels?.feishu?.enabled,
        feishuAppId: channels?.feishu?.appId,
        feishuAppSecret: channels?.feishu?.appSecret,
        telegramEnabled: channels?.telegram?.enabled,
        telegramToken: channels?.telegram?.botToken,
        port: advanced?.port,
        logLevel: advanced?.logLevel,
        autoStart: advanced?.autoStart,
      });
    } catch (error) {
      console.error('加载配置失败:', error);
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // 保存模型配置
      await window.electronAPI.config.set('model', {
        provider: values.provider,
        apiKey: values.apiKey || config?.model?.apiKey,
        model: values.model,
      });

      // 保存渠道配置
      await window.electronAPI.config.set('channels', {
        feishu: {
          enabled: values.feishuEnabled,
          appId: values.feishuAppId,
          appSecret: values.feishuAppSecret,
        },
        telegram: {
          enabled: values.telegramEnabled,
          botToken: values.telegramToken,
        },
        whatsapp: { enabled: false },
      });

      // 保存高级配置
      await window.electronAPI.config.set('advanced', {
        port: values.port,
        logLevel: values.logLevel,
        autoStart: values.autoStart,
      });

      message.success('配置保存成功！');
      onComplete?.();
    } catch (error) {
      message.error('配置保存失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const items = [
    {
      key: 'model',
      label: '🤖 模型配置',
      children: (
        <div style={{ maxWidth: '600px' }}>
          <Title level={5}>模型提供商</Title>
          <Form.Item name="provider" label="选择提供商">
            <Select>
              <Select.Option value="bailian">百度千帆</Select.Option>
              <Select.Option value="siliconflow">SiliconFlow</Select.Option>
              <Select.Option value="openai">OpenAI</Select.Option>
              <Select.Option value="custom">自定义</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="model" label="模型名称">
            <Input placeholder="例如：qwen3.5-plus" />
          </Form.Item>

          <Form.Item name="apiKey" label="API Key">
            <Input.Password placeholder="输入新的 API Key（不修改则留空）" />
          </Form.Item>

          <Paragraph type="secondary">
            <Text>💡 提示：API Key 会加密存储在本地，不会上传到任何服务器</Text>
          </Paragraph>
        </div>
      ),
    },
    {
      key: 'channels',
      label: '💬 通信渠道',
      children: (
        <div style={{ maxWidth: '600px' }}>
          <Card title="📱 飞书" size="small" style={{ marginBottom: '16px' }}>
            <Form.Item name="feishuEnabled" label="启用飞书" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="feishuAppId" label="App ID">
              <Input placeholder="cli_xxxxxxxxxxxx" />
            </Form.Item>
            <Form.Item name="feishuAppSecret" label="App Secret">
              <Input.Password placeholder="请输入 App Secret" />
            </Form.Item>
          </Card>

          <Card title="✈️ Telegram" size="small" style={{ marginBottom: '16px' }}>
            <Form.Item name="telegramEnabled" label="启用 Telegram" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="telegramToken" label="Bot Token">
              <Input.Password placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz" />
            </Form.Item>
          </Card>
        </div>
      ),
    },
    {
      key: 'advanced',
      label: '⚙️ 高级设置',
      children: (
        <div style={{ maxWidth: '600px' }}>
          <Form.Item name="port" label="服务端口">
            <InputNumber min={1024} max={65535} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="logLevel" label="日志级别">
            <Select>
              <Select.Option value="debug">Debug（调试）</Select.Option>
              <Select.Option value="info">Info（信息）</Select.Option>
              <Select.Option value="warn">Warn（警告）</Select.Option>
              <Select.Option value="error">Error（错误）</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="autoStart" label="开机自启" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Divider />

          <Button danger onClick={() => {
            if (window.confirm('确定要重置所有配置吗？')) {
              form.resetFields();
              message.success('配置已重置');
            }
          }}>
            🗑️ 重置所有配置
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: '40px' }}>
      <Title level={3}>⚙️ 设置</Title>
      <Paragraph type="secondary">
        配置 AI 模型、通信渠道和高级选项
      </Paragraph>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ maxWidth: '800px' }}
      >
        <Tabs defaultActiveKey="model" items={items} />

        <Divider />

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
          >
            💾 保存配置
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Settings;
