// frontend/src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import { fetchItems, createItem, updateItem, deleteItem } from "../api";
import "./HomePage.css";

const HomePage = () => {
  const [items, setItems] = useState([
    { id: 1, name: "Sample Item 1", price: "$5.00"},
    { id: 2, name: "Sample Item 2", price: "$7.00"},
  ]);

  //const [newItem, setNewItem] = useState("");

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
    <div className="homepage">
      <header className="header">
        <input
          className="search-bar"
          placeholder="What do you want to eat today?"
          type="text"
        />
        <div className="icons">
          <i className="icon upload-icon"></i>
          <i className="icon cart-icon"></i>
          <i className="icon user-icon"></i>
        </div>
      </header>

      <section className="featured-item">
        <img
          src="featured-image.jpg"
          alt="Featured Item"
          className="featured-image"
        />
        <div className="featured-overlay">
          <h2 className="featured-title">FEATURED ITEM TITLE</h2>
          <span className="featured-price">$7.89</span>
        </div>
      </section>

      <section className="items-section">
        {items.map((item) => (
          <div key={item.id} className="item-card">
            <img src={item.image} alt={item.name} className="item-image" />
            <h3 className="item-name">{item.name}</h3>
            <p className="item-price">{item.price}</p>
            <span className="item-seller">Seller</span>
          </div>
        ))}
      </section>
    </div>
  );
};

export default HomePage;
