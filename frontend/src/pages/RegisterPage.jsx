// frontend/src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { register } from "../api";
import "./AuthPage.css";
import { Link } from "react-router-dom";
import { FaUserAlt, FaLock, FaEnvelope } from "react-icons/fa";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await register({ username, email, password });
      console.log("Registration successful", response.data);
      // Handle registration success (e.g., redirect to login)
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>LeftOver</h2>
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <FaEnvelope className="icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <FaUserAlt className="icon" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <FaLock className="icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button">
            REGISTER
          </button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login Here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;