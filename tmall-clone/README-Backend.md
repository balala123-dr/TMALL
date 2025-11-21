# 天猫克隆项目 - 后端设置指南

## 🚀 快速开始

### 1. 安装后端依赖

```bash
# 复制后端依赖配置
cp package-server.json package.json

# 安装依赖
npm install
```

### 2. 配置数据库连接

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，填入您的Oracle数据库信息
# DB_USER=your_oracle_username
# DB_PASSWORD=your_oracle_password  
# DB_CONNECTSTRING=localhost:1521/XE
```

### 3. 启动后端服务器

```bash
# 开发模式（自动重启）
npm run dev

# 或者生产模式
npm start
```

服务器将运行在 `http://localhost:3001`

## 📡 API 接口

### 注册接口
- **URL**: `POST /api/register`
- **请求体**:
```json
{
  "user_name": "testuser",
  "user_password": "password123",
  "user_nickname": "测试用户",
  "user_realname": "张三",
  "user_gender": 1,
  "user_birthday": "1990-01-01",
  "user_address": "110000"
}
```

### 登录接口
- **URL**: `POST /api/login`
- **请求体**:
```json
{
  "user_name": "testuser",
  "user_password": "password123"
}
```

### 测试接口
- **URL**: `GET /api/test`
- **功能**: 测试数据库连接

## 🗄️ 数据库要求

确保您的Oracle数据库中已经创建了 `user` 表（参考 `db_schema.sql`）

```sql
CREATE TABLE IF NOT EXISTS "user" (
  user_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_name VARCHAR(25) NOT NULL,
  user_nickname VARCHAR(50),
  user_password VARCHAR(50) NOT NULL,
  user_realname VARCHAR(20),
  user_gender SMALLINT,
  user_birthday DATE,
  user_address CHAR(6),
  user_homeplace CHAR(6),
  user_profile_picture_src VARCHAR(100),
  CONSTRAINT uk_user_name UNIQUE (user_name)
);
```

## 🔧 前端配置

确保前端项目正在运行：

```bash
# 在前端项目目录中
npm run dev
```

前端项目默认运行在 `http://localhost:5173`

## 🐛 常见问题

### 1. 数据库连接失败
- 检查Oracle数据库服务是否启动
- 验证 `.env` 文件中的连接信息是否正确
- 确保用户表已创建

### 2. CORS 错误
- 确保后端服务器正在运行
- 检查端口号是否正确（默认3001）

### 3. 注册数据不显示
- 检查数据库表是否有数据：
```sql
SELECT COUNT(*) FROM "user";
SELECT * FROM "user" ORDER BY user_create_date DESC;
```

## 📝 开发说明

- 密码使用 `bcryptjs` 加密存储
- 支持用户名唯一性验证
- 包含完整的输入验证和错误处理
- 遵循RESTful API设计原则

## 🔄 数据流程

1. 用户在前端填写注册表单
2. 前端调用 `/api/register` 接口
3. 后端验证数据并加密密码
4. 数据写入Oracle数据库
5. 前端接收响应并处理结果

现在您的注册数据将真正保存到Oracle数据库中！🎉