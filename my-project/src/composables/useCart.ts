import { ref, computed } from 'vue';
import type { Product, CartItem } from '../types';
import { getCart, setCart, clearCart } from '../utils/storage';
import { getProductById, getProducts } from '../utils/dataUtils';

const cartItems = ref<CartItem[]>([]);
const cartProducts = ref<Map<string, Product>>(new Map());
const loading = ref(false);

// Initialize cart from localStorage
export function initCart() {
  cartItems.value = getCart();
  loadCartProducts();
}

// Load product details for cart items
async function loadCartProducts() {
  loading.value = true;
  const productsMap = new Map<string, Product>();
  
  for (const item of cartItems.value) {
    const product = await getProductById(item.productId);
    if (product) {
      productsMap.set(item.productId, product);
    }
  }
  
  cartProducts.value = productsMap;
  loading.value = false;
}

// Add to cart
const addToCart = (productId: string, quantity: number = 1) => {
  const existingItem = cartItems.value.find(item => item.productId === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cartItems.value.push({ productId, quantity });
  }
  
  setCart(cartItems.value);
};

// Remove from cart
const removeFromCart = (productId: string) => {
  cartItems.value = cartItems.value.filter(item => item.productId !== productId);
  setCart(cartItems.value);
};

// Update quantity
const updateQuantity = (productId: string, quantity: number) => {
  const item = cartItems.value.find(item => item.productId === productId);
  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = quantity;
      setCart(cartItems.value);
    }
  }
};

// Clear cart
const emptyCart = () => {
  cartItems.value = [];
  clearCart();
};

// Get cart item count
const itemCount = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.quantity, 0);
});

// Get cart total
const cartTotal = computed(() => {
  let total = 0;
  for (const item of cartItems.value) {
    const product = cartProducts.value.get(item.productId);
    if (product) {
      total += product.price * item.quantity;
    }
  }
  return total;
});

// Get delivery fee
const deliveryFee = computed(() => {
  return cartTotal.value > 200 ? 0 : 15;
});

// Get final total
const finalTotal = computed(() => {
  return cartTotal.value + deliveryFee.value;
});

// Get cart items with product details
const cartWithProducts = computed(() => {
  return cartItems.value.map(item => {
    const product = cartProducts.value.get(item.productId);
    return {
      ...item,
      product
    };
  }).filter(item => item.product);
});

export function useCart() {
  return {
    cartItems,
    cartProducts,
    loading,
    itemCount,
    cartTotal,
    deliveryFee,
    finalTotal,
    cartWithProducts,
    addToCart,
    removeFromCart,
    updateQuantity,
    emptyCart,
    initCart
  };
}