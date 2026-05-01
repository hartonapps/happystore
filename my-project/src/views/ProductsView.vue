<template>
  <div class="products-page">
    <div class="header">
      <h1>🛍️ All Products</h1>
      <div class="search-bar">
        <input 
          v-model="search" 
          type="text" 
          placeholder="Search products..."
          @input="handleSearch"
        />
        <span class="search-icon">🔍</span>
      </div>
    </div>

    <div class="content">
      <!-- Filters Sidebar -->
      <aside class="filters">
        <h3>Filters</h3>
        
        <div class="filter-group">
          <h4>Category</h4>
          <select v-model="selectedCategory" @change="applyFilters">
            <option value="all">All Categories</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>

        <div class="filter-group">
          <h4>Price Range</h4>
          <div class="price-inputs">
            <input 
              v-model.number="priceMin" 
              type="number" 
              placeholder="Min"
              @input="applyFilters"
            />
            <span>-</span>
            <input 
              v-model.number="priceMax" 
              type="number" 
              placeholder="Max"
              @input="applyFilters"
            />
          </div>
        </div>

        <div class="filter-group">
          <h4>Minimum Rating</h4>
          <div class="rating-filter">
            <button 
              v-for="rating in [0, 3, 4, 4.5]" 
              :key="rating"
              :class="{ active: minRating === rating }"
              @click="setMinRating(rating)"
            >
              {{ rating === 0 ? 'All' : `${rating}+` }} ⭐
            </button>
          </div>
        </div>

        <button class="btn-reset" @click="resetFilters">Reset Filters</button>
      </aside>

      <!-- Products Grid -->
      <main class="products-grid-container">
        <div class="products-header">
          <span>{{ filteredProducts.length }} products found</span>
        </div>

        <div v-if="loading" class="loading">Loading products...</div>
        <div v-else-if="filteredProducts.length === 0" class="empty">
          <span>🔍</span>
          <p>No products found matching your criteria</p>
        </div>
        <div v-else class="products-grid">
          <div 
            v-for="product in filteredProducts" 
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
            <button @click="addToCart(product.id)" class="btn-add-cart">
              Add to Cart
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProducts } from '../composables/useProducts';
import { useCart } from '../composables/useCart';
import type { Product } from '../types';

const route = useRoute();
const { products, loading, loadProducts, categories } = useProducts();
const { addToCart } = useCart();

const search = ref('');
const selectedCategory = ref('all');
const priceMin = ref<number | undefined>(undefined);
const priceMax = ref<number | undefined>(undefined);
const minRating = ref(0);

const filteredProducts = computed(() => {
  let result = [...products.value];
  
  // Search filter
  if (search.value) {
    const query = search.value.toLowerCase();
    result = result.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
  }
  
  // Category filter
  if (selectedCategory.value !== 'all') {
    result = result.filter(p => p.category === selectedCategory.value);
  }
  
  // Price filter
  if (priceMin.value !== undefined) {
    result = result.filter(p => p.price >= priceMin.value!);
  }
  if (priceMax.value !== undefined) {
    result = result.filter(p => p.price <= priceMax.value!);
  }
  
  // Rating filter
  if (minRating.value > 0) {
    result = result.filter(p => p.rating >= minRating.value);
  }
  
  return result;
});

const handleSearch = () => {
  // Debounce could be added here
};

const applyFilters = () => {
  // Filters are applied via computed
};

const setMinRating = (rating: number) => {
  minRating.value = rating;
};

const resetFilters = () => {
  search.value = '';
  selectedCategory.value = 'all';
  priceMin.value = undefined;
  priceMax.value = undefined;
  minRating.value = 0;
};

onMounted(async () => {
  await loadProducts();
  
  // Check for category in query params
  const category = route.query.category as string;
  if (category) {
    selectedCategory.value = category;
  }
});
</script>

<style scoped>
.products-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.header h1 {
  color: var(--text-color);
}

.search-bar {
  position: relative;
  width: 300px;
}

.search-bar input {
  width: 100%;
  padding: 12px 40px 12px 15px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--card-bg);
  color: var(--text-color);
}

.search-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
}

.content {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 30px;
}

/* Filters */
.filters {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  height: fit-content;
  position: sticky;
  top: 20px;
}

.filters h3 {
  margin-bottom: 20px;
  color: var(--text-color);
}

.filter-group {
  margin-bottom: 20px;
}

.filter-group h4 {
  margin-bottom: 10px;
  color: var(--text-color);
  font-size: 0.9rem;
}

.filter-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-color);
  color: var(--text-color);
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
}

.price-inputs input {
  width: 80px;
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-color);
  color: var(--text-color);
}

.rating-filter {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rating-filter button {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-color);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s;
}

.rating-filter button.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.btn-reset {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 6px;
  background: #ef4444;
  color: white;
  cursor: pointer;
  font-weight: 600;
}

/* Products Grid */
.products-header {
  margin-bottom: 20px;
  color: var(--text-secondary);
}

.products-grid {
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

.loading, .empty {
  text-align: center;
  padding: 60px;
  color: var(--text-secondary);
}

.empty span {
  font-size: 4rem;
  display: block;
  margin-bottom: 15px;
}

@media (max-width: 1024px) {
  .content {
    grid-template-columns: 1fr;
  }
  
  .filters {
    position: static;
  }
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-bar {
    width: 100%;
  }
}
</style>