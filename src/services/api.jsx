const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api'

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('adminToken')

  const headers = {
    ...options.headers,
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Erro ao comunicar com o servidor.')
  }

  return data
}

export const adminApi = {
  login: (credentials) =>
    apiRequest('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getRegistrations: (params = {}) => {
    const query = new URLSearchParams(params).toString()

    return apiRequest(
      `/admin/pet-registrations${query ? `?${query}` : ''}`,
    )
  },

  getRegistration: (id) =>
    apiRequest(`/admin/pet-registrations/${id}`),

  updateRegistrationStatus: (id, payload) =>
    apiRequest(`/admin/pet-registrations/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  getGuardianPets: (id) =>
    apiRequest(`/admin/guardians/${id}/pets`),
}
