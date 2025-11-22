import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl } from '../lib/apiConfig';
import '../styles/OrderList.css';

interface OrderItem {
  product_order_item_id: number;
  product_name: string;
  product_order_item_price: number;
  product_order_item_number: number;
  product_image_src?: string;
  product_order_item_user_message?: string;
}

interface Order {
  product_order_id: number;
  product_order_code: string;
  product_order_status: number;
  product_order_receiver: string;
  product_order_mobile: string;
  product_order_detail_address: string;
  total_amount: number;
  items: OrderItem[];
}

type OrderTab = 'all' | 'pending' | 'paid' | 'delivered' | 'completed';

const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<OrderTab>('all');
  const navigate = useNavigate();

  // 获取用户Token
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // 获取订单列表
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        setError('请先登录');
        setLoading(false);
        return;
      }

      // 从token中提取用户ID
      const userId = token.split('-')[2];
      
      const response = await fetch(`${buildApiUrl('/orders')}?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data);
      } else {
        setError(data.message || '获取订单失败');
      }
    } catch (err) {
      setError('网络错误，请稍后再试');
      console.error('获取订单错误:', err);
    } finally {
      setLoading(false);
    }
  };

  // 过滤订单
  const getFilteredOrders = () => {
    if (activeTab === 'all') return orders;
    
    const statusMap: Record<OrderTab, number> = {
      all: -999, // unused placeholder
      'pending': 0,
      'paid': 1,
      'delivered': 2,
      'completed': 3
    };
    
    return orders.filter(order => order.product_order_status === statusMap[activeTab]);
  };

  // 格式化订单状态
  const formatStatus = (status: number) => {
    const statusMap: Record<number, string> = {
      0: '待付款',
      1: '待发货',
      2: '待收货',
      3: '已完成'
    };
    return statusMap[status] || '未知状态';
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // 从订单编号提取日期（格式：YYYYMMDDXXXX）
  const extractDateFromOrderCode = (orderCode: string) => {
    if (!orderCode || orderCode.length < 8) return '';
    const year = orderCode.substring(0, 4);
    const month = orderCode.substring(4, 6);
    const day = orderCode.substring(6, 8);
    return `${year}/${month}/${day}`;
  };

  // 更新订单状态
  const updateOrderStatus = async (orderId: number, newStatus: number) => {
    try {
      const token = getToken();
      
      const response = await fetch(buildApiUrl(`/orders/${orderId}/status`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      
      if (data.success) {
        // 更新本地订单状态
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.product_order_id === orderId 
              ? { ...order, product_order_status: newStatus }
              : order
          )
        );
      } else {
        alert(data.message || '更新订单状态失败');
      }
    } catch (err) {
      alert('网络错误，请稍后再试');
      console.error('更新订单状态错误:', err);
    }
  };

  // 处理订单操作
  const handleOrderAction = (orderId: number, currentStatus: number) => {
    if (currentStatus === 0) {
      // 取消订单
      if (window.confirm('确定要取消这个订单吗？')) {
        updateOrderStatus(orderId, -1); // -1 表示已取消
      }
    } else if (currentStatus === 1) {
      // 提醒发货
      alert('已提醒商家尽快发货');
    } else if (currentStatus === 2) {
      // 确认收货
      if (window.confirm('确认已收到商品吗？')) {
        updateOrderStatus(orderId, 3);
      }
    }
  };

  // 查看订单详情
  const viewOrderDetail = (orderId: number) => {
    navigate(`/order/${orderId}`);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="order-list-container">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-list-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchOrders} className="retry-button">重试</button>
        </div>
      </div>
    );
  }

  const filteredOrders = getFilteredOrders();

  return (
    <div className="order-list-container">
      <div className="order-header">
        <h1>我的订单</h1>
      </div>
      
      <div className="order-tabs">
        <div 
          className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          全部订单
        </div>
        <div 
          className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          待付款
        </div>
        <div 
          className={`tab ${activeTab === 'paid' ? 'active' : ''}`}
          onClick={() => setActiveTab('paid')}
        >
          待发货
        </div>
        <div 
          className={`tab ${activeTab === 'delivered' ? 'active' : ''}`}
          onClick={() => setActiveTab('delivered')}
        >
          待收货
        </div>
        <div 
          className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          已完成
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-orders">
          <div className="empty-icon">📦</div>
          <p>暂无{activeTab === 'all' ? '' : formatStatus(
            activeTab === 'pending' ? 0 : 
            activeTab === 'paid' ? 1 : 
            activeTab === 'delivered' ? 2 : 3
          )}订单</p>
          <button 
            className="shop-button" 
            onClick={() => navigate('/')}
          >
            去逛逛
          </button>
        </div>
      ) : (
        <div className="orders-container">
          {filteredOrders.map(order => (
            <div key={order.product_order_id} className="order-card">
              <div className="order-header-info">
                <div className="order-number">订单编号: {order.product_order_code}</div>
                <div className="order-status">{formatStatus(order.product_order_status)}</div>
              </div>
              
              <div className="order-items">
                {order.items && order.items.length > 0 ? (
                  order.items.map(item => (
                    <div key={item.product_order_item_id} className="order-item">
                      <img 
                        src={item.product_image_src || 'https://via.placeholder.com/80'} 
                        alt={item.product_name}
                        className="item-image"
                      />
                      <div className="item-info">
                        <div className="item-name">{item.product_name}</div>
                        <div className="item-details">
                          {item.product_order_item_user_message && 
                            <div className="item-message">留言: {item.product_order_item_user_message}</div>
                          }
                        </div>
                      </div>
                      <div className="item-price-info">
                        <div className="item-price">¥{item.product_order_item_price.toFixed(2)}</div>
                        <div className="item-quantity">x{item.product_order_item_number}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="order-item-empty">
                    <span>暂无商品信息</span>
                  </div>
                )}
              </div>
              
              <div className="order-footer">
                <div className="order-address">
                  <div className="address-info">
                    <span className="receiver">{order.product_order_receiver}</span>
                    <span className="phone">{order.product_order_mobile}</span>
                  </div>
                  <div className="address-detail">
                    {order.product_order_detail_address}
                  </div>
                </div>
                <div className="order-summary">
                  <div className="total-amount">
                    共{order.items && order.items.length > 0 
                      ? order.items.reduce((sum, item) => sum + (item.product_order_item_number || 0), 0)
                      : 0}件商品 
                    合计: <span className="price">¥{(order.total_amount || 0).toFixed(2)}</span>
                  </div>
                  <div className="order-date">
                    {extractDateFromOrderCode(order.product_order_code) || formatDate(new Date().toISOString())}
                  </div>
                </div>
              </div>
              
              <div className="order-actions">
                <button 
                  className="detail-button"
                  onClick={() => viewOrderDetail(order.product_order_id)}
                >
                  订单详情
                </button>
                {order.product_order_status === 0 && (
                  <button 
                    className="cancel-button"
                    onClick={() => handleOrderAction(order.product_order_id, 0)}
                  >
                    取消订单
                  </button>
                )}
                {order.product_order_status === 0 && (
                  <button 
                    className="pay-button"
                    onClick={() => {
                      alert('模拟支付功能: 支付成功');
                      updateOrderStatus(order.product_order_id, 1);
                    }}
                  >
                    立即付款
                  </button>
                )}
                {order.product_order_status === 1 && (
                  <button 
                    className="remind-button"
                    onClick={() => handleOrderAction(order.product_order_id, 1)}
                  >
                    提醒发货
                  </button>
                )}
                {order.product_order_status === 2 && (
                  <button 
                    className="confirm-button"
                    onClick={() => handleOrderAction(order.product_order_id, 2)}
                  >
                    确认收货
                  </button>
                )}
                {order.product_order_status === 3 && (
                  <button 
                    className="review-button"
                    onClick={() => navigate(`/review/${order.product_order_id}`)}
                  >
                    评价
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;