import { AuthService } from './auth';
import { API_CONFIG } from '../utils/constants';
import toast from 'react-hot-toast';

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  async request(endpoint, options = {}) {
    try {
      const token = await AuthService.getCurrentSession();
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      };

      if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      
      const contentType = response.headers.get('content-type');
      let responseData;

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        
        responseData = { success: response.ok, message: '', data: null };
      }

   
      if (!response.ok) {
       
        const errorMessage = responseData.message || `HTTP error! status: ${response.status}`;
        
        if (response.status === 401) {
          toast.error('Session expired. Please login again.');
          // Optionally redirect to login
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          throw new Error('Authentication failed');
        }
        if (response.status === 403) {
          throw new Error('Access denied');
        }
        if (response.status === 404) {
          throw new Error(responseData.message || 'Resource not found');
        }
        throw new Error(errorMessage);
      }

      // Now check the backend success flag
      if (!responseData.success) {
        throw new Error(responseData.message || 'API request failed');
      }

      return responseData;

    } catch (error) {
      console.error('API request failed:', error);
      
      // Only show toast for non-authentication errors
      if (!error.message.includes('Authentication failed')) {
        toast.error(error.message || 'Something went wrong');
      }
      
      throw error;
    }
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, { 
      method: 'POST', 
      body: data 
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, { 
      method: 'PUT', 
      body: data 
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { 
      method: 'DELETE' 
    });
  }
}

// Task-specific API methods
export const taskAPI = {
  getAll: () => new ApiService().get(API_CONFIG.ENDPOINTS.TASKS),
  create: (taskData) => new ApiService().post(API_CONFIG.ENDPOINTS.TASKS, taskData),
  update: (taskId, taskData) => new ApiService().put(`${API_CONFIG.ENDPOINTS.TASKS}/${taskId}`, taskData),
  delete: (taskId) => new ApiService().delete(`${API_CONFIG.ENDPOINTS.TASKS}/${taskId}`)
};

export default ApiService;