<template>
  <div class="admin-page">
    <h1>🧑‍💼 Admin Dashboard</h1>
    
    <div v-if="!isLoggedIn" class="not-authorized">
      <p>Please <router-link to="/login">login</router-link> to access admin panel.</p>
    </div>
    
    <div v-else-if="!isAdmin" class="not-authorized">
      <span>🔒</span>
      <h2>Access Denied</h2>
      <p>You don't have permission to access this page.</p>
    </div>
    
    <div v-else class="admin-content">
      <!-- Admin Tabs -->
      <div class="admin-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['tab-btn', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          {{ tab.icon }} {{ tab.label }}
        </button>
      </div>
      
      <!-- Products Tab -->
      <div v-if="activeTab === 'products'" class="tab-content">
        <div class="tab-header">
          <h2>📦 Products Management</h2>
          <button @click="showProductModal = true" class="btn-add">
            + Add Product
          </button>
        </div>
        
        <div class="products-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id">
                <td>{{ product.id }}</td>
                <td>
                  <span class="product-cell">
                    <span class="emoji">{{ product.emoji }}</span>
                    {{ product.name }}
                  </span>
                </td>
                <td>{{ product.category }}</td>
                <td>${{ product.price }}</td>
                <td>{{ product.stock }}</td>
                <td>⭐ {{ product.rating }}</td>
                <td>
                  <button @click="editProduct(product)" class="btn-edit">Edit</button>
                  <button @click="deleteProduct(product.id)" class="btn-delete">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Orders Tab -->
      <div v-if="activeTab === 'orders'" class="tab-content">
        <div class="tab-header">
          <h2>📋 Orders Management</h2>
        </div>
        
        <div class="orders-table">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in allOrders" :key="order.orderId">
                <td>#{{ order.orderId }}</td>
                <td>
                  <div class="customer-cell">
                    <span>{{ order.userName }}</span>
                    <span class="email">{{ order.userEmail }}</span>
                  </div>
                </td>
                <td>{{ order.items.length }} items</td>
                <td>${{ order.total.toFixed(2) }}</td>
                <td>
                  <select 
                    :value="order.status" 
                    @change="updateOrderStatus(order.orderId, ($event.target as HTMLSelectElement).value)"
                    class="status-select"
                  >
                    <option value="processing">Processing ⏳</option>
                    <option value="packed">Packed 📦</option>
                    <option value="shipped">Shipped 🚚</option>
                    <option value="delivered">Delivered ✅</option>
                  </select>
                </td>
                <td>
                  <button @click="viewOrderDetails(order)" class="btn-view">View</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Users Tab -->
      <div v-if="activeTab === 'users'" class="tab-content">
        <div class="tab-header">
          <h2>👥 Users Management</h2>
        </div>
        
        <div class="users-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <span class="role-badge" :class="user.role">{{ user.role }}</span>
                </td>
                <td>{{ user.createdAt }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- Product Modal -->
    <div v-if="showProductModal" class="modal-overlay" @click.self="closeProductModal">
      <div class="modal">
        <h2>{{ editingProduct ? 'Edit Product' : 'Add New Product' }}</h2>
        
        <form @submit.prevent="saveProduct">
          <div class="form-group">
            <label>Name</label>
            <input v-model="productForm.name" type="text" required />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Price</label>
              <input v-model.number="productForm.price" type="number" required />
            </div>
            <div class="form-group">
              <label>Stock</label>
              <input v-model.number="productForm.stock" type="number" required />
            </div>
          </div>
          
          <div class="form-group">
            <label>Category</label>
            <select v-model="productForm.category" required>
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Emoji</label>
            <input v-model="productForm.emoji" type="text" required placeholder="🎧" />
          </div>
          
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="productForm.description" rows="3" required></textarea>
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="closeProductModal" class="btn-cancel">Cancel</button>
            <button type="submit" class="btn-save">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useAuth } from '../composables/useAuth';
import { useProducts } from '../composables/useProducts';
import { useOrders } from '../composables/useOrders';
import { getUsers } from '../utils/dataUtils';
import type { Product, User, Order, OrderStatus } from '../types';

const { isLoggedIn, isAdmin, initAuth } = useAuth();
const { products, loadProducts } = useProducts();
const { allOrders, loadAllOrders, updateStatus } = useOrders();

const activeTab = ref('products');
const tabs = [
  { id: 'products', label: 'Products', icon: '📦' },
  { id: 'orders', label: 'Orders', icon: '📋' },
  { id: 'users', label: 'Users', icon: '👥' }
];

const categories = ['Electronics', 'Fashion', 'Food', 'Gaming', 'Home'];
const users = ref<User[]>([]);

// Product modal
const showProductModal = ref(false);
const editingProduct = ref<Product | null>(null);
const productForm = reactive({
  name: '',
  price: 0,
  category: 'Electronics',
  description: '',
  emoji: '',
  stock: 0,
  rating: 4.0
});

const editProduct = (product: Product) => {
  editingProduct.value = product;
  Object.assign(productForm, product);
  showProductModal.value = true;
};

const closeProductModal = () => {
  showProductModal.value = false;
  editingProduct.value = null;
  Object.assign(productForm, {
    name: '',
    price: 0,
    category: 'Electronics',
    description: '',
    emoji: '',
    stock: 0,
    rating: 4.0
  });
};

const saveProduct = () => {
  const storedProducts = localStorage.getItem('products');
  let allProducts: Product[] = storedProducts ? JSON.parse(storedProducts) : [];
  
  if (editingProduct.value) {
    // Update existing
    const index = allProducts.findIndex(p => p.id === editingProduct.value!.id);
    if (index !== -1) {
      allProducts[index] = { ...allProducts[index], ...productForm };
    }
  } else {
    // Add new
    allProducts.push({
      id: `p${Date.now()}`,
      ...productForm
    });
  }
  
  localStorage.setItem('products', JSON.stringify(allProducts));
  loadProducts();
  closeProductModal();
};

const deleteProduct = (productId: string) => {
  if (confirm('Are you sure you want to delete this product?')) {
    const storedProducts = localStorage.getItem('products');
    let allProducts: Product[] = storedProducts ? JSON.parse(storedProducts) : [];
    allProducts = allProducts.filter(p => p.id !== productId);
    localStorage.setItem('products', JSON.stringify(allProducts));
    loadProducts();
  }
};

const updateOrderStatus = async (orderId: string, status: string) => {
  await updateStatus(orderId, status as OrderStatus);
  await loadAllOrders();
};

const viewOrderDetails = (order: Order) => {
  alert(`Order #${order.orderId}\nCustomer: ${order.userName}\nAddress: ${order.deliveryAddress}\nTotal: $${order.total.toFixed(2)}`);
};

onMounted(async () => {
  await initAuth();
  await loadProducts();
  await loadAllOrders();
  users.value = await getUsers();
});
</script>

<style scoped>
.admin-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.admin-page h1 {
  margin-bottom: 30px;
  color: var(--text-color);
}

.not-authorized {
  text-align: center;
  padding: 60px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
}

.not-authorized span {
  font-size: 4rem;
  display: block;
  margin-bottom: 15px;
}

.not-authorized a {
  color: #667eea;
  text-decoration: none;
}

/* Tabs */
.admin-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 15px;
}

.tab-btn {
  padding: 12px 24px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  color: var(--text-color);
  transition: all 0.2s;
}

.tab-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.tab-content {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 25px;
}

.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.tab-header h2 {
  color: var(--text-color);
}

.btn-add {
  padding: 10px 20px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

/* Tables */
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

th {
  background: var(--bg-color);
  font-weight: 600;
  color: var(--text-color);
}

td {
  color: var(--text-color);
}

.product-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.product-cell .emoji {
  font-size: 1.5rem;
}

.customer-cell {
  display: flex;
  flex-direction: column;
}

.customer-cell .email {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.role-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.role-badge.user {
  background: #dbeafe;
  color: #1e40af;
}

.role-badge.admin {
  background: #fef3c7;
  color: #92400e;
}

.status-select {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-color);
  color: var(--text-color);
}

.btn-edit, .btn-view {
  padding: 6px 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 8px;
}

.btn-delete {
  padding: 6px 12px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 30px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal h2 {
  margin-bottom: 25px;
  color: var(--text-color);
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
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-color);
  color: var(--text-color);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 25px;
}

.btn-cancel {
  padding: 12px 24px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.btn-save {
  padding: 12px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

@media (max-width: 1024px) {
  .admin-tabs {
    flex-wrap: wrap;
  }
  
  table {
    display: block;
    overflow-x: auto;
  }
}
</style>