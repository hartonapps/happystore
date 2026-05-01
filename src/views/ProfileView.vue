<template>
  <div class="profile-page">
    <h1>👤 My Profile</h1>
    
    <div v-if="!user" class="not-logged-in">
      <p>Please <router-link to="/login">login</router-link> to view your profile.</p>
    </div>
    
    <div v-else class="profile-content">
      <!-- Profile Info -->
      <div class="profile-card">
        <div class="profile-avatar">{{ user.name.charAt(0) }}</div>
        <h2>{{ user.name }}</h2>
        <p class="email">{{ user.email }}</p>
        <span class="role-badge" :class="user.role">{{ user.role }}</span>
      </div>
      
      <!-- Account Details -->
      <div class="details-section">
        <h3>Account Details</h3>
        
        <div class="detail-item">
          <span class="label">Name</span>
          <span class="value">{{ user.name }}</span>
        </div>
        
        <div class="detail-item">
          <span class="label">Email</span>
          <span class="value">{{ user.email }}</span>
        </div>
        
        <div class="detail-item">
          <span class="label">Address</span>
          <span class="value">{{ user.address }}</span>
        </div>
        
        <div class="detail-item">
          <span class="label">Member Since</span>
          <span class="value">{{ user.createdAt }}</span>
        </div>
      </div>
      
      <!-- Quick Actions -->
      <div class="quick-actions">
        <h3>Quick Actions</h3>
        <div class="actions-grid">
          <router-link to="/orders" class="action-card">
            <span class="action-icon">📦</span>
            <span>My Orders</span>
          </router-link>
          <router-link to="/cart" class="action-card">
            <span class="action-icon">🛒</span>
            <span>My Cart</span>
          </router-link>
          <router-link to="/products" class="action-card">
            <span class="action-icon">🛍️</span>
            <span>Continue Shopping</span>
          </router-link>
          <button @click="handleLogout" class="action-card logout">
            <span class="action-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const { user, initAuth, logout } = useAuth();

const handleLogout = () => {
  logout();
  router.push('/');
};

onMounted(() => {
  initAuth();
});
</script>

<style scoped>
.profile-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.profile-page h1 {
  margin-bottom: 30px;
  color: var(--text-color);
}

.not-logged-in {
  text-align: center;
  padding: 60px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
}

.not-logged-in a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

/* Profile Card */
.profile-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 30px;
  text-align: center;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 auto 15px;
}

.profile-card h2 {
  color: var(--text-color);
  margin-bottom: 5px;
}

.email {
  color: var(--text-secondary);
  margin-bottom: 15px;
}

.role-badge {
  display: inline-block;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
}

.role-badge.user {
  background: #dbeafe;
  color: #1e40af;
}

.role-badge.admin {
  background: #fef3c7;
  color: #92400e;
}

/* Details Section */
.details-section {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 25px;
}

.details-section h3 {
  margin-bottom: 20px;
  color: var(--text-color);
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid var(--border-color);
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item .label {
  color: var(--text-secondary);
}

.detail-item .value {
  font-weight: 600;
  color: var(--text-color);
}

/* Quick Actions */
.quick-actions {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 25px;
}

.quick-actions h3 {
  margin-bottom: 20px;
  color: var(--text-color);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  text-decoration: none;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s;
}

.action-card:hover {
  border-color: #667eea;
  transform: translateY(-2px);
}

.action-card.logout:hover {
  border-color: #ef4444;
  color: #ef4444;
}

.action-icon {
  font-size: 2rem;
}
</style>