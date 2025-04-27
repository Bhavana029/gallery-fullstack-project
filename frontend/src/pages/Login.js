import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";
import "bootstrap/dist/css/bootstrap.min.css";
const API_BASE_URL3 = `${process.env.REACT_APP_API_BASE_URL}`;



const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL3}/api/auth/login`, formData);
      alert(res.data.message || "Login successful!");
  
      // ✅ Store token and userId in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId); // Store userId
  
      navigate("/home");
    } catch (err) {
      console.error("Login Error:", err.response?.data);
      setError(err.response?.data?.message || "Invalid Credentials");
    }
  };
  

  return (
     
    <Container className="auth-container">
      <h2>Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
        </Form.Group>
        <Button variant="primary" type="submit">Sign In</Button>
      </Form>
    </Container>
    
  );
};

export default Login;
