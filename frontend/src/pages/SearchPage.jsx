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

const SearchPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [distanceRange, setDistanceRange] = useState([0, 1000000]);
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accountid, setAccountId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(() => {
    return localStorage.getItem("searchQuery") || "";
  });

  useEffect(() => {
    const storedAccountId = localStorage.getItem("accountid");
    if (storedAccountId) {
      setIsLoggedIn(true);
      setAccountId(storedAccountId);
    }
    fetchItems();
    localStorage.removeItem("searchQuery"); // Clear search query after using it
  }, [searchQuery]);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const searchResponse = await fetch("http://localhost:8000/item/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          searchQuery,
          itemCategory: null, // Sesuaikan dengan kebutuhan
          itemCondition: null, // Sesuaikan dengan kebutuhan
          page: currentPage,
          priceRange,
          distanceRange,
          rating,
          selectedTags,
        }),
      });

      const searchData = await searchResponse.json();
      console.log("Search Results:", searchData);

      if (searchData.success) {
        setItems(searchData.data);
      } else {
        console.error("Failed to fetch items", searchData.message);
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
    distanceRange,
    rating,
    selectedTags,
  ]);

  const handleItemClick = (itemid) => {
    localStorage.setItem("selectedItemId", itemid);
    navigate(`/item/${itemid}`);
  };

  const handleTagToggle = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
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
    return Math.ceil(items.length / itemsPerPage);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Calculate the items to display based on the current page
  const displayedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <input
          type="text"
          placeholder="What do you want to eat..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="icons">
          {isLoggedIn ? (
            <>
              <button className="icon" onClick={() => handleNavigate("/chat")}>
                <FaRocketchat />
              </button>
              <button className="icon" onClick={() => handleNavigate("/order")}>
                <FaShoppingBasket />
              </button>
              <button
                className="icon"
                onClick={() => handleNavigate("/profile")}
              >
                <FaUserCircle />
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

      {/* Content Wrapper */}
      <div className="content">
        {/* Filters */}
        <div className="filter-container">
          <h3>Filters</h3>
          <div className="filter-section">
            <label>Price Range</label>
            <input
              type="range"
              min="0"
              max="1000000"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
            />
            <input
              type="range"
              min="0"
              max="1000000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            />
            <p>Rp{priceRange[0]} - Rp{priceRange[1]}</p>
          </div>
          <div className="filter-section">
            <label>Distance Range</label>
            <input
              type="range"
              min="0"
              max="1000000"
              value={distanceRange[0]}
              onChange={(e) => setDistanceRange([Number(e.target.value), distanceRange[1]])}
            />
            <input
              type="range"
              min="0"
              max="1000000"
              value={distanceRange[1]}
              onChange={(e) => setDistanceRange([distanceRange[0], Number(e.target.value)])}
            />
            <p>{distanceRange[0]}m - {distanceRange[1]}m</p>
          </div>
          <div className="filter-section">
            <label>Rating</label>
            <input
              type="number"
              min="0"
              max="5"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            />
          </div>
          <div className="tag-container">
            <button
              className={`tag-button ${selectedTags.includes("tag1") ? "selected" : ""}`}
              onClick={() => handleTagToggle("tag1")}
            >
              Tag 1
            </button>
            <button
              className={`tag-button ${selectedTags.includes("tag2") ? "selected" : ""}`}
              onClick={() => handleTagToggle("tag2")}
            >
              Tag 2
            </button>
            {/* Add more tags as needed */}
          </div>
        </div>

        {/* Items */}
        <div className="items-grid">
          {isLoading ? (
            <p>Loading...</p>
          ) : displayedItems.length > 0 ? (
            displayedItems.map((item) => (
              <div
                key={item.itemid}
                className="item-card"
                onClick={() => handleItemClick(item.itemid)}
              >
                <img
                  src={item.imageurl || "https://via.placeholder.com/150"}
                  alt={item.name}
                />
                <h3>{item.name}</h3>
                <p>Rp{item.price}</p>
                <p>Seller: {item.firstname + " " + item.surname}</p>
              </div>
            ))
          ) : (
            <p>No items found</p>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {calculateTotalPages()}
        </span>
        <button
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