<template>
  <div class="product-detail">
    <div v-if="loading" class="loading">Loading product...</div>
    <div v-else-if="!product" class="error">Product not found</div>
    <div v-else class="product-content">
      <!-- Product Image -->
      <div class="product-image">
        <div class="emoji-large">{{ product.emoji }}</div>
      </div>

      <!-- Product Info -->
      <div class="product-info">
        <router-link to="/products" class="back-link">← Back to Products</router-link>
        
        <span class="category-badge">{{ product.category }}</span>
        
        <h1>{{ product.name }}</h1>
        
        <div class="rating">
          <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= Math.round(product.rating) }">⭐</span>
          <span class="rating-value">{{ product.rating }}</span>
        </div>
        
        <div class="price">${{ product.price }}</div>
        
        <p class="description">{{ product.description }}</p>
        
        <div class="stock">
          <span :class="{ 'in-stock': product.stock > 0, 'out-of-stock': product.stock === 0 }">
            {{ product.stock > 0 ? `✓ In Stock (${product.stock} available)` : '✗ Out of Stock' }}
          </span>
        </div>

        <!-- Quantity -->
        <div class="quantity-selector">
          <label>Quantity:</label>
          <div class="quantity-controls">
            <button @click="quantity > 1 && quantity--">-</button>
            <span>{{ quantity }}</span>
            <button @click="quantity < product.stock && quantity++">+</button>
          </div>
        </div>

        <!-- Actions -->
        <div class="actions">
          <button 
            @click="handleAddToCart" 
            class="btn-add-to-cart"
            :disabled="product.stock === 0"
          >
            🛒 Add to Cart
          </button>
          <button @click="toggleWishlist" class="btn-wishlist">
            {{ isInWishlist ? '❤️ Remove from Wishlist' : '🤍 Add to Wishlist' }}
          </button>
        </div>

        <!-- Reviews Section -->
        <div class="reviews-section">
          <h2>📝 Reviews</h2>
          
          <div v-if="reviews.length === 0" class="no-reviews">
            <p>No reviews yet. Be the first to review!</p>
          </div>
          
          <div v-else class="reviews-list">
            <div v-for="review in reviews" :key="review.id" class="review-card">
              <div class="review-header">
                <span class="reviewer-name">{{ review.userName }}</span>
                <span class="review-rating">⭐ {{ review.rating }}/5</span>
              </div>
              <p class="review-comment">{{ review.comment }}</p>
              <span class="review-date">{{ review.createdAt }}</span>
            </div>
          </div>

          <!-- Add Review Form -->
          <div v-if="isLoggedIn" class="add-review">
            <h3>Write a Review</h3>
            <div class="rating-input">
              <button 
                v-for="n in 5" 
                :key="n"
                @click="newReview.rating = n"
                :class="{ filled: n <= newReview.rating }"
              >
                ⭐
              </button>
            </div>
            <textarea 
              v-model="newReview.comment" 
              placeholder="Share your experience with this product..."
              rows="3"
            ></textarea>
            <button @click="submitReview" class="btn-submit-review">Submit Review</button>
          </div>
          <div v-else class="login-to-review">
            <router-link to="/login">Login</router-link> to write a review
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProducts } from '../composables/useProducts';
import { useCart } from '../composables/useCart';
import { useAuth } from '../composables/useAuth';
import { getWishlist, addToWishlist as addToWishlistStorage, removeFromWishlist } from '../utils/storage';
import { getReviewsByProductId, createReview as createReviewData, generateId } from '../utils/dataUtils';
import type { Review } from '../types';

const route = useRoute();
const router = useRouter();
const { getProduct } = useProducts();
const { addToCart } = useCart();
const { user, isLoggedIn } = useAuth();

const product = ref<any>(null);
const loading = ref(true);
const quantity = ref(1);
const reviews = ref<Review[]>([]);
const wishlist = ref<string[]>([]);

const newReview = ref({
  rating: 5,
  comment: ''
});

const isInWishlist = computed(() => {
  return wishlist.value.includes(product.value?.id || '');
});

const handleAddToCart = () => {
  if (product.value) {
    addToCart(product.value.id, quantity.value);
    alert('Added to cart!');
  }
};

const toggleWishlist = () => {
  if (!product.value) return;
  
  if (isInWishlist.value) {
    removeFromWishlist(product.value.id);
  } else {
    addToWishlistStorage(product.value.id);
  }
  wishlist.value = getWishlist();
};

const submitReview = async () => {
  if (!product.value || !user.value || !newReview.value.comment.trim()) return;
  
  const review: Review = {
    id: generateId('r'),
    userId: user.value.id,
    userName: user.value.name,
    productId: product.value.id,
    rating: newReview.value.rating,
    comment: newReview.value.comment,
    createdAt: new Date().toISOString().split('T')[0]
  };
  
  // Save to localStorage
  const storedReviews = localStorage.getItem('reviews');
  const allReviews: Review[] = storedReviews ? JSON.parse(storedReviews) : [];
  allReviews.push(review);
  localStorage.setItem('reviews', JSON.stringify(allReviews));
  
  reviews.value.push(review);
  newReview.value = { rating: 5, comment: '' };
};

onMounted(async () => {
  const productId = route.params.id as string;
  
  try {
    product.value = await getProduct(productId);
    
    if (product.value) {
      // Load reviews
      const storedReviews = localStorage.getItem('reviews');
      if (storedReviews) {
        const allReviews = JSON.parse(storedReviews);
        reviews.value = allReviews.filter((r: Review) => r.productId === productId);
      }
      
      // Load wishlist
      wishlist.value = getWishlist();
    }
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.product-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.loading, .error {
  text-align: center;
  padding: 60px;
  color: var(--text-secondary);
}

.product-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

/* Product Image */
.product-image {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 40px;
}

.emoji-large {
  font-size: 12rem;
}

/* Product Info */
.product-info {
  padding: 20px 0;
}

.back-link {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
}

.category-badge {
  display: inline-block;
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  margin: 10px 0;
}

.product-info h1 {
  font-size: 2rem;
  margin: 10px 0;
  color: var(--text-color);
}

.rating {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 15px;
}

.star {
  opacity: 0.3;
}

.star.filled {
  opacity: 1;
}

.rating-value {
  margin-left: 10px;
  color: #f59e0b;
  font-weight: 600;
}

.price {
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 20px;
}

.description {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 20px;
}

.stock {
  margin-bottom: 20px;
}

.stock span {
  font-weight: 600;
}

.in-stock {
  color: #10b981;
}

.out-of-stock {
  color: #ef4444;
}

/* Quantity */
.quantity-selector {
  margin-bottom: 20px;
}

.quantity-selector label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.quantity-controls button {
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--card-bg);
  color: var(--text-color);
  font-size: 1.2rem;
  cursor: pointer;
}

.quantity-controls button:hover {
  background: #667eea;
  color: white;
}

.quantity-controls span {
  font-size: 1.2rem;
  font-weight: 600;
  min-width: 30px;
  text-align: center;
}

/* Actions */
.actions {
  display: flex;
  gap: 15px;
  margin-bottom: 40px;
}

.btn-add-to-cart {
  flex: 1;
  padding: 15px 30px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-add-to-cart:hover:not(:disabled) {
  background: #5568d3;
}

.btn-add-to-cart:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-wishlist {
  padding: 15px 20px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-wishlist:hover {
  border-color: #ef4444;
  color: #ef4444;
}

/* Reviews */
.reviews-section {
  border-top: 1px solid var(--border-color);
  padding-top: 30px;
}

.reviews-section h2 {
  margin-bottom: 20px;
  color: var(--text-color);
}

.no-reviews {
  text-align: center;
  padding: 30px;
  color: var(--text-secondary);
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.review-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 15px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.reviewer-name {
  font-weight: 600;
  color: var(--text-color);
}

.review-rating {
  color: #f59e0b;
}

.review-comment {
  color: var(--text-color);
  margin-bottom: 10px;
}

.review-date {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* Add Review */
.add-review {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
}

.add-review h3 {
  margin-bottom: 15px;
  color: var(--text-color);
}

.rating-input {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.rating-input button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.3;
  transition: opacity 0.2s;
}

.rating-input button.filled {
  opacity: 1;
}

.add-review textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-color);
  color: var(--text-color);
  resize: vertical;
  margin-bottom: 15px;
}

.btn-submit-review {
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.login-to-review {
  text-align: center;
  padding: 20px;
  color: var(--text-secondary);
}

.login-to-review a {
  color: #667eea;
}

@media (max-width: 768px) {
  .product-content {
    grid-template-columns: 1fr;
  }
  
  .emoji-large {
    font-size: 8rem;
  }
  
  .actions {
    flex-direction: column;
  }
}
</style>