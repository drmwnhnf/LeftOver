import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OrderPage.css";
import {
  FaRocketchat,
  FaShoppingBasket,
  FaSignOutAlt,
  FaSignInAlt,
  FaHouseUser,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Change based on your auth logic
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("buy");
  const [itemData, setItemData] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const navigate = useNavigate();

  //   const storedAccountId = localStorage.getItem("accountid");

  useEffect(() => {
    const storedAccountId = localStorage.getItem("accountid"); // Replace with actual stored account ID logic
    if(storedAccountId) {
      setIsLoggedIn(true);
      fetchOrderHistory(storedAccountId);
    } else {
      setIsLoggedIn(false);
    }
    console.log("Logged in as accountid:", storedAccountId);
  }, []);
  
  const fetchOrderHistory = async (storedAccountId) => {
    setLoadingOrders(true);
    try {
      const buyerId = storedAccountId;
      const response = await axios.get(
        `http://localhost:8000/order/out/${storedAccountId}`
      );

      if (response.data.success) {
        const orderHistory = response.data.data; // Ini adalah array
        setOrders(orderHistory);

        console.log("Order History:", orderHistory);

        // Iterasi melalui setiap elemen orderHistory untuk mendapatkan itemid
        const itemDataArray = await Promise.all(
          orderHistory.map(async (orders) => {
            const itemid = orders.itemid;
            const dataresponse = await axios.get(
              `http://localhost:8000/item/${itemid}`
            );
            return dataresponse.data.data;
          })
        );

        setItemData(itemDataArray); // Menyimpan data item dalam bentuk array
        console.log("Item Data:", itemDataArray);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching order history:", error);
      setIsLoading(false);
      setLoadingOrders(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search:", searchQuery);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="container">
      <div className="header">
        <form
          onSubmit={handleSearch}
          style={{ width: "100%", display: "flex", alignItems: "center" }}
        >
          <input
            type="text"
            placeholder="What do you want to eat today?"
            className="search-bar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" style={{ display: "none" }}>
            Search
          </button>
        </form>
        <div className="icons">
          {isLoggedIn ? (
            <>
              <button className="icon" onClick={() => handleNavigate("/chat")}>
                <FaRocketchat />
              </button>
              <button className="icon" onClick={() => handleNavigate("/")}>
                <FaHouseUser />
              </button>
              <button className="icon logout" onClick={handleLogout}>
                <FaSignOutAlt />
              </button>
            </>
          ) : (
            <button className="icon" onClick={() => navigate("/login")}>
              <FaSignInAlt />
            </button>
          )}
        </div>
      </div>

      <div className="order-history">
        <h2>My Order</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : orders.length > 0 ? (
          orders.map((order) => (
            itemData.map((itemData) => (
            <div className="order-card" key={order.id}>
              <div className="order-header">
                <span className="store-name">{itemData.firstname + " " + itemData.surname}</span>
                <span className="order-date">{order.date}</span>
                <span className={`order-status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
              <div className="order-details">
                <img
                  src={itemData.imageurl}
                  alt={itemData.item_name}
                  className="order-image"
                />
                <div className="order-info">
                  <p className="product-name">{itemData.item_name}</p>
                  <p className="product-quantity">
                    {order.quantity} barang x Rp {itemData.price}
                  </p>
                </div>
                <div className="order-total">
                  <p>Total Harga</p>
                  <p>Rp {order.totalprice}</p>
                </div>
              </div>
            </div>
          ))))
        ) : (
          <p>No orders found</p>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
