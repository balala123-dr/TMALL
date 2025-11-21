import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

class TmallMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'tmall-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // 初始化Supabase客户端
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('缺少Supabase配置');
    }
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.setupTools();
  }

  setupTools() {
    // 列出可用工具
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get_user_info',
            description: '获取用户信息',
            inputSchema: {
              type: 'object',
              properties: {
                user_id: {
                  type: 'string',
                  description: '用户ID',
                },
              },
              required: ['user_id'],
            },
          },
          {
            name: 'update_user_profile',
            description: '更新用户资料',
            inputSchema: {
              type: 'object',
              properties: {
                user_id: {
                  type: 'string',
                  description: '用户ID',
                },
                user_nickname: {
                  type: 'string',
                  description: '用户昵称',
                },
                user_realname: {
                  type: 'string',
                  description: '真实姓名',
                },
                user_gender: {
                  type: 'number',
                  description: '性别 (1: 男, 0: 女)',
                },
                user_address: {
                  type: 'string',
                  description: '用户地址',
                },
              },
              required: ['user_id'],
            },
          },
          {
            name: 'get_addresses',
            description: '获取地址列表，支持分级查询',
            inputSchema: {
              type: 'object',
              properties: {
                parent_id: {
                  type: 'string',
                  description: '父级地址ID，为空则获取省级地址',
                },
              },
              required: [],
            },
          },
          {
            name: 'search_products',
            description: '搜索商品',
            inputSchema: {
              type: 'object',
              properties: {
                keyword: {
                  type: 'string',
                  description: '搜索关键词',
                },
                category: {
                  type: 'string',
                  description: '商品分类',
                },
                min_price: {
                  type: 'number',
                  description: '最低价格',
                },
                max_price: {
                  type: 'number',
                  description: '最高价格',
                },
              },
              required: [],
            },
          },
          {
            name: 'create_order',
            description: '创建订单',
            inputSchema: {
              type: 'object',
              properties: {
                user_id: {
                  type: 'string',
                  description: '用户ID',
                },
                items: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      product_id: { type: 'string' },
                      quantity: { type: 'number' },
                      price: { type: 'number' },
                    },
                  },
                  description: '订单商品列表',
                },
                delivery_address: {
                  type: 'string',
                  description: '配送地址',
                },
              },
              required: ['user_id', 'items'],
            },
          },
        ],
      };
    });

    // 处理工具调用
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'get_user_info':
            return await this.getUserInfo(args.user_id);
            
          case 'update_user_profile':
            return await this.updateUserProfile(args);
            
          case 'get_addresses':
            return await this.getAddresses(args.parent_id);
            
          case 'search_products':
            return await this.searchProducts(args);
            
          case 'create_order':
            return await this.createOrder(args);
            
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${error.message}`
        );
      }
    });
  }

  async getUserInfo(userId) {
    const { data, error } = await this.supabase
      .from('user')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async updateUserProfile(args) {
    const { user_id, ...updateData } = args;
    
    const { data, error } = await this.supabase
      .from('user')
      .update(updateData)
      .eq('user_id', user_id)
      .select()
      .single();

    if (error) throw error;

    return {
      content: [
        {
          type: 'text',
          text: `用户资料更新成功: ${JSON.stringify(data, null, 2)}`,
        },
      ],
    };
  }

  async getAddresses(parentId = null) {
    let query = this.supabase
      .from('address')
      .select('address_area_id, address_name, address_region_id')
      .order('address_area_id');

    if (parentId) {
      query = query.eq('address_region_id', parentId);
    } else {
      query = query.is('address_region_id', null);
    }

    const { data, error } = await query;

    if (error) throw error;

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            parent_id: parentId,
            addresses: data || [],
            count: data ? data.length : 0,
          }, null, 2),
        },
      ],
    };
  }

  async searchProducts(args) {
    let query = this.supabase
      .from('products')
      .select('*');

    if (args.keyword) {
      query = query.ilike('product_name', `%${args.keyword}%`);
    }

    if (args.category) {
      query = query.eq('category', args.category);
    }

    if (args.min_price !== undefined) {
      query = query.gte('price', args.min_price);
    }

    if (args.max_price !== undefined) {
      query = query.lte('price', args.max_price);
    }

    const { data, error } = await query;

    if (error) throw error;

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            search_params: args,
            products: data || [],
            count: data ? data.length : 0,
          }, null, 2),
        },
      ],
    };
  }

  async createOrder(args) {
    const { data, error } = await this.supabase
      .from('orders')
      .insert([{
        user_id: args.user_id,
        items: args.items,
        delivery_address: args.delivery_address,
        status: 'pending',
        created_at: new Date().toISOString(),
        total_amount: args.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      }])
      .select()
      .single();

    if (error) throw error;

    return {
      content: [
        {
          type: 'text',
          text: `订单创建成功: ${JSON.stringify(data, null, 2)}`,
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Tmall MCP server running on stdio');
  }
}

const server = new TmallMCPServer();
server.run().catch(console.error);