// frontend/src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import { fetchItems, createItem, updateItem, deleteItem } from "../api";
import "./HomePage.css";

const HomePage = () => {
  const [items, setItems] = useState([
    { id: 1, name: "Sample Item 1" },
    { id: 2, name: "Sample Item 2" },
  ]);

  const [newItem, setNewItem] = useState("");

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
      <h2>Home Page</h2>
      <div className="input-section">
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="New item"
          type="text"
        />
        <button onClick={handleCreate}>Add Item</button>
      </div>
      <ul className="item-list">
        {items.map((item) => (
          <li key={item.id} className="item">
            <input
              value={item.name}
              onChange={(e) => handleUpdate(item.id, e.target.value)}
              type="text"
            />
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;