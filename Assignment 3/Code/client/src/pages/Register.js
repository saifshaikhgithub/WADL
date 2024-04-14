import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';
import "./register.css"

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await axios.post('/users/register', values);
      setLoading(false);
      message.success('Registration Successful');
      navigate('/login');
    } catch (error) {
      setLoading(false);
      message.error('Invalid email or password');
    }
  };

  return (
    <div className="register-page">
      <Form layout="vertical" onFinish={onFinish} className="register-form">
        <h1 className="register-header">REGISTER FORM</h1>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input your name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your email' }]}
        >
          <Input type="email" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password' }]}
        >
          <Input type="password" />
        </Form.Item>
        <div className="register-buttons">
          <Link to="/login" className="register-login-link">
            Already registered? Click here to login
          </Link>
          <Button type="primary" htmlType="submit" className="register-submit-button">
            {loading ? <Spinner /> : 'Register'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Register;
