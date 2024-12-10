import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatRoom.css";

const ChatRoom = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [userNames, setUserNames] = useState({}); // Map untuk menyimpan nama pengguna berdasarkan ID
  const navigate = useNavigate();
  const firstId = localStorage.getItem("firstAccountId");

  useEffect(() => {
    // Ambil daftar chatroom
    fetch(`http://localhost:8000/chat/u/${firstId}`)
      .then((res) => res.json())
      .then(async (data) => {
        if (data.success) {
          setChatRooms(data.data);

          // Ambil nama lawan bicara berdasarkan ID
          const uniqueIds = [
            ...new Set(
              data.data.flatMap((room) => [
                room.firstaccountid,
                room.secondaccountid,
              ])
            ),
          ];
          const names = await fetchUserNames(uniqueIds);
          setUserNames(names);
        }
      });
  }, []);

  // Fungsi untuk mengambil nama pengguna berdasarkan ID
  const fetchUserNames = async (userIds) => {
    const namesMap = {};
    for (const id of userIds) {
      try {
        const response = await fetch(`http://localhost:8000/account/${id}`);
        const data = await response.json();
        if (data.success) {
          const { firstname, surname } = data.data;
          namesMap[id] = `${firstname} ${surname}`; // Gabungkan firstName dan surname
        } else {
          namesMap[id] = "Unknown User";
        }
      } catch (error) {
        namesMap[id] = "Unknown User";
        console.error(`Error fetching name for user ID ${id}:`, error);
      }
    }
    return namesMap;
  };

  const handleChatRoomClick = (chatroomId) => {
    fetch(`http://localhost:8000/chat/r/${chatroomId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem("chatBubbles", JSON.stringify(data.data)); // Simpan bubble chat di localStorage
          navigate(`/chat/${chatroomId}`); // Navigasi ke halaman Chat
          console.log("Your Data :", data.data); // Debug log
        }
      });
  };

  return (
    <div className="chatroom-container">
      <div className="chatroom-header">
        <h2>Chat Rooms</h2>
        <button className="home-button" onClick={() => navigate("/")}>
          Home
        </button>
      </div>
      <ul className="chatroom-list">
        {chatRooms.map((room) => {
          // Tentukan siapa lawan bicara
          const chatPartnerId =
            room.firstaccountid === firstId
              ? room.secondaccountid
              : room.firstaccountid;
          return (
            <li
              key={room.chatroomid}
              className="chatroom-item"
              onClick={() => handleChatRoomClick(room.chatroomid)}
            >
              Chat with {userNames[chatPartnerId] || "Loading..."}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ChatRoom;
