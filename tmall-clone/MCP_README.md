# 天猫克隆项目 - MCP协议集成

## 概述

本项目已集成 Model Context Protocol (MCP) 协议，提供标准化的工具调用接口，支持用户管理、地址查询、商品搜索和订单创建等功能。

## MCP功能特性

### 🛠️ 可用工具

1. **get_user_info** - 获取用户信息
2. **update_user_profile** - 更新用户资料  
3. **get_addresses** - 获取地址列表（支持分级查询）
4. **search_products** - 搜索商品
5. **create_order** - 创建订单

### 📁 文件结构

```
tmall-clone/
├── mcp-server.js              # MCP服务器
├── mcp-client.js              # MCP客户端
├── mcp-config.json           # MCP配置文件
├── start-mcp.js              # 启动脚本
├── src/
│   ├── hooks/
│   │   └── useMCPClient.ts   # React Hook
│   └── components/
│       └── MCPDemo.tsx       # 演示组件
└── MCP_README.md             # 本文档
```

## 安装依赖

```bash
# 安装MCP相关依赖
npm install @modelcontextprotocol/sdk ws
```

## 启动MCP服务

### 方法1: 使用启动脚本
```bash
node start-mcp.js
```

### 方法2: 分别启动
```bash
# 终端1: 启动后端服务器
node server-fixed.js

# 终端2: 启动MCP服务器  
node mcp-server.js

# 终端3: 启动前端开发服务器
npm run dev
```

## 访问地址

- **前端应用**: http://localhost:5173
- **MCP演示页面**: http://localhost:5173/mcp-demo
- **后端API**: http://localhost:3001

## MCP协议示例

### 获取用户信息
```javascript
const result = await client.request({
  method: 'tools/call',
  params: {
    name: 'get_user_info',
    arguments: {
      user_id: '123'
    }
  }
});
```

### 获取省级地址
```javascript
const result = await client.request({
  method: 'tools/call', 
  params: {
    name: 'get_addresses',
    arguments: {}
  }
});
```

### 搜索商品
```javascript
const result = await client.request({
  method: 'tools/call',
  params: {
    name: 'search_products',
    arguments: {
      keyword: '手机',
      min_price: 1000,
      max_price: 5000
    }
  }
});
```

## React Hook使用

```typescript
import { useMCPClient } from '../hooks/useMCPClient';

function MyComponent() {
  const { 
    isConnected, 
    getUserInfo, 
    searchProducts 
  } = useMCPClient();

  const handleSearch = async () => {
    const result = await searchProducts({ keyword: '手机' });
    console.log(result);
  };
}
```

## MCP配置说明

`mcp-config.json` 包含：
- 服务器配置信息
- 可用工具定义
- 参数模式
- 资源端点

## 错误处理

MCP客户端包含完整的错误处理机制：
- 连接超时处理
- 网络错误重试
- 参数验证
- 结果格式化

## 扩展开发

### 添加新工具

1. 在 `mcp-server.js` 中添加工具定义
2. 实现对应的方法
3. 更新 `mcp-config.json` 配置
4. 在 React Hook 中暴露方法

### 自定义客户端

可以继承 `SimpleMCPClient` 类来创建自定义的MCP客户端实现。

## 技术栈

- **MCP SDK**: @modelcontextprotocol/sdk
- **通信协议**: WebSocket / Stdio
- **前端**: React + TypeScript
- **后端**: Node.js + Express
- **数据库**: Supabase

## 注意事项

1. 确保后端服务器在3001端口正常运行
2. MCP服务器需要环境变量配置
3. 前端需要CORS支持
4. 网络连接可能影响MCP通信

## 故障排除

### 常见问题

1. **连接失败**: 检查端口占用和防火墙设置
2. **工具不存在**: 确认MCP服务器配置正确
3. **参数错误**: 验证传入参数格式
4. **网络超时**: 检查网络连接和服务器状态

### 调试模式

在代码中启用详细日志输出：
```javascript
console.log('MCP请求:', request);
console.log('MCP响应:', response);
```

## 许可证

本项目遵循 MIT 许可证。