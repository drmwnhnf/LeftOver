import React, { useState } from "react";
import "./AuthPage.css";
import { useNavigate } from "react-router-dom";
import { apiAccount } from "../api";

const VerifyPage = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  // Ambil accountId dari localStorage
  const accountId = localStorage.getItem("verifid");
  if (!accountId) {
    navigate("/register");
    return null; // Hentikan render jika tidak ada accountId
  }

  const handleVerify = async () => {
    try {
      const response = await fetch(
        `${apiAccount}/verification/${accountId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            verificationCode: verificationCode,
          }),
        }
      );

      const data = await response.json();
      setSuccess(data.success);
      setMessage(data.message);

      if (data.success) {
        // Hapus accountId dari localStorage setelah verifikasi berhasil
        localStorage.removeItem("verifid");
        navigate("/login");
      } else {
        // Jika gagal, minta ulang kode verifikasi
        const retryResponse = await fetch(
          `${apiAccount}/verification/request`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              accountId: accountId,
            }),
          }
        );

        const retryData = await retryResponse.json();
        setMessage(
          retryData.message ||
            "Verification failed. A new code has been sent to your email."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong! Please try again.");
      setSuccess(false);
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-card">
        <h1 className="logo">Verify Your Account</h1>
        <p>
          Please enter the verification code sent to your email to verify your
          account.
        </p>
        <input
          type="text"
          className="code-input"
          placeholder="Enter verification code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
        <button className="verify-button" onClick={handleVerify}>
          VERIFY
        </button>
        {message && (
          <p className={`message ${success ? "success" : "error"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyPage;