const API_URL = 'http://demo2.z-bit.ee';

// Helper for making authenticated API calls
const apiCall = async (endpoint, method = 'GET', data = null) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const options = {
    method,
    headers,
    body: data ? JSON.stringify(data) : null,
  };
  
  // Don't send body for GET requests
  if (method === 'GET') {
    delete options.body;
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, options);
  
  // Handle 401 Unauthorized - clear token and redirect to login
  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    return null;
  }
  
  // For responses that don't return JSON (like DELETE)
  if (response.status === 204) {
    return { success: true };
  }
  
  // Try to parse the response as JSON
  try {
    return await response.json();
  } catch (error) {
    return { success: response.ok };
  }
};

const api = {
  get: (endpoint) => apiCall(endpoint),
  post: (endpoint, data) => apiCall(endpoint, 'POST', data),
  put: (endpoint, data) => apiCall(endpoint, 'PUT', data),
  patch: (endpoint, data) => apiCall(endpoint, 'PATCH', data),
  delete: (endpoint) => apiCall(endpoint, 'DELETE')
};

export default api;