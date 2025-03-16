"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [coupons, setCoupons] = useState([]);
  const [newCode, setNewCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch coupons when the session is available
  useEffect(() => {
    if (session) fetchCoupons();
  }, [session]);

  // Fetch all coupons
  async function fetchCoupons() {
    try {
      const res = await fetch("/api/admin");
      if (!res.ok) throw new Error("Failed to fetch coupons");
      const data = await res.json();
      setCoupons(data);
    } catch (err) {
      setError(err.message);
    }
  }

  // Add a new coupon
  async function addCoupon() {
    if (!newCode.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: newCode }),
      });

      if (!res.ok) throw new Error("Failed to add coupon");

      setNewCode("");
      fetchCoupons();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Toggle coupon availability
  async function toggleCoupon(id, available) {
    try {
      const res = await fetch("/api/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, available: !available }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update coupon");
      }

      fetchCoupons();
    } catch (err) {
      setError(err.message);
    }
  }

  // Delete a coupon
  async function deleteCoupon(id) {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this coupon?"
    );
    if (!isConfirmed) return;

    try {
      const res = await fetch("/api/admin", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Failed to delete coupon");

      fetchCoupons();
    } catch (err) {
      setError(err.message);
    }
  }

  // Show loading state
  if (status === "loading") return <p>Loading...</p>;

  // Show login page if not authenticated
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        <button
          onClick={() => signIn()}
          className="px-4 py-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600 transition"
        >
          Sign in
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">
          Admin Dashboard
        </h1>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
        >
          Sign Out
        </button>
      </div>

      {/* Coupon Input */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          value={newCode}
          onChange={(e) => setNewCode(e.target.value)}
          placeholder="Enter coupon code"
          className="border p-3 rounded-lg w-full md:w-2/3 focus:ring-2 focus:ring-indigo-500 outline-none"
          onKeyDown={(e) => e.key === "Enter" && addCoupon()}
        />
        <button
          onClick={addCoupon}
          disabled={loading}
          className="px-4 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 disabled:opacity-50 w-full md:w-1/3"
        >
          {loading ? "Adding..." : "Add Coupon"}
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Coupons List */}
      <div className="grid gap-4 md:grid-cols-2">
        {coupons.map((c) => (
          <div
            key={c._id}
            className="p-4 border rounded-lg shadow-lg bg-white hover:shadow-xl transition"
          >
            <p className="text-lg font-semibold text-gray-900">{c.code}</p>
            <p className="text-sm mt-1">
              <span className={c.claimed ? "text-red-500" : "text-green-600"}>
                {c.claimed ? "Claimed" : "Available"}
              </span>
              {" | "}
              <span
                className={c.available ? "text-green-600" : "text-gray-500"}
              >
                {c.available ? "Enabled" : "Disabled"}
              </span>
            </p>
            {c.claimedBy && (
              <p className="text-sm text-gray-500">Claimed by: {c.claimedBy}</p>
            )}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => toggleCoupon(c._id, c.available)}
                className={`px-3 py-1 text-white rounded-md transition ${
                  c.available
                    ? "bg-gray-600 hover:bg-gray-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {c.available ? "Disable" : "Enable"}
              </button>
              <button
                onClick={() => deleteCoupon(c._id)}
                className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
