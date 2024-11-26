// frontend/src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import { fetchItems, createItem, updateItem, deleteItem } from "../api";
import "./HomePage.css";

const HomePage = () => {
  
  // const [newItem, setNewItem] = useState("");

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const response = await fetchItems();
    setItems(response.data);
  };

  const handleCreate = async () => {
    await createItem({ name: newItem });
    setNewItem("");
    loadItems();
  };

  const handleUpdate = async (id, name) => {
    await updateItem(id, { name });
    loadItems();
  };

  const handleDelete = async (id) => {
    await deleteItem(id);
    loadItems();
  };

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

      <main className="main">
        <div className="featured-section">
          <div className="featured-item">
            <img
              src="https://via.placeholder.com/400x300"
              alt="Featured Item"
              className="featured-image"
            />
            <div className="featured-text">
              <h2>FEATURED ITEM TITLE</h2>
              <p className="featured-price">RpItem Price</p>
              <p className="featured-label">Featured on LeftOver</p>
            </div>
          </div>
          <button className="arrow-button">&lt;</button>
          <button className="arrow-button">&gt;</button>
        </div>

        <div className="items-grid">
          <div className="item-card">
            <img
              src="https://via.placeholder.com/150"
              alt="Item"
              className="item-image"
            />
            <div className="item-info">
              <h3>Item Title</h3>
              <p>RpItem Price</p>
              <p>Seller</p>
            </div>
          </div>
          <div className="item-card">
            <img
              src="https://via.placeholder.com/150"
              alt="Item"
              className="item-image"
            />
            <div className="item-info">
              <h3>Item Title</h3>
              <p>RpItem Price</p>
              <p>Seller</p>
            </div>
          </div>
          <div className="item-card">
            <img
              src="https://via.placeholder.com/150"
              alt="Item"
              className="item-image"
            />
            <div className="item-info">
              <h3>Item Title</h3>
              <p>RpItem Price</p>
              <p>Seller</p>
            </div>
          </div>
          <div className="item-card">
            <img
              src="https://via.placeholder.com/150"
              alt="Item"
              className="item-image"
            />
            <div className="item-info">
              <h3>Item Title</h3>
              <p>RpItem Price</p>
              <p>Seller</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
