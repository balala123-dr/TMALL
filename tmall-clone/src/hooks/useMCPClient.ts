import { useState, useEffect, useCallback } from 'react';

interface MCPClientInterface {
  getUserInfo: (userId: string) => Promise<any>;
  updateUserProfile: (userData: any) => Promise<any>;
  getAddresses: (parentId?: string | null) => Promise<any>;
  searchProducts: (searchParams: any) => Promise<any>;
  createOrder: (orderData: any) => Promise<any>;
  disconnect: () => Promise<void>;
}

interface MCPHookReturn {
  client: MCPClientInterface | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  tools: any[];
  connect: () => Promise<boolean>;
  disconnect: () => Promise<void>;
  getUserInfo: (userId: string) => Promise<any>;
  updateUserProfile: (userData: any) => Promise<any>;
  getAddresses: (parentId?: string | null) => Promise<any>;
  searchProducts: (searchParams: any) => Promise<any>;
  createOrder: (orderData: any) => Promise<any>;
}

// 简化的MCP客户端实现
class SimpleMCPClient implements MCPClientInterface {
  private isConnected: boolean = false;

  async connect(): Promise<boolean> {
    try {
      // 模拟连接到MCP服务器
      // 在实际应用中，这里会建立与MCP服务器的连接
      this.isConnected = true;
      console.log('MCP客户端连接成功');
      return true;
    } catch (error) {
      console.error('MCP客户端连接失败:', error);
      return false;
    }
  }

  async getUserInfo(userId: string) {
    if (!this.isConnected) throw new Error('MCP客户端未连接');
    
    // 调用后端API而不是直接使用MCP
    const response = await fetch(`http://localhost:3001/api/user/${userId}`);
    if (!response.ok) {
      throw new Error(`获取用户信息失败: ${response.statusText}`);
    }
    return await response.json();
  }

  async updateUserProfile(userData: any) {
    if (!this.isConnected) throw new Error('MCP客户端未连接');
    
    const response = await fetch('http://localhost:3001/api/user/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error(`更新用户资料失败: ${response.statusText}`);
    }
    return await response.json();
  }

  async getAddresses(parentId?: string | null) {
    if (!this.isConnected) throw new Error('MCP客户端未连接');
    
    const url = parentId 
      ? `http://localhost:3001/api/addresses?parentId=${parentId}`
      : 'http://localhost:3001/api/addresses';
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`获取地址列表失败: ${response.statusText}`);
    }
    return await response.json();
  }

  async searchProducts(searchParams: any) {
    if (!this.isConnected) throw new Error('MCP客户端未连接');
    
    const queryString = new URLSearchParams(searchParams).toString();
    const response = await fetch(`http://localhost:3001/api/products/search?${queryString}`);
    
    if (!response.ok) {
      throw new Error(`搜索商品失败: ${response.statusText}`);
    }
    return await response.json();
  }

  async createOrder(orderData: any) {
    if (!this.isConnected) throw new Error('MCP客户端未连接');
    
    const response = await fetch('http://localhost:3001/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    if (!response.ok) {
      throw new Error(`创建订单失败: ${response.statusText}`);
    }
    return await response.json();
  }

  async disconnect() {
    this.isConnected = false;
    console.log('MCP客户端断开连接');
  }
}

export const useMCPClient = (): MCPHookReturn => {
  const [client, setClient] = useState<MCPClientInterface | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tools, setTools] = useState<any[]>([]);

  const connect = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const mcpClient = new SimpleMCPClient();
      const connected = await mcpClient.connect();
      
      if (connected) {
        setClient(mcpClient);
        setIsConnected(true);
        
        // 模拟获取工具列表
        const mockTools = [
          { name: 'get_user_info', description: '获取用户信息' },
          { name: 'update_user_profile', description: '更新用户资料' },
          { name: 'get_addresses', description: '获取地址列表' },
          { name: 'search_products', description: '搜索商品' },
          { name: 'create_order', description: '创建订单' },
        ];
        setTools(mockTools);
        
        return true;
      } else {
        throw new Error('连接失败');
      }
    } catch (err: any) {
      setError(err.message || '连接MCP客户端时出错');
      setIsConnected(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      if (client) {
        await client.disconnect();
      }
      setClient(null);
      setIsConnected(false);
      setTools([]);
    } catch (err: any) {
      setError(err.message || '断开连接时出错');
    }
  }, [client]);

  const getUserInfo = useCallback(async (userId: string) => {
    if (!client) throw new Error('MCP客户端未连接');
    return await client.getUserInfo(userId);
  }, [client]);

  const updateUserProfile = useCallback(async (userData: any) => {
    if (!client) throw new Error('MCP客户端未连接');
    return await client.updateUserProfile(userData);
  }, [client]);

  const getAddresses = useCallback(async (parentId?: string | null) => {
    if (!client) throw new Error('MCP客户端未连接');
    return await client.getAddresses(parentId);
  }, [client]);

  const searchProducts = useCallback(async (searchParams: any) => {
    if (!client) throw new Error('MCP客户端未连接');
    return await client.searchProducts(searchParams);
  }, [client]);

  const createOrder = useCallback(async (orderData: any) => {
    if (!client) throw new Error('MCP客户端未连接');
    return await client.createOrder(orderData);
  }, [client]);

  return {
    client,
    isConnected,
    isLoading,
    error,
    tools,
    connect,
    disconnect,
    getUserInfo,
    updateUserProfile,
    getAddresses,
    searchProducts,
    createOrder,
  };
};