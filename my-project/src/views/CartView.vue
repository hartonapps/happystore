<template>
  <div class="cart-page">
    <h1>🛒 Shopping Cart</h1>
    
    <div v-if="cartWithProducts.length === 0" class="empty-cart">
      <span>🛒</span>
      <h2>Your cart is empty</h2>
      <p>Start shopping to add items to your cart!</p>
      <router-link to="/products" class="btn-shop">Browse Products</router-link>
    </div>
    
    <div v-else class="cart-content">
      <!-- Cart Items -->
      <div class="cart-items">
        <div v-for="item in cartWithProducts" :key="item.productId" class="cart-item">
          <div class="item-emoji">{{ item.product?.emoji }}</div>
          <div class="item-details">
            <router-link :to="`/product/${item.productId}`" class="item-name">
              {{ item.product?.name }}
            </router-link>
            <div class="item-price">${{ item.product?.price }}</div>
          </div>
          <div class="item-quantity">
            <button @click="updateQuantity(item.productId, item.quantity - 1)">-</button>
            <span>{{ item.quantity }}</span>
            <button @click="updateQuantity(item.productId, item.quantity + 1)">+</button>
          </div>
          <div class="item-total">
            ${{ (item.product?.price || 0) * item.quantity }}
          </div>
          <button @click="removeFromCart(item.productId)" class="btn-remove">
            🗑️
          </button>
        </div>
      </div>

      <!-- Cart Summary -->
      <div class="cart-summary">
        <h2>Order Summary</h2>
        
        <div class="summary-row">
          <span>Subtotal ({{ itemCount }} items)</span>
          <span>${{ cartTotal.toFixed(2) }}</span>
        </div>
        
        <div class="summary-row">
          <span>Delivery Fee</span>
          <span>{{ deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}` }}</span>
        </div>
        
        <div v-if="cartTotal >= 200" class="free-shipping-notice">
          🎉 You qualify for FREE shipping!
        </div>
        <div v-else class="shipping-notice">
          Add ${{ (200 - cartTotal).toFixed(2) }} more for FREE shipping
        </div>
        
        <div class="summary-row total">
          <span>Total</span>
          <span>${{ finalTotal.toFixed(2) }}</span>
        </div>
        
        <router-link to="/checkout" class="btn-checkout">
          Proceed to Checkout 💳
        </router-link>
        
        <router-link to="/products" class="btn-continue-shopping">
          Continue Shopping
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useCart } from '../composables/useCart';

const { 
  cartWithProducts, 
  itemCount, 
  cartTotal, 
  deliveryFee, 
  finalTotal,
  updateQuantity, 
  removeFromCart,
  initCart 
} = useCart();

onMounted(() => {
  initCart();
});
</script>

<style scoped>
.cart-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.cart-page h1 {
  margin-bottom: 30px;
  color: var(--text-color);
}

/* Empty Cart */
.empty-cart {
  text-align: center;
  padding: 60px 20px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
}

.empty-cart span {
  font-size: 6rem;
  display: block;
  margin-bottom: 20px;
}

.empty-cart h2 {
  color: var(--text-color);
  margin-bottom: 10px;
}

.empty-cart p {
  color: var(--text-secondary);
  margin-bottom: 25px;
}

.btn-shop {
  display: inline-block;
  padding: 15px 30px;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-shop:hover {
  background: #5568d3;
}

/* Cart Content */
.cart-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 30px;
}

/* Cart Items */
.cart-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cart-item {
  display: grid;
  grid-template-columns: 80px 1fr auto auto auto;
  align-items: center;
  gap: 20px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
}

.item-emoji {
  font-size: 3rem;
  text-align: center;
}

.item-details {
  min-width: 0;
}

.item-name {
  display: block;
  font-weight: 600;
  color: var(--text-color);
  text-decoration: none;
  margin-bottom: 5px;
}

.item-name:hover {
  color: #667eea;
}

.item-price {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 10px;
}

.item-quantity button {
  width: 32px;
  height: 32px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-color);
  color: var(--text-color);
  cursor: pointer;
  font-size: 1.1rem;
}

.item-quantity button:hover {
  background: #667eea;
  color: white;
}

.item-quantity span {
  min-width: 30px;
  text-align: center;
  font-weight: 600;
}

.item-total {
  font-size: 1.2rem;
  font-weight: 700;
  color: #667eea;
  min-width: 80px;
  text-align: right;
}

.btn-remove {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 8px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.btn-remove:hover {
  opacity: 1;
}

/* Cart Summary */
.cart-summary {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 25px;
  height: fit-content;
  position: sticky;
  top: 20px;
}

.cart-summary h2 {
  margin-bottom: 20px;
  color: var(--text-color);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
}

.summary-row.total {
  border-bottom: none;
  font-size: 1.3rem;
  font-weight: 700;
  color: #667eea;
  padding-top: 20px;
}

.free-shipping-notice {
  background: #d1fae5;
  color: #065f46;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  margin: 15px 0;
  font-weight: 600;
}

.shipping-notice {
  background: #fef3c7;
  color: #92400e;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  margin: 15px 0;
  font-size: 0.9rem;
}

.btn-checkout {
  display: block;
  width: 100%;
  padding: 15px;
  background: #667eea;
  color: white;
  text-align: center;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  margin-top: 20px;
  transition: background 0.2s;
}

.btn-checkout:hover {
  background: #5568d3;
}

.btn-continue-shopping {
  display: block;
  text-align: center;
  margin-top: 15px;
  color: #667eea;
  text-decoration: none;
}

.btn-continue-shopping:hover {
  text-decoration: underline;
}

@media (max-width: 1024px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
  
  .cart-summary {
    position: static;
  }
}

@media (max-width: 768px) {
  .cart-item {
    grid-template-columns: 60px 1fr;
    gap: 10px;
  }
  
  .item-quantity {
    grid-column: 2;
  }
  
  .item-total {
    grid-column: 2;
    text-align: left;
  }
  
  .btn-remove {
    position: absolute;
    right: 20px;
    top: 20px;
  }
}
</style>