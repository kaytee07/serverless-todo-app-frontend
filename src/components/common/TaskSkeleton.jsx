import React from 'react';

const TaskSkeleton = () => {
  return (
    <div className="animate-pulse bg-white rounded-lg shadow p-6 mb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="w-5 h-5 bg-gray-200 rounded-full mt-1"></div>
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              <div className="flex space-x-2">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default TaskSkeleton;