import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import type { User } from '../types';
import { getSession, setSession, clearSession } from '../utils/storage';
import { getUsers, getUserByEmail, createUser as createUserData, generateId } from '../utils/dataUtils';

const currentUser = ref<User | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

export function useAuth() {
  const router = useRouter();

  // Initialize from session
  const initAuth = async () => {
    const session = getSession();
    if (session) {
      const users = await getUsers();
      const user = users.find(u => u.id === session.userId);
      if (user) {
        currentUser.value = user;
      }
    }
  };

  // Login
  const login = async (email: string, password: string): Promise<boolean> => {
    loading.value = true;
    error.value = null;
    
    try {
      const users = await getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        currentUser.value = user;
        setSession(user);
        return true;
      } else {
        error.value = 'Invalid email or password';
        return false;
      }
    } catch (e) {
      error.value = 'Login failed. Please try again.';
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Register
  const register = async (name: string, email: string, password: string, address: string): Promise<boolean> => {
    loading.value = true;
    error.value = null;
    
    try {
      const users = await getUsers();
      
      // Check if email exists
      if (users.some(u => u.email === email)) {
        error.value = 'Email already registered';
        return false;
      }
      
      // Create new user
      const newUser: User = {
        id: generateId('u'),
        name,
        email,
        password,
        role: 'user',
        address,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      // Add to local storage (in real app, would send to server)
      const storedUsers = localStorage.getItem('users');
      const allUsers = storedUsers ? JSON.parse(storedUsers) : users;
      allUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(allUsers));
      
      currentUser.value = newUser;
      setSession(newUser);
      return true;
    } catch (e) {
      error.value = 'Registration failed. Please try again.';
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Logout
  const logout = () => {
    currentUser.value = null;
    clearSession();
    router.push('/');
  };

  // Check if logged in
  const isLoggedIn = computed(() => !!currentUser.value);
  
  // Check if admin
  const isAdmin = computed(() => currentUser.value?.role === 'admin');
  
  // Get current user
  const user = computed(() => currentUser.value);

  return {
    user,
    isLoggedIn,
    isAdmin,
    loading,
    error,
    login,
    register,
    logout,
    initAuth
  };
}