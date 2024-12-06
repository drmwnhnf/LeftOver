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
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [allItems, setAllItems] = useState([]);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accountid, setAccountId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    const storedAccountId = localStorage.getItem("accountid");
    if (storedAccountId) {
      setIsLoggedIn(true);
      setAccountId(storedAccountId);
    } else {
      setIsLoggedIn(false);
      setAccountId(null);
    }
    fetchItems();
  }, [currentPage]);

  const fetchItems = async () => {
    try {
      const response = await fetch("https://backend-beta-beryl.vercel.app/item/");
      const data = await response.json();
      if (data.success) {
        setAllItems(data.data);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setDisplayedItems(data.data.slice(startIndex, endIndex));
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      localStorage.setItem("searchQuery", searchQuery);
      navigate("/search");
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    const startIndex = (newPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedItems(allItems.slice(startIndex, endIndex));
  };

  const calculateTotalPages = () => Math.ceil(allItems.length / itemsPerPage);

  const handleItemClick = (itemid) => {
    localStorage.setItem("selectedItemId", itemid);
    navigate(`/item/${itemid}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("accountid");
    setIsLoggedIn(false);
    setAccountId(null);
    navigate("/login");
  };

  return (
    <div className="homepage-container">
      {/* Navbar */}
      <div className="homepage-navbar">
        <div className="navbar-logo">LeftOver</div>
        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            placeholder="Search for items..."
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
              <button
                onClick={() => navigate(`/chat/`)}
                className="navbar-icon-button"
              >
                <FaRocketchat />
              </button>
              <button
                onClick={() => navigate(`/order/${accountid}`)}
                className="navbar-icon-button"
              >
                <FaShoppingBasket />
              </button>
              <button
                onClick={() => navigate(`/profile/${accountid}`)}
                className="navbar-icon-button"
              >
                <FaUserCircle />
              </button>
              <button
                onClick={handleLogout}
                className="navbar-icon-button logout-icon-button"
              >
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

      {/* Featured Section */}
      <div className="homepage-featured-section">
        <div className="featured-placeholder-box"></div>
      </div>

      {/* Items Grid */}
      <div className="item-grid">
        {displayedItems.length > 0 ? (
          displayedItems.map((item) => (
            <div
              key={item.itemid}
              className="item-card-container"
              onClick={() => handleItemClick(item.itemid)}
            >
              <img
                src={item.imageurl || "https://via.placeholder.com/150"}
                alt={item.name}
                className="product-image"
              />
              <div className="product-info-container">
                <h3 className="product-name">{item.name}</h3>
                <p className="product-price">Rp{item.price.toLocaleString()}</p>
                <p className="product-seller">
                  {item.firstname} {item.surname}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination-container">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          <FaChevronLeft /> Prev
        </button>
        <span className="page-info">
          Page {currentPage} of {calculateTotalPages()}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === calculateTotalPages()}
          className="pagination-button"
        >
          Next <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default HomePage;
