import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import AccountPage from "./pages/AccountPage";
import SearchPage from "./pages/SearchPage";
import AuthPage from "./pages/AuthPage";
import ItemDetailPage from "./pages/ItemDetailPage";

const App = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register/verify" element={<AuthPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/profile" element={<AccountPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/item/:itemid" element={<ItemDetailPage />} />
    </Routes>
  </Router>
);

export default App;
