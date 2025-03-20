import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authProvider } from '../../../src/authProvider';
import logo from './logo.png';
import './login.css';
import { AuthPage } from '@refinedev/antd';
import { Form, Input, Button, Checkbox, Card, Space } from 'antd';
import {
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons';
const Login = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
  
    const handleLoginCredentials = async (values) => {
      try {
        await authProvider.login({ username: values.email, password: values.password });
        navigate('/supersecret-admin-panel-a');
      } catch (error) {
        setErrorMessage('Invalid login credentials');
        console.error('Error logging in:', error);
      }
    };
    const [passwordVisible, setPasswordVisible] = useState(false);
    return (
  
      <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: '24rem',
          borderRadius: '1rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        }}
        styles={{ body: { padding: '1.5rem' } }}
      >
        {/* Logo */}
        <div style={{ marginBottom: '0.5rem', textAlign: 'center' }}>
          <img src={logo} alt="Logo" style={{ width: '150px' }} />
        </div>

        {/* Title */}
        <h1
          className="animated-text"
          style={{
            width: '100%',
            textAlign: 'center',
            fontSize: 'xx-large',
            marginBottom: '16px',
          }}
        >
          Welcome Back !
        </h1>

        {/* Form */}
        <Form
          onFinish={handleLoginCredentials}
          onFinishFailed={(errorInfo) => {
            console.log('Failed:', errorInfo);
          }}
          layout="vertical"
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Email Field */}
            <Form.Item
              name="email"
              rules={[
                { type: 'email', message: 'The input is not valid E-mail!' },
                { required: true, message: 'Please input your E-mail!' },
              ]}
              style={{ marginBottom: 0 }}
            >
              <Input
                placeholder="Email"
                className="custom-input"
              />
            </Form.Item>

            {/* Password Field */}
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Password is required' }]}
              style={{ marginBottom: 0 }}
            >
              <Input.Password
                placeholder="Password"
                visibilityToggle={true}
                iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
               className="custom-input"
              />
            </Form.Item>

            {/* Remember Me */}
            <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: '16px' }}>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            {/* Submit Button */}
            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  width: '100%',
                  backgroundColor: '#2563eb',
                  borderColor: '#2563eb',
                  color: '#fff',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
              >
                Sign in
              </Button>
            </Form.Item>

            {/* Error Message */}
            {errorMessage && (
              <div style={{ color: '#f5222d', textAlign: 'center' }}>
                {errorMessage}
              </div>
            )}
          </Space>
        </Form>
      </Card>
    </div>
    );
  };
  
  export default Login;