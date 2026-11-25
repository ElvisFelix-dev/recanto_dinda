const DEFAULT_API_URL = import.meta.env.PROD
  ? 'https://recanto-da-dinda.onrender.com/api'
  : 'http://localhost:3333/api';

export const API_URL = (
  import.meta.env.VITE_API_URL || DEFAULT_API_URL
).replace(/\/+$/, '');

function getToken() {
  return localStorage.getItem('adminToken');
}

function handleUnauthorized(response) {
  if (response.status !== 401) return;

  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('admin:unauthorized'));
  }
}

export async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const headers = { ...options.headers };

  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  if (token) headers.Authorization = `Bearer ${token}`;

  let response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      'Não foi possível conectar ao servidor. Verifique sua internet ou tente novamente.',
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    handleUnauthorized(response);
    throw new Error(
      data.message || 'Não foi possível comunicar com o servidor.',
    );
  }

  return data;
}

async function downloadFile(endpoint, fallbackName) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, { headers });
  } catch {
    throw new Error(
      'Não foi possível conectar ao servidor para gerar o arquivo.',
    );
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    handleUnauthorized(response);
    throw new Error(data.message || 'Não foi possível gerar o arquivo.');
  }

  const blob = await response.blob();
  const disposition = response.headers.get('Content-Disposition') || '';
  const filename =
    disposition.match(/filename="?([^";]+)"?/i)?.[1] || fallbackName;
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  return filename;
}

const queryString = (params = {}) => {
  const filtered = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== '',
  );
  return new URLSearchParams(filtered).toString();
};

export const adminApi = {
  login: (credentials) =>
    apiRequest('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  getMe: () => apiRequest('/admin/auth/me'),
  getRegistrations: (params = {}) => {
    const query = queryString(params);
    return apiRequest(`/admin/pet-registrations${query ? `?${query}` : ''}`);
  },
  getRegistration: (id) => apiRequest(`/admin/pet-registrations/${id}`),
  updateRegistrationStatus: (id, payload) =>
    apiRequest(`/admin/pet-registrations/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  getGuardianPets: (id) => apiRequest(`/admin/guardians/${id}/pets`),

  getUsers: (params = {}) => {
    const query = queryString(params);
    return apiRequest(`/admin/users${query ? `?${query}` : ''}`);
  },
  createUser: (payload) =>
    apiRequest('/admin/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateUser: (id, payload) =>
    apiRequest(`/admin/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  changeUserPassword: (id, password) =>
    apiRequest(`/admin/users/${id}/password`, {
      method: 'PATCH',
      body: JSON.stringify({ password }),
    }),
  getActivity: (params = {}) => {
    const query = queryString(params);
    return apiRequest(`/admin/activity${query ? `?${query}` : ''}`);
  },
  getReportOverview: (params = {}) => {
    const query = queryString(params);
    return apiRequest(`/admin/reports/overview${query ? `?${query}` : ''}`);
  },
  downloadRegistrationsCsv: (params = {}) => {
    const query = queryString(params);
    return downloadFile(
      `/admin/reports/registrations.csv${query ? `?${query}` : ''}`,
      'relatorio-completo-recanto.csv',
    );
  },
  updatePetAvatar: (id, file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiRequest(`/admin/pets/${id}/avatar`, {
      method: 'PATCH',
      body: formData,
    });
  },
  removePetAvatar: (id) =>
    apiRequest(`/admin/pets/${id}/avatar`, { method: 'DELETE' }),

  // Central de notificações administrativas
  getNotifications: (params = {}) => {
    const query = queryString(params);
    return apiRequest(`/admin/notifications${query ? `?${query}` : ''}`);
  },
  markNotificationRead: (id) =>
    apiRequest(`/admin/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: () =>
    apiRequest('/admin/notifications/read-all', { method: 'PATCH' }),
  getPushPublicKey: () => apiRequest('/admin/notifications/push/public-key'),
  savePushSubscription: (subscription) =>
    apiRequest('/admin/notifications/push/subscribe', {
      method: 'POST',
      body: JSON.stringify({ subscription }),
    }),
  removePushSubscription: (endpoint) =>
    apiRequest('/admin/notifications/push/subscribe', {
      method: 'DELETE',
      body: JSON.stringify({ endpoint }),
    }),
};

export { API_URL as defaultApiUrl };


export const hotelApi = {
  submitBooking: (payload, files) => {
    const formData = new FormData()
    formData.append('payload', JSON.stringify(payload))
    files.forEach((file) => formData.append('vaccinationCards', file))
    return apiRequest('/hotel/bookings', { method: 'POST', body: formData })
  },
  getBooking: (id) => apiRequest(`/admin/hotel/bookings/${id}`),
  getBookings: (params = {}) => {
    const query = queryString(params)
    return apiRequest(`/admin/hotel/bookings${query ? `?${query}` : ''}`)
  },
  updateBooking: (id, payload) => apiRequest(`/admin/hotel/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify(payload) }),
  getAttendance: (params = {}) => {
    const query = queryString(params)
    return apiRequest(`/admin/attendance${query ? `?${query}` : ''}`)
  },
  getAttendanceRoster: (params = {}) => {
    const query = queryString(params)
    return apiRequest(`/admin/attendance/roster${query ? `?${query}` : ''}`)
  },
  checkInBatch: (petIds) =>
    apiRequest('/admin/attendance/check-in-batch', {
      method: 'POST',
      body: JSON.stringify({ petIds }),
    }),
  checkOutBatch: (attendanceIds) =>
    apiRequest('/admin/attendance/check-out-batch', {
      method: 'POST',
      body: JSON.stringify({ attendanceIds }),
    }),
  checkIn: (petId, payload = {}) => apiRequest(`/admin/pets/${petId}/check-in`, { method: 'POST', body: JSON.stringify(payload) }),
  checkOut: (id, payload = {}) => apiRequest(`/admin/attendance/${id}/check-out`, { method: 'PATCH', body: JSON.stringify(payload) }),
}

export const guardianApi = {
  requestAccessCode: (payload) =>
    guardianRequest('/guardian/auth/request-access-code', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  confirmAccess: (payload) =>
    guardianRequest('/guardian/auth/confirm-access', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  login: (payload) =>
    guardianRequest('/guardian/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  me: () => guardianRequest('/guardian/me'),
  attendance: () => guardianRequest('/guardian/me/attendance'),
  getTestimonials: () => guardianRequest('/guardian/testimonials'),
  createTestimonial: (payload) =>
    guardianRequest('/guardian/testimonials', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
}

async function guardianRequest(endpoint, options = {}) {
  const token = localStorage.getItem('guardianToken')
  const headers = { ...options.headers }

  if (options.body) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.')
  }

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    if (response.status === 401 && endpoint === '/guardian/me') {
      localStorage.removeItem('guardianToken')
    }
    throw new Error(data.message || 'Não foi possível concluir a solicitação.')
  }

  return data
}


// API de depoimentos: endpoints públicos e administrativos.
export const testimonialApi = {
  getPublicTestimonials: async (params = {}) => {
    const query = queryString(params)
    let response
    try {
      response = await fetch(`${API_URL}/testimonials${query ? `?${query}` : ''}`)
    } catch {
      throw new Error('Não foi possível carregar os depoimentos.')
    }
    const data = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(data.message || 'Não foi possível carregar os depoimentos.')
    return data
  },
  getAdminTestimonials: (params = {}) => {
    const query = queryString(params)
    return apiRequest(`/admin/testimonials${query ? `?${query}` : ''}`)
  },
  getTestimonial: (id) => apiRequest(`/admin/testimonials/${id}`),
  createTestimonial: (payload) =>
    apiRequest('/admin/testimonials', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateTestimonial: (id, payload) =>
    apiRequest(`/admin/testimonials/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  updateTestimonialStatus: (id, status) =>
    apiRequest(`/admin/testimonials/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  deleteTestimonial: (id) =>
    apiRequest(`/admin/testimonials/${id}`, { method: 'DELETE' }),
}
