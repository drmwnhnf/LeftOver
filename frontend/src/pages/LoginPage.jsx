import React, { useState } from "react";
import "./BasePage.css"; // Shared styles for login and register pages
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserAlt, FaLock, FaMailBulk, FaMailchimp, FaEnvelope } from "react-icons/fa";

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

      const { success, message, data } = response.data; // Destructure response data sesuai format backend
      console.log("Login response:", response.data);
      console.log("Data:", response.data.data);
      if (!success) {
        if (data) {
          // Step 2: Kirim permintaan verifikasi
          await axios.post(
            "http://localhost:8000/account/verification/request", 
            { accountId: data }
          );
          localStorage.setItem("accountid", data); // Simpan accountId
          console.log("Request verifikasi berhasil");

          // Step 3: Arahkan ke halaman verifikasi
          navigate("/register/verify/" + response.data.data);
          return;
        }
 // Redirect ke halaman dashboard setelah login
      } else {
        if (data) {
        // Simpan accountId dan waktu timeout ke localStorage
        const expirationTime = new Date().getTime() + 60 * 60 * 1000; // 1 jam dari sekarang
        localStorage.setItem("accountid", data); // Simpan accountId
        localStorage.setItem("expiration", expirationTime);
        console.log("id:", localStorage.getItem("accountid"));
        navigate("/");
      }
    }
    } catch (err) {
      console.error("Login failed:", err);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>LeftOver</h2>
        <form onSubmit={handleLogin}>
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
