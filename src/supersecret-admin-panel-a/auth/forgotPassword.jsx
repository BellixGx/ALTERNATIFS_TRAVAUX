import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authProvider } from '../../../src/authProvider';
import logo from './logo.png';
import { AuthPage} from'@refinedev/antd';
import {Form, Input, Button, message } from 'antd';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');

  const handleForgotPasswordSubmit = async (values) => {
    try {
      const email = values.email;
      if (!email) {
        message.error('Please enter your email address!');
        return;
      }
      const response = await authProvider.forgotPassword({ email });
      setForgotPasswordMessage(response.message || 'Password reset email sent!');
      message.success(response.message || 'Password reset email sent!');
    } catch (error) {
      const errorMsg = error.message || 'Failed to send password reset email';
      setForgotPasswordMessage(errorMsg);
      message.error(errorMsg);
    }
  };

  return (
    <AuthPage
      type="forgotPassword"
      title={false}
      registerLink={false} // Disable the default "Sign up" link
      loginLink={
        <>
        <div
        style={{
            display: 'flex', 
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '8px',
            width: '100%',
          }}
        >
        <span>Have an account?</span>
        <span
          onClick={() => navigate('/login')}
          style={{
            color: '#4096FF', // Match the color used in Login.jsx
            textDecoration: 'none',
            cursor: 'pointer',
          }}
          aria-label="Click to sign in"
        >
        Sign in
        </span>
        </div>
        </>
      }
      contentProps={{
        title: 'Forgot Password ?',
        styles: {
          header: {
            color: '#4096FF',
            display: 'flex',
            justifyContent: 'right',
            alignItems: 'center',
            width: '100%',
            textAlign: 'center',
            fontSize: 'xx-large',
          },
        },
      }}
      renderContent={(content) => (
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
          <div className="logo-container mb-6">
            <img src={logo} alt="Logo" className="logo" />
          </div>
          <div>{content}</div>
        </div>
      )}
      formProps={{
        onFinish: handleForgotPasswordSubmit,
        onFinishFailed: (errorInfo) => {
          console.log('Failed:', errorInfo);
        },
      }}
    >
      <Form.Item
        name="email"
        rules={[
          { type: 'email', message: 'The input is not valid E-mail!' },
          { required: true, message: 'Please input your E-mail!' },
        ]}
      >
        <Input
          placeholder="Enter your email to reset password"
          className="w-full p-3 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-all"
        >
          Reset Password
        </Button>
      </Form.Item>
      {forgotPasswordMessage && (
        <div
          className={`mt-4 text-center ${
            forgotPasswordMessage.includes('sent') ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {forgotPasswordMessage}
        </div>
      )}
    </AuthPage>
  );
};

export default ForgotPassword;