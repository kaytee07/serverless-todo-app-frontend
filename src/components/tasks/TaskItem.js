import React, { useState } from 'react';
import { Edit2, Trash2, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { TASK_STATUS, STATUS_COLORS } from '../../utils/constants';

const TaskItem = ({ task, onEdit, onDelete, onUpdate }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      await onDelete(task.id);
      setIsDeleting(false);
    }
  };

  const handleStatusToggle = async () => {
    const newStatus = task.status === TASK_STATUS.COMPLETED ? TASK_STATUS.PENDING : TASK_STATUS.COMPLETED;
    await onUpdate(task.id, { 
      description: task.description,
      deadline: task.deadline,
      status: newStatus
    });
  };

  const formatDeadline = (timestamp) => {
    if (!timestamp) return null;
    return new Date(timestamp).toLocaleString();
  };

  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status === TASK_STATUS.PENDING;

  const statusConfig = {
    [TASK_STATUS.PENDING]: { color: STATUS_COLORS.PENDING, icon: Clock, label: 'Pending' },
    [TASK_STATUS.COMPLETED]: { color: STATUS_COLORS.COMPLETED, icon: CheckCircle, label: 'Completed' },
    [TASK_STATUS.EXPIRY]: { color: STATUS_COLORS.EXPIRY, icon: AlertCircle, label: 'Expired' },
    [TASK_STATUS.DELETED]: { color: STATUS_COLORS.DELETED, icon: Clock, label: 'Deleted' }
  };

  const StatusIcon = statusConfig[task.status]?.icon || Clock;
  const statusLabel = statusConfig[task.status]?.label || task.status;

  return (
    <div className={`bg-white rounded-lg shadow p-6 mb-4 transition-all duration-200 ${
      isDeleting ? 'opacity-50' : 'opacity-100'
    } ${isOverdue ? 'border-l-4 border-l-red-500' : ''} ${
      task.status === TASK_STATUS.COMPLETED ? 'border-l-4 border-l-green-500' : ''
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {/* Status Toggle Button - Only for PENDING/COMPLETED */}
          {(task.status === TASK_STATUS.PENDING || task.status === TASK_STATUS.COMPLETED) && (
            <button
              onClick={handleStatusToggle}
              className={`flex-shrink-0 mt-1 p-1 rounded-full transition-colors ${
                task.status === TASK_STATUS.COMPLETED 
                  ? 'text-green-500 hover:text-green-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <StatusIcon className="w-5 h-5" />
            </button>
          )}
          
          {/* Show icon without toggle for other statuses */}
          {(task.status === TASK_STATUS.EXPIRY || task.status === TASK_STATUS.DELETED) && (
            <div className="flex-shrink-0 mt-1 p-1">
              <StatusIcon className="w-5 h-5 text-gray-400" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            {/* Description */}
            <p className={`text-gray-900 break-words ${
              task.status === TASK_STATUS.COMPLETED ? 'line-through text-gray-500' : ''
            }`}>
              {task.description}
            </p>

            {/* Deadline */}
            {task.deadline && (
              <div className="flex items-center space-x-1 mt-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                  {formatDeadline(task.deadline)}
                  {isOverdue && ' (Overdue)'}
                </span>
              </div>
            )}

            {/* Status Badge */}
            <div className="flex items-center space-x-2 mt-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                statusConfig[task.status]?.color || 'bg-gray-100 text-gray-800'
              }`}>
                {statusLabel}
              </span>
              {isOverdue && task.status === TASK_STATUS.PENDING && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Urgent
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 ml-4 flex-shrink-0">
          <button
            onClick={() => onEdit(task)}
            disabled={task.status === TASK_STATUS.DELETED}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-md hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Edit task"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleDelete}
            disabled={isDeleting || task.status === TASK_STATUS.DELETED}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;