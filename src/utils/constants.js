export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'https://your-lambda-url.execute-api.eu-west-1.amazonaws.com/prod',
  ENDPOINTS: {
    TASKS: '/tasks'
  }
};

export const COGNITO_CONFIG = {
  userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
  region: import.meta.env.VITE_COGNITO_REGION || 'eu-west-1'
};

// Task status constants
export const TASK_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  EXPIRY: 'EXPIRY',
  DELETED: 'DELETED'
};

// Task status colors for UI
export const STATUS_COLORS = {
  [TASK_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [TASK_STATUS.COMPLETED]: 'bg-green-100 text-green-800',
  [TASK_STATUS.EXPIRY]: 'bg-red-100 text-red-800',
  [TASK_STATUS.DELETED]: 'bg-gray-100 text-gray-800'
};

// Task status icons
export const STATUS_ICONS = {
  [TASK_STATUS.PENDING]: 'Clock',
  [TASK_STATUS.COMPLETED]: 'CheckCircle',
  [TASK_STATUS.EXPIRY]: 'AlertCircle',
  [TASK_STATUS.DELETED]: 'Archive'
};

// Validate required environment variables
export const validateEnv = () => {
  const required = [
    'VITE_COGNITO_USER_POOL_ID',
    'VITE_COGNITO_CLIENT_ID'
  ];

  const missing = required.filter(key => !import.meta.env[key]);

  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    return false;
  }

  return true;
};