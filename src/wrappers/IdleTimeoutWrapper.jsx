import React from 'react';
import useIdleTimeout from '../hooks/useIdleTimeout';

const IdleTimeoutWrapper = ({ children }) => {
  useIdleTimeout(); // Now safe to call here, as it's inside <BrowserRouter>
  return <>{children}</>;
};

export default IdleTimeoutWrapper;