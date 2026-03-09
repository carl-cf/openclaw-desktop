import React, { useState } from 'react';
import {
  Button,
  Form,
  Input,
  Select,
  Steps,
  Typography,
  Space,
  Card,
  Radio,
  Switch,
  message,
} from 'antd';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

interface ConfigWizardProps {
  onComplete: () => void;
  onBack: () => void;
}

type Step = 'model' | 'channel' | 'complete';

const ConfigWizard: React.FC<ConfigWizardProps> = ({ onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState<Step>('model');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const modelProviders = [
    {
      value: 'bailian',
      label: '百度千帆',
      description: '推荐模型：Qwen3.5-Plus，中文优化，代码能力强',
      models: ['qwen3.5-plus', 'qwen3.5-turbo', 'qwen-long'],
    },
    {
      value: 'siliconflow',
      label: 'SiliconFlow',
      description: '推荐模型：MiniMax-M2.5，长上下文，多模态',
      models: ['minimax-minimax-m2.5', 'deepseek-v3'],
    },
    {
      value: 'openai',
      label: 'OpenAI',
      description: '推荐模型：GPT-4o，全能型，生态完善',
      models: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    },
    {
      value: 'custom',
      label: '自定义',
      description: '兼容 OpenAI API 的其他服务',
      models: [],
    },
  ];

  const handleModelSubmit = async (values: any) => {
    setLoading(true);
    try {
      // 保存模型配置
      await window.electronAPI.config.set('model', {
        provider: values.provider,
        apiKey: values.apiKey,
        model: values.model,
      });

      // 验证 API Key（可选）
      message.success('模型配置保存成功！');
      setCurrentStep('channel');
    } catch (error) {
      message.error('配置保存失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChannelSubmit = async (values: any) => {
    setLoading(true);
    try {
      // 保存渠道配置
      await window.electronAPI.config.set('channels', {
        feishu: {
          enabled: values.feishu || false,
          appId: values.feishuAppId,
          appSecret: values.feishuAppSecret,
        },
        telegram: {
          enabled: values.telegram || false,
          botToken: values.telegramToken,
        },
        whatsapp: {
          enabled: values.whatsapp || false,
          phoneNumber: values.whatsappPhone,
        },
      });

      message.success('渠道配置保存成功！');
      setCurrentStep('complete');
    } catch (error) {
      message.error('配置保存失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderModelStep = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleModelSubmit}
      style={{ maxWidth: '600px', margin: '0 auto' }}
    >
      <Title level={4}>选择 AI 模型提供商</Title>
      <Paragraph style={{ color: '#666', marginBottom: '24px' }}>
        选择一个 AI 模型提供商，并输入您的 API Key
      </Paragraph>

      <Form.Item
        name="provider"
        label="模型提供商"
        rules={[{ required: true, message: '请选择模型提供商' }]}
      >
        <Select
          placeholder="请选择模型提供商"
          size="large"
          options={modelProviders}
        />
      </Form.Item>

      <Form.Item
        name="model"
        label="选择模型"
        rules={[{ required: true, message: '请选择模型' }]}
      >
        <Select placeholder="请选择模型" size="large">
          {form.getFieldValue('provider') === 'bailian' && (
            <>
              <Select.Option value="qwen3.5-plus">Qwen3.5-Plus（推荐）</Select.Option>
              <Select.Option value="qwen3.5-turbo">Qwen3.5-Turbo</Select.Option>
              <Select.Option value="qwen-long">Qwen-Long</Select.Option>
            </>
          )}
          {form.getFieldValue('provider') === 'siliconflow' && (
            <>
              <Select.Option value="minimax-minimax-m2.5">
                MiniMax-M2.5（推荐）
              </Select.Option>
              <Select.Option value="deepseek-v3">DeepSeek-V3</Select.Option>
            </>
          )}
          {form.getFieldValue('provider') === 'openai' && (
            <>
              <Select.Option value="gpt-4o">GPT-4o（推荐）</Select.Option>
              <Select.Option value="gpt-4-turbo">GPT-4-Turbo</Select.Option>
              <Select.Option value="gpt-3.5-turbo">GPT-3.5-Turbo</Select.Option>
            </>
          )}
          {form.getFieldValue('provider') === 'custom' && (
            <Select.Option value="custom">自定义模型</Select.Option>
          )}
        </Select>
      </Form.Item>

      <Form.Item
        name="apiKey"
        label="API Key"
        rules={[{ required: true, message: '请输入 API Key' }]}
      >
        <Input.Password
          placeholder="请输入您的 API Key"
          size="large"
          visibilityToggle
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="default" onClick={onBack}>
            上一步
          </Button>
          <Button type="primary" htmlType="submit" loading={loading} size="large">
            下一步
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  const renderChannelStep = () => (
    <Form
      layout="vertical"
      onFinish={handleChannelSubmit}
      style={{ maxWidth: '600px', margin: '0 auto' }}
    >
      <Title level={4}>配置通信渠道</Title>
      <Paragraph style={{ color: '#666', marginBottom: '24px' }}>
        选择您希望使用的通信渠道，至少选择一个
      </Paragraph>

      <Card
        title="📱 飞书私聊"
        size="small"
        style={{ marginBottom: '16px' }}
        extra={
          <Form.Item name="feishu" valuePropName="checked" noStyle>
            <Switch />
          </Form.Item>
        }
      >
        <Paragraph type="secondary" style={{ fontSize: '14px' }}>
          通过飞书机器人与您私聊，支持文字、图片、语音
        </Paragraph>
        <Form.Item
          noStyle
          shouldUpdate={(prev, curr) => prev.feishu !== curr.feishu}
        >
          {() =>
            form.getFieldValue('feishu') && (
              <>
                <Form.Item
                  name="feishuAppId"
                  label="飞书 App ID"
                  rules={[
                    {
                      required: form.getFieldValue('feishu'),
                      message: '请输入飞书 App ID',
                    },
                  ]}
                >
                  <Input placeholder="cli_xxxxxxxxxxxx" />
                </Form.Item>
                <Form.Item
                  name="feishuAppSecret"
                  label="飞书 App Secret"
                  rules={[
                    {
                      required: form.getFieldValue('feishu'),
                      message: '请输入飞书 App Secret',
                    },
                  ]}
                >
                  <Input.Password placeholder="请输入 App Secret" />
                </Form.Item>
              </>
            )
          }
        </Form.Item>
      </Card>

      <Card
        title="✈️ Telegram"
        size="small"
        style={{ marginBottom: '16px' }}
        extra={
          <Form.Item name="telegram" valuePropName="checked" noStyle>
            <Switch />
          </Form.Item>
        }
      >
        <Paragraph type="secondary" style={{ fontSize: '14px' }}>
          通过 Telegram Bot 与您通信
        </Paragraph>
        <Form.Item
          noStyle
          shouldUpdate={(prev, curr) => prev.telegram !== curr.telegram}
        >
          {() =>
            form.getFieldValue('telegram') && (
              <Form.Item
                name="telegramToken"
                label="Bot Token"
                rules={[
                  {
                    required: form.getFieldValue('telegram'),
                    message: '请输入 Telegram Bot Token',
                  },
                ]}
              >
                <Input.Password placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz" />
              </Form.Item>
            )
          }
        </Form.Item>
      </Card>

      <Card
        title="💬 仅网页版"
        size="small"
        style={{ marginBottom: '16px' }}
        extra={
          <Form.Item name="webOnly" valuePropName="checked" noStyle>
            <Switch />
          </Form.Item>
        }
      >
        <Paragraph type="secondary" style={{ fontSize: '14px' }}>
          仅在桌面应用内使用，不连接外部通信渠道
        </Paragraph>
      </Card>

      <Form.Item style={{ marginTop: '32px' }}>
        <Space>
          <Button type="default" onClick={onBack}>
            上一步
          </Button>
          <Button type="primary" htmlType="submit" loading={loading} size="large">
            完成配置
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  const renderCompleteStep = () => (
    <div style={{ textAlign: 'center', padding: '40px 0' }}>
      <div style={{ fontSize: '80px', marginBottom: '24px' }}>🎉</div>
      <Title level={3}>配置完成！</Title>
      <Paragraph style={{ fontSize: '16px', color: '#666', marginBottom: '32px' }}>
        所有配置已保存，现在可以开始使用 OpenClaw Desktop 了！
      </Paragraph>
      <Button
        type="primary"
        size="large"
        onClick={onComplete}
        style={{ width: '200px' }}
      >
        进入控制面板
      </Button>
    </div>
  );

  return (
    <div style={{ padding: '60px 40px' }}>
      <Steps
        current={currentStep === 'model' ? 0 : currentStep === 'channel' ? 1 : 2}
        items={[
          { title: '选择模型', icon: '🤖' },
          { title: '配置渠道', icon: '💬' },
          { title: '完成', icon: '✅' },
        ]}
        style={{ marginBottom: '40px' }}
      />

      {currentStep === 'model' && renderModelStep()}
      {currentStep === 'channel' && renderChannelStep()}
      {currentStep === 'complete' && renderCompleteStep()}
    </div>
  );
};

export default ConfigWizard;
