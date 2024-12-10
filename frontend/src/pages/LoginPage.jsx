import React, { useState, useEffect } from "react";
import "./BasePage.css"; // Shared styles for login and register pages
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserAlt, FaLock, FaMailBulk, FaEnvelope } from "react-icons/fa";

// Fungsi untuk menyimpan data dengan waktu kedaluwarsa
function setItemWithExpiry(key, value, expiryInMinutes) {
  const now = new Date();
  const expiryTime = now.getTime() + expiryInMinutes * 60 * 1000;
  const data = {
    value,
    expiry: expiryTime,
  };
  localStorage.setItem(key, JSON.stringify(data));
}

// Fungsi untuk membaca data dari localStorage dan memeriksa kedaluwarsa
function getItemWithExpiry(key) {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }
  try {
    const item = JSON.parse(itemStr);
    const now = new Date();
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key); // Hapus data jika sudah kedaluwarsa
      return null;
    }
    return item.value;
  } catch (error) {
    console.error("Failed to parse localStorage data:", error);
    localStorage.removeItem(key); // Hapus data yang corrupt
    return null;
  }
}

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Periksa apakah accountId masih valid di localStorage
  useEffect(() => {
    const storedAccountId = getItemWithExpiry("accountid");
    console.log("Stored accountId:", storedAccountId);
    if (storedAccountId) {
      navigate("/"); // Jika accountId valid, langsung arahkan ke halaman utama
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/account/login", {
        email,
        password,
      });

      const { success, message, data } = response.data;
      if (success && data) {
        // Simpan accountId dengan waktu expired 1 jam
        setItemWithExpiry("accountid", data, 60);
        navigate("/"); // Arahkan ke halaman utama setelah login
      } else if (data) {
        // Jika verifikasi diperlukan
        await axios.post("http://localhost:8000/account/verification/request", {
          accountId: data,
        });
        localStorage.setItem("verifid", data); // Simpan sementara
        setItemWithExpiry("accountid", data, 60); // Simpan sementara
        navigate("/register/verify/" + localStorage.getItem("verifid")); // Arahkan ke halaman verifikasi
      } else {
        setError(message || "Login failed.");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  console.log("accountId:", localStorage.getItem("accountid"));

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
