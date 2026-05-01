<template>
  <div class="orders-page">
    <h1>📦 My Orders</h1>
    
    <div v-if="!isLoggedIn" class="not-logged-in">
      <p>Please <router-link to="/login">login</router-link> to view your orders.</p>
    </div>
    
    <div v-else-if="loading" class="loading">Loading orders...</div>
    
    <div v-else-if="orders.length === 0" class="empty-orders">
      <span>📦</span>
      <h2>No orders yet</h2>
      <p>Start shopping to see your orders here!</p>
      <router-link to="/products" class="btn-shop">Browse Products</router-link>
    </div>
    
    <div v-else class="orders-list">
      <div v-for="order in orders" :key="order.orderId" class="order-card">
        <div class="order-header">
          <div class="order-id">
            <span class="label">Order ID</span>
            <span class="value">#{{ order.orderId }}</span>
          </div>
          <div class="order-date">
            <span class="label">Date</span>
            <span class="value">{{ order.createdAt }}</span>
          </div>
          <div class="order-status" :style="{ color: getStatusColor(order.status) }">
            {{ getStatusLabel(order.status) }}
          </div>
        </div>
        
        <div class="order-items">
          <div v-for="item in order.items" :key="item.productId" class="order-item">
            <span class="item-emoji">{{ item.emoji }}</span>
            <span class="item-name">{{ item.name }}</span>
            <span class="item-qty">x{{ item.quantity }}</span>
            <span class="item-price">${{ item.price * item.quantity }}</span>
          </div>
        </div>
        
        <div class="order-footer">
          <div class="delivery-address">
            <span class="label">📍 Delivery Address:</span>
            <span>{{ order.deliveryAddress }}</span>
          </div>
          <div class="order-total">
            <span>Total: </span>
            <span class="total-amount">${{ order.total.toFixed(2) }}</span>
          </div>
        </div>
        
        <!-- Progress Tracker -->
        <div class="order-tracker">
          <div class="tracker-step" :class="{ active: isStatusActive(order.status, 'processing') }">
            <div class="step-icon">⏳</div>
            <span>Processing</span>
          </div>
          <div class="tracker-line" :class="{ active: isStatusActive(order.status, 'packed') }"></div>
          <div class="tracker-step" :class="{ active: isStatusActive(order.status, 'packed') }">
            <div class="step-icon">📦</div>
            <span>Packed</span>
          </div>
          <div class="tracker-line" :class="{ active: isStatusActive(order.status, 'shipped') }"></div>
          <div class="tracker-step" :class="{ active: isStatusActive(order.status, 'shipped') }">
            <div class="step-icon">🚚</div>
            <span>Shipped</span>
          </div>
          <div class="tracker-line" :class="{ active: isStatusActive(order.status, 'delivered') }"></div>
          <div class="tracker-step" :class="{ active: isStatusActive(order.status, 'delivered') }">
            <div class="step-icon">✅</div>
            <span>Delivered</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useOrders } from '../composables/useOrders';
import { useAuth } from '../composables/useAuth';
import type { OrderStatus } from '../types';

const { orders, loading, loadOrders, getStatusLabel, getStatusColor } = useOrders();
const { isLoggedIn, initAuth } = useAuth();

const statusOrder: OrderStatus[] = ['processing', 'packed', 'shipped', 'delivered'];

const isStatusActive = (currentStatus: string, checkStatus: OrderStatus) => {
  const currentIndex = statusOrder.indexOf(currentStatus as OrderStatus);
  const checkIndex = statusOrder.indexOf(checkStatus);
  return checkIndex <= currentIndex;
};

onMounted(async () => {
  await initAuth();
  await loadOrders();
});
</script>

<style scoped>
.orders-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.orders-page h1 {
  margin-bottom: 30px;
  color: var(--text-color);
}

.not-logged-in, .loading, .empty-orders {
  text-align: center;
  padding: 60px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
}

.not-logged-in a, .empty-orders a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.empty-orders span {
  font-size: 4rem;
  display: block;
  margin-bottom: 15px;
}

.empty-orders h2 {
  color: var(--text-color);
  margin-bottom: 10px;
}

.empty-orders p {
  color: var(--text-secondary);
  margin-bottom: 25px;
}

.btn-shop {
  display: inline-block;
  padding: 12px 25px;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
}

/* Orders List */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.order-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 25px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border-color);
}

.order-id .label, .order-date .label {
  display: block;
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 3px;
}

.order-id .value {
  font-weight: 700;
  color: var(--text-color);
}

.order-date .value {
  color: var(--text-color);
}

.order-status {
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 20px;
  background: var(--bg-color);
}

/* Order Items */
.order-items {
  margin-bottom: 20px;
}

.order-item {
  display: grid;
  grid-template-columns: 40px 1fr auto auto;
  gap: 15px;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
}

.order-item:last-child {
  border-bottom: none;
}

.item-emoji {
  font-size: 1.5rem;
}

.item-name {
  color: var(--text-color);
}

.item-qty {
  color: var(--text-secondary);
}

.item-price {
  font-weight: 600;
  color: var(--text-color);
}

/* Order Footer */
.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 25px;
  padding-top: 15px;
  border-top: 1px solid var(--border-color);
}

.delivery-address .label {
  display: block;
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 3px;
}

.delivery-address span:last-child {
  color: var(--text-color);
}

.order-total {
  text-align: right;
}

.order-total span:first-child {
  color: var(--text-secondary);
}

.total-amount {
  font-size: 1.3rem;
  font-weight: 700;
  color: #667eea;
}

/* Order Tracker */
.order-tracker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: var(--bg-color);
  border-radius: 8px;
}

.tracker-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0.4;
}

.tracker-step.active {
  opacity: 1;
}

.step-icon {
  font-size: 1.5rem;
}

.tracker-step span {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.tracker-step.active span {
  color: var(--text-color);
  font-weight: 600;
}

.tracker-line {
  flex: 1;
  height: 3px;
  background: var(--border-color);
  margin: 0 10px;
}

.tracker-line.active {
  background: #667eea;
}

@media (max-width: 768px) {
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .order-item {
    grid-template-columns: 30px 1fr;
    gap: 10px;
  }
  
  .item-qty, .item-price {
    grid-column: 2;
  }
  
  .order-footer {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .order-total {
    text-align: left;
  }
  
  .order-tracker {
    flex-wrap: wrap;
    gap: 15px;
  }
  
  .tracker-line {
    display: none;
  }
}
</style>