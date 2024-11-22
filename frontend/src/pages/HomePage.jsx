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
      
      </section>
      <section className="items-section">
        {items.map((item) => (
          <div key={item.id} className="item-card">
            <img src="https://i.ibb.co.com/82mgvjg/download.jpg" alt="Sayur Kol" className="item-image" />
            <h3 className="item-name">Sayur Kol</h3>
            <p className="item-price">{item.price}</p>
            <span className="item-seller">Toko Barokah Sederhana</span>
          </div>
        ))}
      </section>
    </div>
  );
  
};

export default HomePage;
