"use client";
import { useState } from "react";

export default function ClaimCoupon() {
  const [message, setMessage] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(false);

  async function claimCoupon() {
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/claim", { method: "POST" });
    const data = await res.json();

    if (res.ok) {
      setCoupon(data.coupon);
      setMessage(data.message);
    } else {
      setMessage(data.message || "Something went wrong.");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-xl p-6 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800">🎟️ Claim Your Coupon</h1>
        <p className="text-gray-600 mt-2">Click the button to claim a unique coupon.</p>

        <button
          onClick={claimCoupon}
          disabled={loading}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Claiming..." : "Claim Coupon"}
        </button>

        {message && (
          <div className="mt-4 p-3 text-sm rounded-lg bg-gray-100 text-gray-800">
            {message}
          </div>
        )}

        {coupon && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg font-semibold">
            🎉 Your Coupon Code: <span className="text-xl">{coupon.code}</span>
          </div>
        )}
      </div>
    </div>
  );
}
