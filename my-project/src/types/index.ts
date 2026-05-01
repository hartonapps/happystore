// User type
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  address: string;
  createdAt: string;
}

// Product type
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  emoji: string;
  stock: number;
  rating: number;
}

// Cart item type
export interface CartItem {
  productId: string;
  quantity: number;
}

// Cart type
export interface Cart {
  userId: string;
  items: CartItem[];
}

// Order item type
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
}

// Order type
export interface Order {
  orderId: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'processing' | 'packed' | 'shipped' | 'delivered';
  deliveryAddress: string;
  createdAt: string;
}

// Review type
export interface Review {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// Wishlist item type
export interface WishlistItem {
  productId: string;
  addedAt: string;
}

// Category type
export type Category = 'Electronics' | 'Fashion' | 'Food' | 'Gaming' | 'Home';

// Order status type
export type OrderStatus = 'processing' | 'packed' | 'shipped' | 'delivered';

// Auth session type
export interface AuthSession {
  user: User;
  token: string;
}