import React, { useState, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import Welcome from './components/Welcome';
import EnvCheck from './components/EnvCheck';
import ConfigWizard from './components/ConfigWizard';
import Dashboard from './components/Dashboard';

type Step = 'welcome' | 'env-check' | 'config' | 'dashboard';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [isFirstRun, setIsFirstRun] = useState(true);

  useEffect(() => {
    // 检查是否首次运行
    checkFirstRun();
  }, []);

  const checkFirstRun = async () => {
    try {
      const config = await window.electronAPI.config.get('model');
      if (config?.apiKey) {
        setIsFirstRun(false);
        setCurrentStep('dashboard');
      }
    } catch (error) {
      console.error('检查配置失败:', error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <Welcome onNext={() => setCurrentStep('env-check')} />;
      
      case 'env-check':
        return (
          <EnvCheck
            onNext={() => setCurrentStep('config')}
            onBack={() => setCurrentStep('welcome')}
          />
        );
      
      case 'config':
        return (
          <ConfigWizard
            onComplete={() => setCurrentStep('dashboard')}
            onBack={() => setCurrentStep('env-check')}
          />
        );
      
      case 'dashboard':
        return <Dashboard />;
      
      default:
        return <Welcome onNext={() => setCurrentStep('env-check')} />;
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}>
        <div style={{ 
          width: '90%', 
          maxWidth: '1000px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          overflow: 'hidden',
        }}>
          {renderStep()}
        </div>
      </div>
    </ConfigProvider>
  );
};

export default App;
