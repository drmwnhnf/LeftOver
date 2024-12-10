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
  const [accountId, setAccountId] = useState(null);
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
    imageurl: "",
    phonenumber: "",
  });

  

  const locationData = {
    countries: [
      {
        name: "Indonesia",
        cities: [
          {
            name: "Jakarta",
            districts: [
              "Central Jakarta",
              "West Jakarta",
              "South Jakarta",
              "East Jakarta",
              "North Jakarta",
            ],
          },
          {
            name: "Surabaya",
            districts: [
              "Central Surabaya",
              "East Surabaya",
              "South Surabaya",
              "West Surabaya",
            ],
          },
          {
            name: "Bandung",
            districts: [
              "Cibeunying",
              "Cicendo",
              "Coblong",
              "Lengkong",
              "Regol",
            ],
          },
          {
            name: "Medan",
            districts: [
              "Medan Baru",
              "Medan Selayang",
              "Medan Timur",
              "Medan Tuntungan",
            ],
          },
          {
            name: "Yogyakarta",
            districts: [
              "Danurejan",
              "Gondomanan",
              "Jetis",
              "Mergangsan",
              "Umbulharjo",
            ],
          },
          {
            name: "Denpasar",
            districts: [
              "Denpasar Barat",
              "Denpasar Timur",
              "Denpasar Selatan",
              "Denpasar Utara",
            ],
          },
          {
            name: "Makassar",
            districts: [
              "Biringkanaya",
              "Makassar",
              "Mariso",
              "Panakkukang",
              "Ujung Pandang",
            ],
          },
          {
            name: "Semarang",
            districts: [
              "Banyumanik",
              "Candisari",
              "Gajahmungkur",
              "Pedurungan",
              "Tembalang",
            ],
          },
          {
            name: "Palembang",
            districts: [
              "Alang-Alang Lebar",
              "Bukit Kecil",
              "Ilir Barat",
              "Ilir Timur",
              "Sukarami",
            ],
          },
          {
            name: "Bali",
            districts: ["Badung", "Bangli", "Gianyar", "Karangasem", "Tabanan"],
          },
          {
            name: "Depok",
            districts: [
              "Beji",
              "Bojong Sari",
              "Cimanggis",
              "Cinere",
              "Pancoran Mas",
              "Sawangan",
              "Sukmajaya",
              "Tapos",
            ],
          },
          {
            name: "Bogor",
            districts: [
              "Bogor Barat",
              "Bogor Selatan",
              "Bogor Tengah",
              "Bogor Timur",
              "Bogor Utara",
              "Tanah Sareal",
            ],
          },
          {
            name: "Lombok",
            districts: ["Mataram", "Praya", "Selong", "Tanjung", "Gerung"],
          },
        ],
      },
      {
        name: "Malaysia",
        cities: [
          {
            name: "Kuala Lumpur",
            districts: ["Bukit Bintang", "Cheras", "Wangsa Maju"],
          },
          {
            name: "Penang",
            districts: ["George Town", "Bayan Lepas", "Balik Pulau"],
          },
        ],
      },
      {
        name: "Singapore",
        cities: [
          {
            name: "Central Region",
            districts: ["Bukit Merah", "Geylang", "Marina South"],
          },
          {
            name: "North Region",
            districts: ["Woodlands", "Sembawang", "Yishun"],
          },
        ],
      },
    ],
  };

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    const country = locationData.countries.find(
      (c) => c.name === selectedCountry
    );
    setEditForm((prev) => ({
      ...prev,
      country: selectedCountry,
      city: prev.city || "", // Tetap gunakan nilai sebelumnya jika ada
      district: prev.district || "", // Tetap gunakan nilai sebelumnya jika ada
    }));
    setCities(country ? country.cities : []);
    setDistricts([]);
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    const city = cities.find((c) => c.name === selectedCity);
    setEditForm((prev) => ({
      ...prev,
      city: selectedCity,
      district: prev.district || "", // Tetap gunakan nilai sebelumnya jika ada
    }));
    setDistricts(city ? city.districts : []);
  };


  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setEditForm((prev) => ({ ...prev, district: selectedDistrict }));
  };

 useEffect(() => {
   const storedAccountData = localStorage.getItem("accountid");
   if (storedAccountData) {
     const parsedData = JSON.parse(storedAccountData);
     if (parsedData.value) {
       setIsLoggedIn(true);
       setAccountId(parsedData.value);
     }
   } else {
     navigate("/login");
   }
 }, []);

 useEffect(() => {
   if (accountId) {
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
          imageurl: profile.imageurl || "",
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
          ? `http://localhost:8000/order/out/${accountId}` // Endpoint untuk order made
          : `http://localhost:8000/order/in/${accountId}`; // Endpoint untuk incoming order
      const response = await axios.get(endpoint);
      if (response.data.success) {
        setOrderHistory(response.data.data || []); // Set array kosong jika tidak ada data
      } else {
        setOrderHistory([]); // Jika gagal, set array kosong
      }
    } catch (error) {
      console.error("Error fetching order history:", error);
      setOrderHistory([]); // Tangani error dengan mengosongkan data
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
        console.log("updated data :", response.data.data);
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
        const imageurl = response.data.secure_url;
        setEditForm((prev) => ({ ...prev, imageurl: imageurl }));
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

  useEffect(() => {
    if (isEditModalOpen && editForm.country) {
      const country = locationData.countries.find(
        (c) => c.name === editForm.country
      );
      setCities(country ? country.cities : []);
      if (editForm.city) {
        const city = country?.cities.find((c) => c.name === editForm.city);
        setDistricts(city ? city.districts : []);
      }
    }
  }, [isEditModalOpen, editForm.country, editForm.city]);

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
              <select
                name="country"
                value={editForm.country}
                onChange={handleCountryChange}
                required
              >
                <option value="">Select Country</option>
                {locationData.countries.map((country, index) => (
                  <option key={index} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>City</label>
              <select
                name="city"
                value={editForm.city}
                onChange={handleCityChange}
                required
                disabled={!cities.length}
              >
                <option value="">Select City</option>
                {cities.map((city, index) => (
                  <option key={index} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>District</label>
              <select
                name="district"
                value={editForm.district}
                onChange={handleDistrictChange}
                required
                disabled={!districts.length}
              >
                <option value="">Select District</option>
                {districts.map((district, index) => (
                  <option key={index} value={district}>
                    {district}
                  </option>
                ))}
              </select>
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
              {editForm.imageurl && (
                <div>
                  <p>Current Image:</p>
                  <img
                    src={editForm.imageurl}
                    alt="Current Profile"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "5px",
                    }}
                  />
                </div>
              )}
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

  console.log("Current accountId:", accountId);
  console.log("Active Tab:", activeTab);

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
                onClick={() => navigate(`/order/${accountId}`)}
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
            <p>
              {userProfile.address}, {userProfile.district}, {userProfile.city},{" "}
              {userProfile.country}
            </p>
            <button
              className="account-btn-edit"
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit Profile
              <FaEdit />
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
      <div className="account-order-container">
        <div className="account-order-history">
          <div className="account-filter-buttons">
            <button
              className={`account-filter-btn ${
                activeTab === "buy" ? "active" : ""
              }`}
              onClick={() => setActiveTab("buy")}
            >
              Orders Made
            </button>
            <button
              className={`account-filter-btn ${
                activeTab === "sell" ? "active" : ""
              }`}
              onClick={() => setActiveTab("sell")}
            >
              Incoming Orders
            </button>
            <button
              className="account-filter-btn"
              onClick={() => navigate(`/myitems/${accountId}`)}
            >
              My Items
            </button>
          </div>

          {isLoading ? (
            <p>Loading...</p>
          ) : orderHistory.length > 0 ? (
            <div className="account-order-list">
              {orderHistory.map((order) => (
                <div
                  key={order.orderid}
                  className="account-order-item"
                  onClick={() => navigate(`/orderdetails/${order.orderid}`)}
                >
                  <img
                    src={order.item_image || "https://via.placeholder.com/80"}
                    alt={order.item_name || "Item"}
                    className="account-order-image"
                  />
                  <div>
                    <h3>{order.item_name}</h3>
                    <p>Quantity: {order.quantity}</p>
                  </div>
                  <div className="account-total-price">
                    Rp {order.totalprice.toLocaleString()}
                  </div>
                  <div
                    className={`account-status ${order.status}`}
                  >
                    {order.status}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No {activeTab === "buy" ? "orders made" : "incoming orders"}.</p>
          )}
        </div>
        {renderEditModal()}
      </div>
    </div>
  );
};

export default AccountPage;
