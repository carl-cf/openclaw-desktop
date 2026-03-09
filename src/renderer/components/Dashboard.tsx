import React, { useState, useEffect } from 'react';
import { Button, Card, Space, Typography, Tag, message, Layout, Menu } from 'antd';
import { DashboardOutlined, SettingOutlined, QuestionCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import Settings from './Settings';
import Help from './Help';
import About from './About';

const { Title, Text } = Typography;
const { Content, Sider } = Layout;

type Page = 'dashboard' | 'settings' | 'help' | 'about';

const Dashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [gatewayRunning, setGatewayRunning] = useState(false);
  const [gatewayStatus, setGatewayStatus] = useState<string>('stopped');
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    uptime: 0,
    messageCount: 0,
    tokenUsage: 0,
  });

  useEffect(() => {
    checkGatewayStatus();
    loadLogs();
    
    const interval = setInterval(() => {
      checkGatewayStatus();
      loadLogs();
    }, 5000);

    // 监听快捷键事件
    const unsubscribe = () => {
      // 清理函数，实际实现在 preload 中
    };

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const checkGatewayStatus = async () => {
    try {
      const status = await window.electronAPI.gateway.getStatus();
      setGatewayRunning(status.running);
      setGatewayStatus(status.status);
      if (status.running) {
        setStats((prev) => ({ ...prev, uptime: status.uptime }));
      }
    } catch (error) {
      console.error('检查网关状态失败:', error);
    }
  };

  const loadLogs = async () => {
    try {
      const newLogs = await window.electronAPI.logs.get();
      setLogs(newLogs);
    } catch (error) {
      console.error('加载日志失败:', error);
    }
  };

  const handleStart = async () => {
    setLoading(true);
    try {
      const result = await window.electronAPI.gateway.start();
      if (result.success) {
        message.success('服务启动成功！');
        checkGatewayStatus();
      } else {
        message.error(`启动失败：${result.error}`);
      }
    } catch (error) {
      message.error('启动失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    setLoading(true);
    try {
      const result = await window.electronAPI.gateway.stop();
      if (result.success) {
        message.success('服务已停止');
        checkGatewayStatus();
      } else {
        message.error(`停止失败：${result.error}`);
      }
    } catch (error) {
      message.error('停止失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '控制面板',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      key: 'help',
      icon: <QuestionCircleOutlined />,
      label: '帮助',
    },
    {
      key: 'about',
      icon: <InfoCircleOutlined />,
      label: '关于',
    },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'settings':
        return <Settings onComplete={() => setCurrentPage('dashboard')} />;
      case 'help':
        return <Help />;
      case 'about':
        return <About />;
      default:
        return (
          <div style={{ padding: '40px', height: '100%', overflow: 'auto' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '32px',
              }}
            >
              <div>
                <Title level={3} style={{ margin: 0 }}>
                  🦞 OpenClaw Desktop
                </Title>
                <Text type="secondary">控制面板</Text>
              </div>
              <Space size="large">
                <Tag
                  color={gatewayRunning ? 'green' : 'red'}
                  style={{ fontSize: '14px', padding: '8px 16px' }}
                >
                  {gatewayRunning ? '🟢 运行中' : '🔴 已停止'}
                </Tag>
                <Space>
                  <Button
                    type="primary"
                    onClick={handleStart}
                    loading={loading}
                    disabled={gatewayRunning}
                    size="large"
                  >
                    ▶️ 启动服务
                  </Button>
                  <Button
                    danger
                    onClick={handleStop}
                    loading={loading}
                    disabled={!gatewayRunning}
                    size="large"
                  >
                    ⏹️ 停止服务
                  </Button>
                </Space>
              </Space>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '24px',
                marginBottom: '32px',
              }}
            >
              <Card>
                <div style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>
                  运行时长
                </div>
                <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
                  {formatUptime(stats.uptime)}
                </div>
              </Card>

              <Card>
                <div style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>
                  今日消息
                </div>
                <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
                  {stats.messageCount}
                </div>
              </Card>

              <Card>
                <div style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>
                  Token 消耗
                </div>
                <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
                  {stats.tokenUsage.toLocaleString()}
                </div>
              </Card>
            </div>

            <Card title="📋 实时日志" style={{ marginBottom: '24px' }}>
              <div
                style={{
                  height: '300px',
                  overflow: 'auto',
                  background: '#1e1e1e',
                  padding: '16px',
                  borderRadius: '8px',
                  fontFamily: 'Consolas, Monaco, monospace',
                  fontSize: '12px',
                }}
              >
                {logs.length === 0 ? (
                  <div style={{ color: '#666', textAlign: 'center', padding: '40px' }}>
                    暂无日志
                  </div>
                ) : (
                  logs.map((log, index) => (
                    <div
                      key={index}
                      style={{
                        color: log.includes('ERROR')
                          ? '#ff6b6b'
                          : log.includes('WARN')
                          ? '#ffd93d'
                          : '#6bcb77',
                        marginBottom: '4px',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                      }}
                    >
                      {log}
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card title="⚡ 快捷操作">
              <Space wrap>
                <Button onClick={() => setCurrentPage('settings')}>
                  ⚙️ 设置
                </Button>
                <Button onClick={() => setCurrentPage('help')}>
                  ❓ 帮助
                </Button>
                <Button onClick={() => setCurrentPage('about')}>
                  ℹ️ 关于
                </Button>
              </Space>
            </Card>
          </div>
        );
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <span style={{ fontSize: '40px' }}>🦞</span>
          <div style={{ marginTop: '8px', fontWeight: 'bold' }}>OpenClaw</div>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[currentPage]}
          items={menuItems}
          onClick={(e) => setCurrentPage(e.key as Page)}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Content style={{ overflow: 'auto' }}>
        {renderPage()}
      </Content>
    </Layout>
  );
};

export default Dashboard;
