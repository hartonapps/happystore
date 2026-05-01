<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { useAuth } from './composables/useAuth';
import { useCart } from './composables/useCart';
import { getTheme, setTheme } from './utils/storage';

const { user, isLoggedIn, isAdmin, initAuth, logout } = useAuth();
const { itemCount, initCart } = useCart();

const isDark = ref(false);
const showMobileMenu = ref(false);

const toggleTheme = () => {
  isDark.value = !isDark.value;
  setTheme(isDark.value ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light');
};

const handleLogout = () => {
  logout();
};

onMounted(async () => {
  const theme = getTheme();
  isDark.value = theme === 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  await initAuth();
  initCart();
});
</script>

<template>
  <div class="app" :class="{ dark: isDark }">
    <header class="header">
      <div class="header-content">
        <router-link to="/" class="logo">🛍️ HappyStore</router-link>
        
        <nav class="nav-desktop">
          <router-link to="/">Home</router-link>
          <router-link to="/products">Products</router-link>
          <router-link to="/cart" class="cart-link">
            Cart 🛒<span v-if="itemCount > 0" class="cart-badge">{{ itemCount }}</span>
          </router-link>
        </nav>
        
        <div class="header-actions">
          <button @click="toggleTheme" class="theme-toggle">{{ isDark ? '☀️' : '🌙' }}</button>
          <template v-if="isLoggedIn">
            <router-link to="/profile" class="user-menu">👤 {{ user?.name }}</router-link>
            <button @click="handleLogout" class="btn-logout">Logout</button>
          </template>
          <template v-else>
            <router-link to="/login" class="btn-login">Login</router-link>
            <router-link to="/register" class="btn-register">Register</router-link>
          </template>
        </div>
        
        <button @click="showMobileMenu = !showMobileMenu" class="mobile-menu-btn">
          {{ showMobileMenu ? '✕' : '☰' }}
        </button>
      </div>
      
      <div v-if="showMobileMenu" class="mobile-menu">
        <router-link to="/" @click="showMobileMenu = false">Home</router-link>
        <router-link to="/products" @click="showMobileMenu = false">Products</router-link>
        <router-link to="/cart" @click="showMobileMenu = false">Cart <span v-if="itemCount > 0">({{ itemCount }})</span></router-link>
        <template v-if="isLoggedIn">
          <router-link to="/profile" @click="showMobileMenu = false">Profile</router-link>
          <router-link to="/orders" @click="showMobileMenu = false">My Orders</router-link>
          <router-link v-if="isAdmin" to="/admin" @click="showMobileMenu = false">Admin</router-link>
          <button @click="handleLogout; showMobileMenu = false">Logout</button>
        </template>
        <template v-else>
          <router-link to="/login" @click="showMobileMenu = false">Login</router-link>
          <router-link to="/register" @click="showMobileMenu = false">Register</router-link>
        </template>
      </div>
    </header>

    <main class="main"><RouterView /></main>

    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h4>🛍️ HappyStore</h4>
          <p>Your one-stop shop for everything you need!</p>
        </div>
        <div class="footer-section">
          <h4>Quick Links</h4>
          <router-link to="/products">All Products</router-link>
          <router-link to="/cart">Shopping Cart</router-link>
          <router-link to="/orders">Track Order</router-link>
        </div>
        <div class="footer-section">
          <h4>Account</h4>
          <router-link to="/login">Login</router-link>
          <router-link to="/register">Register</router-link>
          <router-link v-if="isAdmin" to="/admin">Admin Panel</router-link>
        </div>
        <div class="footer-section">
          <h4>Contact</h4>
          <p>📧 support@happystore.com</p>
          <p>📞 +234 800 123 4567</p>
        </div>
      </div>
      <div class="footer-bottom"><p>© 2026 HappyStore. All rights reserved.</p></div>
    </footer>
  </div>
</template>

<style>
:root {
  --bg-color: #ffffff;
  --card-bg: #ffffff;
  --text-color: #1f2937;
  --text-secondary: #6b7280;
  --border-color: #e5e7eb;
  --primary-color: #667eea;
}
[data-theme="dark"], .dark {
  --bg-color: #1f2937;
  --card-bg: #374151;
  --text-color: #f9fafb;
  --text-secondary: #9ca3af;
  --border-color: #4b5563;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--bg-color); color: var(--text-color); line-height: 1.6; }
a { color: var(--primary-color); text-decoration: none; }
button { font-family: inherit; }
</style>

<style scoped>
.app { min-height: 100vh; display: flex; flex-direction: column; background: var(--bg-color); }
.header { background: var(--card-bg); border-bottom: 1px solid var(--border-color); position: sticky; top: 0; z-index: 100; }
.header-content { max-width: 1400px; margin: 0 auto; padding: 15px 20px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.logo { font-size: 1.5rem; font-weight: 700; color: var(--text-color); }
.nav-desktop { display: flex; gap: 25px; }
.nav-desktop a { color: var(--text-color); font-weight: 500; }
.nav-desktop a:hover { color: var(--primary-color); }
.cart-link { position: relative; }
.cart-badge { position: absolute; top: -8px; right: -12px; background: #ef4444; color: white; font-size: 0.7rem; padding: 2px 6px; border-radius: 10px; font-weight: 700; }
.header-actions { display: flex; align-items: center; gap: 15px; }
.theme-toggle { background: none; border: 1px solid var(--border-color); border-radius: 8px; padding: 8px 12px; font-size: 1.2rem; cursor: pointer; }
.user-menu { color: var(--text-color); font-weight: 500; }
.btn-logout { padding: 8px 16px; background: #ef4444; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; }
.btn-login { padding: 8px 16px; background: var(--primary-color); color: white; border-radius: 8px; font-weight: 500; }
.btn-register { padding: 8px 16px; background: transparent; border: 1px solid var(--primary-color); color: var(--primary-color); border-radius: 8px; font-weight: 500; }
.mobile-menu-btn { display: none; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-color); }
.mobile-menu { display: none; flex-direction: column; padding: 15px 20px; border-top: 1px solid var(--border-color); background: var(--card-bg); }
.mobile-menu a, .mobile-menu button { padding: 12px; color: var(--text-color); border-bottom: 1px solid var(--border-color); }
.main { flex: 1; padding: 20px; }
.footer { background: var(--card-bg); border-top: 1px solid var(--border-color); margin-top: auto; }
.footer-content { max-width: 1400px; margin: 0 auto; padding: 40px 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 30px; }
.footer-section h4 { margin-bottom: 15px; }
.footer-section p { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 8px; }
.footer-section a { display: block; color: var(--text-secondary); margin-bottom: 8px; font-size: 0.9rem; }
.footer-bottom { border-top: 1px solid var(--border-color); padding: 20px; text-align: center; color: var(--text-secondary); font-size: 0.9rem; }
@media (max-width: 768px) {
  .nav-desktop, .header-actions { display: none; }
  .mobile-menu-btn { display: block; }
  .mobile-menu { display: flex; }
}
</style>
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background 0.2s;
}

.theme-toggle:hover {
  background: var(--bg-color);
}

.user-menu {
  color: var(--text-color);
  font-weight: 500;
}

.btn-logout {
  padding: 8px 16px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}

.btn-login {
  padding: 8px 16px;
  background: var(--primary-color);
  color: white;
  border-radius: 8px;
  font-weight: 500;
}

.btn-register {
  padding: 8px 16px;
  background: transparent;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  border-radius: 8px;
  font-weight: 500;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-color);
}

.mobile-menu {
  display: none;
  flex-direction: column;
  padding: 15px 20px;
  border-top: 1px solid var(--border-color);
  background: var(--card-bg);
}

.mobile-menu a,
.mobile-menu button {
  padding: 12px;
  color: var(--text-color);
  text-decoration: none;
  border-bottom: 1px solid var(--border-color);
}

/* Main */
.main {
  flex: 1;
  padding: 20px;
}

/* Footer */
.footer {
  background: var(--card-bg);
  border-top: 1px solid var(--border-color);
  margin-top: auto;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
}

.footer-section h4 {
  margin-bottom: 15px;
  color: var(--text-color);
}

.footer-section p {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.footer-section a {
  display: block;
  color: var(--text-secondary);
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.footer-section a:hover {
  color: var(--primary-color);
}

.footer-bottom {
  border-top: 1px solid var(--border-color);
  padding: 20px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 768px) {
  .nav-desktop,
  .header-actions {
    display: none;
  }
  
  .mobile-menu-btn {
    display: block;
  }
  
  .mobile-menu {
    display: flex;
  }
}
<style>
body {
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
