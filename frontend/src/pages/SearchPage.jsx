import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaRocketchat,
  FaUserCircle,
  FaShoppingBasket,
  FaSignOutAlt,
  FaSignInAlt,
} from "react-icons/fa";
import "./SearchPage.css";

const categories = [
  "FRUITS",
  "VEGETABLES",
  "BEEF",
  "POULTRIES",
  "PORK",
  "SEAFOOD",
  "LAMB",
  "MILKS",
  "PLANT_PROTEINS",
  "OTHER_ANIMAL_PRODUCTS",
  "OTHER_PLANT_PRODUCTS",
  "STAPLES",
  "PROCESSED",
  "BEVERAGES",
  "SEASONINGS",
  "SNACKS",
];

const conditions = ["FRESH", "NEAR_EXPIRED", "OPENED", "LEFTOVER"];

const SearchPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accountId, setAccountId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(
    localStorage.getItem("searchQuery") || ""
  );
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [expirationDate, setExpirationDate] = useState("");

  useEffect(() => {
    const storedAccountId = localStorage.getItem("accountid");
    if (storedAccountId) {
      setIsLoggedIn(true);
      setAccountId(storedAccountId);
    }
    fetchItems();
    localStorage.removeItem("searchQuery");
  }, []);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/item/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          searchQuery: searchQuery.trim(),
          page: currentPage,
          priceRange,
          categories: selectedCategories,
          conditions: selectedConditions,
          expirationDate,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setItems(data.data);
      } else {
        console.error("Failed to fetch items:", data.message);
        setItems([]);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [
    searchQuery,
    priceRange,
    currentPage,
    selectedCategories,
    selectedConditions,
    expirationDate,
  ]);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleCondition = (condition) => {
    setSelectedConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition]
    );
  };

  const handlePriceChange = (index, value) => {
    const updatedRange = [...priceRange];
    updatedRange[index] = value;
    if (index === 0 && value > updatedRange[1]) updatedRange[1] = value; // Ensure min <= max
    if (index === 1 && value < updatedRange[0]) updatedRange[0] = value; // Ensure max >= min
    setPriceRange(updatedRange);
  };

  const handleItemClick = (itemid) => {
    localStorage.setItem("selectedItemId", itemid);
    navigate(`/item/${itemid}`);
  };

  const handleNavigate = (path) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      alert("Silakan login terlebih dahulu untuk mengakses fitur ini");
      navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accountid");
    setIsLoggedIn(false);
    setAccountId(null);
    navigate("/login");
  };

  const calculateTotalPages = () => {
    return Math.ceil(items.length / 20); // 20 items per page
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="searchpage-container">
      {/* Navbar */}
      <div className="searchpage-navbar">
        <span className="navbar-logo">LeftOver</span>
        <div className="search-bar">
          <input
            type="text"
            className="search-input-field"
            placeholder="Search for items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-submit-button" onClick={fetchItems}>
            Search
          </button>
        </div>
        <div className="navbar-icons-container">
          {isLoggedIn ? (
            <>
              <button
                className="navbar-icon-button"
                onClick={() => handleNavigate("/chat")}
              >
                <FaRocketchat />
              </button>
              <button
                className="navbar-icon-button"
                onClick={() => handleNavigate(`/order/${accountId}`)}
              >
                <FaShoppingBasket />
              </button>
              <button
                className="navbar-icon-button"
                onClick={() => navigate(`/profile/${accountId}`)}
              >
                <FaUserCircle />
              </button>
              <button
                className="navbar-icon-button logout-icon-button"
                onClick={handleLogout}
              >
                <FaSignOutAlt />
              </button>
            </>
          ) : (
            <button
              className="navbar-icon-button"
              onClick={() => navigate("/login")}
            >
              <FaSignInAlt />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="filter-container">
        <h3>Filters</h3>
        <div className="filter-section">
          <h4>Categories</h4>
          <div className="filter-buttons">
            {categories.map((category) => (
              <button
                key={category}
                className={`filter-button ${
                  selectedCategories.includes(category) ? "active" : ""
                }`}
                onClick={() => toggleCategory(category)}
              >
                {category.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-section">
          <h4>Conditions</h4>
          <div className="filter-buttons">
            {conditions.map((condition) => (
              <button
                key={condition}
                className={`filter-button ${
                  selectedConditions.includes(condition) ? "active" : ""
                }`}
                onClick={() => toggleCondition(condition)}
              >
                {condition.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-section">
          <label>Price Range</label>
          <div className="price-sliders">
            <div>
              <label>Min: Rp{priceRange[0]}</label>
              <input
                type="range"
                min="0"
                max="1000000"
                step="1000"
                value={priceRange[0]}
                onChange={(e) => handlePriceChange(0, Number(e.target.value))}
              />
            </div>
            <div>
              <label>Max: Rp{priceRange[1]}</label>
              <input
                type="range"
                min="0"
                max="1000000"
                step="1000"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(1, Number(e.target.value))}
              />
            </div>
          </div>
        </div>
        <div className="filter-section">
          <label>Expiration Date</label>
          <input
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
          />
        </div>
      </div>

      {/* Items Grid */}
      <div className="items-grid">
        {isLoading ? (
          <p>Loading...</p>
        ) : items.length > 0 ? (
          items.map((item) => (
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
                <p className="product-price">Rp {item.price}</p>
                <p className="product-seller">
                  {item.firstname} {item.surname}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No items found</p>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination-container">
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="page-info">
          Page {currentPage} of {calculateTotalPages()}
        </span>
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === calculateTotalPages()}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SearchPage;
