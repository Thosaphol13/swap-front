import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Input, Button, Checkbox, Form, Alert, Modal } from 'antd';
import '../css/Login.css'; // ไฟล์ CSS แยกสำหรับจัดการสไตล์

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post('https://swap-back-rh5j.onrender.com/auth/login', values);
      console.log('Login successful:', response.data);
  
      const { access_token, id } = response.data;
      const res = await axios.get(`https://swap-back-rh5j.onrender.com/users/${id}`);
      const userData = res.data;
      
      setUser(userData);
  
      console.log('Status:', userData.status);
  
      if (userData.status === 'off' || userData.banned === 'true') {
        Modal.error({
          title: 'คุณโดนแบน',
          content: 'กรุณาติดต่อทีมงานเพื่อขอความช่วยเหลือ',
          okText: 'ตกลง',
          onOk: () => {
            navigate('/');
          }
        });
        return;
      }
  
      if (access_token && id) {
        localStorage.setItem('token', access_token);
        localStorage.setItem('userId', id);
        navigate(`/main/${id}`);
      } else {
        setError('Failed to retrieve user ID or token.');
      }
    } catch (error) {
      setError(error.response ? error.response.data.message : 'An error occurred.');
    }
  };
  

  return (
    <div className="login-container">
      <h2 className="text-center">Login</h2>
      {error && <Alert message={error} type="error" />}

      <Form
        name="เข้าสู่ระบบ"
        className="login-form"
        onFinish={handleSubmit}
        initialValues={formData}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          label="อีเมล"
          name="email"
          rules={[{ required: true, message: 'Please enter your email!' }]}
        >
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ใส่อีเมล"
            aria-label="Email"
          />
        </Form.Item>

        <Form.Item
          label="รหัสผ่าน"
          name="password"
          rules={[{ required: true, message: 'Please enter your password!' }]}
        >
          <Input.Password
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="ใส่รหัสผ่าน"
            aria-label="Password"
          />
        </Form.Item>

        <Form.Item>
          <Checkbox defaultChecked>จดจำรหัสผ่าน</Checkbox>
          <a href="#!" className="forgot-password-link" style={{ float: 'right' }}>ลืมรหัสผ่าน?</a>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            เข้าสู่ระบบ
          </Button>
        </Form.Item>

        <div className="register-link">
          ไม่มีบัญชี? <a href="/register" className="register-link-anchor">สมัครสมาชิก</a>
        </div>
      </Form>
    </div>
  );
};

export default Login;
