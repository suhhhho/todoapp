import api from './api';

const getTasks = async () => {
  return await api.get('/tasks');
};

const getTask = async (id) => {
  return await api.get(`/tasks/${id}`);
};

const createTask = async (task) => {
  return await api.post('/tasks', task);
};

const updateTask = async (id, task) => {
  return await api.put(`/tasks/${id}`, task);
};

const deleteTask = async (id) => {
  return await api.delete(`/tasks/${id}`);
};

const tasksService = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
};

export default tasksService;