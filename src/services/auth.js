import { Amplify, Auth } from 'aws-amplify';
import { COGNITO_CONFIG, validateEnv } from '../utils/constants';

// Validate environment variables on import
if (!validateEnv()) {
  console.warn('Cognito configuration is incomplete. Authentication may not work properly.');
}

// Configure Amplify with environment variables
const amplifyConfig = {
  Auth: {
    // Correct structure for Amplify v5
    region: COGNITO_CONFIG.region,
    userPoolId: COGNITO_CONFIG.userPoolId,
    userPoolWebClientId: COGNITO_CONFIG.userPoolClientId,
  }
};

// Only configure Amplify if we have the required values
if (COGNITO_CONFIG.userPoolId && COGNITO_CONFIG.userPoolClientId) {
  try {
    Amplify.configure(amplifyConfig);
    console.log('AWS Amplify configured successfully');
  } catch (error) {
    console.error('Failed to configure AWS Amplify:', error);
  }
} else {
  console.warn('AWS Amplify not configured - missing Cognito credentials');
}

export class AuthService {
  static async login(username, password) {
    try {
      // Check if Amplify is properly configured
      if (!COGNITO_CONFIG.userPoolId || !COGNITO_CONFIG.userPoolClientId) {
        throw new Error('Authentication service is not properly configured');
      }

      const user = await Auth.signIn(username, password);
      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed');
    }
  }

  static async logout() {
    try {
      await Auth.signOut();
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Logout failed');
    }
  }

  static async getCurrentSession() {
    try {
      const session = await Auth.currentSession();
      return session.getIdToken().getJwtToken();
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  }

  static async getCurrentUser() {
    try {
      return await Auth.currentAuthenticatedUser();
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Check if auth is properly configured
  static isConfigured() {
    return !!(COGNITO_CONFIG.userPoolId && COGNITO_CONFIG.userPoolClientId);
  }
}