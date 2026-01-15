import axios from 'axios'
import { supabase } from './lib/supabase'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add Supabase token to requests
api.interceptors.request.use(async (config) => {
  // Get current Supabase session
  const { data: { session } } = await supabase.auth.getSession()
  
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }
  
  return config
}, (error) => {
  return Promise.reject(error)
})

// Auth
export const authAPI = {
  signup: (email, password, displayName) =>
    api.post('/signup', { email, password, display_name: displayName }),
  
  login: (email, password) =>
    api.post('/login', { email, password }),
  
  getMe: () => api.get('/me'),
  
  getCredits: () => api.get('/credits'),
}

// Profile
export const profileAPI = {
  updateProfile: (profileText) =>
    api.put('/profile', { profile_text: profileText }),
  
  getAnalysis: () => api.get('/profile/analysis'),
}

// Contacts
export const contactsAPI = {
  create: (name, platform, profileText) =>
    api.post('/contacts', { name, platform, profile_text: profileText }),
  
  list: () => api.get('/contacts'),
  
  get: (id) => api.get(`/contacts/${id}`),
  
  update: (id, data) => api.put(`/contacts/${id}`, data),
  
  delete: (id) => api.delete(`/contacts/${id}`),
  
  getConversations: (id) => api.get(`/contacts/${id}/conversations`),
}

// Conversations
export const conversationsAPI = {
  create: (contactId, messages) =>
    api.post('/conversations', { contact_id: contactId, messages }),
  
  list: () => api.get('/conversations'),
  
  get: (id) => api.get(`/conversations/${id}`),
  
  addMessage: (conversationId, sender, text) =>
    api.post(`/conversations/${conversationId}/messages`, { sender, text }),
}

// AI
export const aiAPI = {
  generateReplies: (conversationId) =>
    api.post('/generate-replies', { conversation_id: conversationId }),
  
  classify: (conversationId) =>
    api.post(`/classify/${conversationId}`),
}

// Payments
export const paymentsAPI = {
  getProducts: () => api.get('/products'),
  
  createCheckout: (productType) =>
    api.post('/checkout/create-session', { product_type: productType }),
  
  getPayments: () => api.get('/payments'),
  
  getPayment: (id) => api.get(`/payments/${id}`),
}

export default api
