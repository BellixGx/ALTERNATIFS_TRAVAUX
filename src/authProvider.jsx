// authProvider.js
import { message} from "antd";
import { config } from './config'
export const authProvider = {
  login: async ({ username, password }) => {
    try {
        // Send login request to backend
        const response = await fetch(`${config.apiBase}${config.endpoints.authCredentials}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            credentials: 'include',
        });

        if (response.ok) {
            const data = await response.json();
            const authToken = data.access_token;  
            localStorage.setItem("authToken", authToken); 
            return Promise.resolve();
        } else {
            const data = await response.json();
            message.error(data.message || 'Invalid credentials');
            return Promise.reject('Invalid credentials');
        }
    } catch (error) {
        message.error('An error occurred while logging in');
        return Promise.reject('An error occurred while logging in');
    }
    },
    logout: () => {
      localStorage.removeItem("authToken");
      // <Navigate to="/login" /> 
      return Promise.resolve();
    },
    forgotPassword: async ({ email }) => {
      try {
        
        const response = await fetch('https://your-api.com/forgot-password', { //not a real api
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
  
        if (response.ok) {
          // If the request is successful, resolve the promise
          return Promise.resolve({ success: true, message: 'Password reset email sent!' });
        } else {
          const error = await response.json();
          return Promise.reject(new Error(error.message || 'Failed to send password reset email'));
        }
      } catch (error) {
        // Handle network or other errors
        return Promise.reject(new Error('An error occurred while requesting a password reset'));
      }
    },
    checkAuth: () => {
      // Check if the user is authenticated
      return localStorage.getItem("authToken") ? Promise.resolve() : Promise.reject();
    },
    checkError: (error) => {
      // Handle any errors, you can define your own error logic
      return Promise.resolve();
    },
    getPermissions: () => Promise.resolve(), // Define permissions if needed
  };
  