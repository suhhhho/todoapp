import api from './api';

const register = async (username, password) => {
  const response = await api.post('/register', { username, password });
  return response;
};

const login = async (username, password) => {
  const response = await api.post('/login', { username, password });
  if (response && response.token) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', username);
  }
  return response;
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return localStorage.getItem('user');
};

const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  isAuthenticated
};

export default authService;