// self-care-app\src\app\shop\page.tsx

// self-care-app\src\app\shop\page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const Shop = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const getMe = useQuery(api.users.getMe);
  const buyGift = useMutation(api.users.buyGift);

  const handleBuyGift = async () => {
    if (!getMe) return;

    setLoading(true);
    setMessage(null);

    try {
      const giftUrl = await buyGift({
        tokenIdentifier: getMe.tokenIdentifier,
        cost: 10, // Set the cost of the gift here
      });

      setMessage(`Congratulations! You received a gift: ${giftUrl}`);
    } catch (error: any) {
      setMessage(error.message || "An error occurred while buying the gift.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-24">
      <h1 className="text-2xl font-bold mb-4">Shop</h1>
      {getMe ? (
        <div className="text-center">
          <p className="mb-4">Points: {getMe.points}</p>
          <button
            onClick={handleBuyGift}
            disabled={loading || (getMe.points ?? 0) < 10}
            className={`px-6 py-3 rounded-md text-white ${
              loading || (getMe.points ?? 0) < 10
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Processing..." : "Buy Gift (10 Points)"}
          </button>
          {message && (
            <p className="mt-4 text-sm text-green-500">
              {message.startsWith("Congratulations")
                ? <a href={message.split(" ").pop()} target="_blank" rel="noopener noreferrer">View Gift</a>
                : message}
            </p>
          )}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Shop;
