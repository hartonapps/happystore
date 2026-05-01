<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1>🛍️ Welcome to HappyStore</h1>
        <p>Your one-stop shop for everything you need!</p>
        <div class="hero-buttons">
          <router-link to="/products" class="btn btn-primary">Shop Now</router-link>
          <router-link to="/register" class="btn btn-secondary">Create Account</router-link>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="categories">
      <h2>Shop by Category</h2>
      <div class="category-grid">
        <router-link 
          v-for="category in categories" 
          :key="category.name"
          :to="`/products?category=${category.name}`"
          class="category-card"
        >
          <span class="category-emoji">{{ category.emoji }}</span>
          <span class="category-name">{{ category.name }}</span>
        </router-link>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="featured">
      <h2>⭐ Featured Products</h2>
      <div v-if="loading" class="loading">Loading products...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else class="product-grid">
        <div 
          v-for="product in featuredProducts" 
          :key="product.id"
          class="product-card"
        >
          <router-link :to="`/product/${product.id}`">
            <div class="product-emoji">{{ product.emoji }}</div>
            <h3>{{ product.name }}</h3>
            <p class="product-category">{{ product.category }}</p>
            <div class="product-price">${{ product.price }}</div>
            <div class="product-rating">⭐ {{ product.rating }}</div>
          </router-link>
          <button @click="addToCart(product.id)" class="btn-add-cart">Add to Cart</button>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="benefits">
      <div class="benefit">
        <span>🚚</span>
        <h3>Free Shipping</h3>
        <p>On orders over $200</p>
      </div>
      <div class="benefit">
        <span>🔒</span>
        <h3>Secure Payment</h3>
        <p>100% secure checkout</p>
      </div>
      <div class="benefit">
        <span>↩️</span>
        <h3>Easy Returns</h3>
        <p>30-day return policy</p>
      </div>
      <div class="benefit">
        <span>💬</span>
        <h3>24/7 Support</h3>
        <p>Always here to help</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useProducts } from '../composables/useProducts';
import { useCart } from '../composables/useCart';

const { products, loading, error, loadProducts, featuredProducts } = useProducts();
const { addToCart } = useCart();

const categories = [
  { name: 'Electronics', emoji: '📱' },
  { name: 'Fashion', emoji: '👕' },
  { name: 'Food', emoji: '🍔' },
  { name: 'Gaming', emoji: '🎮' },
  { name: 'Home', emoji: '🏠' }
];

onMounted(() => {
  loadProducts();
});
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 20px;
  border-radius: 16px;
  text-align: center;
  margin-bottom: 40px;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 20px;
  opacity: 0.9;
}

.hero-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 30px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn-primary {
  background: white;
  color: #667eea;
}

.btn-secondary {
  background: transparent;
  border: 2px solid white;
  color: white;
}

/* Categories */
.categories {
  margin-bottom: 40px;
}

.categories h2 {
  text-align: center;
  margin-bottom: 20px;
  color: var(--text-color);
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.category-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  text-decoration: none;
  color: var(--text-color);
  transition: transform 0.2s, box-shadow 0.2s;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.category-emoji {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 10px;
}

.category-name {
  font-weight: 600;
}

/* Featured Products */
.featured {
  margin-bottom: 40px;
}

.featured h2 {
  text-align: center;
  margin-bottom: 20px;
  color: var(--text-color);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.product-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.product-card a {
  text-decoration: none;
  color: inherit;
}

.product-emoji {
  font-size: 4rem;
  display: block;
  margin-bottom: 10px;
}

.product-card h3 {
  font-size: 1rem;
  margin: 10px 0 5px;
  color: var(--text-color);
}

.product-category {
  color: var(--text-secondary);
  font-size: 0.85rem;
  margin-bottom: 10px;
}

.product-price {
  font-size: 1.3rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 5px;
}

.product-rating {
  color: #f59e0b;
  font-size: 0.9rem;
}

.btn-add-cart {
  width: 100%;
  margin-top: 15px;
  padding: 10px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-add-cart:hover {
  background: #5568d3;
}

/* Benefits */
.benefits {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 40px;
}

.benefit {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 25px;
  text-align: center;
}

.benefit span {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 10px;
}

.benefit h3 {
  margin-bottom: 5px;
  color: var(--text-color);
}

.benefit p {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0;
}

.loading, .error {
  text-align: center;
  padding: 40px;
  color: var(--text-secondary);
}

.error {
  color: #ef4444;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 1.8rem;
  }
  
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>
