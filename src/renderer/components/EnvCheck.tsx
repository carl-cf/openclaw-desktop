import React, { useState, useEffect } from 'react';
import { Button, Progress, Result, Space, Typography, Spin } from 'antd';

const { Title, Paragraph } = Typography;

interface EnvCheckProps {
  onNext: () => void;
  onBack: () => void;
}

interface EnvStatus {
  node: { installed: boolean; version?: string };
  npm: { installed: boolean; version?: string };
  network: { ok: boolean; latency?: number };
  disk: { ok: boolean; freeGB?: number };
  openclaw: { installed: boolean; version?: string };
}

const EnvCheck: React.FC<EnvCheckProps> = ({ onNext, onBack }) => {
  const [checking, setChecking] = useState(true);
  const [envStatus, setEnvStatus] = useState<EnvStatus | null>(null);
  const [installing, setInstalling] = useState(false);
  const [installProgress, setInstallProgress] = useState(0);

  useEffect(() => {
    checkEnvironment();
  }, []);

  const checkEnvironment = async () => {
    try {
      const status = await window.electronAPI.env.check();
      setEnvStatus(status);
    } catch (error) {
      console.error('环境检测失败:', error);
    } finally {
      setChecking(false);
    }
  };

  const installMissing = async () => {
    setInstalling(true);
    try {
      // 安装 Node.js
      if (!envStatus?.node.installed) {
        setInstallProgress(20);
        await window.electronAPI.env.installNode();
      }

      // 安装 OpenClaw
      if (!envStatus?.openclaw.installed) {
        setInstallProgress(60);
        await window.electronAPI.openclaw.install();
      }

      setInstallProgress(100);
      
      // 重新检测
      setTimeout(() => {
        checkEnvironment();
        setInstalling(false);
        setInstallProgress(0);
      }, 1000);
    } catch (error) {
      console.error('安装失败:', error);
      setInstalling(false);
    }
  };

  const isReady = () => {
    if (!envStatus) return false;
    return (
      envStatus.node.installed &&
      envStatus.npm.installed &&
      envStatus.network.ok &&
      envStatus.disk.ok &&
      envStatus.openclaw.installed
    );
  };

  const renderStatusItem = (
    name: string,
    installed: boolean,
    version?: string,
    icon?: string
  ) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        background: installed ? '#f6ffed' : '#fff2f0',
        border: `1px solid ${installed ? '#b7eb8f' : '#ffccc7'}`,
        borderRadius: '8px',
        marginBottom: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: '24px', marginRight: '12px' }}>{icon}</span>
        <div>
          <div style={{ fontWeight: 'bold' }}>{name}</div>
          {version && (
            <div style={{ fontSize: '12px', color: '#666' }}>版本：{version}</div>
          )}
        </div>
      </div>
      <div>
        {installed ? (
          <span style={{ color: '#52c41a', fontWeight: 'bold' }}>✅ 已安装</span>
        ) : (
          <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>❌ 未安装</span>
        )}
      </div>
    </div>
  );

  if (checking) {
    return (
      <div style={{ padding: '60px 40px', textAlign: 'center' }}>
        <Spin size="large" style={{ marginBottom: '24px' }} />
        <Title level={3}>正在检测环境...</Title>
        <Paragraph>请稍候，正在检查系统配置</Paragraph>
      </div>
    );
  }

  const allGood = isReady();

  return (
    <div style={{ padding: '60px 40px' }}>
      <Title level={3} style={{ textAlign: 'center', marginBottom: '32px' }}>
        🔍 环境检测结果
      </Title>

      {/* 检测项列表 */}
      <div style={{ marginBottom: '32px' }}>
        {renderStatusItem(
          'Node.js',
          envStatus?.node.installed || false,
          envStatus?.node.version,
          '📦'
        )}

        {renderStatusItem(
          'npm',
          envStatus?.npm.installed || false,
          envStatus?.npm.version,
          '🔧'
        )}

        {renderStatusItem(
          '网络连接',
          envStatus?.network.ok || false,
          envStatus?.network.latency
            ? `延迟：${envStatus.network.latency}ms`
            : undefined,
          '🌐'
        )}

        {renderStatusItem(
          '磁盘空间',
          envStatus?.disk.ok || false,
          envStatus?.disk.freeGB
            ? `可用：${envStatus.disk.freeGB.toFixed(1)}GB`
            : undefined,
          '💾'
        )}

        {renderStatusItem(
          'OpenClaw',
          envStatus?.openclaw.installed || false,
          envStatus?.openclaw.version,
          '🦞'
        )}
      </div>

      {/* 安装进度 */}
      {installing && (
        <div style={{ marginBottom: '24px' }}>
          <Paragraph>正在安装缺失的组件...</Paragraph>
          <Progress percent={installProgress} status="active" />
        </div>
      )}

      {/* 结果提示 */}
      {allGood && !installing && (
        <Result
          status="success"
          title="环境配置完成！"
          subTitle="所有必需组件已就绪，可以开始配置 AI 模型了"
        />
      )}

      {!allGood && !installing && (
        <Result
          status="warning"
          title="检测到缺失的组件"
          subTitle="点击下方按钮自动安装缺失的组件"
        />
      )}

      {/* 操作按钮 */}
      <Space style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
        <Button onClick={onBack} disabled={installing}>
          上一步
        </Button>

        {!allGood && !installing && (
          <Button type="primary" danger onClick={installMissing}>
            安装缺失组件
          </Button>
        )}

        {allGood && !installing && (
          <Button type="primary" size="large" onClick={onNext}>
            下一步：配置 AI 模型
          </Button>
        )}
      </Space>
    </div>
  );
};

export default EnvCheck;
