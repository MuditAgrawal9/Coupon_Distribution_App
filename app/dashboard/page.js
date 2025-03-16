"use client";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [coupons, setCoupons] = useState([]);
  const [newCode, setNewCode] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCoupons();
  }, []);

  async function fetchCoupons() {
    const res = await fetch("/api/admin");
    const data = await res.json();
    setCoupons(data);
  }

  async function addCoupon() {
    if (!newCode.trim()) return;
    
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: newCode }),
    });

    const result = await res.json();
    setMessage(result.message);
    setNewCode("");

    fetchCoupons(); // Refresh the list
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Admin Dashboard</h1>
      
      <div className="bg-white shadow-lg p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add New Coupon</h2>
        <div className="flex gap-2">
          <input
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            placeholder="Enter Coupon Code"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            onClick={addCoupon}
          >
            Add
          </button>
        </div>
        {message && <p className="mt-2 text-green-600">{message}</p>}
      </div>

      <div className="mt-8 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Coupons List</h2>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full text-left">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-2 px-4">Code</th>
                <th className="py-2 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length > 0 ? (
                coupons.map((c) => (
                  <tr key={c._id} className="border-b">
                    <td className="py-2 px-4">{c.code}</td>
                    <td className="py-2 px-4">
                      {c.claimed ? (
                        <span className="text-red-500 font-semibold">Claimed</span>
                      ) : (
                        <span className="text-green-500 font-semibold">Available</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-2 px-4 text-center" colSpan="2">
                    No Coupons Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
