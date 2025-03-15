import React, { useState } from "react";
import axios from "axios";
import { Input, Button, Form, Alert } from 'antd';
import "../css/register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    passwordHash: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (values) => {
    setError(null);
    setSuccess(null);
    try {
      const response = await axios.post("http://localhost:3001/auth/register", values);
      setSuccess("Registration successful! You can now log in.");
      setFormData({
        email: "",
        passwordHash: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        address: "",
      });
    } catch (error) {
      setError(
        error.response?.data?.message || "An error occurred during registration. Please try again."
      );
    }
  };

  return (
    <div className="register-container">
      <h2>สมัครสมาชิก</h2>
      <Form
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
            aria-label="Enter your email"
          />
        </Form.Item>

        <Form.Item
          label="รหัสผ่าน"
          name="passwordHash"
          rules={[{ required: true, message: 'Please enter your password!' }]}
        >
          <Input.Password
            name="passwordHash"
            value={formData.passwordHash}
            onChange={handleChange}
            aria-label="Enter your password"
          />
        </Form.Item>

        <Form.Item
          label="ชื่อจริง"
          name="firstName"
          rules={[{ required: true, message: 'Please enter your first name!' }]}
        >
          <Input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            aria-label="Enter your first name"
          />
        </Form.Item>

        <Form.Item
          label="นามสกุล"
          name="lastName"
          rules={[{ required: true, message: 'Please enter your last name!' }]}
        >
          <Input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            aria-label="Enter your last name"
          />
        </Form.Item>

        <Form.Item
          label="เบอร์โทร"
          name="phoneNumber"
          rules={[{ required: true, message: 'Please enter your phone number!' }]}
        >
          <Input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            aria-label="Enter your phone number"
          />
        </Form.Item>

        <Form.Item
          label="ที่อยู่"
          name="address"
          rules={[{ required: true, message: 'Please enter your address!' }]}
        >
          <Input
            name="address"
            value={formData.address}
            onChange={handleChange}
            aria-label="Enter your address"
          />
        </Form.Item>

        {error && <Alert message={error} type="error" />}
        {success && <Alert message={success} type="success" />}

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            สมัครสมาชิก
          </Button>
        </Form.Item>

        <div className="login-link">
          มีบัญชีอยู่แล้ว{" "}
          <a href="/" className="register-link-anchor">
            เข้าสู่ระบบ
          </a>
        </div>
      </Form>
    </div>
  );
};

export default Register;
