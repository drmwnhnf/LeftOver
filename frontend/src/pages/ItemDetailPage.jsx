import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { apiItem, apiChat, apiOrder } from "../api";
import {
  FaRocketchat,
  FaUserCircle,
  FaShoppingBasket,
  FaSignOutAlt,
  FaSignInAlt,
  FaCommentAlt,
  FaHouseUser,
  FaSearch,
} from "react-icons/fa";
import "./ItemDetailPage.css";

const ItemDetailPage = () => {
  const [itemData, setItemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accountId, setAccountId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { itemid } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // UseEffect untuk memuat account ID dari localStorage
  useEffect(() => {
    const storedAccountData = localStorage.getItem("accountid");
    if (storedAccountData) {
      try {
        const parsedData = JSON.parse(storedAccountData); // Parsing JSON
        if (parsedData.value) {
          setIsLoggedIn(true);
          setAccountId(parsedData.value); // Set accountId ke state
        }
      } catch (error) {
        console.error("Failed to parse account ID:", error);
      }
    }
  }, []);

  // UseEffect untuk menyimpan firstAccountId ke localStorage setelah accountId diperbarui
  useEffect(() => {
    if (accountId) {
      console.log("Account ID updated:", accountId); // Debug log
      localStorage.setItem("firstAccountId", accountId);
      console.log("First Account ID set to:", accountId); // Debug log
    }
  }, [accountId]); // Dipanggil setiap kali accountId berubah

  // Fetch data item
  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await axios.get(
          `${apiItem}/${itemid}`
        );
        if (response.data.success) {
          setItemData(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError("Failed to fetch item details");
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [itemid]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      localStorage.setItem("searchQuery", searchQuery);
      navigate("/search");
    }
  };

  const handleChatSeller = async () => {
    if (!isLoggedIn) {
      alert("Please login to chat with the seller.");
      navigate("/login");
      return;
    }
    try {
      const response = await axios.post(`${apiChat}/start`, {
        firstAccountId: accountId,
        secondAccountId: itemData.sellerid,
      });
      localStorage.setItem("secondAccountId", itemData.sellerid);
      if (response.data.success) {
        navigate(`/chat/${response.data.data.chatroomid}`);
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      alert("Error starting chat.");
    }
  };

  const handleCreateOrder = async () => {
    if (!isLoggedIn) {
      alert("Please login to place an order.");
      navigate("/login");
      return;
    }
    try {
      const response = await axios.post(`${apiOrder}/create`, {
        itemid: itemData.itemid,
        sellerid: itemData.sellerid,
        buyerid: accountId,
        quantity: quantity,
      });
      if (response.data.success) {
        alert("Order placed successfully.");
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      alert("Error placing order.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="updated-item-det-container">
      <header className="updated-item-det-header">
        <div className="updated-item-det-logo">LeftOver</div>
        <form onSubmit={handleSearch} className="updated-item-det-search-bar">
          <input
            type="text"
            placeholder="Search for items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">
            <FaSearch />
          </button>
        </form>
        <div className="updated-item-det-icons">
          {isLoggedIn ? (
            <>
              <FaHouseUser onClick={() => navigate("/")} />
              <FaShoppingBasket
                onClick={() => navigate(`/order/${accountId}`)}
              />
              <FaUserCircle onClick={() => navigate(`/profile/${accountId}`)} />
              <FaSignOutAlt
                onClick={() => {
                  localStorage.removeItem("accountid");
                  setIsLoggedIn(false);
                  navigate("/login");
                }}
              />
            </>
          ) : (
            <FaSignInAlt onClick={() => navigate("/login")} />
          )}
        </div>
      </header>
      <main className="updated-item-det-content">
        <div className="updated-item-det-details-section">
          <img
            src={itemData.imageurl || "https://via.placeholder.com/300"}
            alt="Item"
            className="updated-item-det-product-image"
          />
          <div className="updated-item-det-details">
            <h2>{itemData.item_name}</h2>
            <p className="updated-item-det-price">
              Rp {itemData.price.toLocaleString()}
            </p>
            <p>Stock : {itemData.amount}</p>
            <div className="updated-item-det-description">
              {itemData.description.split("\n").map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </main>
      <aside className="updated-item-det-order-section">
        <div className="updated-item-det-quantity">
          <button onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>
            -
          </button>
          <input
            type="integer"
            min="1"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value) || 1))
            }
          />
          <button onClick={() => setQuantity((prev) => prev + 1)}>+</button>
        </div>
        <p className="updated-item-det-total-price">
          Total: Rp {(itemData.price * quantity).toLocaleString()}
        </p>
        <button
          onClick={handleCreateOrder}
          className="updated-item-det-order-button"
        >
          Order Now
        </button>
      </aside>
      <footer className="updated-item-det-contact">
        <img
          src={itemData.seller_image || "https://via.placeholder.com/80"}
          alt="Seller"
          className="updated-item-det-contact-avatar"
        />
        <div>
          <p>
            {itemData.firstname} {itemData.surname}
          </p>
          <p>{itemData.seller_email}</p>
          <p>{itemData.seller_phone}</p>
          <p>
            {itemData.seller_address}, {itemData.district},{" "}
            {itemData.seller_city}, {itemData.seller_country}
          </p>
        </div>
        <div className="updated-item-det-chat-icon" >
        <FaCommentAlt onClick={handleChatSeller} />
        </div>
      </footer>
    </div>
  );
};

export default ItemDetailPage;