import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Chat.css";

function Chat() {
  const { chatroomId } = useParams(); // Ambil chatroomId dari URL
  const [chatBubbles, setChatBubbles] = useState([]); // Bubble chat
  const [newMessage, setNewMessage] = useState(""); // Pesan baru
  const senderId = localStorage.getItem("firstAccountId"); // ID pengirim dari localStorage

  useEffect(() => {
    // Ambil bubble chat dari API saat komponen dimuat
    fetch(`https://backend-beta-beryl.vercel.app/chat/r/${chatroomId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setChatBubbles(data.data); // Set bubble chat ke state
        } else {
          console.error("Failed to fetch chat bubbles:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching chat bubbles:", error);
      });
  }, [chatroomId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return; // Jangan kirim pesan kosong

    try {
      const response = await fetch(
        `https://backend-beta-beryl.vercel.app/chat/w/${chatroomId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            senderId,
            chatContentType: "WORDS",
            chatContent: newMessage,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setChatBubbles([...chatBubbles, data.data]); // Tambahkan pesan baru ke bubble chat
        setNewMessage(""); // Kosongkan input
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat</h2>
        <button className="back-button" onClick={() => window.history.back()}>
          Back
        </button>
      </div>
      <div className="chat-messages">
        {chatBubbles.map((bubble, index) => (
          <div
            key={index}
            className={`chat-bubble ${
              bubble.senderid === senderId ? "own-bubble" : "other-bubble"
            }`}
          >
            {bubble.chatcontent}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
