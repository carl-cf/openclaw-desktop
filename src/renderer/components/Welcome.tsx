import React from 'react';
import { Button, Typography, Space } from 'antd';

const { Title, Paragraph } = Typography;

interface WelcomeProps {
  onNext: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onNext }) => {
  return (
    <div style={{ padding: '60px 40px', textAlign: 'center' }}>
      {/* Logo */}
      <div style={{ marginBottom: '40px' }}>
        <span style={{ fontSize: '80px' }}>🦞</span>
      </div>

      {/* 标题 */}
      <Title level={2} style={{ marginBottom: '16px' }}>
        OpenClaw Desktop
      </Title>

      <Paragraph style={{ fontSize: '16px', color: '#666', marginBottom: '48px' }}>
        让 AI 助手触手可及 · 一键部署 · 零配置
      </Paragraph>

      {/* 特性介绍 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '24px',
        marginBottom: '48px',
      }}>
        <div style={{ padding: '20px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🚀</div>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>一键安装</div>
          <div style={{ fontSize: '14px', color: '#999' }}>
            自动检测环境，智能安装依赖
          </div>
        </div>

        <div style={{ padding: '20px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>⚙️</div>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>图形配置</div>
          <div style={{ fontSize: '14px', color: '#999' }}>
            无需命令行，可视化配置 AI 模型
          </div>
        </div>

        <div style={{ padding: '20px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔄</div>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>自动更新</div>
          <div style={{ fontSize: '14px', color: '#999' }}>
            始终保持最新版本，无需手动升级
          </div>
        </div>
      </div>

      {/* 开始按钮 */}
      <Space size="large">
        <Button
          type="primary"
          size="large"
          onClick={onNext}
          style={{ 
            width: '200px', 
            height: '50px',
            fontSize: '18px',
          }}
        >
          开始安装
        </Button>
      </Space>

      {/* 版本信息 */}
      <div style={{ marginTop: '32px', fontSize: '12px', color: '#999' }}>
        版本：v1.0.0 · GitHub: carl-cf/openclaw-desktop
      </div>
    </div>
  );
};

export default Welcome;
