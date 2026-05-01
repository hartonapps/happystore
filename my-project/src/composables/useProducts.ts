import { ref, computed } from 'vue';
import type { Product } from '../types';
import { getProducts, getProductById, searchProducts as searchProductsData } from '../utils/dataUtils';

const products = ref<Product[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

// Search query
const searchQuery = ref('');

// Filters
const selectedCategory = ref<string>('all');
const priceRange = ref<[number, number]>([0, 1000]);
const minRating = ref<number>(0);

// Categories
const categories = ['Electronics', 'Fashion', 'Food', 'Gaming', 'Home'];

// Load all products
const loadProducts = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    products.value = await getProducts();
  } catch (e) {
    error.value = 'Failed to load products';
  } finally {
    loading.value = false;
  }
};

// Search products
const searchProducts = async (query: string) => {
  searchQuery.value = query;
  
  if (!query) {
    await loadProducts();
    return;
  }
  
  loading.value = true;
  try {
    products.value = await searchProductsData(query);
  } catch (e) {
    error.value = 'Search failed';
  } finally {
    loading.value = false;
  }
};

// Filter by category
const filterByCategory = async (category: string) => {
  selectedCategory.value = category;
  await loadProducts();
  
  if (category !== 'all') {
    products.value = products.value.filter(p => p.category === category);
  }
};

// Apply all filters
const applyFilters = async () => {
  await loadProducts();
  
  let filtered = [...products.value];
  
  // Category filter
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(p => p.category === selectedCategory.value);
  }
  
  // Price filter
  filtered = filtered.filter(p => 
    p.price >= priceRange.value[0] && p.price <= priceRange.value[1]
  );
  
  // Rating filter
  if (minRating.value > 0) {
    filtered = filtered.filter(p => p.rating >= minRating.value);
  }
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
  }
  
  products.value = filtered;
};

// Reset filters
const resetFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = 'all';
  priceRange.value = [0, 1000];
  minRating.value = 0;
  loadProducts();
};

// Get product by ID
const getProduct = async (id: string): Promise<Product | undefined> => {
  return await getProductById(id);
};

// Get featured products (top rated)
const featuredProducts = computed(() => {
  return [...products.value]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8);
});

// Get products by category
const productsByCategory = computed(() => {
  const grouped: Record<string, Product[]> = {};
  
  for (const product of products.value) {
    if (!grouped[product.category]) {
      grouped[product.category] = [];
    }
    grouped[product.category].push(product);
  }
  
  return grouped;
});

export function useProducts() {
  return {
    products,
    loading,
    error,
    searchQuery,
    selectedCategory,
    priceRange,
    minRating,
    categories,
    loadProducts,
    searchProducts,
    filterByCategory,
    applyFilters,
    resetFilters,
    getProduct,
    featuredProducts,
    productsByCategory
  };
}