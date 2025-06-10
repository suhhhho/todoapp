import React, { useState, useEffect } from 'react';
import './App.css';

// API service
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
  delete: (endpoint) => apiCall(endpoint, 'DELETE')
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editTaskText, setEditTaskText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchTasks();
    }
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/tasks');
      if (response) {
        setTasks(response);
      }
      setMessage('');
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setMessage('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const response = await api.post('/login', { username, password });
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', username);
        setIsLoggedIn(true);
        setMessage('Login successful!');
        fetchTasks();
      } else {
        setMessage('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const response = await api.post('/register', { username, password });
      if (response && !response.error) {
        setMessage('Registration successful! You can now log in.');
        setIsRegistering(false);
      } else {
        setMessage(response.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setTasks([]);
    setMessage('');
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    setLoading(true);
    try {
      const response = await api.post('/tasks', { name: newTask, done: false });
      if (response) {
        setTasks([...tasks, response]);
        setNewTask('');
        setMessage('');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      setMessage('Failed to add task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
      setMessage('');
    } catch (error) {
      console.error('Error deleting task:', error);
      setMessage('Failed to delete task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (task) => {
    setLoading(true);
    try {
      const updatedTask = { ...task, done: !task.done };
      const response = await api.put(`/tasks/${task.id}`, updatedTask);
      if (response) {
        setTasks(tasks.map(t => t.id === task.id ? { ...t, done: !t.done } : t));
        setMessage('');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      setMessage('Failed to update task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (task) => {
    setEditingTask(task.id);
    setEditTaskText(task.name);
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setEditTaskText('');
  };

  const saveEdit = async (task) => {
    if (!editTaskText.trim()) return;

    setLoading(true);
    try {
      const updatedTask = { ...task, name: editTaskText };
      const response = await api.put(`/tasks/${task.id}`, updatedTask);
      if (response) {
        setTasks(tasks.map(t => t.id === task.id ? { ...t, name: editTaskText } : t));
        setEditingTask(null);
        setEditTaskText('');
        setMessage('');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      setMessage('Failed to update task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="app">
        <header className="app-header">
          <div className="logo">Todo List App</div>
        </header>
        <main className="app-main">
          {isRegistering ? (
            <div className="auth-container">
              <h2>Register</h2>
              {message && <div className="message">{message}</div>}
              <form onSubmit={handleRegister}>
                <div className="form-group">
                  <label>Username:</label>
                  <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Password:</label>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Registering...' : 'Register'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsRegistering(false)} 
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  Back to Login
                </button>
              </form>
            </div>
          ) : (
            <div className="auth-container">
              <h2>Login</h2>
              {message && <div className="message">{message}</div>}
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label>Username:</label>
                  <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Password:</label>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsRegistering(true)} 
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  Register
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">Todo List App</div>
        <div className="user-section">
          <span>Welcome, {localStorage.getItem('user')}</span>
          <button onClick={handleLogout} className="btn btn-logout" disabled={loading}>Logout</button>
        </div>
      </header>
      <main className="app-main">
        <div className="task-container">
          <h2>Your Tasks</h2>
          {message && <div className="message">{message}</div>}
          
          {/* Add task form */}
          <form onSubmit={handleAddTask} className="add-task-form">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              disabled={loading}
            />
            <button type="submit" className="btn btn-add" disabled={loading}>
              {loading ? 'Adding...' : 'Add Task'}
            </button>
          </form>
          
          {/* Task list */}
          <div className="task-list">
            {loading && tasks.length === 0 ? (
              <div className="loading">Loading tasks...</div>
            ) : tasks.length === 0 ? (
              <div className="no-tasks">No tasks yet. Add one to get started!</div>
            ) : (
              tasks.map(task => (
                <div key={task.id} className={`task-item ${task.done ? 'completed' : ''}`}>
                  {editingTask === task.id ? (
                    <div className="edit-mode">
                      <input
                        type="text"
                        value={editTaskText}
                        onChange={(e) => setEditTaskText(e.target.value)}
                        disabled={loading}
                        autoFocus
                      />
                      <div className="edit-buttons">
                        <button onClick={() => saveEdit(task)} className="btn btn-save" disabled={loading}>
                          Save
                        </button>
                        <button onClick={cancelEditing} className="btn btn-cancel" disabled={loading}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="view-mode">
                      <div className="task-content">
                        <input
                          type="checkbox"
                          checked={task.done}
                          onChange={() => handleToggleComplete(task)}
                          disabled={loading}
                        />
                        <span className={`task-text ${task.done ? 'completed-text' : ''}`}>
                          {task.name}
                        </span>
                      </div>
                      <div className="task-actions">
                        <button onClick={() => startEditing(task)} className="btn btn-edit" disabled={loading}>
                          Edit
                        </button>
                        <button onClick={() => handleDeleteTask(task.id)} className="btn btn-delete" disabled={loading}>
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;