import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiChat, apiAccount } from "../api";
import "./ChatRoom.css";

const ChatRoom = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [userNames, setUserNames] = useState({}); // Map untuk menyimpan nama pengguna berdasarkan ID
  const navigate = useNavigate();
  const firstId = localStorage.getItem("firstAccountId");

  useEffect(() => {
    // Ambil daftar chatroom
  fetch(`${apiChat}/u/${firstId}`)
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
      })
      .catch((error) => {
        console.error("Error fetching chatrooms:", error);
      });
  }, []);

  // Fungsi untuk mengambil nama pengguna berdasarkan ID
  const fetchUserNames = async (userIds) => {
    const namesMap = {};
    for (const id of userIds) {
      try {
        const response = await fetch(`${apiAccount}/${id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            const { firstname, surname } = data.data;
            namesMap[id] = `${firstname} ${surname}`;
          } else {
            namesMap[id] = "Unknown User";
          }
        } else {
          namesMap[id] = "Unknown User";
        }
      } catch (error) {
        console.error(`Error fetching user for ID ${id}:`, error);
        namesMap[id] = "Unknown User";
      }
    }
    return namesMap;
  };

  const handleChatRoomClick = (chatroomId) => {
    navigate(`/chat/${chatroomId}`); // Navigasi ke halaman Chat
  };

  return (
    <div className="chatroom-container">
      <div className="chatroom-header">
        <h2>Chat Rooms</h2>
        <button className="chatroom-home-button" onClick={() => navigate("/")}>
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