import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { buildApiUrl } from '../lib/apiConfig';
import '../styles/OrderDetail.css';

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
  product_order_pay_date?: string;
  product_order_delivery_date?: string;
  product_order_confirm_date?: string;
  total_amount: number;
  items: OrderItem[];
}

const OrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // 获取用户Token
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // 获取订单详情
  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        setError('请先登录');
        setLoading(false);
        return;
      }

      const response = await fetch(buildApiUrl(`/orders/${orderId}`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setOrder(data.data);
      } else {
        setError(data.message || '获取订单详情失败');
      }
    } catch (err) {
      setError('网络错误，请稍后再试');
      console.error('获取订单详情错误:', err);
    } finally {
      setLoading(false);
    }
  };

  // 格式化订单状态
  const formatStatus = (status: number) => {
    switch (status) {
      case -1: return '已取消';
      case 0: return '待付款';
      case 1: return '待发货';
      case 2: return '待收货';
      case 3: return '已完成';
      default: return '未知状态';
    }
  };

  // 格式化日期时间
  const formatDateTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 更新订单状态
  const updateOrderStatus = async (newStatus: number) => {
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
        setOrder(prevOrder => prevOrder ? ({
          ...prevOrder,
          product_order_status: newStatus
        }) : prevOrder);
        
        if (newStatus === 3) {
          alert('确认收货成功');
        } else if (newStatus === -1) {
          alert('订单已取消');
          navigate('/orders');
        }
      } else {
        alert(data.message || '操作失败');
      }
    } catch (err) {
      alert('网络错误，请稍后再试');
      console.error('更新订单状态错误:', err);
    }
  };

  // 处理订单操作
  const handleOrderAction = () => {
    if (!order) return;

    if (order.product_order_status === 0) {
      if (window.confirm('确定要取消这个订单吗？')) {
        updateOrderStatus(-1); // -1 表示已取消
      }
    } else if (order.product_order_status === 2) {
      if (window.confirm('确认已收到商品吗？')) {
        updateOrderStatus(3);
      }
    }
  };

  // 模拟支付
  const handlePayment = () => {
    if (!order) return;

    if (window.confirm('确定要支付 ¥' + order.total_amount.toFixed(2) + ' 吗？')) {
      updateOrderStatus(1);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  if (loading) {
    return (
      <div className="order-detail-container">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-detail-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchOrderDetail} className="retry-button">重试</button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-detail-container">
        <div className="error-message">
          <p>订单不存在</p>
          <button onClick={() => navigate('/orders')} className="back-button">返回订单列表</button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: number) => {
    switch (status) {
      case -1: return '#999';
      case 0: return '#ff6000';
      case 1: return '#1677ff';
      case 2: return '#52c41a';
      case 3: return '#52c41a';
      default: return '#999';
    }
  };

  const getStatusBgColor = (status: number) => {
    switch (status) {
      case -1: return '#f5f5f5';
      case 0: return '#fff2e8';
      case 1: return '#f0f5ff';
      case 2: return '#f6ffed';
      case 3: return '#f6ffed';
      default: return '#f5f5f5';
    }
  };

  return (
    <div className="order-detail-container">
      <div className="order-detail-header">
        <h1>订单详情</h1>
        <button 
          className="back-button" 
          onClick={() => navigate('/orders')}
        >
          返回订单列表
        </button>
      </div>

      <div className="order-detail-content">
        {/* 订单状态 */}
        <div className="order-status-section">
        <div 
          className="status-badge" 
          style={{ 
            backgroundColor: getStatusBgColor(order.product_order_status),
            color: getStatusColor(order.product_order_status)
          }}
        >
          {formatStatus(order.product_order_status)}
        </div>
          <div className="order-number">订单编号: {order.product_order_code}</div>
        </div>

        {/* 收货信息 */}
        <div className="order-section">
          <h2>收货信息</h2>
          <div className="address-card">
            <div className="receiver-info">
              <div className="name-phone">
                <span className="receiver">{order.product_order_receiver}</span>
                <span className="phone">{order.product_order_mobile}</span>
              </div>
              <div className="address">
                {order.product_order_detail_address}
              </div>
            </div>
          </div>
        </div>

        {/* 商品信息 */}
        <div className="order-section">
          <h2>商品信息</h2>
          <div className="items-card">
            {order.items.map(item => (
              <div key={item.product_order_item_id} className="order-item">
                <img 
                  src={item.product_image_src || 'https://via.placeholder.com/100'} 
                  alt={item.product_name}
                  className="item-image"
                />
                <div className="item-info">
                  <div className="item-name">{item.product_name}</div>
                  <div className="item-price">¥{item.product_order_item_price.toFixed(2)}</div>
                </div>
                <div className="item-quantity">x{item.product_order_item_number}</div>
                <div className="item-total">
                  ¥{(item.product_order_item_price * item.product_order_item_number).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 订单信息 */}
        <div className="order-section">
          <h2>订单信息</h2>
          <div className="order-info-card">
            <div className="info-row">
              <span className="label">订单编号:</span>
              <span className="value">{order.product_order_code}</span>
            </div>
            <div className="info-row">
              <span className="label">下单时间:</span>
              <span className="value">{formatDateTime(new Date().toISOString())}</span>
            </div>
            {order.product_order_pay_date && (
              <div className="info-row">
                <span className="label">付款时间:</span>
                <span className="value">{formatDateTime(order.product_order_pay_date)}</span>
              </div>
            )}
            {order.product_order_delivery_date && (
              <div className="info-row">
                <span className="label">发货时间:</span>
                <span className="value">{formatDateTime(order.product_order_delivery_date)}</span>
              </div>
            )}
            {order.product_order_confirm_date && (
              <div className="info-row">
                <span className="label">确认收货时间:</span>
                <span className="value">{formatDateTime(order.product_order_confirm_date)}</span>
              </div>
            )}
            {order.items.some(item => item.product_order_item_user_message) && (
              <div className="info-row">
                <span className="label">买家留言:</span>
                <span className="value">
                  {order.items.filter(item => item.product_order_item_user_message)
                    .map(item => item.product_order_item_user_message)
                    .join('; ')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 费用明细 */}
        <div className="order-section">
          <h2>费用明细</h2>
          <div className="cost-card">
            <div className="cost-row">
              <span>商品总价</span>
              <span>¥{order.total_amount.toFixed(2)}</span>
            </div>
            <div className="cost-row">
              <span>运费</span>
              <span>¥0.00</span>
            </div>
            <div className="cost-divider"></div>
            <div className="cost-row total-row">
              <span>实付金额</span>
              <span>¥{order.total_amount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="order-detail-footer">
        <div className="total-amount">
          <span>实付金额: </span>
          <span className="price">¥{order.total_amount.toFixed(2)}</span>
        </div>
        <div className="order-actions">
          {order.product_order_status === 0 && (
            <>
              <button 
                className="cancel-button"
                onClick={() => handleOrderAction()}
              >
                取消订单
              </button>
              <button 
                className="pay-button"
                onClick={handlePayment}
              >
                立即付款
              </button>
            </>
          )}
          {order.product_order_status === 2 && (
            <button 
              className="confirm-button"
              onClick={() => handleOrderAction()}
            >
              确认收货
            </button>
          )}
          {order.product_order_status === 3 && (
            <button 
              className="review-button"
              onClick={() => navigate(`/review/${orderId}`)}
            >
              评价
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;