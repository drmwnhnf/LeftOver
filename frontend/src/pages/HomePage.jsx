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
} from "react-icons/fa";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [allItems, setAllItems] = useState([]);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [featuredItem, setFeaturedItem] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accountid, setAccountId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // State untuk paginasi
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    // Cek status login dari localStorage
    const storedAccountId = localStorage.getItem("accountid");
    if (storedAccountId) {
      setIsLoggedIn(true);
      setAccountId(storedAccountId);
    }

    fetchItems();
  }, [currentPage]);

  const fetchItems = async () => {
    try {
      const response = await fetch("http://localhost:8000/item/");
      const data = await response.json();

      if (data.success) {
        // Simpan semua item
        setAllItems(data.data);

        // Potong item untuk halaman pertama
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageItems = data.data.slice(startIndex, endIndex);
        setDisplayedItems(pageItems);

        // Cari item dengan harga tertinggi dari halaman pertama
        if (data.data.length > 0) {
          const highestPricedItem = data.data.reduce((prev, current) =>
            prev.price > current.price ? prev : current
          );
          setFeaturedItem(highestPricedItem);
        }
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // Fungsi untuk menangani pencarian
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Simpan query pencarian di localStorage
      localStorage.setItem("searchQuery", searchQuery);
      // Navigate ke halaman search
      navigate("/search");
    }
  };

  // Fungsi untuk menangani klik halaman
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);

    // Potong item untuk halaman baru
    const startIndex = (newPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = allItems.slice(startIndex, endIndex);
    setDisplayedItems(pageItems);
  };

  // Fungsi untuk menghitung total halaman
  const calculateTotalPages = () => {
    return Math.ceil(allItems.length / itemsPerPage);
  };

  // Fungsi untuk menangani klik item
  const handleItemClick = (itemid) => {
    localStorage.setItem("selectedItemId", itemid);
    navigate(`/item/${itemid}`);
  };

  // Fungsi untuk menghandle navigasi dengan cek login
  const handleNavigate = (path) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      alert("Silakan login terlebih dahulu untuk mengakses fitur ini");
      navigate("/login");
    }
  };

  // Fungsi logout
  const handleLogout = () => {
    localStorage.removeItem("accountid");
    setIsLoggedIn(false);
    setAccountId(null);
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

      {/* Featured Section */}
      {featuredItem && (
        <div
          className="featured-section"
          style={{
            backgroundImage: `url(${
              featuredItem.imageurl || "https://via.placeholder.com/300"
            })`,
          }}
          onClick={() => handleItemClick(featuredItem.itemid)}
        >
          <div className="featured-overlay">
            <p className="featured-subtext">Featured Item</p>
            <h2 className="featured-title">{featuredItem.name}</h2>
            <p className="featured-price">Rp{featuredItem.price}</p>
            <p className="featured-seller">
              Seller: {featuredItem.seller_name}
            </p>
          </div>
        </div>
      )}

      <div className="items-grid">
        {displayedItems.length > 0 ? (
          displayedItems.map((item) => (
            <div
              key={item.itemid}
              className="item-card"
              onClick={() => handleItemClick(item.itemid)}
            >
              <img
                src={item.imageurl || "https://via.placeholder.com/150"}
                alt={item.name}
                className="item-image"
              />
              <div className="item-info">
                <h3>{item.name}</h3>
                <p>Rp{item.price}</p>
                <p>{item.firstname + " " + item.surname}</p>
              </div>
            </div>
          ))
        ) : (
          <p>LOADING......</p>
        )}
      </div>

      {/* Komponen Pagination */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          <FaChevronLeft /> Prev
        </button>

        <span className="page-info">
          Page {currentPage} of {calculateTotalPages()}
        </span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === calculateTotalPages()}
          className="pagination-btn"
        >
          Next <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default HomePage;