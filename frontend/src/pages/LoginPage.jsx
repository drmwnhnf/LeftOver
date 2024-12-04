import React, { useState } from "react";
import "./BasePage.css"; // Shared styles for login and register pages
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserAlt, FaLock } from "react-icons/fa";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/account/login", {
        email,
        password,
      });

      const { accountid/*, token*/ } = response.data; // Pastikan server mengembalikan accountId dan token
      console.log("Login Success", response.data);

      // Simpan accountId dan waktu timeout ke localStorage
      const expirationTime = new Date().getTime() + 60 * 60 * 1000; // 1 jam dari sekarang
      localStorage.setItem("accountid", accountid);
      // localStorage.setItem("token", token); // Jika ada token untuk keamanan tambahan
      localStorage.setItem("expiration", expirationTime);

      navigate("/"); // Redirect ke halaman dashboard setelah login
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Please check your credentials.");
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
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
        {error && <p className="error-message">{error}</p>}
        <p>
          Don’t have an account? <Link to="/register">Register Here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
