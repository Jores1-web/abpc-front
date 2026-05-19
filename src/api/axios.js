import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
})

// Ajouter le token automatiquement à chaque requête
api.interceptors.request.use((config) => {
  const adminToken   = localStorage.getItem('admin_token')
  const citoyenToken = localStorage.getItem('citoyen_token')
  const token = adminToken || citoyenToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Gérer les erreurs 401 (token expiré)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || ''
      // Ne rediriger que si c'est une route protégée, pas un login
      if (!url.includes('/login')) {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('citoyen_token')
        localStorage.removeItem('admin_data')
        localStorage.removeItem('citoyen_data')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api