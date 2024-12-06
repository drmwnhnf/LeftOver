import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaRocketchat,
  FaUserCircle,
  FaShoppingBasket,
  FaChevronLeft,
  FaChevronRight,
  FaSignOutAlt,
  FaSignInAlt,
  FaSearch,
} from "react-icons/fa";
import "./OrderPage.css";

const OrderPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accountid, setAccountId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const storedAccountId = localStorage.getItem("accountid");
    if (storedAccountId) {
      setIsLoggedIn(true);
      setAccountId(storedAccountId);
      fetchOrders(storedAccountId);
    } else {
      setIsLoggedIn(false);
      setAccountId(null);
      navigate("/login");
    }
  }, [currentPage]);

  const fetchOrders = async (accountId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/order/out/${accountId}`
      );
      const data = await response.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search query:", searchQuery);
  };

  const calculateTotalPages = () => Math.ceil(orders.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleOrderClick = (orderId) => {
    navigate(`/orderdetails/${orderId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("accountid");
    setIsLoggedIn(false);
    setAccountId(null);
    navigate("/login");
  };

  const displayedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="orderpage-container">
      {/* Navbar */}
      <div className="orderpage-navbar">
        <div className="navbar-logo">Order History</div>
        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            placeholder="Search orders..."
            className="search-input-field"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-submit-button">
            <FaSearch />
          </button>
        </form>
        <div className="navbar-icons-container">
          {isLoggedIn ? (
            <>
              <div
                onClick={() => navigate(`/chat`)}
                className="navbar-icon-button"
              >
                <FaRocketchat />
              </div>
              <div
                onClick={() => navigate(`/order/${accountid}`)}
                className="navbar-icon-button"
              >
                <FaShoppingBasket />
              </div>
              <div
                onClick={() => navigate(`/profile/${accountid}`)}
                className="navbar-icon-button"
              >
                <FaUserCircle />
              </div>
              <div
                onClick={handleLogout}
                className="navbar-icon-button logout-icon-button"
              >
                <FaSignOutAlt />
              </div>
            </>
          ) : (
            <div
              onClick={() => navigate("/login")}
              className="navbar-icon-button"
            >
              <FaSignInAlt />
            </div>
          )}
        </div>
      </div>

      {/* Orders Grid */}
      <div className="order-grid">
        {displayedOrders.length > 0 ? (
          displayedOrders.map((order) => (
            <div
              key={order.orderid}
              className="order-card-container"
              onClick={() => handleOrderClick(order.orderid)}
            >
              <img
                src={order.item_image || "https://via.placeholder.com/100"}
                alt={order.item_name || "Product"}
                className="order-card-image"
              />
              <div className="order-info-container">
                <h3 className="order-product-name">{order.item_name}</h3>
                <p className="order-product-quantity">
                  Quantity: {order.quantity}
                </p>
                <p className="order-total-price">
                  Total: Rp{order.totalprice?.toLocaleString()}
                </p>
                <p className={`order-status ${order.status.toLowerCase()}`}>
                  {order.status}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>Loading orders...</p>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination-container">
        <div
          onClick={() => handlePageChange(currentPage - 1)}
          className={`pagination-button ${currentPage === 1 ? "disabled" : ""}`}
        >
          <FaChevronLeft /> Prev
        </div>
        <span className="page-info">
          Page {currentPage} of {calculateTotalPages()}
        </span>
        <div
          onClick={() => handlePageChange(currentPage + 1)}
          className={`pagination-button ${
            currentPage === calculateTotalPages() ? "disabled" : ""
          }`}
        >
          Next <FaChevronRight />
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
