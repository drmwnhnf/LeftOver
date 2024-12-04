import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaRocketchat,
  FaUserCircle,
  FaShoppingBasket,
  FaSignOutAlt,
  FaSignInAlt,
} from "react-icons/fa";
import "./ItemDetailPage.css";

const ItemDetailPage = () => {
  const [itemData, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accountId, setAccountId] = useState(null);
  const { itemid } = useParams(); // Mengambil itemId dari URL
  const navigate = useNavigate();

  useEffect(() => {
    // Cek status login
    const storedAccountId = localStorage.getItem("accountid");
    if (storedAccountId) {
      setIsLoggedIn(true);
      setAccountId(storedAccountId);
    }

    const fetchItemDetails = async () => {
      try {
        const itemid = localStorage.getItem("selectedItemId");
        console.log("Fetching item details with ID:", itemid);
        if (!itemid) {
          setError("No item ID found");
          setLoading(false);
          return;
        }

        // Fetch item details
        const itemResponse = await axios.get(
          `http://localhost:8000/item/${itemid}`
        );

        if (itemResponse.data.success) {
          const itemData = itemResponse.data.data;
          setItem(itemData);
          console.log("Item Data:", itemData);
        } else {
          setError(itemResponse.data.message);
          
        }
      } catch (err) {
        setError("Failed to fetch item details");
        
        console.error(err);
        navigate("/");
      }
    };
    
    fetchItemDetails();
  }, [itemid]);

  // State untuk quantity
  const [quantity, setQuantity] = useState(1);

  // Handler untuk menambah dan mengurangi quantity
  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  // Handler navigasi dengan cek login
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

  // Handler order
  const handleOrder = () => {
    if (!isLoggedIn) {
      alert("Silakan login terlebih dahulu untuk melakukan order");
      navigate("/login");
      return;
    }
    // Logika order selanjutnya
    navigate("/order", {
      state: {
        item: item,
        quantity: quantity,
      },
    });
  };

  // Error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Pastikan item tersedia sebelum render
  if (!itemData) {
    return <div>Loading....</div>;
  }

  console.log("Item:", itemData);

  return (
    <div className="container">
      {/* Header dengan navigasi */}
      <div className="header">
        <input
          type="text"
          placeholder="What do you want to eat today?"
          className="search-bar"
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

      {/* Konten detail item */}
      <div className="content">
        <div className="location">Location: Jakarta Timur</div>

        <div className="main">
          <img
            src={itemData.imageurl || "https://via.placeholder.com/200"}
            alt="Product"
            className="product-image"
          />
          <div className="details">
            <h2>{itemData.item_name}</h2>
            <p className="price">Rp {itemData.price.toLocaleString()}</p>
            <p>Stock: {itemData.amount}</p>

            <h3>Description</h3>
            <p>{itemData.description}</p>
            <p>Expired On: {itemData.expirationdate}</p>
          </div>

          <div className="purchase">
            <div className="purchase-box">
              <div className="quantity-control">
                <button onClick={handleDecreaseQuantity}>-</button>
                <span>{quantity}</span>
                <button onClick={handleIncreaseQuantity}>+</button>
              </div>
              <div classname="sub-total">
                Subtotal: Rp {(itemData.price * quantity).toLocaleString()}
              </div>
              <button
                className="order-button"
                onClick={handleOrder}
                disabled={itemData.amount <= quantity}
              >
                ORDER
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="contact">
        <img
          src={itemData.seller_avatar || "https://via.placeholder.com/50"}
          alt="User"
          className="contact-avatar"
        />
        <div>
          <p className="contact-name">
            {itemData.firstname + " " + itemData.surname}
          </p>
          <p>Email : {itemData.seller_email}</p>
          <p>Phone : {"0812345678901"}</p>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPage;