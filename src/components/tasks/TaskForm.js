import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';

const TaskForm = ({ onSubmit, onCancel, initialData = {}, isEditing = false }) => {
  const [formData, setFormData] = useState({
    description: initialData.description || '',
    deadline: initialData.deadline ? formatDateForInput(initialData.deadline) : '',
    status: initialData.status || 'Pending'
  });
  const [loading, setLoading] = useState(false);

  // Format timestamp to YYYY-MM-DDTHH:mm for datetime-local input
  function formatDateForInput(timestamp) {
    const date = new Date(timestamp);
    return date.toISOString().slice(0, 16);
  }

  // Convert datetime-local value to timestamp
  function convertToTimestamp(datetimeString) {
    if (!datetimeString) return null;
    return new Date(datetimeString).getTime();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description.trim()) return;

    setLoading(true);
    
    // Prepare data for API - convert deadline to timestamp
    const submitData = {
      description: formData.description.trim(),
      deadline: convertToTimestamp(formData.deadline),
      status: formData.status
    };

    await onSubmit(submitData);
    setLoading(false);
    
    if (!isEditing) {
      setFormData({ description: '', deadline: '', status: 'Pending' });
    }
  };

  const statusOptions = [
    { value: 'Pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'Completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
    { value: 'Expired', label: 'Expired', color: 'bg-red-100 text-red-800' },
    { value: 'Deleted', label: 'Deleted', color: 'bg-gray-100 text-gray-800' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              rows="4"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="What needs to be done?"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Deadline Field */}
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Deadline (Optional)</span>
              </div>
            </label>
            <input
              type="datetime-local"
              id="deadline"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          {/* Status Field - Only show in edit mode */}
          {isEditing && (
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Status Preview */}
          {!isEditing && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> New tasks will be created with "Pending" status. 
                You can change the status when editing the task.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 sticky bottom-0 bg-white pb-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.description.trim()}
              className="flex-1 px-4 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                isEditing ? 'Update Task' : 'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;