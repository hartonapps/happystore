<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <span class="logo">🛍️</span>
        <h1>Create Account</h1>
        <p>Join HappyStore today</p>
      </div>
      
      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label>Full Name</label>
          <input 
            v-model="form.name" 
            type="text" 
            placeholder="Enter your full name"
            required
          />
        </div>
        
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
            placeholder="Create a password"
            required
            minlength="6"
          />
        </div>
        
        <div class="form-group">
          <label>Address</label>
          <textarea 
            v-model="form.address" 
            placeholder="Enter your delivery address"
            rows="2"
            required
          ></textarea>
        </div>
        
        <p v-if="error" class="error-message">{{ error }}</p>
        
        <button type="submit" class="btn-submit" :disabled="loading">
          {{ loading ? 'Creating account...' : 'Create Account' }}
        </button>
      </form>
      
      <div class="auth-footer">
        <p>Already have an account? <router-link to="/login">Sign in</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const { register, loading, error } = useAuth();

const form = reactive({
  name: '',
  email: '',
  password: '',
  address: ''
});

const handleRegister = async () => {
  const success = await register(
    form.name,
    form.email,
    form.password,
    form.address
  );
  
  if (success) {
    router.push('/');
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
  max-width: 450px;
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

.form-group input,
.form-group textarea {
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
</style>