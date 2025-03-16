"use client";
import { useState } from "react";

export default function ClaimButton() {
  const [message, setMessage] = useState("");

  async function claimCoupon() {
    const res = await fetch("/api/claim", { method: "POST" });
    const data = await res.json();
    setMessage(data.message);
  }

  return (
    <div>
      <button onClick={claimCoupon} className="px-4 py-2 bg-blue-500 text-white rounded">
        Claim Coupon
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
