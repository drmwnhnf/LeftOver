// frontend/src/pages/LoginPage.jsx
import React, { useState } from "react";
import { login } from "../api";
import "./AuthPage.css"; // Shared styles for login and register pages
import { Link } from "react-router-dom";
import { FaUserAlt, FaLock } from "react-icons/fa";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ username, password });
      console.log("Login successful", response.data);
      // Handle login success (e.g., store token, redirect)
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>LeftOver</h2>
        <form onSubmit={handleLogin}>
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
            LOGIN
          </button>
        </form>
        <p>
          Don’t have an account? <Link to="/register">Register Here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;