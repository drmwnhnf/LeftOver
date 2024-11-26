import React from "react";
import "./SearchPage.css";

const SearchPage = () => {
  return (
    <div className="search-page">
      <header className="header">
        <input
          type="text"
          placeholder="something good"
          className="search-bar"
        />
        <div className="icons">
          <button className="icon">🔼</button>
          <button className="icon">🛒</button>
          <button className="icon">👤</button>
        </div>
      </header>

      <div className="content">
        <div className="filter-container">
          <h3>Filter By</h3>
          <div className="filter-section">
            <label>Price Range</label>
            <input type="range" min="0" max="1000000" className="slider" />
            <div className="range-label">
              <span>Rp0</span>
              <span>Rp1.000.000</span>
            </div>
          </div>

          <div className="filter-section">
            <label>Range from Seller</label>
            <input type="range" min="0" max="1000000" className="slider" />
            <div className="range-label">
              <span>0</span>
              <span>1.000.000 KM</span>
            </div>
          </div>

          <div className="filter-section">
            <label>Rating</label>
            <input type="range" min="1" max="5" step="1" className="slider" />
            <div className="range-label">
              <span>1</span>
              <span>5</span>
            </div>
          </div>

          <div className="tags">
            {Array.from({ length: 20 }, (_, i) => (
              <button className="tag" key={i}>
                Tag ×
              </button>
            ))}
          </div>
        </div>

        <div className="items-grid">
          {Array.from({ length: 6 }, (_, i) => (
            <div className="item-card" key={i}>
              <img
                src="https://via.placeholder.com/150"
                alt="Item"
                className="item-image"
              />
              <p className="item-title">Item Title</p>
              <p className="item-price">RpItem Price</p>
              <p className="item-seller">Seller</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
