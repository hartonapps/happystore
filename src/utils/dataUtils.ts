import type { User, Product, Order, Review } from '../types';

// Base URL for data files
const DATA_BASE = '/data';

// Helper to fetch JSON data
async function fetchJSON<T>(filename: string): Promise<T> {
  const response = await fetch(`${DATA_BASE}/${filename}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${filename}`);
  }
  return response.json();
}

// Helper to get all data
async function getData<T>(filename: string): Promise<T> {
  try {
    return await fetchJSON<T>(filename);
  } catch {
    return [] as unknown as T;
  }
}

// Users
export async function getUsers(): Promise<User[]> {
  return getData<User[]>('users.json');
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const users = await getUsers();
  return users.find(u => u.email === email);
}

export async function getUserById(id: string): Promise<User | undefined> {
  const users = await getUsers();
  return users.find(u => u.id === id);
}

export async function createUser(user: User): Promise<void> {
  const users = await getUsers<User[]>();
  users.push(user);
  // Note: In a real app, this would write to file via API
  // For now, we store in localStorage as backup
  localStorage.setItem('users', JSON.stringify(users));
}

// Products
export async function getProducts(): Promise<Product[]> {
  return getData<Product[]>('products.json');
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find(p => p.id === id);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const products = await getProducts();
  return products.filter(p => p.category === category);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const products = await getProducts();
  const lowerQuery = query.toLowerCase();
  return products.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.category.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery)
  );
}

// Orders
export async function getOrders(): Promise<Order[]> {
  return getData<Order[]>('orders.json');
}

export async function getOrderById(orderId: string): Promise<Order | undefined> {
  const orders = await getOrders();
  return orders.find(o => o.orderId === orderId);
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  const orders = await getOrders();
  return orders.filter(o => o.userId === userId);
}

export async function createOrder(order: Order): Promise<void> {
  const orders = await getOrders<Order[]>();
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  const orders = await getOrders<Order[]>();
  const index = orders.findIndex(o => o.orderId === orderId);
  if (index !== -1) {
    orders[index].status = status;
    localStorage.setItem('orders', JSON.stringify(orders));
  }
}

// Reviews
export async function getReviews(): Promise<Review[]> {
  return getData<Review[]>('reviews.json');
}

export async function getReviewsByProductId(productId: string): Promise<Review[]> {
  const reviews = await getReviews();
  return reviews.filter(r => r.productId === productId);
}

export async function createReview(review: Review): Promise<void> {
  const reviews = await getReviews<Review[]>();
  reviews.push(review);
  localStorage.setItem('reviews', JSON.stringify(reviews));
}

// Generate unique ID
export function generateId(prefix: string): string {
  return `${prefix}${Date.now()}${Math.random().toString(36).substr(2, 5)}`;
}

// Format price
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

// Format date
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}