import React from 'react';
import { Card, Typography, Space, Tag, Divider, Button } from 'antd';
import { GithubOutlined } from '@ant-design/icons';

const { Title, Paragraph, Link } = Typography;

const About: React.FC = () => {
  return (
    <div style={{ padding: '40px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
      {/* Logo */}
      <div style={{ fontSize: '100px', marginBottom: '16px' }}>
        🦞
      </div>

      <Title level={2}>OpenClaw Desktop</Title>
      <Paragraph style={{ fontSize: '16px', color: '#666' }}>
        让 AI 助手触手可及
      </Paragraph>

      <Space style={{ marginBottom: '32px' }}>
        <Tag color="blue">v1.0.0</Tag>
        <Tag color="green">MIT License</Tag>
        <Tag color="purple">Electron 30+</Tag>
      </Space>

      {/* 项目信息 */}
      <Card style={{ marginBottom: '24px', textAlign: 'left' }}>
        <Title level={5}>📦 项目信息</Title>
        <Paragraph>
          <strong>版本：</strong>1.0.0
          <br />
          <strong>发布日期：</strong>2026-03-10
          <br />
          <strong>开发者：</strong>Carl
          <br />
          <strong>GitHub：</strong>
          <Link href="https://github.com/carl-cf/openclaw-desktop" target="_blank">
            carl-cf/openclaw-desktop
          </Link>
        </Paragraph>
      </Card>

      {/* 技术栈 */}
      <Card style={{ marginBottom: '24px', textAlign: 'left' }}>
        <Title level={5}>🛠️ 技术栈</Title>
        <Space wrap>
          <Tag color="blue">Electron 30+</Tag>
          <Tag color="cyan">React 18</Tag>
          <Tag color="purple">TypeScript</Tag>
          <Tag color="orange">Vite</Tag>
          <Tag color="green">Ant Design 5</Tag>
          <Tag color="red">electron-builder</Tag>
        </Space>
      </Card>

      {/* 功能特性 */}
      <Card style={{ marginBottom: '24px', textAlign: 'left' }}>
        <Title level={5}>✨ 功能特性</Title>
        <Paragraph>
          ✅ 一键安装 - 自动检测环境，智能安装依赖
          <br />
          ✅ 图形配置 - 无需命令行，可视化配置 AI 模型
          <br />
          ✅ 自动更新 - 始终保持最新版本
          <br />
          ✅ 实时监控 - 查看运行状态、日志、统计信息
          <br />
          ✅ 跨平台 - 支持 Windows、macOS、Linux
        </Paragraph>
      </Card>

      {/* 相关项目 */}
      <Card style={{ marginBottom: '24px', textAlign: 'left' }}>
        <Title level={5}>🔗 相关项目</Title>
        <Paragraph>
          <strong>OpenClaw：</strong>
          <Link href="https://github.com/openclaw/openclaw" target="_blank">
            github.com/openclaw/openclaw
          </Link>
          <br />
          <Paragraph type="secondary">
            强大的 AI 助手框架，支持多渠道通信
          </Paragraph>

          <Divider />

          <strong>Electron：</strong>
          <Link href="https://www.electronjs.org/" target="_blank">
            electronjs.org
          </Link>
          <br />
          <Paragraph type="secondary">
            跨平台桌面应用框架
          </Paragraph>
        </Paragraph>
      </Card>

      {/* 致谢 */}
      <Card style={{ marginBottom: '24px', textAlign: 'left' }}>
        <Title level={5}>🙏 致谢</Title>
        <Paragraph>
          感谢所有为 OpenClaw 和 Electron 做出贡献的开发者！
          <br />
          感谢使用 OpenClaw Desktop！
        </Paragraph>
      </Card>

      {/* 操作按钮 */}
      <Space size="large">
        <Button
          icon={<GithubOutlined />}
          size="large"
          onClick={() => window.open('https://github.com/carl-cf/openclaw-desktop')}
        >
          GitHub 主页
        </Button>
        <Button
          size="large"
          onClick={() => window.open('https://github.com/carl-cf/openclaw-desktop/issues')}
        >
          报告问题
        </Button>
        <Button
          size="large"
          onClick={() => window.open('https://github.com/carl-cf/openclaw-desktop/discussions')}
        >
          讨论区
        </Button>
      </Space>

      <Divider style={{ marginTop: '48px' }} />

      <Paragraph type="secondary">
        Made with ❤️ by Carl
        <br />
        MIT License © 2026
      </Paragraph>
    </div>
  );
};

export default About;
