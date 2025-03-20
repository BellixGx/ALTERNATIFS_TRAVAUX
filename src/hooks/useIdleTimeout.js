import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

const INACTIVITY_TIMEOUT = 15 * 60 * 1000;

const useIdleTimeout = () => {
  const navigate = useNavigate();

  const resetTimeout = useCallback(() => {
    // Clear any existing timeout
    const existingTimeout = sessionStorage.getItem('inactivityTimeout');
    if (existingTimeout) {
      clearTimeout(parseInt(existingTimeout, 10));
    }

    // Set a new timeout
    const timeoutId = setTimeout(() => {
      // Logout the user
      localStorage.removeItem('authToken');
      message.warning('Session expired due to inactivity. Please log in again.');
      navigate('/login');
      sessionStorage.removeItem('inactivityTimeout'); // Clean up
    }, INACTIVITY_TIMEOUT);

    // Store the timeout ID in sessionStorage to clear it later
    sessionStorage.setItem('inactivityTimeout', timeoutId);
  }, [navigate]);

  useEffect(() => {
    // Reset timeout on user activity
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    const resetActivity = () => resetTimeout();

    // Add event listeners
    events.forEach((event) => window.addEventListener(event, resetActivity));

    // Initial reset
    resetTimeout();

    // Cleanup
    return () => {
      events.forEach((event) => window.removeEventListener(event, resetActivity));
      const timeoutId = sessionStorage.getItem('inactivityTimeout');
      if (timeoutId) {
        clearTimeout(parseInt(timeoutId, 10));
        sessionStorage.removeItem('inactivityTimeout');
      }
    };
  }, [resetTimeout]);
};

export default useIdleTimeout;