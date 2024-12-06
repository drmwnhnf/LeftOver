import React, { useState } from "react";
import "./AuthPage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaUserAlt, FaLock, FaEnvelope } from "react-icons/fa";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        username,
        email,
        password,
        firstName,
        surname,
        country: "",
        city: "",
        district: "",
        address: "",
        imageURL: "",
      };

      // Hapus field kosong dari payload
      Object.keys(payload).forEach((key) => {
        if (payload[key] === "") delete payload[key];
      });

      // Step 1: Kirim data ke endpoint register
      const registerResponse = await axios.post(
        "https://backend-beta-beryl.vercel.app/account/register",
        payload
      );

      const { success, message, data } = registerResponse.data;
      if (!success) {
        console.log(message || "Registration failed. Please try again.");
        return;
      }

      console.log("Registrasi berhasil:", registerResponse.data);

      // Simpan accountId di localStorage
      localStorage.setItem("accountid", data);

      // Step 2: Kirim permintaan verifikasi
      await axios.post(
        "https://backend-beta-beryl.vercel.app/account/verification/request", 
        { accountId: data }
      );

      console.log("Request verifikasi berhasil");

      // Step 3: Arahkan ke halaman verifikasi
      navigate(`/register/verify/${localStorage.getItem("accountid")}`);
    } catch (err) {
      console.error("Error registrasi atau verifikasi:", err);
      setError("Registrasi gagal. Silakan cek data Anda.");
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
            <FaUserAlt className="icon" />
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <FaUserAlt className="icon" />
            <input
              type="text"
              placeholder="Surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
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
        {error && <p className="error-message">{error}</p>}
        <p>
          Already have an account? <Link to="/login">Login Here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
