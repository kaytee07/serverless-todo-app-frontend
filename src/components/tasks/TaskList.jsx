import React, { useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import TaskSkeleton from '../common/TaskSkeleton';
import { Plus, Filter, AlertTriangle, RefreshCw } from 'lucide-react';
import { TASK_STATUS } from '../../utils/constants';

const TaskList = () => {
  const { 
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
  } = useTasks();
  
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');

  const handleCreateTask = async (taskData) => {
    const result = await createTask(taskData);
    if (result.success) {
      setShowForm(false);
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    const result = await updateTask(taskId, taskData);
    if (result.success) {
      setEditingTask(null);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleRetry = () => {
    clearError();
    fetchTasks();
  };

  // Filter tasks based on selected filter
  const filteredTasks = () => {
    switch (filter) {
      case 'pending':
        return getTasksByStatus(TASK_STATUS.PENDING);
      case 'completed':
        return getTasksByStatus(TASK_STATUS.COMPLETED);
      case 'expiry':
        return getTasksByStatus(TASK_STATUS.EXPIRY);
      case 'overdue':
        return getOverdueTasks();
      default:
        return getActiveTasks(); // All active tasks (not deleted)
    }
  };

  const activeTasks = getActiveTasks();
  const overdueTasks = getOverdueTasks();
  const pendingTasks = getTasksByStatus(TASK_STATUS.PENDING);
  const completedTasks = getTasksByStatus(TASK_STATUS.COMPLETED);
  const expiryTasks = getTasksByStatus(TASK_STATUS.EXPIRY);

  // Error state
  if (error && tasks.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
        </div>
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load tasks</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  if (loading && tasks.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
        </div>
        {[...Array(3)].map((_, index) => (
          <TaskSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-600 mt-1">
            {activeTasks.length} active tasks
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {error && (
            <button
              onClick={handleRetry}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              title="Retry"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-red-800">
              <AlertTriangle className="w-5 h-5" />
              <span>{error}</span>
            </div>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Overdue Alert */}
      {overdueTasks.length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-800">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">
              You have {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-6 p-1 bg-gray-100 rounded-lg w-fit flex-wrap gap-1">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            filter === 'all' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          All ({activeTasks.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            filter === 'pending' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Pending ({pendingTasks.length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            filter === 'completed' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Completed ({completedTasks.length})
        </button>
        <button
          onClick={() => setFilter('expiry')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            filter === 'expiry' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Expired ({expiryTasks.length})
        </button>
        <button
          onClick={() => setFilter('overdue')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            filter === 'overdue' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Overdue ({overdueTasks.length})
        </button>
      </div>

      {/* Task Form Modals */}
      {showForm && (
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingTask && (
        <TaskForm
          onSubmit={(taskData) => handleUpdateTask(editingTask.taskId, taskData)}
          onCancel={() => setEditingTask(null)}
          initialData={editingTask}
          isEditing={true}
        />
      )}

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks().length === 0 ? (
          <div className="text-center py-12">
            <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? "Get started by creating your first task!"
                : `No ${filter} tasks at the moment.`
              }
            </p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                View all tasks
              </button>
            )}
          </div>
        ) : (
          filteredTasks().map(task => (
            <TaskItem
              key={task.taskId}
              task={task}
              onEdit={handleEditTask}
              onDelete={deleteTask}
              onUpdate={updateTask}
            />
          ))
        )}
      </div>

      {/* Stats Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">{pendingTasks.length}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">{expiryTasks.length}</div>
            <div className="text-sm text-gray-600">Expired</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">{overdueTasks.length}</div>
            <div className="text-sm text-gray-600">Overdue</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{activeTasks.length}</div>
            <div className="text-sm text-gray-600">Total Active</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskList;