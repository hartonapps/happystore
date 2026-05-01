<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <span class="logo">🛍️</span>
        <h1>Welcome Back!</h1>
        <p>Sign in to continue shopping</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label>Email</label>
          <input 
            v-model="form.email" 
            type="email" 
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div class="form-group">
          <label>Password</label>
          <input 
            v-model="form.password" 
            type="password" 
            placeholder="Enter your password"
            required
          />
        </div>
        
        <p v-if="error" class="error-message">{{ error }}</p>
        
        <button type="submit" class="btn-submit" :disabled="loading">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>
      
      <div class="auth-footer">
        <p>Don't have an account? <router-link to="/register">Create one</router-link></p>
      </div>
      
      <div class="demo-accounts">
        <h3>Demo Accounts</h3>
        <div class="demo-account" @click="fillDemo('user')">
          <span>👤 User:</span>
          <span>user@example.com / 123456</span>
        </div>
        <div class="demo-account" @click="fillDemo('admin')">
          <span>👑 Admin:</span>
          <span>admin@happystore.com / admin123</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const { login, loading, error } = useAuth();

const form = reactive({
  email: '',
  password: ''
});

const handleLogin = async () => {
  const success = await login(form.email, form.password);
  
  if (success) {
    // Redirect based on role
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === form.email);
    
    if (user?.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/');
    }
  }
};

const fillDemo = (type: 'user' | 'admin') => {
  if (type === 'user') {
    form.email = 'user@example.com';
    form.password = '123456';
  } else {
    form.email = 'admin@happystore.com';
    form.password = 'admin123';
  }
};
</script>

<style scoped>
.auth-page {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.auth-container {
  width: 100%;
  max-width: 400px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 40px;
}

.auth-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  font-size: 4rem;
  display: block;
  margin-bottom: 15px;
}

.auth-header h1 {
  color: var(--text-color);
  margin-bottom: 8px;
}

.auth-header p {
  color: var(--text-secondary);
}

.auth-form {
  margin-bottom: 25px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--text-color);
}

.form-group input {
  width: 100%;
  padding: 14px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-color);
  color: var(--text-color);
  font-size: 1rem;
}

.error-message {
  color: #ef4444;
  background: #fee2e2;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 0.9rem;
}

.btn-submit {
  width: 100%;
  padding: 14px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background: #5568d3;
}

.btn-submit:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  color: var(--text-secondary);
}

.auth-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.auth-footer a:hover {
  text-decoration: underline;
}

.demo-accounts {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.demo-accounts h3 {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 15px;
  text-align: center;
}

.demo-account {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  background: var(--bg-color);
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: background 0.2s;
}

.demo-account:hover {
  background: rgba(102, 126, 234, 0.1);
}

.demo-account span:first-child {
  font-weight: 600;
  color: var(--text-color);
}

.demo-account span:last-child {
  color: var(--text-secondary);
  font-size: 0.85rem;
}
</style>