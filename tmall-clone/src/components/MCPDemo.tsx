import React, { useState, useEffect } from 'react';
import { useMCPClient } from '../hooks/useMCPClient';

const MCPDemo: React.FC = () => {
  const {
    client,
    isConnected,
    isLoading,
    error,
    tools,
    connect,
    disconnect,
    getUserInfo,
    getAddresses,
    searchProducts,
    createOrder,
  } = useMCPClient();

  const [results, setResults] = useState<any>(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    // 自动连接
    connect();
  }, [connect]);

  const handleGetUserInfo = async () => {
    try {
      const result = await getUserInfo('1');
      setResults(result);
    } catch (err: any) {
      setResults({ error: err.message });
    }
  };

  const handleGetAddresses = async () => {
    try {
      const result = await getAddresses();
      setResults(result);
    } catch (err: any) {
      setResults({ error: err.message });
    }
  };

  const handleSearchProducts = async () => {
    try {
      const result = await searchProducts({ keyword: searchKeyword });
      setResults(result);
    } catch (err: any) {
      setResults({ error: err.message });
    }
  };

  const handleCreateOrder = async () => {
    try {
      const orderData = {
        user_id: '1',
        items: [
          { product_id: '1', quantity: 2, price: 299.99 }
        ],
        delivery_address: '测试地址',
      };
      const result = await createOrder(orderData);
      setResults(result);
    } catch (err: any) {
      setResults({ error: err.message });
    }
  };

  return (
    <div className="mcp-demo" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>MCP协议演示</h2>
      
      {/* 连接状态 */}
      <div className="connection-status" style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd' }}>
        <h3>连接状态</h3>
        <p>状态: {isLoading ? '连接中...' : (isConnected ? '已连接' : '未连接')}</p>
        {error && <p style={{ color: 'red' }}>错误: {error}</p>}
        <div style={{ marginTop: '10px' }}>
          {!isConnected ? (
            <button onClick={connect} disabled={isLoading}>
              连接MCP客户端
            </button>
          ) : (
            <button onClick={disconnect}>
              断开连接
            </button>
          )}
        </div>
      </div>

      {/* 可用工具列表 */}
      {isConnected && (
        <div className="tools-list" style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd' }}>
          <h3>可用工具</h3>
          <ul>
            {tools.map((tool, index) => (
              <li key={index}>
                <strong>{tool.name}</strong>: {tool.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 操作按钮 */}
      {isConnected && (
        <div className="operations" style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd' }}>
          <h3>测试操作</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button onClick={handleGetUserInfo}>获取用户信息</button>
            <button onClick={handleGetAddresses}>获取地址列表</button>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="搜索商品关键词"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                style={{ padding: '5px' }}
              />
              <button onClick={handleSearchProducts}>搜索商品</button>
            </div>
            
            <button onClick={handleCreateOrder}>创建测试订单</button>
          </div>
        </div>
      )}

      {/* 结果显示 */}
      {results && (
        <div className="results" style={{ padding: '10px', border: '1px solid #ddd' }}>
          <h3>结果</h3>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '10px', 
            overflow: 'auto',
            maxHeight: '300px',
            whiteSpace: 'pre-wrap'
          }}>
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default MCPDemo;