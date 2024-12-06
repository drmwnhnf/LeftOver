import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaRocketchat,
  FaShoppingBasket,
  FaSignOutAlt,
  FaSignInAlt,
  FaSearch,
} from "react-icons/fa";
import "./AccountPage.css";

const AccountPage = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("buy");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accountId, setAccountId] = useState(localStorage.getItem("accountid"));
  const [searchQuery, setSearchQuery] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    firstname: "",
    surname: "",
    email: "",
    country: "",
    city: "",
    district: "",
    address: "",
    imageURL: "",
    phonenumber: "",
  });

  useEffect(() => {
    if (!accountId) {
      navigate("/login");
    } else {
      setIsLoggedIn(true);
      fetchUserProfile();
      fetchOrderHistory();
    }
  }, [accountId, activeTab]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/account/${accountId}`
      );
      if (response.data.success) {
        const profile = response.data.data;
        setUserProfile(profile);
        setEditForm({
          firstname: profile.firstname || "",
          surname: profile.surname || "",
          email: profile.email || "",
          country: profile.country || "",
          city: profile.city || "",
          district: profile.district || "",
          address: profile.address || "",
          imageURL: profile.imageURL || "",
          phonenumber: profile.phonenumber || "",
        });
      } else {
        console.error("Failed to fetch user profile");
        handleLogout();
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchOrderHistory = async () => {
    setIsLoading(true);
    try {
      const endpoint =
        activeTab === "buy"
          ? `http://localhost:8000/order/out/${accountId}`
          : `http://localhost:8000/order/in/${accountId}`;
      const response = await axios.get(endpoint);
      if (response.data.success) {
        setOrderHistory(response.data.data);
      } else {
        setOrderHistory([]);
      }
    } catch (error) {
      console.error("Error fetching order history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accountid");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put("http://localhost:8000/account/edit", {
        ...editForm,
        accountid: accountId,
      });
      if (response.data.success) {
        setUserProfile(response.data.data);
        setIsEditModalOpen(false);
        alert("Profile updated successfully");
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleDeleteAccount = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete your account?"
    );
    if (confirm) {
      try {
        const response = await axios.delete(
          "http://localhost:8000/account/delete",
          {
            data: { accountId },
          }
        );
        if (response.data.success) {
          handleLogout();
        } else {
          alert("Failed to delete account");
        }
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    }
  };

  // Fungsi Upload Gambar
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "xk7bhbie"); // Ganti dengan upload preset Anda
    formData.append("cloud_name", "dqzb4rdvg"); // Ganti dengan cloud name Anda

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dqzb4rdvg/image/upload",
        formData
      );
      if (response.status === 200) {
        const imageUrl = response.data.secure_url;
        setEditForm((prev) => ({ ...prev, imageURL: imageUrl }));
        alert("Gambar berhasil diunggah!");
      } else {
        alert("Gagal mengunggah gambar.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Terjadi kesalahan saat mengunggah gambar.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      localStorage.setItem("searchQuery", searchQuery);
      navigate("/search");
    }
  };

  const renderEditModal = () => {
    if (!isEditModalOpen) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Edit Profile</h2>
          <form onSubmit={handleEditSubmit}>
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstname"
                value={editForm.firstname}
                onChange={handleEditChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="surname"
                value={editForm.surname}
                onChange={handleEditChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleEditChange}
                required
                disabled
              />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={editForm.country}
                onChange={handleEditChange}
              />
            </div>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={editForm.city}
                onChange={handleEditChange}
              />
            </div>
            <div className="form-group">
              <label>District</label>
              <input
                type="text"
                name="district"
                value={editForm.district}
                onChange={handleEditChange}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                value={editForm.address}
                onChange={handleEditChange}
              />
            </div>
            <div className="form-group">
              <label>Upload Image</label>
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phonenumber"
                value={editForm.phonenumber}
                onChange={handleEditChange}
              />
            </div>
            <div className="modal-actions">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="btn-cancel"
              >
                Cancel
              </button>
              <button type="submit" className="btn-save">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="account-container">
      <div className="account-header">
        <div className="account-navbar-logo">LeftOver</div>
        <form onSubmit={handleSearch} className="account-search-bar">
          <input
            type="text"
            placeholder="Search for items..."
            className="account-search-input-field"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="account-search-submit-button">
            <FaSearch />
          </button>
        </form>
        <div className="account-icons">
          {isLoggedIn ? (
            <>
              <button
                onClick={() => navigate(`/chat/`)}
                className="account-icon"
              >
                <FaRocketchat />
              </button>
              <button
                onClick={() => navigate(`/order/${accountid}`)}
                className="account-icon"
              >
                <FaShoppingBasket />
              </button>
              <button onClick={handleLogout} className="account-icon logout">
                <FaSignOutAlt />
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="navbar-icon-button"
            >
              <FaSignInAlt />
            </button>
          )}
        </div>
      </div>

      <div className="account-content">
        {userProfile && (
          <div className="account-profile-card">
            <div className="account-avatar">
              {userProfile.imageurl ? (
                <img
                  src={userProfile.imageurl}
                  alt="Profile"
                  className="account-profile-image"
                />
              ) : (
                <div className="account-profile-placeholder">
                  {userProfile.firstname ? userProfile.firstname[0] : "?"}
                </div>
              )}
            </div>
            <h2>
              {userProfile.firstname} {userProfile.surname}
            </h2>
            <p>{userProfile.email}</p>
            <p>{userProfile.phonenumber}</p>
            <p>{userProfile.address}</p>
            <button
              className="account-btn-edit"
              onClick={() => setIsEditModalOpen(true)}
            >
              <FaEdit /> Edit Profile
            </button>
            <button
              className="account-btn-delete"
              onClick={handleDeleteAccount}
            >
              <FaTrash /> Delete Account
            </button>
          </div>
        )}
      </div>
      <div classname="account-order-container">
        <div className="account-order-history">
          <div className="account-filter-buttons">
            <button
              className={`account-filter-btn ${
                activeTab === "buy" ? "active" : ""
              }`}
              onClick={() => setActiveTab("buy")}
            >
              Buy Orders
            </button>
            <button
              className={`account-filter-btn ${
                activeTab === "sell" ? "active" : ""
              }`}
              onClick={() => setActiveTab("sell")}
            >
              Sell Orders
            </button>
          </div>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="account-order-list">
              {orderHistory.map((order) => (
                <div key={order.orderid} className="account-order-item">
                  <div className="account-order-body">
                    <img
                      src={order.item_image || "https://via.placeholder.com/80"}
                      alt={order.item_name || "Item"}
                      className="account-order-image"
                    />
                    <div>
                      <h3>{order.item_name}</h3>
                      <p>Quantity: {order.quantity}</p>
                    </div>
                  </div>
                  <div className="account-order-details">
                    <div className="account-total-price">
                      Rp {order.totalprice}
                    </div>
                    <div
                      className={`account-status ${order.status.toLowerCase()}`}
                    >
                      {order.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {renderEditModal()}
      </div>
    </div>
  );
};

export default AccountPage;
