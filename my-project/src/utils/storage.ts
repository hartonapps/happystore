// Storage utility functions

const STORAGE_KEYS = {
  SESSION: 'happystore_session',
  CART: 'happystore_cart',
  WISHLIST: 'happystore_wishlist',
  THEME: 'happystore_theme',
  RECENTLY_VIEWED: 'happystore_recent'
} as const;

// Session storage
export function getSession(): { userId: string; email: string; name: string; role: string } | null {
  const session = localStorage.getItem(STORAGE_KEYS.SESSION);
  return session ? JSON.parse(session) : null;
}

export function setSession(user: { id: string; email: string; name: string; role: string }): void {
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  }));
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}

// Cart storage
export function getCart(): { productId: string; quantity: number }[] {
  const cart = localStorage.getItem(STORAGE_KEYS.CART);
  return cart ? JSON.parse(cart) : [];
}

export function setCart(items: { productId: string; quantity: number }[]): void {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
}

export function clearCart(): void {
  localStorage.removeItem(STORAGE_KEYS.CART);
}

// Wishlist storage
export function getWishlist(): string[] {
  const wishlist = localStorage.getItem(STORAGE_KEYS.WISHLIST);
  return wishlist ? JSON.parse(wishlist) : [];
}

export function setWishlist(productIds: string[]): void {
  localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(productIds));
}

export function addToWishlist(productId: string): void {
  const wishlist = getWishlist();
  if (!wishlist.includes(productId)) {
    wishlist.push(productId);
    setWishlist(wishlist);
  }
}

export function removeFromWishlist(productId: string): void {
  const wishlist = getWishlist().filter(id => id !== productId);
  setWishlist(wishlist);
}

// Theme storage (dark mode)
export function getTheme(): 'light' | 'dark' {
  const theme = localStorage.getItem(STORAGE_KEYS.THEME);
  return (theme as 'light' | 'dark') || 'light';
}

export function setTheme(theme: 'light' | 'dark'): void {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
}

// Recently viewed products
export function getRecentlyViewed(): string[] {
  const recent = localStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED);
  return recent ? JSON.parse(recent) : [];
}

export function addRecentlyViewed(productId: string): void {
  let recent = getRecentlyViewed();
  // Remove if already exists
  recent = recent.filter(id => id !== productId);
  // Add to front
  recent.unshift(productId);
  // Keep only last 10
  recent = recent.slice(0, 10);
  localStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(recent));
}