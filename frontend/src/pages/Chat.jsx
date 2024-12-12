import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Chat.css";

function Chat() {
  const { chatroomId } = useParams();
  const [chatBubbles, setChatBubbles] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatPartnerName, setChatPartnerName] = useState("Loading...");
  const senderId = localStorage.getItem("firstAccountId");

  useEffect(() => {
    // Fetch data chatroom untuk mendapatkan nama lawan bicara
    const fetchChatPartnerName = async () => {
      try {
        const res = await fetch(`http://localhost:8000/chat/u/${senderId}`);
        const data = await res.json();
        if (data.success) {
          // Cari chatroom yang cocok
          const chatroom = data.data.find(
            (room) => room.chatroomid === chatroomId
          );

          if (chatroom) {
            const chatPartnerId =
              chatroom.firstaccountid === senderId
                ? chatroom.secondaccountid
                : chatroom.firstaccountid;

            // Ambil nama lawan bicara
            const userRes = await fetch(
              `http://localhost:8000/account/${chatPartnerId}`
            );
            const userData = await userRes.json();
            if (userData.success) {
              setChatPartnerName(
                `${userData.data.firstname} ${userData.data.surname}`
              );
            } else {
              setChatPartnerName("Unknown User");
            }
          }
        }
      } catch (error) {
        console.error("Error fetching chat partner name:", error);
        setChatPartnerName("Unknown User");
      }
    };

    fetchChatPartnerName();
  }, [chatroomId, senderId]);

  useEffect(() => {
    // Fetch awal data chat
    const fetchChats = async () => {
      try {
        const res = await fetch(`http://localhost:8000/chat/r/${chatroomId}`);
        const data = await res.json();
        if (data.success) {
          setChatBubbles(data.data);
        }
      } catch (error) {
        console.error("Error fetching chat bubbles:", error);
      }
    };

    // Jalankan fetch pertama kali
    fetchChats();

    // Polling setiap 5 detik untuk mendapatkan pesan baru
    const intervalId = setInterval(fetchChats, 5000);

    // Bersihkan interval saat komponen dilepas
    return () => clearInterval(intervalId);
  }, [chatroomId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    try {
      const response = await fetch(
        `http://localhost:8000/chat/w/${chatroomId}`,
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
        setChatBubbles((prev) => [...prev, data.data]); // Tambahkan pesan ke state
        setNewMessage(""); // Kosongkan input
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Fungsi untuk memformat waktu ke format Indonesia tanpa detik
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>{chatPartnerName}</h2>
        <button
          className="chat-back-button"
          onClick={() => window.history.back()}
        >
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
            <div className="chat-timestamp">{formatTime(bubble.sentat)}</div>
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