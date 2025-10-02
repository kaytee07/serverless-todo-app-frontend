import { useState, useEffect } from 'react';
import { taskAPI } from '../services/api';
import { TASK_STATUS } from '../utils/constants';
import toast from 'react-hot-toast';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskAPI.getAll();
      // Response data is already in response.data due to ApiResponse wrapper
      setTasks(response.data || []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setError(error.message);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    setError(null);
    try {
      const response = await taskAPI.create(taskData);
      // Backend returns the created task in response.data
      const newTask = response.data;
      setTasks(prev => [...prev, newTask]);
      toast.success(response.message || 'Task created successfully!');
      return { success: true, task: newTask };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const updateTask = async (taskId, taskData) => {
    setError(null);
    try {
      const response = await taskAPI.update(taskId, taskData);
      // Backend returns the updated task in response.data
      const updatedTask = response.data;
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      toast.success(response.message || 'Task updated successfully!');
      return { success: true, task: updatedTask };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const deleteTask = async (taskId) => {
    setError(null);
    try {
      await taskAPI.delete(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast.success('Task deleted successfully!');
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  // Filter tasks by status
  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  // Get overdue tasks - only PENDING tasks can be overdue
  const getOverdueTasks = () => {
    const now = new Date().getTime();
    return tasks.filter(task => 
      task.deadline && 
      task.deadline < now && 
      task.status === TASK_STATUS.PENDING
    );
  };

  // Get active tasks (not deleted)
  const getActiveTasks = () => {
    return tasks.filter(task => task.status !== TASK_STATUS.DELETED);
  };

  // Clear errors
  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    getTasksByStatus,
    getOverdueTasks,
    getActiveTasks,
    clearError
  };
};