import { spawn } from 'child_process';

console.log('启动MCP服务器和客户端测试...');

// 启动后端服务器
console.log('1. 启动后端服务器...');
const backendServer = spawn('node', ['server.js'], {
  stdio: 'inherit',
  shell: true
});

backendServer.on('error', (error) => {
  console.error('后端服务器启动失败:', error);
});

// 等待后端启动后启动MCP服务器
setTimeout(() => {
  console.log('2. 启动MCP服务器...');
  const mcpServer = spawn('node', ['mcp-server.js'], {
    stdio: ['pipe', 'pipe', 'inherit'],
    shell: true
  });

  mcpServer.on('error', (error) => {
    console.error('MCP服务器启动失败:', error);
  });

  mcpServer.stdout.on('data', (data) => {
    console.log('MCP服务器输出:', data.toString());
  });

  // 测试连接
  setTimeout(() => {
    console.log('3. MCP服务器已启动，您可以在浏览器中访问:');
    console.log('   - 前端应用: http://localhost:5173');
    console.log('   - MCP演示页面: http://localhost:5173/mcp-demo');
    console.log('   - 后端API: http://localhost:3001');
  }, 2000);

  mcpServer.on('close', (code) => {
    console.log(`MCP服务器进程退出，代码: ${code}`);
    backendServer.kill();
  });
}, 3000);

// 处理退出信号
process.on('SIGINT', () => {
  console.log('\n正在关闭所有服务器...');
  backendServer.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n正在关闭所有服务器...');
  backendServer.kill();
  process.exit(0);
});