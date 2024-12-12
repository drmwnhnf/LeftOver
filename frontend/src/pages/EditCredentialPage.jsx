import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { apiAccount } from "../api";
import "./EditCredential.css";

const EditCredentialPage = () => {
  const [formData, setFormData] = useState({
    accountId: "",
    email: "",
    username: "",
    oldPassword: "",
    newPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
  });

  const [responseMessage, setResponseMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedAccountData = localStorage.getItem("accountid");
    if (storedAccountData) {
      try {
        const parsedData = JSON.parse(storedAccountData);
        if (parsedData.value) {
          setFormData((prevData) => ({
            ...prevData,
            accountId: parsedData.value,
          }));
        }
      } catch (error) {
        console.error("Failed to parse account ID:", error);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${apiAccount}/edit/credentials`,
        formData
      );
      setResponseMessage(response.data.message);

      if (response.data.success) {
        localStorage.removeItem("accountid");
        navigate("/login");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setResponseMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="edit-credential-container">
      <form onSubmit={handleSubmit} className="edit-credential-form">
        <h2>Edit Account Credentials</h2>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Old Password:
          <div className="password-input">
            <input
              type={showPassword.oldPassword ? "text" : "password"}
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              required
            />
            <span
              className="toggle-password"
              onClick={() => togglePasswordVisibility("oldPassword")}
            >
              {showPassword.oldPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </label>
        <label>
          New Password:
          <div className="password-input">
            <input
              type={showPassword.newPassword ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
            <span
              className="toggle-password"
              onClick={() => togglePasswordVisibility("newPassword")}
            >
              {showPassword.newPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </label>
        <div className="button-group">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          <button type="submit" className="save-button">
            Save Changes
          </button>
        </div>
      </form>
      {responseMessage && <p className="response-message">{responseMessage}</p>}
    </div>
  );
};

export default EditCredentialPage;