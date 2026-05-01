import { ref, computed } from 'vue';
import type { Order, OrderItem, OrderStatus } from '../types';
import { getSession } from '../utils/storage';
import { getOrders, getOrdersByUserId, createOrder as createOrderData, updateOrderStatus as updateOrderStatusData, getProductById } from '../utils/dataUtils';
import { generateId } from '../utils/dataUtils';

const orders = ref<Order[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

// Load user's orders
const loadOrders = async () => {
  const session = getSession();
  if (!session) return;
  
  loading.value = true;
  error.value = null;
  
  try {
    // Get from localStorage first
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      orders.value = JSON.parse(storedOrders).filter((o: Order) => o.userId === session.userId);
    } else {
      orders.value = await getOrdersByUserId(session.userId);
    }
  } catch (e) {
    error.value = 'Failed to load orders';
  } finally {
    loading.value = false;
  }
};

// Load all orders (for admin)
const loadAllOrders = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const storedOrders = localStorage.getItem('orders');
    orders.value = storedOrders ? JSON.parse(storedOrders) : await getOrders();
  } catch (e) {
    error.value = 'Failed to load orders';
  } finally {
    loading.value = false;
  }
};

// Create new order
const createOrder = async (
  items: { productId: string; quantity: number }[],
  deliveryAddress: string,
  subtotal: number,
  deliveryFee: number
): Promise<Order | null> => {
  const session = getSession();
  if (!session) return null;
  
  loading.value = true;
  error.value = null;
  
  try {
    // Get product details for each item
    const orderItems: OrderItem[] = [];
    
    for (const item of items) {
      const product = await getProductById(item.productId);
      if (product) {
        orderItems.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          emoji: product.emoji
        });
      }
    }
    
    const newOrder: Order = {
      orderId: generateId('o'),
      userId: session.userId,
      userName: session.name,
      userEmail: session.email,
      items: orderItems,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      status: 'processing',
      deliveryAddress,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    // Save to localStorage
    const storedOrders = localStorage.getItem('orders');
    const allOrders: Order[] = storedOrders ? JSON.parse(storedOrders) : [];
    allOrders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(allOrders));
    
    orders.value = allOrders.filter(o => o.userId === session.userId);
    
    return newOrder;
  } catch (e) {
    error.value = 'Failed to create order';
    return null;
  } finally {
    loading.value = false;
  }
};

// Update order status (admin)
const updateStatus = async (orderId: string, status: OrderStatus) => {
  loading.value = true;
  error.value = null;
  
  try {
    const storedOrders = localStorage.getItem('orders');
    const allOrders: Order[] = storedOrders ? JSON.parse(storedOrders) : [];
    
    const index = allOrders.findIndex(o => o.orderId === orderId);
    if (index !== -1) {
      allOrders[index].status = status;
      localStorage.setItem('orders', JSON.stringify(allOrders));
      orders.value = allOrders;
    }
  } catch (e) {
    error.value = 'Failed to update order status';
  } finally {
    loading.value = false;
  }
};

// Get status label
const getStatusLabel = (status: OrderStatus): string => {
  const labels: Record<OrderStatus, string> = {
    processing: 'Processing ⏳',
    packed: 'Packed 📦',
    shipped: 'Shipped 🚚',
    delivered: 'Delivered ✅'
  };
  return labels[status];
};

// Get status color
const getStatusColor = (status: OrderStatus): string => {
  const colors: Record<OrderStatus, string> = {
    processing: '#f59e0b',
    packed: '#3b82f6',
    shipped: '#8b5cf6',
    delivered: '#10b981'
  };
  return colors[status];
};

export function useOrders() {
  return {
    orders,
    loading,
    error,
    loadOrders,
    loadAllOrders,
    createOrder,
    updateStatus,
    getStatusLabel,
    getStatusColor
  };
}