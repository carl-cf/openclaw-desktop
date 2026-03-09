import React from 'react';
import { Collapse, Typography, Space, Tag } from 'antd';

const { Title, Paragraph, Link } = Typography;

const Help: React.FC = () => {
  const faqItems = [
    {
      key: '1',
      label: '❓ 什么是 OpenClaw Desktop？',
      children: (
        <Paragraph>
          OpenClaw Desktop 是一个图形化的 OpenClaw 部署和管理工具，让您无需命令行即可轻松配置和运行 AI 助手。
          支持一键安装、图形化配置、实时监控等功能。
        </Paragraph>
      ),
    },
    {
      key: '2',
      label: '❓ 需要付费吗？',
      children: (
        <Paragraph>
          OpenClaw Desktop 本身完全免费开源！但是使用 AI 模型需要向模型提供商支付 API 费用。
          推荐模型价格参考：
          <br />
          <Tag color="blue">Qwen3.5-Plus: ¥0.02/1K tokens</Tag>
          <Tag color="green">MiniMax-M2.5: $0.001/1K tokens</Tag>
          <Tag color="orange">GPT-4o: $0.03/1K tokens</Tag>
        </Paragraph>
      ),
    },
    {
      key: '3',
      label: '❓ 如何获取 API Key？',
      children: (
        <div>
          <Paragraph><strong>百度千帆：</strong></Paragraph>
          <Paragraph>
            1. 访问 <Link href="https://cloud.baidu.com" target="_blank">百度智能云</Link>
            <br />
            2. 注册/登录账号
            <br />
            3. 进入控制台 → 应用列表
            <br />
            4. 创建应用获取 API Key
          </Paragraph>

          <Paragraph><strong>SiliconFlow：</strong></Paragraph>
          <Paragraph>
            1. 访问 <Link href="https://cloud.siliconflow.cn" target="_blank">SiliconFlow 云平台</Link>
            <br />
            2. 注册/登录账号
            <br />
            3. 进入控制台 → API Keys
            <br />
            4. 创建新的 API Key
          </Paragraph>

          <Paragraph><strong>OpenAI：</strong></Paragraph>
          <Paragraph>
            1. 访问 <Link href="https://platform.openai.com" target="_blank">OpenAI Platform</Link>
            <br />
            2. 登录账号
            <br />
            3. 进入 API Keys 页面
            <br />
            4. 创建新的 Secret Key
          </Paragraph>
        </div>
      ),
    },
    {
      key: '4',
      label: '❓ 支持哪些通信渠道？',
      children: (
        <Paragraph>
          目前支持：
          <br />
          ✅ <strong>飞书私聊</strong> - 通过飞书机器人与您私聊
          <br />
          ✅ <strong>Telegram</strong> - 通过 Telegram Bot 通信
          <br />
          ✅ <strong>网页版</strong> - 直接在桌面应用内对话
          <br />
          🚧 微信公众号（开发中）
          <br />
          🚧 WhatsApp（开发中）
        </Paragraph>
      ),
    },
    {
      key: '5',
      label: '❓ 数据安全性如何保障？',
      children: (
        <Paragraph>
          🔒 <strong>本地存储</strong> - 所有配置和数据都存储在本地
          <br />
          🔐 <strong>加密存储</strong> - API Key 使用加密方式存储
          <br />
          🚫 <strong>不上传</strong> - 不会将任何数据上传到我们的服务器
          <br />
          🔓 <strong>开源透明</strong> - 代码完全开源，可审计
        </Paragraph>
      ),
    },
    {
      key: '6',
      label: '❓ 如何更新？',
      children: (
        <Paragraph>
          OpenClaw Desktop 支持自动更新：
          <br />
          1. 应用会定期检查新版本
          <br />
          2. 发现新版本会提示下载
          <br />
          3. 下载完成后提示重启安装
          <br />
          也可以手动点击"检查更新"按钮
        </Paragraph>
      ),
    },
    {
      key: '7',
      label: '❓ 遇到问题怎么办？',
      children: (
        <div>
          <Paragraph><strong>方法 1：查看日志</strong></Paragraph>
          <Paragraph>
            在控制面板查看实时日志，定位问题原因
          </Paragraph>

          <Paragraph><strong>方法 2：GitHub Issues</strong></Paragraph>
          <Paragraph>
            访问 <Link href="https://github.com/carl-cf/openclaw-desktop/issues" target="_blank">GitHub Issues</Link> 提交问题
          </Paragraph>

          <Paragraph><strong>方法 3：查看文档</strong></Paragraph>
          <Paragraph>
            访问 <Link href="https://github.com/carl-cf/openclaw-desktop" target="_blank">项目主页</Link> 查看文档
          </Paragraph>
        </div>
      ),
    },
  ];

  const quickStartItems = [
    {
      key: '1',
      label: '🚀 快速开始',
      children: (
        <Paragraph>
          <strong>第 1 步：</strong> 运行应用，点击"开始安装"
          <br />
          <strong>第 2 步：</strong> 等待环境检测完成
          <br />
          <strong>第 3 步：</strong> 选择 AI 模型提供商，输入 API Key
          <br />
          <strong>第 4 步：</strong> 配置通信渠道（可选）
          <br />
          <strong>第 5 步：</strong> 点击"启动服务"，完成！
        </Paragraph>
      ),
    },
  ];

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
      <Title level={3}>❓ 帮助中心</Title>
      <Paragraph type="secondary">
        常见问题解答和使用指南
      </Paragraph>

      <Title level={5}>🚀 快速开始</Title>
      <Collapse items={quickStartItems} style={{ marginBottom: '24px' }} />

      <Title level={5}>📚 常见问题</Title>
      <Collapse items={faqItems} accordion />

      <div style={{ marginTop: '32px', padding: '20px', background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '8px' }}>
        <Title level={5}>💡 提示</Title>
        <Paragraph>
          如果这里没有找到答案，欢迎到{' '}
          <Link href="https://github.com/carl-cf/openclaw-desktop/discussions" target="_blank">
            GitHub Discussions
          </Link>{' '}
          提问或讨论！
        </Paragraph>
      </div>
    </div>
  );
};

export default Help;
