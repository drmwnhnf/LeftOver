import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaRocketchat,
  FaUserCircle,
  FaShoppingBasket,
  FaSignOutAlt,
  FaSignInAlt,
  FaCommentAlt,
  FaHouseUser,
} from "react-icons/fa";
import "./ItemDetailPage.css";

const ItemDetailPage = () => {
  const [itemData, setItemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accountId, setAccountId] = useState(null);
  const { itemid } = useParams(); // Mengambil itemId dari URL
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Cek status login
    const storedAccountId = localStorage.getItem("accountid");
    if (storedAccountId) {
      setIsLoggedIn(true);
      setAccountId(storedAccountId);
      console.log("Logged in as accountid:", storedAccountId);
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

        console.log("Item Response:", itemResponse.data);

        if (itemResponse.data.success) {
          const itemData = itemResponse.data.data;
          setItemData(itemData);
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

  console.log("quantity:", quantity);

  // Handler order
  const handleCreateOrder = async () => {
    if (!isLoggedIn) {
      alert("Silakan login terlebih dahulu untuk melakukan order");
      navigate("/login");
      return;
    }

    try {
      const orderPayload = {
        itemid: itemData.itemid,
        sellerid: itemData.sellerid,
        buyerid: localStorage.getItem("accountid"),
        quantity: quantity,
      };

      const response = await axios.post(
        "http://localhost:8000/order/create",
        orderPayload
      );

      if (response.data.success) {
        alert("Order berhasil dibuat!");
        console.log("Order Data:", response.data.data);
        navigate("/order");
      } else {
        alert(response.data.message || "Gagal membuat order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Terjadi kesalahan saat membuat order. Silakan coba lagi.");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Simpan query pencarian di localStorage
      localStorage.setItem("searchQuery", searchQuery);
      // Navigate ke halaman search
      navigate("/search");
    }
  };

  const handleChatSeller = async () => {
    if (!isLoggedIn) {
      alert("Silakan login terlebih dahulu untuk memulai chat dengan penjual.");
      navigate("/login");
      return;
    }

    try {
      // Kirim permintaan untuk membuat chatroom
      const response = await axios.post("http://localhost:8000/chat/start", {
        firstAccountId: accountId, // ID akun pembeli
        secondAccountId: itemData.sellerid, // ID akun penjual
      });

      if (response.data.success) {
        const chatroomId = response.data.data.chatroomid;
        console.log("Chatroom created:", chatroomId);
        localStorage.setItem("firstAccountId", accountId);
        localStorage.setItem("secondAccountId", itemData.sellerid);
        // Arahkan ke halaman chat
        navigate(`/chat/${chatroomId}`);
      } else {
        alert(response.data.message || "Gagal memulai chat.");
      }
    } catch (error) {
      console.error("Error starting chat:", error);
      alert("Terjadi kesalahan saat memulai chat. Silakan coba lagi.");
    }
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
              <button className="icon" onClick={() => handleNavigate("/")}>
                <FaHouseUser />
              </button>
              <button className="icon" onClick={() => handleNavigate("/order")}>
                <FaShoppingBasket />
              </button>
              <button
                className="icon"
                onClick={() => Navigate(`/profile/${accountId}`)}
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
        <div className="location"></div>

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
                <input
                  type="number"
                  value={quantity}
                  min="1"
                  max={itemData.amount} // Batas maksimum sesuai stok
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    setQuantity(isNaN(value) ? 1 : Math.max(1, value)); // Validasi untuk memastikan nilai minimal 1
                  }}
                />
              </div>
              <div className="sub-total">
                Subtotal: Rp {(itemData.price * quantity).toLocaleString()}
              </div>
              <button
                className="order-button"
                onClick={handleCreateOrder}
                disabled={itemData.amount < quantity || quantity < 1} // Cek stok dan validasi nilai
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
          <p>
            Address:{" "}
            {itemData.seller_address +
              " " +
              itemData.district +
              " " +
              itemData.seller_city +
              " " +
              itemData.seller_country || "penjual belum menambahkan alamat"}
          </p>
          <p>
            Phone :{" "}
            {itemData.seller_phone || "penjual belum menambahkan nomor telepon"}
          </p>
        </div>
        <div className="icons">
          <div className="icon" onClick={handleChatSeller}>
            <FaCommentAlt />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPage;
