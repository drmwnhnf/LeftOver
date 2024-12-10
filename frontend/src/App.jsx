import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import AccountPage from "./pages/AccountPage";
import SearchPage from "./pages/SearchPage";
import AuthPage from "./pages/AuthPage";
import ItemDetailPage from "./pages/ItemDetailPage";
import OrderPage from "./pages/OrderPage";
import ChatRoom from "./pages/ChatRoom";
import Chat from "./pages/Chat";
import SellerItem from "./pages/SellerItem";
import OrderDetail from "./pages/OrderDetail";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register/verify/:accountid" element={<AuthPage />} />
      <Route path="/chat" element={<ChatRoom />} />
      <Route path="/chat/:chatroomId" element={<Chat />} />
      <Route path="/profile/:accountid" element={<AccountPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/item/:itemid" element={<ItemDetailPage />} />
      <Route path="/order/:accountid" element={<OrderPage />} />
      <Route path="/myitems/:accountid" element={<SellerItem />} />
      <Route path="/orderdetails/:orderId" element={<OrderDetail />} />
    </Routes>
  </Router>
);

export default App;
