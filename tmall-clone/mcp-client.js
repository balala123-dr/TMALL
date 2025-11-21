import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';

class TmallMCPClient {
  constructor() {
    this.client = null;
    this.transport = null;
  }

  async connect() {
    try {
      // 启动MCP服务器进程
      const serverProcess = spawn('node', ['mcp-server.js'], {
        stdio: ['pipe', 'pipe', 'inherit'],
        cwd: process.cwd(),
      });

      // 创建传输层
      this.transport = new StdioClientTransport({
        reader: serverProcess.stdout,
        writer: serverProcess.stdin,
      });

      // 创建客户端
      this.client = new Client(
        {
          name: 'tmall-mcp-client',
          version: '1.0.0',
        },
        {
          capabilities: {
            tools: {},
          },
        }
      );

      // 连接到服务器
      await this.client.connect(this.transport);
      console.log('MCP客户端连接成功');
      
      // 列出可用工具
      const tools = await this.listTools();
      console.log('可用工具:', tools);

      return true;
    } catch (error) {
      console.error('MCP客户端连接失败:', error);
      return false;
    }
  }

  async listTools() {
    try {
      const result = await this.client.request(
        { method: 'tools/list' },
        { timeout: 5000 }
      );
      return result.tools;
    } catch (error) {
      console.error('获取工具列表失败:', error);
      return [];
    }
  }

  async getUserInfo(userId) {
    try {
      const result = await this.client.request(
        {
          method: 'tools/call',
          params: {
            name: 'get_user_info',
            arguments: {
              user_id: userId,
            },
          },
        },
        { timeout: 10000 }
      );
      return result;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return null;
    }
  }

  async updateUserProfile(userData) {
    try {
      const result = await this.client.request(
        {
          method: 'tools/call',
          params: {
            name: 'update_user_profile',
            arguments: userData,
          },
        },
        { timeout: 10000 }
      );
      return result;
    } catch (error) {
      console.error('更新用户资料失败:', error);
      return null;
    }
  }

  async getAddresses(parentId = null) {
    try {
      const result = await this.client.request(
        {
          method: 'tools/call',
          params: {
            name: 'get_addresses',
            arguments: {
              parent_id: parentId,
            },
          },
        },
        { timeout: 10000 }
      );
      return result;
    } catch (error) {
      console.error('获取地址列表失败:', error);
      return null;
    }
  }

  async searchProducts(searchParams) {
    try {
      const result = await this.client.request(
        {
          method: 'tools/call',
          params: {
            name: 'search_products',
            arguments: searchParams,
          },
        },
        { timeout: 10000 }
      );
      return result;
    } catch (error) {
      console.error('搜索商品失败:', error);
      return null;
    }
  }

  async createOrder(orderData) {
    try {
      const result = await this.client.request(
        {
          method: 'tools/call',
          params: {
            name: 'create_order',
            arguments: orderData,
          },
        },
        { timeout: 15000 }
      );
      return result;
    } catch (error) {
      console.error('创建订单失败:', error);
      return null;
    }
  }

  async disconnect() {
    try {
      if (this.client) {
        await this.client.close();
      }
      if (this.transport) {
        await this.transport.close();
      }
      console.log('MCP客户端断开连接');
    } catch (error) {
      console.error('断开连接时出错:', error);
    }
  }
}

export default TmallMCPClient;