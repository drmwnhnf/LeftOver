import axios from "axios";
import React from "react";
import "./AccountPage.css";

const AccountPage = () => {
  // const [username, setUsername] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");

  // const handleUpdate = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.put("/api/account", {
  //       username,
  //       email,
  //       password,
  //     });
  //     console.log("Account updated:", response.data);
  //   } catch (error) {
  //     console.error("Error updating account:", error);
  //   }
  // };

  return (
    <div className="container">
      <header className="header">
        <input
          type="text"
          placeholder="What do you want to eat today?"
          className="search-bar"
        />
        <div className="icons">
          <button className="icon">🔼</button>
          <button className="icon">🛒</button>
          <button className="icon">👤</button>
        </div>
      </header>

      <div className="content">
        <div className="profile-card">
          <div className="avatar"></div>
          <h3>Ryan Reynolds</h3>
          <p>Komplek Tanjung Barat, Blok E No 19, Jakarta Selatan</p>
        </div>

        <div className="order-history">
          <h2>Order History</h2>
          <div className="filter-buttons">
            <button className="filter-btn">Product Buy</button>
            <button className="filter-btn">Product Sell</button>
          </div>

          <div className="order-list">
            <div className="order-item">
              <div className="order-header">
                <h3>Royal Mart</h3>
                <span>12 Feb 2024</span>
                <span className="status done">Done</span>
              </div>
              <div className="order-body">
                <img
                  src="https://via.placeholder.com/100"
                  alt="Item"
                  className="order-image"
                />
                <div>
                  <p>Blueberry Manis Segar</p>
                  <p>1 barang x Rp 25.000</p>
                </div>
                <p className="total-price">
                  Total Harga
                  <br />
                  Rp 25.000
                </p>
              </div>
            </div>

            <div className="order-item">
              <div className="order-header">
                <h3>King Mart</h3>
                <span>10 Mar 2024</span>
                <span className="status pending">Pending</span>
              </div>
              <div className="order-body">
                <img
                  src="https://via.placeholder.com/100"
                  alt="Item"
                  className="order-image"
                />
                <div>
                  <p>Blueberry Manis Segar</p>
                  <p>1 barang x Rp 25.000</p>
                </div>
                <p className="total-price">
                  Total Harga
                  <br />
                  Rp 25.000
                </p>
              </div>
            </div>

            <div className="order-item">
              <div className="order-header">
                <h3>King Mart</h3>
                <span>10 Jan 2024</span>
                <span className="status cancel">Cancel</span>
              </div>
              <div className="order-body">
                <img
                  src="https://via.placeholder.com/100"
                  alt="Item"
                  className="order-image"
                />
                <div>
                  <p>Blueberry Manis Segar</p>
                  <p>1 barang x Rp 25.000</p>
                </div>
                <p className="total-price">
                  Total Harga
                  <br />
                  Rp 25.000
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
