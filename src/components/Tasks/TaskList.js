import React, { useState, useEffect } from 'react';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import tasksService from '../../services/tasks.service';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await tasksService.getTasks();
      if (data) {
        setTasks(data);
      }
      setError('');
    } catch (err) {
      setError('Failed to load tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (taskName) => {
    try {
      const newTask = { name: taskName, done: false };
      const response = await tasksService.createTask(newTask);
      if (response) {
        setTasks([...tasks, response]);
      }
    } catch (err) {
      setError('Failed to add task. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await tasksService.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      setError('Failed to delete task. Please try again.');
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      const response = await tasksService.updateTask(updatedTask.id, updatedTask);
      if (response) {
        setTasks(tasks.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        ));
      }
    } catch (err) {
      setError('Failed to update task. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="task-list-container">
      <h2>Your Tasks</h2>
      {error && <div className="error">{error}</div>}
      
      <TaskForm onAddTask={handleAddTask} />
      
      <div className="task-list">
        {tasks.length === 0 ? (
          <p className="no-tasks">No tasks yet. Add one to get started!</p>
        ) : (
          tasks.map(task => (
            <TaskItem 
              key={task.id}
              task={task}
              onDelete={handleDeleteTask}
              onUpdate={handleUpdateTask}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;