import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import "./SellerItem.css";

const SellerItem = () => {
  const navigate = useNavigate();
  const [accountId, setAccountId] = useState(localStorage.getItem("accountid"));
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    expirationDate: "",
    imageURL: "",
    description: "",
    amount: 1,
    itemCategory: [],
    itemCondition: "FRESH",
  });

  useEffect(() => {
    if (!accountId) {
      navigate("/login");
    } else {
      fetchItems();
    }
  }, [accountId]);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://backend-beta-beryl.vercel.app/item/seller/${accountId}`
      );
      if (response.data.success) {
        setItems(response.data.data);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddItemSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://backend-beta-beryl.vercel.app/item/create", {
        ...newItem,
        sellerid: accountId,
      });
      if (response.data.success) {
        alert("Item added successfully!");
        setIsAddModalOpen(false);
        fetchItems();
      } else {
        alert("Failed to add item.");
      }
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirm) {
      try {
        const response = await axios.delete(
          `https://backend-beta-beryl.vercel.app/item/delete/${itemId}`
        );
        if (response.data.success) {
          alert("Item deleted successfully!");
          fetchItems();
        } else {
          alert("Failed to delete item.");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  // Fungsi Upload Gambar
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "xk7bhbie"); // Ganti dengan upload preset Anda
    formData.append("cloud_name", "dqzb4rdvg"); // Ganti dengan cloud name Anda

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dqzb4rdvg/image/upload",
        formData
      );
      if (response.status === 200) {
        const imageUrl = response.data.secure_url;
        setNewItem((prev) => ({ ...prev, imageurl: imageUrl }));
        alert("Gambar berhasil diunggah!");
      } else {
        alert("Gagal mengunggah gambar.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Terjadi kesalahan saat mengunggah gambar.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImage(file);
    }
  };

  const renderAddModal = () => {
    if (!isAddModalOpen) return null;
    return (
      <div className="seller-modal-overlay">
        <div className="seller-modal-content">
          <h2>Add New Item</h2>
          <form onSubmit={handleAddItemSubmit}>
            <div className="seller-form-group">
              <label>Item Name</label>
              <input
                type="text"
                name="name"
                value={newItem.name}
                onChange={handleAddItemChange}
                required
              />
            </div>
            <div className="seller-form-group">
              <label>Price</label>
              <input
                type="number"
                name="price"
                value={newItem.price}
                onChange={handleAddItemChange}
                required
              />
            </div>
            <div className="seller-form-group">
              <label>Expiration Date</label>
              <input
                type="date"
                name="expirationDate"
                value={newItem.expirationDate}
                onChange={handleAddItemChange}
                required
              />
            </div>
            <div className="seller-form-group">
              <label>Upload Image</label>
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
            <div className="seller-form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={newItem.description}
                onChange={handleAddItemChange}
              />
            </div>
            <div className="seller-form-group">
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                value={newItem.amount}
                onChange={handleAddItemChange}
                required
              />
            </div>
            <div className="seller-form-group">
              <label>Condition</label>
              <select
                name="itemCondition"
                value={newItem.itemCondition}
                onChange={handleAddItemChange}
                required
              >
                <option value="FRESH">Fresh</option>
                <option value="NEAR_EXPIRED">Near Expired</option>
                <option value="OPENED">Opened</option>
                <option value="LEFTOVER">Leftover</option>
              </select>
            </div>
            <div className="seller-modal-actions">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="seller-btn-cancel"
              >
                Cancel
              </button>
              <button type="submit" className="seller-btn-save">
                Add Item
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState({
    itemid: "",
    name: "",
    price: "",
    expirationDate: "",
    imageURL: "",
    description: "",
    amount: 1,
    itemCategory: [],
    itemCondition: "FRESH",
  });

  const handleEditItemChange = (e) => {
    const { name, value } = e.target;
    setEditItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditItemSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://backend-beta-beryl.vercel.app/item/edit/${editItem.itemid}`,
        editItem
      );
      if (response.data.success) {
        alert("Item updated successfully!");
        setIsEditModalOpen(false);
        fetchItems();
      } else {
        alert("Failed to update item.");
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const openEditModal = (item) => {
    setEditItem({
      itemid: item.itemid,
      name: item.name,
      price: item.price,
      expirationDate: item.expirationdate,
      imageURL: item.imageurl,
      description: item.description,
      amount: item.amount,
      itemCategory: item.categories || [],
      itemCondition: item.condition || "FRESH",
    });
    setIsEditModalOpen(true);
  };

  const renderEditModal = () => {
    if (!isEditModalOpen) return null;
    return (
      <div className="seller-modal-overlay">
        <div className="seller-modal-content">
          <h2>Edit Item</h2>
          <form onSubmit={handleEditItemSubmit}>
            <div className="seller-form-group">
              <label>Item Name</label>
              <input
                type="text"
                name="name"
                value={editItem.name}
                onChange={handleEditItemChange}
                required
              />
            </div>
            <div className="seller-form-group">
              <label>Price</label>
              <input
                type="number"
                name="price"
                value={editItem.price}
                onChange={handleEditItemChange}
                required
              />
            </div>
            <div className="seller-form-group">
              <label>Expiration Date</label>
              <input
                type="date"
                name="expirationDate"
                value={editItem.expirationDate}
                onChange={handleEditItemChange}
                required
              />
            </div>
            <div className="seller-form-group">
              <label>Upload Image</label>
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
            <div className="seller-form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={editItem.description}
                onChange={handleEditItemChange}
              />
            </div>
            <div className="seller-form-group">
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                value={editItem.amount}
                onChange={handleEditItemChange}
                required
              />
            </div>
            <div className="seller-form-group">
              <label>Condition</label>
              <select
                name="itemCondition"
                value={editItem.itemCondition}
                onChange={handleEditItemChange}
                required
              >
                <option value="FRESH">Fresh</option>
                <option value="NEAR_EXPIRED">Near Expired</option>
                <option value="OPENED">Opened</option>
                <option value="LEFTOVER">Leftover</option>
              </select>
            </div>
            <div className="seller-modal-actions">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="seller-btn-cancel"
              >
                Cancel
              </button>
              <button type="submit" className="seller-btn-save">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="seller-container">
      <div className="seller-header">
        <button
          className="seller-back-btn"
          onClick={() => navigate("/profile/" + accountId)}
        >
          Back to Profile
        </button>
        <h1>Your Items</h1>
        <button
          className="seller-add-btn"
          onClick={() => setIsAddModalOpen(true)}
        >
          <FaPlus /> Add Item
        </button>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="seller-item-list">
          {items.map((item) => (
            <div key={item.itemid} className="seller-item-card">
              <img
                src={item.imageurl || "https://via.placeholder.com/150"}
                alt={item.name}
                className="seller-item-image"
              />
              <div className="seller-item-info">
                <h3>{item.name}</h3>
                <p>Price: Rp {item.price}</p>
                <p>Amount: {item.amount}</p>
              </div>
              <div className="seller-item-actions">
                <button
                  className="seller-edit-btn"
                  onClick={() => openEditModal(item)}
                >
                  <FaEdit /> Edit
                </button>
                <button
                  className="seller-delete-btn"
                  onClick={() => handleDeleteItem(item.itemid)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {renderAddModal()}
      {renderEditModal()}
    </div>
  );
};

export default SellerItem;