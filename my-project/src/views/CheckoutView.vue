<template>
  <div class="checkout-page">
    <h1>💳 Checkout</h1>
    
    <div v-if="cartWithProducts.length === 0" class="empty-cart">
      <span>🛒</span>
      <h2>Your cart is empty</h2>
      <router-link to="/products">Browse Products</router-link>
    </div>
    
    <div v-else class="checkout-content">
      <!-- Checkout Form -->
      <div class="checkout-form">
        <h2>Delivery Information</h2>
        
        <form @submit.prevent="handleCheckout">
          <div class="form-group">
            <label>Full Name</label>
            <input v-model="form.name" type="text" required />
          </div>
          
          <div class="form-group">
            <label>Email</label>
            <input v-model="form.email" type="email" required />
          </div>
          
          <div class="form-group">
            <label>Delivery Address</label>
            <textarea v-model="form.address" rows="3" required></textarea>
          </div>
          
          <div class="form-group">
            <label>Phone (optional)</label>
            <input v-model="form.phone" type="tel" />
          </div>
          
          <h2>Payment Method</h2>
          <div class="payment-methods">
            <label class="payment-option">
              <input type="radio" v-model="form.paymentMethod" value="card" />
              <span>💳 Credit/Debit Card</span>
            </label>
            <label class="payment-option">
              <input type="radio" v-model="form.paymentMethod" value="cash" />
              <span>💵 Cash on Delivery</span>
            </label>
          </div>
          
          <!-- Card Details (if card selected) -->
          <div v-if="form.paymentMethod === 'card'" class="card-details">
            <div class="form-group">
              <label>Card Number</label>
              <input v-model="form.cardNumber" type="text" placeholder="1234 5678 9012 3456" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Expiry Date</label>
                <input v-model="form.expiry" type="text" placeholder="MM/YY" />
              </div>
              <div class="form-group">
                <label>CVV</label>
                <input v-model="form.cvv" type="text" placeholder="123" />
              </div>
            </div>
          </div>
          
          <!-- Coupon Code -->
          <div class="coupon-section">
            <label>Coupon Code</label>
            <div class="coupon-input">
              <input v-model="couponCode" type="text" placeholder="Enter coupon code" />
              <button type="button" @click="applyCoupon">Apply</button>
            </div>
            <p v-if="couponMessage" :class="['coupon-message', couponValid ? 'valid' : 'invalid']">
              {{ couponMessage }}
            </p>
          </div>
          
          <button type="submit" class="btn-place-order" :disabled="loading">
            {{ loading ? 'Processing...' : 'Place Order ✅' }}
          </button>
        </form>
      </div>
      
      <!-- Order Summary -->
      <div class="order-summary">
        <h2>Order Summary</h2>
        
        <div class="summary-items">
          <div v-for="item in cartWithProducts" :key="item.productId" class="summary-item">
            <span class="item-emoji">{{ item.product?.emoji }}</span>
            <span class="item-name">{{ item.product?.name }}</span>
            <span class="item-qty">x{{ item.quantity }}</span>
            <span class="item-price">${{ (item.product?.price || 0) * item.quantity }}</span>
          </div>
        </div>
        
        <div class="summary-totals">
          <div class="summary-row">
            <span>Subtotal</span>
            <span>${{ cartTotal.toFixed(2) }}</span>
          </div>
          <div class="summary-row">
            <span>Delivery Fee</span>
            <span>{{ deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}` }}</span>
          </div>
          <div v-if="discount > 0" class="summary-row discount">
            <span>Discount</span>
            <span>-${{ discount.toFixed(2) }}</span>
          </div>
          <div class="summary-row total">
            <span>Total</span>
            <span>${{ finalTotal.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCart } from '../composables/useCart';
import { useAuth } from '../composables/useAuth';
import { useOrders } from '../composables/useOrders';
import { getSession } from '../utils/storage';

const router = useRouter();
const { cartWithProducts, cartTotal, deliveryFee, finalTotal, initCart, emptyCart } = useCart();
const { user } = useAuth();
const { createOrder } = useOrders();

const loading = ref(false);
const couponCode = ref('');
const couponMessage = ref('');
const couponValid = ref(false);
const discount = ref(0);

const form = reactive({
  name: '',
  email: '',
  address: '',
  phone: '',
  paymentMethod: 'cash',
  cardNumber: '',
  expiry: '',
  cvv: ''
});

const applyCoupon = () => {
  const validCoupons: Record<string, number> = {
    'SAVE10': 10,
    'HAPPY20': 20,
    'WELCOME15': 15
  };
  
  const code = couponCode.value.toUpperCase();
  if (validCoupons[code]) {
    discount.value = (cartTotal.value * validCoupons[code]) / 100;
    couponMessage.value = `🎉 Coupon applied! You save $${discount.value.toFixed(2)}`;
    couponValid.value = true;
  } else {
    couponMessage.value = '❌ Invalid coupon code';
    couponValid.value = false;
    discount.value = 0;
  }
};

const finalTotalWithDiscount = computed(() => {
  return finalTotal.value - discount.value;
});

const handleCheckout = async () => {
  if (!form.address.trim()) {
    alert('Please enter a delivery address');
    return;
  }
  
  loading.value = true;
  
  try {
    const items = cartWithProducts.value.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }));
    
    const order = await createOrder(
      items,
      form.address,
      cartTotal.value,
      deliveryFee.value
    );
    
    if (order) {
      emptyCart();
      router.push('/orders');
    } else {
      alert('Failed to create order. Please try again.');
    }
  } catch (e) {
    alert('An error occurred. Please try again.');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  initCart();
  
  // Pre-fill form with user data
  const session = getSession();
  if (session) {
    form.name = session.name;
    form.email = session.email;
  }
});
</script>

<style scoped>
.checkout-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.checkout-page h1 {
  margin-bottom: 30px;
  color: var(--text-color);
}

.empty-cart {
  text-align: center;
  padding: 60px;
}

.empty-cart span {
  font-size: 4rem;
  display: block;
}

.checkout-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 30px;
}

/* Checkout Form */
.checkout-form {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 25px;
}

.checkout-form h2 {
  margin-bottom: 20px;
  color: var(--text-color);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--text-color);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-color);
  color: var(--text-color);
  font-size: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

/* Payment Methods */
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 25px;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.payment-option:has(input:checked) {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.payment-option input {
  width: auto;
}

/* Card Details */
.card-details {
  margin-bottom: 25px;
  padding: 15px;
  background: var(--bg-color);
  border-radius: 8px;
}

/* Coupon */
.coupon-section {
  margin-bottom: 25px;
}

.coupon-section label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}

.coupon-input {
  display: flex;
  gap: 10px;
}

.coupon-input input {
  flex: 1;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-color);
  color: var(--text-color);
}

.coupon-input button {
  padding: 12px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.coupon-message {
  margin-top: 10px;
  padding: 10px;
  border-radius: 8px;
  font-weight: 600;
}

.coupon-message.valid {
  background: #d1fae5;
  color: #065f46;
}

.coupon-message.invalid {
  background: #fee2e2;
  color: #991b1b;
}

.btn-place-order {
  width: 100%;
  padding: 15px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-place-order:hover:not(:disabled) {
  background: #059669;
}

.btn-place-order:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Order Summary */
.order-summary {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 25px;
  height: fit-content;
  position: sticky;
  top: 20px;
}

.order-summary h2 {
  margin-bottom: 20px;
  color: var(--text-color);
}

.summary-items {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 20px;
}

.summary-item {
  display: grid;
  grid-template-columns: 30px 1fr auto auto;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-color);
  align-items: center;
}

.item-emoji {
  font-size: 1.2rem;
}

.item-name {
  font-size: 0.9rem;
  color: var(--text-color);
}

.item-qty {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.item-price {
  font-weight: 600;
  color: var(--text-color);
}

.summary-totals {
  border-top: 2px solid var(--border-color);
  padding-top: 15px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
}

.summary-row.discount {
  color: #10b981;
}

.summary-row.total {
  font-size: 1.3rem;
  font-weight: 700;
  color: #667eea;
  padding-top: 15px;
}

@media (max-width: 1024px) {
  .checkout-content {
    grid-template-columns: 1fr;
  }
  
  .order-summary {
    position: static;
  }
}
</style>