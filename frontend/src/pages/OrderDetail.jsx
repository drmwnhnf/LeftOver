import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./OrderDetail.css";

const OrderDetail = () => {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [itemData, setItemData] = useState(null);
  const [accountId, setAccountId] = useState(localStorage.getItem("accountid"));
  const [isSeller, setIsSeller] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderCodeInput, setOrderCodeInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderResponse = await axios.get(
          `http://localhost:8000/order/id/${orderId}`
        );
        if (orderResponse.data.success) {
          const order = orderResponse.data.data;
          setOrderData(order);
          setIsSeller(order.sellerid === accountId);

          // Fetch item details
          const itemResponse = await axios.get(
            `http://localhost:8000/item/${order.itemid}`
          );
          if (itemResponse.data.success) {
            setItemData(itemResponse.data.data);
          } else {
            setError("Item details not found.");
          }
        } else {
          setError("Order not found.");
        }
      } catch (err) {
        setError("Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, accountId]);

  const handleCancelOrder = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/order/cancel/${orderId}`
      );
      if (response.data.success) {
        alert("Order canceled successfully.");
        navigate(0); // Reload the page to update the state
      } else {
        alert(response.data.message || "Failed to cancel order.");
      }
    } catch (error) {
      console.error("Error canceling order:", error);
      alert("An error occurred while canceling the order.");
    }
  };

  const handleAcceptOrder = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/order/accept/${orderId}`
      );
      if (response.data.success) {
        alert("Order accepted successfully.");
        navigate(0); // Reload the page to update the state
      } else {
        alert(response.data.message || "Failed to accept order.");
      }
    } catch (error) {
      console.error("Error accepting order:", error);
      alert("An error occurred while accepting the order.");
    }
  };

  const handleCompleteOrder = async () => {
    if (!orderCodeInput.trim()) {
      alert("Please enter the order code to complete the order.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/order/finish/${orderId}`,
        {
          orderCode: orderCodeInput,
        }
      );
      if (response.data.success) {
        alert("Order completed successfully.");
        navigate("/order");
      } else {
        alert(response.data.message || "Failed to complete order.");
      }
    } catch (error) {
      console.error("Error completing order:", error);
      alert("An error occurred while completing the order.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const renderButtons = () => {
    if (orderData.status === "CANCELED" || orderData.status === "DONE") {
      return null; // No buttons for canceled or done orders
    }

    if (isSeller) {
      if (orderData.status === "WAITING") {
        return (
          <div className="actions">
            <button className="btn cancel" onClick={handleCancelOrder}>
              Cancel Order
            </button>
            <button className="btn accept" onClick={handleAcceptOrder}>
              Accept Order
            </button>
          </div>
        );
      } else if (orderData.status === "ONGOING") {
        return (
          <div className="actions">
            <button className="btn cancel" onClick={handleCancelOrder}>
              Cancel Order
            </button>
          </div>
        );
      }
    } else {
      if (orderData.status === "WAITING") {
        return (
          <div className="actions">
            <button className="btn cancel" onClick={handleCancelOrder}>
              Cancel Order
            </button>
          </div>
        );
      } else if (orderData.status === "ONGOING") {
        return (
          <div className="actions">
            <input
              type="password" // Menggunakan input password agar kode order tidak terlihat
              placeholder="Enter Order Code"
              value={orderCodeInput}
              onChange={(e) => setOrderCodeInput(e.target.value)}
            />
            <button className="btn complete" onClick={handleCompleteOrder}>
              Complete Order
            </button>
            <button className="btn cancel" onClick={handleCancelOrder}>
              Cancel Order
            </button>
          </div>
        );
      }
    }
  };

  return (
    <div className="order-details-container">
      <h1>Order Details</h1>
      <div className="order-card">
        <img
          src={itemData?.imageurl || "https://via.placeholder.com/200"}
          alt={itemData?.item_name || "Order Item"}
          className="order-image"
        />
        <div className="order-info">
          <h2>{itemData?.item_name || "Item Name"}</h2>
          <p>Quantity: {orderData.quantity}</p>
          <p>Total Price: Rp {orderData.totalprice.toLocaleString()}</p>
          <p>Status: {orderData.status}</p>
          {orderData.status === "ONGOING" && isSeller && (
            <p>Order Code: {orderData.ordercode}</p>
          )}
        </div>
      </div>
      {renderButtons()}
    </div>
  );
};

export default OrderDetail;
