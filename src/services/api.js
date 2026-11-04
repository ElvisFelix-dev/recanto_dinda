const DEFAULT_API_URL = import.meta.env.PROD
  ? 'https://recanto-da-dinda.onrender.com/api'
  : 'http://localhost:3333/api'

export const API_URL = (
  import.meta.env.VITE_API_URL || DEFAULT_API_URL
).replace(/\\/+$/, '')

function getToken() {
  return localStorage.getItem('adminToken')
}

function handleUnauthorized(response) {
  if (response.status !== 401) return

  localStorage.removeItem('adminToken')
  localStorage.removeItem('adminUser')

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('admin:unauthorized'))
  }
}

export async function apiRequest(endpoint, options = {}) {
  const token = getToken()
  const headers = { ...options.headers }

  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json'
  }

  if (token) headers.Authorization = `Bearer ${token}`

  let response

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Verifique sua internet ou tente novamente.')
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    handleUnauthorized(response)
    throw new Error(data.message || 'Não foi possível comunicar com o servidor.')
  }

  return data
}

async function downloadFile(endpoint, fallbackName) {
  const headers = {}
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  let response

  try {
    response = await fetch(`${API_URL}${endpoint}`, { headers })
  } catch {
    throw new Error('Não foi possível conectar ao servidor para gerar o arquivo.')
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    handleUnauthorized(response)
    throw new Error(data.message || 'Não foi possível gerar o arquivo.')
  }

  const blob = await response.blob()
  const disposition = response.headers.get('Content-Disposition') || ''
  const filename = disposition.match(/filename="?([^";]+)"?/i)?.[1] || fallbackName
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
  return filename
}

const queryString = (params = {}) => {
  const filtered = Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
  return new URLSearchParams(filtered).toString()
}

export const adminApi = {
  login: (credentials) => apiRequest('/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  getMe: () => apiRequest('/admin/auth/me'),
  getRegistrations: (params = {}) => {
    const query = queryString(params)
    return apiRequest(`/admin/pet-registrations${query ? `?${query}` : ''}`)
  },
  getRegistration: (id) => apiRequest(`/admin/pet-registrations/${id}`),
  updateRegistrationStatus: (id, payload) => apiRequest(`/admin/pet-registrations/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }),
  getGuardianPets: (id) => apiRequest(`/admin/guardians/${id}/pets`),

  getUsers: (params = {}) => {
    const query = queryString(params)
    return apiRequest(`/admin/users${query ? `?${query}` : ''}`)
  },
  createUser: (payload) => apiRequest('/admin/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  updateUser: (id, payload) => apiRequest(`/admin/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }),
  changeUserPassword: (id, password) => apiRequest(`/admin/users/${id}/password`, {
    method: 'PATCH',
    body: JSON.stringify({ password }),
  }),
  getActivity: (params = {}) => {
    const query = queryString(params)
    return apiRequest(`/admin/activity${query ? `?${query}` : ''}`)
  },
  getReportOverview: (params = {}) => {
    const query = queryString(params)
    return apiRequest(`/admin/reports/overview${query ? `?${query}` : ''}`)
  },
  downloadRegistrationsCsv: (params = {}) => {
    const query = queryString(params)
    return downloadFile(`/admin/reports/registrations.csv${query ? `?${query}` : ''}`, 'relatorio-pets.csv')
  },
  updatePetAvatar: (id, file) => {
    const formData = new FormData()
    formData.append('avatar', file)
    return apiRequest(`/admin/pets/${id}/avatar`, { method: 'PATCH', body: formData })
  },
  removePetAvatar: (id) => apiRequest(`/admin/pets/${id}/avatar`, { method: 'DELETE' }),
}

export { API_URL as defaultApiUrl }
